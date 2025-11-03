import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  imdbId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  @IsOptional()
  poster?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  plot?: string;

  @IsString()
  @IsOptional()
  imdbRating?: string;

  @IsString()
  @IsOptional()
  director?: string;

  @IsString()
  @IsOptional()
  actors?: string;

  @IsString()
  @IsOptional()
  runtime?: string;
}
