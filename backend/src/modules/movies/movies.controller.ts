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

@ApiTags('movies')
@ApiBearerAuth('JWT-auth')
@Controller('movies')
@UseGuards(Auth0Guard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({
    summary: 'Search for movies',
    description: 'Search movies by title using OMDB API',
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
  @ApiResponse({ status: 200, description: 'Movies found successfully' })
  @ApiResponse({ status: 400, description: 'Invalid search parameters' })
  @Get('search')
  async searchMovies(
    @Query('title') title: string,
    @Query('page') page?: number,
  ) {
    return this.moviesService.searchMovies(title, page || 1);
  }

  @ApiOperation({
    summary: 'Get movie details',
    description: 'Get detailed information about a specific movie by IMDB ID',
  })
  @ApiParam({
    name: 'imdbId',
    description: 'IMDB movie ID',
    example: 'tt0111161',
  })
  @ApiResponse({
    status: 200,
    description: 'Movie details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @Get(':imdbId')
  async getMovieDetails(@Param('imdbId') imdbId: string) {
    return this.moviesService.getMovieDetails(imdbId);
  }

  @ApiOperation({
    summary: 'Get movie details with AI analysis',
    description:
      'Get detailed movie information with AI-powered sentiment analysis of ratings and reviews',
  })
  @ApiParam({
    name: 'imdbId',
    description: 'IMDB movie ID',
    example: 'tt0111161',
  })
  @ApiResponse({
    status: 200,
    description: 'Movie details with AI analysis retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @Get(':imdbId/analysis')
  async getMovieDetailsWithAnalysis(@Param('imdbId') imdbId: string) {
    return this.moviesService.getMovieDetailsWithAnalysis(imdbId);
  }
}
