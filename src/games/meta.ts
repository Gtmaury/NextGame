import { thumbUrl } from './assets'

export interface GameMeta {
  id: string
  title: string
  /** Pixel thumb URL under /assets/thumbs */
  thumbnail: string
}

export const gameMeta: Record<string, GameMeta> = {
  catch: { id: 'catch', title: 'Catch the fruit', thumbnail: thumbUrl('catch') },
  tapdot: { id: 'tapdot', title: 'Tap the dot', thumbnail: thumbUrl('tapdot') },
  race: { id: 'race', title: 'Time trial', thumbnail: thumbUrl('race') },
  dodge: { id: 'dodge', title: 'Dodge', thumbnail: thumbUrl('dodge') },
  jump: { id: 'jump', title: 'Jump', thumbnail: thumbUrl('jump') },
  balance: { id: 'balance', title: 'Balance', thumbnail: thumbUrl('balance') },
  stars: { id: 'stars', title: 'Stars', thumbnail: thumbUrl('stars') },
  slice: { id: 'slice', title: 'Slice', thumbnail: thumbUrl('slice') },
  stack: { id: 'stack', title: 'Tower', thumbnail: thumbUrl('stack') },
  memory: { id: 'memory', title: 'Memory', thumbnail: thumbUrl('memory') },
  flap: { id: 'flap', title: 'Flap', thumbnail: thumbUrl('flap') },
  swipe: { id: 'swipe', title: 'Lanes', thumbnail: thumbUrl('swipe') },
  hold: { id: 'hold', title: 'Charge', thumbnail: thumbUrl('hold') },
}

export const gameIds = Object.keys(gameMeta)

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
