import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import ru from './locales/ru'
import en from './locales/en'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import { authApi } from './slices/authApi'
import { channelsApi } from './slices/channelsApi'
import { messagesApi } from './slices/messagesApi'
import SocketProvider from './contexts/SocketProvider'
import App from './App.jsx'

Sentry.init({
  dsn: import.meta.env.VITE_BUGSINK_DSN,
})

const init = async (socket) => {
  const i18n = i18next.createInstance()
  await i18n.use(initReactI18next).init({
    lng: 'ru',
    fallbackLng: 'ru',
    resources: { ru, en },
  })

  const store = configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      [authApi.reducerPath]: authApi.reducer,
      [channelsApi.reducerPath]: channelsApi.reducer,
      [messagesApi.reducerPath]: messagesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authApi.middleware,
        channelsApi.middleware,
        messagesApi.middleware,
      ),
  })

  return (
    <Provider store={store}>
      <SocketProvider socket={socket}>
        <App />
      </SocketProvider>
    </Provider>
  )
}

export default init
