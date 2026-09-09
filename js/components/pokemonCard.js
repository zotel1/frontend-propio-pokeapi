const formatPokemonId = (id) => {
  return `#${String(id).padStart(3, '0')}`
}

const createTypeChips = (types) => {
  return types
    .map(
      (type) => `
        <span class="type-chip type-chip--${type}">
          ${type}
        </span>
      `
    )
    .join('')
}

export const createPokemonCard = (pokemon) => {
  return `
    <article
      class="pokemon-card"
      data-pokemon-id="${pokemon.id}"
    >
      <img
        class="pokemon-card__image"
        src="${pokemon.image}"
        alt="${pokemon.name}"
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
    </article>
  `
}