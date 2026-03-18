import { createI18n } from 'vue-i18n'
import vi from './vi.json'
import en from './en.json'

const savedLocale = localStorage.getItem('locale') || 'vi'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    vi,
    en
  }
})

export default i18n
