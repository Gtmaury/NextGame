## Purpose

Define la presentación pulida de la shell React de NextGame: composición del feed, chrome informativo, overlays, guardados y transiciones entre modos, con fallbacks robustos cuando faltan assets.

## ADDED Requirements

### Requirement: Composición clara de la card del feed
Cada card del feed SHALL presentar una jerarquía visual explícita — thumbnail, título, acción de guardar y un control primario "Jugar" — de modo que el usuario identifique las acciones sin ambigüedad.

#### Scenario: Acciones distinguibles
- **WHEN** el usuario ve un juego en el feed
- **THEN** puede distinguir claramente entre guardar el juego y entrar a jugarlo

#### Scenario: Jugar desde el botón
- **WHEN** el usuario pulsa el control "Jugar" en la card
- **THEN** el sistema entra al modo juego del título mostrado

### Requirement: Chrome con intentos visibles
La shell SHALL mostrar en el header el número de intentos globales disponibles (o indicación de premium ilimitado), de modo que la economía sea visible antes de perder una partida.

#### Scenario: Intentos en el feed
- **WHEN** el usuario navega el feed sin estar en una partida
- **THEN** ve cuántos intentos globales le quedan o que premium está activo

#### Scenario: Premium visible
- **WHEN** el modo premium está activo
- **THEN** el header indica intentos ilimitados en lugar de un contador numérico

### Requirement: Fallback cuando falta thumbnail
Si el thumbnail de un juego no está disponible, la shell SHALL mostrar un sustituto visual coherente (placeholder con color o iniciales del título) en lugar de un icono de imagen rota.

#### Scenario: Thumb ausente en feed
- **WHEN** la imagen del thumbnail no carga en una card del feed
- **THEN** el usuario ve un placeholder legible asociado al juego

#### Scenario: Thumb ausente en guardados
- **WHEN** la imagen del thumbnail no carga en la lista de guardados
- **THEN** el usuario ve el mismo tipo de placeholder que en el feed

### Requirement: Overlays de resultado con jerarquía de información
Los overlays de victoria, derrota y recuperación SHALL presentar título, datos de partida (puntuación y récord cuando aplique) y acciones en un orden legible, sin copy de placeholder de desarrollo visible al usuario.

#### Scenario: Derrota informativa
- **WHEN** el usuario pierde una partida con puntuación
- **THEN** el overlay muestra puntuación, récord e intentos restantes antes de las acciones Continuar y Salir

#### Scenario: Recuperación sin placeholder de desarrollo
- **WHEN** el usuario entra al flujo de recuperación de intentos
- **THEN** el overlay usa textos de producto (espera offline o anuncio simulado online) sin mensajes tipo "[placeholder]"

### Requirement: Lista de guardados alineada al feed
La lista de guardados SHALL reutilizar las mismas señales visuales por juego que el feed (thumbnail o fallback, color de variante por título), de modo que guardados se perciba como extensión del catálogo.

#### Scenario: Guardado reconocible
- **WHEN** el usuario abre la pestaña de guardados
- **THEN** cada fila es visualmente coherente con la card de ese juego en el feed

### Requirement: Transición suave entre feed y juego
Al entrar o salir del modo juego, la shell SHALL animar una transición breve (p. ej. desvanecido del feed o del chrome) sin alterar los gestos de swipe en el feed ni el botón de salida en partida.

#### Scenario: Entrada al juego
- **WHEN** el usuario entra a jugar desde el feed
- **THEN** el feed se oculta con una transición perceptible pero breve y el canvas queda a pantalla completa

#### Scenario: Salida al feed
- **WHEN** el usuario sale de una partida al feed
- **THEN** el feed reaparece con la misma transición inversa sin perder la posición del juego en el recorrido

### Requirement: Legibilidad móvil sin ruido decorativo
La shell SHALL priorizar contraste y tamaño de texto legible en pantalla pequeña, limitando efectos decorativos que reduzcan la claridad del contenido principal (título, CTA, overlays).

#### Scenario: Título legible en card
- **WHEN** el usuario mira una card a pantalla completa en un viewport móvil típico
- **THEN** el título del juego y el CTA "Jugar" son legibles sin zoom

#### Scenario: Motion accesible
- **WHEN** el usuario tiene `prefers-reduced-motion: reduce` activo
- **THEN** las transiciones de shell se reducen o desactivan manteniendo la funcionalidad
