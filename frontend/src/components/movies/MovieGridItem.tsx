import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Movie } from "../../models/movies/movie";
import noPosterImg from "../../no-poster.png";
import { motion } from "framer-motion";
import { useState } from "react";
import MovieModal from "./MovieModal";

interface MovieGridItemProps {
  movie: Movie;
  onToggleFavorite?: (movie: Movie) => void;
  index?: number;
}

export default function MovieGridItem({
  movie,
  onToggleFavorite,
  index = 0,
}: MovieGridItemProps) {
  const defaultImg = noPosterImg;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heartAnimate, setHeartAnimate] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      setHeartAnimate(true);
      setTimeout(() => setHeartAnimate(false), 500);
      onToggleFavorite(movie);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className="hover-lift"
    >
      <Card
        className="movie-card glass-card"
        style={{
          borderRadius: "8px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
        title={movie.title.slice(0, 43)}
      >
        <div className="movie-card-content" style={{ flex: 1 }}>
          <img
            onError={(e) => ((e.target as any).src = defaultImg)}
            onLoad={() => setImageLoaded(true)}
            src={movie.poster !== "N/A" ? movie.poster : defaultImg}
            alt={movie.title}
            className={imageLoaded ? "blur-load loaded" : "blur-load"}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
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
        <div className="movie-card-footer" style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Button
            icon="pi pi-info-circle"
            label="View Details"
            severity="secondary"
            className="p-button-rounded"
            onClick={() => setShowModal(true)}
            style={{ width: "100%" }}
          />
          <Button
            icon={movie.isFavorite ? "pi pi-heart-fill" : "pi pi-heart"}
            label={
              movie.isFavorite ? "Remove from Favorites" : "Add to Favorites"
            }
            severity={ movie.isFavorite ? "danger" : "info"}
            className={`p-button-rounded ${heartAnimate ? "heart-animate" : ""}`}
            onClick={handleToggleFavorite}
            style={{ width: "100%" }}
          />
        </div>
      </Card>

      <MovieModal
        visible={showModal}
        onHide={() => setShowModal(false)}
        imdbId={movie.imdbID}
        isFavorite={movie.isFavorite}
        onToggleFavorite={() => {
          handleToggleFavorite();
          setShowModal(false);
        }}
      />
    </motion.div>
  );
}
