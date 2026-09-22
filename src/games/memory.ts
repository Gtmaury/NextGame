import type { MiniGameDef } from '../types'
import { hudPts, hudRound } from '../i18n'
import { alarm } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'memory',
  title: 'Memoria',
  thumbnail: '🧠',
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
    const COLORS: [number, number, number][] = [
      [244, 63, 94],
      [56, 189, 248],
      [52, 211, 153],
      [234, 179, 8],
    ]

    let score = 0
    let over = false
    let remaining = TIME
    let sequence: number[] = []
    let input: number[] = []
    let phase: 'show' | 'input' | 'wait' = 'wait'
    let showIdx = 0
    let showT = 0
    let highlight = -1

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({
        time: remaining,
        label: hudRound(score + 1),
        score: hudPts(score),
      })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    const size = Math.min(88, (W - 72) / 2)
    const gap = 16
    const gridW = size * 2 + gap
    const ox = (W - gridW) / 2 + size / 2
    const oy = H * 0.42

    const pads: any[] = []
    for (let i = 0; i < 4; i++) {
      const col = i % 2
      const row = Math.floor(i / 2)
      const pad = k.add([
        k.rect(size, size, { radius: 12 }),
        k.pos(ox + col * (size + gap), oy + row * (size + gap)),
        k.anchor('center'),
        k.color(...COLORS[i]),
        k.opacity(0.55),
        k.scale(1),
        k.outline(3, k.rgb(...theme.primary)),
        k.area(),
        k.z(5),
        'pad',
        TAG,
        { idx: i },
      ])
      pads.push(pad)
    }

    function flashPad(i: number, on: boolean) {
      const p = pads[i]
      if (!p?.exists()) return
      p.opacity = on ? 1 : 0.55
      if ('scale' in p) p.scale = on ? k.vec2(1.06, 1.06) : k.vec2(1, 1)
    }

    function startRound() {
      if (over) return
      phase = 'wait'
      input = []
      sequence.push(Math.floor(k.rand(0, 4)))
      showIdx = 0
      showT = 0.45
      phase = 'show'
      highlight = -1
      pads.forEach((_, i) => flashPad(i, false))
    }

    k.wait(0.6, () => {
      if (!over) startRound()
    })

    function tapPad(i: number) {
      if (over || phase !== 'input') return
      flashPad(i, true)
      k.wait(0.15, () => flashPad(i, false))
      input.push(i)
      const step = input.length - 1
      if (input[step] !== sequence[step]) {
        alarm(k, TAG, 10)
        end()
        return
      }
      if (input.length === sequence.length) {
        score++
        renderHud()
        phase = 'wait'
        k.wait(0.5, () => startRound())
      }
    }

    const gameInput = createGameInput(k)
    gameInput.onPress((p) => {
      if (over || phase !== 'input') return
      const half = size / 2
      for (const pad of pads) {
        if (Math.abs(p.x - pad.pos.x) <= half && Math.abs(p.y - pad.pos.y) <= half) {
          tapPad(pad.idx as number)
          return
        }
      }
    })
    gameInput.onKey((key) => {
      const map: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, q: 0, w: 1, a: 2, s: 3 }
      if (key in map) tapPad(map[key])
    })

    const update = k.onUpdate(() => {
      if (over) return
      remaining -= k.dt()
      renderHud()
      if (remaining <= 0) {
        end()
        return
      }

      if (phase === 'show') {
        showT -= k.dt()
        if (showT <= 0) {
          if (highlight >= 0) flashPad(highlight, false)
          if (showIdx >= sequence.length) {
            phase = 'input'
            highlight = -1
            return
          }
          highlight = sequence[showIdx]
          flashPad(highlight, true)
          showIdx++
          showT = Math.max(0.28, 0.55 - score * 0.02)
        }
      }
    })

    renderHud()

    return () => {
      gameInput.cancel()
      update.cancel()
      k.destroyAll(TAG)
      resetBackground(k)
    }
  },
}
