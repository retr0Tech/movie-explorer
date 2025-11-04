import { Routes ,Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProtectedRoute from './ProtectedRoute';

export const RouterConfig = () => {
    return (
        <Routes>
            <Route path='/' element={ <ProtectedRoute><Home /></ProtectedRoute>} />
        </Routes>
    );
};

export default RouterConfig;