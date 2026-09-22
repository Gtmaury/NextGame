## Purpose

Define la versión de escritorio del catálogo (bento) y el header de sitio, sin cambiar el feed swipe en viewports estrechos.

## ADDED Requirements

### Requirement: Catálogo web en escritorio
En viewports de al menos 900px de ancho, la pestaña Jugar SHALL mostrar todos los juegos del catálogo a la vez: un juego destacado y el resto en una estantería irregular, no una sola card a pantalla completa.

#### Scenario: Abrir en escritorio
- **WHEN** el usuario abre la pestaña Jugar con ancho ≥ 900px
- **THEN** ve un catálogo con un destacado y el resto de títulos visibles sin swipe vertical

#### Scenario: Jugar desde el catálogo
- **WHEN** el usuario pulsa Jugar en una card del catálogo
- **THEN** el minijuego se abre a pantalla completa igual que desde el feed móvil

### Requirement: Feed swipe en móvil
En viewports menores de 900px, la pestaña Jugar SHALL seguir presentando una card a pantalla completa con swipe vertical.

#### Scenario: Swipe en móvil
- **WHEN** el usuario hace swipe vertical bajo 900px
- **THEN** pasa a la card anterior o siguiente como antes

### Requirement: Listas anchas en escritorio
Guardados y Récords en viewports ≥ 900px SHALL usar un layout de al menos dos columnas.

#### Scenario: Récords en escritorio
- **WHEN** el usuario abre Récords con ancho ≥ 900px
- **THEN** las filas se disponen en una cuadrícula de dos columnas
