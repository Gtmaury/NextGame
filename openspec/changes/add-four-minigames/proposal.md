## Why

El MVP solo tiene 3 minijuegos; el feed se agota en un par de swipes y no demuestra bien el modelo de "tanda de plugins". Ampliar el catálogo a 7 juegos mantiene el mismo runtime y hace el producto más jugable sin tocar la economía ni la arquitectura del feed.

## What Changes

- Añadir **4 minijuegos hiper-casuales** nuevos como plugins Kaplay que cumplen `MiniGameDef`.
- Registrarlos en el catálogo (`meta` + loaders dinámicos) para que aparezcan en el feed con orden aleatorio, guardados y precarga, sin cambios en el feed ni en la economía de intentos.
- Mezclar `lifeModel` `retry` y `time` (como en el MVP) para seguir ejercitando ambas capas de vidas.
- Sin cambios en monetización, offline, premium ni interfaz común.

## Capabilities

### New Capabilities

- `minigame-catalog`: el conjunto de minijuegos publicados en el feed; en este cambio se añaden cuatro títulos concretos como plugins autocontenidos.

### Modified Capabilities

<!-- Ninguna: game-feed / game-runtime / lives / offline no cambian de requisitos; el catálogo crece vía plugins. -->

## Impact

- **Código**: nuevos módulos bajo `src/games/` (uno por juego), entradas en `src/games/meta.ts` y `src/games/registry.ts`.
- **Sin cambios** en `Feed`, `GamePlayer`, runtime de intentos, PWA ni dependencias npm.
- **Contenido propuesto** (nombres provisionales; se confirman en design/tasks):
  - `dodge` — Esquiva (retry)
  - `jump` — Salto (retry)
  - `balance` — Equilibrio (time)
  - `stars` — Estrellas (time)
