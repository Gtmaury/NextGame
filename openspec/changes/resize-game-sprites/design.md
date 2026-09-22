## Context

Los PNG en `public/assets/sprites/` son 1024×1024 (instalados por `scripts/install-sprites.mjs`) con arte pixel de ~350-600px centrado y fondo magenta (#FF00FF). `src/games/assets.ts` ya keyea el magenta a transparente en runtime, pero registra el sprite completo en KAPLAY, que lo dibuja a tamaño natural en el mundo de 480×720 → elementos gigantes.

## Goals / Non-Goals

**Goals:**
- Normalizar todo sprite en un único punto: `loadGameSprites` (todos los juegos pasan por él).
- Preservar el arte actual y su estilo pixel nítido.
- Mantener las escalas por juego (`k.scale(0.85–1.15)`) significativas para tamaños chicos.

**Non-Goals:**
- Regenerar arte, cambiar nombres de sprites, tocar thumbs, economía, PWA ni `runtime/*`.

## Decisions

**D1 — Recortar al bounding box + reescalar a máx. 64px en `assets.ts`, en lugar de pasar `width/height` en cada `k.sprite()`.**
- `sprite(name, { width, height })` estira el PNG completo (márgenes incluidos), dejando tamaño visible impredecible y requiriendo tocar 7 archivos.
- El bounding box recorta márgenes transparentes: el sprite registrado mide ~40-64px y los `k.scale` existentes (0.85–1.15) dan 34-74px visibles — escala de arcade correcta para 480×720.
- Alternativa considerada: regenerar con `generate-pixel-sprites.mjs` (~40px) — descartada, reemplaza el arte actual.

**D2 — Reescalar con `imageSmoothingEnabled = false` para conservar píxeles duros** (alineado al estilo "no blur/AA" del README de assets).

**D3 — Aplicar normalización en `loadKeyedImage` (post-keying)**, para que el bounding box no se vea contaminado por píxeles magenta residuales.

## Risks / Trade-offs

- [El recorte reduce la resolución del arte (hasta ~40px)] → Nitidez aceptable: el arte original ya es pixel art escalado; el estilo se conserva y coincide con el pipeline local original.
- [Un sprite quedara desproporcionado tras normalizar] → Ajustar su `k.scale` puntual en el juego afectado (verificado juego por juego).
- [Pérdida de detalle en sprites con arte pequeño dentro de 1024] → Límite de 64px conserva la proporción; detalle menor se percibe menos a escala de juego.
