import { Panel } from 'primereact/panel';
import { DataView } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAppDispatch } from '../../store/hooks';
import { FavoriteMovie as FavoriteMovieModel } from '../../models/favorites/favorite-movie';
import { UpdateFavorite } from '../../models/favorites/update-favorite-movie';
import { useEffect, useState, useContext, useCallback } from 'react';
import { getFavoriteMoviesAsync } from '../../store/movie/movie-slice';
import * as movieService from '../../services/movie-service';
import noPosterImg from "../../no-poster.png";
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';
import { ToastContext } from '../../App';
import EditFavoriteModal from './EditFavoriteModal';

export default function FavoriteMovie() {
	const dispatch = useAppDispatch();
	const { getAccessTokenSilently } = useAuth0();
	const toast = useContext(ToastContext);
	const [heartAnimate, setHeartAnimate] = useState<string | null>(null);
	const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({});
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [selectedMovie, setSelectedMovie] = useState<FavoriteMovieModel | null>(null);
	const [currentPage, setCurrentPage] = useState(0); // DataView uses 0-indexed pages
	const [totalRecords, setTotalRecords] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [displayedMovies, setDisplayedMovies] = useState<FavoriteMovieModel[]>([]);
	const getFavoriteMovieByImdbId = movieService.getFavoriteMovieByImdbId();
	const ITEMS_PER_PAGE = 8;

	const fetchFavorites = useCallback(async (page: number) => {
		try {
			setIsLoading(true);
			const token = await getAccessTokenSilently();
			const getFavoritesPaginated = movieService.getFavoriteMoviesPaginated();
			const response = await getFavoritesPaginated(token, page + 1, ITEMS_PER_PAGE, ''); // API uses 1-indexed pages

			if (response.success && response.data) {
				const movies: FavoriteMovieModel[] = response.data.data.map(fav => ({
					id: fav.id,
					userId: fav.userId,
					imdbId: fav.imdbId,
					title: fav.title,
					year: fav.year,
					poster: fav.poster,
					genre: fav.genre,
					plot: fav.plot,
					imdbRating: fav.imdbRating,
					director: fav.director,
					actors: fav.actors,
					runtime: fav.runtime,
					createdAt: fav.createdAt,
					updatedAt: fav.updatedAt
				}));
				setDisplayedMovies(movies);
				setTotalRecords(response.data.total);
			}
		} catch (error) {
			console.error('Failed to fetch favorites:', error);
			toast?.current?.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Failed to load favorites. Please try again.',
				life: 4000
			});
		} finally {
			setIsLoading(false);
		}
	}, [getAccessTokenSilently, toast]);

	// Fetch favorites on mount and when page changes
	useEffect(() => {
		fetchFavorites(currentPage);
	}, [currentPage, fetchFavorites]);

	// Also update Redux store for other components
	useEffect(() => {
		getAccessTokenSilently().then(token => {
			dispatch(getFavoriteMoviesAsync(token));
		});
	}, [dispatch, getAccessTokenSilently]);

	const handleRemoveFavorite = async (movie: FavoriteMovieModel) => {
		try {
			setHeartAnimate(movie.imdbId);
			setTimeout(() => setHeartAnimate(null), 500);

			const token = await getAccessTokenSilently();
			const deleteService = movieService.deleteFavorite();
			// Remove from favorites
			const favMovie = await getFavoriteMovieByImdbId(movie.imdbId, token);
			await deleteService(favMovie.data.id, token);

			toast?.current?.show({
				severity: 'info',
				summary: 'Removed from Favorites',
				detail: `${movie.title} has been removed from your favorites.`,
				life: 3000
			});

			// Refresh current page and Redux store
			await fetchFavorites(currentPage);
			dispatch(getFavoriteMoviesAsync(token));
		} catch (error) {
			console.error('Failed to remove favorite from backend:', error);
			toast?.current?.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Failed to remove from favorites. Please try again.',
				life: 4000
			});
		}
	};

	const handleEditClick = (movie: FavoriteMovieModel) => {
		setSelectedMovie(movie);
		setEditModalVisible(true);
	};

	const handleSaveEdit = async (id: string, updates: UpdateFavorite) => {
		try {
			const token = await getAccessTokenSilently();
			const updateService = movieService.updateFavorite();
			await updateService(token, id, updates);

			toast?.current?.show({
				severity: 'success',
				summary: 'Updated Successfully',
				detail: 'Favorite movie details have been updated.',
				life: 3000
			});

			// Refresh current page and Redux store
			await fetchFavorites(currentPage);
			dispatch(getFavoriteMoviesAsync(token));
		} catch (error) {
			console.error('Failed to update favorite:', error);
			toast?.current?.show({
				severity: 'error',
				summary: 'Error',
				detail: 'Failed to update favorite. Please try again.',
				life: 4000
			});
		}
	};

	const handlePageChange = (event: { page: number; first: number }) => {
		setCurrentPage(event.page);
	};

	const itemTemplate = (movie: FavoriteMovieModel) => {
		const index = displayedMovies.findIndex(m => m.imdbId === movie.imdbId);
		const imageLoaded = loadedImages[movie.imdbId] || false;

		const handleImageLoad = (imdbId: string) => {
			setLoadedImages(prev => ({ ...prev, [imdbId]: true }));
		};

		const header = (
			<div style={{ position: 'relative' }}>
				<img
					alt={movie.title}
					onError={(e) => ((e.target as any).src = noPosterImg)}
					src={movie.poster !== "N/A" ? movie.poster : noPosterImg}
					onLoad={() => handleImageLoad(movie.imdbId)}
					className={imageLoaded ? "blur-load loaded" : "blur-load"}
					style={{ width: '100%', height: '450px', objectFit: 'cover' }}
				/>
				<Button
					icon="pi pi-pencil"
					className="favorite-edit-btn"
					onClick={() => handleEditClick(movie)}
					severity="info"
					rounded
					aria-label="Edit"
				/>
			</div>
		);

		const footer = (
			<div className="flex justify-content-center">
				<Button
					icon="pi pi-heart-fill"
					label="Remove from Favorites"
					className={`p-button-rounded p-button-danger ${heartAnimate === movie.imdbId ? "heart-animate" : ""}`}
					onClick={() => handleRemoveFavorite(movie)}
					style={{ width: '100%' }}
				/>
			</div>
		);

		return (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.3,
					delay: index * 0.05,
					ease: "easeOut"
				}}
				className="col-12 md:col-6 lg:col-4 hover-lift"
			>
				<Card
					title={movie.title}
					subTitle={`${movie.year}${movie.genre ? ` • ${movie.genre}` : ''}`}
					footer={footer}
					header={header}
					className="movie-card glass-card"
					style={{
						borderRadius: "8px",
					}}
				>
					<p className="m-0">IMDb ID: {movie.imdbId}</p>
					{movie.imdbRating && <p className="m-0">Rating: {movie.imdbRating}</p>}
				</Card>
			</motion.div>
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
			<Panel header={`My Favorite Movies (${totalRecords})`}>
				<div className="dataview-demo">
					<div className="card">
						{isLoading && displayedMovies.length === 0 ? (
							<div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
								<i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem', color: 'var(--primary-500)' }}></i>
								<p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading favorites...</p>
							</div>
						) : totalRecords === 0 ? (
							emptyTemplate()
						) : (
							<><DataView
									value={displayedMovies}
									layout={'grid'}
									itemTemplate={itemTemplate}
									lazy
									paginator
									rows={ITEMS_PER_PAGE}
									totalRecords={totalRecords}
									first={currentPage * ITEMS_PER_PAGE}
									onPage={handlePageChange}
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

			<EditFavoriteModal
				visible={editModalVisible}
				movie={selectedMovie}
				onHide={() => setEditModalVisible(false)}
				onSave={handleSaveEdit}
			/>
		</div>
	);
}
