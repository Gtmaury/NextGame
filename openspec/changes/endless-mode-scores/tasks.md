# Tasks: endless-mode-scores

## 1. Contrato y runtime

- [x] 1.1 `src/types.ts`: eliminar `onWin` de `GameCallbacks` y hacer `onLose(score)` obligatorio; verificar con `tsc --noEmit`
- [x] 1.2 `src/components/GamePlayer.tsx`: quitar estado/overlay `won` y el handler `onWin`; toda derrota registra puntuación y muestra Puntuación/Récord; verificar con `tsc --noEmit`

## 2. Modo infinito por juego

- [x] 2.1 `catch`: tope de velocidad 640, piso de spawn 0.25, HUD con `Nv X` + `N pts` (sin `/goal`); verificar con `tsc --noEmit`
- [x] 2.2 `tapdot`: sin WIN; TTL `max(0.45, 1.2 - score*0.04)`; `onLose(score)`; HUD con nivel y puntos totales
- [x] 2.3 `race`: reloj inicial 8s con recarga `max(0.6, 1.6 - score*0.03)` por acierto y radio `max(30, 56 - score)`; fin solo por reloj a cero con `onLose(score)`
- [x] 2.4 `dodge`: sin WIN; velocidad hasta 620, spawn hasta 0.25; HUD con nivel y puntos totales
- [x] 2.5 `jump`: sin WIN; velocidad `min(180 + score*10, 460)` y huecos más frecuentes; HUD con nivel y puntos totales
- [x] 2.6 `balance`: sin DURATION/WIN; zona `max(20, 48 - score*1.5)` y fuerzas crecientes; derrota solo por 1.2s fuera de zona
- [x] 2.7 `stars`: reloj 8s con recarga por estrella y TTL de escape `max(1.3, 3 - score*0.06)`; fin solo por reloj a cero con `onLose(score)`
- [x] 2.8 `stars`: señuelos (estrellas rojas, tinte `color(235,70,105)`) que aparecen desde 4 puntos (`min(4, floor(score/4))`, separados ≥120px de la estrella); tocarlos penaliza −2s con flash rojo; verificar con `tsc --noEmit` y headless (clic en estrella dorada por análisis de píxeles → aparece señuelo → clic en señuelo → flash +26 de dominancia roja)

## 3. Tabla de récords

- [x] 3.1 Pestaña "Récords" en `Feed.tsx`: lista ordenada por récord desc (thumb, título, puntaje, 🏆 al primero > 0, `—` si 0)
- [x] 3.2 Chip `Récord: X` en la card del feed, refrescado al volver del juego
- [x] 3.3 Estilos en `index.css` (`.scores-list`, `.score-row`, `.record-chip`) siguiendo el patrón de `saved-list`

## 4. Verificación

- [x] 4.1 `tsc --noEmit` sin errores
- [x] 4.2 Headless: montar cada juego sin `pageerror`; ninguna partida termina por umbral (tapdot: perder 3 vidas → overlay con Puntuación/Récord)
- [x] 4.3 Headless: tras registrar puntuación, la pestaña "Récords" muestra la tabla ordenada con el récord actualizado

## 5. Caos progresivo

- [x] 5.1 `fx.ts`: `burst()` con tinte opcional y `alarm()` (flash rojo + `k.shake`) reutilizables
- [x] 5.2 `catch`: viento (balanceo sinusoidal que crece con el nivel), bombas rojas desde nivel 3 (atraparlas cuesta 1 vida, dejarlas caer no) y multi-spawn (2 frutas desde nivel 5, 3 desde nivel 9)
- [x] 5.3 `tapdot`: punto errante (velocidad y giros aleatorios crecientes, rebote en márgenes), se encoge con el puntaje, y señuelos rojos desde 6 puntos (1/2/3) que cuestan 1 vida al tocarlos
- [x] 5.4 `race`: blanco errante (velocidad creciente) y señuelos rojos desde 5 puntos (1/2/3) que restan 1.5s al tocarlos
- [x] 5.5 `dodge`: bloques con deriva sinusoidal creciente, factor de velocidad aleatorio por bloque (±20%), homing parcial desde 8 puntos (vx fijo hacia el jugador) y doble spawn desde 15
- [x] 5.6 `jump`: huecos más anchos con el puntaje (hasta 190px) y pájaros voladores desde 6 puntos (a nivel del suelo obligan a saltar; altos castigan saltar) con separación decreciente; `fall()` despeja pájaros cerca del respawn
- [x] 5.7 `balance`: zona segura deslizante (amplitud hasta 60px, desde 4 puntos) y ráfagas aleatorias que empujan la aguja (desde 8 puntos, cada 2-4s)
- [x] 5.8 `stars`: señuelos hasta 6 (`floor(score/3)`) ahora a la deriva (rebote en márgenes, velocidad creciente)
- [x] 5.9 Verificación headless: 7 juegos montan/animan sin `pageerror`; E2E estrellas (clic ×4 en estrella errante → señuelo a la deriva → clic → flash +28.7 + penalización)

## 6. Diferenciar Contrarreloj y Estrellas

- [x] 6.1 `stars` reescrito como lluvia de estrellas: múltiples estrellas doradas cayendo (velocidad/viento/cadencia ramp), tocarlas suma reloj, dejarlas caer cuesta −1s (parpadeo de última oportunidad cerca del suelo), meteoros rojos mezclados (desde 4 pts, hasta 40%) que penalizan −2s al tocarlos; sin TTL ni señuelos estáticos
- [x] 6.2 `race` sin señuelos rojos: queda como juego de precisión pura (un blanco errante que se encoge, radio de acierto decreciente, urgencia < 3s)
- [x] 6.3 Verificación headless: E2E lluvia (blobs dorados descendiendo, 7 capturas, meteoro detectado y tocado → flash +26.8) y 7 juegos sin `pageerror`

## 7. Economía de tiempo y emboscadas laterales (Estrellas)

- [x] 7.1 Capturas más generosas: +`max(0.7, 1.3 - score*0.025)`s (tope de reloj 15s) y popup flotante "+Xs / -Xs" en cada evento de reloj
- [x] 7.2 Combo: aciertos consecutivos suman +0.1s cada uno (hasta +1s); se corta al dejar caer una dorada o tocar un meteoro (HUD muestra `xN` desde combo 3)
- [x] 7.3 Estrella bonus (12% desde 2 pts): grande (x1.35), con anillo dorado, cae más lento y vale +2s extra
- [x] 7.4 Emboscadas laterales: desde 6 pts, estrellas doradas entran desde los bordes izquierdo/derecho en diagonal (hasta 45%) y rebotan en los muros
- [x] 7.5 Verificación headless: E2E lluvia (22 capturas, 7 popups "+Xs", 2 bonus, blob lateral en borde, meteoro → flash +28.8) sin `pageerror`

## 8. Salto: control vertical, sin pájaros, suelo único

- [x] 8.1 Pájaros rosados eliminados (penalización instantánea injusta)
- [x] 8.2 Control vertical en el aire: mantener pulsado = empuje hacia arriba (vy hasta -560, techo de vuelo), soltar = caer; combustible de 1.3s que drena al empujar y se recarga en el suelo (barra dorada bajo el HUD)
- [x] 8.3 Suelo: una sola franja `jump-ground` con `tiled: true` (una sola pieza continua, sin costuras); huecos hasta 240px
- [x] 8.4 Hint actualizado: "Toca para saltar · mantén para subir, suelta para bajar"
- [x] 8.5 Verificación headless: E2E Salto (sube 679→166 al mantener, vuelve a 680 al soltar, combustible 112→49→112, fila del suelo sin fugas de fondo, 0 píxeles rosas) y 7 juegos sin `pageerror`
