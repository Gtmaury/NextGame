## Purpose

Garantiza que la aplicación y sus juegos funcionen sin conexión, cacheando los recursos necesarios mediante un service worker.

## ADDED Requirements

### Requirement: Juego sin conexión
El sistema SHALL permanecer jugable sin conexión de red, sirviendo los juegos y recursos cacheados.

#### Scenario: Jugar offline
- **WHEN** el usuario abre la app sin conexión
- **THEN** la app carga y los juegos cacheados se pueden jugar

#### Scenario: Precarga disponible offline
- **WHEN** un juego fue precargado previamente
- **THEN** queda disponible para jugar sin conexión

### Requirement: Sin anuncios reales offline
El sistema SHALL NOT intentar cargar anuncios reales cuando no hay conexión, y SHALL usar un placeholder local para el flujo de recuperación.

#### Scenario: Sin conexión no hay anuncio real
- **WHEN** el usuario está sin conexión
- **THEN** no se muestra ningún anuncio real y la recuperación de intentos usa un placeholder local
