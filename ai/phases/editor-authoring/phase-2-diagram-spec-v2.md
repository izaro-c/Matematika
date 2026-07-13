# Fase 2 — DiagramSpec v2 y renderer compartido

## Resultado

Editor, preview y contenido publicado interpretan una escena versionada con la misma semántica. El TSX generado es un adaptador fino y el código manual permanece protegido cuando no existe representación exacta.

El estado vigente se consulta en la [matriz canónica](README.md#fuente-canónica-de-estado).

## Skills y contexto

- `project-philosophy`
- `diagrama`
- Arquitectura FSD, `MathBoard`, `MathFactory`, `MathStore`, parser y generador actuales

## Entregables

- `DiagramSpec v2` extensible, validado y versionado.
- Renderer compartido por workbench y runtime final.
- Migraciones explícitas entre versiones y errores comprensibles.
- Viewport persistente, zoom, pan, ajuste al contenido y recuperación de objetos fuera de vista.
- Capas, orden visual, visibilidad, grupos y selección.
- Historial por comandos con deshacer y rehacer deterministas.
- Contrato claro entre fuente manual, spec y TSX generado.

## Criterios de aceptación

- No existe un preview simplificado que contradiga al diagrama publicado.
- Las fuentes manuales no se reescriben si el spec no representa todo su comportamiento.
- Un fixture se puede crear, guardar, reabrir, editar y renderizar sin divergencia.
- Las dependencias respetan FSD y no duplican lógica entre capas.

## Validación

- Pruebas de schema, migraciones, renderer, parser, generador y roundtrip.
- Pruebas de undo/redo, viewport y capas.
- Comparación estable entre preview y runtime.
- TypeScript, arquitectura, tests dirigidos y gates del editor.

## Fuera de alcance

No se migran aún todos los diagramas reales ni se fuerza el código manual al nuevo formato.
