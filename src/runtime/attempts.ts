const KEY = 'ng_attempts'
const DEFAULT = 5

export function getAttempts(): number {
  const raw = localStorage.getItem(KEY)
  if (raw === null) return DEFAULT
  const n = parseInt(raw, 10)
  return Number.isFinite(n) ? n : DEFAULT
}

export function setAttempts(n: number): void {
  localStorage.setItem(KEY, String(Math.max(0, n)))
}

export function spendAttempt(): boolean {
  const n = getAttempts()
  if (n <= 0) return false
  setAttempts(n - 1)
  return true
}

export function addAttempts(delta: number): void {
  setAttempts(getAttempts() + delta)
}
