import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { Auth0Guard } from '../auth/auth0.guard';
import { User } from '../auth/decorators/user.decorator';
import { MovieSearchResponseDto } from './dto/movie-search-response.dto';
import { MovieDetailResponseDto } from './dto/movie-detail-response.dto';

@ApiTags('movies')
@ApiBearerAuth('JWT-auth')
@Controller('movies')
@UseGuards(Auth0Guard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({
    summary: 'Search for movies',
    description:
      'Search movies by title using OMDB API. Includes favorite status for each movie.',
  })
  @ApiQuery({
    name: 'title',
    description: 'Movie title to search for',
    example: 'Inception',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination',
    required: false,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Movies found successfully',
    type: MovieSearchResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  @Get('search')
  async searchMovies(
    @User('userId') userId: string,
    @Query('title') title: string,
    @Query('page') page?: number,
  ) {
    return this.moviesService.searchMovies(title, userId, page || 1);
  }

  @ApiOperation({
    summary: 'Get movie details',
    description:
      'Get detailed information about a specific movie by IMDB ID. Includes favorite status.',
  })
  @ApiParam({
    name: 'imdbId',
    description: 'IMDB movie ID',
    example: 'tt0111161',
  })
  @ApiResponse({
    status: 200,
    description: 'Movie details retrieved successfully',
    type: MovieDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @Get(':imdbId')
  async getMovieDetails(
    @User('userId') userId: string,
    @Param('imdbId') imdbId: string,
  ) {
    return this.moviesService.getMovieDetails(imdbId, userId);
  }

  @ApiOperation({
    summary: 'Get AI analysis for a movie',
    description:
      'Get AI-powered sentiment analysis of movie ratings and reviews. Returns only the AI analysis without full movie details.',
  })
  @ApiParam({
    name: 'imdbId',
    description: 'IMDB movie ID',
    example: 'tt0111161',
  })
  @ApiResponse({
    status: 200,
    description: 'AI analysis retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @Get(':imdbId/analysis')
  async getMovieAnalysis(@Param('imdbId') imdbId: string) {
    return this.moviesService.getMovieAnalysis(imdbId);
  }
}
