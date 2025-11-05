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

	return (
		<div className="dataview-demo">
			{isLoading ? (
				<MoviesGridSkeleton />
			) : (
				<DataView
					value={movies}
					layout={'grid'}
					itemTemplate={itemTemplate}
					lazy
					paginator
					rows={10}
					totalRecords={totalRecords}
					emptyMessage="No movies found"
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
