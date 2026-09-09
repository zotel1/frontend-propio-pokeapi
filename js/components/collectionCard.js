export const createCollectionCard = (item) => {
  return `
    <article
      class="collection-card"
      data-collection-id="${item.id}"
    >
      <h3 class="collection-card__name">
        ${item.name}
      </h3>

      <p class="collection-card__nickname">
        ${
          item.nickname
            ? `Apodo: ${item.nickname}`
            : 'Sin apodo'
        }
      </p>

      <p class="collection-card__nickname">
        ${
          item.notes
            ? item.notes
            : 'Sin notas'
        }
      </p>

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