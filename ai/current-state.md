# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-13

**Fase:** Fase 2 — `DiagramSpec v2` y renderer compartido, cerrada.

**Estado:** Existe un contrato versionado, validado y migrable para escenas de diagramas nuevas. Editor, preview y TSX generado interpretan esas escenas mediante el mismo `DiagramRenderer` sobre `MathBoard` y `MathFactory`. Los 85 diagramas de producción conservan su TSX manual y continúan explícitamente en modo código con preview; esta fase no los migra ni anuncia edición visual inexistente.

## Roadmap activo

La fuente canónica del estado es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). Las Fases 0, 1 y 2 están cerradas. La siguiente fase elegible es la [Fase 3 — Lenguaje geométrico completo](phases/editor-authoring/phase-3-geometry-language.md), pendiente y no iniciada.

## Arquitectura cerrada en la Fase 2

- `src/shared/diagrams/spec/` contiene el contrato puro `DiagramSpec v2`, schema Zod, migraciones, semántica de escena, cálculo de viewport y un historial genérico de comandos. No depende de React, JSXGraph ni del editor.
- `src/shared/diagrams/runtime/DiagramRenderer.tsx` es el intérprete único de escena para runtime, preview y editor. El modo editor añade callbacks de autoría sin cambiar geometría, visibilidad ni orden.
- `src/shared/diagrams/public.ts` define el facade productivo. El TSX generado declara un spec validado y monta `DiagramRenderer`; no emite otra implementación de `MathBoard` o `MathFactory`.
- `DiagramCanvas` dejó de dibujar un SVG alternativo y es un adaptador fino al renderer compartido. La selección, movimiento de puntos, creación sobre fondo y cambios de viewport regresan al reducer del editor.
- La construcción usa orden topológico de dependencias y el dibujo usa orden de capa y orden local. Los ciclos se rechazan antes de renderizar.
- La capa de editor conserva modelos, inspector, herramientas, persistencia y autoridad de fuente, pero delega proyección geométrica, capas, pasos, grupos, visibilidad, bloqueo, selección y viewport a `shared`.

## Contrato y compatibilidad

- La versión literal es `2` y el renderer se identifica como `matematika-diagram-renderer-v2`.
- El spec incorpora viewport persistente y home, límites de zoom, padding, capas, grupos bidireccionales, orden visual, visibilidad, bloqueo, targets y metadatos de selección accesibles.
- El schema comprueba forma y referencias cruzadas: IDs, capas únicas, membresía de grupos coherente, aridad mínima, referencias, gliders, pasos y ciclos de dependencia.
- `migrateDiagramSpec` migra en memoria el formato histórico sin versión y v1. Versiones futuras, versiones sin ruta y specs inválidos producen errores tipados y mensajes con rutas comprensibles.
- Una fuente embebida solo es `visual-exact` cuando la versión actual regenera el archivo completo byte a byte. Una extensión manual, overlay o v1 migrado permanece `code-preview`, por lo que el código completo conserva la autoridad.

## Viewport e historial

- `MathBoard` admite bounding box controlado y notifica el evento real `boundingbox` de JSXGraph usado por pan y zoom.
- El renderer ofrece acercar, alejar, ajustar al contenido y recuperar objetos seleccionados o fuera del lienzo. Los mismos cálculos puros se usan en cualquier modo.
- El historial guarda snapshots por comandos, limita profundidad, invalida redo al bifurcar y permite undo/redo determinista. Los eventos continuos de viewport se agrupan durante 600 ms; cada gesto final de un punto es un comando independiente.

## Preservación de Fases 0 y 1

- El catálogo seguro sigue mostrando 85 diagramas finales: 0 con edición visual exacta, 85 con código y preview, 24 recursos internos excluidos y 0 inválidos.
- El corpus conserva 120 documentos MDX y supera roundtrip 120/120.
- Las fuentes TSX manuales no se reescriben desde parsers parciales. El parser AST puede producir preview, pero no concede autoridad visual por reconocer algunos objetos.
- Persistencia, conflictos, backups, navegación, filtros, paneles, teclado y estados explícitos del editor mantienen sus garantías anteriores.

## Evidencia de aceptación

- Fixtures representativos: `diagram-spec-v1.json` y `diagram-spec-v2.json`, con migración, viewport, capas, grupo, pasos y un objeto recuperable fuera del lienzo.
- Pruebas dirigidas finales: 10 archivos y 51 pruebas para schema, migración, ciclos, orden topológico/visual, viewport, evento `boundingbox`, renderer, generación, parsing, roundtrip y undo/redo.
- `editor:full-check`: artefactos deterministas mediante índice Git temporal, roundtrip 120/120, lint dirigido, 126 pruebas unitarias, 79 de integración, arquitectura, seguridad, TypeScript y build aprobados.
- `editor:lint`: 110 advertencias dentro del presupuesto de 119. Dependency Cruiser mantiene 56 advertencias históricas y 0 errores.
- `full-check`: 59 archivos y 596 pruebas, lint sin errores, TypeScript, Dependency Cruiser, referencias, grafo, Lean, cobertura de 120 contenidos y auditoría bridge aprobados.
- `editor:diagrams:check`: 85 diagramas finales en código con preview, 0 falsos positivos de edición visual y 0 fuentes inválidas.
- `git diff --check`: aprobado.

## Decisiones

- La especificación serializa semántica de escena; el TSX generado es únicamente su frontera de importación y exportación.
- El orden de construcción no se deduce del z-index: las dependencias se resuelven topológicamente y las capas solo gobiernan la presentación.
- `extensions` permite evolución explícita, pero una propiedad no interpretada no concede por sí sola roundtrip visual.
- Los controles de autoría no viven en `shared`; el renderer compartido expone callbacks y el feature editor decide comandos, inspector y persistencia.
- La migración automática nunca equivale a autorización para reescribir una fuente manual.

## Deuda explícita y límites

- No se migró ningún diagrama de producción. La migración de casos reales queda reservada a fases posteriores con evidencia de fidelidad.
- Curvas, expresiones seguras, geodésicas, mediciones avanzadas, nuevas familias geométricas y un grafo de restricciones completo pertenecen a la Fase 3; no se implementaron aquí.
- `DiagramRenderer` y las fronteras JSXGraph conservan `any` en APIs sin tipos suficientes y avisos de complejidad no bloqueantes. El gate global mantiene 1111 advertencias históricas y 0 errores.
- El build conserva avisos históricos de chunks superiores a 500 kB y `eval` interno de JessieCode/JSXGraph.
- La skill `diagrama` contiene referencias operativas que deben reconciliarse con el nuevo facade y renderer compartidos. Según la regla de autoactualización de skills, no se modifica sin una propuesta y aprobación separadas.

## Criterios demostrados

- **Una semántica:** `DiagramCanvas` y el TSX generado importan `DiagramRenderer` desde el mismo facade; no queda SVG de preview alternativo.
- **Roundtrip sin pérdida:** generate → parse → generate conserva todos los campos v2 y produce la misma fuente byte a byte.
- **Código manual protegido:** cualquier código adicional o migración v1 permanece con autoridad de fuente.
- **Escena completa:** viewport, capas, grupos, orden, visibilidad, bloqueo, selección y pasos forman parte del contrato validado.
- **Recuperación:** fit y recuperación encuadran el fixture fuera de vista; pan y zoom notifican y persisten bounds.
- **Historial fiable:** undo, redo, coalescencia temporal y bifurcación están probados.
- **FSD:** `shared` no depende de capas superiores y Dependency Cruiser no registra errores nuevos.

## Veredicto

`FASE 2 CERRADA — DIAGRAMSPEC V2 Y RENDERER COMPARTIDO OPERATIVOS SIN MIGRAR PRODUCCIÓN NI ADELANTAR FASE 3`
