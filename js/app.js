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


// ========================================
// ELEMENTOS PRINCIPALES
// ========================================

const screenContent =
  document.querySelector('#screen-content')

const backendStatus =
  document.querySelector('#backend-status')

const searchForm =
  document.querySelector('#search-form')

const searchInput =
  document.querySelector('#search-input')


// ========================================
// NAVEGACIÓN PRINCIPAL
// ========================================

const navHome =
  document.querySelector('#nav-home')

const navTypes =
  document.querySelector('#nav-types')

const navCollection =
  document.querySelector('#nav-collection')


// ========================================
// CONTROLES FÍSICOS
// ========================================

const dpadUp =
  document.querySelector('#dpad-up')

const dpadDown =
  document.querySelector('#dpad-down')

const dpadLeft =
  document.querySelector('#dpad-left')

const dpadRight =
  document.querySelector('#dpad-right')

const buttonA =
  document.querySelector('#button-a')

const buttonB =
  document.querySelector('#button-b')


// ========================================
// ESTADO DE NAVEGACIÓN
// ========================================

const navigationViews = [
  'home',
  'types',
  'collection'
]

let currentView = 'home'


// ========================================
// ESTADO DEL BACKEND
// ========================================

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


// ========================================
// NAVEGACIÓN ACTIVA
// ========================================

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

  currentView = view
}


// ========================================
// MOSTRAR POKÉMON
// ========================================

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


// ========================================
// AGREGAR A COLECCIÓN
// ========================================

const handleAddToCollection = (pokemon) => {
  /*
   * Guardamos desde dónde llegó el usuario.
   *
   * Puede ser:
   * home
   * types
   */
  const returnView = currentView

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
      renderPokemon(
        pokemon,
        returnView
      )
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
            renderPokemon(
              pokemon,
              returnView
            )
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


// ========================================
// BUSCADOR
// ========================================

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


// ========================================
// SELECCIONAR POKÉMON DESDE TIPOS
// ========================================

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


// ========================================
// VISTAS
// ========================================

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

const handleCollectionNavigation = async () => {
  searchInput.value = ''

  setActiveNavigation('collection')

  await renderCollectionView(
    screenContent
  )
}


// ========================================
// NAVEGADOR CENTRAL
// ========================================

const navigateTo = async (view) => {
  if (view === 'home') {
    await handleHomeNavigation()
    return
  }

  if (view === 'types') {
    await handleTypesNavigation()
    return
  }

  if (view === 'collection') {
    await handleCollectionNavigation()
  }
}


// ========================================
// D-PAD IZQUIERDA / DERECHA
// ========================================

const moveMainNavigation = async (
  direction
) => {
  const currentIndex =
    navigationViews.indexOf(
      currentView
    )

  if (currentIndex === -1) {
    return
  }

  let nextIndex =
    currentIndex + direction

  /*
   * Navegación circular.
   *
   * Inicio <- Tipos <- Colección
   * Inicio -> Tipos -> Colección
   */

  if (nextIndex < 0) {
    nextIndex =
      navigationViews.length - 1
  }

  if (
    nextIndex >=
    navigationViews.length
  ) {
    nextIndex = 0
  }

  await navigateTo(
    navigationViews[nextIndex]
  )
}


// ========================================
// ELEMENTOS SELECCIONABLES
// ========================================

const getFocusableElements = () => {
  const elements = [
    ...screenContent.querySelectorAll(
      [
        'button:not(:disabled)',
        'select:not(:disabled)',
        'input:not(:disabled)',
        'textarea:not(:disabled)'
      ].join(',')
    )
  ]

  return elements.filter(
    (element) =>
      element.offsetParent !== null
  )
}


// ========================================
// D-PAD ARRIBA / ABAJO
// ========================================

const moveFocus = (direction) => {
  const elements =
    getFocusableElements()

  if (elements.length === 0) {
    return
  }

  const currentIndex =
    elements.indexOf(
      document.activeElement
    )

  let nextIndex

  if (currentIndex === -1) {
    nextIndex =
      direction > 0
        ? 0
        : elements.length - 1
  } else {
    nextIndex =
      currentIndex + direction
  }

  if (nextIndex < 0) {
    nextIndex =
      elements.length - 1
  }

  if (
    nextIndex >=
    elements.length
  ) {
    nextIndex = 0
  }

  const nextElement =
    elements[nextIndex]

  nextElement.focus()

  nextElement.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  })
}


// ========================================
// BOTÓN A
// ========================================

const handleButtonA = () => {
  const activeElement =
    document.activeElement

  /*
   * Si con ↑ o ↓ seleccionamos un botón
   * dentro de la pantalla, A lo ejecuta.
   */

  if (
    activeElement &&
    screenContent.contains(activeElement)
  ) {
    if (
      activeElement.tagName === 'BUTTON'
    ) {
      activeElement.click()
      return
    }

    /*
     * Si estamos sobre un select,
     * le damos foco para poder elegir.
     */
    if (
      activeElement.tagName === 'SELECT'
    ) {
      activeElement.focus()
      return
    }

    /*
     * Input o textarea:
     * mantenemos el foco para escribir.
     */
    if (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA'
    ) {
      activeElement.focus()
      return
    }
  }

  /*
   * Si todavía no seleccionamos nada,
   * intentamos ejecutar una acción principal.
   */

  const defaultAction =
    screenContent.querySelector(
      [
        '#add-to-collection',
        '#collection-success-back',
        '#collection-detail-back',
        '#delete-confirm',
        '.pokemon-card',
        '[data-action="view"]'
      ].join(',')
    )

  defaultAction?.click()
}


// ========================================
// BOTÓN B
// ========================================

const handleButtonB = async () => {
  /*
   * Primero buscamos acciones de
   * volver/cancelar dentro de la pantalla.
   */

  const backButton =
    screenContent.querySelector(
      [
        '#collection-cancel',
        '#edit-cancel',
        '#delete-cancel',
        '#collection-success-back',
        '#collection-detail-back'
      ].join(',')
    )

  if (backButton) {
    backButton.click()
    return
  }

  /*
   * Si estamos viendo un Pokémon
   * proveniente de Tipos, volvemos
   * al listado de tipos.
   */

  if (currentView === 'types') {
    await handleTypesNavigation()
    return
  }

  /*
   * Desde Colección volvemos a Inicio.
   */

  if (currentView === 'collection') {
    await handleHomeNavigation()
  }
}


// ========================================
// CONTROLES FÍSICOS
// ========================================

const bindPhysicalControls = () => {
  dpadLeft?.addEventListener(
    'click',
    async () => {
      await moveMainNavigation(-1)
    }
  )

  dpadRight?.addEventListener(
    'click',
    async () => {
      await moveMainNavigation(1)
    }
  )

  dpadUp?.addEventListener(
    'click',
    () => {
      moveFocus(1)
    }
  )

  dpadDown?.addEventListener(
    'click',
    () => {
      moveFocus(-1)
    }
  )

  buttonA?.addEventListener(
    'click',
    handleButtonA
  )

  buttonB?.addEventListener(
    'click',
    handleButtonB
  )
}


// ========================================
// TECLADO
// ========================================

const bindKeyboardControls = () => {
  document.addEventListener(
    'keydown',
    async (event) => {
      const activeElement =
        document.activeElement

      const tagName =
        activeElement
          ?.tagName
          ?.toLowerCase()

      const isTyping =
        tagName === 'input' ||
        tagName === 'textarea'

      /*
       * Mientras escribimos, las letras
       * A y B deben seguir siendo texto.
       */
      if (isTyping) {
        if (event.key === 'Escape') {
          activeElement.blur()
        }

        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()

          await moveMainNavigation(-1)
          break

        case 'ArrowRight':
          event.preventDefault()

          await moveMainNavigation(1)
          break

        case 'ArrowUp':
          event.preventDefault()

          moveFocus(-1)
          break

        case 'ArrowDown':
          event.preventDefault()

          moveFocus(1)
          break

        case 'Enter':
        case 'a':
        case 'A':
          event.preventDefault()

          handleButtonA()
          break

        case 'Escape':
        case 'b':
        case 'B':
          event.preventDefault()

          await handleButtonB()
          break
      }
    }
  )
}


// ========================================
// INICIALIZACIÓN
// ========================================

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

  bindPhysicalControls()

  bindKeyboardControls()
}

initializeApp()