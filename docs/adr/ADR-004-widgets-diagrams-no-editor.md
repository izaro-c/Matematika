# ADR-004: widgets/diagrams no importa features/editor

## Estado

Aceptado.

## Contexto

El estrangulador FSD+dominios exige que demos publicadas (`widgets/diagrams`) consuman solo el contrato de `shared/diagrams`, no el workbench del editor. Un acoplamiento widgets→editor rompería publicación independiente y reintroduciría el dualismo preview/runtime.

## Decisión

1. `widgets/diagrams/**` no puede importar `features/editor/**` (regla `widgets-diagrams-no-editor` en `.dependency-cruiser.js`).
2. El facade público es `@/diagrams/public` (spec + `DiagramRenderer` + constants).
3. `shared/design` no importa `shared/diagrams` (regla `design-no-diagrams`) para evitar ciclo tokens↔spec.

## Consecuencias

- Nuevas demos solo usan el contrato shared.
- Capacidades de autoría viven solo en `features/editor`.
- Cortes duros: si aparece un import ilegal, se arregla en el mismo PR (sin shims).
