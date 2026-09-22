## Purpose

Define cómo se presenta la partida dentro del canvas: un HUD legible alineado a la marca de NextGame y un aspecto visual propio por minijuego, sin cambiar las mecánicas ni la economía.

## ADDED Requirements

### Requirement: HUD in-game legible y de marca
Durante la partida, cada minijuego SHALL mostrar un HUD que comunique claramente el recurso interno relevante (vidas o tiempo) y el progreso hacia la meta, con contraste suficiente sobre el fondo de juego.

#### Scenario: HUD de reintentos
- **WHEN** el usuario juega un minijuego con `lifeModel` retry
- **THEN** ve vidas restantes y progreso de puntuación/meta de forma legible en pantalla

#### Scenario: HUD de tiempo
- **WHEN** el usuario juega un minijuego con `lifeModel` time
- **THEN** ve el tiempo restante y el progreso de puntuación/meta de forma legible en pantalla

### Requirement: Identidad visual distinta por juego
Cada uno de los siete minijuegos SHALL tener un fondo y una paleta de entidades que lo diferencien visualmente de los demás, de modo que al entrar desde el feed el usuario perciba un entorno propio del título.

#### Scenario: Dos juegos no se confunden
- **WHEN** el usuario sale de un juego y entra a otro distinto
- **THEN** el fondo y los colores principales de entidades no son indistinguibles entre ambos

#### Scenario: Catálogo completo cubierto
- **WHEN** el usuario abre cualquiera de los juegos del catálogo (`catch`, `tapdot`, `race`, `dodge`, `jump`, `balance`, `stars`)
- **THEN** ese juego presenta su propia atmósfera visual (no un lienzo negro genérico compartido)

### Requirement: Mecánicas intactas
El rediseño visual SHALL NOT alterar gestos principales, condiciones de victoria/derrota ni la señalización `onWin` / `onLose` de la interfaz común.

#### Scenario: Victoria y derrota siguen igual
- **WHEN** el usuario alcanza la meta o agota el recurso interno de un juego rediseñado
- **THEN** el juego notifica victoria o derrota como antes a través de la interfaz común

### Requirement: Feedback visual inmediato del objetivo
Cada partida SHALL incluir una pista visual o textual breve del gesto u objetivo (integrada en el HUD o cerca de la acción), sin tutoriales multi-paso.

#### Scenario: Primera mirada
- **WHEN** el usuario entra a un juego
- **THEN** entiende el objetivo o el gesto principal en segundos gracias al HUD o a la pista en pantalla
