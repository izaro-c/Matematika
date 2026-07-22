# Protocolo de autoría visual exacta

Leer este archivo antes de crear o modificar un diagrama. El objetivo no es solo renderizarlo: debe poder reconstruirse y editarse por completo desde el workbench.

## 1. Inventario previo

Enumerar antes de programar:

- objetos visibles y auxiliares;
- referencias y dependencias geométricas;
- restricciones, expresiones y valores derivados;
- estilos, capas, grupos y orden visual;
- puntos móviles, sliders, animaciones y demás controles;
- pasos, estados temporales y overlays;
- targets públicos y conexión con `MathStore`;
- operaciones que una persona debe poder realizar visualmente.

Comparar cada elemento del inventario con `DiagramSpecV3`, `spec/semantics.ts`, `DiagramRenderer`, `DiagramToolbar`, `DiagramInspector`, `DiagramCanvas` y `DiagramWorkbench`. Una capacidad presente solo en el renderer no cuenta como editable.

## 2. Extensión vertical obligatoria

Cuando falte una capacidad, implementarla de extremo a extremo en este orden:

1. **Contrato:** añadir la variante o propiedad declarativa específica en `src/shared/diagrams/spec/v3.ts`, su validación estricta en `schemaV3.ts`, sus capacidades/slots en `semantics.ts` y, si cambia compatibilidad persistida, la migración explícita en `migrations.ts` y `v3Compatibility.ts`.
2. **Semántica:** añadir planificación, restricciones, dependencias, historial o playback en `src/shared/diagrams/spec/` cuando corresponda. No guardar estado semántico en `extensions` para evitar modelarlo.
3. **Render:** añadir o reutilizar la primitiva Arts & Crafts en `src/shared/diagrams/core/MathFactory.ts` y consumirla desde `src/shared/diagrams/runtime/DiagramRenderer.tsx`. Editor y runtime deben compartir este camino.
4. **Creación visual:** incorporar la herramienta, plantilla o construcción guiada en `src/features/editor/diagrams/model/commands.ts` y `ui/DiagramToolbar.tsx`.
5. **Edición visual:** exponer todas las propiedades en `ui/DiagramInspector.tsx`; incorporar selección, manipulación directa y teclado en `ui/DiagramCanvas.tsx` o `DiagramRenderer` según corresponda.
6. **Orquestación:** integrar la capacidad en `src/features/editor/ui/diagrams/DiagramWorkbench.tsx`, incluidos borrar, reordenar, undo/redo, pasos y targets.
7. **Persistencia exacta:** asegurar que `source/generator.ts`, `source/parser.ts`, el reducer y el repositorio conservan el modelo completo sin normalizaciones destructivas.
8. **Validación:** añadir pruebas del schema, renderer, UI, accesibilidad y `generate → parse → generate`. Abrir, editar, guardar, cerrar y reabrir debe conservar fuente y spec.

Todo punto construido sigue siendo `PointObject` y debe satisfacer cualquier slot con capacidad `point`. Perpendicular, paralela y bisectriz son construcciones de un path; las variantes de marcas y anotaciones se expresan como propiedades discriminadas. Las relaciones describen invariantes matemáticos, no objetos derivados.

Las anotaciones reactivas usan una plantilla común. Insertar cálculos con `{= expresion | precision: 2 | unit: "cm"}`; se permiten varios tokens con precisión y unidad independientes en textos, fórmulas, etiquetas, paneles, variantes y overlays. El runtime preserva las llaves ordinarias de KaTeX. El editor visual debe construir el token, validar la expresión y derivar sus dependencias; `{value}` permanece únicamente como lector de compatibilidad.

Si la capacidad necesita SVG, Canvas o HTML, modelar sus parámetros y comportamiento en la spec. La implementación imperativa queda detrás de `DiagramRenderer`; el componente publicado no contiene esa lógica.

## 3. Criterios de aceptación

La capacidad y el diagrama solo están terminados cuando:

- el archivo publicado contiene los marcadores canónicos de spec y el adaptador mínimo generado;
- el parser devuelve `visual-exact`, no `code-preview`;
- toda propiedad con efecto matemático o visual tiene un control comprensible;
- toda colección admite crear, seleccionar, reordenar y eliminar cuando el orden o la pertenencia sean significativos;
- undo/redo cubre las nuevas operaciones;
- teclado y puntero ofrecen las mismas operaciones esenciales;
- el renderer publicado reproduce el lienzo del editor en claro, oscuro y viewports exigidos;
- los targets se registran con IDs públicos estables y reaccionan en ambas direcciones;
- no existe estado necesario fuera de la spec ni en campos opacos sin UI.

No rebajar el alcance a `code-preview`, no mantener un editor parcial y no registrar la carencia como deuda: implementar la funcionalidad ausente forma parte de la creación del diagrama solicitado.

## 4. Validación proporcional

Ejecutar como mínimo las pruebas dirigidas afectadas de `tests/features/editor/diagrams/` y `tests/shared/diagrams/`, además de:

```bash
npm run editor:diagrams:check
npm run editor:diagrams:v3-check
npm run typecheck
git diff --check
```

Para un cambio de producto completo, terminar con `npm run full-check`. Si se añadió o modificó un diagrama final, comprobar también el índice de usos y el catálogo con los scripts del editor correspondientes.
