# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-11

**Fase:** estabilización del editor — fases 0–4 implementadas y validadas

**Estado:** el source completo continúa siendo la autoridad documental. La persistencia MDX usa cliente y repositorios tipados, reducer revisionado, coordinación cancelable, concurrencia optimista y backend con backups y escritura atómica. El guardado visual y el autosave productivo permanecen deshabilitados.

## Decisiones vigentes

- `EditorDocument.source` es la única autoridad del MDX.
- Lecturas y respuestas de persistencia incluyen SHA-256 y versión opaca.
- Solo una confirmación HTTP válida, coherente con archivo, revisión y hash puede producir `saved`.
- Los borradores están separados del archivo real y no limpian el estado dirty.
- Una versión externa distinta produce conflicto `409`, nunca sobrescritura silenciosa.
- Los cambios locales sin confirmar bloquean el cambio de archivo.
- La aplicación crea backup y sustituye mediante temporal validado y rename.
- `VISUAL_SAVE_POLICY` y `DRAFT_AUTOSAVE_ENABLED` siguen deshabilitados.

## Próximo paso

Fase 5 — modularización de `EditorPage` y retirada de arquitectura heredada. Debe comenzar desde el commit final limpio de esta fase y no modificar persistencia ni el motor lossless.

## Deuda visible

- Definir retención y limpieza operativa de `.matematika/editor/backups/`.
- Diseñar UX de inspección y resolución de conflictos sin sobrescritura automática.
- Retirar hooks legacy sin consumidores y reducir `EditorPage` en la Fase 5.
- Migrar `DiagramWorkbench` al cliente tipado únicamente en su fase específica; no fue modificado aquí.
- Resolver 170 warnings globales preexistentes de Dependency Cruiser fuera de esta fase.
