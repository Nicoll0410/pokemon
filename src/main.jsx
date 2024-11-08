import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		{/* Envuelve la aplicación en el componente BrowserRouter para habilitar la navegación. */}
		<BrowserRouter>
			{/* // Envuelve la aplicación en el componente BrowserRouter para habilitar la navegación. */}
			<App />
		</BrowserRouter>
	</React.StrictMode>
);