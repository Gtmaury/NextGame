## Context

La shell React vive en `Feed.tsx` / `GamePlayer.tsx` con estilos monolíticos en `src/index.css` (dark plano `#0f0f1a`, acento `#7c5cff`, system-ui). Ver `proposal.md` — Why. El feed vertical y el modo juego no se tocan a nivel de lógica; solo presentación.

## Goals / Non-Goals

**Goals:**
- Tokens CSS (`:root`) como única fuente de color/tipo/espacio.
- Look “arcade cinematic”: oscuro profundo, acento neón, cards con gradiente por juego o por slot.
- Overlays y chrome (exit, tabs, premium) alineados al mismo sistema.
- Markup mínimo extra (wrappers / clases) solo donde el CSS no alcanza.

**Non-Goals:**
- Librería de componentes (no MUI/Chakra).
- Rediseño del HUD canvas dentro de Kaplay.
- Nueva IA de navegación (bottom nav, rutas).
- Ilustraciones o assets raster pesados.

## Decisions

### 1. Design tokens en CSS variables

```css
:root {
  --bg-deep: #07070f;
  --bg-elevated: #141428;
  --accent: #8b5cf6;
  --accent-hot: #f472b6;
  --warn: #fbbf24;
  --text: #f8fafc;
  --text-muted: #94a3b8;
  --radius-lg: 20px;
  --radius-pill: 999px;
  --font-display: "Segoe UI", system-ui, sans-serif;
  --shadow-glow: 0 0 40px rgba(139, 92, 246, 0.35);
}
```

- **Por qué**: un solo archivo CSS ya concentra la UI; variables evitan hardcodes y permiten retocar la paleta sin cazar selectores.
- **Alternativa descartada**: Tailwind — overhead y migración grande para una shell pequeña.

### 2. Tipografía: system stack curada (sin dependencia de red)

Display/titles con peso 700–800; body 400–500. No cargar Google Fonts en el MVP del rediseño para no romper offline/PWA.

- **Alternativa**: Inter/Outfit vía CDN — mejor look, peor offline; se puede añadir después como mejora.

### 3. Cards: gradiente + glow + tipografía grande

Cada card usa un panel centrado (no solo emoji flotante): thumbnail grande, título display, chip de “Guardar”, hint inferior sutil. Fondo de card = gradiente radial/linear distinto por `id` (mapa CSS o clase `card--{id}`) para que el swipe se sienta variado.

- **Por qué**: diferencia visual inmediata entre juegos sin assets.
- **Alternativa**: un solo gradiente genérico — más simple, menos “catálogo vivo”.

### 4. Overlays: glass / blur + botones primario/secundario

`backdrop-filter: blur` + fondo semitransparente; CTA primario con `--accent`, secundario outline/elevated. Entrada con `@keyframes` fade+scale cortos (~180–220ms).

### 5. Header compacto tipo app

Brand con wordmark estilizado; tabs como segmented control; premium como chip dorado cuando activo. Safe-area padding (`env(safe-area-inset-*)`) para notch.

### 6. Markup: tocar solo lo necesario

Preferir CSS puro sobre `index.css`. Añadir clases en JSX solo para: variantes de card por `id`, estructura de overlay actions, y posiblemente un wrapper `.card-panel`.

## Risks / Trade-offs

- **[`backdrop-filter` en algunos Android]** → degradar a fondo sólido oscuro opaco.
- **[Gradientes por juego desalineados con nuevos ids]** → clase fallback `card--default` si falta variante.
- **[Motion mareante]** → duraciones cortas; respetar `prefers-reduced-motion: reduce` (animaciones = none / opacity only).
- **[Alcance creep hacia rediseñar Kaplay HUD]** → explícitamente fuera; solo shell React.

## Migration Plan

Sustituir estilos en `index.css` + clases puntuales; deploy PWA estático. Rollback = build anterior. Sin migración de datos.

## Open Questions

- Ninguna bloqueante; la paleta exacta se puede afinar en apply sin cambiar requisitos.
