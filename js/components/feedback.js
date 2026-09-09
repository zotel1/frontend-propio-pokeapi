export const createLoading = (
  message = 'Cargando Pokémon...'
) => {
  return `
    <div class="loading">
      <p>${message}</p>
    </div>
  `
}

export const createErrorFeedback = (
  message = 'Ocurrió un error'
) => {
  return `
    <section class="feedback">
      <div class="feedback__icon">
        !
      </div>

      <h2 class="feedback__title">
        Ocurrió un error
      </h2>

      <p class="feedback__message">
        ${message}
      </p>
    </section>
  `
}