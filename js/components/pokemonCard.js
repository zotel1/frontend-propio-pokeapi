import {
  translatePokemonType
} from '../utils/typeTranslations.js'

const formatPokemonId = (id) => {
  return `#${String(id).padStart(3, '0')}`
}

const createTypeChips = (types) => {
  return types
    .map(
      (type) => `
        <span class="type-chip type-chip--${type}">
          ${translatePokemonType(type)}
        </span>
      `
    )
    .join('')
}

export const createPokemonCard = (pokemon) => {
  return `
    <button
      class="pokemon-card"
      type="button"
      data-pokemon-id="${pokemon.id}"
      aria-label="Ver detalles de ${pokemon.name}"
    >
      <img
        class="pokemon-card__image"
        src="${pokemon.image}"
        alt="${pokemon.name}"
        onerror="
          this.onerror=null;
          this.src='./assets/images/pokemon-placeholder.svg';
        "
      >

      <span class="pokemon-card__id">
        ${formatPokemonId(pokemon.id)}
      </span>

      <h3 class="pokemon-card__name">
        ${pokemon.name}
      </h3>

      <div class="pokemon-display__types">
        ${createTypeChips(pokemon.types)}
      </div>
    </button>
  `
}