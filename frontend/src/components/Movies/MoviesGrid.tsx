import { useState } from 'react';
import { DataView } from 'primereact/dataview';
import { useAuth0 } from '@auth0/auth0-react';
import { Movie } from '../../models/movies/movie';
import { useAppDispatch } from '../../store/hooks';
import { setFavoriteMovie } from '../../store/movie/movie-slice';
import MovieGridItem from './MovieGridItem';
import * as movieService from '../../services/movie-service';

export default function MoviesGrid({movies}: {movies: Movie[]}) {
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(false);
	const { getAccessTokenSilently } = useAuth0();

	const handleToggleFavorite = async (movie: Movie) => {
		// Update Redux store optimistically
		const updatedMovie = { ...movie, isFavorite: !movie.isFavorite };
		dispatch(setFavoriteMovie(updatedMovie));

		// Sync with backend
		try {
			const token = await getAccessTokenSilently();

			if (updatedMovie.isFavorite) {
				// Add to favorites - first fetch full movie details
				const movieDetailsService = movieService.getMovieById();
				const movieDetailsResponse = await movieDetailsService(movie.imdbID);

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
					}
				}
			}
		} catch (error) {
			console.error('Failed to sync favorite with backend:', error);
			// Revert the optimistic update on error
			dispatch(setFavoriteMovie(movie));
		}
	};

	const itemTemplate = (movie: Movie) => {
		return <MovieGridItem movie={movie} onToggleFavorite={handleToggleFavorite} />;
	};

	return (
		<div className="dataview-demo">
			<div className="card">
				<DataView
					value={movies}
					layout={'grid'}
					itemTemplate={itemTemplate}
					lazy
					paginator
					rows={10}
					totalRecords={movies.length}
					onPage={ () => {} }
					loading={ isLoading } />
			</div>
		</div>
	)
}
