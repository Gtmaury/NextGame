# high-scores Specification

## Purpose

Persiste y presenta el mejor puntaje por minijuego (récord) en localStorage, visible en la tabla de récords del feed, en la card de cada juego y en el overlay de derrota.

## ADDED Requirements

### Requirement: Récord por juego
El sistema SHALL almacenar por juego el mayor puntaje alcanzado en localStorage, actualizado al terminar cada partida.

#### Scenario: Nueva marca
- **WHEN** el usuario termina una partida con más puntos que el récord guardado
- **THEN** el sistema guarda ese puntaje como nuevo récord del juego y lo señala en el overlay de derrota

#### Scenario: Sin superación
- **WHEN** el usuario termina una partida por debajo del récord guardado
- **THEN** el récord se mantiene intacto

### Requirement: Tabla de récords
El sistema SHALL presentar una tabla con todos los juegos y su récord, ordenada de mayor a menor puntaje, distinguiendo el juego con mejor marca.

#### Scenario: Juegos sin partidas
- **WHEN** un juego nunca se ha jugado
- **THEN** la tabla lo muestra sin puntuación en lugar de cero
