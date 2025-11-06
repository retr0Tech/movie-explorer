import { FavoriteMovieResponse } from "./favorite-movie-response";

export interface PaginatedFavoritesResponse {
  data: FavoriteMovieResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
