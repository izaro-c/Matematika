# MDX Inspector Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shared `WorkbenchAsideTabs` chrome; MDX inspector as `Página | Diagramas | Avisos` with no nested/duplicated panels.

**Architecture:** Extract diagram aside tab bar into a shared primitive under `editor/ui/workbench/`. Diagram and MDX consumers pass tab defs + active content. Split MDX MetadataPanel responsibilities into page vs diagrams sections; Avisos reuses diagnostics content without nested chrome.

**Tech Stack:** React, existing Tailwind/Arts & Crafts tokens, Vitest.

## Global Constraints

- Match diagram aside tab look (flex-1, rounded-lg, bg-lienzo when active).
- No nested tabs in MDX inspector.
- Fewest files; delete duplication over new abstractions beyond the shared shell.
- Keep SemanticLinker as modal.

---

### Task 1: `WorkbenchAsideTabs`

**Files:**
- Create: `src/fixed-pages/editor/ui/workbench/WorkbenchAsideTabs.tsx`
- Test: `tests/features/editor/workbench/WorkbenchAsideTabs.test.tsx`

- [x] Write failing test (renders tabs, switches on click, optional badge/dot)
- [x] Implement component
- [x] Pass test

### Task 2: Diagram workbench adopts shell

**Files:**
- Modify: `src/fixed-pages/editor/diagrams/ui/workbench/DiagramWorkbench.tsx`
- Verify: `tests/features/editor/diagrams/workbench/DiagramWorkbench.test.tsx`

- [x] Replace inline tab buttons with `WorkbenchAsideTabs`
- [x] Run diagram workbench tab test

### Task 3: MDX inspector redesign

**Files:**
- Modify: `src/fixed-pages/editor/ui/workbench/MdxWorkbenchInspector.tsx`
- Modify: `src/fixed-pages/editor/ui/panels/MetadataPanel.tsx` (diagrams-only section; drop nested tabs/validation)
- Modify: `src/fixed-pages/editor/ui/panels/EditorDiagnosticsPanel.tsx` (optional: hide header/close when embedded)
- Test: update/add inspector tests if any exist; smoke via existing navigation tests

- [x] Página → MetadataInspector
- [x] Diagramas → former diagrams content + lean/semantic accordion
- [x] Avisos → diagnostics without duplicate close
- [x] Remove Conexiones tab and nested MetadataPanel tabs
- [x] Run relevant unit tests

### Task 4: Verify

- [x] `npm run test -- tests/features/editor/workbench/WorkbenchAsideTabs.test.tsx tests/features/editor/diagrams/workbench/DiagramWorkbench.test.tsx` (and any MDX inspector tests)
