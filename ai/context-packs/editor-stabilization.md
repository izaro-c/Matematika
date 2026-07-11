# Context pack: estabilización del editor

## Arquitectura vigente

- Documento lossless: `src/features/editor/document/**`.
- Persistencia: `src/features/editor/persistence/**`.
- Estado revisionado: `src/features/editor/state/**`.
- Orquestación React: `src/features/editor/core/useEditorCore.ts`.
- Backend de desarrollo: servicio `scripts/editor/editorPersistenceBackend.ts`, integrado por `vite.config.ts`.
- ADR: `docs/adr/ADR-001-lossless-mdx-editor.md` y `ADR-002-editor-transactional-persistence.md`.

## Invariantes

1. El source completo es la autoridad documental.
2. Ningún `200` sin payload válido confirma guardado.
3. Archivo, revisión, hash y versión deben coincidir.
4. Un borrador no equivale a archivo aplicado ni limpia dirty.
5. Una respuesta antigua no confirma una revisión posterior.
6. Toda aplicación compara versión, crea backup y reemplaza atómicamente.
7. Conflictos producen `409` y preservan el source local.
8. Cambios de archivo y desmontaje cancelan efectos pendientes.
9. Guardado visual y autosave permanecen deshabilitados.
10. El corpus MDX es de solo lectura para herramientas de estabilización.

## Validación

```bash
npm run test:editor
npm run editor:roundtrip:check
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
