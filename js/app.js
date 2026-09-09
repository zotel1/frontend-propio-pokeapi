import {
  getBackendHealth,
  getPokemonByName
} from './api/pokemon.api.js'

import {
  setBackendStatus
} from './components/statusIndicator.js'

import {
  createPokemonDisplay
} from './components/pokemonDisplay.js'

import {
  createLoading,
  createErrorFeedback
} from './components/feedback.js'

import {
  renderHomeView
} from './views/home.view.js'

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

const handleSearch = async (event) => {
  event.preventDefault()

  const name =
    searchInput.value.trim()

  if (!name) {
    return
  }

  screenContent.innerHTML =
    createLoading(`Buscando ${name}...`)

  try {
    const pokemon =
      await getPokemonByName(name)

    screenContent.innerHTML =
      createPokemonDisplay(pokemon)
  } catch (error) {
    screenContent.innerHTML =
      createErrorFeedback(error.message)
  }
}

const handleHomeNavigation = async () => {
  searchInput.value = ''

  await renderHomeView(screenContent)

  setActiveNavigation('home')
}

const setActiveNavigation = (view) => {
  const buttons =
    document.querySelectorAll('.nav-button')

  buttons.forEach((button) => {
    button.classList.toggle(
      'nav-button--active',
      button.dataset.view === view
    )
  })
}

const initializeApp = async () => {
  checkBackendStatus()

  await renderHomeView(screenContent)

  searchForm.addEventListener(
    'submit',
    handleSearch
  )

  navHome.addEventListener(
    'click',
    handleHomeNavigation
  )
}

initializeApp()