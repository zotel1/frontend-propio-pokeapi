export const createCollectionForm = (pokemon) => {
  return `
    <section class="view">

      <h2 class="view__title">
        Agregar a colección
      </h2>

      <div class="form-panel">

        <p>
          Agregar
          <strong>${pokemon.name}</strong>
        </p>

        <form id="collection-form">

          <div class="form-field">
            <label for="collection-nickname">
              Apodo
            </label>

            <input
              id="collection-nickname"
              name="nickname"
              type="text"
              maxlength="50"
              placeholder="Ejemplo: Chispita"
            >
          </div>

          <div class="form-field">
            <label for="collection-notes">
              Notas
            </label>

            <textarea
              id="collection-notes"
              name="notes"
              maxlength="250"
              placeholder="Escribí una nota..."
            ></textarea>
          </div>

          <div class="form-actions">

            <button
              class="
                screen-button
                screen-button--secondary
              "
              id="collection-cancel"
              type="button"
            >
              Cancelar
            </button>

            <button
              class="screen-button"
              type="submit"
            >
              Guardar
            </button>

          </div>

        </form>

      </div>

    </section>
  `
}

export const createCollectionSuccess = (item) => {
  return `
    <section class="feedback">

      <div class="feedback__icon">
        ✓
      </div>

      <h2 class="feedback__title">
        Pokémon guardado
      </h2>

      <p class="feedback__message">
        ${item.name}
        fue agregado a la colección.
      </p>

      <button
        class="screen-button"
        id="collection-success-back"
        type="button"
      >
        Volver
      </button>

    </section>
  `
}