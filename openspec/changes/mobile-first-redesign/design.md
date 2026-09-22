## Context

See `proposal.md` for motivation. La shell actual (`src/index.css`, `Feed.tsx`, `GamePlayer.tsx`) usa un dark theme púrpura/glow con tipografía de sistema y safe-area variables ya definidas pero subaprovechadas. Ya hubo rediseños parciales; este change es un **reskin + layout mobile-first** sobre la misma arquitectura feed/juego, no un rewrite.

Stack fijo: React + Vite + CSS variables + Kaplay. Sin nuevo framework UI.

## Goals / Non-Goals

**Goals:**
- Nueva dirección visual distintiva (tokens + tipografía + superficies) aplicada a toda la shell.
- Layout y chrome pensados para teléfono portrait (dvh, safe areas, thumb zone, targets ≥44px).
- HUD Kaplay alineado al mismo lenguaje visual.
- Usar skills de diseño en apply para evitar look genérico AI.

**Non-Goals:**
- Cambiar gestos, economía, PWA, catálogo o mecánicas.
- Migrar a Tailwind/UI kit.
- Empaquetar como app nativa (Capacitor).
- Redibujar todos los sprites PNG (solo HUD/presentación).

## Decisions

### 1. Dirección estética: “arcade nocturno cálido” (no purple-glow)
- **Elección**: Base casi-negro tintado (carbón/azul noche muy desaturado), **un** acento cálido (ámbar/coral) + neutros fríos para texto; tipografía display geométrica expresiva + body legible; superficies con blur suave y bordes hairline, sin glow púrpura multilayers.
- **Por qué**: Rompe el fingerprint AI actual (`--accent: #8b5cf6` + glow) y encaja con pixel cute / feed inmersivo.
- **Alternativas**: (a) mantener purple — rechazado; (b) editorial cream/light — malo para canvas full-bleed y OLED gaming.

### 2. Mobile-first CSS, desktop como ampliación
- Tokens y layout se definen para ≤768px primero; desktop solo centra/limita ancho máximo del feed si hace falta.
- Usar `min-height: 100dvh` (no solo `100%`/`100vh`) en shell y contenedores full-screen.
- Controles de partida (salir) bajan a **zona pulgar** (bottom safe + padding); header del feed se aligera.

### 3. Tokens en `:root`, markup mínimo
- Renovar variables en `index.css`; ajustar clases existentes en Feed/GamePlayer/GameThumb sin introducir CSS-in-JS.
- Fuentes vía `@import` o `<link>` (una display + una body); evitar Inter/Roboto/system-only.

### 4. HUD Kaplay vía helper compartido
- Extraer/ajustar un helper de chips HUD (si no existe uno limpio) para tipografía/contraste/posición mobile; cada `src/games/*.ts` solo pasa datos (vidas, score, etc.).
- No reescribir mecánicas ni escenas.

### 5. Skills a usar en `/opsx-apply` (kit de rediseño)

**Obligatorias (ya instaladas en la máquina):**

| Skill | Rol en este change |
|-------|--------------------|
| `redesign-existing-projects` | Auditoría → fix sobre CSS/componentes actuales sin rewrite |
| `frontend-design` | Dirección distintiva, tipografía, anti-defaults AI |
| `high-end-visual-design` | Densidad, motion, micro-interacciones; **forzar** mobile collapse (`100dvh`, sin overlaps táctiles) |
| `web-design-guidelines` | Pass de accesibilidad/touch/contraste al cerrar |

**Recomendadas a instalar antes o durante apply (opcionales pero valiosas):**

| Skill | Por qué | Instalar (Cursor) |
|-------|---------|-------------------|
| `ux` (skills-hub) | Audit heurístico + motion en shell móvil | `npx @skills-hub-ai/cli install ux --target cursor` |
| `game-feel` | Juice ligero si se toca feedback in-game | `npx skills add gamedev-skills/awesome-gamedev-agent-skills --skill game-feel --agent cursor` |
| `design-game` / `game-designer` (PlayableIntelligence) | Ideas de polish visual in-game (adaptar a Kaplay, no copiar Phaser) | `npx skills add PlayableIntelligence/game-creator --skill design-game --agent cursor` |

**No instalar para este change:** packs Godot/Unity/Phaser4 completos — contaminan el agente.

### 6. Orden de trabajo en apply
1. Tokens + tipografía + `100dvh`/safe-area.
2. Feed cards + tabs + header (thumb zone).
3. Overlays + chrome de salida.
4. HUD Kaplay alineado.
5. Pass `web-design-guidelines` + reduced-motion.

## Risks / Trade-offs

- [Tipografía web añade peso/FOUT] → Mitigation: 2 familias máximo, `font-display: swap`, subset si es posible.
- [Bajar el botón salir puede solapar UI de juego] → Mitigation: padding inferior del canvas/HUD + probar los 7 minis en viewport estrecho.
- [Skills high-end empujan glass/bento de SaaS] → Mitigation: brief fijo “arcade feed móvil”; rechazar cards bento y purple mesh.
- [Regresión visual respecto a rediseños previos] → Mitigation: checklist de escenarios en specs; no tocar runtime.

## Migration Plan

- Cambio solo front/CSS; deploy = build Vite habitual.
- Rollback = revert del change en git; sin migración de datos.
- No feature flag necesario (reskin total).

## Open Questions

- ¿Preferencia de acento final (ámbar vs coral vs lima desaturada)? Se fijará en apply tras un spike visual de 1 pantalla si el usuario no elige antes.
