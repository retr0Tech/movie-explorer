import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../models/movies/movie";
import { MovieResponse } from "../../models/movies/movie-response";
import { AppThunk, RootState } from "../index";
import { MovieType } from "../../enums/movie-type";
import * as movieService from "../../services/movie-service";
import { FavoriteMovie } from "../../models/favorites/favorite-movie";

export interface MoviesState {
    movies: Movie[];
    totalMovies: number;
    favoriteMovies: FavoriteMovie[];
};

const initialState: MoviesState = {
    movies: [],
    totalMovies: 0,
    favoriteMovies: []
};

export const getMoviesAsync = (
    title: string,
    page?: number,
    token?: string | null | undefined
): AppThunk<Promise<void>> => {
    return async (dispatch) => {
        const getMovieService = movieService.getMovie();
        const moviesResponse = await getMovieService(title, page || 1, token || undefined);
        if (moviesResponse.success && moviesResponse.data && moviesResponse.data.Search) {
            const movieResponses: MovieResponse[] = moviesResponse.data.Search.map(movie => ({
                title: movie.Title,
                year: parseInt(movie.Year),
                imdbID: movie.imdbID,
                type: movie.Type as MovieType,
                poster: movie.Poster,
                isFavorite: false
            } as MovieResponse));
            const totalRecords = Number(moviesResponse.data.totalResults)
            dispatch(setTotalMovies(totalRecords))
            dispatch(setMovies(movieResponses));
        }
    };
}

export const getFavoriteMoviesAsync = (
    token?: string
): AppThunk<Promise<void>> => {
    return async (dispatch) => {
        const authToken = token;

        if (!authToken) {
            console.error('No token available to fetch favorites');
            return;
        }

        const getFavoritesService = movieService.getFavoriteMovies();
        const favoritesResponse = await getFavoritesService(authToken);
        if (favoritesResponse.success && favoritesResponse.data) {
            dispatch(setFavoriteMovies(favoritesResponse.data));
        }
    };
}

export const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setMovies: (state, action: PayloadAction<MovieResponse[]>) => {
            const movies: Movie[] = action.payload.map((movieResponse) => {
                return {
                    title: movieResponse.title as string,
                    year: movieResponse.year,
                    imdbID: movieResponse.imdbID as string,
                    type: movieResponse.type,
                    poster: movieResponse.poster as string,
                    isFavorite: state.favoriteMovies.map(x => x.imdbId).includes(movieResponse.imdbID)
                };
            });
            state.movies = movies;
        },
        setTotalMovies: (state, action: PayloadAction<number>) => {
            state.totalMovies = action.payload;
        },
        setFavoriteMovies: (state, action: PayloadAction<FavoriteMovie[]>) => {
            state.favoriteMovies = action.payload;
        }
    }
});

export const {
    setMovies,
    setFavoriteMovies,
    setTotalMovies,
} = moviesSlice.actions;

export const selectMovies = (state: RootState) => state.movies.movies;
export const selectFavoriteMovies = (state: RootState) => state.movies.favoriteMovies;
export const selectTotalMovies = (state: RootState) => state.movies.totalMovies;

export default moviesSlice.reducer;