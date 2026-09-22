import type { MiniGameDef } from '../types'
import { gameIds } from './meta'

const loaders: Record<string, () => Promise<MiniGameDef>> = {
  catch: () => import('./catch').then((m) => m.game),
  tapdot: () => import('./tapdot').then((m) => m.game),
  race: () => import('./race').then((m) => m.game),
  dodge: () => import('./dodge').then((m) => m.game),
  jump: () => import('./jump').then((m) => m.game),
  balance: () => import('./balance').then((m) => m.game),
  stars: () => import('./stars').then((m) => m.game),
  slice: () => import('./slice').then((m) => m.game),
  stack: () => import('./stack').then((m) => m.game),
  memory: () => import('./memory').then((m) => m.game),
  flap: () => import('./flap').then((m) => m.game),
  swipe: () => import('./swipe').then((m) => m.game),
  hold: () => import('./hold').then((m) => m.game),
}

export { gameIds }

export function loadGame(id: string): Promise<MiniGameDef> {
  const loader = loaders[id]
  if (!loader) return Promise.reject(new Error(`Juego desconocido: ${id}`))
  return loader()
}
