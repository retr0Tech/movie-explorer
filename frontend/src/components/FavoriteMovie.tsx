// import { GenericResponse } from "../models/generic-response";
// import { MarkAsFavoriteBody, MarkAsFavoriteResponse } from "../models/movies/favorite-marker-body";
// import { Movie } from "../models/movies/movie";
// import { markAsFavorite } from "../services/movie-service";
// import { useAppDispatch, useAppSelector } from "../store/hooks";
// import { setFavoriteMovie } from "../store/movies/movies-slice";

// export const FavoriteMovie = ({
//     movie
// }: {
//     movie: Movie
// }) => {
//     const _markAsFavorite = markAsFavorite();
//     const dispatch = useAppDispatch();

//     const handleMarkAsFavorite = (movie: Movie) => {
//         _markAsFavorite(
//             new MarkAsFavoriteBody(movie.id, !movie.isFavorite)
//         ).then((markAsFavoriteResponse: GenericResponse<MarkAsFavoriteResponse>) => {
//             if (markAsFavoriteResponse.success) {
//                 const movieClone = { ...movie };
//                 movieClone.isFavorite = !movieClone.isFavorite;
//                 dispatch(setFavoriteMovie(movieClone));
//             }
//         });
//     }
//     const iconClassName = movie.isFavorite ?  'pi-star-fill' : 'pi-star';
	
//     return (
//         <i
//             className={ `pi ${iconClassName}` }
//             onClick={ () => handleMarkAsFavorite(movie) }
//             style={ { cursor: 'pointer', fontSize: '1.5rem', color: 'F6BE00'} }
//         ></i>
//     );
// }

// export default FavoriteMovie;
import React from 'react'

export default function FavoriteMovie() {
	return (
		<div>FavoriteMovie</div>
	)
}
