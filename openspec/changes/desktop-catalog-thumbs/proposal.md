## Why

Tres juegos del catálogo (`flap`, `swipe`, `hold`) se mostraban con iniciales porque faltaban thumbs. En escritorio la shell se recortaba a 480px; hace falta una versión web de catálogo (pared de cabinas) sin tocar el feed swipe en móvil.

## What Changes

- Thumbs pixel-art cute para Aleteo, Carriles y Carga (`/assets/thumbs/{flap,swipe,hold}.png`), misma familia que el generador ASCII existente.
- Catálogo bento en viewport ≥900px: juego destacado + estantería irregular; Guardados y Récords en dos columnas.
- Por debajo de 900px se mantiene el feed vertical a pantalla completa (columna 480px entre 768 y 899).

## Capabilities

### New Capabilities

- `app-ui`: layout de catálogo web en escritorio (header de sitio, bento, listas anchas).
- `game-assets`: thumbs pixel de `flap`, `swipe` y `hold`.

### Modified Capabilities

<!-- game-feed móvil no cambia: swipe, tap para jugar, guardados y récords siguen igual bajo 900px. -->

## Impact

- **Código**: `src/components/Feed.tsx`, `GameThumb.tsx`, `src/index.css`, `scripts/generate-pixel-sprites.mjs`.
- **Assets**: `public/assets/thumbs/flap.png`, `swipe.png`, `hold.png`.
- **Sin cambios** en Kaplay, economía, PWA ni contrato `MiniGameDef`.
- **Fuera de alcance**: sprites in-game de flap/swipe/hold.
