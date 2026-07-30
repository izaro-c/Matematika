# Diagram save button states — design

**Date:** 2026-07-30  
**Status:** approved (approach A)  
**Scope:** Diagram workbench save UX (legacy `DiagramWorkbench` + v2 header path that shares the same save/confirm contract)

## Problem

1. The save button always shows «Guardar» even while saving or when the diagram is already up to date.
2. Save runs `confirmWorkbench` → persist + `onConfirm` + **close**, so the user cannot keep editing after saving.

## Goals

- Button shows three states with distinct Arts & Crafts colors: **Guardar** / **Guardando…** / **Guardado**.
- Save persists (and binds MDX when applicable) **without leaving** the diagram editor.
- Only **Cerrar** exits the editor.

## Non-goals

- New save pipeline, new status enum, or new UI component library.
- Changing MDX bind semantics beyond “bind on successful save, stay open”.
- Autosave.

## Behavior

| Condition | Label | Visual | Interaction |
|---|---|---|---|
| Dirty / needs save, not blocked | Guardar | `bg-carbon text-lienzo` | Click → save |
| `status === 'saving'` | Guardando… | `bg-pizarra text-lienzo` (muted) | Disabled |
| Clean / up to date (not dirty, not saving, not blocked) | Guardado | `bg-salvia text-lienzo` | Disabled |
| Blocked (validation / conflict / etc.) | unchanged block presentation | disabled muted | unchanged |

“Up to date” = `!isDirty && status !== 'saving'` and save is otherwise not an actionable dirty save (same signals `DiagramStatusBar` already receives).

### Save flow

1. Persist TSX via existing `saveDiagram` / file-mode path.
2. On success, if `onConfirm` is provided, call it with the current diagram reference to bind MDX (or refresh file list for `.tsx` pages).
3. **Do not** close the workbench (`close()` / `setDiagramBuilderOpen(false)`).

### Close flow

- **Cerrar** → existing `onClose` only (no implicit save). Dirty-guard behavior already present in v2 stays as-is; legacy keeps current close behavior unless a dirty guard already exists.

### `handleConfirmDiagram` (EditorPage)

- Stop closing the workbench inside `onConfirm`.
- For `.tsx` current file: refresh file list only; **do not** `openFile(..., { discardLocalChanges: true })` while the workbench remains open (avoids clobbering in-memory edit state after save).
- For MDX: keep `bindDiagram(spec)` (idempotent if already linked).

### `confirmWorkbench`

- After successful save + `onConfirm`, **omit** `close()` when used as the save action.
- Prefer the smallest change: save path calls save + optional confirm without close; close remains exclusive to the Cerrar button. Delete or stop wiring `handleSaveAndConfirm` as the StatusBar `onSave` if it still closes.

## Files (expected)

- `src/features/editor/diagrams/ui/DiagramStatusBar.tsx` — button label + color by state
- `src/features/editor/diagrams/ui/DiagramWorkbench.tsx` — wire save without close
- `src/features/editor/diagrams/hooks/useWorkbenchActions.ts` — save/confirm without close
- `src/features/editor/ui/EditorPage.tsx` — `handleConfirmDiagram` no longer closes / no discard-reload
- `src/features/editor/v2/ui/EditorV2Main.tsx` (+ `V2Header` if labels live there) — same save-without-close + button states if it exposes its own save control
- Tests that assert «Guardar diagrama» / close-on-save: update expectations

## Verification

- Dirty → button «Guardar» (carbon); click → «Guardando…» then «Guardado» (salvia); editor stays open.
- Cerrar still exits.
- MDX new diagram: first successful save binds into the page; editor stays open.
- Existing StatusBar block/disabled diagnostics behavior unchanged.
- Targeted tests: `DiagramWorkbenchUx` / workbench save tests pass with updated labels/aria.

## Out of scope follow-ups

- Separate “Aplicar a página” button (not needed if bind-on-save works).
- Toast in addition to button state (YAGNI).
