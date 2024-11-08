import { useContext } from 'react'; // Importa el hook useContext desde React.
import { Link } from 'react-router-dom'; // Importa el componente Link desde react-router-dom para la navegación.
import { PokemonContext } from '../context/PokemonContext'; // Importa el contexto PokemonContext desde el archivo correspondiente.

export const CardPokemon = ({ pokemon }) => { // Define el componente CardPokemon que recibe un objeto pokemon como prop.
    const { getMaxEvolution } = useContext(PokemonContext); // Usa el contexto PokemonContext para obtener la función getMaxEvolution.

    return (
        <Link to={`/pokemon/${pokemon.id}`} className="card-pokemon"> // Crea un enlace que redirige a la página del Pokémon usando su ID.
            <div className="card-img">
                <img
                    src={pokemon.sprites.other.dream_world.front_default} // Establece la fuente de la imagen usando la URL del sprite del Pokémon.
                    alt={`Pokemon ${pokemon.name}`} // Establece el texto alternativo de la imagen con el nombre del Pokémon.
                />
            </div>
            {/* Crea un contenedor para la información del Pokémon. */}
            <div className="card-info">
                {/* Muestra el ID del Pokémon en un span. */}
                <span className="pokemon-id">N° {pokemon.id}</span>
                {/* Muestra el nombre del Pokémon en un encabezado h3. */}
                <h3>{pokemon.name}</h3>
                <div className="card-types">
                    {pokemon.types.map(type => ( // Mapea sobre los tipos del Pokémon y crea un elemento para cada uno.
                        // Crea un span para cada tipo, usando el nombre del tipo como clave y clase.
                        <span key={type.type.name} className={type.type.name}>
                            {/* Muestra el nombre del tipo dentro del span. */}
                            {type.type.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
};