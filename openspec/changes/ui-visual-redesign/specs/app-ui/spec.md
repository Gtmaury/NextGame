## Purpose

Define el lenguaje visual de la shell de NextGame: apariencia coherente del feed, guardados, chrome de juego y overlays, con contraste legible y motion de UI que no altere los gestos existentes.

## ADDED Requirements

### Requirement: Sistema visual coherente en toda la shell
La aplicación SHALL presentar un único sistema visual (paleta, tipografía, radios y espaciado) compartido por header, feed, lista de guardados, botón de salida y overlays, de modo que las pantallas se perciban como el mismo producto.

#### Scenario: Misma identidad entre pantallas
- **WHEN** el usuario pasa del feed a guardados y luego entra a un juego (overlays)
- **THEN** colores de acento, tipografía y estilo de botones son coherentes entre esas superficies

### Requirement: Cards de feed con jerarquía clara
Cada card del feed SHALL mostrar el thumbnail del juego, el título con jerarquía tipográfica destacada y la acción de guardar, sobre un fondo visualmente rico (gradiente o superficie diferenciada), sin exigir un tutorial.

#### Scenario: Card legible a pantalla completa
- **WHEN** el usuario ve un juego en el feed
- **THEN** puede identificar de inmediato el juego (thumbnail + título) y la acción de guardar

### Requirement: Overlays de resultado legibles
Los overlays de victoria, derrota y recuperación de intentos SHALL usar tipografía y contraste suficientes sobre el fondo atenuado, con acciones primarias y secundarias visualmente distintas.

#### Scenario: Derrota con acciones claras
- **WHEN** el usuario pierde una partida
- **THEN** el overlay muestra el resultado y distingue claramente Continuar de Salir

#### Scenario: Victoria con acciones claras
- **WHEN** el usuario gana una partida
- **THEN** el overlay muestra el resultado y distingue claramente Jugar de nuevo de Salir

### Requirement: Motion de UI sin cambiar gestos
Las transiciones de card en el feed y la aparición de overlays SHALL animarse de forma suave, y SHALL NOT cambiar los gestos de swipe vertical ni el tap para entrar al juego.

#### Scenario: Swipe sigue igual
- **WHEN** el usuario hace swipe vertical en el feed
- **THEN** cambia de juego a pantalla completa como antes, aunque la card anime la entrada

#### Scenario: Overlay aparece con transición
- **WHEN** el juego notifica victoria o derrota
- **THEN** el overlay aparece con una transición breve y permanece usable de inmediato

### Requirement: Tema oscuro cinematográfico y contraste
La shell SHALL usar un tema oscuro con contraste suficiente entre texto/controles y el fondo para lectura en móvil a pantalla completa.

#### Scenario: Texto principal legible
- **WHEN** el usuario mira títulos y botones del feed o de un overlay
- **THEN** el texto y los controles contrastan de forma clara respecto al fondo
