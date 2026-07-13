# Fase 0 — Verdad de capacidades y catálogo seguro

## Resultado

El editor solo publica recursos reales y describe con precisión qué puede modificar sin pérdida. Ninguna fuente manual se regenera desde un modelo parcial.

El estado vigente se consulta en la [matriz canónica](README.md#fuente-canónica-de-estado). El cierre inicial y su evidencia están registrados en [`../../current-state.md`](../../current-state.md).

## Skills y contexto

- `project-philosophy`
- `diagrama`
- Arquitectura vigente del editor y backend de persistencia

## Alcance

- Catálogo explícito para documentos MDX reales y diagramas finales.
- Exclusión de infraestructura, factories, templates y componentes base.
- Clasificación `visual-exact`, `code-preview`, `internal` e `invalid`.
- Autoridad visual únicamente con roundtrip completo demostrable.
- Preservación del sobre completo de `rawModel`.
- Restricción backend a raíces editables y fuentes TSX válidas.
- Ocultación de creación, sustitución y mutaciones estructurales todavía inseguras.
- Retirada de `InteractiveGeometryCanvas` solo tras comprobar consumidores.

## Criterios de aceptación

- Un punto encontrado por AST no basta para declarar edición visual exacta.
- Curvas, expresiones, pasos, overlays y código manual no representable se conservan.
- No aparecen `MathBoard`, `MathFactory`, `MathUtils` ni templates en el catálogo editable.
- Una edición de código invalida inmediatamente cualquier modelo visual previo.
- Los mensajes y controles reflejan la capacidad real.

## Validación mínima

- Pruebas de catálogo, parser, generador, repositorio y roundtrip.
- `npm run editor:diagrams:check`
- `npm run editor:safety:check`
- `npm run typecheck`
- Gates de arquitectura y build aplicables.
- `git diff --check`

## Fuera de alcance

No se amplía todavía el lenguaje geométrico ni se rediseña toda la navegación. Los diagramas manuales pueden permanecer en código con preview.
