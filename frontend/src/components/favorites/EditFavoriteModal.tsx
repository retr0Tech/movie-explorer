import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import * as movieService from '../../services/movie-service';
import { useState, useEffect } from 'react';
import { FavoriteMovie } from '../../models/favorites/favorite-movie';
import { UpdateFavorite } from '../../models/favorites/update-favorite-movie';
import { useAuth0 } from '@auth0/auth0-react';

interface EditFavoriteModalProps {
  visible: boolean;
  movie: FavoriteMovie | null;
  onHide: () => void;
  onSave: (id: string, updates: UpdateFavorite) => Promise<void>;
}

export default function EditFavoriteModal({
  visible,
  movie,
  onHide,
  onSave,
}: EditFavoriteModalProps) {
  const [formData, setFormData] = useState<UpdateFavorite>({
    title: '',
    year: '',
    poster: '',
    genre: '',
    plot: '',
    imdbRating: '',
    director: '',
    actors: '',
    runtime: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const getFavoriteMovieByImdbId = movieService.getFavoriteMovieByImdbId();
	const { getAccessTokenSilently } = useAuth0();
  

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        year: movie.year || '',
        poster: movie.poster || '',
        genre: movie.genre || '',
        plot: movie.plot || '',
        imdbRating: movie.imdbRating || '',
        director: movie.director || '',
        actors: movie.actors || '',
        runtime: movie.runtime || '',
      });
    }
  }, [movie]);

  const getRatingValue = () => {
    const rating = parseFloat(formData.imdbRating || '0');
    return isNaN(rating) ? 0 : Math.round(rating / 2);
  };

  const handleRatingChange = (value: number) => {
    const imdbRating = (value * 2).toString();
    setFormData(prev => ({ ...prev, imdbRating }));
  };

  const handleInputChange = (field: keyof UpdateFavorite, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!movie || !movie.imdbId) return;

    setIsSaving(true);
    try {
      const token = await getAccessTokenSilently();
			const favMovie = await getFavoriteMovieByImdbId(movie.imdbId, token);
      await onSave(favMovie.data.id, formData);
      onHide();
    } catch (error) {
      console.error('Failed to update favorite:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const footer = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={onHide}
        severity="secondary"
        disabled={isSaving}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={isSaving}
      />
    </div>
  );

  return (
    <Dialog
      header="Edit Favorite Movie"
      visible={visible}
      onHide={onHide}
      footer={footer}
      style={{ width: '600px' }}
      breakpoints={{ '960px': '75vw', '641px': '90vw' }}
      modal
      className="edit-favorite-modal"
    >
      <div className="edit-favorite-form">
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <InputText
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Movie title"
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="year">Year</label>
            <InputText
              id="year"
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              placeholder="e.g., 2020"
            />
          </div>

          <div className="form-field">
            <label htmlFor="runtime">Runtime</label>
            <InputText
              id="runtime"
              value={formData.runtime}
              onChange={(e) => handleInputChange('runtime', e.target.value)}
              placeholder="e.g., 120 min"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="rating">IMDb Rating</label>
          <div className="flex align-items-center gap-3">
            <Rating
              value={getRatingValue()}
              onChange={(e) => handleRatingChange(e.value ?? 0)}
              cancel={false}
              stars={5}
            />
            <InputText
              id="rating"
              value={formData.imdbRating || ''}
              onChange={(e) => handleInputChange('imdbRating', e.target.value)}
              placeholder="0.0"
              style={{ width: '80px' }}
            />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              / 10
            </span>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="genre">Genre</label>
          <InputText
            id="genre"
            value={formData.genre}
            onChange={(e) => handleInputChange('genre', e.target.value)}
            placeholder="e.g., Action, Drama"
          />
        </div>

        <div className="form-field">
          <label htmlFor="director">Director</label>
          <InputText
            id="director"
            value={formData.director}
            onChange={(e) => handleInputChange('director', e.target.value)}
            placeholder="Director name"
          />
        </div>

        <div className="form-field">
          <label htmlFor="actors">Actors</label>
          <InputText
            id="actors"
            value={formData.actors}
            onChange={(e) => handleInputChange('actors', e.target.value)}
            placeholder="Actor names (comma-separated)"
          />
        </div>

        <div className="form-field">
          <label htmlFor="poster">Poster URL</label>
          <InputText
            id="poster"
            value={formData.poster}
            onChange={(e) => handleInputChange('poster', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-field">
          <label htmlFor="plot">Plot</label>
          <InputTextarea
            id="plot"
            value={formData.plot}
            onChange={(e) => handleInputChange('plot', e.target.value)}
            placeholder="Movie plot summary"
            rows={4}
            autoResize
          />
        </div>
      </div>
    </Dialog>
  );
}
function getAccessTokenSilently() {
  throw new Error('Function not implemented.');
}

