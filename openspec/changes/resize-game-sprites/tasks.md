## 1. Normalización de sprites

- [x] 1.1 Implementar recorte al bounding box del arte (píxeles no transparentes) en `src/games/assets.ts`, después del magenta keying, y verificar que el sprite recortado tiene el tamaño esperado en una prueba de carga
- [x] 1.2 Reescalar a máx. 64px con `imageSmoothingEnabled = false` en el mismo helper y verificar que el PNG resultante mantiene el pixelado nítido (sin antialias) y dimensiones ≤64px

## 2. Verificación en juego

- [x] 2.1 Ejecutar `npm run dev` y verificar visualmente los 7 juegos (catch, tapdot, race, dodge, jump, balance, stars): ningún elemento ocupa la mayor parte de la pantalla
- [x] 2.2 Ajustar `k.scale` puntual en los juegos donde algún sprite quede desproporcionado tras la normalización y volver a verificar visualmente
- [x] 2.3 Reparar el suelo de `jump`: tiles continuos (paso 62px, 9 tiles) y wrap modular sin desfase de fase; verificar con `tsc --noEmit` y revisión visual del juego Salto
- [x] 2.4 Reparar la caída en `jump`: el jugador no se caía en los huecos porque el snap-back al suelo se aplicaba también sobre un hueco; verificar con `tsc --noEmit` que el jugador cae y pierde vida al pasar por un hueco
- [x] 2.5 Evitar perder 2 vidas por caída en el mismo hueco de `jump`: marcar `fell` el hueco que mató y saltarlo en el check; verificar con `tsc --noEmit` que cada hueco cuesta como máximo 1 vida
- [x] 2.6 Pulir `jump`: quitar el elemento rojo dentro de los huecos (quedan vacíos), manejar el pozo con un Map sin recrearlo cada frame (sin parpadeo) y fade-in del jugador al reaparecer; verificar con `tsc --noEmit`
- [x] 2.7 Suelo de `jump` como bloquesitos separados (paso 110, 6 tiles) con wrap uniforme (span = múltiplo exacto del paso) en vez de un bloque continuo; verificar con `tsc --noEmit`
- [x] 2.8 Quitar el rectángulo violeta de fondo del suelo de `jump` para que los bloquesitos queden sobre el fondo del juego (sin franja azul); verificar con `tsc --noEmit`
- [x] 2.9 Plataforma continua en `jump`: tiles edge-to-edge (paso 61 = ancho del tile, 9 tiles, span 549) cubriendo toda la superficie de caminata; verificar con headless Chrome + análisis de píxeles

## 3. Animación de personajes y elementos

- [x] 3.1 Helper compartido `src/games/fx.ts` con `burst()` (pop: escala + fade + spin opcional, autodestrucción con guard `exists()`, tag del juego para cleanup)
- [x] 3.2 `jump`: squash & stretch (aterrizaje, salto, caída) + bob de correta en suelo (`landT`/`animT`, `PLAYER_SCALE`); verificar con `tsc --noEmit`
- [x] 3.3 `catch`: pop-in de fruta + balanceo (`angle`), burst al atrapar + squash de paleta (tween de vuelta); verificar con `tsc --noEmit`
- [x] 3.4 `tapdot`: pulso del objetivo con rampa de aparición + parpadeo/urgencia cuando `ttl < 0.45`, burst al tocar; verificar con `tsc --noEmit`
- [x] 3.5 `race`: pulso del objetivo + urgencia cuando `remaining < 3`, burst al tocar; verificar con `tsc --noEmit`
- [x] 3.6 `dodge`: inclinación del jugador según movimiento (`angle` ±14°), bob de correta, squash al recibir golpe, pop-in + tambaleo de bloques y burst en la colisión; verificar con `tsc --noEmit`
- [x] 3.7 `stars`: estrella con spin (120°/s) + pulso, titileo de estrellas de fondo (28, fase aleatoria), burst con spin 720°/s al tocar; verificar con `tsc --noEmit`
- [x] 3.8 `balance`: aguja que se inclina según el marcador (`angle` ±28°) + temblor fuera de la zona, pulso de la zona al puntuar (`zonePop`); verificar con `tsc --noEmit`
- [x] 3.9 Verificación headless de los 7 juegos: montar cada juego sin `pageerror` y confirmar que hay animación comparando dos capturas separadas ~350ms

## 4. Miniaturas del feed

- [x] 4.1 Quitar el fondo fucsia de las miniaturas: `processedThumbUrl()` en `src/games/assets.ts` (keying magenta + recorte al bounding box + downscale 256px nearest-neighbor, cache por URL) reutilizado por `GameThumb.tsx`; refactor de `normalizeSprite` extrayendo `keyOutMagenta`/`artBounds`; verificar con `tsc --noEmit` y análisis de píxeles en headless (0 píxeles fucsia en el feed)
