import {
  getBackendHealth
} from './api/pokemon.api.js'

import {
  setBackendStatus
} from './components/statusIndicator.js'

import {
  renderHomeView
} from './views/home.view.js'

const screenContent =
  document.querySelector('#screen-content')

const backendStatus =
  document.querySelector('#backend-status')

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

const initializeApp = async () => {
  checkBackendStatus()

  await renderHomeView(screenContent)
}

initializeApp()