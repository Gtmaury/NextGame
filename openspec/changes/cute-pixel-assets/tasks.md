## 1. Fundación de assets

- [x] 1.1 Crear carpetas `public/assets/sprites` y `public/assets/thumbs` y verificar que Vite sirve un PNG de prueba en `/assets/...`
- [x] 1.2 Generar **style anchor** pixel-art cute (1–2 refs) y documentar paleta/prompt family en un `public/assets/README.md` corto; verificar que el ancla es usable como referencia

## 2. Generar sprites + thumbs (7 juegos)

- [x] 2.1 Generar sprites de `catch`, `tapdot`, `race` (+ thumbs) según inventario del design; verificar silueta limpia y estilo coherente con el ancla
- [x] 2.2 Generar sprites de `dodge`, `jump`, `balance`, `stars` (+ thumbs); verificar el set completo lado a lado (coherencia cute pixel)
- [x] 2.3 Nombrar archivos exactamente como el inventario (`{game}-{role}.png`, `thumbs/{id}.png`) y verificar que todos los paths del design existen en disco

## 3. Integración runtime

- [x] 3.1 Añadir helper de carga (opcional) y `loadSprite` en `preload` de cada juego; verificar que `preloadGame` no falla
- [x] 3.2 Sustituir entidades principales en `mount` por `k.sprite(...)` manteniendo `area`/mecánicas; verificar win/lose y hit detection en smoke manual
- [x] 3.3 Actualizar `meta`/Feed para thumbs imagen; verificar que las 7 cards muestran el thumb pixel y no solo emoji

## 4. Cierre

- [x] 4.1 Recorrer feed + entrar a los 7 juegos; confirmar sprites visibles, thumbs OK, precarga razonable y `npm run build` sin errores
