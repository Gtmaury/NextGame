## Why

Los rediseños previos (`ui-visual-redesign`, `refine-app-interfaces`, `in-game-visual-polish`) dejaron una shell usable pero aún con look genérico (púrpura/glow, tipografía de sistema, densidad pensada a medias). NextGame se juega en **móvil a pantalla completa**; hace falta un rediseño visual completo, mobile-first, que se sienta producto nativo (safe areas, thumb zones, contraste, tipografía y motion) sin cambiar el modelo feed → jugar → salir.

## What Changes

- Renovar el **sistema visual completo** (tokens de color, tipografía expresiva, radios, superficies, motion) con dirección estética propia — no el default “purple glow AI”.
- Rediseñar **toda la shell React** para móvil: header, tabs, cards del feed, lista de guardados, chrome de partida, overlays (win / lose / recovery / premium).
- Aplicar **layout mobile-first**: `100dvh`, safe-area insets, targets táctiles ≥44px, controles en zona de pulgar, tipografía legible a una mano.
- Alinear el **HUD in-game Kaplay** (chips de score/vidas/tiempo) al nuevo lenguaje visual para que feed y partida no se sientan de apps distintas.
- Mantener gestos y modos: swipe vertical en feed, tap/“Jugar” para entrar, salida explícita; sin cambios de economía, catálogo, PWA ni mecánicas.
- Documentar e invocar durante apply las **skills de diseño** ya disponibles (`redesign-existing-projects`, `frontend-design`, `high-end-visual-design`, `web-design-guidelines`) más skills opcionales de juice/pixel si se toca feedback in-game.

## Capabilities

### New Capabilities

- `app-ui`: lenguaje visual y presentación mobile-first de la shell (tokens, feed, guardados, chrome, overlays, touch/safe-area).
- `in-game-ui`: presentación del HUD y chrome visual dentro del canvas Kaplay alineada al rediseño móvil.

### Modified Capabilities

<!-- Ninguna en openspec/specs/: el comportamiento de feed/runtime/lives no cambia; solo presentación. -->

## Impact

- **Código**: `src/index.css`, `src/components/Feed.tsx`, `src/components/GamePlayer.tsx`, `src/components/GameThumb.tsx`, `src/App.tsx`; posible ajuste de helpers de HUD compartidos y módulos `src/games/*.ts` solo para look del HUD.
- **Fuentes**: web fonts curadas (display + body) vía CSS; sin nuevas dependencias npm obligatorias.
- **Sin cambios** en `src/runtime/*` (economía), contratos de `MiniGameDef`, PWA, catálogo de juegos ni gestos.
- **Fuera de alcance**: Capacitator/app store wrapper, onboarding multi-paso, cambio de motor, nuevos minijuegos, rediseño de sprites raster (salvo contraste/escala del HUD).
- **Skills (apply)**: ver `design.md` — kit de rediseño mobile + juice opcional.
