# Geometría Inspector UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent invalid relation options in the point Geometría tab and unify Relaciones / Snap / Posición calculada with filtered selects + canvas pick.

**Architecture:** Central `relationSlots.ts` owns slot labels and candidate filters; UI uses `RelationSlotField`; workbench holds optional `referencePick` intercepted by `DiagramCanvas`.

**Tech Stack:** React + TypeScript, Vitest, existing `DiagramPanel` / Arts & Crafts tokens.

## Global Constraints

- Hybrid prevention: hide incompatible entities; disable relations missing prerequisites/conflicts with reason.
- No catch-all `[...points, ...elements]` for typed slots.
- Arts & Crafts palette only (carbon/pavo/ocre/lienzo).
- Point Geometría tab only; catalog reusable later.
- TDD for catalog and availability.

---

### Task 1: `relationSlots` catalog

**Files:**
- Create: `src/features/editor/diagrams/model/relationSlots.ts`
- Create: `tests/features/editor/diagrams/model/relationSlots.test.ts`
- Modify: `src/features/editor/diagrams/model/index.ts` (re-exports)

**Interfaces:**
- Produces: `slotsFor(kind)`, `candidatesForSlot(model, kind, index, refs)`, `relationAvailability(model, kind, targetId, activeKinds)`, `isIdAllowedForSlot(...)`, types `RelationSlot`, `RelationAvailability`

- [ ] **Step 1: Write failing tests** for `distance` excluding elements; `on` only supports; availability disabled without other point; conflict disabled.

- [ ] **Step 2: Run** `npx vitest run tests/features/editor/diagrams/model/relationSlots.test.ts` → FAIL (module missing)

- [ ] **Step 3: Implement `relationSlots.ts`** reusing `v3Projection` helpers + `combinedConstraintBlockReason` / conflict APIs.

- [ ] **Step 4: Run tests → PASS**

- [ ] **Step 5: Commit** `feat(diagrams): relationSlots compatibility catalog`

---

### Task 2: Wire editor + picker hybrid disable

**Files:**
- Modify: `src/features/editor/diagrams/ui/DiagramConstraintEditor.tsx`
- Modify: `src/features/editor/diagrams/ui/relations/RelationIntentPicker.tsx`
- Test: extend `tests/features/editor/diagrams/Phase3Inspector.test.tsx` or new UI test

- [ ] Replace `referenceCandidates` / `referenceLabel` with `candidatesForSlot` / `slotsFor`.
- [ ] Picker: options with `disabled` + reason via `relationAvailability`; keep visible.
- [ ] Commit `feat(diagrams): filter relation refs and disable invalid kinds`

---

### Task 3: `RelationSlotField` + canvas pick

**Files:**
- Create: `src/features/editor/diagrams/ui/relations/RelationSlotField.tsx`
- Create: `src/features/editor/diagrams/ui/relations/referencePickTypes.ts`
- Modify: `DiagramCanvas.tsx`, `DiagramWorkbench.tsx`, `DiagramInspector.tsx`, `DiagramConstraintEditor.tsx`, `relations/index.ts`
- Test: unit for `isIdAllowedForSlot`; UI soft-reject path if feasible

- [ ] Field: select + «Elegir en lienzo» + empty-state message.
- [ ] Workbench state `referencePick`; canvas intercepts clicks; Escape cancels; status hint.
- [ ] Commit `feat(diagrams): RelationSlotField with canvas pick`

---

### Task 4: Visual shell polish

**Files:**
- Modify: `InspectorPointPanel.tsx`, `DiagramPointMovementAidsEditor.tsx`, `DiagramDerivedPositionEditor.tsx`, `DiagramConstraintEditor.tsx`

- [ ] Consistent `DiagramPanel` rhythm; order coords → mode block → snap last.
- [ ] Run relevant vitest suites; commit `style(diagrams): cohesive Geometría inspector panels`

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| relationSlots APIs | 1 |
| No invalid entity options | 1–2 |
| Hybrid disable | 2 |
| RelationSlotField + canvas | 3 |
| Visual shell | 4 |
| Tests | 1–3 |
