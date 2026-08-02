# Estado actual

**Actualizado:** 2026-08-02

**Fase:** Reorg interna findability — `src/diagrams` (`model`/`geometry`/`jsxgraph`/`render`), `lib` sin `helpers`, `content-pages/screens`, editor (`session`/`save`/`review` + workbench subdirs).

**Siguiente:** migraciones `code-preview` → `visual-exact` restantes; placeholders de demos; a11y lector de pantalla; splits de god-files marcados `ponytail:`.

## Vivo

- CODEMAP: [`docs/architecture/CODEMAP.md`](../docs/architecture/CODEMAP.md)
- Spec findability: [`docs/superpowers/specs/2026-08-02-src-internal-reorg-design.md`](../docs/superpowers/specs/2026-08-02-src-internal-reorg-design.md)
- Tokens: `src/design/`; CSS en `app/styles`
- Constantes: `fixed-pages/editor/constants.ts`, `diagrams/constants.ts`
- Depcruise: `content-diagrams-no-editor`, `diagrams-model-geometry-no-render`, `editor-diagrams-model-no-ui`
- Escena: `diagrams/geometry/layout/` + `coordinates/`
- Stores: `src/lib/stores/`; contexts: `src/lib/page-context/`
- READMEs en carpetas clave bajo `src/`

## Bloqueos / deuda explícita

- Modelo dual workingScene ↔ V3 sigue (aceptable)
- Widgets 3D fuera de DiagramSpec 2D
- Placeholders demos + orphan warnings depcruise
- Sin pasada humana con lector de pantalla
