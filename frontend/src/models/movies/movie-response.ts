import { MovieType } from "../../enums/movie-type";

export interface MovieResponse  {
	title: String,
	year: number,
	imdbID: String,
	type: MovieType,
	poster: String
}