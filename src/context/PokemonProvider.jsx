import { useEffect, useState } from 'react';
import { useForm } from '../hook/useForm';
import { PokemonContext } from './PokemonContext';

// Función para obtener la cadena de evolución de la PokéAPI
const getSpeciesData = async (pokemonId) => {
const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
const speciesData = await speciesResponse.json();
const evolutionChainResponse = await fetch(speciesData.evolution_chain.url);
return await evolutionChainResponse.json();
};

// Función para encontrar la evolución máxima en la cadena de evolución
const findMaxEvolution = (evolutionChain) => {
let currentEvolution = evolutionChain;
while (currentEvolution.evolves_to.length) {
    currentEvolution = currentEvolution.evolves_to[0];
}
return currentEvolution.species.name;
};

export const PokemonProvider = ({ children }) => {
const [allPokemons, setAllPokemons] = useState([]);
const [globalPokemons, setGlobalPokemons] = useState([]);
const [offset, setOffset] = useState(0);


// Utilizar CustomHook - useForm
const { valueSearch, onInputChange, onResetForm } = useForm({
valueSearch: '',
});

// Estados para la aplicación simples
const [loading, setLoading] = useState(true);
const [active, setActive] = useState(false);
// Llamar 50 pokémones a la API
const getAllPokemons = async (limit = 50) => {
    const baseURL = 'https://pokeapi.co/api/v2/';

    const res = await fetch(`${baseURL}pokemon?limit=${limit}&offset=${offset}`);
    const data = await res.json();

    const promises = data.results.map(async pokemon => {
	const res = await fetch(pokemon.url);
	const data = await res.json();
    return data;
    });
    const results = await Promise.all(promises);

    setAllPokemons([...allPokemons, ...results]);
    setLoading(false);
};

  // Llamar todos los pokémones
const getGlobalPokemons = async () => {
    const baseURL = 'https://pokeapi.co/api/v2/';

    const res = await fetch(`${baseURL}pokemon?limit=100000&offset=0`);
    const data = await res.json();

    const promises = data.results.map(async pokemon => {
    const res = await fetch(pokemon.url);
    const data = await res.json();
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

  // Obtener evolución máxima de un Pokémon por ID
const getMaxEvolution = async (pokemonId) => {
    const evolutionData = await getSpeciesData(pokemonId);
    return findMaxEvolution(evolutionData.chain);
};

useEffect(() => {
    getAllPokemons();
}, [offset]);

useEffect(() => {
    getGlobalPokemons();
}, []);

  // BTN CARGAR MÁS
const onClickLoadMore = () => {
    setOffset(offset + 50);
};

  // Filter Function + State
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

const [filteredPokemons, setfilteredPokemons] = useState([]);

const handleCheckbox = e => {
    setTypeSelected({
	...typeSelected,
    [e.target.name]: e.target.checked,
    });

    if (e.target.checked) {
	const filteredResults = globalPokemons.filter(pokemon =>
        pokemon.types
        .map(type => type.type.name)
        .includes(e.target.name)
    );
    setfilteredPokemons([...filteredPokemons, ...filteredResults]);
    } else {
    const filteredResults = filteredPokemons.filter(
        pokemon =>
        !pokemon.types
            .map(type => type.type.name)
            .includes(e.target.name)
    );
    setfilteredPokemons([...filteredResults]);
    }
};

return (
    <PokemonContext.Provider
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
    {children}
    </PokemonContext.Provider>
);
};
