import {
  getPokemonTypes,
  getPokemonByType
} from '../api/pokemon.api.js'

import {
  createPokemonCard
} from '../components/pokemonCard.js'

import {
  createPagination
} from '../components/pagination.js'

import {
  createLoading,
  createErrorFeedback
} from '../components/feedback.js'

const PAGE_LIMIT = 20

let selectedType = null
let currentOffset = 0
let cachedTypes = null

const renderTypeSelector = (types) => {
  return `
    <section class="view">

      <h2 class="view__title">
        Seleccionar tipo
      </h2>

      <div class="type-filter">

        <select
          class="type-filter__select"
          id="type-select"
        >
          <option value="">
            Elegí un tipo
          </option>

          ${types
            .map(
              (type) => `
                <option
                  value="${type}"
                  ${
                    type === selectedType
                      ? 'selected'
                      : ''
                  }
                >
                  ${type}
                </option>
              `
            )
            .join('')}
        </select>

        <div class="type-filter__chips">
          ${
            selectedType
              ? `
                <span
                  class="
                    type-chip
                    type-chip--${selectedType}
                  "
                >
                  ${selectedType}
                </span>
              `
              : ''
          }
        </div>

        <div id="type-results">
          ${
            selectedType
              ? createLoading(
                  `Cargando Pokémon ${selectedType}...`
                )
              : `
                <p class="view__message">
                  Seleccioná un tipo para ver Pokémon.
                </p>
              `
          }
        </div>

      </div>

    </section>
  `
}

const renderPokemonResults = (
  container,
  response
) => {
  const {
    results,
    pagination
  } = response

  if (results.length === 0) {
    container.innerHTML = `
      <section class="feedback">
        <div class="feedback__icon">
          ?
        </div>

        <h2 class="feedback__title">
          Sin resultados
        </h2>

        <p class="feedback__message">
          No se encontraron Pokémon para este tipo.
        </p>
      </section>
    `

    return
  }

  container.innerHTML = `
    <div class="pokemon-grid">
      ${results
        .map(createPokemonCard)
        .join('')}
    </div>

    ${createPagination(pagination)}
  `
}

const loadPokemonByType = async (
  container,
  type,
  offset
) => {
  container.innerHTML =
    createLoading(
      `Cargando Pokémon ${type}...`
    )

  try {
    const response =
      await getPokemonByType(
        type,
        PAGE_LIMIT,
        offset
      )

    renderPokemonResults(
      container,
      response
    )

    bindPaginationEvents(container)
  } catch (error) {
    container.innerHTML =
      createErrorFeedback(error.message)
  }
}

const bindPaginationEvents = (container) => {
  const previousButton =
    container.querySelector(
      '#pagination-previous'
    )

  const nextButton =
    container.querySelector(
      '#pagination-next'
    )

  previousButton?.addEventListener(
    'click',
    async () => {
      currentOffset =
        Math.max(
          0,
          currentOffset - PAGE_LIMIT
        )

      await loadPokemonByType(
        container,
        selectedType,
        currentOffset
      )
    }
  )

  nextButton?.addEventListener(
    'click',
    async () => {
      currentOffset += PAGE_LIMIT

      await loadPokemonByType(
        container,
        selectedType,
        currentOffset
      )
    }
  )
}

export const renderTypesView = async (
  container
) => {
  container.innerHTML =
    createLoading(
      'Cargando tipos...'
    )

  try {
    if (!cachedTypes) {
      cachedTypes =
        await getPokemonTypes()
    }

    container.innerHTML =
      renderTypeSelector(cachedTypes)

    const typeSelect =
      container.querySelector(
        '#type-select'
      )

    const resultsContainer =
      container.querySelector(
        '#type-results'
      )

    if (selectedType) {
      await loadPokemonByType(
        resultsContainer,
        selectedType,
        currentOffset
      )
    }

    typeSelect.addEventListener(
      'change',
      async (event) => {
        selectedType =
          event.target.value || null

        currentOffset = 0

        if (!selectedType) {
          resultsContainer.innerHTML = `
            <p class="view__message">
              Seleccioná un tipo para ver Pokémon.
            </p>
          `

          return
        }

        await loadPokemonByType(
          resultsContainer,
          selectedType,
          currentOffset
        )
      }
    )
  } catch (error) {
    container.innerHTML =
      createErrorFeedback(error.message)
  }
}