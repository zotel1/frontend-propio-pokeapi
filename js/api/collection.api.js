import { API_BASE_URL } from '../config.js'

const request = async (
  endpoint,
  options = {}
) => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }
  )

  if (!response.ok) {
    let message =
      'Ocurrió un error al comunicarse con el backend'

    try {
      const data = await response.json()

      if (data?.error?.message) {
        message = data.error.message
      }
    } catch {
      // Conservamos el mensaje genérico.
    }

    throw new Error(message)
  }

  return response.json()
}

export const getCollection = async () => {
  return request('/api/collection')
}

export const getCollectionItemById = async (id) => {
  return request(`/api/collection/${id}`)
}

export const createCollectionItem = async ({
  pokemonId,
  nickname,
  notes
}) => {
  return request(
    '/api/collection',
    {
      method: 'POST',
      body: JSON.stringify({
        pokemonId,
        nickname,
        notes
      })
    }
  )
}

export const updateCollectionItem = async (
  id,
  changes
) => {
  return request(
    `/api/collection/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(changes)
    }
  )
}

export const deleteCollectionItem = async (id) => {
  return request(
    `/api/collection/${id}`,
    {
      method: 'DELETE'
    }
  )
}