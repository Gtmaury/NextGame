## Why

El feed con 7 minijuegos se siente corto tras varios swipes, y el chrome del menú queda siempre en el mismo ámbar aunque cada card ya tenga color propio. Ampliar el catálogo con **3 plugins** de gestos nuevos y hacer que el **acento del menú siga al juego visible** refuerza la sensación de producto tipo feed y da variedad visual sin tocar economía ni arquitectura del runtime.

## What Changes

- Añadir tres minijuegos Kaplay como plugins `MiniGameDef`: **slice** (swipe/corte, retry), **stack** (apilar, retry), **memory** (secuencia, time).
- Registrarlos en `meta` + `registry` (+ themes, assets/thumbs, estilos de card) para que entren al feed aleatorio, guardados, récords y precarga N+1.
- Hacer que el **acento de la shell del feed** (tabs activos, botón Jugar, chip de intentos y tintes relacionados) **cambie al color del juego actualmente visible** al hacer swipe o al mostrar esa card.
- Al entrar a jugar desde una card, el chrome de partida (p. ej. foco del botón salir / tintes menores) MAY heredar el mismo acento del juego activo; overlays de derrota/recuperación usan ese acento o neutro coherente — detalle en design.
- Sin cambios de gestos del feed, economía de intentos, premium, PWA ni contrato `MiniGameDef`.

## Capabilities

### New Capabilities

- `minigame-catalog`: publicación de los tres nuevos títulos en el catálogo del feed como plugins autocontenidos.
- `app-ui`: acento dinámico de la shell del feed (y chrome relacionado) ligado al juego visible.

### Modified Capabilities

<!-- Ninguna en openspec/specs/: game-feed / game-runtime / lives no cambian requisitos de comportamiento de navegación ni economía. -->

## Impact

- **Código**: `src/games/slice.ts`, `stack.ts`, `memory.ts`; entradas en `meta.ts`, `registry.ts`, `themes.ts`, `assets.ts`; CSS `card--*` + variables de acento; `Feed.tsx` (y posiblemente `App`/`GamePlayer`) para aplicar el color del juego activo.
- **Assets**: thumbs/sprites para los 3 ids (pipeline existente generate/install o placeholders con fallback).
- **Sin cambios** en runtime de intentos, highscore API, offline ni dependencias npm.
- **Fuera de alcance**: nuevos lifeModels, multiplayer, audio obligatorio, rediseño total de tokens base fuera del acento dinámico.
