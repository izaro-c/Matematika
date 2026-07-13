# ADR-003: DiagramSpec v2 y renderer compartido

## Estado

Aceptada e implementada para escenas nuevas y fixtures representativos. Los diagramas TSX manuales de producción no se migran en esta fase.

## Contexto

El workbench dibujaba un SVG simplificado a partir de su modelo mientras el contenido publicado ejecutaba `MathBoard` y `MathFactory`. Una misma escena podía, por tanto, tener geometría, orden visual e interacción diferentes según se observara en el editor o en la página final. El generador agravaba el acoplamiento al emitir una implementación completa de JSXGraph y el parser solo podía considerar exactas fuentes cuyo sobre privado coincidía byte a byte.

## Decisión

1. `DiagramSpec v2` es el contrato serializable canónico de una escena representable. Incluye una versión literal, identificador de renderer, viewport persistente, capas, grupos, puntos, elementos, sliders, pasos y metadatos de selección.
2. Zod valida tanto la forma como las invariantes cruzadas: IDs únicos, capas existentes, miembros de grupo, referencias geométricas, gliders y targets de pasos. Los diagnósticos conservan la ruta del campo que falla.
3. Toda entrada externa pasa por `migrateDiagramSpec`. La versión 1 y el formato histórico sin versión tienen una migración explícita a v2; una versión futura o sin ruta se rechaza con código y mensaje comprensibles. La migración se realiza en memoria y no reescribe fuentes manuales.
4. `DiagramRenderer` en `src/shared/diagrams/runtime/` es el único intérprete de la escena para runtime, preview y editor. El modo cambia únicamente capacidades de autoría —selección, movimiento o creación—, no la geometría ni el orden de dibujo.
5. `createScenePlan` concentra visibilidad, bloqueo, orden de capa, orden local, grupos, pasos, selección y resaltado. Las funciones de viewport, recuperación y cálculo de contenido viven junto a esa semántica en `shared`.
6. El TSX generado contiene el spec validado y un adaptador fino a `DiagramRenderer`. No reproduce llamadas a `MathBoard` ni `MathFactory`.
7. Una fuente solo obtiene autoridad visual cuando el parser puede regenerarla completa y byte a byte. Cualquier extensión manual, overlay o comportamiento no representado conserva autoridad de código y preview; nunca se sobrescribe desde un modelo parcial.
8. El historial almacena comandos de snapshots con límite finito, bifurcación segura y redo invalidado tras una edición nueva. Los eventos continuos de viewport se agrupan solo dentro de una ventana temporal; cada gesto de punto forma un comando independiente.

## Límite FSD

- `src/shared/diagrams/spec/` no depende de React, JSXGraph ni del editor.
- `src/shared/diagrams/runtime/` depende del spec y del core compartido de diagramas.
- `src/features/editor/diagrams/` adapta herramientas, inspector, persistencia y estado a esas APIs; no contiene otro renderer.
- El facade productivo es `@/shared/diagrams/public`. Los módulos ejecutados también desde `vite.config.ts` importan el submódulo puro `spec` por ruta relativa para no arrastrar el runtime React al proyecto Node.

## Viewport y recuperación

El bounding box se persiste en el spec. `MathBoard` expone cambios de pan y zoom sin reconstruir el tablero en cada movimiento. El renderer ofrece acercar, alejar, ajustar a todo el contenido y recuperar objetos seleccionados o fuera de vista. Las mismas funciones puras calculan los bounds en editor y runtime.

## Consecuencias

- Editor, preview y publicación comparten semántica y camino de renderizado comprobables.
- Añadir una propiedad al spec exige schema, migración cuando corresponda y soporte único en el renderer.
- El spec v2 cubre únicamente el lenguaje representable actual. Curvas, expresiones seguras, mediciones avanzadas y nuevas familias geométricas pertenecen a la Fase 3.
- Los 85 diagramas manuales actuales continúan en modo código con preview. Su migración masiva queda fuera de alcance y requiere evidencia posterior de fidelidad.

## Evidencia

Los fixtures `tests/fixtures/diagrams/diagram-spec-v1.json` y `diagram-spec-v2.json` cubren migración, capas, grupos, pasos y recuperación de un objeto fuera del lienzo. Las suites bajo `tests/shared/diagrams/` y `tests/features/editor/diagrams/` verifican schema, migraciones, escena, renderer, historial, generación, parsing y roundtrip exacto.
