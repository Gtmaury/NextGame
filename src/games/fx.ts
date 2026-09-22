import type { KaplayCtx } from '../types'
import type { Rgb } from './themes'

/** Burst effect: sprite pops (scale up + fade out, optional spin/tint), then removes itself. */
export function burst(
  k: KaplayCtx,
  tag: string,
  sprite: string,
  x: number,
  y: number,
  from: number,
  spin = 0,
  color?: Rgb,
): void {
  const e = k.add([
    k.sprite(sprite),
    k.pos(x, y),
    k.anchor('center'),
    k.opacity(1),
    k.rotate(0),
    color ? k.color(...color) : k.color(255, 255, 255),
    k.scale(from),
    k.z(20),
    'fx-burst',
    tag,
  ])
  if (spin) {
    e.onUpdate(() => {
      e.angle += spin * k.dt()
    })
  }
  k.tween(k.vec2(from, from), k.vec2(from * 1.7, from * 1.7), 0.18, (v) => {
    e.scale = v
  })
  k.tween(1, 0, 0.18, (v) => {
    e.opacity = v
  })
  k.wait(0.22, () => {
    if (e.exists()) e.destroy()
  })
}

/** Error/damage feedback: red fullscreen flash + camera shake, fades out on its own. */
export function alarm(k: KaplayCtx, tag: string, shake = 0): void {
  const flash = k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.color(244, 63, 94),
    k.opacity(0.3),
    k.z(30),
    'fx-flash',
    tag,
  ])
  k.tween(0.3, 0, 0.3, (v) => {
    flash.opacity = v
  })
  k.wait(0.32, () => {
    if (flash.exists()) flash.destroy()
  })
  if (shake) k.shake(shake)
}
