import { Panel } from 'primereact/panel';
import { DataView } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectFavoriteMovies } from '../store/movie/movie-slice';
import { Movie } from '../models/movies/movie';
import { useEffect } from 'react';
import { getFavoriteMoviesAsync } from '../store/movie/movie-slice';
import * as movieService from '../services/movie-service';
import { useAuth0 } from '@auth0/auth0-react';

export default function FavoriteMovie() {
	const dispatch = useAppDispatch();
	const { getAccessTokenSilently, user} = useAuth0();
	const favoriteMovies = useAppSelector(selectFavoriteMovies);
	

	// Optional: Fetch favorites from backend on component mount
	// Uncomment when authentication/token is available
	useEffect(() => {
		getAccessTokenSilently().then(token => {
			dispatch(getFavoriteMoviesAsync(token));
		});
	}, [dispatch, getAccessTokenSilently]);

	const handleRemoveFavorite = async (movie: Movie) => {
		try {
			const token = await getAccessTokenSilently();
			const deleteService = movieService.deleteFavorite();
			await deleteService(movie.imdbID, token);
		} catch (error) {
			console.error('Failed to remove favorite from backend:', error);
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
							<><DataView
									value={favoriteMovies}
									layout={'grid'}
									itemTemplate={itemTemplate}
									lazy
									rows={5}
									className="movies-dataview" /><style>{`
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
							`}</style></>
						)}
					</div>
				</div>
			</Panel>
		</div>
	);
}
