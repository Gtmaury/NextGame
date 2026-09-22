## Context

See `proposal.md` — Why. Catálogo actual: 10 plugins vía `meta` + `registry` + `MiniGameDef`, con acentos dinámicos por `id` ya en el feed. Este change solo añade 3 plugins de gestos nuevos; no toca shell, economía ni PWA.

## Goals / Non-Goals

**Goals:**
- Tres plugins (`flap`, `swipe`, `hold`) con mezcla 2× retry + 1× time.
- Diferenciar `swipe` de `dodge` mediante carriles discretos (no movimiento libre).
- Thumbs + primitivas Kaplay suficientes para jugar; sprites pixel se pueden pulir después.

**Non-Goals:**
- Cambiar `MiniGameDef`, PWA, premium, highscore storage, acentos del feed.
- Audio obligatorio o assets AAA.
- Refactor de `dodge` / `jump` existentes.

## Decisions

### 1. Los tres títulos (defaults; pulibles después)

| id | Título (ES) | lifeModel | Gesto / fantasía base |
|----|-------------|-----------|------------------------|
| `flap` | Aleteo | retry (3) | Tap = impulso ↑; gravedad; obstáculos con hueco; colisión o salir de bounds = −1 vida |
| `swipe` | Carriles | retry (3) | 3 carriles; swipe izq/der cambia carril; obstáculos frontales; choque = −1 vida |
| `hold` | Carga | time (~25s) | Hold carga potencia; release lanza a diana (móvil o con ventana de timing); miss o tiempo = lose; score = aciertos |

- **Por qué**: cubren huecos de gesto (flap ≠ jump, carriles ≠ dodge libre, hold→release inexistente).
- **Alternativa aplazada**: beat / pop / merge — otros paquetes del explore.

### 2. Plugin pattern (igual que tandas previas)

Un archivo `src/games/<id>.ts` → `export const game: MiniGameDef`; `preload` + `mount` con TAG; `makeHud` + `getTheme`; registro en `meta` / `registry` / `assets` / `themes` / `accents`; CSS `card--<id>`.

Sprites/thumbs: thumbs recomendados vía pipeline; si faltan PNG de sprites, primitivas Kaplay + fallback de `GameThumb` (como slice/stack/memory). Pulido visual en un change posterior si hace falta.

### 3. Diferenciación swipe vs dodge

- `swipe`: carriles fijos (3), cambio instantáneo o snappy por gesto horizontal; scroll/avance automático del mundo.
- `dodge`: se mantiene movimiento libre / paddle-like existente.
- Opcional en apply: obstáculos de 1 o 2 carriles de ancho para forzar decisiones (no obligatorio en v1).

### 4. Hold — objetivo por defecto

- Diana que se mueve lentamente en eje Y (o X) o zona de potencia “sweet spot” en la barra.
- Acierto = +1 score y pequeña recarga de tiempo (coherente con otros time-games); fallo claro = lose inmediato o −tiempo fuerte (elegir una en apply; preferencia: miss = lose para sesión corta feed).

### 5. Skills en apply (opcionales)

- Kaplay / game-feel para los 3 plugins.
- No instalar packs Phaser/Godot.

## Risks / Trade-offs

- [Flap se siente clon de jump] → Mitigation: sin suelo, solo tap impulsivo + tubos/huecos; sin thrust hold.
- [Swipe se siente clon de dodge] → Mitigation: 3 carriles discretos + swipe; no drag continuo.
- [Hold difícil de enseñar] → Mitigation: barra de potencia visible + diana grande al inicio; dificultad escala con score.
- [Falta de sprites] → Mitigation: thumbs + primitivas; pulir después.

## Migration Plan

- Deploy build con 3 módulos + CSS/registro.
- Rollback = build anterior; localStorage de guardados ignora ids desconocidos de forma natural.
- Sin migración de datos.

## Open Questions

- Ninguna bloqueante. Títulos ES (`Aleteo` / `Carriles` / `Carga`) y fantasía visual fina se pueden ajustar en apply o en un polish posterior sin cambiar ids.
