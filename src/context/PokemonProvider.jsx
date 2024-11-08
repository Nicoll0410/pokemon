import { useEffect, useState } from 'react';
import { useForm } from '../hook/useForm';
import { PokemonContext } from './PokemonContext';

// Función para obtener la cadena de evolución de la PokéAPI
const getSpeciesData = async (pokemonId) => {
    // Realiza una solicitud a la API para obtener los datos de la especie del Pokémon.
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    // Convierte la respuesta a formato JSON.
    const speciesData = await speciesResponse.json();
    // Realiza una solicitud a la URL de la cadena de evolución obtenida.
    const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
    // Devuelve la respuesta de la cadena de evolución en formato JSON.
    return await evolutionChainResponse.json();
};

// Función para encontrar la evolución máxima en la cadena de evolución
const findMaxEvolution = (evolutionChain) => {
    // Inicializa la evolución actual con la cadena de evolución.
    let currentEvolution = evolutionChain;
    // Mientras haya evoluciones siguientes en la cadena:
    while (currentEvolution.evolves_to.length) {
        // Avanza a la siguiente evolución.
        currentEvolution = currentEvolution.evolves_to[0];
    }
    // Devuelve el nombre de la especie de la evolución máxima.
    return currentEvolution.species.name;
};

// Define el componente PokemonProvider que recibe 'children'.
export const PokemonProvider = ({ children }) => {
    // Estado para almacenar todos los Pokémon.
    const [allPokemons, setAllPokemons] = useState([]);
    // Estado para almacenar todos los Pokémon globales.
    const [globalPokemons, setGlobalPokemons] = useState([]);
    // Estado para manejar el desplazamiento (offset) de la paginación.
    const [offset, setOffset] = useState(0);


// Utilizar CustomHook - useForm
// Desestructura el valor de búsqueda y las funciones del hook useForm.
const { valueSearch, onInputChange, onResetForm } = useForm({
    // Inicializa el valor de búsqueda como una cadena vacía.
    valueSearch: '',
});

// Estados para la aplicación simples
// Estado para manejar la carga de datos.
const [loading, setLoading] = useState(true);
// Estado para manejar la activación de filtros.
const [active, setActive] = useState(false);

// Función para obtener Pokémon con un límite predeterminado de 20.
const getAllPokemons = async (limit = 20) => {
    // URL base de la API de Pokémon.
    const baseURL = 'https://pokeapi.co/api/v2/';

    // Realiza una solicitud a la API para obtener Pokémon.
    const res = await fetch(`${baseURL}pokemon?limit=${limit}&offset=${offset}`);
    // Convierte la respuesta a formato JSON.
    const data = await res.json();

    // Mapea sobre los resultados y obtiene más detalles de cada Pokémon.
    const promises = data.results.map(async pokemon => {
        // Realiza una solicitud para obtener los detalles del Pokémon.
	    const res = await fetch(pokemon.url);
	    // Convierte la respuesta a formato JSON.
        const data = await res.json();
        // Devuelve los datos del Pokémon.
        return data;
    });

    // Espera a que todas las promesas se resuelvan.
    const results = await Promise.all(promises);

    // Actualiza el estado de todos los Pokémon añadiendo los nuevos resultados.
    setAllPokemons([...allPokemons, ...results]);
    // Cambia el estado de carga a falso.
    setLoading(false);
};

// Función para obtener todos los Pokémon sin límite.
const getGlobalPokemons = async () => {
    // URL base de la API de Pokémon.
    const baseURL = 'https://pokeapi.co/api/v2/';

    // Realiza una solicitud a la API para obtener todos los Pokémon.
    const res = await fetch(`${baseURL}pokemon?limit=100000&offset=0`);
    const data = await res.json();

    // Mapea sobre los resultados y obtiene más detalles de cada Pokémon.
    const promises = data.results.map(async pokemon => {
        // Realiza una solicitud para obtener los detalles del Pokémon.
        const res = await fetch(pokemon.url);
        const data = await res.json();
        // Devuelve los datos del Pokémon.
        return data;
    });
    const results = await Promise.all(promises);

    setGlobalPokemons(results);
    setLoading(false);
};

  // Llamar a un Pokémon por ID
const getPokemonByID = async id => {
    const baseURL = 'https://pokeapi.co/api/v2/';

    const res = await fetch(`${baseURL}pokemon/${id}`);
    const data = await res.json();
    return data;
};

// Función para obtener la evolución máxima de un Pokémon por su ID.
const getMaxEvolution = async (pokemonId) => {
    // Obtiene los datos de la especie del Pokémon.
    const evolutionData = await getSpeciesData(pokemonId);
    // Devuelve la evolución máxima utilizando la cadena de evolución.
    return findMaxEvolution(evolutionData.chain);
};

// Hook para ejecutar efectos secundarios.
useEffect(() => {
    // Llama a la función para obtener todos los Pokémon al montar el componente.
    getAllPokemons();
    // Dependencia del offset para volver a ejecutar la función al cambiarlo.
}, [offset]);

useEffect(() => {
    // Llama a la función para obtener todos los Pokémon al montar el componente.
    getGlobalPokemons();
    // Se ejecuta solo una vez al montar el componente.
}, []);

// Función para cargar más Pokémon.
const onClickLoadMore = () => {
    // Aumenta el offset en 50 para cargar más Pokémon.
    setOffset(offset + 20);
};

// Estado para manejar los tipos de Pokémon seleccionados.
const [typeSelected, setTypeSelected] = useState({
    grass: false,
    normal: false,
    fighting: false,
    flying: false,
    poison: false,
    ground: false,
    rock: false,
    bug: false,
    ghost: false,
    steel: false,
    fire: false,
    water: false,
    electric: false,
    psychic: false,
    ice: false,
    dragon: false,
    dark: false,
    fairy: false,
    unknow: false,
    shadow: false,
});

// Estado para almacenar los Pokémon filtrados.
const [filteredPokemons, setfilteredPokemons] = useState([]);

// Función para manejar el cambio en los checkboxes de tipos.
const handleCheckbox = e => {
    // Actualiza el estado de tipos seleccionados.
    setTypeSelected({
	...typeSelected,
    // Cambia el estado del tipo correspondiente.
    [e.target.name]: e.target.checked,
    });

    // Si el checkbox está marcado:
    if (e.target.checked) {
        // Filtra los Pokémon globales por el tipo seleccionado.
	    const filteredResults = globalPokemons.filter(pokemon =>
            pokemon.types
            .map(type => type.type.name)
            .includes(e.target.name)
        );
        // Actualiza el estado de Pokémon filtrados.
        setfilteredPokemons([...filteredPokemons, ...filteredResults]);
    } else { // Si el checkbox está desmarcado:
        // Filtra los Pokémon ya filtrados para eliminar el tipo desmarcado.
        const filteredResults = filteredPokemons.filter(
            pokemon =>
            !pokemon.types
                .map(type => type.type.name)
                .includes(e.target.name)
        );
        // Actualiza el estado de Pokémon filtrados.
        setfilteredPokemons([...filteredResults]);
    }
};

return (
    // Proveedor del contexto PokemonContext.
    <PokemonContext.Provider
    // Proporciona valores y funciones a los componentes hijos.
    value={{
        valueSearch,
        onInputChange,
        onResetForm,
        allPokemons,
        globalPokemons,
        getPokemonByID,
        getMaxEvolution, // Exportamos la función para obtener evolución máxima
        onClickLoadMore,
        // Loader
        loading,
        setLoading,
        // Btn Filter
        active,
        setActive,
        // Filter Container Checkbox
        handleCheckbox,
        filteredPokemons,
    }}
    >
    {/* Renderiza los componentes hijos. */}
    {children}
    </PokemonContext.Provider>
);
};
