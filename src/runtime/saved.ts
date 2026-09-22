const KEY = 'ng_saved'

export function getSaved(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function isSaved(id: string): boolean {
  return getSaved().includes(id)
}

export function toggleSaved(id: string): boolean {
  const list = getSaved()
  const has = list.includes(id)
  const next = has ? list.filter((x) => x !== id) : [...list, id]
  localStorage.setItem(KEY, JSON.stringify(next))
  return !has
}
