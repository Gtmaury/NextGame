import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { loadGameSprites } from './assets'
import { burst } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput, dist } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'race',
  title: 'Contrarreloj',
  thumbnail: '⏱️',
  lifeModel: 'time',
  initialLives: 0,
  async preload(k) {
    await loadGameSprites(k, game.id)
  },
  mount(k, cb) {
    const TAG = game.id
    const theme = getTheme(game.id)
    applyBackground(k, theme.bg)

    const START_TIME = 8
    let score = 0
    let remaining = START_TIME
    let over = false
    let dot: any = null

    for (let i = 0; i < 6; i++) {
      k.add([
        k.rect(k.width(), 2),
        k.pos(0, 100 + i * 90),
        k.color(...theme.secondary),
        k.opacity(0.08),
        k.z(0),
        TAG,
      ])
    }

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({ time: remaining, label: hudLv(1 + Math.floor(score / 5)), score: hudPts(score) })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    function spawn() {
      const pos = k.vec2(k.rand(40, k.width() - 40), k.rand(100, k.height() - 40))
      if (dot) dot.destroy()
      dot = k.add([
        k.sprite('race-target'),
        k.scale(0.9),
        k.opacity(1),
        k.pos(pos),
        k.area(),
        k.anchor('center'),
        k.z(6),
        TAG,
      ])
      const speed = Math.min(100, 10 + score * 2.2)
      const ang = k.rand(0, Math.PI * 2)
      let dvx = Math.cos(ang) * speed
      let dvy = Math.sin(ang) * speed
      let t = 0
      let turnT = 0
      dot.onUpdate(() => {
        const dt = k.dt()
        t += dt
        turnT += dt
        if (turnT > 1.4) {
          turnT = 0
          const rot = k.rand(-0.9, 0.9)
          const nvx = dvx * Math.cos(rot) - dvy * Math.sin(rot)
          dvy = dvx * Math.sin(rot) + dvy * Math.cos(rot)
          dvx = nvx
        }
        dot.pos.x += dvx * dt
        dot.pos.y += dvy * dt
        if (dot.pos.x < 40 || dot.pos.x > k.width() - 40) {
          dvx *= -1
          dot.pos.x = Math.max(40, Math.min(k.width() - 40, dot.pos.x))
        }
        if (dot.pos.y < 110 || dot.pos.y > k.height() - 40) {
          dvy *= -1
          dot.pos.y = Math.max(110, Math.min(k.height() - 40, dot.pos.y))
        }
        const urgent = remaining < 3
        const rate = urgent ? 14 : 6
        const s = Math.min(1, t / 0.12) * (0.9 + Math.sin(t * rate) * 0.05)
        dot.scale = k.vec2(s, s)
        if (urgent) dot.opacity = Math.sin(t * 20) > 0 ? 1 : 0.5
      })
    }

    const update = k.onUpdate(() => {
      if (over) return
      remaining -= k.dt()
      renderHud()
      if (remaining <= 0) end()
    })

    const input = createGameInput(k)
    input.onPress((p) => {
      if (over) return
      const radius = Math.max(30, 56 - score)
      if (dot && dist(p, dot.pos) < radius) {
        burst(k, TAG, 'race-target', dot.pos.x, dot.pos.y, 0.9)
        dot.destroy()
        dot = null
        score++
        remaining = Math.min(remaining + Math.max(0.6, 1.6 - score * 0.03), 12)
        renderHud()
        spawn()
      }
    })

    renderHud()
    spawn()

    return () => {
      input.cancel()
      update.cancel()
      k.destroyAll(TAG)
      resetBackground(k)
    }
  },
}
