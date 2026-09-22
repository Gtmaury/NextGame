## Context

Proyecto greenfield (ver `proposal.md - Why`). Restricciones que condicionan el enfoque: hay que poder probar todo en el navegador, los juegos son hiper-casuales y se harán en tandas, el siguiente juego debe precargarse, y la app debe funcionar sin conexión.

## Goals / Non-Goals

**Goals:**
- Una sola base de código web (TypeScript) que corre en el navegador y se puede envolver después en móvil.
- Añadir un juego nuevo sin tocar el feed (interfaz común de "plugin").
- Transición instantánea entre juegos (precarga del juego N+1).
- Funcionamiento offline con service worker.

**Non-Goals:**
- Wrapper móvil nativo (Capacitor) — se hace después del MVP.
- Cobro real de premium e integración real de SDK de anuncios — en el MVP son placeholders lógicos.
- Backend / cuentas de usuario — todo el estado (favoritos, vidas) vive en el cliente para el MVP.

## Decisions

### 1. Stack: Vite + React + TypeScript + Kaplay, PWA
- **Por qué**: cumple "probar en navegador" (dev server con hot-reload), y Kaplay está pensado para minijuegos simples hechos en serie.
- **Alternativas descartadas**: Unity/Godot (pesados, no browser-first), React Native/Flutter (no permite iterar en navegador igual de rápido). Capacitor se reserva como envoltorio futuro sin reescribir código.

### 2. Una sola instancia Kaplay + N escenas
- **Por qué**: Kaplay tiene estado global (audio, input, loops). Crear/destruir una instancia por juego filtra memoria y deja listeners colgados.
- **Alternativa descartada**: una instancia Kaplay por juego (fugas de memoria y audio).
- **Forma**: el runtime crea **una** instancia Kaplay y cada juego registra una escena con `k.scene("<gameId>", ...)`. Entrar a un juego = `k.go("<gameId>")`.

### 3. Feed en React (DOM), juego en canvas Kaplay
- **Por qué**: React es mejor para listas/UI; Kaplay para el bucle de juego. Los dos modos (feed/juego) se separan físicamente: en modo juego se oculta el DOM del feed y se muestra el canvas a pantalla completa.
- **Alternativa descartada**: hacer todo en Kaplay (la UI de listas/favoritos se vuelve tediosa).

### 4. Interfaz común de "plugin" para cada juego
Cada juego es un descriptor TypeScript que cumple una única interfaz:

```
interface MiniGameDef {
  id: string
  title: string
  thumbnail: string
  lifeModel: 'retry' | 'time'      // recurso interno del juego (reintentos o tiempo)
  initialLives: number              // vidas internas iniciales de la partida
  mount(k, callbacks): void         // registra la escena y entra a jugar
  preload(k): Promise<void>         // precarga de assets para el prefetch
}
```

`callbacks` expone `exit()` (volver al feed), `onWin()` y `onLose()` (notificar el resultado). Las vidas internas (`lifeModel`/`initialLives`) deciden ganar o perder dentro de la partida; el pool global de **intentos** lo gestiona el runtime, no el juego. El feed no conoce la lógica interna: solo `mount`/`preload`/`exit` y las señales de resultado.

### 5. Precarga del siguiente juego
- **Por qué**: transición instantánea al hacer swipe.
- **Forma**: el feed se baraja al inicio; cada juego se importa con `import()` dinámico (chunk propio, code-split). Mientras el usuario juega al actual, el runtime hace `import()` y `preload()` del siguiente en la secuencia barajada, en background. Solo se precarga el inmediato siguiente, no todo el catálogo, para no inflar la caché.

### 6. Estado de intentos y guardados en localStorage
- **Por qué**: no hay backend en el MVP y el estado debe funcionar offline.
- **Forma**: `intentos` (contador global) y `guardados[]` (ids de juegos) persistidos en `localStorage`. Las vidas internas de cada juego son efímeras (se reinician al continuar) y viven en la escena, no en `localStorage`.

### 7. Detección de conexión y flujo de recuperación de intentos
- **Por qué**: distinguir "espera 15 s offline" de "anuncio online".
- **Forma**: `navigator.onLine` como señal principal, con fallback a error de fetch. Al perder y querer continuar sin intentos, el flujo es:
  - online → placeholder de anuncio real (se simula la recompensa); el SDK real se conecta después.
  - offline → cuenta regresiva de 15 s con un placeholder de promoción interna de otros juegos; al terminar, se concede 1 intento.
  - premium → ni espera ni anuncio, intentos ilimitados.
- Es el único punto de monetización y ocurre tras perder, nunca interrumpiendo la partida activa.

### 8. Offline con vite-plugin-pwa (Workbox)
- **Por qué**: precaché del shell de la app + caché runtime de assets de juegos, para que funcione sin red.
- **Forma**: el service worker precachea el bundle de la app y las thumbnails; los assets de cada juego se cachean al precargarlos (`preload`).

## Risks / Trade-offs

- **[Fugas/estado residual de Kaplay]** → una sola instancia + un `unmount` de escena explícito (`exit()` siempre limpia antes de volver al feed).
- **[Intentos en localStorage se pueden trucar]** (editar el valor) → aceptable en MVP; al añadir backend/premium real se mueve el estado al servidor.
- **[`navigator.onLine` puede mentir]** (hay conexión pero sin internet) → fallback con error de fetch para decidir offline.
- **[Precargar de más infla la caché]** → solo se precarga el juego inmediatamente siguiente.
- **[Monetización no real en el MVP]** (ads/premium son placeholders) → el diseño del flujo de recompensa ya separa "online vs offline vs premium", así conectar el SDK real no cambia la arquitectura.

## Migration Plan

Greenfield: no hay migración. Despliegue como PWA estática (Vite build + service worker). Rollback = redeploy de la build anterior.

## Open Questions

- Títulos concretos de los 3 minijuegos de ejemplo y de las siguientes tandas (contenido, no arquitectura — no bloquea).
- Proveedor de SDK de anuncios y pasarela de pago de premium (se decide al salir del MVP; los placeholders ya están en su sitio).
