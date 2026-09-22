## Context

NextGame es un feed vertical mobile-first. El breakpoint previo (≥768px) solo centraba una columna de 480px. Los thumbs de flap/swipe/hold no existían; `GameThumb` caía a iniciales.

## Decisions

- **900px** como corte catálogo vs feed: tablets estrechas siguen en swipe; portátiles entran al bento.
- Featured = récord más alto si existe, si no el primero del shuffle de la sesión.
- Thumbs vía el generador ASCII (`--thumbs`) con key magenta, no sprites in-game.
- Layout “pared de cabinas”: featured a la izquierda, shelf 2 columnas con un tile alto y uno ancho — no 3 columnas iguales.

## Risks

- Resize 899↔900 remonta el feed (shuffle nuevo). Aceptable.
- Thumbs pixel pequeños junto a thumbs AI grandes del resto del catálogo: recorte + `image-rendering: pixelated` unifica el look en UI.
