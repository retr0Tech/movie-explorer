import { MovieType } from "../../enums/movie-type";
export interface OmdbMovieDto {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}
export interface OmdbSearchResponseDto {
  Search: OmdbMovieDto[];
  totalResults: string;
  Response: string;
}
export interface OmdbMovieDetailDto {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}
export interface MovieResponse  {
	title: string,
	year: number,
	imdbID: string,
	type: MovieType,
	poster: string
}