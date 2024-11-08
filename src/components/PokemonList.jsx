// PokemonList.js
import { useContext } from 'react';
import { PokemonContext } from '../context/PokemonContext';
import { CardPokemon } from './CardPokemon';
import { Loader } from './Loader';

export const PokemonList = () => {
  // Usa el contexto PokemonContext para obtener los Pokémon, el estado de carga y los Pokémon filtrados.
  const { allPokemons, loading, filteredPokemons } = useContext(PokemonContext);

  return (
    <>
      {/* Verifica si está en estado de carga. */}
      {loading ? (
        // Si está cargando, muestra el componente Loader.
        <Loader />
      ) : ( // Si no está cargando:
        <div className="card-list-pokemon container">
          {/* Verifica si hay Pokémon filtrados. */}
          {filteredPokemons.length ? (
            //Si hay Pokémon filtrados, mapea sobre ellos.
            filteredPokemons.map((pokemon) => (
              // Renderiza un componente CardPokemon para cada Pokémon filtrado, usando su ID como clave.
              <CardPokemon pokemon={pokemon} key={pokemon.id} />
            ))
          ) : ( // Si no hay Pokémon filtrados:
            // Mapea sobre todos los Pokémon disponibles.
            allPokemons.map((pokemon) => (
              // Renderiza un componente CardPokemon para cada Pokémon, usando su ID como clave.
              <CardPokemon pokemon={pokemon} key={pokemon.id} />
            ))
          )}
        </div>
      )}
    </>
  );
};