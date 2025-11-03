import { useState } from 'react';
import { DataView } from 'primereact/dataview';
import { Movie } from '../../models/movies/movie'

export default function MoviesGrid({movies}: {movies: Movie[]}) {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div className="dataview-demo">
				<div className="card">
					<DataView 
						value={movies} 
						layout={'grid'} 
						lazy
						paginator 
						rows={10}
						totalRecords={ 10 }
						onPage={ () => {} }
						loading={ isLoading } />
				</div>
			</div>
	)
}
