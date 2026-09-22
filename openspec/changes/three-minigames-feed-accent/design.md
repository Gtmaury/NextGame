## Context

See `proposal.md` — Why. Catálogo actual: 7 plugins vía `meta` + `registry` + `MiniGameDef`. Shell mobile-first usa `--accent` fijo ámbar; las cards ya tienen `card--{id}` con tintes distintos. Este change añade 3 plugins y acopla `--accent` (y derivados) al juego visible del feed.

## Goals / Non-Goals

**Goals:**
- Tres plugins con gestos nuevos (`slice`, `stack`, `memory`) y mezcla 2× retry + 1× time.
- Mapa de acentos por `id` reutilizado por CSS de card y chrome del feed.
- Aplicar acento en swipe sin cambiar gestos ni economía.

**Non-Goals:**
- Cambiar `MiniGameDef`, PWA, premium logic, highscore storage.
- Audio obligatorio o assets AAA.
- Temas claros / light mode.

## Decisions

### 1. Los tres títulos

| id | Título (ES) | lifeModel | Gesto |
|----|-------------|-----------|--------|
| `slice` | Corte | retry (3) | Deslizar sobre objetos que cruzan; fallo = −1 vida |
| `stack` | Torre | retry (3) | Tap para colocar el siguiente bloque; desalineación grave = −1 / derrumbe = lose |
| `memory` | Memoria | time (~25s) | Repetir secuencia de taps; error o tiempo = lose; score = rondas |

- **Por qué**: cubren huecos de gesto respecto a catch/tapdot/race/dodge/jump/balance/stars.
- **Alternativa**: match/sling — aplazados; menos contrastados o más UI.

### 2. Plugin pattern (igual que tandas previas)

Un archivo `src/games/<id>.ts` → `export const game: MiniGameDef`; `preload` + `mount` con TAG; `makeHud` + `getTheme`; registro en `meta` / `registry` / `assets` / `themes`; CSS `card--<id>`.

Sprites/thumbs: pipeline existente; si faltan PNG, fallback de `GameThumb` cubre UX.

### 3. Acentos dinámicos vía CSS variables + mapa por id

- Fuente de verdad: mapa `Record<gameId, { accent, accentInk }>` (puede vivir junto a `themes` o `meta`) alineado con secondary/tintes de card.
- En `GameFeed`, al cambiar `wrapped` / id visible, setear en el contenedor del feed (o `:root` scoped al `.feed-screen`):
  - `--accent`
  - `--accent-ink`
  - opcional `--accent-soft` para chips
- Controles que ya usan `var(--accent)` (tabs `.active`, `.play-btn`, `.attempts-chip`, sombras) heredan sin markup por botón.
- Transición corta de `background-color` / `box-shadow` (~200ms); respetar `prefers-reduced-motion`.

**Al jugar:** pasar el `gameId` activo; `.game-player` / `.exit-btn:focus` / overlays pueden leer el mismo acento (set en `.app` o wrapper) para continuidad. Si overlays se ven raros con acentos muy claros, usar tinta `--accent-ink` en botones primarios (ya existe patrón ámbar).

**Tabs Guardados/Récords:** conservar último acento del feed (simple) en lugar de reset a ámbar fijo.

- **Alternativa descartada:** rotación aleatoria independiente del juego — el usuario pidió “conforme pase de juego”.

### 4. Skills en apply (opcionales)

- Kaplay / `prototype-fast` / `game-feel` para los 3 plugins.
- No instalar packs Phaser/Godot.

## Risks / Trade-offs

- [Acento ilegible sobre fondo] → Mitigation: pares accent + accent-ink contrastados; probar los 10 ids.
- [Falta de sprites] → Mitigation: fallback thumb + primitivas Kaplay si hace falta.
- [Memory demasiado largo] → Mitigation: secuencias cortas, timebox ~25s, metas de score bajas.
- [Setear :root afecta kaplay-wrap] → Mitigation: scope variables a `.feed-screen` y, en playing, a `.app` o `.game-player` solo cuando hay `playingId`.

## Migration Plan

- Deploy build con 3 módulos + CSS/JS de acento.
- Rollback = build anterior; localStorage de guardados ignora ids desconocidos de forma natural.
- Sin migración de datos.

## Open Questions

- Ninguna bloqueante; títulos ES finales (`Corte` / `Torre` / `Memoria`) ajustables en apply sin cambiar ids.
