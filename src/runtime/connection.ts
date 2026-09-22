export function isOnlineNow(): boolean {
  return navigator.onLine
}

export async function probeOnline(): Promise<boolean> {
  if (!navigator.onLine) return false
  try {
    const res = await fetch('/favicon.svg', { method: 'HEAD', cache: 'no-store' })
    return res.ok
  } catch {
    return false
  }
}
