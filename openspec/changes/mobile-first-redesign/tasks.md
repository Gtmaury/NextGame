## 1. Skills y dirección visual

- [x] 1.1 Confirmar skills obligatorias disponibles (`redesign-existing-projects`, `frontend-design`, `high-end-visual-design`, `web-design-guidelines`) y opcionalmente instalar `ux`, `game-feel` o `design-game` según `design.md` — verificar que los `SKILL.md` existen en las rutas esperadas
- [x] 1.2 Fijar acento del tema (ámbar / coral / lima desaturada) y documentarlo en un comentario breve junto a los tokens en `src/index.css` — verificar que no queda el púrpura `#8b5cf6` como acento primario

## 2. Sistema visual y viewport móvil

- [x] 2.1 Renovar tokens en `:root` (colores, radios, sombras, motion) según dirección “arcade nocturno cálido” y verificar en DevTools que las variables nuevas se aplican a `body` y `.app`
- [x] 2.2 Cargar tipografía display + body (no Inter/Roboto/system-only) con `font-display: swap` y verificar que títulos/cuerpo usan esas familias en el feed
- [x] 2.3 Aplicar `min-height: 100dvh` y padding con `--safe-*` en shell/feed/chrome; verificar en viewport estrecho (≤390px) que header y tabs no quedan bajo notch/home indicator
- [x] 2.4 Añadir reglas `prefers-reduced-motion` para transiciones decorativas y verificar que con la preferencia activa las animaciones se reducen u omiten

## 3. Shell: feed, guardados y chrome

- [x] 3.1 Rediseñar header y tabs (densidad móvil, contraste, tabs ≥44px) y verificar en portrait que intentos/premium siguen visibles y las tabs son tappeables
- [x] 3.2 Rediseñar cards del feed (thumb dominante, título, guardar, “Jugar” sin hover) a altura útil de una card por viewport en ≤768px — verificar swipe entre cards y tap en Jugar/guardar
- [x] 3.3 Alinear lista de guardados al mismo sistema visual/fallbacks y verificar coherencia visual con las cards del feed
- [x] 3.4 Reubicar control de salida de partida a zona pulgar (inferior) con target ≥44px y verificar que sale al feed sin romper gestos

## 4. Overlays

- [x] 4.1 Rediseñar overlays win/lose/recovery/premium en columna móvil (jerarquía + botones anchos ≥44px) y verificar legibilidad y acciones en viewport ≤390px
- [x] 4.2 Verificar contraste de texto primario de overlays sobre el fondo (lectura clara sin zoom)

## 5. HUD in-game Kaplay

- [x] 5.1 Ajustar o crear helper compartido de chips HUD (paleta/tipografía/posición móvil) y verificar que al menos un juego lo consume sin cambiar mecánicas
- [x] 5.2 Aplicar el HUD alineado en los 7 minijuegos y verificar en portrait que score/vidas/tiempo son legibles y no tapan la zona de acción inferior cuando aplica
- [x] 5.3 Comprobar continuidad visual feed → partida (mismos acentos/contraste de chrome) en al menos 2 juegos distintos

## 6. QA mobile y cierre

- [x] 6.1 Pasar checklist de `web-design-guidelines` (touch, contraste, reduced-motion) y corregir hallazgos bloqueantes
- [x] 6.2 Smoke manual en viewport móvil: feed swipe, jugar, perder/ganar, recovery, salir, guardados — verificar que no hay regresiones de gestos ni economía
- [x] 6.3 Ejecutar `npm run build` y verificar que TypeScript/Vite build termina sin errores
