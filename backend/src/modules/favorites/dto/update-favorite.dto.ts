import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFavoriteDto {
  @ApiProperty({ example: 'The Shawshank Redemption', description: 'Movie title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '1994', description: 'Release year', required: false })
  @IsString()
  @IsOptional()
  year?: string;

  @ApiProperty({ example: 'https://example.com/poster.jpg', description: 'Movie poster URL', required: false })
  @IsString()
  @IsOptional()
  poster?: string;

  @ApiProperty({ example: 'Drama', description: 'Movie genre', required: false })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({ example: 'Two imprisoned men bond...', description: 'Movie plot summary', required: false })
  @IsString()
  @IsOptional()
  plot?: string;

  @ApiProperty({ example: '9.3', description: 'IMDB rating', required: false })
  @IsString()
  @IsOptional()
  imdbRating?: string;

  @ApiProperty({ example: 'Frank Darabont', description: 'Movie director', required: false })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiProperty({ example: 'Tim Robbins, Morgan Freeman', description: 'Main actors', required: false })
  @IsString()
  @IsOptional()
  actors?: string;

  @ApiProperty({ example: '142 min', description: 'Movie runtime', required: false })
  @IsString()
  @IsOptional()
  runtime?: string;
}
