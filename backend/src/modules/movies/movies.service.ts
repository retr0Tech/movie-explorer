import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.orm-entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
import { OmdbService } from '../../infrastructure/omdb/omdb.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly omdbService: OmdbService,
  ) {}

  async getFavorites(userId: string): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    return favorites.map(this.mapToResponseDto);
  }

  async getFavoriteById(
    id: string,
    userId: string,
  ): Promise<FavoriteResponseDto> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id, userId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite movie not found');
    }

    return this.mapToResponseDto(favorite);
  }

  async createFavorite(
    userId: string,
    createFavoriteDto: CreateFavoriteDto,
  ): Promise<FavoriteResponseDto> {
    // Check if already exists
    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        userId,
        imdbId: createFavoriteDto.imdbId,
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Movie is already in favorites');
    }

    const favorite = this.favoriteRepository.create({
      userId,
      ...createFavoriteDto,
    });

    const savedFavorite = await this.favoriteRepository.save(favorite);

    return this.mapToResponseDto(savedFavorite);
  }

  async updateFavorite(
    id: string,
    userId: string,
    updateFavoriteDto: UpdateFavoriteDto,
  ): Promise<FavoriteResponseDto> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite movie not found');
    }

    // Ensure the favorite belongs to the user
    if (favorite.userId !== userId) {
      throw new ForbiddenException('You can only update your own favorites');
    }

    Object.assign(favorite, updateFavoriteDto);

    const updatedFavorite = await this.favoriteRepository.save(favorite);

    return this.mapToResponseDto(updatedFavorite);
  }

  async deleteFavorite(id: string, userId: string): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite movie not found');
    }

    // Ensure the favorite belongs to the user
    if (favorite.userId !== userId) {
      throw new ForbiddenException('You can only delete your own favorites');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async searchMovies(title: string, page = 1) {
    return this.omdbService.searchMoviesByTitle(title, page);
  }

  async getMovieDetails(imdbId: string) {
    return this.omdbService.getMovieById(imdbId);
  }

  private mapToResponseDto(favorite: Favorite): FavoriteResponseDto {
    return {
      id: favorite.id,
      userId: favorite.userId,
      imdbId: favorite.imdbId,
      title: favorite.title,
      year: favorite.year,
      poster: favorite.poster,
      genre: favorite.genre,
      plot: favorite.plot,
      imdbRating: favorite.imdbRating,
      director: favorite.director,
      actors: favorite.actors,
      runtime: favorite.runtime,
      createdAt: favorite.createdAt,
      updatedAt: favorite.updatedAt,
    };
  }
}
