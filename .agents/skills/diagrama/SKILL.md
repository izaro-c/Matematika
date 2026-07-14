---
name: diagrama
description: Crea o modifica diagramas matemáticos interactivos como DiagramSpec v2 con roundtrip visual-exact en el editor de Matematika. Usar para cualquier trabajo en src/widgets/diagrams/ o src/shared/diagrams/. Si el diagrama deseado requiere una primitiva, propiedad o interacción que el editor aún no ofrece, ampliar primero schema, renderer, workbench, persistencia y pruebas hasta que el diagrama sea 100% editable visualmente; nunca entregar un diagrama nuevo como code-preview.
---

# Diagramas matemáticos editables

Crear diagramas interactivos, accesibles y coherentes con la paleta Arts & Crafts. Hacer que la fuente autoritativa sea siempre una `DiagramSpec v2` completamente manipulable desde el editor visual.

## Contrato innegociable

Considerar un diagrama terminado solo si cumple todo:

1. Generar su TSX canónico con `generateDiagramSource`; exigir que `parse → generate` lo reproduzca byte a byte y que el catálogo lo clasifique como `visual-exact`.
2. Permitir crear, seleccionar, modificar, reordenar y eliminar desde el workbench todo estado con significado: objetos, referencias, restricciones, expresiones, estilos, capas, grupos, orden, pasos, overlays, targets, viewport e interacción.
3. Conservar spec y fuente al usar undo/redo, guardar, cerrar, reabrir, validar y resolver conflictos.
4. Usar `DiagramRenderer` tanto en el lienzo del editor como en preview y publicación.
5. Evitar estado semántico en callbacks, closures, JSX manual, cadenas opacas o `extensions` sin controles visuales.
6. Ofrecer por teclado toda operación esencial disponible con puntero, con foco visible, nombres accesibles y comportamiento correcto en temas y viewports exigidos.

Reservar `code-preview` para fuentes heredadas no intervenidas. Al modificar un diagrama solicitado que esté en `code-preview`, migrarlo primero a `visual-exact`. No entregar nunca un diagrama nuevo o modificado en estado parcial.

## Flujo obligatorio

1. Leer [references/visual-authoring.md](references/visual-authoring.md).
2. Inventariar objetos visibles y auxiliares, relaciones, restricciones, expresiones, estilos, controles, pasos, overlays, targets y operaciones visuales requeridas.
3. Comparar el inventario con `DiagramSpecV2`, `DiagramRenderer`, `DiagramToolbar`, `DiagramInspector`, `DiagramCanvas` y `DiagramWorkbench`.
4. Si falta cualquier capacidad, detener la creación del diagrama y ampliar primero schema, semántica, renderer, controles visuales, persistencia y pruebas. Incluir esa ampliación en la misma tarea; no aplazarla como deuda.
5. Crear el diagrama mediante el modelo visual y el adaptador canónico. No escribir lógica manual en el componente publicado.
6. Reabrirlo en el workbench, modificar visualmente al menos una propiedad de cada capacidad nueva, guardar y comprobar el roundtrip exacto.
7. No cerrar el trabajo mientras alguna operación semántica requiera la pestaña de código o se pierda información al reabrir.

## Arquitectura

- Publicar componentes en `src/widgets/diagrams/`.
- Mantener contrato, core y renderer en `src/shared/diagrams/{spec,core,runtime}/`.
- Encapsular JSXGraph, SVG, Canvas o HTML dentro del renderer compartido. Si un backend aún no está modelado, añadir su representación declarativa y sus controles antes de usarlo.
- Añadir primitivas reutilizables a `src/shared/diagrams/core/MathFactory.ts`; reservar `board.create` para auxiliares invisibles internos y no usar nunca `JXG.JSXGraph.initBoard`.
- Consumir únicamente `lienzo`, `carbon`, `salvia`, `terracota`, `pizarra`, `ocre`, `pavo`, `granada` y `musgo` mediante los tokens del tema.
- Conectar pasos y targets con `MathStore`; mantener IDs públicos estables y bidireccionalidad entre texto y diagrama.
- Respetar las dependencias FSD: `shared` no puede depender de `features`, `widgets`, `pages` ni `app`.

## Extender el editor cuando falte funcionalidad

Implementar una sección vertical completa:

1. Tipos, schema estricto y migración en `src/shared/diagrams/spec/`.
2. Primitiva Arts & Crafts en `MathFactory` y render en `DiagramRenderer`.
3. Herramienta o construcción en `model/commands.ts` y `DiagramToolbar.tsx`.
4. Todos los controles de propiedades en `DiagramInspector.tsx`.
5. Selección, manipulación directa y teclado en `DiagramCanvas.tsx` o el renderer.
6. Orquestación de crear, borrar, reordenar, pasos, targets y undo/redo en `DiagramWorkbench.tsx`.
7. Roundtrip lossless en generador, parser, reducer y repositorio.
8. Pruebas de schema, renderer, UI, accesibilidad, persistencia y `generate → parse → generate`.

No considerar editable una capacidad presente solo en la spec o solo en el renderer: debe tener controles visuales completos.

## Referencias bajo demanda

- Leer [references/patterns.md](references/patterns.md) solo para el tipo concreto de geometría, interacción, animación o layout que se esté implementando.
- Usar como ejemplos los diagramas `visual-exact` que enumera `npm run editor:diagrams:check`, especialmente `Paralelogramo`, `ModeloPoincare`, `CongruenciaALA` y `Pitagoras`.
- Cargar `page-creator` si también se modifica MDX y `project-philosophy` si se necesita resolver una decisión de producto o rigor.

## Validación

Ejecutar pruebas dirigidas en `tests/features/editor/diagrams/` y `tests/shared/diagrams/`. Comprobar además:

```bash
npm run editor:diagrams:check
npm run typecheck
git diff --check
```

Para cambios de producto, terminar con `npm run full-check`. Si cambia un diagrama final, comprobar también catálogo e índice de usos. Validar siempre esta skill con `quick_validate.py`.
