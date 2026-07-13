# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-13

**Fase:** Fase 0 — Verdad de capacidades y catálogo seguro, cerrada.

**Estado:** El editor publica un catálogo explícito y conservador. Solo expone los 120 documentos MDX reales de `src/database/content/` y los 85 diagramas finales de `src/widgets/diagrams/`. Los recursos internos quedan fuera del catálogo editable. Ningún diagrama actual se declara de edición visual exacta: los 85 se clasifican como edición de código con vista previa real porque su fuente manual no puede regenerarse íntegramente desde el modelo visual.

## Roadmap activo

La fuente canónica del estado y alcance de la nueva épica es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). La Fase 0 está cerrada y la siguiente fase elegible es la [Fase 1 — Arquitectura visual y navegación](phases/editor-authoring/phase-1-information-architecture.md), todavía pendiente. Esta numeración es independiente de la épica histórica [`phases/editor-stabilization.md`](phases/editor-stabilization.md).

## Garantías cerradas en la Fase 0

- La clasificación pública distingue `visual-exact`, `code-preview`, `internal` e `invalid`; ya no existe la equivalencia engañosa compatible/no compatible.
- Un modelo visual solo adquiere autoridad cuando el generador reproduce el TSX completo byte a byte. Encontrar puntos u otros fragmentos mediante AST solo produce un modelo de inspección no autoritativo.
- Al editar código se invalida inmediatamente cualquier modelo visual anterior. El guardado conserva el TSX completo y la regeneración queda oculta mientras no exista roundtrip exacto.
- `rawModel` conserva el sobre completo, incluidos `componentId`, categoría, modo, ejes, cuadrícula, bounding box, nota, puntos, elementos, sliders y pasos.
- El backend limita lectura y escritura a las raíces editables y rechaza TSX vacío, sintácticamente inválido o sin un componente final exportado.
- La interfaz oculta creación, reemplazo, inserción por targets y operaciones estructurales que todavía no disponen de parches localizados exactos.
- `MathBoard`, `MathFactory`, `MathUtils`, plantillas y demás infraestructura de `src/shared/diagrams/` y `src/shared/templates/` se clasifican como recursos internos y no se publican en el catálogo editable.
- `InteractiveGeometryCanvas` fue retirado tras comprobar que no tenía consumidores de producto. Se conserva lectura legacy para detectarlo y una validación que impide volver a guardarlo como diagrama válido.

## Evidencia de aceptación

- Catálogo real: 120 MDX, 85 diagramas finales, 14 recursos internos excluidos y 0 recursos inválidos.
- Capacidades de diagramas: 0 de edición visual exacta y 85 de código con vista previa.
- Suite completa del editor: 27 archivos y 228 pruebas aprobadas, incluidos catálogo, clasificación, roundtrip y protección ante curvas, expresiones, pasos, overlays y código manual no representable.
- Roundtrip MDX del corpus: 120/120 documentos lossless.
- `editor:diagrams:check`, `editor:safety:check`, arquitectura, TypeScript, build y `git diff --check`: aprobados.
- Artefactos generados: regenerados con los comandos oficiales y verificados como deterministas mediante el gate oficial con un índice Git temporal, sin modificar el staging real.

## Deuda explícita fuera de la Fase 0

- No hay diagramas existentes con modelo visual exacto. Convertirlos o ampliar el modelo corresponde a una fase posterior.
- La vista previa de código ejecuta la última versión guardada; los cambios sin guardar aparecen después de una persistencia válida.
- ESLint conserva el presupuesto histórico de 119 advertencias y Dependency Cruiser conserva advertencias arquitectónicas previas, sin errores nuevos bloqueantes.
- Los flujos de creación y enlace estructural permanecen ocultos hasta que puedan implementarse mediante operaciones lossless. No se avanza a la Fase 1 en este cierre.

## Veredicto

`FASE 0 CERRADA — CATÁLOGO FIEL Y SIN REGENERACIÓN DESTRUCTIVA SILENCIOSA`
