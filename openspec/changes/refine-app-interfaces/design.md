## Context

La shell vive en `Feed.tsx`, `GamePlayer.tsx` e `index.css`. Ver `proposal.md` — Why. Ya existe un sistema de tokens CSS y cards con gradiente por `card--{id}`, pero faltan PNG en `public/assets/` (thumbs/sprites referenciados en código), el header no muestra intentos, no hay CTA "Jugar" explícito, y los overlays conservan copy de placeholder. La economía (`attempts.ts`, `premium.ts`) ya funciona; solo falta exponerla en UI.

## Goals / Non-Goals

**Goals:**
- Recomponer feed card: thumb → título → fila de acciones (Guardar + Jugar primario).
- Badge de intentos / premium en header, leyendo `getAttempts()` e `isPremium()`.
- Componente o patrón `GameThumb` con `onError` → fallback (div con iniciales + clase `thumb--{id}`).
- Pulir overlays: quitar "[ Anuncio real — placeholder ]", estructurar stats en `.overlay-stats`.
- Transición feed↔juego vía clase en `.app` (`.app--playing`) + opacity/transform en `.feed-screen`.
- Alinear `.saved-row` con variante de color por `id` (reutilizar mapa de gradientes o borde acento).

**Non-Goals:**
- Rediseñar HUD Kaplay (`hud.ts`, canvas).
- Añadir librería UI (Radix, MUI).
- Integrar SDK de anuncios real.
- Cambiar lógica de swipe, precarga o registro de juegos.

## Decisions

### 1. CTA "Jugar" además del tap en card

Mantener tap en card para entrar (gesto TikTok) **y** añadir botón primario "Jugar" en `.card-panel`.

- **Por qué**: reduce ambigüedad con el botón Guardar; mejora affordance en desktop y usuarios nuevos.
- **Alternativa descartada**: quitar tap — rompe el gesto actual del feed.

### 2. Intentos en header como chip compacto

Nuevo elemento `.attempts-chip` entre tabs y premium: `⚡ N` o `∞` si premium.

- **Por qué**: visible sin abrir overlay; no requiere nueva pantalla.
- **Alternativa**: FAB flotante — compite con hint de swipe.

### 3. Fallback de thumbnail en React, no en servidor

`<img onError>` cambia a `<div class="thumb-fallback thumb-fallback--{id}">` con iniciales (2 letras del título).

- **Por qué**: funciona offline/PWA; no depende de generar PNG en build.
- **Alternativa**: SVG data-URI por juego en `meta.ts` — más mantenimiento; reservado si el fallback CSS no basta.

### 4. Transición con clase en `App.tsx`

`playingId !== null` → `className="app app--playing"`; CSS oculta `.feed-screen` con `opacity: 0; pointer-events: none` y opcional `scale(0.98)`.

- **Por qué**: un solo punto de verdad; no duplicar estado en Feed.
- **Duración**: 220ms, alineada a `--motion`.

### 5. Overlays: panel con sección de stats

Estructura:

```
.overlay-panel
  h2 (resultado)
  .overlay-stats (puntuación, récord, intentos)
  .overlay-actions (botones)
```

Recovery online: título "Ver anuncio", subtítulo breve, botón "Continuar (+1 intento)" — sin corchetes de dev.

### 6. Menos glass, más superficie sólida

Reducir `backdrop-filter` en `.card-panel` donde compite con thumbs pixel; fondo `--bg-elevated` sólido con borde acento sutil.

- **Por qué**: thumbs pixel y glass morphism juntos se ven "baratos"; superficie sólida + glow acotado eleva percepción.
- **Trade-off**: menos "cinematic blur", más legibilidad.

### 7. Verificar assets en apply

Tarea explícita: comprobar `public/assets/thumbs/*.png` y `sprites/*.png`; si faltan, documentar en README o generar mínimos — el fallback cubre UX pero el look deseado requiere PNG.

## Risks / Trade-offs

- **[Doble entrada tap + botón]** → ambos llaman `onEnter(id)`; `stopPropagation` en botones internos.
- **[Header más cargado]** → chip de intentos compacto; en viewport estrecho reducir padding brand.
- **[Transición + Kaplay mount]** → transición solo en shell; canvas ya montado debajo evita flash negro.
- **[Fallback vs arte real]** → sin PNG el producto sigue usable pero menos atractivo; apply debe incluir assets si existen en otro branch/artefacto.

## Migration Plan

Cambios solo en shell CSS/TSX; deploy PWA estático. Sin migración de `localStorage`. Rollback = revertir commit.

## Open Questions

- ¿Preferencia estética concreta del usuario (más minimalista vs más arcade/neón)? Se puede afinar paleta en apply sin cambiar requisitos.
- ¿Los PNG de `cute-pixel-assets` existen fuera del repo y deben copiarse en apply?
