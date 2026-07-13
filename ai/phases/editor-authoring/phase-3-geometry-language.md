# Fase 3 — Lenguaje geométrico completo

## Resultado

El modelo, runtime e inspector pueden construir diagramas complejos mediante objetos, dependencias, restricciones, mediciones y anotaciones reactivas, sin recurrir a JavaScript arbitrario.

El estado vigente se consulta en la [matriz canónica](README.md#fuente-canónica-de-estado).

## Skills y contexto

- `project-philosophy`
- `diagrama`
- `DiagramSpec v2` y renderer compartido cerrados en la Fase 2

## Familias requeridas

- Puntos libres, derivados y restringidos.
- Segmentos, rectas, semirrectas, polígonos, círculos y arcos.
- Curvas de funciones y paramétricas.
- Geodésicas del disco de Poincaré.
- Ángulos, perpendicularidad y marcas de congruencia.
- Líneas de cota y medidas de congruencia.
- Cuadrículas y descomposiciones de área, incluidos los cuadrados de Pitágoras.
- Etiquetas, fórmulas y paneles con valores actualizados.
- Capas, grupos, bloqueo, ocultación y orden visual.
- Grafo explícito de dependencias y restricciones.
- DSL segura para expresiones matemáticas.

## Criterios de aceptación

- Cada familia dispone de creación, selección, inspector, serialización y renderer.
- Los elementos recurrentes usan helpers coherentes de `MathFactory`.
- No se dispersan llamadas directas a `board.create` cuando requieren estilo, interacción o accesibilidad compartida.
- Los errores de dependencias o expresiones se muestran sin corromper la escena.

## Validación

- Fixture y tests por familia.
- Pruebas de restricciones, serialización, expresiones seguras y edición visual.
- Accesibilidad básica de herramientas e inspector.
- Tests del editor, tipos, arquitectura y revisión visual.

## Fuera de alcance

Los fixtures prueban el lenguaje; la migración de casos de producción se reserva para la Fase 5.

## Cierre demostrado — 2026-07-13

- `DiagramSpec v2` conserva su versión y compatibilidad exacta, y amplía su contrato con puntos libres, derivados y restringidos; primitivas euclidianas; curvas; objetos del disco de Poincaré; relaciones geométricas; mediciones; cuadrículas; descomposiciones; anotaciones reactivas; capas y grupos.
- Las restricciones y las dependencias son entidades serializadas, referencialmente validadas y ordenadas como un DAG. El movimiento aplica las restricciones habilitadas y rechaza puntos fijos o derivados.
- Las expresiones usan un parser matemático propio con operadores, constantes y funciones permitidas. No se usa `eval`, `Function`, JessieCode ni evaluación arbitraria de JavaScript.
- `DiagramRenderer` interpreta las nuevas familias y concentra en `MathFactory` la creación recurrente, incluidos arcos, curvas, geodésicas, marcas, cotas, cuadrículas y descomposiciones.
- El editor agrupa las herramientas por propósito y ofrece un inspector contextual para referencias, expresiones, restricciones, dependencias, medidas, anotaciones, capa, grupo, visibilidad, bloqueo y orden.
- Ocho fixtures de aceptación cubren por separado puntos y restricciones, primitivas euclidianas, curvas, disco de Poincaré, relaciones y ángulos, mediciones, áreas y cuadrículas, y anotaciones con capas.
- La regresión previa de Fase 2 se verificó antes de implementar: 9 archivos y 44 pruebas aprobadas. El cierre completo alcanza 63 archivos y 622 pruebas aprobadas.
- No se migró ningún diagrama real y no se incorporaron pasos, animaciones ni interacción de demostraciones de la Fase 4.

## Objetos todavía no representables

El contrato declara estos límites de forma conservadora; requieren una fase posterior o una ampliación explícita del lenguaje:

- Curvas implícitas y regiones definidas por ecuaciones o desigualdades de dos variables.
- Funciones a trozos, condicionales y discontinuidades con ramas semánticas propias.
- Intersecciones, tangencias o lugares geométricos que exijan resolución simbólica o numérica genérica entre curvas arbitrarias.
- Transformaciones geométricas y composiciones como objetos de primer nivel; actualmente pueden expresarse coordenadas derivadas, pero no una transformación reusable del grafo.
- Geometría tridimensional, esférica o proyectiva, campos vectoriales y objetos topológicos.
- Imágenes, SVG libre, Canvas libre o extensiones de código arbitrario dentro de `DiagramSpec`; esos casos conservan autoridad de código y preview.
- Secuencias, animaciones, estados interactivos y guiones de demostración, reservados expresamente para la Fase 4.
