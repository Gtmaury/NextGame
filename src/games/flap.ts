import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { alarm } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'flap',
  title: 'Aleteo',
  thumbnail: '🐦',
  lifeModel: 'retry',
  initialLives: 3,
  async preload() {},
  mount(k, cb) {
    const TAG = game.id
    const theme = getTheme(game.id)
    applyBackground(k, theme.bg)

    const W = k.width()
    const H = k.height()
    const GRAVITY = 980
    const FLAP = -340
    const PIPE_W = 64
    const birdX = W * 0.28

    let lives = game.initialLives
    let score = 0
    let over = false
    let vy = 0
    let spawnT = 1.2
    let invuln = 0
    let gapBase = 160

    const bird = k.add([
      k.circle(16),
      k.pos(birdX, H * 0.45),
      k.anchor('center'),
      k.color(...theme.secondary),
      k.outline(3, k.rgb(...theme.primary)),
      k.opacity(1),
      k.area(),
      k.z(10),
      'bird',
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
      invuln = 0.9
      renderHud()
      alarm(k, TAG, 12)
      k.shake(10)
      if (lives <= 0) end()
    }

    function spawnPipe() {
      const gap = Math.max(100, gapBase - score * 3)
      const margin = 100
      const gapY = k.rand(margin + gap / 2, H - margin - gap / 2)
      const speed = Math.min(160 + score * 10, 340)

      const topH = gapY - gap / 2
      const botY = gapY + gap / 2
      const botH = H - botY

      const top = k.add([
        k.rect(PIPE_W, topH, { radius: 4 }),
        k.pos(W + PIPE_W, 0),
        k.anchor('top'),
        k.color(...theme.muted),
        k.outline(2, k.rgb(...theme.secondary)),
        k.area(),
        k.z(5),
        'pipe',
        TAG,
        { scored: false, speed },
      ])

      const bot = k.add([
        k.rect(PIPE_W, botH, { radius: 4 }),
        k.pos(W + PIPE_W, botY),
        k.anchor('top'),
        k.color(...theme.muted),
        k.outline(2, k.rgb(...theme.secondary)),
        k.area(),
        k.z(5),
        'pipe',
        TAG,
        { scored: true, speed },
      ])

      const pair = [top, bot]
      for (const p of pair) {
        p.onUpdate(() => {
          if (over) return
          p.pos.x -= p.speed * k.dt()
          if (p.pos.x < -PIPE_W - 20) p.destroy()
        })
      }

      top.onUpdate(() => {
        if (over || top.scored) return
        if (top.pos.x + PIPE_W / 2 < birdX) {
          top.scored = true
          score++
          renderHud()
        }
      })
    }

    const input = createGameInput(k)
    input.onPress(() => {
      if (over) return
      vy = FLAP
    })

    const update = k.onUpdate(() => {
      if (over) return
      const dt = k.dt()
      vy += GRAVITY * dt
      bird.pos.y += vy * dt

      if (bird.pos.y < 20 || bird.pos.y > H - 20) {
        bird.pos.y = Math.max(20, Math.min(H - 20, bird.pos.y))
        vy = 0
        hit()
      }

      if (invuln > 0) {
        invuln -= dt
        bird.opacity = Math.sin(invuln * 28) > 0 ? 1 : 0.35
      } else {
        bird.opacity = 1
      }

      spawnT -= dt
      if (spawnT <= 0) {
        spawnPipe()
        spawnT = Math.max(0.9, 1.6 - score * 0.04)
      }

      for (const p of k.get('pipe') as any[]) {
        if (p.isColliding(bird)) {
          hit()
          break
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
