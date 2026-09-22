## Why

Tras el rediseño visual y los assets pixel, la shell sigue sin sentirse como un producto pulido: thumbnails rotos cuando faltan PNG, header saturado, cards que parecen prototipo glassmorphism, overlays con copy placeholder y poca continuidad visual entre feed y partida. El usuario no percibe la interfaz como deseada; hace falta una segunda pasada centrada en **composición, estados vacíos/rotos, chrome informativo y cohesión feed↔juego**, sin tocar mecánicas ni economía.

## What Changes

- **Composición del feed**: layout más claro (jerarquía título/thumb/CTA), botón explícito "Jugar" además del tap en card, y mejor uso del espacio vertical en móvil.
- **Chrome informativo**: mostrar intentos globales en header (y estado premium) para que la economía sea visible fuera del overlay de derrota.
- **Estados de asset robustos**: fallback visual cuando falta thumb/sprite (iniciales, color del juego o placeholder pixel) en lugar de imagen rota.
- **Overlays refinados**: copy en español natural, jerarquía de información (puntuación, récord, intentos), y recovery offline/online con aspecto de producto (no texto de placeholder de anuncio).
- **Lista de guardados alineada**: mismas señales visuales que las cards del feed (thumb, variante de color por juego).
- **Transición feed → juego**: entrada/salida más suave (fade del feed, chrome de salida más claro) sin cambiar gestos.
- **Ajustes tipográficos y densidad**: escala de texto y espaciado revisados para lectura en pantalla pequeña; menos efectos decorativos que compiten con el contenido.
- Sin cambios en Kaplay HUD interno, reglas de vidas/intentos, PWA ni catálogo de juegos.

## Capabilities

### New Capabilities

- `app-ui`: refinamiento de la shell React — composición del feed, chrome, overlays, guardados, fallbacks de assets y motion de transición entre modos feed y juego.

### Modified Capabilities

<!-- Ninguna en openspec/specs/: app-ui aún no está sincronizada al catálogo principal; este cambio define el delta completo de requisitos de interfaz de shell. -->

## Impact

- **Código**: `src/index.css`, `src/components/Feed.tsx`, `src/components/GamePlayer.tsx`; posible helper ligero para fallbacks de thumb (p. ej. en `src/games/meta.ts` o `src/components/`).
- **Assets**: verificar presencia de PNG en `public/assets/thumbs/` y `public/assets/sprites/`; si faltan, el fallback cubre la UX pero conviene completar archivos en apply.
- **Sin cambios** en `src/games/*.ts` (lógica de juego), `src/runtime/*` (economía), `types.ts`, ni dependencias npm.
- **Fuera de alcance**: rediseño del HUD canvas Kaplay, nuevas rutas de navegación, SDK real de anuncios, onboarding multi-paso.
