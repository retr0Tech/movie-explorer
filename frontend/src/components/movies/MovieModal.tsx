import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { Chip } from "primereact/chip";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { OmdbMovieDetailWithAnalysisDto } from "../../models/movies/movie-response";
import { getMovieByIdWithAnalysis } from "../../services/movie-service";
import noPosterImg from "../../no-poster.png";
import "./MovieModal.css";

interface MovieModalProps {
  visible: boolean;
  onHide: () => void;
  imdbId: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function MovieModal({
  visible,
  onHide,
  imdbId,
  isFavorite,
  onToggleFavorite,
}: MovieModalProps) {
  const [movieDetails, setMovieDetails] = useState<OmdbMovieDetailWithAnalysisDto | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!visible || !imdbId) return;

      setLoading(true);
      setError(null);

      try {
        const token = await getAccessTokenSilently();
        const response = await getMovieByIdWithAnalysis()(imdbId, token);

        if (response.success && response.data) {
          setMovieDetails(response.data);
        } else {
          setError(response.message || "Failed to load movie details. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [visible, imdbId, getAccessTokenSilently]);

  const getRatingColor = (rating: string) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "success";
    if (numRating >= 6) return "info";
    if (numRating >= 4) return "warning";
    return "danger";
  };

  const header = (
    <div className="modal-header-content">
      <h2>{movieDetails?.Title}</h2>
      {movieDetails && (
        <div className="modal-header-meta">
          <span>{movieDetails.Year}</span>
          <span>•</span>
          <span>{movieDetails.Rated}</span>
          <span>•</span>
          <span>{movieDetails.Runtime}</span>
        </div>
      )}
    </div>
  );

  const footer = (
    <div className="modal-footer-content">
      {onToggleFavorite && (
        <Button
          icon={isFavorite ? "pi pi-heart-fill" : "pi pi-heart"}
          label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          severity={isFavorite ? "danger" : "info"}
          onClick={onToggleFavorite}
          className="p-button-rounded"
        />
      )}
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={onHide}
        className="p-button-rounded p-button-text"
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      footer={footer}
      className="movie-modal"
      style={{ width: "90vw", maxWidth: "900px" }}
      modal
      dismissableMask
    >
      {loading && (
        <div className="modal-loading">
          <ProgressSpinner />
          <p>Loading movie details...</p>
        </div>
      )}

      {error && (
        <div className="modal-error">
          <i className="pi pi-exclamation-triangle" style={{ fontSize: "2rem" }}></i>
          <p>{error}</p>
          <Button label="Retry" onClick={() => setError(null)} />
        </div>
      )}

      {!loading && !error && movieDetails && (
        <div className="modal-content">
          <div className="modal-poster-section">
            <img
              src={
                movieDetails.Poster !== "N/A"
                  ? movieDetails.Poster
                  : noPosterImg
              }
              alt={movieDetails.Title}
              className="modal-poster"
              onError={(e) => ((e.target as any).src = noPosterImg)}
            />

            {movieDetails.Ratings && movieDetails.Ratings.length > 0 && (
              <div className="ratings-section">
                <h3>Ratings</h3>
                {movieDetails.Ratings.map((rating, index) => (
                  <div key={index} className="rating-item">
                    <span className="rating-source">{rating.Source}:</span>
                    <Tag
                      value={rating.Value}
                      severity={
                        rating.Source === "Internet Movie Database"
                          ? getRatingColor(rating.Value.split("/")[0])
                          : "info"
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {movieDetails.imdbRating !== "N/A" && (
              <div className="imdb-rating-large">
                <i className="pi pi-star-fill"></i>
                <span className="rating-value">{movieDetails.imdbRating}</span>
                <span className="rating-max">/10</span>
                {movieDetails.imdbVotes !== "N/A" && (
                  <span className="rating-votes">
                    ({movieDetails.imdbVotes} votes)
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="modal-details-section">
            {movieDetails.Plot !== "N/A" && (
              <div className="detail-block">
                <h3>Plot</h3>
                <p className="plot-text">{movieDetails.Plot}</p>
              </div>
            )}

            {movieDetails.Genre !== "N/A" && (
              <div className="detail-block">
                <h3>Genres</h3>
                <div className="genre-chips">
                  {movieDetails.Genre.split(", ").map((genre, index) => (
                    <Chip key={index} label={genre} className="genre-chip" />
                  ))}
                </div>
              </div>
            )}

            <div className="detail-grid">
              {movieDetails.Director !== "N/A" && (
                <div className="detail-item">
                  <strong>Director:</strong>
                  <span>{movieDetails.Director}</span>
                </div>
              )}

              {movieDetails.Writer !== "N/A" && (
                <div className="detail-item">
                  <strong>Writer:</strong>
                  <span>{movieDetails.Writer}</span>
                </div>
              )}

              {movieDetails.Actors !== "N/A" && (
                <div className="detail-item">
                  <strong>Cast:</strong>
                  <span>{movieDetails.Actors}</span>
                </div>
              )}

              {movieDetails.Language !== "N/A" && (
                <div className="detail-item">
                  <strong>Language:</strong>
                  <span>{movieDetails.Language}</span>
                </div>
              )}

              {movieDetails.Country !== "N/A" && (
                <div className="detail-item">
                  <strong>Country:</strong>
                  <span>{movieDetails.Country}</span>
                </div>
              )}

              {movieDetails.Released !== "N/A" && (
                <div className="detail-item">
                  <strong>Released:</strong>
                  <span>{movieDetails.Released}</span>
                </div>
              )}

              {movieDetails.BoxOffice !== "N/A" && (
                <div className="detail-item">
                  <strong>Box Office:</strong>
                  <span>{movieDetails.BoxOffice}</span>
                </div>
              )}

              {movieDetails.Awards !== "N/A" && (
                <div className="detail-item awards-item">
                  <strong>
                    <i className="pi pi-trophy"></i> Awards:
                  </strong>
                  <span>{movieDetails.Awards}</span>
                </div>
              )}
            </div>

            {movieDetails.aiAnalysis && (
              <div className="ai-review-section">
                <div className="ai-review-header">
                  <i className="pi pi-sparkles"></i>
                  <h3>AI Generated Review</h3>
                </div>

                <div className={`sentiment-badge sentiment-${movieDetails.aiAnalysis.overallSentiment}`}>
                  <i className={`pi ${
                    movieDetails.aiAnalysis.overallSentiment === 'positive' ? 'pi-thumbs-up' :
                    movieDetails.aiAnalysis.overallSentiment === 'negative' ? 'pi-thumbs-down' :
                    'pi-minus'
                  }`}></i>
                  <span>{movieDetails.aiAnalysis.overallSentiment.toUpperCase()}</span>
                  <span className="sentiment-score">{movieDetails.aiAnalysis.sentimentScore}%</span>
                </div>

                <div className="ai-summary">
                  <p>{movieDetails.aiAnalysis.summary}</p>
                </div>

                <div className="reception-grid">
                  <div className="reception-item">
                    <strong><i className="pi pi-users"></i> Audience</strong>
                    <p>{movieDetails.aiAnalysis.audienceReception}</p>
                  </div>
                  <div className="reception-item">
                    <strong><i className="pi pi-pencil"></i> Critics</strong>
                    <p>{movieDetails.aiAnalysis.criticsReception}</p>
                  </div>
                </div>

                {movieDetails.aiAnalysis.keyInsights.length > 0 && (
                  <div className="key-insights">
                    <strong>Key Insights:</strong>
                    <ul>
                      {movieDetails.aiAnalysis.keyInsights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
