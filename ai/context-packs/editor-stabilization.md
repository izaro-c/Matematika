# Context pack: estabilización del editor

## Arquitectura vigente

- **Documento lossless:** `src/features/editor/document/**`.
- **Persistencia:** `src/features/editor/persistence/**`.
- **Estado revisionado:** `src/features/editor/state/**`.
- **Orquestación React:** `src/features/editor/core/useEditorCore.ts`.
- **UI Modular:** Componentes `EditorShell`, `EditorToolbar`, `EditorNavigation`, `EditorModeSwitcher` y subpaneles bajo `ui/panels/`.
- **Diagramas y Workbench:**
  - Lógica pilla: `src/features/editor/diagrams/model/**` y `src/features/editor/diagrams/source/**`.
  - UI del workbench: `src/features/editor/diagrams/ui/**` (canvas, inspector, toolbar, references, code panels).
  - Persistencia: `src/features/editor/diagrams/hooks/useDiagramState.ts` y `src/features/editor/diagrams/state/**`.
- **Backend de desarrollo:** servicio `scripts/editor/editorPersistenceBackend.ts`, integrado por `vite.config.ts`.
- **ADR:** `docs/adr/ADR-001-lossless-mdx-editor.md` y `ADR-002-editor-transactional-persistence.md`.

## Invariantes de Fases 0–6 (Cerradas)

1. El editor es modular. `EditorPage.tsx` actúa como punto de composición.
2. El source completo es la autoridad documental.
3. Ningún `200` sin payload válido confirma guardado.
4. Archivo, revisión, hash y versión deben coincidir en repositorios y API.
5. Un borrador no equivale a archivo aplicado ni limpia dirty.
6. Toda aplicación compara versión, crea backup y reemplaza atómicamente.
7. Los locks del backend se resuelven canónicamente a nivel de `realpath` absoluto para neutralizar alias de ruta y symlinks.
8. Los conflictos devuelven `409` discriminados (`content-conflict` y `draft-conflict`), preservando el source local sin sobrescritura.
9. Los borradores se guardan inmutables por sesión y revisión, gestionando un puntero global `latest.json` y carpetas `revisions/`.
10. Cambios de archivo y desmontaje cancelan efectos pendientes.
11. Guardado visual y autosave permanecen deshabilitados.
12. El corpus MDX se valida mediante baseline en `schemaVersion: 3`.
13. El workbench de diagramas cuenta con autoridad explícita modelo/fuente, divergencia bloqueante y gestión segura de fuentes inválidas.
14. Índice inverso de usos de diagramas pre-generado y consultable sin escaneo O(N).

## Validación

```bash
npm run test:editor
npm run editor:roundtrip:check
npm run typecheck
npm run diagram-usages:check
npm run lint -- src/features/editor tests/features/editor scripts/editor vite.config.ts
npm run depcruise
npm run ai:review
npm run build
```

## Siguiente alcance

La Fase 7 abordará la UX segura, accesibilidad y rendimiento del editor.
