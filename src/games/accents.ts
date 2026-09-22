export interface GameAccent {
  accent: string
  accentInk: string
}

/** Menu/chrome accents per game — distinct primaries for swipe feedback. */
export const gameAccents: Record<string, GameAccent> = {
  catch: { accent: '#34d399', accentInk: '#062016' },
  tapdot: { accent: '#38bdf8', accentInk: '#061018' },
  race: { accent: '#0ea5e9', accentInk: '#041018' },
  dodge: { accent: '#fb7185', accentInk: '#1a0810' },
  jump: { accent: '#e09b3d', accentInk: '#1a1205' },
  balance: { accent: '#7da0be', accentInk: '#0c1218' },
  stars: { accent: '#eab308', accentInk: '#1a1405' },
  slice: { accent: '#f43f5e', accentInk: '#1a060c' },
  stack: { accent: '#a78bfa', accentInk: '#12081f' },
  memory: { accent: '#2dd4bf', accentInk: '#061816' },
  flap: { accent: '#818cf8', accentInk: '#0a0c1a' },
  swipe: { accent: '#fb923c', accentInk: '#1a0c04' },
  hold: { accent: '#f472b6', accentInk: '#1a0810' },
}

const fallback: GameAccent = { accent: '#e09b3d', accentInk: '#1a1205' }

export function getAccent(id: string): GameAccent {
  return gameAccents[id] ?? fallback
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Apply game accent CSS variables on an element (scoped chrome). */
export function applyAccent(el: HTMLElement | null, gameId: string | null): void {
  if (!el) return
  if (!gameId) return
  const { accent, accentInk } = getAccent(gameId)
  el.style.setProperty('--accent', accent)
  el.style.setProperty('--accent-ink', accentInk)
  el.style.setProperty('--shadow-accent', `0 8px 28px ${hexToRgba(accent, 0.22)}`)
  el.style.setProperty('--accent-soft', hexToRgba(accent, 0.14))
  el.style.setProperty('--accent-border', hexToRgba(accent, 0.35))
}
