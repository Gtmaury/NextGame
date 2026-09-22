## Context

Los 7 plugins Kaplay ya tienen temas de color y HUD (`in-game-visual-polish`) pero dibujan `rect`/`circle`. El feed usa emoji en `meta.thumbnail`. Ver `proposal.md` — Why. Objetivo: pixel-art cute estático para entidades clave + thumbs.

## Goals / Non-Goals

**Goals:**
- Un estilo ancla (palette + pixel size) para toda la tanda.
- Inventario mínimo por juego (2–4 sprites) + 1 thumb.
- Carga vía Kaplay `loadSprite` en `preload`, uso en `mount`.
- Thumbs en `public/assets/thumbs/` referenciados desde `meta` / Feed.

**Non-Goals:**
- Animaciones / sprite sheets multi-frame.
- Parallax tilesets, FX particles art-heavy.
- Sustituir el HUD de texto por bitmaps.

## Decisions

### 1. Estilo ancla (pixel cute casual)

- Resolución base de sprite: **32×32** o **48×48** lógicos (escala nearest-neighbor en Kaplay).
- Fondo de export: **magenta chroma `#FF00FF`** o transparente PNG; preferir **PNG con alpha**.
- Look: ojos grandes / formas redondeadas, outline oscuro 1px, saturación media-alta, sin sombreado realista.
- Una **imagen de estilo ancla** se genera primero y se reutiliza como referencia en el resto (edit-chain / same prompt family).

### 2. Inventario por juego

| Game | Sprites (ids Kaplay) | Thumb |
|------|----------------------|-------|
| catch | `catch-paddle`, `catch-fruit` | `thumb-catch` |
| tapdot | `tapdot-target` | `thumb-tapdot` |
| race | `race-target` | `thumb-race` |
| dodge | `dodge-player`, `dodge-block` | `thumb-dodge` |
| jump | `jump-player`, `jump-ground` (opcional tile corto) | `thumb-jump` |
| balance | `balance-needle`, `balance-zone` (o solo needle + bar dibujada) | `thumb-balance` |
| stars | `stars-star` | `thumb-stars` |

Hitboxes: seguir usando `area()` con tamaño cercano al sprite; no exigir pixel-perfect collision.

### 3. Layout en disco

```
public/assets/
  sprites/
    catch-paddle.png
    catch-fruit.png
    ...
  thumbs/
    catch.png
    ...
```

Servidos como estáticos Vite (`/assets/...`). PWA los cachea al precargar / al visitar.

### 4. Integración Kaplay

```ts
async preload(k) {
  await k.loadSprite('catch-fruit', '/assets/sprites/catch-fruit.png')
}
mount(k, cb) {
  k.add([k.sprite('catch-fruit'), k.pos(...), k.area(), ...])
}
```

`meta.thumbnail` pasa a URL `/assets/thumbs/{id}.png`; Feed renderiza `<img>` en lugar de emoji (ajuste mínimo de markup).

### 5. Producción de arte (fase apply)

- Generar con Imagine (`image_gen` / `image_edit`) siguiendo disciplina **game-asset-core**: sujeto aislado, fondo limpio, silueta clara.
- Anclar estilo con 1–2 refs; series del mismo objeto vía edit.
- Verificar lectura ciega; descartar máx. ~2 intentos por pieza si falla.
- No bloquear apply por un sprite imperfecto: flag + fallback a primitiva coloreada si un asset no pasa QA.

### 6. Fallback

Si falta un sprite en runtime: mantener primitiva con colores del tema (comportamiento actual). Evita pantallas rotas.

## Risks / Trade-offs

- **[Inconsistencia AI entre sprites]** → style anchor + prompt family fija; revisar set completo juntos.
- **[Alpha / chroma sucio]** → preferir PNG alpha; post-check silueta.
- **[Escalado blurry]** → `k.loadSprite` + scale entero; filtrado nearest si Kaplay lo expone.
- **[Peso PWA]** → ~20 PNG pequeños; OK para MVP; no sheets enormes.

## Migration Plan

Añadir assets + wiring; deploy estático. Rollback = build anterior (o desactivar sprites y volver a primitivas).

## Open Questions

- Ninguna bloqueante; nombres exactos de archivo se fijan en tasks/apply.
