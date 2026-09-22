## Why

Los sprites instalados son PNG de 1024×1024 con el arte ocupando solo ~40-50% del lienzo; KAPLAY los dibuja a tamaño natural en el mundo de 480×720, así que los elementos se ven gigantes (paddle más ancho que la pantalla, frutas al 75% del ancho).

## What Changes

- **Normalizar sprites al cargarlos** en `assets.ts`: recortar al bounding box del arte (después del magenta keying) y redimensionar a un tamaño consistente (~64px máx.) con `imageSmoothingEnabled = false` para mantener el pixelado nítido.
- Ajustar escalas puntuales por juego solo si algún sprite queda desproporcionado tras la normalización.
- Mantener el arte actual (no se regeneran ni se cambian los PNG), el contrato `MiniGameDef` y la economía intactos.
- Sin cambios en thumbs (el CSS ya los escala), PWA ni mecánicas.

## Capabilities

### New Capabilities

- `game-assets`: sprites de los minijuegos se cargan normalizados (recortados y reescalados) para que los elementos se rendericen a un tamaño jugable y coherente en el mundo KAPLAY.

### Modified Capabilities

<!-- Ninguna de las capabilities principales cambia de requisitos (game-feed, game-runtime, lives, offline). game-assets no está aún en openspec/specs/; este change define su delta completo. -->

## Impact

- **Código**: `src/games/assets.ts` (carga/normalización), posiblemente escalas en `src/games/*.ts`.
- **Sin cambios**: PNG en `public/assets/sprites/`, `runtime/*`, `types.ts`, dependencias npm.
- **Fuera de alcance**: regenerar arte, audio, thumbs, PWA.
