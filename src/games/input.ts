import type { KaplayCtx } from '../types'

export type Point = { x: number; y: number }

type Fn<T extends unknown[]> = (...args: T) => void

function isChrome(target: EventTarget | null) {
  return target instanceof Element && !!target.closest('.exit-btn, .overlay, .overlay-panel')
}

function keyName(e: KeyboardEvent) {
  const k = e.key.toLowerCase()
  if (k === ' ') return 'space'
  return k
}

/**
 * Window-level mouse + keyboard so games work on desktop, not only on the
 * letterboxed canvas (Kaplay mouse events never fire on the black bars).
 */
export function createGameInput(k: KaplayCtx) {
  const canvas = k.canvas
  let pointerDown = false
  let x = k.width() / 2
  let y = k.height() / 2
  const held = new Set<string>()
  const pressFns = new Set<Fn<[Point]>>()
  const releaseFns = new Set<Fn<[Point]>>()
  const moveFns = new Set<Fn<[Point]>>()
  const keyFns = new Set<Fn<[string]>>()

  function toGame(clientX: number, clientY: number): Point {
    const rect = canvas.getBoundingClientRect()
    const rw = rect.width || 1
    const rh = rect.height || 1
    return {
      x: Math.max(0, Math.min(k.width(), ((clientX - rect.left) / rw) * k.width())),
      y: Math.max(0, Math.min(k.height(), ((clientY - rect.top) / rh) * k.height())),
    }
  }

  function setPos(p: Point) {
    x = p.x
    y = p.y
  }

  const onPointerDown = (e: PointerEvent) => {
    if (!e.isPrimary) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (isChrome(e.target)) return
    pointerDown = true
    setPos(toGame(e.clientX, e.clientY))
    for (const fn of pressFns) fn({ x, y })
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!e.isPrimary) return
    setPos(toGame(e.clientX, e.clientY))
    if (pointerDown) {
      for (const fn of moveFns) fn({ x, y })
    }
  }

  const onPointerUp = (e: PointerEvent) => {
    if (!e.isPrimary) return
    setPos(toGame(e.clientX, e.clientY))
    if (!pointerDown) return
    pointerDown = false
    for (const fn of releaseFns) fn({ x, y })
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return
    if (isChrome(e.target)) return
    const key = keyName(e)
    if (
      key === 'space' ||
      key === 'enter' ||
      key === 'arrowleft' ||
      key === 'arrowright' ||
      key === 'arrowup' ||
      key === 'arrowdown'
    ) {
      e.preventDefault()
    }
    held.add(key)
    for (const fn of keyFns) fn(key)
    if (key === 'space' || key === 'enter') {
      for (const fn of pressFns) fn({ x, y })
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    const key = keyName(e)
    held.delete(key)
    if (key === 'space' || key === 'enter') {
      for (const fn of releaseFns) fn({ x, y })
    }
  }

  const opts: AddEventListenerOptions = { capture: true }
  window.addEventListener('pointerdown', onPointerDown, opts)
  window.addEventListener('pointermove', onPointerMove, opts)
  window.addEventListener('pointerup', onPointerUp, opts)
  window.addEventListener('pointercancel', onPointerUp, opts)
  window.addEventListener('keydown', onKeyDown, opts)
  window.addEventListener('keyup', onKeyUp, opts)

  return {
    pos(): Point {
      return { x, y }
    },
    isDown() {
      return pointerDown || held.has('space') || held.has('enter')
    },
    isKeyDown(key: string) {
      return held.has(key)
    },
    onPress(fn: Fn<[Point]>) {
      pressFns.add(fn)
      return () => pressFns.delete(fn)
    },
    onRelease(fn: Fn<[Point]>) {
      releaseFns.add(fn)
      return () => releaseFns.delete(fn)
    },
    onMove(fn: Fn<[Point]>) {
      moveFns.add(fn)
      return () => moveFns.delete(fn)
    },
    onKey(fn: Fn<[string]>) {
      keyFns.add(fn)
      return () => keyFns.delete(fn)
    },
    cancel() {
      window.removeEventListener('pointerdown', onPointerDown, opts)
      window.removeEventListener('pointermove', onPointerMove, opts)
      window.removeEventListener('pointerup', onPointerUp, opts)
      window.removeEventListener('pointercancel', onPointerUp, opts)
      window.removeEventListener('keydown', onKeyDown, opts)
      window.removeEventListener('keyup', onKeyUp, opts)
      pressFns.clear()
      releaseFns.clear()
      moveFns.clear()
      keyFns.clear()
      held.clear()
    },
  }
}

export function dist(a: Point, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export type GameInput = ReturnType<typeof createGameInput>
