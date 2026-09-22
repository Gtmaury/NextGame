# Design: endless-mode-scores

## Contexto

Los 7 minijuegos compartían el patrón "alcanza X puntos → ¡Ganaste!" (tapdot 8, race 10 en 20s, dodge 12, jump 8, balance 8 en 20s, stars 10 en 20s; catch ya era por niveles sin fin). El overlay de victoria corta la partida justo cuando la dificultad empezaba a subir. `runtime/highscore.ts` ya guarda el récord por juego en localStorage, pero no hay UI para verlo (solo el overlay de derrota lo muestra).

## Objetivos

1. Partidas infinitas: solo perder (vidas o tiempo) termina la partida.
2. Dificultad que escala de forma continua y perceptible, con nivel visible (`Nv`).
3. Tabla de récords accesible desde el feed.

## Decisiones

### D4.1 Señal de fin única

`GameCallbacks` queda como `{ exit, onLose(score) }` (score obligatorio). Se elimina `onWin`, el estado `won` y su overlay en `GamePlayer`. Toda partida termina con puntuación; la economía de intentos (continuar/anuncio/espera/premium) se activa igual que antes.

### D4.2 Modelo de dificultad por juego

Un `level` derivado del puntaje (`1 + floor(score / N)`, N entre 5 y 8 según juego) se muestra en el HUD (`label`) y alimenta las curvas. Todas las curvas son acotadas por mínimos jugables pero sin techo de "fin de partida":

| Juego | Curva de dificultad | Caos progresivo |
|---|---|---|
| catch | ya infinito: nivel = goal creciente; tope de velocidad 640, piso de spawn 0.25 | viento sinusoidal creciente, bombas rojas (nivel 3+, atrapar = −1 vida), multi-spawn (nivel 5/9) |
| tapdot | TTL por punto: `max(0.45, 1.2 - score*0.04)`; fallo cuesta vida | punto errante que se encoge; señuelos rojos (6/10/14 pts) que cuestan vida |
| race | reloj inicial 8s; acierto suma `max(0.6, 1.6 - score*0.03)`; radio de acierto `max(30, 56 - score)` | blanco errante (precisión pura, sin señuelos) |
| dodge | velocidad `min(220 + score*18, 620)`; spawn `max(0.25, 0.85 - score*0.03)` | deriva sinusoidal, velocidad ±20% por bloque, homing parcial (8+), doble spawn (15+) |
| jump | velocidad `min(180 + score*10, 460)`; huecos más frecuentes con el puntaje | huecos más anchos (hasta 240px); sin pájaros: control vertical en el aire (mantener = empuje con combustible 1.3s recargable en suelo, soltar = caer, techo de vuelo); suelo = una sola franja tileada continua |
| balance | sin tope de tiempo; zona `max(20, 48 - score*1.5)`; fuerzas crecen con el puntaje | zona deslizante (4+, hasta 60px); ráfagas aleatorias (8+, cada 2-4s) |
| stars | lluvia de estrellas: reloj 8s (tope 15s), dorada atrapada +`max(0.7, 1.3 - score*0.025)` + bonus de combo (+0.1s por acierto consecutivo, hasta +1s), estrella bonus grande +2s extra, popups "+Xs/-Xs" visibles; dorada al suelo -1s (corta combo) | múltiples estrellas cayendo (velocidad/viento/cadencia ramp, parpadeo de rescate cerca del suelo); meteoros rojos (4+ pts, hasta 40%) -2s al tocarlos (alarm); emboscadas laterales desde los bordes (6+ pts, hasta 45%) que rebotan en muros |

### D4.3 Contrarreloj sin fin

race y stars conservan `lifeModel: 'time'` (perder = reloj a cero), pero el reloj se recarga al acertar: la partida dura mientras el jugador mantenga el ritmo. balance pierde el reloj global y mantiene la derrota por 1.2s fuera de zona.

### D4.4 Tabla de récords

- Pestaña "Récords" en el header del feed (mismo patrón que Jugar/Guardados): lista ordenada por récord desc, thumb + título + puntaje (`—` si 0), 🏆 en el primero con puntaje > 0.
- Chip `Récord: X` en la card del feed (se refresca al volver del juego porque `playingId` re-renderiza Feed).
- El overlay de derrota ya muestra Puntuación/Récord/🏆: al eliminar `onWin`, todas las partidas pasan por ahí.

### D4.5 HUD

`HudState` no cambia: el nivel se muestra con `label` (`Nv X`) y el puntaje total como `score` (`N pts`), sin umbral visible (`score/goal` desaparece).

## Riesgos

- Curvas demasiado agresivas → jugabilidad imposible: todos los parámetros tienen pisos (TTL ≥ 0.45s, radio ≥ 30px, spawn ≥ 0.25s).
- Pérdida de identidad "contrarreloj" en race/stars → se mantiene el reloj visible y su urgencia (< 3s), solo cambia la recarga.
