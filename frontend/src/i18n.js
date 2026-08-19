import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './locales/ru'
import en from './locales/en'

i18next
  .use(initReactI18next)
  .init({
    lng: 'ru',
    fallbackLng: 'ru',
    resources: {
      ru,
      en,
    },
  })

export default i18next
