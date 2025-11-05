import { DataView } from 'primereact/dataview';
import { useAuth0 } from '@auth0/auth0-react';
import { Movie } from '../../models/movies/movie';
import MovieGridItem from './MovieGridItem';
import * as movieService from '../../services/movie-service';
import { useContext } from 'react';
import { ToastContext } from '../../App';
import MoviesGridSkeleton from './MoviesGridSkeleton';

export default function MoviesGrid({movies, totalRecords, currentPage, isLoading, onPageChange}: {movies: Movie[], totalRecords: number, currentPage: number, isLoading: boolean, onPageChange: Function}) {
	const { getAccessTokenSilently} = useAuth0();
	const toast = useContext(ToastContext);

	const handleToggleFavorite = async (movie: Movie) => {
		// Update Redux store optimistically
		const token = await getAccessTokenSilently();
		const updatedMovie = { ...movie, isFavorite: !movie.isFavorite };

		// Sync with backend
		try {

			if (updatedMovie.isFavorite) {
				// Add to favorites - first fetch full movie details
				const movieDetailsService = movieService.getMovieById();
				const movieDetailsResponse = await movieDetailsService(movie.imdbID, token);

				if (movieDetailsResponse.success && movieDetailsResponse.data) {
					const details = movieDetailsResponse.data;
					const markService = movieService.markAsFavorite();
					await markService(token, {
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
					});

					toast?.current?.show({
						severity: 'success',
						summary: 'Added to Favorites',
						detail: `${movie.title} has been added to your favorites!`,
						life: 3000
					});
				}
			} else {
				// Remove from favorites
				// First, get the backend favorite ID
				const getFavoritesService = movieService.getFavoriteMovies();
				const favoritesResponse = await getFavoritesService(token);

				if (favoritesResponse.success && favoritesResponse.data) {
					const favorite = favoritesResponse.data.find(
						(fav: any) => fav.imdbId === movie.imdbID
					);

					if (favorite) {
						const deleteService = movieService.deleteFavorite();
						await deleteService(favorite.id, token);

						toast?.current?.show({
							severity: 'info',
							summary: 'Removed from Favorites',
							detail: `${movie.title} has been removed from your favorites.`,
							life: 3000
						});
					}
				}
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
