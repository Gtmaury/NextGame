# game-feed Specification

## Purpose

Presenta un catálogo de minijuegos en un feed vertical deslizable con orden aleatorio, con una lista de guardados y precarga del siguiente juego.

## Requirements

### Requirement: Feed vertical de juegos
El sistema SHALL presentar los juegos en un feed vertical a pantalla completa, donde el usuario navega entre juegos haciendo swipe hacia arriba o hacia abajo.

#### Scenario: Navegar entre juegos
- **WHEN** el usuario hace swipe vertical en modo feed
- **THEN** el sistema muestra el juego anterior o el siguiente a pantalla completa

### Requirement: Orden aleatorio del feed
El sistema SHALL presentar los juegos en un orden aleatorio, de modo que cada recorrido por el feed sea distinto.

#### Scenario: Recorrido distinto
- **WHEN** el usuario vuelve a recorrer el feed
- **THEN** el orden de los juegos puede diferir del recorrido anterior

### Requirement: Entrada y salida del modo juego
El sistema SHALL separar el modo feed del modo juego: tocar un juego entra al modo juego (swipe vertical deshabilitado) y un control explícito de salida devuelve al feed.

#### Scenario: Entrar a un juego
- **WHEN** el usuario toca un juego en el feed
- **THEN** el juego se abre a pantalla completa y el swipe vertical queda deshabilitado

#### Scenario: Salir de un juego
- **WHEN** el usuario pulsa el control de salida
- **THEN** el sistema vuelve al feed y el swipe vertical queda habilitado de nuevo

### Requirement: Lista de guardados
El sistema SHALL permitir guardar un juego para jugarlo después y ver todos los juegos guardados en una lista dedicada.

#### Scenario: Guardar un juego
- **WHEN** el usuario guarda un juego
- **THEN** el juego aparece en la lista de "guardados"

#### Scenario: Ver guardados
- **WHEN** el usuario abre la lista de "guardados"
- **THEN** el sistema muestra todos los juegos guardados

### Requirement: Precarga del siguiente juego
El sistema SHALL precargar los recursos del siguiente juego antes de que el usuario haga swipe, de modo que el cambio de juego sea inmediato.

#### Scenario: Transición inmediata
- **WHEN** el usuario hace swipe al siguiente juego
- **THEN** el juego siguiente está listo para jugar sin tiempo de carga perceptible
