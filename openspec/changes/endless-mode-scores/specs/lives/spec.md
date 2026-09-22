# lives Delta

## MODIFIED Requirements

### Requirement: Vidas internas por juego
Cada juego SHALL definir su propio recurso interno ("vidas" o reloj recargable) que se agota solo al fallar. Los juegos de reloj SHALL recargar tiempo al acertar, de modo que el reloj solo llega a cero por fallos sostenidos.

#### Scenario: Juego de reintentos
- **WHEN** un juego cuyo recurso son reintentos agota sus vidas internas
- **THEN** el juego determina que el usuario ha perdido la partida

#### Scenario: Juego contra reloj
- **WHEN** un juego cuyo recurso es el tiempo agota sus segundos sin aciertos que lo recarguen
- **THEN** el juego determina que el usuario ha perdido la partida

#### Scenario: El acierto recarga el reloj
- **WHEN** el usuario acierta en un juego contrarreloj
- **THEN** el reloj suma tiempo (bonus decreciente con la puntuación) y la partida continúa

### Requirement: Intentos globales
El sistema SHALL mantener un pool global de intentos compartido por todos los juegos, que se gasta exclusivamente para continuar tras perder. Navegar, deslizar y puntuar no gastan intentos.

#### Scenario: Continuar tras perder
- **WHEN** el usuario pierde en un juego y elige continuar
- **THEN** el sistema gasta 1 intento del pool global

#### Scenario: Ganar no gasta
- **WHEN** el usuario sube su puntuación en una partida infinita (no existe victoria que corte la partida)
- **THEN** el pool de intentos no se modifica

#### Scenario: Navegar no gasta
- **WHEN** el usuario hace swipe para probar otros juegos
- **THEN** el pool de intentos no se modifica
