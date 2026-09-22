## Why

Con 10 minijuegos el feed ya cubre tap, esquivar, saltar, cortar, apilar y memoria, pero faltan tres gestos hiper-casuales clásicos: **un toque rítmico (flap)**, **cambio de carril por swipe** y **mantener→soltar (carga)**. Añadirlos ahora alarga la tanda sin tocar economía ni arquitectura, y deja huecos listos para pulir fantasía/sprites después.

## What Changes

- Añadir tres minijuegos Kaplay como plugins `MiniGameDef`: **flap** (Aleteo, retry), **swipe** (Carriles, retry), **hold** (Carga, time).
- Registrarlos en `meta` + `registry` (+ themes, accents, assets/thumbs, CSS `card--*`) para que entren al feed aleatorio, guardados, récords y precarga N+1.
- Reutilizar HUD/temas/FX existentes; thumbs vía pipeline actual (sprites opcionales / primitivas Kaplay si faltan PNG — se pulen después).
- Sin cambios de gestos del feed, economía de intentos, premium, PWA ni contrato `MiniGameDef`.

## Capabilities

### New Capabilities

- `minigame-catalog`: publicación de los tres nuevos títulos (`flap`, `swipe`, `hold`) en el catálogo del feed como plugins autocontenidos.

### Modified Capabilities

<!-- Ninguna en openspec/specs/: game-feed / game-runtime / lives / offline no cambian requisitos de navegación ni economía. -->

## Impact

- **Código**: `src/games/flap.ts`, `swipe.ts`, `hold.ts`; entradas en `meta.ts`, `registry.ts`, `themes.ts`, `accents.ts`, `assets.ts`; CSS `card--flap|swipe|hold`.
- **Assets**: thumbs (y sprites opcionales) para los 3 ids vía pipeline generate/install o fallback de `GameThumb` + primitivas.
- **Sin cambios** en runtime de intentos, highscore API, offline ni dependencias npm.
- **Fuera de alcance**: rediseño de dodge para diferenciar carriles, audio obligatorio, nuevos lifeModels, multiplayer.
