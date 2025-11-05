import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getFavoriteMoviesAsync, getMoviesAsync, selectMovies, selectTotalMovies, setMovies, setTotalMovies } from '../../store/movie/movie-slice';
import MoviesGrid from '../movies/MoviesGrid';
import { useAuth0 } from '@auth0/auth0-react';

export default function MoviesExplorer() {
	const dispatch = useAppDispatch();
	const movies = useAppSelector(selectMovies);
	const totalRecords = useAppSelector(selectTotalMovies);
	const { getAccessTokenSilently} = useAuth0();
	const [title, setTitle] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [isActive, setIsActive] = useState(false);

	const handleSearch = async (page: number) => {
		setIsActive(true);
		if (title.trim()) {
			setIsLoading(true);
			const token = await getAccessTokenSilently();
			await dispatch(getFavoriteMoviesAsync(token));
			await dispatch(getMoviesAsync(title.trim(), page, token));
			setIsLoading(false);
		}
	};
	const onPageChange = async (event: { page: number; first: number}) => {
		const { page, first } = event;
		setPage(first);
    await handleSearch(page+1);
	}

	const handleReset = () => {		
		setTitle('');
		dispatch(setMovies([]));
		dispatch(setTotalMovies(0));
		setIsActive(false);
	};

	return (
		<div>
		<Panel header="Search Movies" style={{marginBottom: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px'}}>
			<div className='movie-explorer'>
				<div className='movie-explorer-options'>
						<InputText
							id="title"
							placeholder="Enter movie title..."
							value={title}
							onChange={(e) => setTitle(e?.target?.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
							style={{ width: '100%' }}
						/>
					<Button
						label='Search'
						icon="pi pi-search"
						onClick={() => {handleSearch(1)}}
						loading={isLoading}
					></Button>
					<Button
						label='Reset'
						icon="pi pi-times"
						severity='secondary'
						onClick={handleReset}
						disabled={isLoading}
					></Button>
				</div>
			</div>
		</Panel>
		{isActive && <MoviesGrid movies={movies} totalRecords={totalRecords} isLoading={isLoading} onPageChange={onPageChange} currentPage={page}></MoviesGrid>}
	</div>
	)
}
