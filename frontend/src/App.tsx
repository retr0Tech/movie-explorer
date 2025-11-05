import React, { useRef, useState, useEffect } from 'react';
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

// Create a context for Dark Mode
export const DarkModeContext = React.createContext<{
  darkMode: boolean;
  toggleDarkMode: () => void;
} | null>(null);

export const App = () => {
    const toast = useRef<Toast | null>(null);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prev: boolean) => !prev);
    };

    return (
	<DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
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
	</DarkModeContext.Provider>
    );
}

export default App;
