const KEY = 'ng_premium'

export function isPremium(): boolean {
  return localStorage.getItem(KEY) === '1'
}

export function setPremium(v: boolean): void {
  localStorage.setItem(KEY, v ? '1' : '0')
}
