export const createPagination = ({
  offset,
  limit,
  total
}) => {
  const currentPage =
    Math.floor(offset / limit) + 1

  const totalPages =
    Math.max(
      1,
      Math.ceil(total / limit)
    )

  const hasPrevious =
    offset > 0

  const hasNext =
    offset + limit < total

  return `
    <div class="pagination">

      <button
        class="
          screen-button
          screen-button--secondary
          pagination__button
        "
        id="pagination-previous"
        type="button"
        ${hasPrevious ? '' : 'disabled'}
      >
        ← Anterior
      </button>

      <span class="pagination__info">
        Página ${currentPage} de ${totalPages}
      </span>

      <button
        class="
          screen-button
          pagination__button
        "
        id="pagination-next"
        type="button"
        ${hasNext ? '' : 'disabled'}
      >
        Siguiente →
      </button>

    </div>
  `
}