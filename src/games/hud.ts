import { gameHint } from '../i18n'
import type { KaplayCtx } from '../types'
import { DEFAULT_BG, type GameTheme, type Rgb } from './themes'

export interface HudState {
  lives?: number
  time?: number
  score?: string
  label?: string
}

export interface GameHud {
  set: (state: HudState) => void
}

export function applyBackground(k: KaplayCtx, color: Rgb) {
  k.setBackground(color[0], color[1], color[2])
}

export function resetBackground(k: KaplayCtx) {
  applyBackground(k, DEFAULT_BG)
}

/** Brand-aligned in-game HUD — top bar so thumb zone stays clear on mobile. */
export function makeHud(k: KaplayCtx, tag: string, theme: GameTheme): GameHud {
  const hint = gameHint(tag)
  const barH = hint ? 92 : 56
  const margin = 12
  const width = Math.max(160, k.width() - margin * 2)
  const textW = width - 36

  // Panel matching shell glass / elevated surfaces
  k.add([
    k.rect(width, barH, { radius: 10 }),
    k.pos(margin, margin),
    k.color(26, 24, 22),
    k.opacity(0.88),
    k.outline(2, k.rgb(...theme.secondary)),
    k.z(40),
    tag,
  ])

  // Accent rail (shell amber / per-game secondary)
  k.add([
    k.rect(5, barH - 18, { radius: 2 }),
    k.pos(margin + 10, margin + 9),
    k.color(...theme.secondary),
    k.z(41),
    tag,
  ])

  const line = k.add([
    k.text('', { size: 16, width: textW }),
    k.pos(margin + 24, margin + 12),
    k.color(...theme.primary),
    k.z(42),
    tag,
  ])

  if (hint) {
    k.add([
      k.text(hint, { size: 14, width: textW }),
      k.pos(margin + 24, margin + 40),
      k.color(...theme.muted),
      k.z(42),
      tag,
    ])
  }

  return {
    set(state) {
      const parts: string[] = []
      if (state.lives != null) parts.push(`❤ ${state.lives}`)
      if (state.time != null) parts.push(`⏱ ${Math.max(0, Math.ceil(state.time))}s`)
      if (state.label) parts.push(state.label)
      if (state.score) parts.push(state.score)
      line.text = parts.join('  ·  ')
    },
  }
}
