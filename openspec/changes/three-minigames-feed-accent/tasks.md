## 1. Mapa de acentos y shell dinámica

- [x] 1.1 Crear mapa de acento por `gameId` (hex accent + accentInk) para los 7 existentes + `slice`/`stack`/`memory` y verificar que no hay dos ids nuevos con el mismo accent primario
- [x] 1.2 Exponer helper para leer el acento de un id y aplicarlo como CSS vars en un elemento (p. ej. `--accent`, `--accent-ink`) — verificar en consola/DOM que las vars cambian al invocar el helper
- [x] 1.3 En el feed, al cambiar la card visible, aplicar el acento del juego actual al contenedor de la shell y verificar que tab activo, "Jugar" y chip de intentos cambian de color al swipe
- [x] 1.4 Al entrar en partida, propagar el acento del `playingId` al chrome/overlays y verificar continuidad visual; al volver a Guardados/Récords conservar último acento y al volver al feed realinear con la card

## 2. Registro y temas de los tres juegos

- [x] 2.1 Añadir `slice`, `stack`, `memory` a `meta.ts`, `registry.ts`, `themes.ts` y `assets.ts` (sprites list + thumbs path) y verificar que `gameIds` incluye los tres
- [x] 2.2 Añadir estilos `card--slice|stack|memory` (y variantes saved/score/fallback) en CSS alineados al mapa de acentos — verificar que las cards nuevas no usan el tinte default genérico

## 3. Plugins Kaplay

- [x] 3.1 Implementar `slice.ts` (retry, gesto deslizar/cortar, HUD, cleanup) y verificar entrar/jugar/perder/salir sin romper el feed
- [x] 3.2 Implementar `stack.ts` (retry, gesto apilar, HUD, cleanup) y verificar entrar/jugar/perder/salir
- [x] 3.3 Implementar `memory.ts` (time, gesto secuencia, HUD, cleanup) y verificar entrar/jugar/perder/salir
- [x] 3.4 Generar o instalar thumbs/sprites de los tres (o confirmar fallback de thumb) y verificar que el feed muestra imagen o placeholder legible

## 4. QA integrado

- [x] 4.1 Smoke: recorrer feed con ≥3 swipes y confirmar que el acento del menú cambia con cada juego distinto visible
- [x] 4.2 Smoke: jugar los tres nuevos (perder al menos una vez) y verificar overlays/intentos/récords sin regresión de gestos
- [x] 4.3 Ejecutar `npm run build` y verificar que termina sin errores de TypeScript/Vite
