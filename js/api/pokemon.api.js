import { API_BASE_URL } from '../config.js'

const request = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)

  if (!response.ok) {
    let message = 'Ocurrió un error al comunicarse con el backend'

    try {
      const data = await response.json()

      if (data?.error?.message) {
        message = data.error.message
      }
    } catch {
      // Si el backend no devuelve JSON válido,
      // conservamos el mensaje genérico.
    }

    throw new Error(message)
  }

  return response.json()
}

export const getRandomPokemon = async () => {
  return request('/api/pokemon/random')
}

export const getPokemonByName = async (name) => {
  const normalizedName = name.trim()

  return request(
    `/api/pokemon?name=${encodeURIComponent(normalizedName)}`
  )
}

export const getPokemonById = async (id) => {
  return request(`/api/pokemon/${id}`)
}

export const getPokemonByType = async (
  type,
  limit = 20,
  offset = 0
) => {
  const params = new URLSearchParams({
    type,
    limit,
    offset
  })

  return request(`/api/pokemon?${params.toString()}`)
}

export const getPokemonTypes = async () => {
  return request('/api/types')
}

export const getBackendHealth = async () => {
  return request('/api/health')
}