import {
  getCollection,
  getCollectionItemById,
  updateCollectionItem,
  deleteCollectionItem
} from '../api/collection.api.js'

import {
  createCollectionCard
} from '../components/collectionCard.js'

import {
  createLoading,
  createErrorFeedback
} from '../components/feedback.js'

const createEmptyCollection = () => {
  return `
    <section class="feedback">

      <div class="feedback__icon">
        📁
      </div>

      <h2 class="feedback__title">
        Colección vacía
      </h2>

      <p class="feedback__message">
        Todavía no agregaste ningún Pokémon.
      </p>

    </section>
  `
}

const createEditForm = (item) => {
  return `
    <section class="view">

      <h2 class="view__title">
        Editar colección
      </h2>

      <div class="form-panel">

        <p>
          Editando
          <strong>${item.name}</strong>
        </p>

        <form id="collection-edit-form">

          <div class="form-field">
            <label for="edit-nickname">
              Apodo
            </label>

            <input
              id="edit-nickname"
              name="nickname"
              type="text"
              maxlength="50"
              value="${item.nickname ?? ''}"
            >
          </div>

          <div class="form-field">
            <label for="edit-notes">
              Notas
            </label>

            <textarea
              id="edit-notes"
              name="notes"
              maxlength="250"
            >${item.notes ?? ''}</textarea>
          </div>

          <div class="form-actions">

            <button
              class="screen-button screen-button--secondary"
              id="edit-cancel"
              type="button"
            >
              Cancelar
            </button>

            <button
              class="screen-button"
              type="submit"
            >
              Guardar cambios
            </button>

          </div>

        </form>

      </div>

    </section>
  `
}

const createDeleteConfirmation = (item) => {
  return `
    <section class="feedback">

      <div class="feedback__icon">
        !
      </div>

      <h2 class="feedback__title">
        Eliminar Pokémon
      </h2>

      <p class="feedback__message">
        ¿Eliminar a ${item.name} de la colección?
      </p>

      <div class="form-actions">

        <button
          class="screen-button screen-button--secondary"
          id="delete-cancel"
          type="button"
        >
          Cancelar
        </button>

        <button
          class="screen-button"
          id="delete-confirm"
          type="button"
        >
          Eliminar
        </button>

      </div>

    </section>
  `
}

const renderCollectionList = (
  container,
  collection
) => {
  if (collection.length === 0) {
    container.innerHTML =
      createEmptyCollection()

    return
  }

  container.innerHTML = `
    <section class="view">

      <h2 class="view__title">
        Mi colección
      </h2>

      <div class="pokemon-grid">
        ${collection
          .map(createCollectionCard)
          .join('')}
      </div>

    </section>
  `
}

const bindCollectionEvents = (
  container
) => {
  const editButtons =
    container.querySelectorAll(
      '[data-action="edit"]'
    )

  const deleteButtons =
    container.querySelectorAll(
      '[data-action="delete"]'
    )

  editButtons.forEach((button) => {
    button.addEventListener(
      'click',
      async () => {
        const id =
          Number(button.dataset.id)

        await renderEditView(
          container,
          id
        )
      }
    )
  })

  deleteButtons.forEach((button) => {
    button.addEventListener(
      'click',
      async () => {
        const id =
          Number(button.dataset.id)

        await renderDeleteView(
          container,
          id
        )
      }
    )
  })
}

const renderEditView = async (
  container,
  id
) => {
  container.innerHTML =
    createLoading(
      'Cargando elemento...'
    )

  try {
    const item =
      await getCollectionItemById(id)

    container.innerHTML =
      createEditForm(item)

    const form =
      container.querySelector(
        '#collection-edit-form'
      )

    const cancelButton =
      container.querySelector(
        '#edit-cancel'
      )

    cancelButton?.addEventListener(
      'click',
      async () => {
        await renderCollectionView(
          container
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

        container.innerHTML =
          createLoading(
            'Guardando cambios...'
          )

        try {
          await updateCollectionItem(
            id,
            {
              nickname,
              notes
            }
          )

          await renderCollectionView(
            container
          )
        } catch (error) {
          container.innerHTML =
            createErrorFeedback(
              error.message
            )
        }
      }
    )
  } catch (error) {
    container.innerHTML =
      createErrorFeedback(
        error.message
      )
  }
}

const renderDeleteView = async (
  container,
  id
) => {
  container.innerHTML =
    createLoading(
      'Cargando elemento...'
    )

  try {
    const item =
      await getCollectionItemById(id)

    container.innerHTML =
      createDeleteConfirmation(item)

    const cancelButton =
      container.querySelector(
        '#delete-cancel'
      )

    const confirmButton =
      container.querySelector(
        '#delete-confirm'
      )

    cancelButton?.addEventListener(
      'click',
      async () => {
        await renderCollectionView(
          container
        )
      }
    )

    confirmButton?.addEventListener(
      'click',
      async () => {
        container.innerHTML =
          createLoading(
            'Eliminando Pokémon...'
          )

        try {
          await deleteCollectionItem(id)

          await renderCollectionView(
            container
          )
        } catch (error) {
          container.innerHTML =
            createErrorFeedback(
              error.message
            )
        }
      }
    )
  } catch (error) {
    container.innerHTML =
      createErrorFeedback(
        error.message
      )
  }
}

export const renderCollectionView = async (
  container
) => {
  container.innerHTML =
    createLoading(
      'Cargando colección...'
    )

  try {
    const collection =
      await getCollection()

    renderCollectionList(
      container,
      collection
    )

    bindCollectionEvents(container)
  } catch (error) {
    container.innerHTML =
      createErrorFeedback(
        error.message
      )
  }
}