import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Auth0Guard } from '../auth/auth0.guard';
import { User } from '../auth/decorators/user.decorator';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';

@Controller()
@UseGuards(Auth0Guard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('movies/search')
  async searchMovies(
    @Query('title') title: string,
    @Query('page') page?: number,
  ) {
    return this.moviesService.searchMovies(title, page || 1);
  }

  @Get('movies/:imdbId')
  async getMovieDetails(@Param('imdbId') imdbId: string) {
    return this.moviesService.getMovieDetails(imdbId);
  }

  // Favorites endpoints
  @Get('favorites')
  async getFavorites(@User('userId') userId: string) {
    return this.moviesService.getFavorites(userId);
  }
  @Get('favorites/imdbId/:imdbId')
  async getFavoriteByImdbId(
    @Param('imdbId') imdbId: string,
    @User('userId') userId: string,
  ) {
    return this.moviesService.getFavoriteByImdbId(imdbId, userId);
  }

  @Get('favorites/:id')
  async getFavoriteById(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return this.moviesService.getFavoriteById(id, userId);
  }

  @Post('favorites')
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(
    @User('userId') userId: string,
    @Body(ValidationPipe) createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.moviesService.createFavorite(userId, createFavoriteDto);
  }

  @Put('favorites/:id')
  async updateFavorite(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body(ValidationPipe) updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return this.moviesService.updateFavorite(id, userId, updateFavoriteDto);
  }

  @Delete('favorites/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFavorite(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return this.moviesService.deleteFavorite(id, userId);
  }

  // AI Recommendations endpoint
  @Get('recommendations/:imdbId')
  async getRecommendations(@Param('imdbId') imdbId: string) {
    return this.moviesService.getRecommendations(imdbId);
  }
}
