## Why

La UI actual es funcional pero mínima (colores planos, tipografía de sistema, cards sin jerarquía visual). Con 7 juegos en el feed, la app se siente aún como prototipo. Un rediseño visual total — sin cambiar el modelo de navegación — eleva la percepción de producto y hace más atractivo el swipe y los overlays de victoria/derrota.

## What Changes

- Nuevo **sistema visual** (tokens de color, tipografía, radios, sombras, espaciado) aplicado a toda la shell React.
- Rediseño de **header**, **tabs**, **cards del feed**, **lista de guardados**, **botón de salida** y **overlays** (win / lose / recovery / premium).
- **Microinteracciones** más pulidas en el cambio de card (swipe) y en la aparición de overlays, sin alterar gestos ni modos.
- **Jerarquía tipográfica y contraste** pensados para móvil a pantalla completa (dark theme cinematográfico).
- Sin cambios de arquitectura de navegación: feed vertical + tap para jugar + salida explícita se mantienen.
- Sin cambios en Kaplay, plugins, intentos, offline ni premium (solo su presentación en UI).

## Capabilities

### New Capabilities

- `app-ui`: el lenguaje visual y la presentación de la shell (feed, guardados, chrome de juego, overlays), incluyendo tokens, contraste y motion de UI.

### Modified Capabilities

<!-- Ninguna a nivel de requisitos de comportamiento del feed/runtime: los gestos y modos no cambian; solo cambia cómo se ven. -->

## Impact

- **Código principal**: `src/index.css`, posiblemente tokens en CSS variables; ajustes menores de markup/clases en `Feed.tsx` y `GamePlayer.tsx` si hace falta estructura para el nuevo look.
- **Sin cambios** en `src/games/*`, `src/runtime/*`, `types.ts`, PWA ni dependencias obligatorias (fuentes web opcionales vía Google Fonts o system stack curada).
- **Fuera de alcance**: nueva tab bar / navegación, onboarding, splash nativo, Capacitor, rediseño de canvas/HUD dentro de los minijuegos Kaplay.
