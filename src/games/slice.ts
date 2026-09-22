import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { alarm } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'slice',
  title: 'Corte',
  thumbnail: '✂️',
  lifeModel: 'retry',
  initialLives: 3,
  async preload() {},
  mount(k, cb) {
    const TAG = game.id
    const theme = getTheme(game.id)
    applyBackground(k, theme.bg)

    const W = k.width()
    const H = k.height()
    let lives = game.initialLives
    let score = 0
    let over = false
    let spawnT = 0.7
    let slash: { x0: number; y0: number; x1: number; y1: number; life: number } | null = null
    let dragging = false
    let dragFrom: { x: number; y: number } | null = null

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({ lives, label: hudLv(1 + Math.floor(score / 6)), score: hudPts(score) })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    function hitMiss() {
      if (over) return
      lives--
      renderHud()
      alarm(k, TAG, 10)
      if (lives <= 0) end()
    }

    function segHitsCircle(
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      cx: number,
      cy: number,
      r: number,
    ) {
      const dx = x1 - x0
      const dy = y1 - y0
      const len2 = dx * dx + dy * dy || 1
      let t = ((cx - x0) * dx + (cy - y0) * dy) / len2
      t = Math.max(0, Math.min(1, t))
      const px = x0 + t * dx
      const py = y0 + t * dy
      const ddx = cx - px
      const ddy = cy - py
      return ddx * ddx + ddy * ddy <= r * r
    }

    function spawn() {
      const fromLeft = k.rand(0, 1) < 0.5
      const y = k.rand(H * 0.22, H * 0.72)
      const speed = 180 + score * 12
      const r = k.rand(18, 28)
      const fruit = k.add([
        k.circle(r),
        k.pos(fromLeft ? -40 : W + 40, y),
        k.color(...theme.secondary),
        k.outline(3, k.rgb(...theme.primary)),
        k.area(),
        k.anchor('center'),
        k.rotate(0),
        k.scale(1),
        k.z(5),
        'fruit',
        TAG,
        { vx: fromLeft ? speed : -speed, vr: k.rand(-120, 120), sliced: false, rad: r },
      ])
      fruit.onUpdate(() => {
        if (over || fruit.sliced) return
        fruit.pos.x += fruit.vx * k.dt()
        ;(fruit as any).angle += fruit.vr * k.dt()
        if (fruit.pos.x < -80 || fruit.pos.x > W + 80) {
          fruit.destroy()
          hitMiss()
        }
      })
    }

    function slashFruits(x0: number, y0: number, x1: number, y1: number) {
      slash = { x0, y0, x1, y1, life: 0.12 }
      for (const f of k.get('fruit') as any[]) {
        if (f.sliced) continue
        if (segHitsCircle(x0, y0, x1, y1, f.pos.x, f.pos.y, f.rad + 8)) {
          f.sliced = true
          score++
          renderHud()
          const cx = f.pos.x
          const cy = f.pos.y
          f.destroy()
          const pop = k.add([
            k.circle(12),
            k.pos(cx, cy),
            k.anchor('center'),
            k.color(...theme.primary),
            k.opacity(1),
            k.scale(1),
            k.z(20),
            TAG,
          ])
          k.tween(1, 0, 0.2, (v) => {
            pop.opacity = v
            ;(pop as any).scale = k.vec2(1 + (1 - v), 1 + (1 - v))
          })
          k.wait(0.22, () => {
            if (pop.exists()) pop.destroy()
          })
        }
      }
    }

    const input = createGameInput(k)
    input.onPress((p) => {
      if (over) return
      dragging = true
      dragFrom = { x: p.x, y: p.y }
    })
    input.onMove((p) => {
      if (!dragging || !dragFrom || over) return
      slashFruits(dragFrom.x, dragFrom.y, p.x, p.y)
      dragFrom = { x: p.x, y: p.y }
    })
    input.onRelease((p) => {
      if (!dragging || !dragFrom || over) {
        dragging = false
        dragFrom = null
        return
      }
      const len = Math.hypot(p.x - dragFrom.x, p.y - dragFrom.y)
      dragging = false
      if (len >= 28) slashFruits(dragFrom.x, dragFrom.y, p.x, p.y)
      dragFrom = null
    })

    const slashDraw = k.onDraw(() => {
      if (!slash) return
      k.drawLine({
        p1: k.vec2(slash.x0, slash.y0),
        p2: k.vec2(slash.x1, slash.y1),
        width: 6,
        color: k.rgb(...theme.primary),
      })
    })

    const update = k.onUpdate(() => {
      if (over) return
      if (slash) {
        slash.life -= k.dt()
        if (slash.life <= 0) slash = null
      }
      spawnT -= k.dt()
      if (spawnT <= 0) {
        spawn()
        if (score >= 10) spawn()
        spawnT = Math.max(0.35, 0.85 - score * 0.025)
      }
    })

    renderHud()

    return () => {
      input.cancel()
      slashDraw.cancel()
      update.cancel()
      k.destroyAll(TAG)
      resetBackground(k)
    }
  },
}
