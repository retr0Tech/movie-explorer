import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Movie } from "../../models/movies/movie";
import { Link } from "react-router-dom";
import noPosterImg from "../../no-poster.png";

interface MovieGridItemProps {
  movie: Movie;
  onToggleFavorite?: (movie: Movie) => void;
}

export default function MovieGridItem({
  movie,
  onToggleFavorite,
}: MovieGridItemProps) {
  const defaultImg = noPosterImg;
  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(movie);
    }
  };

  return (
    <Card
      className="movie-card"
      style={{
        border: "1px solid #dee2e6",
        borderRadius: "8px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="movie-card-header">
        <Link to={{ pathname: `` }} className="no-style">
          <h3
            className="p-card-title"
            style={{
              cursor: "pointer",
              outline: "none",
              marginBottom: "1rem",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            {movie.title}
          </h3>
        </Link>
      </div>
      <div className="movie-card-content" style={{ flex: 1 }}>
        <img
          onError={(e) => ((e.target as any).src = defaultImg)}
          src={movie.poster !== "N/A" ? movie.poster : defaultImg}
          alt={movie.title}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
        <div
          className="movie-description"
          style={{ marginTop: "0.75rem", color: "#6c757d" }}
        >
          {`${movie.year} • ${movie.type}`}
        </div>
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6c757d" }}>
          IMDb ID: {movie.imdbID}
        </p>
      </div>
      <div className="movie-card-footer" style={{ marginTop: "1rem" }}>
        <Button
          icon={movie.isFavorite ? "pi pi-heart-fill" : "pi pi-heart"}
          label={
            movie.isFavorite ? "Remove from Favorites" : "Add to Favorites"
          }
          severity={ movie.isFavorite ? "danger" : "info"}
          className="p-button-rounded"
          onClick={handleToggleFavorite}
          style={{ width: "100%" }}
        />
      </div>
    </Card>
  );
}
