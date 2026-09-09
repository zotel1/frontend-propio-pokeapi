const screenContent = document.querySelector('#screen-content')

screenContent.innerHTML = `
  <section class="pokemon-display">

    <div class="pokemon-display__image-wrapper">
      <img
        class="pokemon-display__image"
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
        alt="Pikachu"
      >
    </div>

    <p class="pokemon-display__id">
      #025
    </p>

    <h2 class="pokemon-display__name">
      Pikachu
    </h2>

    <div class="pokemon-display__types">
      <span class="type-chip type-chip--electric">
        Electric
      </span>
    </div>

    <div class="pokemon-stats">

      <div class="pokemon-stat">
        <span class="pokemon-stat__label">
          Peso
        </span>

        <span class="pokemon-stat__value">
          6 kg
        </span>
      </div>

      <div class="pokemon-stat">
        <span class="pokemon-stat__label">
          Altura
        </span>

        <span class="pokemon-stat__value">
          0.4 m
        </span>
      </div>

    </div>

    <button
      class="screen-button"
      type="button"
    >
      + Agregar a colección
    </button>

  </section>
`