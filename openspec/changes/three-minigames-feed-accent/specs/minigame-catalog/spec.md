## Purpose

Define la publicación de tres minijuegos nuevos en el catálogo del feed como plugins jugables con gestos distintos a los títulos existentes.

## ADDED Requirements

### Requirement: Tres minijuegos adicionales en el catálogo
El sistema SHALL publicar tres minijuegos adicionales en el catálogo del feed — `slice`, `stack` y `memory` — cada uno con un `id` estable, además de los títulos ya existentes.

#### Scenario: Aparecen en el feed
- **WHEN** el usuario recorre el feed completo
- **THEN** puede encontrar `slice`, `stack` y `memory` además de los juegos previos

#### Scenario: Identificadores estables
- **WHEN** el usuario guarda o el sistema precarga uno de los tres juegos
- **THEN** la referencia usa el `id` de catálogo correspondiente (`slice`, `stack` o `memory`)

### Requirement: Cada juego nuevo es un plugin completo
Cada uno de los tres minijuegos SHALL montar, precargar, notificar derrota (con puntuación) y desmontar sin dejar el feed inutilizable ni gestos rotos.

#### Scenario: Entrar y salir
- **WHEN** el usuario entra a `slice`, `stack` o `memory` y luego sale
- **THEN** el juego se desmonta y el feed vuelve con swipe habilitado

#### Scenario: Señal de derrota
- **WHEN** el usuario pierde en uno de los tres juegos
- **THEN** el juego notifica el resultado por la interfaz común para que la economía de intentos y puntuación actúe

### Requirement: Mezcla de modelos de vida en la tanda
De los tres minijuegos nuevos, el catálogo SHALL incluir al menos dos con modelo `retry` y al menos uno con modelo `time`.

#### Scenario: Retry
- **WHEN** el usuario juega `slice` o `stack`
- **THEN** la derrota se decide por reintentos internos agotados, no por un único reloj de partida

#### Scenario: Time
- **WHEN** el usuario juega `memory`
- **THEN** la derrota se decide por fallo de secuencia o agotamiento de tiempo, no por un contador de vidas de reintento

### Requirement: Gestos distintos y comprensibles al instante
Cada minijuego nuevo SHALL usar un gesto principal distinto de los ya cubiertos por el catálogo (mover paddle/esquivar, tap a tiempo, taps rápidos, salto, hold, tap selectivo) y SHALL comunicar el objetivo en pantalla en segundos sin tutorial previo.

#### Scenario: Slice — deslizar
- **WHEN** el usuario abre `slice`
- **THEN** el gesto principal es deslizar/cortar sobre objetivos en movimiento

#### Scenario: Stack — apilar
- **WHEN** el usuario abre `stack`
- **THEN** el gesto principal es tocar para apilar o soltar bloques

#### Scenario: Memory — secuencia
- **WHEN** el usuario abre `memory`
- **THEN** el gesto principal es tocar la secuencia mostrada en el orden correcto
