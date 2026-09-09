const TYPE_TRANSLATIONS = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dark: 'Siniestro',
  dragon: 'Dragón',
  steel: 'Acero',
  fairy: 'Hada'
}

export const translatePokemonType = (type) => {
  return TYPE_TRANSLATIONS[type] ?? type
}