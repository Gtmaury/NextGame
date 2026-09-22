## Context

La shell React ya usa tokens cinematic (`--accent`, `--warn`, etc.). Los 7 plugins Kaplay dibujan fondos negros implícitos, HUD `k.text` plano y rects/círculos genéricos. Ver `proposal.md` — Why. Mecánicas y `MiniGameDef` se mantienen.

## Goals / Non-Goals

**Goals:**
- HUD compartido reutilizable (texto + chips de vidas/tiempo/score) con colores de marca.
- Tema visual por `gameId`: color de fondo Kaplay + paleta de player/objetivos/obstáculos.
- Feedback de hint corto por juego (ya existe texto en varios; unificar estilo).

**Non-Goals:**
- Sprites, partículas complejas, audio, shaders.
- Cambiar metas numéricas (WIN/DURATION/lives) salvo que el feedback visual lo requiera de forma trivial.
- Tocar Feed/GamePlayer CSS.

## Decisions

### 1. Helper compartido `makeHud` (no React)

Añadir `src/games/hud.ts` (o `src/runtime/hud.ts`) que, dado el `KaplayCtx` y un tema, crea:
- barra/chips superiores: vidas (❤) o tiempo, score `n/meta`, hint opcional
- API `set({ lives?, time?, score?, hint? })` + `destroy()`

- **Por qué**: hoy cada juego duplica `hud.text = ...`; un helper alinea tipografía/color y acelera los 7.
- **Alternativa**: copiar-pegar estilos en cada archivo — más inconsistente.

### 2. Temas por juego (paleta + fondo)

| id | Atmósfera | Fondo aprox. | Acento entidades |
|----|-----------|--------------|------------------|
| catch | huerto nocturno | `#1a1020` → rosa/rojo fruta | paddle verde, fruit coral |
| tapdot | diana neón | `#0c1220` | dots amarillo/cian |
| race | crono frío | `#0a1628` | targets azul eléctrico |
| dodge | alerta | `#140a12` | player menta, obstacles rojo |
| jump | cielo/atardecer | `#12081c` + suelo `#3b2a6d` | player ámbar, huecos profundos |
| balance | zen neón | `#0e0a1a` | zona verde, aguja violeta |
| stars | cosmos | `#050510` | estrellas doradas + spark |

Usar `k.setBackground(...)` al montar (y restaurar/limpiar en cleanup si hace falta). Kaplay background es global a la instancia única → **cleanup debe resetear** a un default al `exit`/unmount.

### 3. Fondo global y cleanup

Como hay **una** instancia Kaplay:
- `mount` → `k.setBackground(theme.bg)`
- cleanup del `mount` → `k.setBackground('#07070f')` (igual que shell `--bg-deep`) + `destroyAll(TAG)`

- **Riesgo**: flash al salir; aceptable; mitigar reseteando en cleanup siempre.

### 4. Formas: seguir con primitivas, pero con “vestimenta”

No sprites: círculos/rects con colores de tema, a veces outline doble (rect detrás más oscuro) para dar peso. Hints con color `theme.muted`.

### 5. Sin cambiar callbacks ni lifeModel

Solo presentación. Tests de aceptación = mirar/jugar smoke: HUD visible, fondos distintos, win/lose igual.

## Risks / Trade-offs

- **[Background global Kaplay]** → siempre reset en cleanup; no dejar el color del juego anterior en el feed canvas oculto.
- **[Helper demasiado rígido]** → API mínima `set`/`destroy`; cada juego puede añadir decoración propia fuera del HUD.
- **[Alcance a 7 archivos]** → tareas por lote (MVP3 + tanda4) para no mezclar mecánicas.

## Migration Plan

Deploy estático. Rollback = build anterior. Sin datos.

## Open Questions

- Ninguna bloqueante; valores exactos de color se afinan en apply.
