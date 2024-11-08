import { AppRouter } from './AppRouter';
import { PokemonProvider } from './context/PokemonProvider';

function App() {
	return (
		// Envuelve el contenido en el proveedor de contexto PokemonProvider, que proporciona el estado global de Pokémon a sus componentes hijos.
		<PokemonProvider>
			{/* Renderiza el componente AppRouter, que maneja las rutas de la aplicación. */}
			<AppRouter />
		</PokemonProvider>
	);
}

// Exporta el componente App como el valor predeterminado del módulo.
export default App;