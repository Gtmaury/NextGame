## Purpose

Define una interfaz común para que cada minijuego sea un "plugin" autocontenido que el feed puede montar y desmontar sin conocer sus detalles internos.

## ADDED Requirements

### Requirement: Interfaz común de juego
Todo juego SHALL cumplir una interfaz de ciclo de vida común: montar, recibir entrada, actualizar, dibujar, indicar fin y desmontar.

#### Scenario: Montar un juego
- **WHEN** el sistema abre un juego
- **THEN** el juego se monta mediante la interfaz común, sin que el feed conozca su lógica interna

#### Scenario: Desmontar un juego
- **WHEN** el usuario sale del juego
- **THEN** el juego libera sus recursos y el feed queda sin estado residual

### Requirement: Añadir juegos sin modificar el feed
Añadir o quitar un juego SHALL NOT requerir cambios en el feed; el feed descubre y ejecuta los juegos de forma uniforme a través de la interfaz común.

#### Scenario: Registrar un juego nuevo
- **WHEN** se añade un juego que cumple la interfaz común
- **THEN** el juego aparece en el feed sin modificar el código del feed

### Requirement: Señal de ganar o perder
Todo juego SHALL comunicar, a través de la interfaz común, cuándo el usuario gana o pierde, para que la economía de intentos pueda actuar.

#### Scenario: El juego notifica la pérdida
- **WHEN** el usuario pierde dentro de un juego
- **THEN** el juego notifica la pérdida mediante la interfaz común y el runtime ofrece continuar

#### Scenario: El juego notifica la victoria
- **WHEN** el usuario gana dentro de un juego
- **THEN** el juego notifica la victoria mediante la interfaz común
