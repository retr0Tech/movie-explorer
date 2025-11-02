import { MovieType } from "../../enums/movie-type";
import { MovieResponse } from "./movie-response";


export class Movie implements MovieResponse {
    constructor(
        public title: string,
        public year: number,
        public imdbID: string,
        public type: MovieType,
        public poster: string,
        public isFavorite: boolean
    ) {}
}