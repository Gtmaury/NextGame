## Why

El rediseño de la shell (`ui-visual-redesign`) dejó los minijuegos Kaplay con aspecto de prototipo: fondo negro plano, HUD de texto blanco sin jerarquía y formas geométricas genéricas. Al entrar a jugar, el contraste con el feed nuevo rompe la sensación de producto. Hay que elevar el HUD y el look de cada partida — y que cada juego se sienta visualmente distinto.

## What Changes

- Rediseñar el **HUD in-game** (vidas / tiempo / score / hints) en los 7 minijuegos para alinearlo con el lenguaje visual cinematográfico de la shell (contraste, tipografía, chips).
- Dar a **cada juego una identidad visual propia**: fondo, paleta de entidades y atmósfera distintos (p. ej. Salto ≠ Esquiva ≠ Estrellas).
- Mantener mecánicas, `lifeModel`, metas de victoria/derrota y la interfaz `MiniGameDef` sin cambios de comportamiento.
- Sin rediseñar la shell React (feed/overlays) ni añadir assets raster pesados.

## Capabilities

### New Capabilities

- `in-game-ui`: presentación visual dentro del canvas Kaplay — HUD legible alineado a la marca y temas visuales diferenciados por minijuego.

### Modified Capabilities

<!-- Ninguna: game-runtime / lives / game-feed no cambian requisitos de comportamiento; solo cambia cómo se ve la partida. -->

## Impact

- **Código**: los 7 módulos en `src/games/*.ts` (catch, tapdot, race, dodge, jump, balance, stars); posible helper compartido de HUD en `src/runtime/` o `src/games/` si reduce duplicación.
- **Sin cambios** en Feed/GamePlayer React, economía de intentos, PWA ni dependencias npm.
- **Fuera de alcance**: nuevas mecánicas, spritesheets/audio externos, cambiar umbrales de win/lose salvo ajustes cosméticos de feedback visual.
