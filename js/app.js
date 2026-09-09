import {
  renderHomeView
} from './views/home.view.js'

const screenContent =
  document.querySelector('#screen-content')

const initializeApp = async () => {
  await renderHomeView(screenContent)
}

initializeApp()