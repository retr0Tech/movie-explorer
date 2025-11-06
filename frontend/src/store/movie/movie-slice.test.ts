import moviesReducer, {
  setMovies,
  setTotalMovies,
  setFavoriteMovies,
  updateMovieFavoriteStatus,
  MoviesState,
} from './movie-slice';
import { MovieType } from '../../enums/movie-type';
import { MovieResponse } from '../../models/movies/movie-response';
import { FavoriteMovie } from '../../models/favorites/favorite-movie';

describe('movies slice', () => {
  const initialState: MoviesState = {
    movies: [],
    totalMovies: 0,
    favoriteMovies: [],
  };

  const mockMovieResponses: MovieResponse[] = [
    {
      title: 'Inception',
      year: 2010,
      imdbID: 'tt1375666',
      type: MovieType.Movie,
      poster: 'https://example.com/poster1.jpg',
      isFavorite: false,
    },
    {
      title: 'Interstellar',
      year: 2014,
      imdbID: 'tt0816692',
      type: MovieType.Movie,
      poster: 'https://example.com/poster2.jpg',
      isFavorite: true,
    },
  ];

  const mockFavoriteMovies: FavoriteMovie[] = [
    {
      imdbId: 'tt0816692',
      title: 'Interstellar',
      year: '2014',
      poster: 'https://example.com/poster2.jpg',
      genre: 'Sci-Fi',
      plot: 'A team of explorers...',
      imdbRating: '8.6',
      director: 'Christopher Nolan',
      actors: 'Matthew McConaughey',
      runtime: '169 min',
    },
  ];

  it('should return the initial state', () => {
    expect(moviesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setMovies', () => {
    it('should set movies from movie responses', () => {
      const actual = moviesReducer(initialState, setMovies(mockMovieResponses));

      expect(actual.movies).toHaveLength(2);
      expect(actual.movies[0].title).toBe('Inception');
      expect(actual.movies[0].isFavorite).toBe(false);
      expect(actual.movies[1].title).toBe('Interstellar');
      expect(actual.movies[1].isFavorite).toBe(true);
    });

    it('should convert movie responses to Movie objects correctly', () => {
      const actual = moviesReducer(initialState, setMovies(mockMovieResponses));

      expect(actual.movies[0]).toEqual({
        title: 'Inception',
        year: 2010,
        imdbID: 'tt1375666',
        type: MovieType.Movie,
        poster: 'https://example.com/poster1.jpg',
        isFavorite: false,
      });
    });
  });

  describe('setTotalMovies', () => {
    it('should set the total number of movies', () => {
      const actual = moviesReducer(initialState, setTotalMovies(42));

      expect(actual.totalMovies).toBe(42);
    });
  });

  describe('setFavoriteMovies', () => {
    it('should set favorite movies', () => {
      const actual = moviesReducer(
        initialState,
        setFavoriteMovies(mockFavoriteMovies),
      );

      expect(actual.favoriteMovies).toHaveLength(1);
      expect(actual.favoriteMovies[0].imdbId).toBe('tt0816692');
      expect(actual.favoriteMovies[0].title).toBe('Interstellar');
    });
  });

  describe('updateMovieFavoriteStatus', () => {
    it('should update favorite status of a movie to true', () => {
      const stateWithMovies = {
        ...initialState,
        movies: [
          {
            title: 'Inception',
            year: 2010,
            imdbID: 'tt1375666',
            type: MovieType.Movie,
            poster: 'https://example.com/poster1.jpg',
            isFavorite: false,
          },
        ],
      };

      const actual = moviesReducer(
        stateWithMovies,
        updateMovieFavoriteStatus({ imdbID: 'tt1375666', isFavorite: true }),
      );

      expect(actual.movies[0].isFavorite).toBe(true);
    });

    it('should update favorite status of a movie to false', () => {
      const stateWithMovies = {
        ...initialState,
        movies: [
          {
            title: 'Inception',
            year: 2010,
            imdbID: 'tt1375666',
            type: MovieType.Movie,
            poster: 'https://example.com/poster1.jpg',
            isFavorite: true,
          },
        ],
      };

      const actual = moviesReducer(
        stateWithMovies,
        updateMovieFavoriteStatus({ imdbID: 'tt1375666', isFavorite: false }),
      );

      expect(actual.movies[0].isFavorite).toBe(false);
    });

    it('should not modify state if movie not found', () => {
      const stateWithMovies = {
        ...initialState,
        movies: [
          {
            title: 'Inception',
            year: 2010,
            imdbID: 'tt1375666',
            type: MovieType.Movie,
            poster: 'https://example.com/poster1.jpg',
            isFavorite: false,
          },
        ],
      };

      const actual = moviesReducer(
        stateWithMovies,
        updateMovieFavoriteStatus({
          imdbID: 'non-existent-id',
          isFavorite: true,
        }),
      );

      expect(actual.movies[0].isFavorite).toBe(false);
    });

    it('should only update the specified movie', () => {
      const stateWithMovies = {
        ...initialState,
        movies: [
          {
            title: 'Inception',
            year: 2010,
            imdbID: 'tt1375666',
            type: MovieType.Movie,
            poster: 'https://example.com/poster1.jpg',
            isFavorite: false,
          },
          {
            title: 'Interstellar',
            year: 2014,
            imdbID: 'tt0816692',
            type: MovieType.Movie,
            poster: 'https://example.com/poster2.jpg',
            isFavorite: false,
          },
        ],
      };

      const actual = moviesReducer(
        stateWithMovies,
        updateMovieFavoriteStatus({ imdbID: 'tt1375666', isFavorite: true }),
      );

      expect(actual.movies[0].isFavorite).toBe(true);
      expect(actual.movies[1].isFavorite).toBe(false);
    });
  });
});
