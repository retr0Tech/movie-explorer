import { Injectable } from '@nestjs/common';
import { OmdbService } from '../../infrastructure/omdb/omdb.service';

@Injectable()
export class MoviesService {
  constructor(private readonly omdbService: OmdbService) {}

  async searchMovies(title: string, page = 1) {
    return this.omdbService.searchMoviesByTitle(title, page);
  }

  async getMovieDetails(imdbId: string) {
    return this.omdbService.getMovieById(imdbId);
  }
}
