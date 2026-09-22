## 1. Configuración del proyecto

- [x] 1.1 Inicializar proyecto Vite + React + TypeScript
- [x] 1.2 Añadir Kaplay y `vite-plugin-pwa`; configurar el service worker básico

## 2. Runtime de juegos

- [x] 2.1 Definir la interfaz `MiniGameDef` y los tipos (`lifeModel`, `initialLives`, callbacks `exit`/`onWin`/`onLose`)
- [x] 2.2 Crear la instancia única de Kaplay y el registro de juegos (registro de escenas por `gameId`)
- [x] 2.3 Implementar `mount` (entrar a la escena) y `unmount`/`exit` (volver al feed limpiando el estado)
- [x] 2.4 Implementar la precarga del juego N+1 (import dinámico + `preload` en background)

## 3. Feed

- [x] 3.1 Implementar el feed vertical con swipe entre juegos y orden aleatorio
- [x] 3.2 Implementar la transición feed↔juego (tap entra, oculta feed y muestra canvas; botón de salida)
- [x] 3.3 Implementar la lista de "guardados" (guardar/quitar juego, vista de guardados, persistencia en `localStorage`)

## 4. Intentos y economía

- [x] 4.1 Implementar el pool global de intentos (persistencia en `localStorage`)
- [x] 4.2 Implementar la señal de ganar/perder del juego y el gasto de 1 intento al continuar
- [x] 4.3 Implementar la detección de conexión (`navigator.onLine` + fallback de error de fetch)
- [x] 4.4 Implementar el flujo de recuperación: espera de 15 s offline (placeholder de promoción) y placeholder de anuncio online
- [x] 4.5 Implementar el flag premium (intentos ilimitados, sin anuncios)

## 5. Offline

- [x] 5.1 Configurar el precaché del shell y las thumbnails en el service worker
- [x] 5.2 Cachear los assets de cada juego al precargarlos y verificar que se puede jugar sin conexión

## 6. Contenido: 3 minijuegos de ejemplo

- [x] 6.1 Crear 3 juegos hiper-casuales como plugins (mezcla de `lifeModel` retry y time)
- [x] 6.2 Verificar que todos los juegos montan y desmontan sin estado residual
