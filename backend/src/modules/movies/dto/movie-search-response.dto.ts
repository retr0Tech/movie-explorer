import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({ description: 'Movie title', example: 'Inception' })
  Title: string;

  @ApiProperty({ description: 'Release year', example: '2010' })
  Year: string;

  @ApiProperty({ description: 'IMDB ID', example: 'tt1375666' })
  imdbID: string;

  @ApiProperty({ description: 'Type of content', example: 'movie' })
  Type: string;

  @ApiProperty({
    description: 'Poster URL',
    example: 'https://example.com/poster.jpg',
  })
  Poster: string;

  @ApiProperty({
    description: 'Whether the movie is in user favorites',
    example: false,
  })
  isFavorite: boolean;
}

export class MovieSearchResponseDto {
  @ApiProperty({
    type: [MovieDto],
    description: 'Array of movies matching the search',
  })
  Search: MovieDto[];

  @ApiProperty({ description: 'Total results count', example: '245' })
  totalResults: string;

  @ApiProperty({ description: 'Response status', example: 'True' })
  Response: string;

  @ApiProperty({ description: 'Error message if any', required: false })
  Error?: string;
}
