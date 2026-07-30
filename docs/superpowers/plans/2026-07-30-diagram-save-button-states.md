# Diagram Save Button States Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Three-state diagram save button (Guardar / Guardando… / Guardado) with colors; save binds MDX without closing; only Cerrar exits.

**Architecture:** Drive button chrome from existing `status` + `isDirty` in `DiagramStatusBar` (and V2Header). Split save from close: persist + `onConfirm` bind, never call workbench `close()` from save. `handleConfirmDiagram` stops closing/discard-reloading.

**Tech Stack:** React, existing diagram workbench hooks, Arts & Crafts tokens (`carbon`, `pizarra`, `salvia`).

## Global Constraints

- No new deps or abstractions
- Keep `aria-label="Guardar diagrama"` stable for existing tests
- Bind on successful save without `setDiagramBuilderOpen(false)`

---

### Task 1: StatusBar button states

**Files:**
- Modify: `src/features/editor/diagrams/ui/DiagramStatusBar.tsx`
- Test: `tests/features/editor/diagrams/ui/DiagramWorkbenchUx.test.tsx`

- [ ] Derive `saving` / `upToDate` / actionable from `status`, `isDirty`, `isSaveBlocked`
- [ ] Labels: Guardando… / Guardado / Guardar (inline & footer)
- [ ] Colors: pizarra / salvia / carbon; disabled when saving, upToDate, or blocked
- [ ] Run UX tests

### Task 2: Save without close + bind

**Files:**
- Modify: `src/features/editor/diagrams/hooks/useWorkbenchActions.ts` (`confirmWorkbench`)
- Modify: `src/features/editor/ui/EditorPage.tsx` (`handleConfirmDiagram`)
- Modify: `src/features/editor/diagrams/ui/DiagramWorkbench.tsx` if wiring needs `save` not close
- Modify: `src/features/editor/v2/ui/EditorV2Main.tsx` / `V2Header.tsx` for same UX

- [ ] `confirmWorkbench`: after save + onConfirm, do not `close()`
- [ ] `handleConfirmDiagram`: bind / refresh list only; no close; no discard `openFile`
- [ ] V2Header: same three-state labels/colors; save path stays open
- [ ] Run workbench + UX tests

### Task 3: Verify

- [ ] `npx vitest run tests/features/editor/diagrams/ui/DiagramWorkbenchUx.test.tsx tests/features/editor/diagrams/DiagramWorkbench.test.tsx`
