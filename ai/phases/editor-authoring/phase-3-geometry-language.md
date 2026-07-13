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
