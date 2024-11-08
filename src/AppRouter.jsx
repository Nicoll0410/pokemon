import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage, PokemonPage, SearchPage } from './pages';

export const AppRouter = () => {
	return (
		// Componente que define las rutas de la aplicación.
		<Routes>
			{/* Define una ruta para la raíz ('/') que renderiza el componente Navigation. */}
			<Route path='/' element={<Navigation />}>
				{/* Ruta por defecto que renderiza HomePage cuando se accede a la raíz. */}
				<Route index element={<HomePage />} />
				{/* Ruta que renderiza PokemonPage cuando se accede a '/pokemon/:id', donde :id es un parámetro dinámico. */}
				<Route path='pokemon/:id' element={<PokemonPage />} />
				{/* Ruta que renderiza SearchPage cuando se accede a '/search'. */}
				<Route path='search' element={<SearchPage />} />
			</Route>

			{/* Ruta comodín que redirige a la raíz ('/') para cualquier ruta no definida. */}
            <Route path='*' element={<Navigate to='/' />} />
		</Routes>
	);
};