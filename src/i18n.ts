export type Locale = 'en' | 'es'

const STORAGE_KEY = 'nextgame-locale'
const DEFAULT_LOCALE: Locale = 'en'

const listeners = new Set<() => void>()
let current: Locale = DEFAULT_LOCALE

function isLocale(v: string | null): v is Locale {
  return v === 'en' || v === 'es'
}

export function initLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) current = stored
  } catch {
    /* ignore */
  }
  document.documentElement.lang = current
}

export function getLocale(): Locale {
  return current
}

export function setLocale(next: Locale) {
  if (next === current) return
  current = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* ignore */
  }
  document.documentElement.lang = next
  listeners.forEach((fn) => fn())
}

export function subscribeLocale(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

const GAMES = {
  catch: {
    en: { title: 'Catch the fruit', hint: 'Move the mouse or use ← →' },
    es: { title: 'Atrapa la fruta', hint: 'Mueve el ratón o usa ← →' },
  },
  tapdot: {
    en: { title: 'Tap the dot', hint: 'Click or tap the dot in time' },
    es: { title: 'Toca el punto', hint: 'Clic o toca el punto a tiempo' },
  },
  race: {
    en: { title: 'Time trial', hint: 'Click the targets fast' },
    es: { title: 'Contrarreloj', hint: 'Clic rápido en los blancos' },
  },
  dodge: {
    en: { title: 'Dodge', hint: 'Move the mouse or use ← →' },
    es: { title: 'Esquiva', hint: 'Mueve el ratón o usa ← →' },
  },
  jump: {
    en: { title: 'Jump', hint: 'Click or space to jump · hold to rise' },
    es: { title: 'Salto', hint: 'Clic o espacio para saltar · mantén para subir' },
  },
  balance: {
    en: { title: 'Balance', hint: 'Hold click or space to balance' },
    es: { title: 'Equilibrio', hint: 'Mantén clic o espacio para equilibrar' },
  },
  stars: {
    en: { title: 'Stars', hint: 'Click the gold ones, skip the red' },
    es: { title: 'Estrellas', hint: 'Clic en las doradas, evita las rojas' },
  },
  slice: {
    en: { title: 'Slice', hint: 'Drag the mouse to cut' },
    es: { title: 'Corte', hint: 'Arrastra el ratón para cortar' },
  },
  stack: {
    en: { title: 'Tower', hint: 'Click or space to stack' },
    es: { title: 'Torre', hint: 'Clic o espacio para apilar' },
  },
  memory: {
    en: { title: 'Memory', hint: 'Click the pads · 1–4' },
    es: { title: 'Memoria', hint: 'Clic en las teclas · 1-4' },
  },
  flap: {
    en: { title: 'Flap', hint: 'Click or space to flap' },
    es: { title: 'Aleteo', hint: 'Clic o espacio para aletear' },
  },
  swipe: {
    en: { title: 'Lanes', hint: 'Drag or use ← →' },
    es: { title: 'Carriles', hint: 'Arrastra o usa ← →' },
  },
  hold: {
    en: { title: 'Charge', hint: 'Hold click or space · release to fire' },
    es: { title: 'Carga', hint: 'Mantén clic o espacio · suelta para lanzar' },
  },
} as const

export type GameId = keyof typeof GAMES

const ui = {
  en: {
    tabPlay: 'Play',
    tabSaved: 'Saved',
    tabScores: 'Records',
    attemptsAria: 'Attempts left',
    attemptsInfinite: '∞ tries',
    donate: 'Donate',
    donateCopy: 'Copy',
    donateCopied: 'Copied',
    play: 'Play',
    save: 'Save',
    saved: 'Saved',
    remove: 'Remove',
    feedHint: 'swipe ↑↓ · tap to play',
    emptySavedTitle: 'Nothing saved',
    emptySavedBody: 'Save a game from the feed to see it here.',
    emptyScoresTitle: 'No records yet',
    emptyScoresBody: 'Play a round to log your first score.',
    close: 'Close',
    youLost: 'You lost',
    score: 'Score',
    highScore: 'Record',
    attempts: 'Attempts',
    continueInfinite: 'Continue (∞)',
    continueOne: 'Continue (1 try)',
    exit: 'Exit',
    watchAd: 'Watch an ad',
    watchAdBody: 'Watch a short ad to get 1 try back and keep playing.',
    continuePlus: 'Continue (+1 try)',
    cancel: 'Cancel',
    wait: 'Wait a moment',
    waitBody: 'Browse other minigames while you recover a try.',
    game: 'Game',
    lang: 'Language',
  },
  es: {
    tabPlay: 'Jugar',
    tabSaved: 'Guardados',
    tabScores: 'Récords',
    attemptsAria: 'Intentos disponibles',
    attemptsInfinite: '∞ intentos',
    donate: 'Donar',
    donateCopy: 'Copiar',
    donateCopied: 'Copiado',
    play: 'Jugar',
    save: 'Guardar',
    saved: 'Guardado',
    remove: 'Quitar',
    feedHint: 'desliza ↑↓ · toca para jugar',
    emptySavedTitle: 'Sin guardados',
    emptySavedBody: 'Guarda un juego desde el feed para verlo aquí.',
    emptyScoresTitle: 'Sin récords',
    emptyScoresBody: 'Juega una partida para registrar tu primera puntuación.',
    close: 'Cerrar',
    youLost: 'Perdiste',
    score: 'Puntuación',
    highScore: 'Récord',
    attempts: 'Intentos',
    continueInfinite: 'Continuar (∞)',
    continueOne: 'Continuar (1 intento)',
    exit: 'Salir',
    watchAd: 'Ver anuncio',
    watchAdBody: 'Mira un breve anuncio para recuperar 1 intento y seguir jugando.',
    continuePlus: 'Continuar (+1 intento)',
    cancel: 'Cancelar',
    wait: 'Espera un momento',
    waitBody: 'Descubre otros minijuegos mientras recuperas un intento.',
    game: 'Juego',
    lang: 'Idioma',
  },
} as const

export type UiKey = keyof typeof ui.en

export function t(key: UiKey): string {
  return ui[current][key]
}

export function gameTitle(id: string): string {
  const entry = GAMES[id as GameId]
  return entry ? entry[current].title : id
}

export function gameHint(id: string): string {
  const entry = GAMES[id as GameId]
  return entry ? entry[current].hint : ''
}

export function hudLv(n: number): string {
  return current === 'es' ? `Nv ${n}` : `Lv ${n}`
}

export function hudPts(n: number): string {
  return `${n} pts`
}

export function hudRound(n: number): string {
  return current === 'es' ? `Ronda ${n}` : `Round ${n}`
}

export function recordLabel(n: number): string {
  return current === 'es' ? `Récord: ${n}` : `Record: ${n}`
}

export function attemptsCount(n: number): string {
  return current === 'es' ? `⚡ ${n}` : `⚡ ${n}`
}

export function savedLabel(saved: boolean): string {
  if (saved) return current === 'es' ? '✓ Guardado' : '✓ Saved'
  return current === 'es' ? '🔖 Guardar' : '🔖 Save'
}
