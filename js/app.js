import {
  getBackendHealth,
  getPokemonByName,
  getPokemonById
} from './api/pokemon.api.js'

import {
  renderCollectionView
} from './views/collection.view.js'

import {
  createCollectionItem
} from './api/collection.api.js'

import {
  setBackendStatus
} from './components/statusIndicator.js'

import {
  createPokemonDisplay,
  bindPokemonDisplayEvents
} from './components/pokemonDisplay.js'

import {
  createLoading,
  createErrorFeedback
} from './components/feedback.js'

import {
  createCollectionForm,
  createCollectionSuccess
} from './components/collectionForm.js'

import {
  renderHomeView
} from './views/home.view.js'

import {
  renderTypesView
} from './views/types.view.js'

const screenContent =
  document.querySelector('#screen-content')

const backendStatus =
  document.querySelector('#backend-status')

const searchForm =
  document.querySelector('#search-form')

const searchInput =
  document.querySelector('#search-input')

const navHome =
  document.querySelector('#nav-home')

const navTypes =
  document.querySelector('#nav-types')


const navCollection =
  document.querySelector('#nav-collection')

const handleCollectionNavigation = async () => {
  searchInput.value = ''

  setActiveNavigation('collection')

  await renderCollectionView(
    screenContent
  )
}

  const checkBackendStatus = async () => {
  setBackendStatus(
    backendStatus,
    'checking'
  )

  try {
    await getBackendHealth()

    setBackendStatus(
      backendStatus,
      'online'
    )
  } catch {
    setBackendStatus(
      backendStatus,
      'offline'
    )
  }
}

const setActiveNavigation = (view) => {
  const buttons =
    document.querySelectorAll(
      '.nav-button'
    )

  buttons.forEach((button) => {
    button.classList.toggle(
      'nav-button--active',
      button.dataset.view === view
    )
  })
}

const renderPokemon = (
  pokemon,
  activeView = 'home'
) => {
  screenContent.innerHTML =
    createPokemonDisplay(pokemon)

  bindPokemonDisplayEvents(
    screenContent,
    pokemon,
    handleAddToCollection
  )

  setActiveNavigation(activeView)
}

const handleAddToCollection = (pokemon) => {
  screenContent.innerHTML =
    createCollectionForm(pokemon)

  const form =
    screenContent.querySelector(
      '#collection-form'
    )

  const cancelButton =
    screenContent.querySelector(
      '#collection-cancel'
    )

  cancelButton?.addEventListener(
    'click',
    () => {
      renderPokemon(pokemon)
    }
  )

  form?.addEventListener(
    'submit',
    async (event) => {
      event.preventDefault()

      const formData =
        new FormData(form)

      const nickname =
        formData
          .get('nickname')
          ?.toString()
          .trim() ?? ''

      const notes =
        formData
          .get('notes')
          ?.toString()
          .trim() ?? ''

      screenContent.innerHTML =
        createLoading(
          'Guardando en colección...'
        )

      try {
        const item =
          await createCollectionItem({
            pokemonId: pokemon.id,
            nickname,
            notes
          })

        screenContent.innerHTML =
          createCollectionSuccess(item)

        const backButton =
          screenContent.querySelector(
            '#collection-success-back'
          )

        backButton?.addEventListener(
          'click',
          () => {
            renderPokemon(pokemon)
          }
        )
      } catch (error) {
        screenContent.innerHTML =
          createErrorFeedback(
            error.message
          )
      }
    }
  )
}

const handleSearch = async (event) => {
  event.preventDefault()

  const name =
    searchInput.value.trim()

  if (!name) {
    return
  }

  setActiveNavigation('home')

  screenContent.innerHTML =
    createLoading(
      `Buscando ${name}...`
    )

  try {
    const pokemon =
      await getPokemonByName(name)

    renderPokemon(
      pokemon,
      'home'
    )
  } catch (error) {
    screenContent.innerHTML =
      createErrorFeedback(
        error.message
      )
  }
}

const handlePokemonSelect = async (
  pokemonId
) => {
  screenContent.innerHTML =
    createLoading(
      'Cargando Pokémon...'
    )

  try {
    const pokemon =
      await getPokemonById(
        pokemonId
      )

    renderPokemon(
      pokemon,
      'types'
    )
  } catch (error) {
    screenContent.innerHTML =
      createErrorFeedback(
        error.message
      )
  }
}

const handleHomeNavigation = async () => {
  searchInput.value = ''

  setActiveNavigation('home')

  await renderHomeView(
    screenContent,
    handleAddToCollection
  )
}

const handleTypesNavigation = async () => {
  searchInput.value = ''

  setActiveNavigation('types')

  await renderTypesView(
    screenContent,
    handlePokemonSelect
  )
}

const initializeApp = async () => {
  checkBackendStatus()

  await renderHomeView(
    screenContent,
    handleAddToCollection
  )

  searchForm.addEventListener(
    'submit',
    handleSearch
  )

  navHome.addEventListener(
    'click',
    handleHomeNavigation
  )

  navTypes.addEventListener(
    'click',
    handleTypesNavigation
  )

  navCollection.addEventListener(
  'click',
  handleCollectionNavigation
)
}

initializeApp()