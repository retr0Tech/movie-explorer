import { ApiProperty } from '@nestjs/swagger';

export class FavoriteResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Favorite ID' })
  id: string;

  @ApiProperty({ example: 'auth0|123456789', description: 'User ID' })
  userId: string;

  @ApiProperty({ example: 'tt0111161', description: 'IMDB movie ID' })
  imdbId: string;

  @ApiProperty({ example: 'The Shawshank Redemption', description: 'Movie title' })
  title: string;

  @ApiProperty({ example: '1994', description: 'Release year' })
  year: string;

  @ApiProperty({ example: 'https://example.com/poster.jpg', description: 'Movie poster URL', required: false })
  poster?: string;

  @ApiProperty({ example: 'Drama', description: 'Movie genre', required: false })
  genre?: string;

  @ApiProperty({ example: 'Two imprisoned men bond...', description: 'Movie plot summary', required: false })
  plot?: string;

  @ApiProperty({ example: '9.3', description: 'IMDB rating', required: false })
  imdbRating?: string;

  @ApiProperty({ example: 'Frank Darabont', description: 'Movie director', required: false })
  director?: string;

  @ApiProperty({ example: 'Tim Robbins, Morgan Freeman', description: 'Main actors', required: false })
  actors?: string;

  @ApiProperty({ example: '142 min', description: 'Movie runtime', required: false })
  runtime?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}
