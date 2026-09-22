## Purpose

Gestiona el sistema de dos capas (vidas internas de cada juego + intentos globales) y la economía para recuperar intentos mediante espera, anuncios o premium, incluyendo el comportamiento sin conexión.

## ADDED Requirements

### Requirement: Vidas internas por juego
Cada juego SHALL definir su propio recurso interno de "vidas" (reintentos o tiempo extra) que determina si el usuario gana o pierde la partida.

#### Scenario: Juego de reintentos
- **WHEN** un juego cuyo recurso son reintentos agota sus vidas internas
- **THEN** el juego determina que el usuario ha perdido la partida

#### Scenario: Juego contra reloj
- **WHEN** un juego cuyo recurso es el tiempo agota sus segundos
- **THEN** el juego determina que el usuario ha perdido la partida

### Requirement: Un solo significado de vida por juego
El recurso interno SHALL definirse por juego como reintentos O como tiempo, y SHALL NOT mezclar ambos significados dentro de un mismo juego.

#### Scenario: Significado consistente
- **WHEN** un juego define su recurso como reintentos
- **THEN** el tiempo extra no forma parte de ese juego como recurso de "vida"

### Requirement: Intentos globales
El sistema SHALL mantener un pool global de intentos compartido por todos los juegos, que se gasta exclusivamente para continuar tras perder. Navegar, deslizar y ganar no gastan intentos.

#### Scenario: Continuar tras perder
- **WHEN** el usuario pierde en un juego y elige continuar
- **THEN** el sistema gasta 1 intento del pool global

#### Scenario: Ganar no gasta
- **WHEN** el usuario gana en un juego
- **THEN** el pool de intentos no se modifica

#### Scenario: Navegar no gasta
- **WHEN** el usuario hace swipe para probar otros juegos
- **THEN** el pool de intentos no se modifica

### Requirement: Recuperación de intentos al agotarse
Cuando el usuario quiere continuar y no tiene intentos, el sistema SHALL ofrecer una única vía de recuperación: una espera de 15 segundos (offline, con promoción interna) o un anuncio real (online).

#### Scenario: Espera offline
- **WHEN** el usuario está sin conexión, pierde y no tiene intentos
- **THEN** el sistema muestra una espera de 15 segundos (con una promoción interna de otros juegos) y luego concede 1 intento, sin mostrar anuncios reales

#### Scenario: Anuncio online
- **WHEN** el usuario tiene conexión, pierde y no tiene intentos
- **THEN** el sistema muestra un anuncio real y, al terminar, concede 1 intento

### Requirement: Modo premium
El modo premium SHALL otorgar intentos ilimitados y eliminar los anuncios.

#### Scenario: Usuario premium
- **WHEN** un usuario premium pierde y quiere continuar
- **THEN** el sistema no muestra espera ni anuncio y le permite continuar sin gastar intentos
