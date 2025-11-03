import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  OmdbSearchResponseDto,
  OmdbMovieDetailDto,
} from './dto/movie-search.dto';

@Injectable()
export class OmdbService {
  private readonly apiKey: string;
  private readonly baseUrl = 'http://www.omdbapi.com/';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('OMDB_API_KEY') || '';
    if (!this.apiKey) {
      throw new Error('OMDB_API_KEY is not configured');
    }
  }

  async searchMoviesByTitle(
    title: string,
    page = 1,
  ): Promise<OmdbSearchResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<OmdbSearchResponseDto>(this.baseUrl, {
          params: {
            apikey: this.apiKey,
            s: title,
            page,
          },
        }),
      );

      if (response.data.Response === 'False') {
        throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching movies from OMDB API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMovieById(imdbId: string): Promise<OmdbMovieDetailDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<OmdbMovieDetailDto>(this.baseUrl, {
          params: {
            apikey: this.apiKey,
            i: imdbId,
            plot: 'full',
          },
        }),
      );

      if (response.data.Response === 'False') {
        throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching movie details from OMDB API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
