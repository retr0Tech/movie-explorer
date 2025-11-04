import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../models/movies/movie";
import { MovieResponse } from "../../models/movies/movie-response";
import { AppThunk, RootState } from "../index";
import { MovieType } from "../../enums/movie-type";
import * as movieService from "../../services/movie-service";

export interface MoviesState {
    movies: Movie[];
    totalMovies: number;
    favoriteMovies: Movie[];
};

const initialState: MoviesState = {
    movies: [],
    totalMovies: 0,
    favoriteMovies: JSON.parse(sessionStorage.getItem('favorite-movies') || '[]')
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
                poster: movie.Poster
            }));
            const totalRecords = parseInt(moviesResponse.data.totalResults)
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
            // Map FavoriteMovieResponse[] to MovieResponse[]
            const movieResponses: MovieResponse[] = favoritesResponse.data.map(fav => ({
                title: fav.title,
                year: parseInt(fav.year),
                imdbID: fav.imdbId,
                type: MovieType.Movie,
                poster: fav.poster
            }));
            dispatch(setFavoriteMovies(movieResponses));
        }
    };
}

export const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        setMovies: (state, action: PayloadAction<MovieResponse[]>) => {
            const movies: Movie[] = action.payload.map((movieResponse) => {
                return new Movie(
                    movieResponse.title as string,
                    movieResponse.year,
                    movieResponse.imdbID as string,
                    movieResponse.type,
                    movieResponse.poster as string,
                    state.favoriteMovies.map(x => x.imdbID).includes(movieResponse.imdbID)
                );
            });
            state.movies = movies;
        },
        setTotalMovies: (state, action: PayloadAction<number>) => {
            state.totalMovies = action.payload;
        },
        setFavoriteMovies: (state, action: PayloadAction<MovieResponse[]>) => {
            const favoriteMovies = action.payload.map((movieResponse) => {
                return new Movie(
                    movieResponse.title as string,
                    movieResponse.year,
                    movieResponse.imdbID as string,
                    movieResponse.type,
                    movieResponse.poster as string,
                    true
                );
            });
            sessionStorage.setItem('favorite-movies', JSON.stringify(favoriteMovies));
            state.favoriteMovies = favoriteMovies;
        },
        setFavoriteMovie: (state, action: PayloadAction<Movie>) => {
            const favoriteMovieClone = { ...action.payload };
            const moviesClone: Movie[] = [ ...state.movies ];
            const indexInMovies: number = moviesClone.map(x => x.imdbID).indexOf(favoriteMovieClone.imdbID);
            if (indexInMovies > -1) {
                moviesClone.splice(indexInMovies, 1);
                moviesClone.splice(indexInMovies, 0, favoriteMovieClone);
            }
            const favoriteMoviesClone: Movie[] = [ ...state.favoriteMovies ];
            if (favoriteMovieClone.isFavorite) {
                favoriteMoviesClone.push(favoriteMovieClone);
            } else {
                const indexInFavoriteMovies: number = favoriteMoviesClone.map(x => x.imdbID).indexOf(favoriteMovieClone.imdbID);
                if (indexInFavoriteMovies > -1) {
                    favoriteMoviesClone.splice(indexInFavoriteMovies, 1);
                }
            }
            sessionStorage.setItem('favorite-movies', JSON.stringify(favoriteMoviesClone));
            state.favoriteMovies = favoriteMoviesClone;
            state.movies = moviesClone;
        }
    }
});

export const {
    setMovies,
    setFavoriteMovies,
    setFavoriteMovie,
    setTotalMovies,
} = moviesSlice.actions;

export const selectMovies = (state: RootState) => state.movies.movies;
export const selectFavoriteMovies = (state: RootState) => state.movies.favoriteMovies;
export const selectTotalMovies = (state: RootState) => state.movies.totalMovies;

export default moviesSlice.reducer;