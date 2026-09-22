## Why

Los usuarios quieren entretenerse en sesiones cortas e interactivas, como hacen con TikTok, pero con contenido que se juega en lugar de mirarse. Los minijuegos hiper-casuales encajan perfecto, pero no existe un producto que los presente en un feed vertical deslizable con mecánicas de retención (intentos, "guardados", precarga de juegos) y que además funcione sin conexión.

## What Changes

- Nueva app **web (PWA)** con un feed vertical de minijuegos estilo TikTok, con **orden aleatorio**.
- Dos modos de interacción separados: **feed** (swipe vertical entre juegos) y **juego** (tap para entrar, swipe deshabilitado, botón para salir). Esto elimina el conflicto entre el gesto de scroll y el gesto de jugar.
- Lista de **"guardados"** para guardar juegos y jugarlos después.
- Arquitectura de juegos como **plugins**: cada juego es una escena Kaplay que cumple una interfaz común, de modo que añadir un juego no toca el feed.
- **3 minijuegos** de ejemplo, sencillos e hiper-casuales, entendibles en segundos (las tandas siguientes se añaden en cambios posteriores).
- **Precarga** del siguiente juego para una transición instantánea entre juegos.
- **Sistema de dos capas** para la economía:
  - **Vidas del juego** (internas): cada juego define su propio recurso (reintentos o tiempo) que decide si ganas o pierdes. No se mezclan ambos significados en un mismo juego.
  - **Intentos** (pool global, estilo Candy Crush): se gasta 1 solo para **continuar** tras perder. Navegar, deslizar y ganar son gratis.
- **Recuperación de intentos** (único punto de monetización): al morir sin intentos, el usuario espera 15 s (offline: se muestra una promoción interna de otros juegos) o ve un anuncio real (online) para obtener un intento.
- **Modo premium** (intentos ilimitados, sin anuncios). Para el MVP se implementa como flag lógico; el cobro real queda fuera de alcance.
- **Funciona offline**: un service worker cachea juegos y assets para jugar sin conexión.

## Capabilities

### New Capabilities
- `game-feed`: el feed vertical con orden aleatorio, los modos feed/juego, la lista de "guardados" y la precarga del siguiente juego.
- `game-runtime`: la interfaz común de "plugin" que todo juego debe cumplir y la señal de ganar/perder para la economía.
- `lives`: el sistema de dos capas (vidas del juego + intentos globales) y la economía de recuperación de intentos (espera, anuncio online, promoción offline, premium).
- `offline`: la disponibilidad sin conexión (service worker, cacheo de juegos y assets).

### Modified Capabilities
<!-- Ninguna: proyecto greenfield. -->

## Impact

- **Stack**: Vite + TypeScript + React (UI del feed) + Kaplay (juegos), PWA con service worker.
- **Repo**: proyecto nuevo (greenfield); no hay código previo que migrar.
- **Alcance fuera de MVP**: wrapper móvil (Capacitor), integración real de SDK de anuncios, cobro real de premium, promoción en vídeo de otros juegos (se sustituye por un placeholder de 15 s), y el resto de juegos hasta llegar a ~15.
