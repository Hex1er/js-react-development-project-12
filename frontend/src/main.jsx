import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './i18n'
import App from './App.jsx'
import store from './slices/index.js'

Sentry.init({
  dsn: import.meta.env.VITE_BUGSINK_DSN,
})

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
