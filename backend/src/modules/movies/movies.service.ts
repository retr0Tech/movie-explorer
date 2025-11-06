import { Injectable } from '@nestjs/common';
import { OmdbService } from '../../infrastructure/omdb/omdb.service';
import { AIRecommendationService } from '../../infrastructure/ai/ai-recommendation.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly omdbService: OmdbService,
    private readonly aiService: AIRecommendationService,
  ) {}

  async searchMovies(title: string, page = 1) {
    return this.omdbService.searchMoviesByTitle(title, page);
  }

  async getMovieDetails(imdbId: string) {
    return this.omdbService.getMovieById(imdbId);
  }

  async getMovieDetailsWithAnalysis(imdbId: string) {
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

    return {
      ...movieDetails,
      aiAnalysis: analysis,
    };
  }
}
