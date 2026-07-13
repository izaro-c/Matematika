# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-13

**Fase:** Fase 5 — migración de casos matemáticos complejos, cerrada.

**Estado:** Pitágoras, el disco de Poincaré, congruencia ALA y paralelogramo son modelos `DiagramSpec v2` visualmente exactos. Los cuatro regeneran su TSX byte a byte, conservan sus consumidores MDX y se renderizan en sus páginas reales sin colapso ni pérdida de textos reactivos. La Fase 6 permanece pendiente y no se ha iniciado.

## Roadmap activo

La fuente canónica del estado es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). Las Fases 0, 1, 2, 3, 4 y 5 están cerradas. La [Fase 6 — Motor MDX estructural y lossless](phases/editor-authoring/phase-6-lossless-mdx-engine.md) permanece pendiente y solo puede comenzar en una conversación nueva.

## Casos reales migrados

- **Pitágoras:** conserva `triangulo`, `cuadrado-a`, `cuadrado-b` y `cuadrado-c`; incluye tres cuadrados cuadriculados, áreas e identidad dinámicas, gliders sobre semirrectas positivas y tres pasos con resaltados.
- **Disco de Poincaré:** muestra la frontera completa, una geodésica principal, dos paralelas límite y cuatro ultraparalelas como arcos ortogonales; los extremos permanecen en la frontera y el punto interior se restringe al disco.
- **Congruencia ALA:** conserva `globalmente-congruentes`, `lado-ab`, `angulo-a` y `angulo-b`; incluye dos triángulos dependientes, seis ángulos, seis marcas de congruencia, dos cotas y textos reactivos.
- **Paralelogramo:** conserva `paralelogramo`, `lados-opuestos`, `angulos-opuestos` y `diagonales`; deriva `D` y el punto medio `M`, mantiene siete capas, tres pasos y clasificación reactiva de paralelogramo, rombo, rectángulo y cuadrado.

## Correcciones del modelo común

- Los grupos publican targets estables y trasladan su resaltado a todos sus miembros sin cambiar IDs públicos.
- La restricción `sameSide`, los estilos visuales persistibles y las reglas `visibleWhen`/`textRules` amplían el lenguaje común; no hay parches exclusivos de un caso.
- `MathBoard` observa un contenedor estable, distingue resize programático de pan/zoom y evita mutar el viewport al abrir. `DiagramRenderer` y `StepNavigator` reutilizan el `MathProvider` exterior o crean uno solo para previews aislados.
- Los textos JSXGraph se mantienen como HTML fuera de las capas SVG; áreas, cotas y paneles reactivos tienen dimensiones visibles reales. El disco preserva su relleno translúcido y los paneles de pasos no se superponen.

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

- `Phase5AcceptanceMigrations.test.ts` fija snapshots estructurales de los cuatro diagramas, roundtrip byte a byte, targets MDX reales, restricciones, geodésicas ortogonales, dependencias, capas, pasos y clasificación.
- Las regresiones del renderer montan el componente y el editor de pasos reales de Pitágoras sin `MathProvider` exterior; `MathBoardViewport.test.tsx` separa cambios de usuario y ajustes programáticos.
- `npm run test:e2e:phase5` abre las cuatro rutas publicadas en Chromium, exige boards no colapsados, escenas completas, textos reactivos visibles y ausencia de errores; después recorre catálogo → Pitágoras → edición visual exacta y comprueba estado sincronizado.
- La inspección visual real se realizó a 1440 × 900 y la del editor a 1600 × 1100. Poincaré, paralelogramo, ALA y Pitágoras muestran el diagrama completo; el editor de Pitágoras conserva `[-8, 8, 8, -8]` al abrir.
- Tres suites nuevas cubren CRUD y reordenación, separación paso/resaltado, targets estables, referencias ausentes o duplicadas, overlays reactivos, reproducción, accesibilidad, múltiples diagramas y trazas Lean.
- La prueba de persistencia construye una secuencia compleja con estados y overlays, genera TSX, lo vuelve a abrir con el parser y exige regeneración byte a byte idéntica.
- La regresión de demostraciones comprueba que `ProofStep` sigue presente y que no existe una navegación `StepNavigator` en la página.
- `editor:full-check`, ejecutado con índice Git temporal aislado: artefactos deterministas actualizados, roundtrip lossless 120/120, lint dirigido, 157 pruebas unitarias, 79 de integración, arquitectura, seguridad, TypeScript y build aprobados.
- `editor:lint`: 119 advertencias dentro del presupuesto máximo de 119 y 0 errores.
- Dependency Cruiser: 56 advertencias históricas, 0 errores, 360 módulos y 1027 dependencias.
- `full-check`: lint sin errores, TypeScript, 67 archivos y 649 pruebas, arquitectura, referencias, grafo, Lean, cobertura y bridge aprobados.
- Lean compila 12 trabajos; el grafo conserva 66 nodos verificados y 9 bloques, y la cobertura Lean-MDX permanece en 24/24 páginas y 25/25 demostraciones.

## Límites y deuda explícita

- No se realizó una migración masiva de los 85 diagramas; solo los cuatro casos de aceptación cuentan con evidencia de fidelidad y edición visual exacta en esta fase.
- Las extensiones temporales de `DiagramSpec v2` son opcionales y no cambian su versión literal ni normalizan escenas anteriores de forma destructiva.
- Los targets no cualificados duplicados entre diagramas se mantienen como broadcast compatible en runtime, pero el editor exige la forma cualificada para una conexión inequívoca.
- El presupuesto dirigido de lint queda agotado en 119 advertencias. El build conserva avisos históricos de chunks superiores a 500 kB y del `eval` interno de JessieCode/JSXGraph; la DSL de overlays no usa esas vías.
- La skill `diagrama` conserva rutas y patrones anteriores al renderer compartido. Su actualización requiere propuesta y aprobación separadas; no se modificó durante esta fase.

## Veredicto

`FASE 5 CERRADA — CUATRO DIAGRAMAS REALES EDITABLES, REABRIBLES Y PUBLICADOS SIN PÉRDIDA; FASE 6 NO INICIADA`
