import { Panel } from 'primereact/panel';
import { DataView } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectFavoriteMovies, setFavoriteMovie, setFavoriteMovies } from '../store/movie/movie-slice';
import { Movie } from '../models/movies/movie';
import { MovieType } from '../enums/movie-type';
import * as movieService from '../services/movie-service';

export default function FavoriteMovie() {
	const dispatch = useAppDispatch();
	const favoriteMovies = useAppSelector(selectFavoriteMovies);
	const { getAccessTokenSilently } = useAuth0();
	const [isLoading, setIsLoading] = useState(false);

	// Fetch favorites from backend on component mount
	useEffect(() => {
		const fetchFavorites = async () => {
			setIsLoading(true);
			try {
				const token = await getAccessTokenSilently();
				const getFavoritesService = movieService.getFavoriteMovies();
				const response = await getFavoritesService(token);

				if (response.success && response.data) {
					// Convert backend favorites to Movie format
					const movies: Movie[] = response.data.map((fav: any) => ({
						imdbID: fav.imdbId,
						title: fav.title,
						year: parseInt(fav.year),
						poster: fav.poster,
						type: MovieType.Movie,
						isFavorite: true
					}));
					dispatch(setFavoriteMovies(movies));
				}
			} catch (error) {
				console.error('Failed to fetch favorites:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFavorites();
	}, [dispatch, getAccessTokenSilently]);

	const handleRemoveFavorite = async (movie: Movie) => {
		// Remove from Redux store optimistically
		const updatedMovie = { ...movie, isFavorite: false };
		dispatch(setFavoriteMovie(updatedMovie));

		// Sync with backend
		try {
			const token = await getAccessTokenSilently();
			const getFavoritesService = movieService.getFavoriteMovies();
			const response = await getFavoritesService(token);

			if (response.success && response.data) {
				const favorite = response.data.find((fav: any) => fav.imdbId === movie.imdbID);
				if (favorite) {
					const deleteService = movieService.deleteFavorite();
					await deleteService(favorite.id, token);
				}
			}
		} catch (error) {
			console.error('Failed to remove favorite from backend:', error);
			// Revert the optimistic update on error
			dispatch(setFavoriteMovie({ ...movie, isFavorite: true }));
		}
	};

	const itemTemplate = (movie: Movie) => {
		const header = (
			<img
				alt={movie.title}
				src={movie.poster !== 'N/A' ? movie.poster : 'https://via.placeholder.com/300x450?text=No+Image'}
				style={{ width: '100%', height: '450px', objectFit: 'cover' }}
			/>
		);

		const footer = (
			<div className="flex justify-content-center">
				<Button
					icon="pi pi-heart-fill"
					label="Remove from Favorites"
					className="p-button-rounded p-button-danger"
					onClick={() => handleRemoveFavorite(movie)}
				/>
			</div>
		);

		return (
			<div className="col-12 md:col-6 lg:col-4">
				<Card
					title={movie.title}
					subTitle={`${movie.year} • ${movie.type}`}
					footer={footer}
					header={header}
					className="movie-card"
				>
					<p className="m-0">IMDb ID: {movie.imdbID}</p>
				</Card>
			</div>
		);
	};

	const emptyTemplate = () => {
		return (
			<div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
				<i className="pi pi-heart" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
				<h3>No Favorite Movies Yet</h3>
				<p>Start adding movies to your favorites to see them here!</p>
			</div>
		);
	};

	return (
		<div>
			<Panel header={`My Favorite Movies (${favoriteMovies.length})`}>
				<div className="dataview-demo">
					<div className="card">
						{favoriteMovies.length === 0 ? (
							emptyTemplate()
						) : (
							<DataView
								value={favoriteMovies}
								layout={'grid'}
								itemTemplate={itemTemplate}
								paginator
								rows={9}
							/>
						)}
					</div>
				</div>
			</Panel>
		</div>
	);
}
