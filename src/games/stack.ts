import type { MiniGameDef } from '../types'
import { hudLv, hudPts } from '../i18n'
import { alarm } from './fx'
import { applyBackground, makeHud, resetBackground } from './hud'
import { createGameInput } from './input'
import { getTheme } from './themes'

export const game: MiniGameDef = {
  id: 'stack',
  title: 'Torre',
  thumbnail: '🧱',
  lifeModel: 'retry',
  initialLives: 3,
  async preload() {},
  mount(k, cb) {
    const TAG = game.id
    const theme = getTheme(game.id)
    applyBackground(k, theme.bg)

    const W = k.width()
    const H = k.height()
    const BASE_W = Math.min(200, W * 0.55)
    const BLOCK_H = 28
    let stackTop = H - 80
    const minTop = 110

    let lives = game.initialLives
    let score = 0
    let over = false
    let movingDir = 1
    let currentW = BASE_W
    let placed: { x: number; w: number }[] = [{ x: W / 2, w: BASE_W }]

    const hud = makeHud(k, TAG, theme)

    function renderHud() {
      hud.set({ lives, label: hudLv(1 + Math.floor(score / 4)), score: hudPts(score) })
    }

    function end() {
      if (over) return
      over = true
      cb.onLose(score)
    }

    k.add([
      k.rect(BASE_W, BLOCK_H, { radius: 4 }),
      k.pos(W / 2, stackTop),
      k.anchor('center'),
      k.color(...theme.muted),
      k.outline(2, k.rgb(...theme.secondary)),
      k.z(2),
      'block',
      TAG,
    ])

    let mover = spawnMover()

    function spawnMover() {
      return k.add([
        k.rect(currentW, BLOCK_H, { radius: 4 }),
        k.pos(W / 2, stackTop - BLOCK_H),
        k.anchor('center'),
        k.color(...theme.secondary),
        k.outline(2, k.rgb(...theme.primary)),
        k.z(5),
        'mover',
        TAG,
      ])
    }

    function speed() {
      return Math.min(280 + score * 22, 520)
    }

    function shiftDown() {
      if (stackTop > minTop) return
      const dy = BLOCK_H
      for (const b of k.get('block') as any[]) {
        b.pos.y += dy
      }
      stackTop += dy
    }

    function place() {
      if (over || !mover.exists()) return
      const prev = placed[placed.length - 1]
      const cx = mover.pos.x
      const half = currentW / 2
      const left = cx - half
      const right = cx + half
      const pLeft = prev.x - prev.w / 2
      const pRight = prev.x + prev.w / 2
      const overlapL = Math.max(left, pLeft)
      const overlapR = Math.min(right, pRight)
      const overlap = overlapR - overlapL

      if (overlap < 12) {
        lives--
        renderHud()
        alarm(k, TAG, 12)
        k.shake(10)
        mover.destroy()
        if (lives <= 0) {
          end()
          return
        }
        mover = spawnMover()
        movingDir = 1
        return
      }

      const newW = Math.max(28, overlap)
      const newX = (overlapL + overlapR) / 2
      const newY = stackTop - BLOCK_H

      k.add([
        k.rect(newW, BLOCK_H, { radius: 4 }),
        k.pos(newX, newY),
        k.anchor('center'),
        k.color(...theme.secondary),
        k.outline(2, k.rgb(...theme.primary)),
        k.z(3),
        'block',
        TAG,
      ])

      placed.push({ x: newX, w: newW })
      currentW = newW
      stackTop = newY
      score++
      renderHud()
      mover.destroy()
      shiftDown()
      mover = spawnMover()
      movingDir = score % 2 === 0 ? 1 : -1
    }

    const input = createGameInput(k)
    input.onPress(() => place())

    const update = k.onUpdate(() => {
      if (over || !mover.exists()) return
      const half = currentW / 2
      mover.pos.x += movingDir * speed() * k.dt()
      if (mover.pos.x > W - half - 8) {
        mover.pos.x = W - half - 8
        movingDir = -1
      } else if (mover.pos.x < half + 8) {
        mover.pos.x = half + 8
        movingDir = 1
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
