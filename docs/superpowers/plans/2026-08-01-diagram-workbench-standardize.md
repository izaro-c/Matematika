# Diagram workbench standardize Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse `src/features/editor/v2/` into `src/features/editor/diagrams/ui/` as the sole diagram workbench UI, with no `V2` / `EditorV2` naming.

**Architecture:** Mechanical `git mv` + symbol renames. Domain stays in `diagrams/{model,hooks,source,…}`; UI shell becomes `DiagramWorkbench` under `diagrams/ui/`. Route `/editor_v2` kept; page becomes `DiagramEditorPage`.

**Tech Stack:** React, TypeScript, Vitest, wouter, existing editor feature layout.

## Global Constraints

- Do not touch `src/shared/diagrams` spec v2/v3 migration.
- Do not unify `/editor` (MDX) with `/editor_v2`.
- No temporary reexport aliases from old paths.
- Preserve `DiagramWorkbenchHost` fullscreen overlay (`fixed inset-0 z-50`).
- Only delete dead UI if typecheck/tests prove it unused after the move.
- Prefer `git mv` to keep history.

---

### Task 1: Move canvas + selection into `diagrams/ui`

**Files:**
- Move: `src/features/editor/v2/ui/canvas/*` → `src/features/editor/diagrams/ui/canvas/`
- Move: `src/features/editor/v2/ui/editorV2Selection.ts` → `src/features/editor/diagrams/ui/workbenchSelection.ts`
- Rename files dropping `V2` prefix (`BoardHost.tsx` → `BoardHost.tsx`, etc.)
- Update internal imports in moved files

**Mapping:**

| From | To |
| --- | --- |
| `canvas/BoardHost.tsx` | `canvas/BoardHost.tsx` (`BoardHost`) |
| `canvas/CanvasChrome.tsx` | `canvas/CanvasChrome.tsx` |
| `canvas/CanvasStage.tsx` | `canvas/CanvasStage.tsx` |
| `canvas/PublicationFrame.tsx` | `canvas/PublicationFrame.tsx` |
| `canvas/WorkshopSurface.tsx` | `canvas/WorkshopSurface.tsx` |
| `canvas/canvasFrameMode.ts` | keep name |
| `canvas/useFitScale.ts` | keep name |
| `editorV2Selection.ts` | `workbenchSelection.ts` |

- [ ] **Step 1:** `mkdir -p src/features/editor/diagrams/ui/canvas` and `git mv` the canvas files + selection file; rename on disk.
- [ ] **Step 2:** Fix relative imports inside canvas/selection (`../../diagrams/` paths become sibling/`../` as needed).
- [ ] **Step 3:** Temporarily leave broken callers; Task 4 wires them. Smoke: `npx vitest run tests/features/editor/v2/canvas/` will fail until Task 5 moves tests — skip until Task 5 if paths break.

---

### Task 2: Move inspector, scene pieces, modals, shell widgets

**Files:**
- Move inspector tree → `diagrams/ui/inspector/` (merge with existing small helpers; rename `V2*` → drop prefix; `elementSections.ts` → `elementSections.ts`)
- Move shell widgets to `diagrams/ui/`:

| From | To | Export |
| --- | --- | --- |
| `WorkbenchHeader.tsx` | `WorkbenchHeader.tsx` | `WorkbenchHeader` |
| `WorkbenchToolbar.tsx` | `WorkbenchToolbar.tsx` | `WorkbenchToolbar` |
| `WorkbenchSceneTree.tsx` | `WorkbenchSceneTree.tsx` | `WorkbenchSceneTree` |
| `WorkbenchElementInspector.tsx` | `WorkbenchElementInspector.tsx` | `WorkbenchElementInspector` |
| `WorkbenchStepsEditor.tsx` | `WorkbenchStepsEditor.tsx` | `WorkbenchStepsEditor` |
| `WorkbenchDiagnosticsPanel.tsx` | `WorkbenchDiagnosticsPanel.tsx` | `WorkbenchDiagnosticsPanel` |
| `GroupsAndLayersManager.tsx` | `scene/GroupsAndLayersManager.tsx` | `GroupsAndLayersManager` |
| `V2Icons.tsx` | `WorkbenchIcons.tsx` | keep icon exports |
| `ConstraintEditor.tsx` | `ConstraintEditor.tsx` | `ConstraintEditor` |

- Move modals → `diagrams/ui/modals/`:

| From | To |
| --- | --- |
| `CodeModal.tsx` | `modals/CodeModal.tsx` |
| `PresetsModal.tsx` | `modals/PresetsModal.tsx` |
| `DiagramSettingsModal.tsx` | `modals/DiagramSettingsModal.tsx` |
| `MdxLinkModal.tsx` | `modals/MdxLinkModal.tsx` |
| `GuidedConstructionsModal.tsx` | `modals/GuidedConstructionsModal.tsx` |

- [ ] **Step 1:** `git mv` + rename files; update export names in each file.
- [ ] **Step 2:** Fix imports to shared `Diagram*` editors (paths shorten from `../../diagrams/ui/X` to `./X` or `../X`).

---

### Task 3: `DiagramWorkbench` shell + host + page + router

**Files:**
- Create via move: `src/features/editor/diagrams/ui/DiagramWorkbench.tsx` (from `DiagramWorkbench.tsx`)
- Modify: `src/features/editor/diagrams/ui/DiagramWorkbenchHost.tsx`
- Create: `src/pages/DiagramEditorPage.tsx` (from `DiagramEditorPage.tsx`); delete old page
- Modify: `src/app/routes/AppRouter.tsx`

**Interfaces:**
- Produces: `export const DiagramWorkbench: React.FC<{ mode?: DiagramWorkbenchMode; metadataType?: string; onClose?: () => void; onConfirm?: … }>`
- Host imports `DiagramWorkbench` from `./DiagramWorkbench`
- Page: `export const DiagramEditorPage` rendering `<DiagramWorkbench mode={mode} />`
- Router lazy-imports `@/pages/DiagramEditorPage`; path stays `/editor_v2`

- [ ] **Step 1:** Move `DiagramWorkbench.tsx` → `DiagramWorkbench.tsx`; rename component + update all local imports to new canvas/inspector/modals paths.
- [ ] **Step 2:** Host:

```tsx
import { DiagramWorkbench } from './DiagramWorkbench';
// …
<DiagramWorkbench mode={mode} metadataType={metadataType} onClose={onClose} onConfirm={onConfirm} />
```

- [ ] **Step 3:** Replace `DiagramEditorPage` with `DiagramEditorPage`; update `AppRouter`.
- [ ] **Step 4:** Delete empty `src/features/editor/v2/` and old `DiagramEditorPage.tsx`.

---

### Task 4: Move tests + fix all remaining references

**Files:**
- Move: `tests/features/editor/v2/**` → `tests/features/editor/diagrams/workbench/**`
- Rename test files dropping `EditorV2` / `V2` where obvious (`DiagramWorkbench.embedded.test.tsx`, etc.)
- Modify: `tests/features/editor/diagrams/DiagramWorkbenchHost.test.tsx` mock path
- Grep-fix: any remaining `features/editor/v2`, `DiagramWorkbench`, `DiagramEditorPage`, `BoardHost`, etc. under `src/`, `tests/`, `.agents/`

- [ ] **Step 1:** `git mv` tests; update import paths inside.
- [ ] **Step 2:** Host mock:

```ts
vi.mock('../../../../src/features/editor/diagrams/ui/DiagramWorkbench', () => ({
  DiagramWorkbench: () => <div data-testid="v2-workbench">V2</div>,
}));
```

(Optionally rename testid to `diagram-workbench` in the same edit.)

- [ ] **Step 3:** `rg "features/editor/v2|DiagramWorkbench|DiagramEditorPage|/v2/ui" src tests .agents` → fix hits to 0 (skill docs in Task 5).

---

### Task 5: Docs + skill + verify

**Files:**
- Modify: `.agents/skills/diagrama/SKILL.md`
- Modify: `.agents/skills/diagrama/references/visual-authoring.md`
- Modify: `docs/editor/README.md` (note workbench path)
- Spec already at `docs/superpowers/specs/2026-08-01-diagram-workbench-standardize-design.md`

- [ ] **Step 1:** Replace `DiagramWorkbench` / `editor/v2/ui/DiagramWorkbench.tsx` with `DiagramWorkbench` / `diagrams/ui/DiagramWorkbench.tsx` in skill refs.
- [ ] **Step 2:** Run:

```bash
npx vitest run tests/features/editor/diagrams/DiagramWorkbenchHost.test.tsx tests/features/editor/diagrams/workbench
npm run typecheck
git diff --check
rg "features/editor/v2|DiagramWorkbench|DiagramEditorPage" src tests .agents || true
```

Expected: tests pass; typecheck clean; rg empty (or only historical ADR mentions outside `.agents`).

---

## Self-review vs spec

| Spec requirement | Task |
| --- | --- |
| Move UI under `diagrams/ui/` | 1–3 |
| Rename `DiagramWorkbench` → `DiagramWorkbench` | 3 |
| Drop `V2` prefixes | 1–2 |
| Delete `editor/v2/` | 3 |
| Move tests | 4 |
| Keep `/editor_v2` | 3 |
| Update skill + docs | 5 |
| Fullscreen host preserved | 3 (no class change) |
| No spec v3 / no route unify | Global constraints |
