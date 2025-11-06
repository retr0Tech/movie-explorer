import { DataView } from 'primereact/dataview';
import { useAuth0 } from '@auth0/auth0-react';
import { Movie } from '../../models/movies/movie';
import MovieGridItem from './MovieGridItem';
import * as movieService from '../../services/movie-service';
import { useContext } from 'react';
import { ToastContext } from '../../App';
import MoviesGridSkeleton from './MoviesGridSkeleton';
import { FavoriteMovie as FavoriteMovieModel } from '../../models/favorites/favorite-movie';
import { useAppDispatch } from '../../store/hooks';
import { getFavoriteMoviesAsync, setMovies } from '../../store/movie/movie-slice';
import { motion } from 'framer-motion';

export default function MoviesGrid({movies, totalRecords, currentPage, isLoading, onPageChange}: {movies: Movie[], totalRecords: number, currentPage: number, isLoading: boolean, onPageChange: Function}) {
	const { getAccessTokenSilently} = useAuth0();
	const dispatch = useAppDispatch();
	const toast = useContext(ToastContext);
	const setFavoriteMovie = movieService.markAsFavorite();
	const deleteFavoriteMovie = movieService.deleteFavorite();
	const getFavoriteMovieByImdbId = movieService.getFavoriteMovieByImdbId();

	const handleToggleFavorite = async (movie: Movie) => {
		// Update Redux store optimistically
		const token = await getAccessTokenSilently();
		// Sync with backend
		try {
			if (!movie.isFavorite) {
				// Add to favorites - first fetch full movie details
				const movieDetailsService = movieService.getMovieById();
				const movieDetailsResponse = await movieDetailsService(movie.imdbID, token);
				const details = movieDetailsResponse.data;
				await setFavoriteMovie(token, {
						imdbId: movie.imdbID,
						title: details.Title || movie.title,
						year: details.Year || movie.year.toString(),
						poster: details.Poster || movie.poster,
						genre: details.Genre || '',
						plot: details.Plot || '',
						imdbRating: details.imdbRating || '',
						director: details.Director || '',
						actors: details.Actors || '',
						runtime: details.Runtime || ''
					} as FavoriteMovieModel);

					toast?.current?.show({
						severity: 'success',
						summary: 'Added to Favorites',
						detail: `${movie.title} has been added to your favorites!`,
						life: 3000
					});
			} else {
				// Remove from favorites
				const favMovie = await getFavoriteMovieByImdbId(movie.imdbID, token);
				await deleteFavoriteMovie(favMovie.data.id, token);
				toast?.current?.show({
					severity: 'info',
					summary: 'Removed from Favorites',
					detail: `${movie.title} has been removed from your favorites.`,
					life: 3000
				});
			}
		} catch (error) {
			console.error('Failed to sync favorite with backend:', error);
			toast?.current?.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Failed to update favorites. Please try again.',
				life: 4000
			});
		}
		finally{
			await dispatch(getFavoriteMoviesAsync(token));
			await dispatch(setMovies(movies));
		}
	};

	const itemTemplate = (movie: Movie) => {
		const index = movies.findIndex(m => m.imdbID === movie.imdbID);
		return <MovieGridItem movie={movie} onToggleFavorite={handleToggleFavorite} index={index} />;
	};

	const emptyTemplate = () => {
		return (
			<motion.div
				className="flex flex-column align-items-center justify-content-center"
				style={{ minHeight: '400px', padding: '2rem' }}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				<motion.i
					className="pi pi-search"
					style={{ fontSize: '5rem', color: 'var(--text-tertiary)', marginBottom: '1.5rem', opacity: 0.5 }}
					animate={{
						scale: [1, 1.1, 1],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				></motion.i>
				<h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.5rem', textAlign: 'center' }}>No Movies Found</h2>
				<p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', textAlign: 'center', maxWidth: '400px', margin: '0 auto 0.5rem auto' }}>
					We couldn't find any movies matching your search.
				</p>
				<p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>
					Try searching with a different title or keyword.
				</p>
			</motion.div>
		);
	};

	return (
		<div className="dataview-demo">
			{isLoading ? (
				<MoviesGridSkeleton />
			) : movies.length === 0 ? (
				emptyTemplate()
			) : (
				<DataView
					value={movies}
					layout={'grid'}
					itemTemplate={itemTemplate}
					lazy
					paginator
					rows={10}
					totalRecords={totalRecords}
					onPage={(event) => {onPageChange(event)}}
					first={currentPage}
					className="movies-dataview"
				/>
			)}
			<style>{`
				.movies-dataview .p-dataview-content {
					background: transparent;
				}

				.movies-dataview .p-grid {
					display: grid;
					grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
					gap: 1.5rem;
					margin: 0;
				}

				.movies-dataview .p-col-12 {
					padding: 0;
					width: 100%;
				}

				@media (max-width: 768px) {
					.movies-dataview .p-grid {
						grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
						gap: 1rem;
					}
				}
			`}</style>
		</div>
	)
}
