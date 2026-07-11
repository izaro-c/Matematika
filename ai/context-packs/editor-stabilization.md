# Context pack: estabilización del editor

## Arquitectura vigente

- Documento lossless: `src/features/editor/document/**`.
- Persistencia: `src/features/editor/persistence/**`.
- Estado revisionado: `src/features/editor/state/**`.
- Orquestación React: `src/features/editor/core/useEditorCore.ts`.
- Backend de desarrollo: servicio `scripts/editor/editorPersistenceBackend.ts`, integrado por `vite.config.ts`.
- ADR: `docs/adr/ADR-001-lossless-mdx-editor.md` y `ADR-002-editor-transactional-persistence.md`.

## Invariantes de Fases 0–4 (Cerradas)

1. El source completo es la autoridad documental.
2. Ningún `200` sin payload válido confirma guardado.
3. Archivo, revisión, hash y versión deben coincidir en repositorios y API.
4. Un borrador no equivale a archivo aplicado ni limpia dirty.
5. Una respuesta antigua no confirma una revisión posterior.
6. Toda aplicación compara versión, crea backup y reemplaza atómicamente.
7. Los locks del backend se resuelven canónicamente a nivel de `realpath` absoluto para neutralizar alias de ruta y symlinks.
8. Los conflictos devuelven `409` discriminados (`content-conflict` y `draft-conflict`), preservando el source local sin sobrescritura.
9. Los borradores se guardan inmutables por sesión y revisión, gestionando un puntero global `latest.json` y carpetas `revisions/`.
10. Cambios de archivo y desmontaje cancelan efectos pendientes.
11. Guardado visual y autosave permanecen deshabilitados.
12. El corpus MDX se valida mediante baseline en `schemaVersion: 3`.

## Validación

```bash
npm run test:editor
npm run editor:roundtrip:check
npm run editor:lossless:check
npm run typecheck
npm run lint -- src/features/editor tests/features/editor scripts/editor vite.config.ts
npm run depcruise
npm run ai:review
npm run build
git diff --check
git diff -- src/database/content
```

## Siguiente alcance

La Fase 5 puede modularizar `EditorPage` y retirar hooks legacy, pero no debe cambiar contratos de persistencia, endpoints, versiones, backups, conflictos ni el motor documental.
