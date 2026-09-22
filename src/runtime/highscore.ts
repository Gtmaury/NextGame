const KEY_PREFIX = 'ng_highscore_'

export function getHighScore(id: string): number {
  const raw = localStorage.getItem(KEY_PREFIX + id)
  if (raw === null) return 0
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : 0
}

export function submitHighScore(
  id: string,
  score: number,
): { highScore: number; isRecord: boolean } {
  const prev = getHighScore(id)
  if (score > prev) {
    localStorage.setItem(KEY_PREFIX + id, String(score))
    return { highScore: score, isRecord: true }
  }
  return { highScore: prev, isRecord: false }
}
