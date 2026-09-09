const formatPokemonId = (id) => {
  return `#${String(id).padStart(3, '0')}`
}

const formatWeight = (weight) => {
  return `${weight / 10} kg`
}

const formatHeight = (height) => {
  return `${height / 10} m`
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

export const createPokemonDisplay = (pokemon) => {
  return `
    <section class="pokemon-display">

      <div class="pokemon-display__image-wrapper">
        <img
          class="pokemon-display__image"
          src="${pokemon.image}"
          alt="${pokemon.name}"
        >
      </div>

      <p class="pokemon-display__id">
        ${formatPokemonId(pokemon.id)}
      </p>

      <h2 class="pokemon-display__name">
        ${pokemon.name}
      </h2>

      <div class="pokemon-display__types">
        ${createTypeChips(pokemon.types)}
      </div>

      <div class="pokemon-stats">

        <div class="pokemon-stat">
          <span class="pokemon-stat__label">
            Peso
          </span>

          <span class="pokemon-stat__value">
            ${formatWeight(pokemon.weight)}
          </span>
        </div>

        <div class="pokemon-stat">
          <span class="pokemon-stat__label">
            Altura
          </span>

          <span class="pokemon-stat__value">
            ${formatHeight(pokemon.height)}
          </span>
        </div>

      </div>

      <button
        class="screen-button"
        id="add-to-collection"
        type="button"
      >
        + Agregar a colección
      </button>

    </section>
  `
}

export const bindPokemonDisplayEvents = (
  container,
  pokemon,
  onAddToCollection
) => {
  const addButton =
    container.querySelector(
      '#add-to-collection'
    )

  addButton?.addEventListener(
    'click',
    () => {
      onAddToCollection?.(pokemon)
    }
  )
}