export const setBackendStatus = (element, status) => {
  if (!element) return

  element.classList.remove(
    'status-light--online',
    'status-light--offline',
    'status-light--checking'
  )

  if (status === 'online') {
    element.classList.add('status-light--online')
    element.title = 'Backend online'
    return
  }

  if (status === 'offline') {
    element.classList.add('status-light--offline')
    element.title = 'Backend offline'
    return
  }

  element.classList.add('status-light--checking')
  element.title = 'Verificando backend'
}