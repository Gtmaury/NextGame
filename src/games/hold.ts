import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { alarm } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'hold',
  title: 'Carga',
  thumbnail: '🎯',
  lifeModel: 'time',
  initialLives: 0,
  async preload() {},
  mount(k, cb) {
    const TAG = game.id
    const theme = getTheme(game.id)
    applyBackground(k, theme.bg)

    const W = k.width()
    const H = k.height()
    const TIME = 25
    const BAR_W = 28
    const BAR_H = 220
    const barX = 48
    const barY = H * 0.55

    let score = 0
    let over = false
    let remaining = TIME
    let charging = false
    let power = 0
    let projectile: any = null
    let cooldown = 0

    const cannon = k.add([
      k.circle(18),
      k.pos(W * 0.22, H * 0.78),
      k.anchor('center'),
      k.color(...theme.secondary),
      k.outline(3, k.rgb(...theme.primary)),
      k.z(8),
      TAG,
    ])

    k.add([
      k.rect(BAR_W + 10, BAR_H + 10, { radius: 6 }),
      k.pos(barX, barY),
      k.anchor('center'),
      k.color(20, 18, 16),
      k.outline(2, k.rgb(...theme.muted)),
      k.z(4),
      TAG,
    ])

    const fill = k.add([
      k.rect(BAR_W, BAR_H, { radius: 3 }),
      k.pos(barX, barY + BAR_H / 2),
      k.anchor('bot'),
      k.color(...theme.secondary),
      k.scale(1, 0.02),
      k.z(6),
      TAG,
    ])

    const targetR = () => Math.max(22, 38 - score * 0.8)
    let target = spawnTarget()

    function spawnTarget() {
      const r = targetR()
      const t = k.add([
        k.circle(r),
        k.pos(W * 0.72, H * 0.45),
        k.anchor('center'),
        k.color(...theme.primary),
        k.opacity(0.85),
        k.outline(3, k.rgb(...theme.secondary)),
        k.area(),
        k.z(5),
        'target',
        TAG,
        { r, dir: k.rand(0, 1) < 0.5 ? 1 : -1, speed: 40 + score * 4 },
      ])
      t.onUpdate(() => {
        if (over) return
        t.pos.y += t.dir * t.speed * k.dt()
        const lo = 130
        const hi = H - 80
        if (t.pos.y < lo) {
          t.pos.y = lo
          t.dir = 1
        } else if (t.pos.y > hi) {
          t.pos.y = hi
          t.dir = -1
        }
      })
      return t
    }

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({
        time: remaining,
        label: hudLv(1 + Math.floor(score / 4)),
        score: hudPts(score),
      })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    function setPowerVisual() {
      fill.scale = k.vec2(1, Math.max(0.02, power))
    }

    function fire() {
      if (over || projectile || cooldown > 0) return
      const pwr = Math.max(0.15, Math.min(1, power))
      power = 0
      setPowerVisual()
      const speed = 280 + pwr * 420
      const aimY = cannon.pos.y - 40 - pwr * (H * 0.55)
      const dx = target.pos.x - cannon.pos.x
      const dy = aimY - cannon.pos.y
      const len = Math.hypot(dx, dy) || 1
      const vx = (dx / len) * speed
      const vy = (dy / len) * speed

      projectile = k.add([
        k.circle(10),
        k.pos(cannon.pos.x, cannon.pos.y),
        k.anchor('center'),
        k.color(...theme.secondary),
        k.outline(2, k.rgb(...theme.primary)),
        k.area(),
        k.z(12),
        TAG,
        { vx, vy },
      ])
    }

    const input = createGameInput(k)
    input.onPress(() => {
      if (over || projectile || cooldown > 0) return
      charging = true
      power = 0
    })
    input.onRelease(() => {
      if (!charging || over) {
        charging = false
        return
      }
      charging = false
      fire()
    })

    const update = k.onUpdate(() => {
      if (over) return
      const dt = k.dt()
      remaining -= dt
      if (remaining <= 0) {
        remaining = 0
        renderHud()
        end()
        return
      }

      if (cooldown > 0) cooldown -= dt

      if (charging) {
        power = Math.min(1, power + dt * 0.85)
        setPowerVisual()
      }

      if (projectile && projectile.exists()) {
        projectile.pos.x += projectile.vx * dt
        projectile.pos.y += projectile.vy * dt
        const hit =
          Math.hypot(projectile.pos.x - target.pos.x, projectile.pos.y - target.pos.y) <=
          target.r + 12
        const off =
          projectile.pos.x < -40 ||
          projectile.pos.x > W + 40 ||
          projectile.pos.y < -40 ||
          projectile.pos.y > H + 40

        if (hit) {
          score++
          remaining = Math.min(TIME, remaining + 1.4)
          renderHud()
          projectile.destroy()
          projectile = null
          target.destroy()
          target = spawnTarget()
          cooldown = 0.25
          k.shake(4)
        } else if (off) {
          projectile.destroy()
          projectile = null
          alarm(k, TAG, 10)
          end()
        }
      }

      renderHud()
    })

    setPowerVisual()
    renderHud()

    return () => {
      input.cancel()
      update.cancel()
      k.destroyAll(TAG)
      resetBackground(k)
    }
  },
}
