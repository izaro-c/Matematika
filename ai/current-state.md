# Estado actual

**Actualizado:** 2026-08-01

**Fase:** Reorg estrangulador — Fases 0–3 aplicadas (mapa, tokens, fronteras, scene split, slices de producto).

**Siguiente:** migraciones `code-preview` → `visual-exact` restantes; placeholders de demos; a11y lector de pantalla.

## Vivo

- CODEMAP: [`docs/architecture/CODEMAP.md`](../docs/architecture/CODEMAP.md)
- Tokens: `shared/design` (+ `diagramPalette.ts`); CSS en `app/theme.css` / `app/styles`
- Constantes de dominio: `features/editor/constants.ts`, `shared/diagrams/constants.ts`, progress/graph/exercises
- Depcruise: `widgets-diagrams-no-editor`, `design-no-diagrams` (+ FSD previo)
- ADR-004: widgets/diagrams ↛ editor
- Escena partida: `sceneTypes` / `sceneCoordinates` / `scenePointMotion` / `sceneBounds` / `scenePlan` (barrel `scene.ts`)
- Stores canónicos en `src/shared/stores/`
- READMEs por dominio (editor, diagrams, design, glossary, progress, graph, exercises)

## Bloqueos / deuda explícita

- Modelo dual workingScene ↔ V3 sigue en shared/model (aceptable)
- Widgets 3D fuera de DiagramSpec 2D
- Placeholders demos + orphan warnings depcruise
- Sin pasada humana con lector de pantalla
