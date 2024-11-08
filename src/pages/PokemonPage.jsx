import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../components';
import { PokemonContext } from '../context/PokemonContext';
import { primerMayuscula } from '../helper/helper';

export const PokemonPage = () => {
  // Utiliza el contexto PokemonContext y desestructura las funciones getPokemonByID y getMaxEvolution.
  const { getPokemonByID, getMaxEvolution } = useContext(PokemonContext);

  // Declara un estado 'loading' para controlar la carga de datos, inicializado en true.
  const [loading, setLoading] = useState(true);
  // Declara un estado 'pokemon' para almacenar los datos del Pokémon, inicializado como un objeto vacío.
  const [pokemon, setPokemon] = useState({});
  // Declara un estado 'maxEvolution' para almacenar el nombre de la evolución máxima, inicializado en null.
  const [maxEvolution, setMaxEvolution] = useState(null);
  // Declara un estado 'card' para almacenar la carta del Pokémon, inicializado en null.
  const [card, setCard] = useState(null);
  // Declara un estado 'showEvolutionCard' para controlar la visibilidad de la carta evolucionada, inicializado en false.
  const [showEvolutionCard, setShowEvolutionCard] = useState(false);

  // Obtiene el parámetro 'id' de la URL usando useParams.
  const { id } = useParams();

  // Define una función asíncrona para obtener la carta del Pokémon por su nombre.
  const getPokemonCard = async (pokemonName) => {
    // Realiza una solicitud a la API de Pokémon TCG para obtener la carta.
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}`, {
      // Establece las cabeceras de la solicitud.
      headers: { 'X-Api-Key': `https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}` },
    });

    const data = await response.json();
    // Devuelve la primera carta si existe, de lo contrario devuelve null.
    return data.data.length > 0 ? data.data[0] : null;
  };

  // Define una función asíncrona para obtener los datos del Pokémon por su ID.
  const fetchPokemon = async (id) => {
    // Llama a la función getPokemonByID para obtener los datos del Pokémon.
    const data = await getPokemonByID(id);
    // Actualiza el estado 'pokemon' con los datos obtenidos.
    setPokemon(data);

    // Llama a la función getMaxEvolution para obtener el nombre de la evolución máxima.
    const evolutionName = await getMaxEvolution(id);
    // Actualiza el estado 'maxEvolution' con el nombre de la evolución máxima.
    setMaxEvolution(evolutionName);

    // Si existe un nombre de evolución máxima,
    if (evolutionName) {
      // Obtiene la carta del Pokémon de la evolución máxima.
      const cardData = await getPokemonCard(evolutionName);
      // Actualiza el estado 'card' con los datos de la carta.
      setCard(cardData);
    }

    // Cambia el estado 'loading' a false, indicando que la carga ha finalizado.
    setLoading(false);
  };

  // Hook que se ejecuta cuando el componente se monta o cuando cambia el 'id'.
  useEffect(() => {
    // Llama a la función fetchPokemon con el 'id' obtenido de la URL.
    fetchPokemon(id);
    // Dependencia del efecto: se ejecuta cada vez que cambia el 'id'.
  }, [id]);

  // Define una función para manejar la visualización de la carta evolucionada.
  const handleShowEvolutionCard = async () => {
    // Si existe un nombre de evolución máxima y no hay carta,
    if (maxEvolution && !card) {
      // Obtiene la carta de la evolución máxima.
      const cardData = await getPokemonCard(maxEvolution);
      // Actualiza el estado 'card' con los datos de la carta.
      setCard(cardData);
    }
    // Cambia el estado 'showEvolutionCard' al valor opuesto.
    setShowEvolutionCard(!showEvolutionCard);
  };

  return (
    <main className="container main-pokemon">
      {loading ? (
        // Si loading es true, muestra el componente Loader.
        <Loader />
      ) : ( // Si loading es false, muestra el contenido del Pokémon.
        <>
          <div className="header-main-pokemon">
            {/* Muestra el ID y el nombre del Pokémon con la primera letra en mayúscula. */}
            <span className="number-pokemon">#{pokemon.id} {primerMayuscula(pokemon.name)}</span>
            <div className="container-img-pokemon">
              <img
                src={pokemon.sprites.other.dream_world.front_default}
                alt={`Pokemon ${pokemon?.name}`}
              />
            </div>

            <div className="container-info-pokemon">
              <div className="card-types info-pokemon-type">
                {/* Mapea sobre los tipos del Pokémon. */}
                {pokemon.types.map((type) => (
                  // Muestra cada tipo como un span con su clase correspondiente
                  <span key={type.type.name} className={`${type.type.name}`}>
                    {type.type.name}
                  </span>
                ))}
              </div>
              <div className="info-pokemon">
                <div className="group-info">
                  <p>Altura</p>
                  {/* Muestra la altura del Pokémon en centímetros. */}
                  <span>{pokemon.height} CM</span>
                </div>
                <div className="group-info">
                  <p>Peso</p>
                  {/* Muestra el peso del Pokémon en kilogramos. */}
                  <span>{pokemon.weight} KG</span>
                </div>
              </div>

              {/* Si existe una evolución máxima, */}
              {maxEvolution && (
                <>
                  {/* Botón para mostrar u ocultar la carta evolucionada. */}
                  <button onClick={handleShowEvolutionCard} className="btn-evolution-card">
                    {/* Texto del botón cambia según el estado. */}
                    {showEvolutionCard ? 'Ocultar Carta Evolucionada' : 'Ver Carta Evolucionada'}
                  </button>
                </>
              )}

              {/* Mostrar la carta evolucionada si showEvolutionCard es true */}
              {/* Si showEvolutionCard es true y hay una carta, */}
              {showEvolutionCard && card && (
                <div className="card-details">
                  {/* Imagen de la carta. */}
                  <img src={card.images.large} alt={`Card of ${card.name}`} style={{ marginRight: '15px' }} />
                  <div>
                    {/* Título que muestra la evolución máxima. */}
                    <h3 style={{ textAlign: 'center' }}>Evolución Máxima: {primerMayuscula(maxEvolution)}</h3>
                    {/* Muestra el nombre de la carta. */}
                    <p>Nombre: {card.name}</p>
                    {/* Muestra el tipo de la carta. */}
                    <p>Tipo: {card.types[0]}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="container-stats">
            <h1>Estadísticas</h1>
            <div className="stats">
              {/* Mapea sobre las estadísticas del Pokémon. */}
              {pokemon.stats.map((stat, index) => {
                {/* Calcula el porcentaje de la estadística. */}
                const percentage = (stat.base_stat / 255) * 100;
                return (
                    <div key={index} className="stat-group">

                      <span>{stat.stat.name.replace('special-', 'Sp. ')}</span>
                      <div className="progress-container">
                          {/* Barra de progreso que representa el porcentaje. */}
                          <div className="progress-bar" style={{ width: `${percentage}%` }}>
                              {/* Muestra el valor base de la estadística. */}
                              <span className="counter-stat">{stat.base_stat}%</span>
                          </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )
      }
    </main>
  );
};