## Purpose

Thumbs pixel-art del feed/catálogo para los minijuegos que aún no tenían PNG.

## ADDED Requirements

### Requirement: Thumbs de flap, swipe y hold
El catálogo SHALL mostrar un thumbnail pixel-art en `/assets/thumbs/{id}.png` para `flap`, `swipe` y `hold`, coherente con el estilo cute de contorno duro y key magenta.

#### Scenario: Card de Aleteo
- **WHEN** el usuario ve Aleteo en el feed o en el catálogo
- **THEN** el thumb es arte pixel (pájaro + tubos), no solo las iniciales AL

#### Scenario: Card de Carriles
- **WHEN** el usuario ve Carriles en el feed o en el catálogo
- **THEN** el thumb es arte pixel (carriles + vehículo), no solo las iniciales CA

#### Scenario: Card de Carga
- **WHEN** el usuario ve Carga en el feed o en el catálogo
- **THEN** el thumb es arte pixel (barra de carga + objetivo), no solo las iniciales CA
