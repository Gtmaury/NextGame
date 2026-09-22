## Purpose

Define la presentación del HUD y feedback visual dentro del canvas Kaplay para que la partida se lea bien en móvil y se alinee al lenguaje visual de la shell rediseñada.

## ADDED Requirements

### Requirement: HUD legible en pantallas pequeñas
Durante una partida, el HUD (vidas, tiempo, score u hints según el juego) SHALL permanecer legible en viewport móvil portrait: tamaño de texto suficiente, contraste frente al fondo de juego y posición que no tape la zona de acción principal del pulgar cuando sea posible.

#### Scenario: Score visible en portrait
- **WHEN** el usuario juega en un teléfono en portrait
- **THEN** el score (y vidas/tiempo si aplican) son legibles sin acercar la vista

#### Scenario: HUD no tapa el control crítico
- **WHEN** el juego requiere toques o gestos en la mitad inferior de la pantalla
- **THEN** el HUD no cubre de forma permanente esa zona de interacción primaria

### Requirement: Alineación visual con la shell
El HUD in-game SHALL reutilizar la paleta y la jerarquía tipográfica del sistema visual de la app (chips, contraste, acentos) de modo que la transición feed → partida no se sienta como otro producto.

#### Scenario: Misma familia de acentos
- **WHEN** el usuario compara el chrome del feed con el HUD de una partida
- **THEN** los acentos y el contraste del HUD son coherentes con los tokens visuales de la shell

### Requirement: Feedback de resultado visible en móvil
Los momentos de victoria o derrota dentro del canvas (si el juego muestra feedback antes del overlay React) SHALL usar señales visuales claras (flash, escala o mensaje breve) legibles en pantalla pequeña, sin depender de hover.

#### Scenario: Señal de fin de partida
- **WHEN** una partida termina dentro del canvas antes o junto al overlay
- **THEN** el jugador percibe un cambio visual inequívoco de fin de ronda en el teléfono
