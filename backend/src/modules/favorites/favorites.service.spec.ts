import { Test, TestingModule } from '@nestjs/testing';
import { FavoritesService } from './favorites.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.orm-entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('FavoritesService', () => {
  let service: FavoritesService;
  let repository: jest.Mocked<Repository<Favorite>>;

  const mockFavorite: Favorite = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    userId: 'user123',
    imdbId: 'tt1375666',
    title: 'Inception',
    year: '2010',
    poster: 'https://example.com/poster.jpg',
    genre: 'Action, Sci-Fi',
    plot: 'A thief who steals corporate secrets...',
    imdbRating: '8.8',
    director: 'Christopher Nolan',
    actors: 'Leonardo DiCaprio',
    runtime: '148 min',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FavoritesService>(FavoritesService);
    repository = module.get(getRepositoryToken(Favorite));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFavorites', () => {
    it('should return paginated favorites', async () => {
      const userId = 'user123';
      const favorites = [mockFavorite];
      const total = 1;

      repository.findAndCount.mockResolvedValue([favorites, total]);

      const result = await service.getFavorites(userId, 1, 10);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { userId },
        order: { createdAt: 'DESC' },
        skip: 0,
        take: 10,
      });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPreviousPage).toBe(false);
    });

    it('should handle filtering by title', async () => {
      const userId = 'user123';
      const filter = 'Inception';

      repository.findAndCount.mockResolvedValue([[mockFavorite], 1]);

      await service.getFavorites(userId, 1, 10, filter);

      expect(repository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId,
            title: expect.anything(),
          }),
        }),
      );
    });
  });

  describe('createFavorite', () => {
    it('should create a new favorite', async () => {
      const userId = 'user123';
      const createDto = {
        imdbId: 'tt1375666',
        title: 'Inception',
        year: '2010',
        poster: 'https://example.com/poster.jpg',
        genre: 'Action, Sci-Fi',
        plot: 'A thief who steals corporate secrets...',
        imdbRating: '8.8',
        director: 'Christopher Nolan',
        actors: 'Leonardo DiCaprio',
        runtime: '148 min',
      };

      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(mockFavorite);
      repository.save.mockResolvedValue(mockFavorite);

      const result = await service.createFavorite(userId, createDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId, imdbId: createDto.imdbId },
      });
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(result.imdbId).toBe('tt1375666');
    });

    it('should throw ConflictException if movie already in favorites', async () => {
      const userId = 'user123';
      const createDto = {
        imdbId: 'tt1375666',
        title: 'Inception',
        year: '2010',
        poster: 'https://example.com/poster.jpg',
        genre: 'Action, Sci-Fi',
        plot: 'A thief who steals corporate secrets...',
        imdbRating: '8.8',
        director: 'Christopher Nolan',
        actors: 'Leonardo DiCaprio',
        runtime: '148 min',
      };

      repository.findOne.mockResolvedValue(mockFavorite);

      await expect(service.createFavorite(userId, createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('deleteFavorite', () => {
    it('should delete a favorite', async () => {
      const userId = 'user123';
      const favoriteId = '123e4567-e89b-12d3-a456-426614174000';

      repository.findOne.mockResolvedValue(mockFavorite);
      repository.remove.mockResolvedValue(mockFavorite);

      await service.deleteFavorite(favoriteId, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: favoriteId },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockFavorite);
    });

    it('should throw NotFoundException if favorite not found', async () => {
      const userId = 'user123';
      const favoriteId = 'non-existent-id';

      repository.findOne.mockResolvedValue(null);

      await expect(service.deleteFavorite(favoriteId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('checkIfFavorites', () => {
    it('should return Set of favorited imdbIds', async () => {
      const userId = 'user123';
      const imdbIds = ['tt1375666', 'tt0816692'];
      const favorites = [mockFavorite];

      repository.find.mockResolvedValue(favorites);

      const result = await service.checkIfFavorites(userId, imdbIds);

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Set);
      expect(result.has('tt1375666')).toBe(true);
      expect(result.size).toBe(1);
    });

    it('should return empty Set for empty imdbIds array', async () => {
      const userId = 'user123';
      const imdbIds: string[] = [];

      const result = await service.checkIfFavorites(userId, imdbIds);

      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
      expect(repository.find).not.toHaveBeenCalled();
    });
  });

  describe('isFavorite', () => {
    it('should return true if movie is favorited', async () => {
      const userId = 'user123';
      const imdbId = 'tt1375666';

      repository.findOne.mockResolvedValue(mockFavorite);

      const result = await service.isFavorite(userId, imdbId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId, imdbId },
        select: ['id'],
      });
      expect(result).toBe(true);
    });

    it('should return false if movie is not favorited', async () => {
      const userId = 'user123';
      const imdbId = 'tt0816692';

      repository.findOne.mockResolvedValue(null);

      const result = await service.isFavorite(userId, imdbId);

      expect(result).toBe(false);
    });
  });
});
