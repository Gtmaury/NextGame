## Why

Los juegos terminan de golpe al alcanzar un umbral de puntuación (p. ej. "8/8, ¡ganaste!") en vez de escalar la dificultad para siempre. El usuario quiere partidas infinitas donde solo perder vidas/tiempo termina la partida, más una tabla de puntuaciones para comparar récords.

## What Changes

- **Modo infinito en los 7 juegos**: se eliminan los umbrales de victoria; la partida solo termina al perder (vidas agotadas o tiempo agotado). El resultado siempre es una puntuación.
- **Curvas de dificultad progresivas por juego** (velocidad, cadencia, TTL, tamaño de zona/radio de acierto) que suben sin tope abrupto, con indicador de nivel (`Nv`) en el HUD.
- **Juegos contrarreloj (race, stars)**: el reloj se recarga al acertar (bonus decreciente), así el tiempo solo se agota si fallas.
- **Señal única de fin**: `GameCallbacks` pierde `onWin`; todo juego termina con `onLose(score)`.
- **Tabla de récords**: pestaña "Récords" en el feed con el mejor puntaje por juego (localStorage existente), ordenada desc, y chip de récord en cada card del feed.

## Capabilities

### New Capabilities

- `high-scores`: récords por juego persistidos en localStorage y visibles en una tabla del feed, en la card y en el overlay de derrota.

### Modified Capabilities

- `game-runtime`: la señal de fin es única (derrota con puntuación); desaparece la señal de victoria.
- `lives`: la economía de intentos se activa solo al perder (ya no existe "ganar").
- `game-feed`: nueva pestaña "Récords" junto a Jugar/Guardados y récord visible en la card.

## Impact

- **Código**: `src/types.ts`, `src/components/GamePlayer.tsx`, `src/components/Feed.tsx`, `src/index.css`, `src/games/{catch,tapdot,race,dodge,jump,balance,stars}.ts`.
- **Sin cambios**: `runtime/highscore.ts` (ya persiste récords), `runtime/attempts`, PWA, sprites/thumbs.
- **Fuera de alcance**: récords globales en servidor, tablas por fecha, logros.
