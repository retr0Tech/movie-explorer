import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Favorite } from './entities/favorite.orm-entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { FavoriteResponseDto } from './dto/favorite-response.dto';
import { PaginatedFavoritesResponseDto } from './dto/paginated-favorites-response.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async getFavorites(
    userId: string,
    page = 1,
    limit = 10,
    filter?: string,
  ): Promise<PaginatedFavoritesResponseDto> {
    // Ensure positive values
    const currentPage = Math.max(1, page);
    const itemsPerPage = Math.max(1, Math.min(100, limit)); // Max 100 items per page

    const skip = (currentPage - 1) * itemsPerPage;
    const whereCondition = {
      userId,
    };
    if (filter && filter !== '') whereCondition['title'] = Like(`${filter}%`);

    const [favorites, total] = await this.favoriteRepository.findAndCount({
      where: whereCondition,
      order: { createdAt: 'DESC' },
      skip,
      take: itemsPerPage,
    });

    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      data: favorites.map(this.mapToResponseDto),
      total,
      page: currentPage,
      limit: itemsPerPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }

  async getFavoriteByImdbId(
    imdbId: string,
    userId: string,
  ): Promise<FavoriteResponseDto> {
    const favorite = await this.favoriteRepository.findOne({
      where: { imdbId, userId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite movie not found');
    }

    return this.mapToResponseDto(favorite);
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
