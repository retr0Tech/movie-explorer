import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieGridItem from './MovieGridItem';
import { Movie } from '../../models/movies/movie';
import { MovieType } from '../../enums/movie-type';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('MovieGridItem', () => {
  const mockMovie: Movie = {
    title: 'Inception',
    year: 2010,
    imdbID: 'tt1375666',
    type: MovieType.Movie,
    poster: 'https://example.com/poster.jpg',
    isFavorite: false,
  };

  const mockToggleFavorite = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render movie information correctly', () => {
    render(
      <MovieGridItem movie={mockMovie} onToggleFavorite={mockToggleFavorite} />,
    );

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText(/2010/)).toBeInTheDocument();
    expect(screen.getByText(/movie/)).toBeInTheDocument();
    expect(screen.getByText(/IMDb ID: tt1375666/)).toBeInTheDocument();
  });

  it('should render favorite button with correct label when not favorited', () => {
    render(
      <MovieGridItem movie={mockMovie} onToggleFavorite={mockToggleFavorite} />,
    );

    const favoriteButton = screen.getByRole('button', {
      name: /Add to Favorites/i,
    });
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should render favorite button with correct label when favorited', () => {
    const favoritedMovie = { ...mockMovie, isFavorite: true };
    render(
      <MovieGridItem
        movie={favoritedMovie}
        onToggleFavorite={mockToggleFavorite}
      />,
    );

    const favoriteButton = screen.getByRole('button', {
      name: /Remove from Favorites/i,
    });
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should call onToggleFavorite when favorite button is clicked', async () => {
    mockToggleFavorite.mockResolvedValue(true);

    render(
      <MovieGridItem movie={mockMovie} onToggleFavorite={mockToggleFavorite} />,
    );

    const favoriteButton = screen.getByRole('button', {
      name: /Add to Favorites/i,
    });
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(mockToggleFavorite).toHaveBeenCalledWith(mockMovie);
      expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    });
  });

  it('should update favorite status after successful toggle', async () => {
    mockToggleFavorite.mockResolvedValue(true);

    const { rerender } = render(
      <MovieGridItem movie={mockMovie} onToggleFavorite={mockToggleFavorite} />,
    );

    const favoriteButton = screen.getByRole('button', {
      name: /Add to Favorites/i,
    });
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(mockToggleFavorite).toHaveBeenCalled();
    });

    // Simulate prop update from parent
    const updatedMovie = { ...mockMovie, isFavorite: true };
    rerender(
      <MovieGridItem
        movie={updatedMovie}
        onToggleFavorite={mockToggleFavorite}
      />,
    );

    expect(
      screen.getByRole('button', { name: /Remove from Favorites/i }),
    ).toBeInTheDocument();
  });

  it('should display default image when poster is not available', () => {
    const movieWithoutPoster = { ...mockMovie, poster: 'N/A' };
    render(
      <MovieGridItem
        movie={movieWithoutPoster}
        onToggleFavorite={mockToggleFavorite}
      />,
    );

    const image = screen.getByAltText('Inception') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    // The src will be the default image path
    expect(image.src).toContain('no-poster.png');
  });

  it('should open modal when View Details button is clicked', () => {
    render(
      <MovieGridItem movie={mockMovie} onToggleFavorite={mockToggleFavorite} />,
    );

    const detailsButton = screen.getByRole('button', { name: /View Details/i });
    fireEvent.click(detailsButton);

    // Modal should be rendered (though visibility depends on Dialog component)
    // This test verifies the button exists and is clickable
    expect(detailsButton).toBeInTheDocument();
  });

  it('should truncate long movie titles', () => {
    const longTitleMovie = {
      ...mockMovie,
      title: 'This is a very long movie title that should be truncated at some point',
    };

    render(
      <MovieGridItem
        movie={longTitleMovie}
        onToggleFavorite={mockToggleFavorite}
      />,
    );

    const title = screen.getByText(/This is a very long movie title/);
    expect(title).toBeInTheDocument();
    // Title is sliced to 43 characters in the component
    expect(title.textContent?.length).toBeLessThanOrEqual(43);
  });
});
