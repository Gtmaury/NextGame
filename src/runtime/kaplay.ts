import kaplay from 'kaplay'
import type { KaplayCtx } from '../types'

let instance: KaplayCtx | null = null

export function getKaplay(canvas: HTMLCanvasElement): KaplayCtx {
  if (!instance) {
    instance = kaplay({
      canvas,
      width: 480,
      height: 720,
      letterbox: true,
      global: false,
      background: [7, 7, 15],
      font: 'Press Start 2P',
    })
  }
  return instance
}

export function getKaplayInstance(): KaplayCtx | null {
  return instance
}
