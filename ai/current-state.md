# Estado actual

**Actualizado:** 2026-07-31

**Fase:** Post DiagramSpec v3 / workbench en `src/features/editor/diagrams/ui/`.

**Siguiente:** reconectar `EditorDiffController` en `EditorPage` (diff review desconectado).

## Vivo

- Estabilidad editor: [`docs/editor/stability.md`](../docs/editor/stability.md)
- Gates: `editor:*`, `ai:index`, `ai:debt`, `full-check`
- Diagramas (último check): 56 `visual-exact`, 28 `code-preview`
- MDX corpus: 120/120 roundtrip exacto (baselines en `reports/`)

## Bloqueos / deuda explícita

- Diff review UI desconectado
- Sin pasada humana con lector de pantalla
- `code-preview` → `visual-exact` solo con aceptación matemática individual
