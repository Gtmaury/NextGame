## 1. Fundación HUD + temas

- [x] 1.1 Crear `src/games/hud.ts` (helper de HUD con `set`/`destroy`, tipografía y colores de marca) y verificar que se puede instanciar desde un juego de prueba mental / import sin errores de TypeScript
- [x] 1.2 Definir mapa de temas por `gameId` (bg + acentos) en el mismo módulo o `src/games/themes.ts` y verificar que los 7 ids tienen entrada + default

## 2. Tanda MVP (catch, tapdot, race)

- [x] 2.1 Aplicar tema + HUD + cleanup de background en `catch.ts`; verificar vidas/score legibles y atmósfera distinta
- [x] 2.2 Aplicar tema + HUD en `tapdot.ts`; verificar hint/gesto y win/lose intactos
- [x] 2.3 Aplicar tema + HUD en `race.ts`; verificar tiempo/score y background reset al salir

## 3. Tanda nueva (dodge, jump, balance, stars)

- [x] 3.1 Pulir `dodge.ts` (tema alerta, HUD retry, obstáculos/player con paleta propia) y verificar distinción vs catch
- [x] 3.2 Pulir `jump.ts` (cielo/suelo temáticos, HUD, huecos visibles) y verificar que ya no se ve “lienzo negro genérico”
- [x] 3.3 Pulir `balance.ts` y `stars.ts` (temas zen/cosmos, HUD time) y verificar win/lose + hints

## 4. Verificación

- [x] 4.1 Entrar a los 7 juegos, confirmar HUD legible y fondos/paletas distintos entre sí; salir y confirmar que no queda background “sucio”; `npm run build` OK
