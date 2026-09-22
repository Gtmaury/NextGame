import { setLocale, t } from '../i18n'
import { useLocale } from '../hooks/useLocale'

export default function LanguageBar() {
  const locale = useLocale()

  return (
    <div className="lang-bar" role="group" aria-label={t('lang')}>
      <button
        type="button"
        className={locale === 'en' ? 'active' : ''}
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
      >
        English
      </button>
      <button
        type="button"
        className={locale === 'es' ? 'active' : ''}
        aria-pressed={locale === 'es'}
        onClick={() => setLocale('es')}
      >
        Español
      </button>
    </div>
  )
}
