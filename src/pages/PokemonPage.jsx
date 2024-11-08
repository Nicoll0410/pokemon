import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../components';
import { PokemonContext } from '../context/PokemonContext';
import { primerMayuscula } from '../helper/helper';

export const PokemonPage = () => {
  const { getPokemonByID, getMaxEvolution } = useContext(PokemonContext);

  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState({});
  const [maxEvolution, setMaxEvolution] = useState(null);
  const [card, setCard] = useState(null);
  const [showEvolutionCard, setShowEvolutionCard] = useState(false);

  const { id } = useParams();

  const getPokemonCard = async (pokemonName) => {
    const response = await fetch(`https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}`, {
      headers: { 'X-Api-Key': `https://api.pokemontcg.io/v2/cards?q=name:${pokemonName}` },
    });
    const data = await response.json();
    return data.data.length > 0 ? data.data[0] : null;
  };

  const fetchPokemon = async (id) => {
    const data = await getPokemonByID(id);
    setPokemon(data);

    const evolutionName = await getMaxEvolution(id);
    setMaxEvolution(evolutionName);

    if (evolutionName) {
      const cardData = await getPokemonCard(evolutionName);
      setCard(cardData);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPokemon(id);
  }, [id]);

  const handleShowEvolutionCard = async () => {
    if (maxEvolution && !card) {
      const cardData = await getPokemonCard(maxEvolution);
      setCard(cardData);
    }
    setShowEvolutionCard(!showEvolutionCard);
  };

  return (
    <main className="container main-pokemon">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="header-main-pokemon">
            <span className="number-pokemon">#{pokemon.id} {primerMayuscula(pokemon.name)}</span>
            <div className="container-img-pokemon">
              <img
                src={pokemon.sprites.other.dream_world.front_default}
                alt={`Pokemon ${pokemon?.name}`}
              />
            </div>

            <div className="container-info-pokemon">
              <div className="card-types info-pokemon-type">
                {pokemon.types.map((type) => (
                  <span key={type.type.name} className={`${type.type.name}`}>
                    {type.type.name}
                  </span>
                ))}
              </div>
              <div className="info-pokemon">
                <div className="group-info">
                  <p>Altura</p>
                  <span>{pokemon.height} CM</span>
                </div>
                <div className="group-info">
                  <p>Peso</p>
                  <span>{pokemon.weight} KG</span>
                </div>
              </div>

              {maxEvolution && (
                <>
                  <button onClick={handleShowEvolutionCard} className="btn-evolution-card">
                    {showEvolutionCard ? 'Ocultar Carta Evolucionada' : 'Ver Carta Evolucionada'}
                  </button>
                </>
              )}

              {/* Mostrar la carta evolucionada si showEvolutionCard es true */}
              {showEvolutionCard && card && (
                <div className="card-details">
                  <img src={card.images.large} alt={`Card of ${card.name}`} style={{ marginRight: '15px' }} />
                  <div>
                    <h3 style={{ textAlign: 'center' }}>Evolución Máxima: {primerMayuscula(maxEvolution)}</h3>
                    <p>Nombre: {card.name}</p>
                    <p>Tipo: {card.types[0]}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="container-stats">
            <h1>Estadísticas</h1>
            <div className="stats">
              {pokemon.stats.map((stat, index) => {
                const percentage = (stat.base_stat / 255) * 100;
                return (
                    <div key={index} className="stat-group">
                        <span>{stat.stat.name.replace('special-', 'Sp. ')}</span>
                        <div className="progress-container">
                            <div className="progress-bar" style={{ width: `${percentage}%` }}>
                                <span className="counter-stat">{stat.base_stat}%</span>
                            </div>
                        </div>
                    </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </main>
  );
};