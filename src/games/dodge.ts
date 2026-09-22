import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { loadGameSprites } from './assets'
import { burst } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'dodge',
  title: 'Esquiva',
  thumbnail: '🛡️',
  lifeModel: 'retry',
  initialLives: 3,
  async preload(k) {
    await loadGameSprites(k, game.id)
  },
  mount(k, cb) {
    const TAG = game.id
    const theme = getTheme(game.id)
    applyBackground(k, theme.bg)

    const W = k.width()
    const H = k.height()
    let lives = game.initialLives
    let score = 0
    let over = false
    let spawnT = 0.8
    let invuln = 0
    let animT = 0

    k.add([
      k.rect(W, 100),
      k.pos(0, H - 100),
      k.color(...theme.danger),
      k.opacity(0.12),
      k.z(0),
      TAG,
    ])

    const player = k.add([
      k.sprite('dodge-player'),
      k.scale(0.95),
      k.opacity(1),
      k.rotate(0),
      k.pos(W / 2, H - 90),
      k.area(),
      k.anchor('center'),
      k.z(10),
      'player',
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

    function hit() {
      if (over || invuln > 0) return
      lives--
      invuln = 0.8
      renderHud()
      k.shake(12)
      player.scale = k.vec2(1.2, 0.72)
      k.tween(k.vec2(1.2, 0.72), k.vec2(0.95, 0.95), 0.2, (v) => {
        player.scale = v
      })
      if (lives <= 0) end()
    }

    function fallSpeed() {
      return Math.min(220 + score * 18, 620)
    }

    function spawn() {
      const homing = score >= 8 && k.rand(0, 1) < Math.min(0.35, 0.1 + score * 0.01)
      const vx = homing
        ? Math.sign(player.pos.x - k.rand(50, W - 50)) * Math.min(90, 30 + score)
        : 0
      const o = k.add([
        k.sprite('dodge-block'),
        k.scale(0.9),
        k.rotate(0),
        k.pos(k.rand(50, W - 50), -30),
        k.area(),
        k.anchor('center'),
        'obstacle',
        TAG,
      ])
      const sf = k.rand(0.8, 1.2)
      const driftAmp = Math.min(60, score * 2)
      const phase = k.rand(0, Math.PI * 2)
      let age = 0
      o.onUpdate(() => {
        const dt = k.dt()
        age += dt
        o.pos.y += fallSpeed() * sf * dt
        o.pos.x += (Math.sin(age * 3 + phase) * driftAmp + vx) * dt
        o.pos.x = Math.max(24, Math.min(W - 24, o.pos.x))
        const s = 0.9 * Math.min(1, age / 0.15)
        o.scale = k.vec2(s, s)
        o.angle = Math.sin(age * 3 + phase) * 10
      })
    }

    function spawnWave() {
      spawn()
      if (score >= 15) spawn()
    }

    const input = createGameInput(k)

    const update = k.onUpdate(() => {
      if (over) return
      const half = 22
      const dt = k.dt()
      let targetX = player.pos.x
      if (input.isKeyDown('arrowleft') || input.isKeyDown('a')) {
        targetX -= 520 * dt
      } else if (input.isKeyDown('arrowright') || input.isKeyDown('d')) {
        targetX += 520 * dt
      } else {
        targetX = input.pos().x
      }
      targetX = Math.max(half, Math.min(W - half, targetX))
      const dx = targetX - player.pos.x
      player.pos.x = targetX
      player.angle = Math.max(-14, Math.min(14, dx * 0.9))
      animT += k.dt()
      if (invuln > 0) {
        invuln -= k.dt()
        player.opacity = Math.sin(invuln * 30) > 0 ? 1 : 0.35
      } else {
        player.opacity = 1
        player.scale.y = 0.95 + Math.sin(animT * 8) * 0.03
      }

      spawnT -= k.dt()
      if (spawnT <= 0) {
        spawnWave()
        spawnT = Math.max(0.25, 0.85 - score * 0.03)
      }

      for (const o of k.get('obstacle') as any[]) {
        if (o.isColliding(player)) {
          burst(k, TAG, 'dodge-block', o.pos.x, o.pos.y, 0.9)
          o.destroy()
          hit()
        } else if (o.pos.y > H + 30) {
          o.destroy()
          score++
          renderHud()
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
