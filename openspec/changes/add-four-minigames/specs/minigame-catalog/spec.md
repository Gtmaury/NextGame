## Purpose

Define el catálogo de minijuegos publicados en el feed: cada título es un plugin jugable, descubrible y coherente con la economía de vidas e intentos existente.

## ADDED Requirements

### Requirement: Cuatro minijuegos adicionales en el catálogo
El sistema SHALL publicar cuatro minijuegos adicionales en el catálogo del feed, distintos de los tres del MVP (`catch`, `tapdot`, `race`), cada uno identificable por un `id` estable.

#### Scenario: Los cuatro aparecen en el feed
- **WHEN** el usuario recorre el feed
- **THEN** puede encontrar los cuatro minijuegos nuevos además de los ya existentes

#### Scenario: Identificadores estables
- **WHEN** se guarda o se precarga uno de los nuevos juegos
- **THEN** el sistema lo referencia por su `id` de catálogo (`dodge`, `jump`, `balance`, `stars`)

### Requirement: Cada juego nuevo es un plugin completo
Cada uno de los cuatro minijuegos SHALL cumplir la interfaz común de juego: montar, precargar, notificar victoria o derrota, y desmontar sin dejar estado residual en el feed.

#### Scenario: Entrar y salir
- **WHEN** el usuario entra a uno de los cuatro juegos y luego sale
- **THEN** el juego se desmonta y el feed vuelve a funcionar con swipe habilitado

#### Scenario: Señal de resultado
- **WHEN** el usuario gana o pierde en uno de los cuatro juegos
- **THEN** el juego notifica el resultado mediante la interfaz común para que la economía de intentos pueda actuar

### Requirement: Mezcla de modelos de vida
De los cuatro minijuegos nuevos, el catálogo SHALL incluir al menos dos con recurso interno de reintentos (`retry`) y al menos dos con recurso interno de tiempo (`time`), sin mezclar ambos significados dentro del mismo juego.

#### Scenario: Juegos de reintentos
- **WHEN** el usuario juega `dodge` o `jump`
- **THEN** el recurso interno que decide la derrota son reintentos, no un reloj de partida

#### Scenario: Juegos de tiempo
- **WHEN** el usuario juega `balance` o `stars`
- **THEN** el recurso interno que decide la derrota es el tiempo, no un contador de reintentos

### Requirement: Jugabilidad hiper-casual comprensible al instante
Cada minijuego nuevo SHALL ser jugable con un único gesto principal (tocar, mantener o mover) y SHALL comunicar el objetivo en pantalla de forma que se entienda en segundos, sin tutoriales previos.

#### Scenario: Primera partida
- **WHEN** el usuario abre cualquiera de los cuatro juegos por primera vez
- **THEN** puede empezar a jugar de inmediato con el gesto principal visible o implícito en la acción
