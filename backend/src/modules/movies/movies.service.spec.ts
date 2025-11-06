import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { OmdbService } from '../../infrastructure/omdb/omdb.service';
import { AIRecommendationService } from '../../infrastructure/ai/ai-recommendation.service';
import { FavoritesService } from '../favorites/favorites.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let omdbService: jest.Mocked<OmdbService>;
  let aiService: jest.Mocked<AIRecommendationService>;
  let favoritesService: jest.Mocked<FavoritesService>;

  const mockMovieSearchResult = {
    Search: [
      {
        Title: 'Inception',
        Year: '2010',
        imdbID: 'tt1375666',
        Type: 'movie',
        Poster: 'https://example.com/poster.jpg',
      },
      {
        Title: 'Interstellar',
        Year: '2014',
        imdbID: 'tt0816692',
        Type: 'movie',
        Poster: 'https://example.com/poster2.jpg',
      },
    ],
    totalResults: '2',
    Response: 'True',
    Error: '',
  };

  const mockMovieDetail = {
    Title: 'Inception',
    Year: '2010',
    Rated: 'PG-13',
    Released: '16 Jul 2010',
    Runtime: '148 min',
    Genre: 'Action, Sci-Fi, Thriller',
    Director: 'Christopher Nolan',
    Writer: 'Christopher Nolan',
    Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
    Plot: 'A thief who steals corporate secrets...',
    Language: 'English',
    Country: 'USA, UK',
    Awards: 'Won 4 Oscars',
    Poster: 'https://example.com/poster.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '8.8/10' },
      { Source: 'Rotten Tomatoes', Value: '87%' },
    ],
    Metascore: '74',
    imdbRating: '8.8',
    imdbVotes: '2,000,000',
    imdbID: 'tt1375666',
    Type: 'movie',
    DVD: 'N/A',
    BoxOffice: '$292,576,195',
    Production: 'Warner Bros.',
    Website: 'N/A',
    Response: 'True',
  };

  const mockAiAnalysis = {
    overallSentiment: 'positive' as const,
    sentimentScore: 88,
    audienceReception: 'Highly praised by audiences',
    criticsReception: 'Well received by critics',
    keyInsights: ['Excellent cinematography', 'Complex plot'],
    summary: 'A masterpiece of modern cinema',
  };

  beforeEach(async () => {
    const mockOmdbService = {
      searchMoviesByTitle: jest.fn(),
      getMovieById: jest.fn(),
    };

    const mockAiService = {
      analyzeMovieRatings: jest.fn(),
    };

    const mockFavoritesService = {
      checkIfFavorites: jest.fn(),
      isFavorite: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: OmdbService,
          useValue: mockOmdbService,
        },
        {
          provide: AIRecommendationService,
          useValue: mockAiService,
        },
        {
          provide: FavoritesService,
          useValue: mockFavoritesService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    omdbService = module.get(OmdbService);
    aiService = module.get(AIRecommendationService);
    favoritesService = module.get(FavoritesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should search movies and add isFavorite flag', async () => {
      const userId = 'user123';
      const title = 'Inception';
      const favoriteImdbIds = new Set(['tt1375666']);

      omdbService.searchMoviesByTitle.mockResolvedValue(mockMovieSearchResult);
      favoritesService.checkIfFavorites.mockResolvedValue(favoriteImdbIds);

      const result = await service.searchMovies(title, userId, 1);

      expect(omdbService.searchMoviesByTitle).toHaveBeenCalledWith(title, 1);
      expect(favoritesService.checkIfFavorites).toHaveBeenCalledWith(userId, [
        'tt1375666',
        'tt0816692',
      ]);
      expect(result.Search).toHaveLength(2);
      expect(result.Search[0].isFavorite).toBe(true);
      expect(result.Search[1].isFavorite).toBe(false);
    });

    it('should handle empty search results', async () => {
      const userId = 'user123';
      const emptyResult = {
        Search: [],
        totalResults: '0',
        Response: 'False',
        Error: 'Movie not found!',
      };

      omdbService.searchMoviesByTitle.mockResolvedValue(emptyResult);

      const result = await service.searchMovies('NonExistent', userId, 1);

      expect(result.Search).toEqual([]);
      expect(favoritesService.checkIfFavorites).not.toHaveBeenCalled();
    });
  });

  describe('getMovieDetails', () => {
    it('should get movie details with isFavorite flag', async () => {
      const userId = 'user123';
      const imdbId = 'tt1375666';

      omdbService.getMovieById.mockResolvedValue(mockMovieDetail);
      favoritesService.isFavorite.mockResolvedValue(true);

      const result = await service.getMovieDetails(imdbId, userId);

      expect(omdbService.getMovieById).toHaveBeenCalledWith(imdbId);
      expect(favoritesService.isFavorite).toHaveBeenCalledWith(userId, imdbId);
      expect(result.isFavorite).toBe(true);
      expect(result.Title).toBe('Inception');
    });

    it('should return isFavorite as false when movie is not favorited', async () => {
      const userId = 'user123';
      const imdbId = 'tt1375666';

      omdbService.getMovieById.mockResolvedValue(mockMovieDetail);
      favoritesService.isFavorite.mockResolvedValue(false);

      const result = await service.getMovieDetails(imdbId, userId);

      expect(result.isFavorite).toBe(false);
    });
  });

  describe('getMovieAnalysis', () => {
    it('should get AI analysis for a movie', async () => {
      const imdbId = 'tt1375666';

      omdbService.getMovieById.mockResolvedValue(mockMovieDetail);
      aiService.analyzeMovieRatings.mockResolvedValue(mockAiAnalysis);

      const result = await service.getMovieAnalysis(imdbId);

      expect(omdbService.getMovieById).toHaveBeenCalledWith(imdbId);
      expect(aiService.analyzeMovieRatings).toHaveBeenCalledWith(
        mockMovieDetail.Title,
        mockMovieDetail.Ratings,
        mockMovieDetail.imdbRating,
        mockMovieDetail.imdbVotes,
        mockMovieDetail.Plot,
        mockMovieDetail.Genre,
        mockMovieDetail.Year,
      );
      expect(result).toEqual(mockAiAnalysis);
    });
  });
});
