import {
  getRandomPokemon
} from '../api/pokemon.api.js'

import {
  createPokemonDisplay,
  bindPokemonDisplayEvents
} from '../components/pokemonDisplay.js'

import {
  createLoading,
  createErrorFeedback
} from '../components/feedback.js'

let initialPokemon = null

export const renderHomeView = async (
  container,
  onAddToCollection
) => {
  if (initialPokemon) {
    container.innerHTML =
      createPokemonDisplay(initialPokemon)

    bindPokemonDisplayEvents(
      container,
      initialPokemon,
      onAddToCollection
    )

    return
  }

  container.innerHTML =
    createLoading('Buscando Pokémon...')

  try {
    initialPokemon =
      await getRandomPokemon()

    container.innerHTML =
      createPokemonDisplay(initialPokemon)

    bindPokemonDisplayEvents(
      container,
      initialPokemon,
      onAddToCollection
    )
  } catch (error) {
    container.innerHTML =
      createErrorFeedback(error.message)
  }
}

export const getInitialPokemon = () => {
  return initialPokemon
}