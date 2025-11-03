import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Movie } from '../../models/movies/movie';

interface MovieGridItemProps {
	movie: Movie;
	onToggleFavorite?: (movie: Movie) => void;
}

export default function MovieGridItem({ movie, onToggleFavorite }: MovieGridItemProps) {
	const handleToggleFavorite = () => {
		if (onToggleFavorite) {
			onToggleFavorite(movie);
		}
	};

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
				icon={movie.isFavorite ? "pi pi-heart-fill" : "pi pi-heart"}
				label={movie.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
				className="p-button-rounded"
				onClick={handleToggleFavorite}
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
	)
}
