# V2 as official diagram workbench — design

**Date:** 2026-07-28  
**Status:** Approved for planning  
**Scope:** Make Editor V2 the default diagram workbench inside `/editor`. Keep the MDX/content editor and the old `DiagramWorkbench` in the repo. Do not delete V1.

## Goal

When the content editor opens a diagram (`.tsx` file, inline MDX block, or rewrite), the **V2 diagram UI** opens by default. The MDX/content shell at `/editor` stays unchanged. Old `DiagramWorkbench` remains reachable via an escape hatch.

## Decisions

| Topic | Decision |
|-------|----------|
| Content editor route | `/editor` still mounts `EditorPage` |
| Diagram overlay default | V2 (`EditorV2Main`) |
| Escape hatch | `?diagram=v1` → old `DiagramWorkbench` |
| Standalone V2 routes | Keep `/editor-v2` and `/editor_v2` |
| Delete V1 workbench | No |
| Persistence / confirm contract | Reuse existing `confirmWorkbench` + `EditorDiagramReference` |

## Architecture

### Current seam

`EditorPage` mounts:

```tsx
<DiagramWorkbench
  isOpen={diagramBuilderOpen}
  mode={diagramWorkbenchMode}
  metadataType={...}
  onClose={...}
  onConfirm={handleConfirmDiagram}
/>
```

`handleConfirmDiagram` already handles file reload vs MDX `bindDiagram(spec)`.

### Adapter (minimal)

Add a thin host (name TBD, e.g. `DiagramWorkbenchHost`) with the **same props** as `DiagramWorkbench`:

| Prop | Role |
|------|------|
| `isOpen` | When false, render nothing |
| `mode` | `DiagramWorkbenchMode` (file / inline / new / rewrite) |
| `metadataType` | Passed through to loader |
| `onClose` | Close overlay without confirming |
| `onConfirm` | `(spec: EditorDiagramReference) => …` — same as today |

Behavior:

1. If `!isOpen` → `null`
2. If URL has `diagram=v1` → render existing `DiagramWorkbench` unchanged
3. Else → render V2 embedded with the same `mode`, and wire close / save-and-return through existing `confirmWorkbench`

`EditorPage` only swaps the component import/JSX at the mount site. No other content-editor UX changes.

### V2 glue (smallest)

`EditorV2Main` today is page-shaped: close uses `history.back()`, no `onConfirm` back into MDX.

For embedded use only:

- Accept optional close/confirm callbacks (or host them solely in the adapter)
- Prefer those over `history.back()` when provided
- Build `EditorDiagramReference` the same way V1’s `handleSaveAndConfirm` does (reuse `confirmWorkbench`, `buildTargets`, save-on-file-mode)

No new persistence model. No V2 UI rewrite.

## Out of scope

- Deleting `DiagramWorkbench` or related V1 UI
- Changing MDX visual/code editing UX beyond which workbench opens
- Reworking standalone `/editor-v2` beyond remaining available
- Docs/agent skill updates beyond what implementation needs

## Success criteria

- Opening a diagram from `/editor` opens V2 by default
- Confirming a diagram still binds into MDX / reloads `.tsx` as today
- `?diagram=v1` still opens the old workbench
- `/editor` without a diagram open behaves as before
- Old workbench source remains in the tree

## Non-goals / later

- Removing V1 after soak
- Unifying standalone and embedded chrome further than the adapter needs
