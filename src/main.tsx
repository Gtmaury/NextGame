import ReactDOM from 'react-dom/client'
import App from './App'
import { gameMeta } from './games/meta'
import { processedThumbUrl } from './games/assets'
import { initLocale } from './i18n'
import './index.css'

initLocale()

void document.fonts.load('12px "Press Start 2P"')
void document.fonts.load('14px "Pixelify Sans"')

const root = ReactDOM.createRoot(document.getElementById('root')!)
const thumbUrls = Object.values(gameMeta).map((m) => m.thumbnail)

Promise.allSettled(thumbUrls.map((url) => processedThumbUrl(url))).finally(() => {
  root.render(<App />)
})
