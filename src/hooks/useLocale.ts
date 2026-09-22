import { useEffect, useState } from 'react'
import { getLocale, subscribeLocale } from '../i18n'

/** Re-render when the user switches English / Español. */
export function useLocale() {
  const [locale, setLocaleState] = useState(getLocale)

  useEffect(() => subscribeLocale(() => setLocaleState(getLocale())), [])

  return locale
}
