## Context

El MVP ya tiene `MiniGameDef`, registro dinámico (`meta` + `registry` con `import()`), una sola instancia Kaplay y feed React. Ver `proposal.md` — Why. Este cambio solo añade contenido de plugins; no altera runtime, economía ni PWA.

## Goals / Non-Goals

**Goals:**
- Cuatro plugins nuevos que encajan en el patrón existente (`export const game: MiniGameDef`).
- Variedad de gestos respecto a catch / tapdot / race (esquivar, saltar, mantener, recoger).
- Registro mínimo: solo `meta.ts` + `registry.ts` + un archivo por juego.

**Non-Goals:**
- Cambiar `MiniGameDef`, feed, intentos, premium o service worker.
- Assets externos pesados (spritesheets, audio); se usan primitivas Kaplay (círculos, rects, emoji en meta).
- Balance fino de dificultad (valores iniciales razonables; se pueden retocar después).

## Decisions

### 1. Los cuatro títulos (mecánica + lifeModel)

| id | Título | lifeModel | Mecánica (gesto único) |
|----|--------|-----------|-------------------------|
| `dodge` | Esquiva | retry (3) | Mover horizontalmente un avatar; esquivar bloques que caen. Fallo = −1 vida. Meta: sobrevivir N obstáculos o puntuar X. |
| `jump` | Salto | retry (3) | Tocos para saltar huecos / plataformas. Caer = −1 vida. Meta: cruzar N plataformas. |
| `balance` | Equilibrio | time (~20s) | Mantener pulsado o soltar para centrar un indicador en una zona segura. Salirse o agotar tiempo sin meta = derrota; alcanzar puntuación objetivo a tiempo = victoria. |
| `stars` | Estrellas | time (~20s) | Tocar estrellas que aparecen; acumular N antes de que acabe el tiempo. |

- **Por qué estos cuatro**: cubren gestos distintos a los del MVP (paddle, tap-TTL, tap-contra-reloj) y cumplen 2× retry + 2× time del spec.
- **Alternativa descartada**: clones cercanos de tapdot/race — aportan poco al catálogo.

### 2. Un archivo por juego, mismo contrato que el MVP

Cada juego en `src/games/<id>.ts` exporta `game: MiniGameDef` con `preload` (puede ser no-op si no hay assets), `mount` que registra/limpia con un tag de escena (`TAG = game.id`), y callbacks `onWin` / `onLose` / cleanup al desmontar.

- **Por qué**: copia el patrón de `catch` / `tapdot` / `race`; cero riesgo de acoplar el feed.
- **Alternativa descartada**: un único archivo “batch” con los cuatro — peor code-split y peores chunks de precarga.

### 3. Registro solo en meta + loaders

```
gameMeta[id] = { id, title, thumbnail }
loaders[id] = () => import('./<id>').then(m => m.game)
```

`gameIds` se deriva de `gameMeta`; el feed y la precarga no necesitan más cambios.

### 4. Sin assets externos en esta tanda

Primitivas geométricas + colores + texto HUD, igual que el MVP. Thumbnails = emoji en `meta` (el feed ya los muestra así).

- **Por qué**: reduce bloqueos y mantiene el bundle ligero para precarga N+1.
- **Trade-off**: menos “polish” visual; aceptable para tanda de contenido.

## Risks / Trade-offs

- **[Juegos demasiado similares entre sí]** → mitigado por gestos distintos (mover / tap-salto / hold / tap-recoger).
- **[Fugas de listeners Kaplay al salir]** → mismo patrón: tag por juego + destroy en cleanup de `mount`.
- **[Dificultad desbalanceada]** → metas cortas (pocos segundos / pocas vidas); se ajusta en playtest sin cambiar specs.
- **[Precarga de 7 chunks]** → se sigue precargando solo el N+1; el riesgo de caché inflada no crece linealmente con el catálogo.

## Migration Plan

Greenfield de contenido: deploy de la build con los 4 módulos nuevos. Rollback = build anterior. Estado en `localStorage` (guardados) sigue válido; ids nuevos simplemente no estaban guardados antes.

## Open Questions

- Ninguna que bloquee implementación; títulos/emojis se pueden renombrar en tasks sin cambiar requisitos.
