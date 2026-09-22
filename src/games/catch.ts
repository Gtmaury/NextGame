import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { loadGameSprites } from './assets'
import { burst, alarm } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'catch',
  title: 'Atrapa la fruta',
  thumbnail: '🍓',
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
    let level = 1
    let goal = 8
    let score = 0
    let lives = game.initialLives
    let over = false
    let spawnT = 1

    k.add([
      k.rect(W, 90),
      k.pos(0, 0),
      k.color(40, 20, 50),
      k.opacity(0.45),
      k.z(0),
      TAG,
    ])

    const paddle = k.add([
      k.sprite('catch-paddle'),
      k.scale(1.15),
      k.pos(W / 2, H - 70),
      k.area(),
      k.anchor('center'),
      k.z(10),
      'paddle',
      TAG,
    ])

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({ lives, label: hudLv(level), score: hudPts(score) })
    }

    function gameOver() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    function miss() {
      if (over) return
      lives--
      renderHud()
      if (lives <= 0) gameOver()
    }

    function nextLevel() {
      level++
      goal = Math.round(goal * 1.5)
    }

    function bombPenalty(f: any) {
      if (over) return
      lives--
      renderHud()
      burst(k, TAG, 'catch-fruit', f.pos.x, f.pos.y, 0.85, 360, [235, 70, 105])
      f.destroy()
      alarm(k, TAG, 12)
      if (lives <= 0) gameOver()
    }

    function spawn(bad: boolean) {
      const f = k.add([
        k.sprite('catch-fruit'),
        k.scale(0.85),
        k.rotate(0),
        bad ? k.color(235, 70, 105) : k.color(255, 255, 255),
        k.pos(k.rand(40, W - 40), -40),
        k.area(),
        k.anchor('center'),
        bad ? 'bad-fruit' : 'fruit',
        TAG,
      ])
      const wind = Math.min(140, (level - 1) * 25)
      const phase = k.rand(0, Math.PI * 2)
      let age = 0
      f.onUpdate(() => {
        age += k.dt()
        const s = 0.85 * Math.min(1, age / 0.15)
        f.scale = k.vec2(s, s)
        f.angle = Math.sin(age * (bad ? 8 : 5) + phase) * (bad ? 25 : 12)
        f.pos.x += Math.sin(age * 2.2 + phase) * wind * k.dt()
        f.pos.x = Math.max(24, Math.min(W - 24, f.pos.x))
      })
      let caught = false
      f.onCollide('paddle', () => {
        if (over || caught) return
        caught = true
        if (bad) {
          bombPenalty(f)
          return
        }
        score++
        if (score >= goal) nextLevel()
        renderHud()
        burst(k, TAG, 'catch-fruit', f.pos.x, f.pos.y, 0.85)
        f.destroy()
        paddle.scale = k.vec2(1.32, 1.0)
        k.tween(k.vec2(1.32, 1.0), k.vec2(1.15, 1.15), 0.15, (v) => {
          paddle.scale = v
        })
      })
    }

    function spawnWave() {
      const n = 1 + Math.min(2, Math.floor((level - 1) / 4))
      const badChance = level >= 3 ? Math.min(0.45, 0.15 + level * 0.04) : 0
      for (let i = 0; i < n; i++) spawn(k.rand(0, 1) < badChance)
    }

    const input = createGameInput(k)

    const update = k.onUpdate(() => {
      if (over) return
      const half = W * 0.15
      const dt = k.dt()
      if (input.isKeyDown('arrowleft') || input.isKeyDown('a')) {
        paddle.pos.x -= 520 * dt
      } else if (input.isKeyDown('arrowright') || input.isKeyDown('d')) {
        paddle.pos.x += 520 * dt
      } else {
        paddle.pos.x = input.pos().x
      }
      paddle.pos.x = Math.max(half, Math.min(W - half, paddle.pos.x))

      spawnT -= k.dt()
      if (spawnT <= 0) {
        spawnWave()
        spawnT = Math.max(0.25, 0.9 - (level - 1) * 0.1)
      }

      const speed = Math.min(150 + (level - 1) * 45, 640)
      for (const f of k.get('fruit') as any[]) {
        f.pos.y += speed * k.dt()
        if (f.pos.y > H + 24) {
          f.destroy()
          miss()
        }
      }
      for (const f of k.get('bad-fruit') as any[]) {
        f.pos.y += speed * k.dt()
        if (f.pos.y > H + 24) f.destroy()
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
