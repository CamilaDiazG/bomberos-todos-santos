import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  // Importación explícita para evitar que Turbopack se confunda
  const messages = locale === 'en' 
    ? (await import('./en.json')).default 
    : (await import('./es.json')).default

  return {
    locale,
    messages
  }
})