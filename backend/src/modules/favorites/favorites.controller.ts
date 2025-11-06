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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { Auth0Guard } from '../auth/auth0.guard';
import { User } from '../auth/decorators/user.decorator';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
import { PaginatedFavoritesResponseDto } from './dto/paginated-favorites-response.dto';

@ApiTags('favorites')
@ApiBearerAuth('JWT-auth')
@Controller('favorites')
@UseGuards(Auth0Guard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({
    summary: 'Get all favorites',
    description:
      'Get paginated favorite movies for the authenticated user. Supports pagination with page and limit query parameters.',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number (default: 1)',
    required: false,
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page (default: 10, max: 100)',
    required: false,
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Favorites retrieved successfully',
    type: PaginatedFavoritesResponseDto,
  })
  @Get()
  async getFavorites(
    @User('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('filter') filter?: string,
  ) {
    const pageNumber = page ? Number(page) : 1;
    const limitNumber = limit ? Number(limit) : 10;
    return this.favoritesService.getFavorites(
      userId,
      pageNumber,
      limitNumber,
      filter,
    );
  }

  @ApiOperation({
    summary: 'Get favorite by IMDB ID',
    description: 'Get a specific favorite movie by its IMDB ID',
  })
  @ApiParam({
    name: 'imdbId',
    description: 'IMDB movie ID',
    example: 'tt0111161',
  })
  @ApiResponse({
    status: 200,
    description: 'Favorite found',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @Get('imdbId/:imdbId')
  async getFavoriteByImdbId(
    @Param('imdbId') imdbId: string,
    @User('userId') userId: string,
  ) {
    return this.favoritesService.getFavoriteByImdbId(imdbId, userId);
  }

  @ApiOperation({
    summary: 'Get favorite by ID',
    description: 'Get a specific favorite movie by its database ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Favorite ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Favorite found',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @Get(':id')
  async getFavoriteById(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return this.favoritesService.getFavoriteById(id, userId);
  }

  @ApiOperation({
    summary: 'Add a favorite',
    description: "Add a movie to the user's favorites list",
  })
  @ApiResponse({
    status: 201,
    description: 'Favorite created successfully',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 409, description: 'Movie already in favorites' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(
    @User('userId') userId: string,
    @Body(ValidationPipe) createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoritesService.createFavorite(userId, createFavoriteDto);
  }

  @ApiOperation({
    summary: 'Update a favorite',
    description: 'Update details of a favorite movie',
  })
  @ApiParam({
    name: 'id',
    description: 'Favorite ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Favorite updated successfully',
    type: FavoriteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @Put(':id')
  async updateFavorite(
    @Param('id') id: string,
    @User('userId') userId: string,
    @Body(ValidationPipe) updateFavoriteDto: UpdateFavoriteDto,
  ) {
    return this.favoritesService.updateFavorite(id, userId, updateFavoriteDto);
  }

  @ApiOperation({
    summary: 'Delete a favorite',
    description: "Remove a movie from the user's favorites list",
  })
  @ApiParam({
    name: 'id',
    description: 'Favorite ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 204, description: 'Favorite deleted successfully' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFavorite(
    @Param('id') id: string,
    @User('userId') userId: string,
  ) {
    return this.favoritesService.deleteFavorite(id, userId);
  }
}
