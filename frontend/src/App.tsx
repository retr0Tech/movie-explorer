import React, { useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterConfig from './navigation/RouterConfig';
import './App.css';
import "primereact/resources/themes/lara-light-blue/theme.css";  //theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import './theme.css'; // Custom theme
import PrimeReact from 'primereact/api';
import { Toast } from 'primereact/toast';

PrimeReact.ripple = true;

// Create a context for Toast
export const ToastContext = React.createContext<React.RefObject<Toast | null> | null>(null);

export const App = () => {
    const toast = useRef<Toast | null>(null);

    return (
	<ToastContext.Provider value={toast}>
	    <div className = "App" >
		    <Toast ref={toast} />
		    <Router>
			    <div className="p-mx-auto p-mt-5 tabview">
				    <RouterConfig></RouterConfig>
			    </div>
		    </Router>
	    </div>
	</ToastContext.Provider>
    );
}

export default App;
