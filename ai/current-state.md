# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-13

**Fase:** Fase 4 — pasos, interacción y demostraciones, cerrada.

**Estado:** `DiagramSpec v2`, el renderer compartido y el editor visual comparten una semántica temporal completa. Una secuencia puede construirse, inspeccionarse en una matriz objetos × pasos, reproducirse, persistirse y reabrirse sin editar el TSX. Los targets públicos son estables y admiten varios diagramas por página. La Fase 5 permanece pendiente: no se migró ningún diagrama real ni se amplió el alcance de aceptación matemática.

## Roadmap activo

La fuente canónica del estado es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). Las Fases 0, 1, 2, 3 y 4 están cerradas. La [Fase 5 — Migración de casos matemáticos complejos](phases/editor-authoring/phase-5-acceptance-migrations.md) permanece pendiente y solo puede comenzar en una conversación nueva.

## Autoría visual de secuencias

- El editor incluye una línea temporal ordenada con creación, selección, duplicado profundo, borrado y movimiento de pasos.
- Cada paso conserva etiqueta, descripción y duración, además de visibilidad, énfasis primario o secundario, etiqueta temporal, interactividad y valor temporal de cada objeto.
- La matriz objetos × pasos resume el comportamiento completo con celdas accesibles; el inspector de celda expone los cambios sin exigir lectura del código fuente.
- Los overlays por objeto admiten título, contenido, posición, unidad, precisión y expresiones reactivas. Las expresiones usan la DSL matemática segura de la Fase 3 y muestran un fallback explícito si no se pueden evaluar.
- `StepNavigator` proporciona reinicio, anterior, reproducción, pausa y siguiente en el editor y en el runtime que lo solicite. Por decisión de producto, no se muestra en `DemonstrationSection`: las páginas de demostración conservan su lectura y scrollytelling por `ProofStep` sin una barra adicional.

## Estado temporal y stores

- `MathStore` mantiene de forma separada `step`/`step:<componentId>` y `highlight`/`highlight:<componentId>`. Cambiar de paso no borra el resaltado externo y el resaltado no muta el estado temporal.
- El renderer vuelve a calcular la escena desde el paso activo; al abandonarlo restituye etiquetas, valores, interactividad y overlays de la especificación base, sin residuos.
- `LessonStore` permanece reservado a ejercicios y simulaciones existentes. No se duplicó en él la semántica de demostración.
- La reproducción se modela mediante un reducer puro con selección, avance, pausa, tick y reinicio; al llegar al final se detiene.

## Targets estables y varios diagramas

- Cada objeto puede publicar un `targetId` estable distinto de su ID interno. Renombrar el objeto interno conserva el target público.
- El registro compartido agrupa targets por `componentId`; la forma cualificada `componentId:targetId` resuelve ambigüedades cuando una página contiene varios diagramas.
- Los targets no cualificados siguen funcionando cuando son únicos. Si se repiten entre diagramas se informa la ambigüedad; los duplicados dentro de un mismo diagrama son error.
- El selector visual permite publicar, renombrar y copiar targets de objetos y pasos. La validación de página revisa `ConceptLink`, elementos interactivos y `ProofStep`, e informa referencias inexistentes o ambiguas.
- `VisualBind` opera con ratón, foco, Enter y Espacio, conserva roles y nombres accesibles, y solo modifica el resaltado externo.

## Demostraciones y Lean

- `ProofStep` acepta uno o varios targets y mantiene atributos estables para el scrollytelling y las justificaciones pedagógicas.
- El parser/editor conserva `leanBlocks` y expresiones de `stepTacticMap`. Cuando existen, se muestran como traza de solo lectura junto al paso.
- La interfaz declara que la traza Lean complementa la comprobación mecánica y no sustituye la justificación Greenberg/Hilbert.
- La página publicada de demostración no incorpora `StepNavigator`; la sincronización texto-diagrama existente sigue gobernada por el scroll y `MathStore`.

## Evidencia de aceptación

- Tres suites nuevas cubren CRUD y reordenación, separación paso/resaltado, targets estables, referencias ausentes o duplicadas, overlays reactivos, reproducción, accesibilidad, múltiples diagramas y trazas Lean.
- La prueba de persistencia construye una secuencia compleja con estados y overlays, genera TSX, lo vuelve a abrir con el parser y exige regeneración byte a byte idéntica.
- La regresión de demostraciones comprueba que `ProofStep` sigue presente y que no existe una navegación `StepNavigator` en la página.
- `editor:full-check`, ejecutado con índice Git temporal aislado: artefactos deterministas actualizados, roundtrip lossless 120/120, lint dirigido, 147 pruebas unitarias, 79 de integración, arquitectura, seguridad, TypeScript y build aprobados.
- `editor:lint`: 119 advertencias dentro del presupuesto máximo de 119 y 0 errores.
- Dependency Cruiser: 56 advertencias históricas, 0 errores, 360 módulos y 1031 dependencias.
- `full-check`: lint sin errores, TypeScript, 66 archivos y 637 pruebas, arquitectura, referencias, grafo, Lean, cobertura y bridge aprobados.
- Lean compila 12 trabajos; el grafo conserva 66 nodos verificados y 9 bloques, y la cobertura Lean-MDX permanece en 24/24 páginas y 25/25 demostraciones.

## Límites y deuda explícita

- No se migró ni se declaró editable visualmente ningún caso de producción; esa aceptación pertenece exclusivamente a la Fase 5.
- Las extensiones temporales de `DiagramSpec v2` son opcionales y no cambian su versión literal ni normalizan escenas anteriores de forma destructiva.
- Los targets no cualificados duplicados entre diagramas se mantienen como broadcast compatible en runtime, pero el editor exige la forma cualificada para una conexión inequívoca.
- El presupuesto dirigido de lint queda agotado en 119 advertencias. El build conserva avisos históricos de chunks superiores a 500 kB y del `eval` interno de JessieCode/JSXGraph; la DSL de overlays no usa esas vías.
- La skill `diagrama` conserva rutas y patrones anteriores al renderer compartido. Su actualización requiere propuesta y aprobación separadas; no se modificó durante esta fase.

## Veredicto

`FASE 4 CERRADA — SECUENCIAS VISUALES, INTERACCIÓN, TARGETS ESTABLES Y CONEXIÓN CON DEMOSTRACIONES OPERATIVOS SIN ADELANTAR LA FASE 5`
