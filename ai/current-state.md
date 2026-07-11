# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-11

**Fase:** Fases 0–4 de estabilización del editor finalizadas y validadas.

**Estado:** El source completo es la autoridad de contenido. La persistencia transaccional utiliza locks por path canónico (`realpath`) resolviendo alias y symlinks, CAS mediante `expectedVersion`, y contratos específicos para conflictos de contenido y de borrador (`content-conflict`, `draft-conflict`). Los borradores están aislados por sesión y revisión, almacenados de forma independiente. Las advertencias de React y act() se han resuelto. El gate del corpus y el audit reversible de 94/120 archivos pasan.

## Decisiones vigentes

- `EditorDocument.source` es la única autoridad del MDX.
- Lecturas y respuestas de persistencia incluyen SHA-256 y versión opaca.
- Solo una confirmación HTTP válida, coherente con archivo, revisión y hash puede producir `saved`.
- Los borradores están separados del archivo real y no limpian el estado dirty.
- Una versión externa distinta produce conflicto `409` (`content-conflict` o `draft-conflict`), nunca sobrescritura silenciosa.
- Los cambios locales sin confirmar bloquean el cambio de archivo.
- La aplicación crea backup y sustituye mediante temporal verificado y rename.
- El lock del backend se realiza utilizando la identidad canónica del archivo (`realpath`).
- Los borradores se guardan inmutables por sesión y revisión, gestionando un puntero global `latest.json`.
- `VISUAL_SAVE_POLICY` y `DRAFT_AUTOSAVE_ENABLED` siguen deshabilitados.

## Próximo paso

Fase 5 — modularización de `EditorPage` y retirada de arquitectura heredada. Debe comenzar desde el commit final limpio de esta fase y no modificar persistencia ni el motor lossless.

## Deuda visible

- Definir retención y limpieza operativa de `.matematika/editor/backups/`.
- Diseñar UX de inspección y resolución de conflictos sin sobrescritura automática.
- Retirar hooks legacy sin consumidores y reducir `EditorPage` en la Fase 5.
- Migrar `DiagramWorkbench` al cliente tipado únicamente en su fase específica; no fue modificado aquí.
- Resolver 170 warnings globales preexistentes de Dependency Cruiser fuera de esta fase.
