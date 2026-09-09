import {
  translatePokemonType
} from '../utils/typeTranslations.js'

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

export const createCollectionCard = (
  item,
  pokemon
) => {
  return `
    <article
      class="collection-card"
      data-collection-id="${item.id}"
    >

      <button
        class="collection-card__preview"
        type="button"
        data-action="view"
        data-pokemon-id="${item.pokemonId}"
        aria-label="Ver ${item.name}"
      >

        <img
          class="collection-card__image"
          src="${pokemon.image}"
          alt="${item.name}"
          onerror="
            this.onerror=null;
            this.src='./assets/images/pokemon-placeholder.svg';
          "
        >

        <h3 class="collection-card__name">
          ${item.name}
        </h3>

        <div class="pokemon-display__types">
          ${createTypeChips(pokemon.types)}
        </div>

        <p class="collection-card__nickname">
          ${
            item.nickname
              ? `Apodo: ${item.nickname}`
              : 'Sin apodo'
          }
        </p>

        <p class="collection-card__notes">
          ${
            item.notes
              ? item.notes
              : 'Sin notas'
          }
        </p>

      </button>

      <div class="collection-card__actions">

        <button
          class="screen-button screen-button--secondary"
          type="button"
          data-action="edit"
          data-id="${item.id}"
        >
          Editar
        </button>

        <button
          class="screen-button"
          type="button"
          data-action="delete"
          data-id="${item.id}"
        >
          Eliminar
        </button>

      </div>

    </article>
  `
}