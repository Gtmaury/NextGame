import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { loadGameSprites } from './assets'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'jump',
  title: 'Salto',
  thumbnail: '🐤',
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
    const GROUND_Y = H - 80
    const PLAYER_SCALE = 0.95
    let lives = game.initialLives
    let score = 0
    let over = false
    let vy = 0
    let onGround = true
    let scroll = 0
    let nextGapAt = W * 0.7
    let animT = 0
    let landT = 0
    let airT = 0
    let holding = false
    const FUEL_MAX = 1.3
    let fuel = FUEL_MAX

    k.add([
      k.rect(W, H * 0.35),
      k.pos(0, 0),
      k.color(244, 114, 182),
      k.opacity(0.12),
      k.z(0),
      TAG,
    ])
    k.add([
      k.circle(48),
      k.pos(W - 70, 110),
      k.anchor('center'),
      k.color(...theme.secondary),
      k.opacity(0.35),
      k.z(0),
      TAG,
    ])

    // Ground floor: a single seamless tiled strip scrolling with the world
    const probe = k.add([k.sprite('jump-ground'), k.pos(-300, -300), k.opacity(0), TAG])
    const TILE_W = probe.width || 64
    probe.destroy()
    const ground = k.add([
      k.sprite('jump-ground', { tiled: true, width: W + TILE_W }),
      k.pos(0, GROUND_Y + 4),
      k.anchor('topleft'),
      k.z(2),
      'ground-strip',
      TAG,
    ])

    const player = k.add([
      k.sprite('jump-player'),
      k.scale(PLAYER_SCALE),
      k.opacity(1),
      k.pos(W * 0.28, GROUND_Y - 28),
      k.area(),
      k.anchor('center'),
      k.z(10),
      'jumper',
      TAG,
    ])

    const gaps: { x: number; w: number; counted: boolean; fell: boolean }[] = []

    function addGap() {
      const w = k.rand(70, Math.min(110 + score * 3, 240))
      gaps.push({ x: nextGapAt, w, counted: false, fell: false })
      const minGap = Math.max(150, 220 - score * 4)
      const maxGap = Math.max(240, 320 - score * 5)
      nextGapAt += k.rand(minGap, maxGap)
    }

    addGap()
    addGap()

    const gapVisuals = new Map<{ x: number; w: number; counted: boolean; fell: boolean }, any>()
    function syncGaps() {
      for (const [gap, pit] of gapVisuals) {
        if (!gaps.includes(gap)) {
          pit.destroy()
          gapVisuals.delete(gap)
        }
      }
      for (const g of gaps) {
        const vx = g.x - scroll
        if (vx + g.w < -40 || vx > W + 40) {
          const pit = gapVisuals.get(g)
          if (pit) {
            pit.destroy()
            gapVisuals.delete(g)
          }
          continue
        }
        let pit = gapVisuals.get(g)
        if (!pit) {
          pit = k.add([
            k.rect(g.w, 52),
            k.color(5, 2, 12),
            k.pos(vx, GROUND_Y - 2),
            k.anchor('topleft'),
            k.z(3),
            TAG,
          ])
          gapVisuals.set(g, pit)
        }
        pit.pos.x = vx
      }
    }

    const hud = makeHud(k, TAG, theme)

    // Thrust fuel meter (refills while on the ground)
    k.add([
      k.rect(104, 12),
      k.pos(W / 2 - 52, 88),
      k.color(10, 10, 22),
      k.opacity(0.7),
      k.outline(2, k.rgb(...theme.secondary)),
      k.z(40),
      TAG,
    ])
    const fuelFill = k.add([
      k.rect(100, 8),
      k.pos(W / 2 - 50, 92),
      k.color(...theme.secondary),
      k.z(41),
      TAG,
    ])

    function renderHud() {
      hud.set({ lives, label: hudLv(1 + Math.floor(score / 8)), score: hudPts(score) })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    function fall() {
      if (over) return
      lives--
      renderHud()
      if (lives <= 0) {
        end()
        return
      }
      vy = 0
      onGround = true
      player.pos.y = GROUND_Y - 28
      player.opacity = 0
      k.tween(0, 1, 0.3, (v) => {
        player.opacity = v
      })
      const px = player.pos.x + scroll
      for (const g of gaps) {
        if (g.x < px + 180) g.counted = true
        if (px > g.x && px < g.x + g.w) g.fell = true
      }
      fuel = FUEL_MAX
      airT = 0
    }

    const update = k.onUpdate(() => {
      if (over) return
      const speed = Math.min(180 + score * 10, 460)
      scroll += speed * k.dt()
      ground.pos.x -= speed * k.dt()
      if (ground.pos.x <= -TILE_W) ground.pos.x += TILE_W

      const px = player.pos.x + scroll

      if (!onGround) {
        airT += k.dt()
        const thrusting = holding && airT > 0.05 && fuel > 0
        if (thrusting) {
          fuel = Math.max(0, fuel - k.dt())
          vy -= 1900 * k.dt()
          vy = Math.max(vy, -560)
        } else {
          vy += 1400 * k.dt()
        }
        vy = Math.min(vy, 900)
        player.pos.y += vy * k.dt()
        // flight ceiling: no escaping over the top
        if (player.pos.y < 92) {
          player.pos.y = 92
          if (vy < 0) vy = 0
        }
        const overGap = gaps.some((g) => px > g.x && px < g.x + g.w)
        if (player.pos.y >= GROUND_Y - 28 && !overGap) {
          player.pos.y = GROUND_Y - 28
          vy = 0
          onGround = true
          landT = 0.18
        }
      } else {
        airT = 0
        fuel = Math.min(FUEL_MAX, fuel + 2.2 * k.dt())
        for (const g of gaps) {
          if (g.fell) continue
          if (px > g.x && px < g.x + g.w) {
            onGround = false
            vy = 80
            break
          }
        }
      }

      // Character animation: landing squash, run bob, jump stretch
      animT += k.dt()
      if (landT > 0) {
        landT -= k.dt()
        const p = 1 - Math.max(0, landT) / 0.18
        player.scale.x = PLAYER_SCALE * (1 + 0.25 * (1 - p))
        player.scale.y = PLAYER_SCALE * (1 - 0.3 * (1 - p))
      } else if (onGround) {
        player.scale.x = PLAYER_SCALE
        player.scale.y = PLAYER_SCALE + Math.sin(animT * 10) * 0.035
      } else if (vy < 0) {
        player.scale.x = PLAYER_SCALE * 0.86
        player.scale.y = PLAYER_SCALE * 1.14
      } else {
        player.scale.x = PLAYER_SCALE * 0.93
        player.scale.y = PLAYER_SCALE * 1.07
      }

      fuelFill.width = Math.max(0, (fuel / FUEL_MAX) * 100)

      if (player.pos.y > GROUND_Y + 40) {
        fall()
      }

      for (const g of gaps) {
        if (!g.counted && g.x + g.w < px - 10) {
          g.counted = true
          score++
          renderHud()
        }
      }

      while (nextGapAt < scroll + W * 1.5) addGap()
      while (gaps.length && gaps[0].x + gaps[0].w < scroll - 100) gaps.shift()

      syncGaps()
    })

    const input = createGameInput(k)
    input.onPress(() => {
      if (over) return
      if (onGround) {
        onGround = false
        vy = -520
        landT = 0
      }
      holding = true
    })
    input.onRelease(() => {
      holding = false
    })

    renderHud()
    syncGaps()

    return () => {
      input.cancel()
      update.cancel()
      k.destroyAll(TAG)
      resetBackground(k)
    }
  },
}
