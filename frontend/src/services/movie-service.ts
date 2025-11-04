import { FavoriteMovie } from "../models/favorites/favorite-movie";
import { FavoriteMovieResponse } from "../models/favorites/favorite-movie-response";
import { UpdateFavorite } from "../models/favorites/update-favorite-movie";
import { OmdbSearchResponseDto, OmdbMovieDetailDto } from "../models/movies/movie-response";
import * as omdbService from "./base-service";
import * as backendService from "./backend-service";

export const getMovie = () => {
    const _get = omdbService.get<OmdbSearchResponseDto>();
    return async (title: string, page: number = 1, token?: string) => {
        return await _get(`movies/search?title=${title}&page=${page}`, {}, token);
    }
};

export const getMovieById = () => {
    const _get = omdbService.get<OmdbMovieDetailDto>();
    return async (movieId: string) => {
        return await _get(`movies/${movieId}`);
    }
};

// Backend API calls (for favorites management)
export const getFavoriteMovies = () => {
    const _get = backendService.get<FavoriteMovieResponse[]>();
    return async (token: string) => {
        return await _get('/favorites', token);
    }
};

export const getFavoriteMovieById = () => {
    const _get = backendService.get<FavoriteMovieResponse>();
    return async (token: string, movieId: string) => {
        return await _get(`/favorites/${movieId}`, token);
    }
};

export const markAsFavorite = () => {
    const _post = backendService.post<FavoriteMovieResponse, FavoriteMovie>();
    return async (token: string, markAsFavoriteBody: FavoriteMovie) => {
        return await _post('/favorites', token, markAsFavoriteBody);
    }
};

export const updateFavorite = () => {
    const _put = backendService.put<FavoriteMovieResponse, UpdateFavorite>();
    return async (token: string, id: string, updateBody: UpdateFavorite) => {
        return await _put(`/favorites/${id}`, token, updateBody);
    }
};

export const deleteFavorite = () => {
    const deleteRes = backendService._delete<void>();
    return async (id: string, token: string) => {
        return await deleteRes(`/favorites/${id}`, token);
    }
};