import { FavoriteMovie } from "../models/favorites/favorite-movie";
import { FavoriteMovieResponse } from "../models/favorites/favorite-movie-response";
import { UpdateFavorite } from "../models/favorites/update-favorite-movie";
import { OmdbSearchResponseDto, OmdbMovieDetailDto, OmdbMovieDetailWithAnalysisDto } from "../models/movies/movie-response";
import { RecommendationResponse } from "../models/recommendations/recommendation-response";
import * as baseService from "./base-service";

export const getMovie = () => {
    const _get = baseService.get<OmdbSearchResponseDto>();
    return async (title: string, page: number = 1, token?: string) => {
        return await _get(`movies/search?title=${title}&page=${page}`, {'Authorization': `Bearer ${token}`});
    }
};

export const getMovieById = () => {
    const _get = baseService.get<OmdbMovieDetailDto>();
    return async (movieId: string, token: string) => {
        return await _get(`movies/${movieId}`, {'Authorization': `Bearer ${token}`});
    }
};

export const getMovieByIdWithAnalysis = () => {
    const _get = baseService.get<OmdbMovieDetailWithAnalysisDto>();
    return async (movieId: string, token: string) => {
        return await _get(`movies/${movieId}/analysis`, {'Authorization': `Bearer ${token}`});
    }
};

// Backend API calls (for favorites management)
export const getFavoriteMovies = () => {
    const _get = baseService.get<FavoriteMovieResponse[]>();
    return async (token: string) => {
        return await _get('favorites', {'Authorization': `Bearer ${token}`});
    }
};

export const getFavoriteMoviesPaginated = () => {
    const _get = baseService.get<{
        data: FavoriteMovieResponse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>();
    return async (token: string, page: number = 1, limit: number = 10, filter: string) => {
        return await _get(`favorites?page=${page}&limit=${limit}&filter=${filter}`, {'Authorization': `Bearer ${token}`});
    }
};

export const getFavoriteMovieByImdbId = () => {
    const _get = baseService.get<FavoriteMovieResponse>();
    return async (movieId: string, token: string,) => {
        return await _get(`favorites/imdbId/${movieId}`, {'Authorization': `Bearer ${token}`});
    }
};

export const getFavoriteMovieById = () => {
    const _get = baseService.get<FavoriteMovieResponse>();
    return async (token: string, movieId: string) => {
        return await _get(`favorites/${movieId}`, {'Authorization': `Bearer ${token}`});
    }
};

export const markAsFavorite = () => {
    const _post = baseService.post<FavoriteMovieResponse, FavoriteMovie>();
    return async (token: string, markAsFavoriteBody: FavoriteMovie) => {
        return await _post('favorites', markAsFavoriteBody, {'Authorization': `Bearer ${token}`});
    }
};

export const updateFavorite = () => {
    const _put = baseService.put<FavoriteMovieResponse, UpdateFavorite>();
    return async (token: string, id: string, updateBody: UpdateFavorite) => {
        return await _put(`favorites/${id}`, updateBody, {'Authorization': `Bearer ${token}`});
    }
};

export const deleteFavorite = () => {
    const deleteRes = baseService._delete<void>();
    return async (id: string, token: string) => {
        return await deleteRes(`favorites/${id}`, {'Authorization': `Bearer ${token}`});
    }
};

export const getRecommendations = () => {
    const _get = baseService.get<RecommendationResponse>();
    return async (imdbId: string, token: string) => {
        return await _get(`recommendations/${imdbId}`, {'Authorization': `Bearer ${token}`});
    }
};