# game-feed Delta

## ADDED Requirements

### Requirement: Pestaña de récords
El feed SHALL ofrecer una pestaña "Récords" junto a Jugar y Guardados, con la tabla de mejores puntuaciones por juego, ordenada de mayor a menor.

#### Scenario: Ver la tabla de récords
- **WHEN** el usuario abre la pestaña "Récords"
- **THEN** el sistema muestra todos los juegos con su mejor puntuación, ordenados de mayor a menor

#### Scenario: Récord en la card
- **WHEN** el usuario ve un juego en el feed
- **THEN** la card muestra el récord actual de ese juego
