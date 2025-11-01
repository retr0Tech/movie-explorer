import { Routes ,Route } from 'react-router-dom';
import Home from '../pages/Home';

export const RouterConfig = () => {
    return (
        <Routes>
					<Route path='/' element={ <Home/> } />
        </Routes>
    );
};

export default RouterConfig;