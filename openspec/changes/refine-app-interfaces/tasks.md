## 1. Thumbnail fallback y assets

- [x] 1.1 Crear componente `GameThumb` (img + fallback con iniciales y clase `thumb-fallback--{id}`) y verificar que al simular `onError` se muestra placeholder en lugar de icono roto
- [x] 1.2 Sustituir `<img>` en `GameCard` y `SavedList` por `GameThumb` y verificar feed y guardados con thumbs válidos y con URL rota
- [x] 1.3 Auditar `public/assets/thumbs/` y `public/assets/sprites/`; copiar o generar PNG faltantes según `assets.ts` y verificar que las imágenes cargan en `npm run dev`

## 2. Header e intentos

- [x] 2.1 Añadir `.attempts-chip` en `Feed.tsx` leyendo `getAttempts()` / `isPremium()` y verificar que el contador o ∞ aparece en el header del feed
- [x] 2.2 Actualizar el chip al volver de partida o togglear premium y verificar que el número refleja gastos de intento tras Continuar

## 3. Composición del feed

- [x] 3.1 Añadir botón primario "Jugar" en `GameCard` (además del tap en card) con `stopPropagation` y verificar que entra al juego sin disparar swipe
- [x] 3.2 Reorganizar `.card-panel` (thumb → título → fila Guardar + Jugar) y ajustar CSS para jerarquía clara en viewport móvil (~375px)
- [x] 3.3 Suavizar `.card-panel` (menos glass, fondo `--bg-elevated` sólido) y verificar legibilidad del título sobre el fondo

## 4. Transición feed ↔ juego

- [x] 4.1 Añadir clase `app--playing` en `App.tsx` cuando `playingId` está activo y verificar transición de opacidad del feed al entrar/salir
- [x] 4.2 Confirmar que swipe en feed y botón ✕ de salida siguen funcionando tras la transición

## 5. Overlays

- [x] 5.1 Reestructurar overlays en `GamePlayer.tsx` con `.overlay-stats` (puntuación, récord, intentos) y verificar derrota muestra los tres datos cuando hay score
- [x] 5.2 Reemplazar copy de placeholder en recovery online/offline por textos de producto y verificar que no queda texto "[placeholder]" visible
- [x] 5.3 Ajustar estilos de `.overlay-panel` y botones para jerarquía primario/secundario clara

## 6. Lista de guardados

- [x] 6.1 Aplicar variante visual por juego en `.saved-row` (borde/acento `saved-row--{id}`) y verificar coherencia con la card del mismo título en el feed

## 7. Verificación final

- [x] 7.1 Ejecutar `npm run build` sin errores TypeScript
- [x] 7.2 Revisar manualmente feed → jugar → perder → continuar → salir en desktop y viewport móvil; confirmar `prefers-reduced-motion` desactiva animaciones
