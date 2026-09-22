## Purpose

Garantiza que los sprites pixel-art de los minijuegos se carguen normalizados (recortados y reescalados a un tamaño consistente) para que los elementos jugables se rendericen a escala jugable y coherente dentro del mundo KAPLAY de 480×720.

## ADDED Requirements

### Requirement: Sprites normalizados al cargar
El sistema SHALL recortar cada sprite a su bounding box de arte (ignorando el fondo keyado) y reescalarlo a un tamaño consistente con renderizado pixelado nítido, antes de registrarlo en KAPLAY.

#### Scenario: Cargar un sprite con margen
- **WHEN** el sistema carga un sprite PNG cuyo arte ocupa solo una parte del lienzo (el resto es fondo magenta keyado)
- **THEN** el sistema recorta el margen transparente y registra en KAPLAY solo el arte recortado

#### Scenario: Reescalado consistente
- **WHEN** el sistema carga un sprite de 1024×1024
- **THEN** el sprite se registra a un tamaño máximo de ~64px, con aspecto pixelado nítido (sin suavizado)

### Requirement: Escala jugable en todos los juegos
Todos los minijuegos SHALL renderizar sus elementos sprites a un tamaño jugable dentro del mundo de 480×720, sin elementos que ocupen la mayor parte de la pantalla.

#### Scenario: Juego con paddle
- **WHEN** el usuario juega a un juego con paddle
- **THEN** el paddle ocupa una fracción razonable del ancho de la pantalla (menos de la mitad)

#### Scenario: Juego con objetivos
- **WHEN** el usuario juega a un juego con objetivos (frutas, blancos, estrellas, bloques)
- **THEN** los objetivos se renderizan a un tamaño acorde a la escala del juego, permitiendo esquivarlos o alcanzarlos sin ocupar toda la pantalla
