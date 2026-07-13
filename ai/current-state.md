# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-13

**Fase:** Fase 3 — lenguaje geométrico completo, cerrada.

**Estado:** `DiagramSpec v2`, el runtime compartido y el editor visual representan objetos geométricos, restricciones, dependencias, mediciones y anotaciones avanzadas mediante una semántica común. Las expresiones matemáticas se analizan con una DSL segura y no ejecutan JavaScript arbitrario. Los 85 diagramas de producción conservan su TSX manual y su autoridad de código con preview; esta fase no migra casos reales ni incorpora comportamiento de la Fase 4.

## Roadmap activo

La fuente canónica del estado es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). Las Fases 0, 1, 2 y 3 están cerradas. La [Fase 4 — Pasos, interacción y demostraciones](phases/editor-authoring/phase-4-steps-and-interaction.md) permanece pendiente y solo puede comenzar en una conversación nueva.

## Prerrequisito verificado

Antes de modificar el lenguaje se ejecutó la regresión dirigida de `DiagramSpec v2`, renderer, generador, parser, comandos y reducer: 9 archivos y 44 pruebas aprobadas. Se confirmó que el contrato v2 y el renderer compartido de la Fase 2 existían, estaban conectados y tenían cobertura efectiva.

## Lenguaje geométrico cerrado en la Fase 3

- Puntos libres, derivados por expresiones y dependencias, y restringidos mediante relaciones explícitas.
- Segmentos, rectas, semirrectas, polígonos, círculos, arcos, curvas de función y curvas paramétricas.
- Geodésicas y arcos del disco de Poincaré, con construcción ortogonal al borde y caso diametral.
- Ángulos, marcas de congruencia y perpendicularidad, cotas y medidas con unidad y precisión configurables.
- Cuadrículas y descomposiciones visuales de área reutilizables para construcciones como los cuadrados del teorema de Pitágoras.
- Etiquetas, fórmulas y paneles informativos cuyos valores se recalculan desde la escena.
- Capas, grupos, visibilidad, bloqueo, selección y orden visual conservados por serialización.

## Contrato, grafo y seguridad

- `src/shared/diagrams/spec/` define tipos, schema Zod, cálculo de escena, restricciones y un grafo explícito de dependencias. El schema valida IDs, referencias, aridades, expresiones, dependencias implícitas declaradas y ausencia de ciclos.
- La DSL admite aritmética, potencias, constantes y una lista cerrada de funciones matemáticas. Un tokenizer y parser propios generan el AST; no se emplean `eval`, `Function`, JessieCode ni otras vías de evaluación arbitraria.
- Las restricciones soportadas incluyen posición fija, coincidencia, horizontalidad, verticalidad, pertenencia, distancia, interior del disco, perpendicularidad y paralelismo. El movimiento puro respeta las restricciones activas y no modifica puntos fijos o derivados.
- El orden de construcción combina referencias y dependencias explícitas; el orden visual sigue gobernado de forma separada por capas y orden local.
- `DiagramSpec` conserva la versión literal `2`: las escenas anteriores siguen validando y serializando sin normalización destructiva.

## Runtime y editor

- `DiagramRenderer` interpreta todas las familias nuevas tanto en publicación como en preview y editor. Las expresiones se evalúan contra valores vivos de puntos, deslizadores y medidas; un error produce un valor no representable sin corromper la escena.
- `MathFactory` centraliza los comportamientos recurrentes: arcos, funciones, paramétricas, geodésicas de Poincaré, marcas, cotas, cuadrículas y descomposiciones. El renderer no dispersa llamadas directas a `board.create`.
- La barra de herramientas organiza las acciones en Edición, Geometría, Curvas, Relaciones y Explicación, con nombres comprensibles y disponibilidad según la selección.
- El inspector contextual edita referencias, coordenadas derivadas, restricciones, dependencias, dominios, expresiones, medidas, fórmulas, paneles, capas, grupos, visibilidad, bloqueo y orden.
- Renombrado y borrado mantienen la integridad de referencias, restricciones y aristas; el TSX generado conserva roundtrip exacto para el contrato ampliado.

## Fixtures y evidencia de aceptación

- Ocho fixtures independientes cubren puntos y restricciones, primitivas euclidianas, curvas, disco de Poincaré, relaciones y ángulos, medidas, áreas y cuadrículas, y anotaciones con capas.
- Las pruebas de Fase 3 ejercitan validación y serialización de cada familia, rechazo de JavaScript y ciclos, aplicación de restricciones, construcción real del renderer compartido y edición desde toolbar e inspector.
- Pruebas dirigidas de diagramas y editor: 18 archivos y 104 pruebas aprobadas durante el desarrollo.
- `editor:full-check`: artefactos deterministas mediante índice Git temporal, roundtrip 120/120, lint dirigido, 132 pruebas unitarias, 79 de integración, arquitectura, seguridad, TypeScript y build aprobados.
- `full-check`: 63 archivos y 622 pruebas, lint sin errores, TypeScript, Dependency Cruiser, referencias, grafo, Lean, cobertura de 120 contenidos y auditoría bridge aprobados.
- `editor:lint`: 119 advertencias dentro del presupuesto máximo de 119 y 0 errores. Dependency Cruiser conserva 56 advertencias históricas y 0 errores sobre 355 módulos y 1007 dependencias.
- Lean compila 12 trabajos, el grafo registra 66 nodos verificados y 9 bloques de prueba, y la cobertura Lean-MDX permanece completa.
- `editor:diagrams:check`: 85 diagramas finales en código con preview, 0 falsos positivos de edición visual, 25 recursos internos excluidos y 0 fuentes inválidas.
- Los artefactos generados se regeneraron con los scripts oficiales y `editor:generated:check` confirmó que todos son deterministas y están actualizados.
- `git diff --check`: aprobado tras el cierre documental.

## Límites y deuda explícita

- No se migró ningún diagrama de producción. La migración de casos reales permanece reservada a la Fase 5.
- No se representan todavía curvas implícitas o regiones por desigualdades, funciones a trozos, resolución genérica de intersecciones o tangencias, transformaciones como objetos de primer nivel, geometría 3D/esférica/proyectiva, campos vectoriales ni objetos topológicos.
- Imágenes, SVG/Canvas libre y código arbitrario no entran en `DiagramSpec`; conservan autoridad de código y preview.
- Pasos, animaciones, estados interactivos y guiones de demostración pertenecen a la Fase 4 y no se adelantaron.
- El presupuesto dirigido de lint queda agotado en 119 advertencias. `MathFactory`, `DiagramRenderer` y las fronteras JSXGraph conservan tipos `any` y avisos de complejidad no bloqueantes que deben reducirse antes de ampliar ese presupuesto.
- El build conserva los avisos históricos de chunks superiores a 500 kB y del `eval` interno de JessieCode/JSXGraph; la DSL de esta fase no usa ninguno de ellos.
- La skill `diagrama` mantiene referencias operativas anteriores al facade y al renderer compartidos. La regla de autoactualización exige una propuesta y aprobación separadas, por lo que no se alteró en esta fase.

## Objetos todavía no representables

La lista canónica y razonada se mantiene en [`phase-3-geometry-language.md`](phases/editor-authoring/phase-3-geometry-language.md#objetos-todavía-no-representables). Estos límites se consideran falta de capacidad declarada, no soporte parcial ni edición visual exacta.

## Veredicto

`FASE 3 CERRADA — LENGUAJE GEOMÉTRICO, RESTRICCIONES, MEDICIONES Y ANOTACIONES AVANZADAS OPERATIVOS SIN MIGRAR PRODUCCIÓN NI ADELANTAR FASE 4`
