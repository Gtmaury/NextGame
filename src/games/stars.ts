import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { loadGameSprites } from './assets'
import { burst, alarm } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput, dist } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'stars',
  title: 'Estrellas',
  thumbnail: '⭐',
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
    let spawnT = 0.5
    let combo = 0
    let stars: any[] = []
    let meteors: any[] = []
    const bonusSet = new Set<any>()

    for (let i = 0; i < 28; i++) {
      const size = k.rand(1.5, 3.5)
      const base = k.rand(0.15, 0.45)
      const phase = k.rand(0, Math.PI * 2)
      const bgs = k.add([
        k.circle(size),
        k.color(...theme.primary),
        k.opacity(base),
        k.pos(k.rand(10, k.width() - 10), k.rand(80, k.height() - 10)),
        k.anchor('center'),
        k.z(0),
        TAG,
      ])
      let t = phase
      bgs.onUpdate(() => {
        t += k.dt()
        bgs.opacity = Math.max(0.05, base + Math.sin(t * 2) * 0.12)
      })
    }

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({
        time: remaining,
        label: `${hudLv(1 + Math.floor(score / 5))}${combo >= 3 ? ` (x${combo})` : ''}`,
        score: hudPts(score),
      })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    function removeAt(arr: any[], o: any) {
      const i = arr.indexOf(o)
      if (i >= 0) arr.splice(i, 1)
    }

    /** Floating "+Xs / -Xs" clock feedback. */
    function timePopup(x: number, y: number, text: string, color: [number, number, number]) {
      const o = k.add([
        k.text(text, { font: 'Press Start 2P', size: 12 }),
        k.pos(x, y),
        k.color(...color),
        k.opacity(1),
        k.anchor('center'),
        k.z(25),
        'fx-pop',
        TAG,
      ])
      k.tween(y, y - 40, 0.7, (v) => {
        if (o.exists()) o.pos.y = v
      })
      k.tween(1, 0, 0.7, (v) => {
        if (o.exists()) o.opacity = v
      })
      k.wait(0.72, () => {
        if (o.exists()) o.destroy()
      })
    }

    /**
     * Falling object: golden star (catch it) or red meteor (avoid it).
     * Golden stars may ambush from the sides as the game progresses;
     * big bonus stars are worth extra time.
     */
    function spawnFalling(bad: boolean, bonus = false) {
      const speed = Math.min(260, 90 + score * 6) * k.rand(0.85, 1.15) * (bonus ? 0.8 : 1)
      const wind = Math.min(70, score * 2.5)
      const phase = k.rand(0, Math.PI * 2)
      const base = bad ? 0.8 : bonus ? 1.35 : 0.95
      const sideChance = !bad && score >= 6 ? Math.min(0.45, 0.15 + (score - 6) * 0.03) : 0
      const side = k.rand(0, 1) < sideChance
      let vx: number
      let vy: number
      let x: number
      let y: number
      if (side) {
        const dir = k.rand(0, 1) < 0.5 ? 1 : -1
        const a = (k.rand(20, 45) * Math.PI) / 180
        vx = dir * speed * Math.cos(a)
        vy = speed * Math.sin(a)
        x = dir > 0 ? -40 : k.width() + 40
        y = k.rand(90, k.height() - 300)
      } else {
        vx = k.rand(-wind, wind)
        vy = speed
        x = k.rand(40, k.width() - 40)
        y = -40
      }
      const o = k.add([
        k.sprite('stars-star'),
        k.scale(base),
        k.opacity(1),
        k.rotate(0),
        bad ? k.color(235, 70, 105) : k.color(255, 255, 255),
        k.pos(x, y),
        k.area(),
        k.anchor('center'),
        k.z(6),
        bad ? 'meteor' : 'fallstar',
        TAG,
      ])
      let age = 0
      o.onUpdate(() => {
        const dt = k.dt()
        age += dt
        o.pos.y += vy * dt
        o.pos.x += vx * dt + Math.sin(age * 2 + phase) * 12 * dt
        const entering = (o.pos.x < 30 && vx > 0) || (o.pos.x > k.width() - 30 && vx < 0)
        if (!entering && (o.pos.x < 30 || o.pos.x > k.width() - 30)) {
          vx *= -1
          o.pos.x = Math.max(30, Math.min(k.width() - 30, o.pos.x))
        }
        o.angle += (bad ? -240 : 120) * dt
        const s = Math.min(1, age / 0.12) * (base + Math.sin(age * 6) * 0.04 * base)
        o.scale = k.vec2(s, s)
        // golden star about to hit the ground: blinking last chance
        if (!bad && o.pos.y > k.height() - 130) {
          o.opacity = Math.sin(age * 22) > 0 ? 1 : 0.5
        }
      })
      ;(bad ? meteors : stars).push(o)
      if (bonus) {
        bonusSet.add(o)
        const ring = k.add([
          k.circle(34),
          k.outline(3, k.rgb(250, 204, 21)),
          k.opacity(0.9),
          k.scale(1),
          k.pos(x, y),
          k.anchor('center'),
          k.z(5),
          'bonus-ring',
          TAG,
        ])
        let rt = 0
        ring.onUpdate(() => {
          if (!o.exists()) {
            ring.destroy()
            return
          }
          rt += k.dt()
          ring.pos = o.pos
          const rs = 1 + Math.sin(rt * 8) * 0.1
          ring.scale = k.vec2(rs, rs)
        })
      }
    }

    /** Wrong tap on a meteor: alarm + clock penalty. */
    function wrongTap(m: any) {
      if (over) return
      burst(k, TAG, 'stars-star', m.pos.x, m.pos.y, 0.85, 360, [235, 70, 105])
      m.destroy()
      removeAt(meteors, m)
      combo = 0
      remaining = Math.max(0, remaining - 2)
      timePopup(m.pos.x, Math.max(90, m.pos.y - 30), '-2s', [235, 70, 105])
      renderHud()
      alarm(k, TAG, 10)
    }

    const update = k.onUpdate(() => {
      if (over) return
      remaining -= k.dt()
      renderHud()
      if (remaining <= 0) {
        end()
        return
      }

      spawnT -= k.dt()
      if (spawnT <= 0) {
        const badChance = score >= 4 ? Math.min(0.4, 0.15 + score * 0.02) : 0
        const n = 1 + (score >= 12 ? 1 : 0) + (score >= 25 ? 1 : 0)
        for (let i = 0; i < n; i++) {
          const isBad = k.rand(0, 1) < badChance
          spawnFalling(isBad, !isBad && score >= 2 && k.rand(0, 1) < 0.12)
        }
        spawnT = Math.max(0.35, 1.1 - score * 0.025)
      }

      // missed golden star hits the ground: -1s and combo reset
      for (const s of [...stars]) {
        if (s.pos.y > k.height() - 24) {
          s.destroy()
          removeAt(stars, s)
          bonusSet.delete(s)
          combo = 0
          remaining = Math.max(0, remaining - 1)
          timePopup(s.pos.x, k.height() - 60, '-1s', [235, 70, 105])
          renderHud()
        }
      }
      for (const m of [...meteors]) {
        if (m.pos.y > k.height() + 30) {
          m.destroy()
          removeAt(meteors, m)
        }
      }
    })

    const input = createGameInput(k)
    input.onPress((p) => {
      if (over) return
      for (const s of [...stars]) {
        const isBonus = bonusSet.has(s)
        if (dist(p, s.pos) < (isBonus ? 68 : 52)) {
          bonusSet.delete(s)
          burst(k, TAG, 'stars-star', s.pos.x, s.pos.y, isBonus ? 1.2 : 0.95, 720)
          s.destroy()
          removeAt(stars, s)
          score++
          combo++
          const gain =
            Math.max(0.7, 1.3 - score * 0.025) + Math.min(1, combo * 0.1) + (isBonus ? 2 : 0)
          remaining = Math.min(remaining + gain, 15)
          timePopup(
            s.pos.x,
            Math.max(90, s.pos.y - 30),
            `+${gain.toFixed(1)}s`,
            isBonus ? [255, 240, 120] : [250, 204, 21]
          )
          renderHud()
          return
        }
      }
      for (const m of [...meteors]) {
        if (dist(p, m.pos) < 44) {
          wrongTap(m)
          return
        }
      }
    })

    renderHud()
    spawnFalling(false)
    spawnFalling(false)

    return () => {
      input.cancel()
      update.cancel()
      k.destroyAll(TAG)
      resetBackground(k)
    }
  },
}
