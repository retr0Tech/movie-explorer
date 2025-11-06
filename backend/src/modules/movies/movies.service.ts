import { Injectable } from '@nestjs/common';
import { OmdbService } from '../../infrastructure/omdb/omdb.service';
import { AIRecommendationService } from '../../infrastructure/ai/ai-recommendation.service';
import { FavoritesService } from '../favorites/favorites.service';
import { MovieSearchResponseDto } from './dto/movie-search-response.dto';
import { MovieDetailResponseDto } from './dto/movie-detail-response.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly omdbService: OmdbService,
    private readonly aiService: AIRecommendationService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async searchMovies(
    title: string,
    userId: string,
    page = 1,
  ): Promise<MovieSearchResponseDto> {
    const searchResult = await this.omdbService.searchMoviesByTitle(
      title,
      page,
    );

    if (!searchResult.Search || searchResult.Search.length === 0) {
      return {
        ...searchResult,
        Search: [],
      };
    }

    // Get all imdbIDs from search results
    const imdbIds = searchResult.Search.map((movie) => movie.imdbID);

    // Check which movies are favorites
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const favoriteIds: Set<string> =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.favoritesService.checkIfFavorites(userId, imdbIds);

    // Add isFavorite flag to each movie
    const moviesWithFavoriteStatus = searchResult.Search.map(
      (movie): typeof movie & { isFavorite: boolean } => ({
        ...movie,
        isFavorite: favoriteIds.has(movie.imdbID),
      }),
    );

    return {
      ...searchResult,
      Search: moviesWithFavoriteStatus,
    };
  }

  async getMovieDetails(
    imdbId: string,
    userId: string,
  ): Promise<MovieDetailResponseDto> {
    const movieDetails = await this.omdbService.getMovieById(imdbId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const isFavorite: boolean =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.favoritesService.isFavorite(userId, imdbId);

    return {
      ...movieDetails,
      isFavorite,
    };
  }

  async getMovieAnalysis(imdbId: string) {
    const movieDetails = await this.omdbService.getMovieById(imdbId);

    const analysis = await this.aiService.analyzeMovieRatings(
      movieDetails.Title,
      movieDetails.Ratings,
      movieDetails.imdbRating,
      movieDetails.imdbVotes,
      movieDetails.Plot,
      movieDetails.Genre,
      movieDetails.Year,
    );

    return analysis;
  }
}
