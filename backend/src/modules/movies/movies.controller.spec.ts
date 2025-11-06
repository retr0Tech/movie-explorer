import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ExecutionContext } from '@nestjs/common';
import { Auth0Guard } from '../auth/auth0.guard';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: jest.Mocked<MoviesService>;

  // Mock guard
  const mockGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      request.user = { userId: 'user123' };
      return true;
    },
  };

  const mockSearchResponse = {
    Search: [
      {
        Title: 'Inception',
        Year: '2010',
        imdbID: 'tt1375666',
        Type: 'movie',
        Poster: 'https://example.com/poster.jpg',
        isFavorite: true,
      },
    ],
    totalResults: '1',
    Response: 'True',
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
    Actors: 'Leonardo DiCaprio',
    Plot: 'A thief who steals corporate secrets...',
    Language: 'English',
    Country: 'USA, UK',
    Awards: 'Won 4 Oscars',
    Poster: 'https://example.com/poster.jpg',
    Ratings: [{ Source: 'Internet Movie Database', Value: '8.8/10' }],
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
    isFavorite: false,
  };

  const mockAiAnalysis = {
    overallSentiment: 'positive' as const,
    sentimentScore: 88,
    audienceReception: 'Highly praised',
    criticsReception: 'Well received',
    keyInsights: ['Great cinematography'],
    summary: 'A masterpiece',
  };

  beforeEach(async () => {
    const mockService = {
      searchMovies: jest.fn(),
      getMovieDetails: jest.fn(),
      getMovieAnalysis: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(Auth0Guard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should search for movies', async () => {
      const userId = 'user123';
      const title = 'Inception';
      const page = 1;

      service.searchMovies.mockResolvedValue(mockSearchResponse);

      const result = await controller.searchMovies(userId, title, page);

      expect(service.searchMovies).toHaveBeenCalledWith(title, userId, page);
      expect(result).toEqual(mockSearchResponse);
      expect(result.Search[0].isFavorite).toBe(true);
    });

    it('should use default page when not provided', async () => {
      const userId = 'user123';
      const title = 'Inception';

      service.searchMovies.mockResolvedValue(mockSearchResponse);

      await controller.searchMovies(userId, title);

      expect(service.searchMovies).toHaveBeenCalledWith(title, userId, 1);
    });
  });

  describe('getMovieDetails', () => {
    it('should get movie details with favorite status', async () => {
      const userId = 'user123';
      const imdbId = 'tt1375666';

      service.getMovieDetails.mockResolvedValue(mockMovieDetail);

      const result = await controller.getMovieDetails(userId, imdbId);

      expect(service.getMovieDetails).toHaveBeenCalledWith(imdbId, userId);
      expect(result).toEqual(mockMovieDetail);
      expect(result.isFavorite).toBeDefined();
    });
  });

  describe('getMovieAnalysis', () => {
    it('should get AI analysis for a movie', async () => {
      const imdbId = 'tt1375666';

      service.getMovieAnalysis.mockResolvedValue(mockAiAnalysis);

      const result = await controller.getMovieAnalysis(imdbId);

      expect(service.getMovieAnalysis).toHaveBeenCalledWith(imdbId);
      expect(result).toEqual(mockAiAnalysis);
      expect(result.overallSentiment).toBe('positive');
      expect(result.sentimentScore).toBe(88);
    });
  });
});
