## 1. Registro en el catálogo

- [x] 1.1 Añadir `dodge`, `jump`, `balance` y `stars` a `src/games/meta.ts` (título + emoji) y verificar que `gameIds` incluye los cuatro ids
- [x] 1.2 Añadir loaders dinámicos en `src/games/registry.ts` apuntando a `./dodge`, `./jump`, `./balance`, `./stars` y verificar que `loadGame(id)` resuelve para cada id

## 2. Plugins de juego (retry)

- [x] 2.1 Implementar `src/games/dodge.ts` (`lifeModel: 'retry'`, 3 vidas, esquivar obstáculos) con `MiniGameDef`, HUD y cleanup por tag; verificar win/lose vía callbacks y salida limpia al feed
- [x] 2.2 Implementar `src/games/jump.ts` (`lifeModel: 'retry'`, 3 vidas, tap para saltar) con el mismo contrato; verificar win/lose y desmontaje sin residuales

## 3. Plugins de juego (time)

- [x] 3.1 Implementar `src/games/balance.ts` (`lifeModel: 'time'`, ~20s, mantener el indicador en zona) con el mismo contrato; verificar victoria al objetivo y derrota por tiempo/salirse
- [x] 3.2 Implementar `src/games/stars.ts` (`lifeModel: 'time'`, ~20s, tocar estrellas hasta meta) con el mismo contrato; verificar victoria/derrota por tiempo

## 4. Integración y smoke

- [x] 4.1 Arrancar el feed y verificar que los 7 juegos aparecen al hacer swipe (orden aleatorio) y que se pueden guardar/quitar los cuatro nuevos
- [x] 4.2 Entrar, jugar hasta win y hasta lose en cada uno de los cuatro; verificar overlay de intentos al perder y que `exit` vuelve al feed con swipe activo
- [x] 4.3 Confirmar que precarga N+1 sigue funcionando al pasar por un juego nuevo (transición sin carga perceptible) y que `npm run build` termina sin errores de TypeScript
