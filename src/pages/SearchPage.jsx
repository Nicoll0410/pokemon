import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CardPokemon } from '../components';
import { PokemonContext } from '../context/PokemonContext';

export const SearchPage = () => {
	// Obtiene la ubicación actual de la ruta usando useLocation.
	const location = useLocation();

	// Utiliza el contexto PokemonContext y desestructura la lista de Pokémon global
	const { globalPokemons } = useContext(PokemonContext);

	// Filtra la lista de Pokémon global para encontrar coincidencias con el nombre.
	const filteredPokemons = globalPokemons.filter(pokemon =>
		// Comprueba si el nombre del Pokémon incluye el texto de búsqueda en minúsculas.
		pokemon.name.includes(location.state.toLowerCase())
	);

	return (
		<div className='container'>
			<p className='p-search'>
				{/* Muestra la cantidad de Pokémon filtrados. */}
				Se encontraron <span>{filteredPokemons.length}</span>{' '}
				resultados:
			</p>
			<div className='card-list-pokemon container'>
				{/* Mapea sobre los Pokémon filtrados. */}
				{filteredPokemons.map(pokemon => (
					// Renderiza un componente CardPokemon para cada Pokémon filtrado, usando su ID como clave.
					<CardPokemon pokemon={pokemon} key={pokemon.id} />
				))}
			</div>
		</div>
	);
};