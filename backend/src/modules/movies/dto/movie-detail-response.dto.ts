import { ApiProperty } from '@nestjs/swagger';

export class MovieDetailResponseDto {
  @ApiProperty({ description: 'Movie title', example: 'Inception' })
  Title: string;

  @ApiProperty({ description: 'Release year', example: '2010' })
  Year: string;

  @ApiProperty({ description: 'Rating', example: 'PG-13' })
  Rated: string;

  @ApiProperty({ description: 'Release date', example: '16 Jul 2010' })
  Released: string;

  @ApiProperty({ description: 'Runtime', example: '148 min' })
  Runtime: string;

  @ApiProperty({ description: 'Genres', example: 'Action, Sci-Fi, Thriller' })
  Genre: string;

  @ApiProperty({ description: 'Director', example: 'Christopher Nolan' })
  Director: string;

  @ApiProperty({
    description: 'Writers',
    example: 'Christopher Nolan',
  })
  Writer: string;

  @ApiProperty({
    description: 'Actors',
    example: 'Leonardo DiCaprio, Joseph Gordon-Levitt',
  })
  Actors: string;

  @ApiProperty({ description: 'Plot summary' })
  Plot: string;

  @ApiProperty({ description: 'Languages', example: 'English, Japanese' })
  Language: string;

  @ApiProperty({ description: 'Country', example: 'USA, UK' })
  Country: string;

  @ApiProperty({ description: 'Awards' })
  Awards: string;

  @ApiProperty({
    description: 'Poster URL',
    example: 'https://example.com/poster.jpg',
  })
  Poster: string;

  @ApiProperty({
    description: 'Ratings from various sources',
    type: [Object],
  })
  Ratings: Array<{ Source: string; Value: string }>;

  @ApiProperty({ description: 'Metascore', example: '74' })
  Metascore: string;

  @ApiProperty({ description: 'IMDB Rating', example: '8.8' })
  imdbRating: string;

  @ApiProperty({ description: 'IMDB Votes', example: '2,000,000' })
  imdbVotes: string;

  @ApiProperty({ description: 'IMDB ID', example: 'tt1375666' })
  imdbID: string;

  @ApiProperty({ description: 'Type of content', example: 'movie' })
  Type: string;

  @ApiProperty({ description: 'DVD release date', required: false })
  DVD?: string;

  @ApiProperty({ description: 'Box office earnings', required: false })
  BoxOffice?: string;

  @ApiProperty({ description: 'Production company', required: false })
  Production?: string;

  @ApiProperty({ description: 'Website', required: false })
  Website?: string;

  @ApiProperty({ description: 'Response status', example: 'True' })
  Response: string;

  @ApiProperty({
    description: 'Whether the movie is in user favorites',
    example: false,
  })
  isFavorite: boolean;
}
