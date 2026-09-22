## Purpose

Define el acento dinámico de la shell del feed: el color de acento del menú sigue al juego actualmente visible al navegar el catálogo.

## ADDED Requirements

### Requirement: Acento del feed sigue al juego visible
Mientras el usuario está en la pestaña de feed y ve una card de juego, la shell SHALL aplicar un color de acento asociado a ese juego a los controles de acento del menú (al menos: tab activo, botón primario "Jugar" y chip de intentos), de modo que al cambiar de card el acento cambie.

#### Scenario: Swipe cambia el acento
- **WHEN** el usuario hace swipe a otra card del feed
- **THEN** el color de acento de los controles del menú pasa a coincidir con el del nuevo juego visible

#### Scenario: Primera card
- **WHEN** el usuario abre el feed y ve la primera card
- **THEN** el menú ya usa el acento de ese juego (no un acento genérico fijo ajeno al catálogo)

### Requirement: Cada juego tiene un acento distinguible
Cada juego del catálogo (incluidos los tres nuevos) SHALL tener un color de acento de menú asociado, y juegos distintos SHALL no compartir el mismo acento primario cuando sea práctico para distinguir cards al swipe.

#### Scenario: Tres nuevos con acentos propios
- **WHEN** el usuario pasa entre `slice`, `stack` y `memory`
- **THEN** percibe un cambio de color de acento del menú entre cada uno

### Requirement: Otras pestañas no rompen el feed
Al cambiar a Guardados o Récords, la shell SHALL conservar un acento coherente (último juego del feed o acento neutro de marca) sin impedir volver al feed; al volver al feed, el acento SHALL volver a seguir la card visible.

#### Scenario: Volver al feed
- **WHEN** el usuario sale de Guardados o Récords y vuelve a Jugar
- **THEN** el acento del menú vuelve a alinearse con la card de juego visible
