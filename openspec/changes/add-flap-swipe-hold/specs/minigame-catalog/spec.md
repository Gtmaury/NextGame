## Purpose

Define la publicación de tres minijuegos nuevos en el catálogo del feed como plugins jugables con gestos de aleteo, carriles y carga.

## ADDED Requirements

### Requirement: Tres minijuegos adicionales en el catálogo
El sistema SHALL publicar tres minijuegos adicionales en el catálogo del feed — `flap`, `swipe` y `hold` — cada uno con un `id` estable, además de los títulos ya existentes.

#### Scenario: Aparecen en el feed
- **WHEN** el usuario recorre el feed completo
- **THEN** puede encontrar `flap`, `swipe` y `hold` además de los juegos previos

#### Scenario: Identificadores estables
- **WHEN** el usuario guarda o el sistema precarga uno de los tres juegos
- **THEN** la referencia usa el `id` de catálogo correspondiente (`flap`, `swipe` o `hold`)

### Requirement: Cada juego nuevo es un plugin completo
Cada uno de los tres minijuegos SHALL montar, precargar, notificar derrota (con puntuación) y desmontar sin dejar el feed inutilizable ni gestos rotos.

#### Scenario: Entrar y salir
- **WHEN** el usuario entra a `flap`, `swipe` o `hold` y luego sale
- **THEN** el juego se desmonta y el feed vuelve con swipe habilitado

#### Scenario: Señal de derrota
- **WHEN** el usuario pierde en uno de los tres juegos
- **THEN** el juego notifica el resultado por la interfaz común para que la economía de intentos y puntuación actúe

### Requirement: Mezcla de modelos de vida en la tanda
De los tres minijuegos nuevos, el catálogo SHALL incluir al menos dos con modelo `retry` y al menos uno con modelo `time`.

#### Scenario: Retry
- **WHEN** el usuario juega `flap` o `swipe`
- **THEN** la derrota se decide por reintentos internos agotados, no por un único reloj de partida

#### Scenario: Time
- **WHEN** el usuario juega `hold`
- **THEN** la derrota se decide por agotamiento de tiempo o fallo de disparo, no por un contador de vidas de reintento

### Requirement: Gestos distintos y comprensibles al instante
Cada minijuego nuevo SHALL usar un gesto principal distinto entre sí y claramente diferenciado del catálogo existente (incluido movimiento libre de `dodge` frente a carriles discretos de `swipe`) y SHALL comunicar el objetivo en pantalla en segundos sin tutorial previo.

#### Scenario: Flap — un toque
- **WHEN** el usuario abre `flap`
- **THEN** el gesto principal es un toque/impulso hacia arriba contra gravedad, con obstáculos que dejan un hueco

#### Scenario: Swipe — carriles
- **WHEN** el usuario abre `swipe`
- **THEN** el gesto principal es deslizar horizontalmente para cambiar entre carriles discretos y evitar obstáculos que vienen de frente

#### Scenario: Hold — cargar y soltar
- **WHEN** el usuario abre `hold`
- **THEN** el gesto principal es mantener el dedo para cargar potencia y soltar para lanzar hacia un objetivo
