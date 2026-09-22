import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { createGameInput } from './input'
import { loadGameSprites } from './assets'
import { applyBackground, makeHud, resetBackground } from './hud'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'balance',
  title: 'Equilibrio',
  thumbnail: '⚖️',
  lifeModel: 'time',
  initialLives: 0,
  async preload(k) {
    await loadGameSprites(k, game.id)
  },
  mount(k, cb) {
    const TAG = game.id
    const theme = getTheme(game.id)
    applyBackground(k, theme.bg)

    const W = k.width()
    const H = k.height()
    const BASE_ZONE_HALF = 48
    let score = 0
    let over = false
    let marker = 0
    let holdScoreT = 0
    let outZoneT = 0
    let animT = 0
    let zonePop = 0
    let gustT = 3

    const barY = H * 0.45
    const barW = Math.min(W - 48, 320)
    const barX = W / 2

    k.add([
      k.circle(90),
      k.pos(barX, barY),
      k.anchor('center'),
      k.color(...theme.secondary),
      k.opacity(0.1),
      k.z(0),
      TAG,
    ])

    k.add([
      k.rect(barW + 16, 28),
      k.color(30, 24, 55),
      k.outline(2, k.rgb(...theme.muted)),
      k.pos(barX, barY),
      k.anchor('center'),
      k.z(1),
      TAG,
    ])

    const zone = k.add([
      k.sprite('balance-zone'),
      k.scale(1.5),
      k.pos(barX, barY),
      k.anchor('center'),
      k.z(2),
      TAG,
    ])

    const needle = k.add([
      k.sprite('balance-needle'),
      k.scale(1.05),
      k.rotate(0),
      k.pos(barX, barY),
      k.anchor('center'),
      k.z(5),
      TAG,
    ])

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({ label: hudLv(1 + Math.floor(score / 5)), score: hudPts(score) })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    function zoneHalf() {
      return Math.max(20, BASE_ZONE_HALF - score * 1.5)
    }

    /** The safe zone slides left/right once chaos ramps up (from score 4). */
    function zoneOffset() {
      const amp = Math.min(60, Math.max(0, score - 4) * 4)
      if (amp <= 0) return 0
      const spd = 0.6 + Math.min(1.2, score * 0.04)
      return Math.sin(animT * spd) * amp
    }

    function inZone() {
      const px = marker * (barW / 2)
      return Math.abs(px - zoneOffset()) <= zoneHalf()
    }

    const input = createGameInput(k)

    const update = k.onUpdate(() => {
      if (over) return

      const pulling = input.isDown()
      const pullForce = 1.1 + score * 0.02
      const releaseForce = -0.85 - score * 0.015
      const force = pulling ? pullForce : releaseForce
      marker += force * k.dt()
      // chaos: random gusts shove the needle (from score 8)
      if (score >= 8) {
        gustT -= k.dt()
        if (gustT <= 0) {
          gustT = k.rand(2, 4)
          marker += k.rand(-1, 1) < 0 ? -(0.12 + score * 0.008) : 0.12 + score * 0.008
        }
      }
      marker = Math.max(-1, Math.min(1, marker))
      needle.pos.x = barX + marker * (barW / 2)
      zone.pos.x = barX + zoneOffset()

      animT += k.dt()
      needle.angle = marker * 28 + (inZone() ? 0 : Math.sin(animT * 35) * 6)
      zonePop = Math.max(0, zonePop - k.dt() * 4)
      const zs = 1.5 + zonePop * 0.25
      zone.scale = k.vec2(zs, zs)

      if (inZone()) {
        outZoneT = 0
        holdScoreT += k.dt()
        if (holdScoreT >= 0.7) {
          holdScoreT = 0
          score++
          zonePop = 1
          renderHud()
        }
      } else {
        holdScoreT = 0
        outZoneT += k.dt()
        if (outZoneT >= 1.2) end()
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
