## Why

Tras el polish de color y HUD, los minijuegos siguen usando rectángulos y círculos. Eso limita la sensación de “juego de verdad”. Una tanda de **sprites pixel-art cute/casual** para los elementos jugables (y thumbs del feed) cierra el salto estético sin tocar mecánicas.

## What Changes

- Crear un **set de assets pixel-art cute** coherente para los 7 minijuegos: player / objetivos / obstáculos clave de cada título.
- Sustituir thumbs emoji del feed por **thumbnails pixel** (o iconos de card) alineados al mismo estilo.
- Integrar assets en Kaplay vía `preload` + `sprite` (manteniendo `MiniGameDef` y la precarga N+1).
- Estilo único de tanda: pixel art hiper-casual, siluetas limpias, fondo keyable, sin animaciones complejas en esta entrega.
- Sin cambiar reglas de win/lose, vidas/intentos ni la shell React (salvo mostrar el nuevo thumb).

## Capabilities

### New Capabilities

- `game-assets`: catálogo visual de sprites e iconos de los minijuegos — qué elementos se representan con arte pixel-art y que el feed/juego los usen de forma coherente.

### Modified Capabilities

<!-- Ninguna a nivel de requisitos de game-runtime/feed: el comportamiento de juego no cambia; solo la representación visual de entidades y thumbs. -->

## Impact

- **Nuevos archivos**: `public/assets/` o `src/assets/` (PNG por sprite), posiblemente un manifiesto de nombres.
- **Código**: `preload`/`mount` en `src/games/*.ts`, `meta.ts` (thumbs), quizá helper de carga; PWA cacheará los PNG vía precarga existente.
- **Producción de arte**: generación con herramientas de imagen (estilo anclado) en la fase apply; no se añaden SDKs de runtime.
- **Fuera de alcance**: animaciones multi-frame, tilesets de mundo, audio, rediseño de HUD React/overlays.
