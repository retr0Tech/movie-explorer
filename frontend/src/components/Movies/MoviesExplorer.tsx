import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getMoviesAsync, selectMovies } from '../../store/movie/movie-slice';
import MoviesGrid from './MoviesGrid';

export default function MoviesExplorer() {
	const dispatch = useAppDispatch();
	const movies = useAppSelector(selectMovies);
	const [title, setTitle] = useState('');
	const [date, setDate] = useState<Date | null>(null);

	const handleSearch = () => {
		if (title.trim()) {
			dispatch(getMoviesAsync(title.trim(), 1));
		}
	};

	const handleReset = () => {
		setTitle('');
		setDate(null);
	};

	return (
		<div>
		<Panel header="Search Movie By Title">
			<div className='movie-explorer'>
				<FloatLabel>
					<InputText id="title" value={title} onChange={(e) => setTitle(e.target.value)}></InputText>
					<label htmlFor="Title">Title</label>
				</FloatLabel>
				<FloatLabel>
					<Calendar value={date} onChange={(e) => setDate(e.value ?? null)} view="year" dateFormat="yy" showIcon/>
					<label htmlFor="Year">Year</label>
				</FloatLabel>
				<div className='movie-explorer-options'>
					<Button label='Search' onClick={handleSearch}></Button>
					<Button label='Reset' severity='secondary' onClick={handleReset}></Button>
				</div>
			</div>
		</Panel>
		<MoviesGrid movies={movies}></MoviesGrid>
	</div>
	)
}
