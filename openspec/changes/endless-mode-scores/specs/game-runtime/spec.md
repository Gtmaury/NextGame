# game-runtime Delta

## MODIFIED Requirements

### Requirement: Señal de fin de partida
Todo juego SHALL comunicar, a través de la interfaz común, únicamente el fin de partida por derrota acompañado de la puntuación final, para que la economía de intentos y los récords puedan actuar. Los juegos son infinitos: la dificultad escala de forma continua y SHALL NOT existir un umbral de puntuación que termine la partida con victoria.

#### Scenario: El juego notifica la derrota
- **WHEN** el usuario pierde dentro de un juego (vidas o tiempo agotados)
- **THEN** el juego notifica la derrota con su puntuación final mediante la interfaz común y el runtime ofrece continuar

#### Scenario: La dificultad escala sin fin
- **WHEN** la puntuación del usuario sube durante una partida
- **THEN** la dificultad del juego aumenta de forma continua y la partida continúa

#### Scenario: Sin umbral de victoria
- **WHEN** el usuario supera cualquier cantidad de puntos
- **THEN** el juego no termina por ello; solo pierde al agotar su recurso (vidas o tiempo)
