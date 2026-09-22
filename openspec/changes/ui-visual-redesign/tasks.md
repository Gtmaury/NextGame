## 1. Foundation visual

- [x] 1.1 Definir tokens CSS en `:root` dentro de `src/index.css` (colores, radios, tipografía, sombras, safe-area) y verificar que body/app consumen las variables
- [x] 1.2 Añadir soporte `prefers-reduced-motion` (desactivar o reducir keyframes) y verificar que con la preferencia activa las animaciones no desplazan contenido de forma agresiva

## 2. Shell: feed y guardados

- [x] 2.1 Rediseñar header (brand, tabs segmented, chip premium) y verificar contraste y layout en viewport móvil (~390px)
- [x] 2.2 Actualizar markup/clases de `GameCard` (panel, variante por `id`, tipografía) y estilos de card/gradiente; verificar que cada juego del catálogo tiene apariencia diferenciada o fallback
- [x] 2.3 Rediseñar lista de guardados y estado vacío; verificar que guardar/quitar sigue funcionando y se ve coherente con el feed

## 3. Chrome de juego y overlays

- [x] 3.1 Rediseñar botón de salida y overlays de victoria/derrota/recuperación (primario vs secundario, blur/fallback); verificar win y lose muestran CTAs claras
- [x] 3.2 Añadir motion de entrada de card y de overlay (~200ms) sin alterar swipe/tap; verificar swipe ↑↓ y tap-para-jugar siguen iguales

## 4. Verificación

- [x] 4.1 Recorrer feed (7 juegos), guardados, entrar/salir, win y lose en desktop y viewport móvil; verificar coherencia visual y que `npm run build` termina OK
