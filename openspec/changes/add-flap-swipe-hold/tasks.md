## 1. Registro y presentación en el feed

- [x] 1.1 Añadir `flap`, `swipe`, `hold` a `meta.ts`, `registry.ts`, `themes.ts`, `accents.ts` y `assets.ts` (thumbs path; sprites list vacía o mínima OK) y verificar que `gameIds` incluye los tres
- [x] 1.2 Añadir estilos `card--flap|swipe|hold` (y variantes saved/score/fallback) en CSS alineados al mapa de acentos — verificar que las cards nuevas no usan el tinte default genérico
- [x] 1.3 Generar o instalar thumbs de los tres (o confirmar fallback de `GameThumb`) y verificar que el feed muestra imagen o placeholder legible

## 2. Plugins Kaplay

- [x] 2.1 Implementar `flap.ts` (retry 3, tap = impulso ↑, obstáculos con hueco, HUD, TAG cleanup, `onLose`) y verificar entrar / jugar / perder / salir sin romper el feed
- [x] 2.2 Implementar `swipe.ts` (retry 3, 3 carriles, swipe horizontal, obstáculos frontales, HUD, cleanup) y verificar que el gesto es carril discreto (no movimiento libre tipo dodge)
- [x] 2.3 Implementar `hold.ts` (time ~25s, hold→release con barra de potencia + diana, HUD, cleanup, `onLose`) y verificar acierto suma score y miss/tiempo termina la partida
- [x] 2.4 Confirmar que los tres exportan `MiniGameDef` completo y que lazy `loadGame` resuelve cada id sin error

## 3. QA integrado

- [x] 3.1 Smoke: recorrer feed y encontrar los tres ids; guardar uno y verlo en Guardados
- [x] 3.2 Smoke: jugar los tres (perder al menos una vez cada uno) y verificar overlays / intentos / récords sin regresión de gestos del feed
- [x] 3.3 Ejecutar `npm run build` y verificar que termina sin errores de TypeScript/Vite
