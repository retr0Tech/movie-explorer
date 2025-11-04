import { BrowserRouter as Router } from 'react-router-dom';
import RouterConfig from './navigation/RouterConfig';
import './App.css';
import "primereact/resources/themes/lara-light-blue/theme.css";  //theme
import PrimeReact from 'primereact/api';

PrimeReact.ripple = true;
export const App = () => {
    return (
	<div className = "App" >
		<Router>
			<div className="p-mx-auto p-mt-5 tabview">
				<RouterConfig></RouterConfig>
			</div>
		</Router>
	</div>
    );
}

export default App;
