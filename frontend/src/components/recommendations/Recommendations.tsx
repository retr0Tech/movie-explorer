import { Panel } from 'primereact/panel';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useState, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppSelector } from '../../store/hooks';
import { selectFavoriteMovies } from '../../store/movie/movie-slice';
import { FavoriteMovie } from '../../models/favorites/favorite-movie';
import { MovieRecommendation } from '../../models/recommendations/movie-recommendation';
import * as movieService from '../../services/movie-service';
import { motion } from 'framer-motion';
import { ToastContext } from '../../App';

export default function Recommendations() {
  const { getAccessTokenSilently } = useAuth0();
  const favoriteMovies = useAppSelector(selectFavoriteMovies);
  const toast = useContext(ToastContext);
  const [selectedMovie, setSelectedMovie] = useState<FavoriteMovie | null>(null);
  const [currentMovie, setCurrentMovie] = useState<FavoriteMovie | null>(null);
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  // Set first favorite as default selection when favorites load
  useEffect(() => {
    if (favoriteMovies.length > 0 && !selectedMovie) {
      setSelectedMovie(favoriteMovies[0]);
    }
  }, [favoriteMovies, selectedMovie]);

  const handleGetRecommendations = async () => {
    if (favoriteMovies.length === 0) {
      toast?.current?.show({
        severity: 'warn',
        summary: 'No Favorites',
        detail: 'Please add some favorite movies first to get recommendations.',
        life: 3000
      });
      return;
    }

    if (!selectedMovie) {
      toast?.current?.show({
        severity: 'warn',
        summary: 'No Movie Selected',
        detail: 'Please select a favorite movie to get recommendations.',
        life: 3000
      });
      return;
    }

    setCurrentMovie(selectedMovie);
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const recommendationService = movieService.getRecommendations();
      const response = await recommendationService(selectedMovie.imdbId, token);

      if (response.success && response.data) {
        setRecommendations(response.data.recommendations);
        toast?.current?.show({
          severity: 'success',
          summary: 'Recommendations Loaded',
          detail: `Found ${response.data.recommendations.length} recommendations based on ${selectedMovie.title}`,
          life: 3000
        });
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      toast?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load recommendations. Please try again.',
        life: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const movieOptionTemplate = (option: FavoriteMovie) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="pi pi-star-fill" style={{ fontSize: '0.8rem', color: '#fbbf24' }}></i>
        <span>{option.title} ({option.year})</span>
      </div>
    );
  };

  const selectedMovieTemplate = (option: FavoriteMovie | null) => {
    if (!option) {
      return <span>Select a favorite movie...</span>;
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <i className="pi pi-star-fill" style={{ fontSize: '0.8rem', color: '#fbbf24' }}></i>
        <span>{option.title} ({option.year})</span>
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
        <i className="pi pi-sparkles" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
        <h3>Get AI-Powered Recommendations</h3>
        <p>Select a favorite movie above and click the button below to get personalized recommendations!</p>
      </div>
    );
  };

  const recommendationCard = (recommendation: MovieRecommendation, index: number) => {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          ease: "easeOut"
        }}
        className="col-12 md:col-6 lg:col-4"
      >
        <Card
          className="recommendation-card glass-card"
          style={{
            borderRadius: "8px",
            height: "100%",
          }}
        >
          <div className="recommendation-content">
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {recommendation.title}
            </h3>
            {recommendation.year && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {recommendation.year}
              </p>
            )}
            <div className="recommendation-reason" style={{
              borderLeft: '3px solid var(--primary-500)',
              paddingLeft: '1rem',
              color: 'var(--text-primary)'
            }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>
                {recommendation.reason}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  if (favoriteMovies.length === 0) {
    return (
      <div>
        <Panel header="AI-Powered Movie Recommendations">
          <div className="flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
            <i className="pi pi-star" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
            <h3>No Favorite Movies Yet</h3>
            <p>Add movies to your favorites first to get AI-powered recommendations!</p>
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div>
      <Panel header="AI-Powered Movie Recommendations">
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="movie-select" style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: 'var(--text-primary)'
          }}>
            Select a favorite movie to get recommendations:
          </label>
          <Dropdown
            id="movie-select"
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.value)}
            options={favoriteMovies}
            optionLabel="title"
            placeholder="Select a favorite movie..."
            filter
            filterBy="title"
            itemTemplate={movieOptionTemplate}
            valueTemplate={selectedMovieTemplate}
            style={{ width: '100%' }}
            disabled={loading}
          />
        </div>

        {currentMovie && (
          <div className="recommendation-source" style={{
            background: 'var(--bg-tertiary)',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            borderLeft: '4px solid var(--primary-500)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="pi pi-info-circle" style={{ color: 'var(--primary-500)' }}></i>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Based on your favorite movie:
              </span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {currentMovie.title} ({currentMovie.year})
              </strong>
            </div>
          </div>
        )}

        <div className="recommendations-grid">
          {recommendations.length === 0 ? (
            emptyTemplate()
          ) : (
            <div className="grid">
              {recommendations.map((rec, index) => recommendationCard(rec, index))}
            </div>
          )}
        </div>

        <div className="flex justify-content-center" style={{ marginTop: '2rem' }}>
          <Button
            label={recommendations.length === 0 ? "Get Recommendations" : "Get More Recommendations"}
            icon="pi pi-sparkles"
            onClick={handleGetRecommendations}
            loading={loading}
            disabled={loading || !selectedMovie}
            size="large"
          />
        </div>
      </Panel>
    </div>
  );
}
