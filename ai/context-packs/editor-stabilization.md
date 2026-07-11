# Context pack: estabilización del editor

## Alcance activo

- Motor: `src/features/editor/document/**`.
- Integración: `src/features/editor/core/useEditorCore.ts` y contención mínima en `src/features/editor/ui/EditorPage.tsx`.
- Oráculo: `scripts/editor/corpusAuditCore.ts` y scripts `audit-*`.
- Pruebas: `tests/features/editor/**` y fixtures del editor.
- Arquitectura: `docs/adr/ADR-001-lossless-mdx-editor.md`.

## Invariantes

1. `EditorDocument.source` contiene siempre el MDX completo.
2. Envelope y body son rangos; nunca se reserializan globalmente.
3. El parser usa `remark-parse`, `remark-mdx`, `remark-gfm` y `remark-math` sin plugins transformadores.
4. Los nodos no soportados son opacos e inmutables.
5. Cada edición visual exige hash base, bloque editable, rango exacto y `expectedSource`.
6. Se reparsa después de cada parche y no se reutilizan offsets.
7. El guardado visual y las operaciones estructurales están deshabilitados.
8. El corpus `src/database/content/**/*.mdx` es de solo lectura.

## Validación

```bash
npm run editor:roundtrip:audit
npm run editor:roundtrip:check
npm run test:editor
npm run typecheck
npm run lint -- src/features/editor tests/features/editor scripts/editor
npm run depcruise
npm run ai:review
git diff --check
git diff -- src/database/content
```

## Aceptación

- Los 120 MDX se descubren y clasifican.
- Todos son exactos e idempotentes tras tres ciclos.
- Ningún envelope o body cambia.
- No hay legacy en las rutas críticas de `useEditorCore` ni en el auditor.
- La siguiente fase es persistencia transaccional, no modularización ni workbench.
