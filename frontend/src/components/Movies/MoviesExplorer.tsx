import { Button } from 'primereact/button'
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getMoviesAsync, selectMovies, selectTotalMovies, setMovies, setTotalMovies } from '../../store/movie/movie-slice';
import MoviesGrid from './MoviesGrid';
import { useAuth0 } from '@auth0/auth0-react';

export default function MoviesExplorer() {
	const dispatch = useAppDispatch();
	const movies = useAppSelector(selectMovies);
	const totalRecords = useAppSelector(selectTotalMovies);
	const { getAccessTokenSilently } = useAuth0();
	const [title, setTitle] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [page, setPage] = useState(0);
	const [isActive, setIsActive] = useState(false);

	const handleSearch = async (page: number) => {
		setIsActive(true);
		if (title.trim()) {
			setIsLoading(true);
			const token = await getAccessTokenSilently();
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
		<Panel header="Search Movie By Title" style={{marginBottom: '20px'}}>
			<div className='movie-explorer'>
				<FloatLabel>
					<InputText id="title" value={title} onChange={(e) => setTitle(e.target.value)}></InputText>
					<label htmlFor="Title">Title</label>
				</FloatLabel>
				<div className='movie-explorer-options'>
					<Button label='Search' onClick={() => {handleSearch(1)}}></Button>
					<Button label='Reset' severity='secondary' onClick={handleReset}></Button>
				</div>
			</div>
		</Panel>
		{isActive && <MoviesGrid movies={movies} totalRecords={totalRecords} isLoading={isLoading} onPageChange={onPageChange} currentPage={page}></MoviesGrid>}
	</div>
	)
}
