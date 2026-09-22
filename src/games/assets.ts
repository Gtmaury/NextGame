import type { KaplayCtx } from '../types'

/** Sprite names per game (files live in /assets/sprites/{name}.png). */
export const gameSprites: Record<string, string[]> = {
  catch: ['catch-paddle', 'catch-fruit'],
  tapdot: ['tapdot-target'],
  race: ['race-target'],
  dodge: ['dodge-player', 'dodge-block'],
  jump: ['jump-player', 'jump-ground'],
  balance: ['balance-needle', 'balance-zone'],
  stars: ['stars-star'],
  slice: [],
  stack: [],
  memory: [],
  flap: [],
  swipe: [],
  hold: [],
}

export function thumbUrl(id: string): string {
  return `/assets/thumbs/${id}.png`
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image()
  img.src = url
  await img.decode()
  return img
}

/** Max dimension for normalized sprites (world units in a 480x720 canvas). */
const MAX_SPRITE = 64

/** Key out magenta (#FF00FF) from a canvas in place. */
function keyOutMagenta(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const px = data.data
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i]
    const g = px[i + 1]
    const b = px[i + 2]
    if (r > 170 && g < 100 && b > 170) px[i + 3] = 0
  }
  ctx.putImageData(data, 0, 0)
}

/** Bounding box of non-transparent pixels, or null if fully transparent. */
function artBounds(canvas: HTMLCanvasElement): { x: number; y: number; w: number; h: number } | null {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  let minX = canvas.width
  let minY = canvas.height
  let maxX = 0
  let maxY = 0
  let found = false
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      if (px[(y * canvas.width + x) * 4 + 3] > 0) {
        found = true
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (!found) return null
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 }
}

/** Key out magenta (#FF00FF), crop to art bounds and downscale to a consistent size. */
function normalizeSprite(img: HTMLImageElement): HTMLImageElement {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return img
  ctx.drawImage(img, 0, 0)

  keyOutMagenta(canvas)
  const bounds = artBounds(canvas)
  if (!bounds) return img

  const bw = bounds.w
  const bh = bounds.h
  let w = bw
  let h = bh
  if (Math.max(bw, bh) > MAX_SPRITE) {
    const scale = MAX_SPRITE / Math.max(bw, bh)
    w = Math.max(1, Math.round(bw * scale))
    h = Math.max(1, Math.round(bh * scale))
  }

  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const octx = out.getContext('2d')
  if (!octx) return img
  octx.imageSmoothingEnabled = false
  octx.drawImage(canvas, bounds.x, bounds.y, bw, bh, 0, 0, w, h)
  const final = new Image()
  final.src = out.toDataURL('image/png')
  return final
}

const thumbCache = new Map<string, string>()

export function peekProcessedThumb(url: string): string | undefined {
  return thumbCache.get(url)
}

export function warmThumbCache(urls: string[]): void {
  for (const url of urls) void processedThumbUrl(url)
}

/**
 * Thumb URL with the fuchsia background keyed out and art cropped
 * (nearest-neighbor downscale to `max`). Cached per source URL.
 */
export async function processedThumbUrl(url: string, max = 256): Promise<string> {
  const cached = thumbCache.get(url)
  if (cached) return cached
  const img = await loadImage(url)
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('no 2d context')
  ctx.drawImage(img, 0, 0)
  keyOutMagenta(canvas)
  const bounds = artBounds(canvas) ?? { x: 0, y: 0, w: canvas.width, h: canvas.height }
  let w = bounds.w
  let h = bounds.h
  if (Math.max(w, h) > max) {
    const scale = max / Math.max(w, h)
    w = Math.max(1, Math.round(w * scale))
    h = Math.max(1, Math.round(h * scale))
  }
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  const octx = out.getContext('2d')
  if (!octx) throw new Error('no 2d context')
  octx.imageSmoothingEnabled = false
  octx.drawImage(canvas, bounds.x, bounds.y, bounds.w, bounds.h, 0, 0, w, h)
  const dataUrl = out.toDataURL('image/png')
  thumbCache.set(url, dataUrl)
  return dataUrl
}

async function loadKeyedImage(url: string): Promise<HTMLImageElement> {
  const img = await loadImage(url)
  const keyed = normalizeSprite(img)
  await keyed.decode()
  return keyed
}

export async function loadGameSprites(k: KaplayCtx, gameId: string): Promise<void> {
  const names = gameSprites[gameId] ?? []
  for (const name of names) {
    try {
      const img = await loadKeyedImage(`/assets/sprites/${name}.png`)
      k.loadSprite(name, img)
    } catch (err) {
      console.warn(`[assets] failed to load ${name}`, err)
    }
  }
}
