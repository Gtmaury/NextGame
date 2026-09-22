import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { alarm } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'swipe',
  title: 'Carriles',
  thumbnail: '🛣️',
  lifeModel: 'retry',
  initialLives: 3,
  async preload() {},
  mount(k, cb) {
    const TAG = game.id
    const theme = getTheme(game.id)
    applyBackground(k, theme.bg)

    const W = k.width()
    const H = k.height()
    const LANES = 3
    const laneXs = [W * 0.22, W * 0.5, W * 0.78]
    const playerY = H - 100

    let lives = game.initialLives
    let score = 0
    let over = false
    let lane = 1
    let spawnT = 0.9
    let invuln = 0
    let dragFrom: { x: number; y: number } | null = null

    for (let i = 0; i < LANES; i++) {
      k.add([
        k.rect(W / LANES - 12, H - 90),
        k.pos(laneXs[i], H / 2 + 20),
        k.anchor('center'),
        k.color(...theme.muted),
        k.opacity(0.08),
        k.z(0),
        TAG,
      ])
    }

    const player = k.add([
      k.rect(42, 52, { radius: 8 }),
      k.pos(laneXs[lane], playerY),
      k.anchor('center'),
      k.color(...theme.secondary),
      k.outline(3, k.rgb(...theme.primary)),
      k.opacity(1),
      k.area(),
      k.z(10),
      'player',
      TAG,
    ])

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({ lives, label: hudLv(1 + Math.floor(score / 6)), score: hudPts(score) })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    function hit() {
      if (over || invuln > 0) return
      lives--
      invuln = 0.85
      renderHud()
      alarm(k, TAG, 12)
      k.shake(10)
      if (lives <= 0) end()
    }

    function setLane(n: number) {
      lane = Math.max(0, Math.min(LANES - 1, n))
      k.tween(player.pos.x, laneXs[lane], 0.12, (v) => {
        player.pos.x = v
      })
    }

    function spawnObstacle() {
      const laneIdx = Math.floor(k.rand(0, LANES))
      const wide = score >= 8 && k.rand(0, 1) < 0.25
      const lanes = wide
        ? [laneIdx, Math.min(LANES - 1, laneIdx + 1)].filter((v, i, a) => a.indexOf(v) === i)
        : [laneIdx]
      const speed = Math.min(220 + score * 14, 520)

      for (const li of lanes) {
        const o = k.add([
          k.rect(48, 40, { radius: 6 }),
          k.pos(laneXs[li], -40),
          k.anchor('center'),
          k.color(...theme.danger),
          k.outline(2, k.rgb(...theme.primary)),
          k.area(),
          k.z(5),
          'obstacle',
          TAG,
          { lane: li, scored: false, speed },
        ])
        o.onUpdate(() => {
          if (over) return
          o.pos.y += o.speed * k.dt()
          if (!o.scored && o.pos.y > playerY + 30) {
            o.scored = true
            score++
            renderHud()
          }
          if (o.pos.y > H + 50) o.destroy()
        })
      }
    }

    const input = createGameInput(k)
    input.onPress((p) => {
      if (over) return
      dragFrom = { x: p.x, y: p.y }
    })
    input.onRelease((p) => {
      if (!dragFrom || over) {
        dragFrom = null
        return
      }
      const dx = p.x - dragFrom.x
      const dy = p.y - dragFrom.y
      dragFrom = null
      if (Math.abs(dx) < 28 || Math.abs(dx) < Math.abs(dy) * 0.6) return
      if (dx > 0) setLane(lane + 1)
      else setLane(lane - 1)
    })
    input.onKey((key) => {
      if (over) return
      if (key === 'arrowleft' || key === 'a') setLane(lane - 1)
      if (key === 'arrowright' || key === 'd') setLane(lane + 1)
    })

    const update = k.onUpdate(() => {
      if (over) return
      const dt = k.dt()
      if (invuln > 0) {
        invuln -= dt
        player.opacity = Math.sin(invuln * 28) > 0 ? 1 : 0.35
      } else {
        player.opacity = 1
      }

      spawnT -= dt
      if (spawnT <= 0) {
        spawnObstacle()
        spawnT = Math.max(0.35, 0.95 - score * 0.025)
      }

      for (const o of k.get('obstacle') as any[]) {
        if (o.lane === lane && o.isColliding(player)) {
          o.destroy()
          hit()
        }
      }
    })

    renderHud()

    return () => {
      input.cancel()
      update.cancel()
      k.destroyAll(TAG)
      resetBackground(k)
    }
  },
}
