## Purpose

Define el catálogo visual de los minijuegos: sprites pixel-art cute para entidades jugables e iconos de feed, de estilo coherente, listos para precargar y mostrar en partida.

## ADDED Requirements

### Requirement: Estilo pixel-art cute unificado
Todos los assets de esta tanda SHALL compartir un mismo lenguaje visual pixel-art casual (proporción cute, siluetas claras, contornos legibles a tamaño pequeño), de modo que el catálogo se perciba como una sola familia estética.

#### Scenario: Coherencia entre juegos
- **WHEN** el usuario entra a dos minijuegos distintos que usan sprites
- **THEN** el estilo de píxel, el nivel de detalle y el “cuteness” son coherentes entre ambos

### Requirement: Elementos clave por minijuego
Cada uno de los siete minijuegos SHALL representar sus entidades principales (jugador u objeto controlable, objetivos y/o obstáculos según el juego) con sprites en lugar de solo primitivas geométricas genéricas.

#### Scenario: Partida con sprites
- **WHEN** el usuario juega cualquiera de los siete títulos
- **THEN** ve sprites pixel-art en las entidades principales de ese juego

### Requirement: Thumbnails de feed alineados
El feed SHALL mostrar un thumbnail pixel-art (o icono derivado) por juego, coherente con el arte in-game de ese título, en lugar de depender solo de un emoji de texto.

#### Scenario: Card del feed
- **WHEN** el usuario ve una card en el feed
- **THEN** el thumbnail del juego es un asset gráfico pixel-art del set, no únicamente un carácter emoji

### Requirement: Precarga y uso offline-friendly
Los sprites de un juego SHALL cargarse en la fase de `preload` de ese juego, de modo que la precarga N+1 existente pueda dejarlos listos antes del swipe.

#### Scenario: Transición al siguiente
- **WHEN** el siguiente juego en el feed se precarga
- **THEN** sus assets visuales quedan disponibles para montar sin demora perceptible al entrar

### Requirement: Mecánicas intactas
Sustituir primitivas por sprites SHALL NOT cambiar gestos, hitboxes de forma que rompan el juego, ni las señales de victoria/derrota.

#### Scenario: Win/lose igual
- **WHEN** el usuario gana o pierde tras el cambio de assets
- **THEN** el juego sigue notificando el resultado mediante la interfaz común como antes
