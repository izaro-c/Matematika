# Fase 4 — Pasos, interacción y demostraciones

## Resultado

Los cambios temporales de un diagrama se pueden crear, inspeccionar y reproducir visualmente, y se conectan mediante targets estables con el texto y las demostraciones.

El estado vigente se consulta en la [matriz canónica](README.md#fuente-canónica-de-estado).

## Skills y contexto

- `project-philosophy`
- `diagrama`
- `MathStore`, `LessonStore`, ProofSteps, StepNavigator, overlays y registro de targets

## Entregables

- Línea temporal con creación, duplicado, borrado y reordenación.
- Matriz objetos por pasos para visibilidad, énfasis, etiquetas, overlays y estado interactivo.
- Reproducción, pausa, anterior, siguiente y reinicio.
- Separación entre estado temporal del paso y resaltado externo.
- Registro estable de targets y selector visual.
- Validación de targets ausentes o duplicados.
- Paneles de información con mediciones y expresiones reactivas.
- Compatibilidad con varios diagramas en una página.
- Trazas Lean de solo lectura cuando existan, sin sustituir la justificación pedagógica.

## Criterios de aceptación

- Una secuencia compleja se construye, guarda, reabre y reproduce sin leer código.
- Cambiar de paso no destruye el resaltado externo ni deja overlays residuales.
- MDX puede apuntar de forma estable a objetos y pasos.
- Las demostraciones mantienen justificaciones Greenberg/Hilbert.

## Validación

- Tests de reducer/store, timeline, targets, overlays y reproducción.
- Tests de persistencia, diagramas múltiples y paneles reactivos.
- Recorrido completo con teclado y lector de pantalla en controles principales.
- Gates del editor, tipos y arquitectura.

## Fuera de alcance

No se considera aceptación suficiente una demo aislada; los casos matemáticos reales se validan en la Fase 5.
