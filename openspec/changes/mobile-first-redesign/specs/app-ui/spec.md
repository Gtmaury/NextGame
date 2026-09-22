## Purpose

Define la presentación mobile-first de la shell React de NextGame: sistema visual, feed, guardados, chrome de partida y overlays, optimizados para uso a una mano en teléfono.

## ADDED Requirements

### Requirement: Sistema visual coherente en móvil
La shell SHALL presentar un sistema visual unificado (color, tipografía, radios, superficies y motion) aplicado a feed, guardados, chrome de partida y overlays, con tipografía distinta de la tipografía de sistema por defecto del navegador.

#### Scenario: Misma marca en pantallas de shell
- **WHEN** el usuario navega entre feed, guardados y overlays
- **THEN** percibe la misma paleta, tipografía y radios en todas esas superficies

#### Scenario: Tipografía de producto
- **WHEN** el usuario abre la app en un teléfono
- **THEN** los títulos y el cuerpo usan la tipografía del sistema visual del producto, no solo la fuente genérica del SO

### Requirement: Viewport y safe areas en teléfono
La shell SHALL ocupar el viewport dinámico del teléfono (`100dvh` o equivalente) y respetar los insets de safe area (notch, home indicator) de modo que controles y textos no queden bajo barras del sistema.

#### Scenario: Contenido fuera del notch
- **WHEN** el usuario abre el feed en un teléfono con notch o barra de estado
- **THEN** el header y los controles permanecen visibles fuera de la safe area superior

#### Scenario: Controles sobre el home indicator
- **WHEN** el usuario ve tabs o acciones inferiores en un teléfono con home indicator
- **THEN** esos controles quedan por encima del inset inferior seguro

### Requirement: Targets táctiles usables a una mano
Los controles primarios de la shell (tabs, guardar, jugar, salir, acciones de overlay) SHALL ofrecer un área táctil mínima de 44×44 CSS px (o equivalente accesible) y los controles frecuentes de partida/salida SHALL situarse en la mitad inferior de la pantalla cuando sea práctico.

#### Scenario: Tap fiable en Jugar
- **WHEN** el usuario pulsa el control "Jugar" en una card del feed
- **THEN** el área activa es al menos 44×44 CSS px y entra al modo juego

#### Scenario: Salir alcanzable con el pulgar
- **WHEN** el usuario está en modo juego
- **THEN** el control de salida está en la zona inferior o lateral inferior de la pantalla, no solo en una esquina superior diminuta

### Requirement: Card de feed a pantalla completa en móvil
En viewport móvil (ancho ≤768px), cada card del feed SHALL ocupar esencialmente la altura útil de la pantalla con jerarquía clara: thumbnail dominante, título, guardar y control "Jugar", sin depender de hover.

#### Scenario: Una card por viewport
- **WHEN** el usuario ve el feed en un teléfono en portrait
- **THEN** una sola card llena la altura útil visible entre header y tabs

#### Scenario: Acciones sin hover
- **WHEN** el usuario interactúa solo con touch
- **THEN** puede guardar y jugar sin estados que dependan de hover de ratón

### Requirement: Overlays legibles en pantalla pequeña
Los overlays de victoria, derrota, recuperación y premium SHALL apilar título, datos de partida y acciones en una columna legible, con botones de acción a ancho usable en teléfono y contraste suficiente sobre el fondo.

#### Scenario: Acciones de derrota alcanzables
- **WHEN** el usuario pierde una partida en móvil
- **THEN** las acciones Continuar y Salir aparecen apiladas o en fila con targets ≥44px y texto legible sin zoom

### Requirement: Contraste y reducción de motion
El texto primario sobre fondos de shell SHALL mantener contraste suficiente para lectura en exterior (al menos WCAG AA para texto normal donde aplique a UI de chrome), y las animaciones de UI SHALL respetar `prefers-reduced-motion` acortando o desactivando motion no esencial.

#### Scenario: Reduced motion
- **WHEN** el sistema operativo tiene preferencia de reducir movimiento
- **THEN** las transiciones decorativas de la shell se omiten o se reducen a cambios instantáneos/opacidad mínima

### Requirement: Continuidad visual feed ↔ partida
Al entrar y salir del modo juego, la shell SHALL mantener continuidad de marca (colores/superficies del chrome) y una transición breve que no oculte el control de salida ni altere gestos de swipe del feed.

#### Scenario: Chrome reconocible en partida
- **WHEN** el usuario entra a jugar
- **THEN** el chrome de salida/partida usa el mismo sistema visual que el feed
