import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { loadGameSprites } from './assets'
import { burst, alarm } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput, dist } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'tapdot',
  title: 'Toca el punto',
  thumbnail: '🎯',
  lifeModel: 'retry',
  initialLives: 3,
  async preload(k) {
    await loadGameSprites(k, game.id)
  },
  mount(k, cb) {
    const TAG = game.id
    const theme = getTheme(game.id)
    applyBackground(k, theme.bg)

    let lives = game.initialLives
    let score = 0
    let over = false
    let dot: any = null
    let decoys: any[] = []
    let ttl = 0

    k.add([
      k.circle(160),
      k.pos(k.width() / 2, k.height() / 2),
      k.anchor('center'),
      k.color(...theme.secondary),
      k.opacity(0.08),
      k.z(0),
      TAG,
    ])

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({ lives, label: hudLv(1 + Math.floor(score / 5)), score: hudPts(score) })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    function clearDot() {
      if (dot) {
        dot.destroy()
        dot = null
      }
      for (const d of decoys) d.destroy()
      decoys = []
    }

    function decoyHit(d: any) {
      if (over) return
      decoys = decoys.filter((x) => x !== d)
      burst(k, TAG, 'tapdot-target', d.pos.x, d.pos.y, 0.9, 360, [235, 70, 105])
      d.destroy()
      lives--
      renderHud()
      alarm(k, TAG, 12)
      if (lives <= 0) end()
    }

    function miss() {
      if (over) return
      clearDot()
      lives--
      renderHud()
      if (lives <= 0) end()
      else spawn()
    }

    function hit() {
      if (over) return
      if (dot) burst(k, TAG, 'tapdot-target', dot.pos.x, dot.pos.y, 0.9)
      clearDot()
      score++
      renderHud()
      spawn()
    }

    function spawn() {
      const pos = k.vec2(k.rand(40, k.width() - 40), k.rand(100, k.height() - 40))
      dot = k.add([
        k.sprite('tapdot-target'),
        k.scale(0.9),
        k.opacity(1),
        k.pos(pos),
        k.area(),
        k.anchor('center'),
        k.z(6),
        TAG,
      ])
      ttl = Math.max(0.45, 1.2 - score * 0.04)
      const base = Math.max(0.55, 0.9 - score * 0.012)
      const speed = Math.min(90, 12 + score * 2)
      const ang = k.rand(0, Math.PI * 2)
      let dvx = Math.cos(ang) * speed
      let dvy = Math.sin(ang) * speed
      let t = 0
      let turnT = 0
      dot.onUpdate(() => {
        const dt = k.dt()
        t += dt
        turnT += dt
        if (turnT > 1.5) {
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
        const urgent = ttl < 0.45
        const rate = urgent ? 16 : 6
        const amp = urgent ? 0.09 : 0.05
        const s = Math.min(1, t / 0.12) * (base + Math.sin(t * rate) * amp * base)
        dot.scale = k.vec2(s, s)
        if (urgent) dot.opacity = Math.sin(t * 24) > 0 ? 1 : 0.45
      })
      // red decoys from score 6: tapping one costs a life
      const n = score >= 14 ? 3 : score >= 10 ? 2 : score >= 6 ? 1 : 0
      const avoid: { x: number; y: number }[] = [pos]
      for (let i = 0; i < n; i++) {
        for (let tries = 0; tries < 12; tries++) {
          const dpos = k.vec2(k.rand(40, k.width() - 40), k.rand(100, k.height() - 40))
          if (avoid.some((a) => Math.hypot(dpos.x - a.x, dpos.y - a.y) < 110)) continue
          const d = k.add([
            k.sprite('tapdot-target'),
            k.scale(0.8),
            k.opacity(1),
            k.rotate(0),
            k.color(235, 70, 105),
            k.pos(dpos),
            k.area(),
            k.anchor('center'),
            k.z(5),
            'decoy',
            TAG,
          ])
          let dt2 = 0
          d.onUpdate(() => {
            dt2 += k.dt()
            d.angle = Math.sin(dt2 * 3) * 15
            const s = Math.min(1, dt2 / 0.12) * 0.8
            d.scale = k.vec2(s, s)
          })
          decoys.push(d)
          avoid.push(dpos)
          break
        }
      }
    }

    const update = k.onUpdate(() => {
      if (over) return
      if (dot) {
        ttl -= k.dt()
        if (ttl <= 0) miss()
      }
    })

    const input = createGameInput(k)
    input.onPress((p) => {
      if (over) return
      if (dot && dist(p, dot.pos) < 56) {
        hit()
        return
      }
      for (const d of decoys) {
        if (dist(p, d.pos) < 44) {
          decoyHit(d)
          return
        }
      }
      miss()
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
