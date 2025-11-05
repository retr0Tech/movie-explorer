import { MovieRecommendation } from './movie-recommendation';

export interface RecommendationResponse {
  movie: {
    title: string;
    year: string;
    imdbId: string;
  };
  recommendations: MovieRecommendation[];
}
