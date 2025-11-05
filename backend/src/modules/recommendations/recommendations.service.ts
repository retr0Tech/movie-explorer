import { Injectable, NotFoundException } from '@nestjs/common';
import { OmdbService } from '../../infrastructure/omdb/omdb.service';
import { AIRecommendationService } from '../../infrastructure/ai/ai-recommendation.service';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly omdbService: OmdbService,
    private readonly aiRecommendationService: AIRecommendationService,
  ) {}

  async getRecommendations(imdbId: string) {
    // First, get the movie details from OMDB
    const movieDetails = await this.omdbService.getMovieById(imdbId);

    if (!movieDetails || movieDetails.Response === 'False') {
      throw new NotFoundException('Movie not found');
    }

    // Use AI to generate recommendations
    const recommendations =
      await this.aiRecommendationService.getMovieRecommendations(
        movieDetails.Title,
        movieDetails.Year,
        movieDetails.Genre,
        movieDetails.Plot,
      );

    return {
      movie: {
        title: movieDetails.Title,
        year: movieDetails.Year,
        imdbId: movieDetails.imdbID,
      },
      recommendations: recommendations.slice(0, 5), // Ensure max 5 recommendations
    };
  }
}
