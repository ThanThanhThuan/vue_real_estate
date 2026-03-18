import { useI18n } from 'vue-i18n'

export function useLocale() {
  const { locale } = useI18n()

  const setLocale = (lang) => {
    locale.value = lang
    localStorage.setItem('locale', lang)
  }

  const currentLocale = () => locale.value

  const toggleLocale = () => {
    const newLocale = locale.value === 'vi' ? 'en' : 'vi'
    setLocale(newLocale)
  }

  return {
    locale,
    setLocale,
    currentLocale,
    toggleLocale
  }
}
