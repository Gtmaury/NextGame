import { getKaplayInstance } from './kaplay'
import { loadGame } from '../games/registry'

const loaded = new Set<string>()

export async function preloadGame(id: string): Promise<void> {
  if (loaded.has(id)) return
  loaded.add(id)
  const def = await loadGame(id)
  const k = getKaplayInstance()
  if (k) await def.preload(k)
}
