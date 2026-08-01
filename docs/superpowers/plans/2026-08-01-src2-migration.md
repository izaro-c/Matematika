# src Migration + Quality Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Rewrite Matematika application code into `src/` + `content/` with better modularization, reviewed logic, and industry-standard in-code docs that generate via `npm run docs:build`.

**Architecture:** Strangler fig bottom-up. Cutover complete: `@`→`src`, `@content`→`content`. Each domain is audited, redesigned, rewritten (not copy-pasted), documented (TSDoc + README), tested, then legacy deleted.

**Tech Stack:** React, Vite, TypeScript, Zustand, Zod, TypeDoc (TSDoc), dependency-cruiser, Vitest.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-01-src-architecture-design.md`
- `src/` removed at Task 7 cutover
- No new product/UX features; no Lean axiomatics changes
- No new dependencies unless unavoidable (TypeDoc already installed)
- Ponytail: no speculative abstractions; justified rewrites and splits OK
- **In-code docs (mandatory for every public symbol rewritten):**
  - TSDoc on exported functions, types, classes, constants
  - File/module `@packageDocumentation` or top barrel comment for public APIs
  - `@internal` on non-public exports that must stay exported for tests
  - README per domain: purpose, public entrypoints, import rules
  - Generate API docs: `npm run docs:build` → `docs/api/`
- DoD per domain: audit → design note → characterization tests → rewrite → wire → verify → delete legacy
- Prefer not committing unless the user asked; leave working tree ready for review

### TSDoc conventions (industry)

```ts
/**
 * Short summary in one sentence.
 *
 * Longer notes when behavior is non-obvious. Link related symbols with {@link Name}.
 *
 * @param id - Content id in kebab-case
 * @returns Resolved page metadata
 * @throws {Error} When the id is unknown
 * @example
 * ```ts
 * getPage('teorema-pitagoras')
 * ```
 */
```

- Prefer English for API docs (tooling/ecosystem); READMEs may be Spanish if matching nearby docs
- `excludeInternal: true` in TypeDoc — mark internals with `@internal`

---

### Task 0: Tooling — `@2`, depcruise, TypeDoc, CODEMAP

**Files:**
- Modify: `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `typedoc.json`, `.dependency-cruiser.js`, `package.json`, `docs/architecture/CODEMAP.md`, `docs/superpowers/specs/2026-08-01-src-architecture-design.md`
- Create: `docs/architecture/DOCSTYLE.md`

- [x] **Step 1:** Add path alias `@/*` → `src/*` in Vite + both tsconfigs; include `src` in `tsconfig.app.json`
- [x] **Step 2:** Extend `typedoc.json` entryPoints to `["src", "src"]` (src first); keep exclude test patterns; document in DOCSTYLE.md
- [x] **Step 3:** Add scripts if missing: `docs:build` (exists), optional `docs:check` that runs typedoc with `--treatWarningsAsErrors` when src has public barrels
- [x] **Step 4:** Update depcruise: run on `src` and `src`; add src boundary rules from spec; extend `not-to-test` / `not-to-dev-dep` to `^src/`
- [x] **Step 5:** Rewrite CODEMAP for dual-tree migration + link DOCSTYLE + quality DoD
- [x] **Step 6:** Mark architecture spec status `approved`
- [x] **Step 7:** Verify: `npm run typecheck`, `npm run depcruise`, `npm run docs:build`

---

### Task 1: Rewrite `design` + `lib` + `components` into src

**Files:**
- Create under: `src/design/`, `src/lib/`, `src/components/`
- Consume from: `src/shared/design|hooks|lib|stores|ui`, `src/widgets/layouts|navigation|mdx|content`
- Update imports across `src/`, `tests/` to `@/...` where rewritten
- Shims in old paths only if required to keep PR scoped

**Interfaces:**
- Produces: `@/design` public tokens API; `@/lib` stores/hooks; `@/components` reusable UI
- Consumes: none from pages/features

- [x] **Step 1:** Audit with code-graph + list issues in `src/design/README.md` (design note)
- [x] **Step 2:** Characterization tests for critical token helpers / stores if missing
- [x] **Step 3:** Rewrite `src/design` with TSDoc on all public exports; single clear barrel
- [x] **Step 4:** Rewrite `src/lib` (hooks, stores, helpers) — split glossary data concerns if mixed
- [x] **Step 5:** Rewrite `src/components` — layouts/nav/mdx blocks modularized; TSDoc on public components
- [x] **Step 6:** Wire consumers; remove or shim legacy
- [x] **Step 7:** Verify tests + typecheck + depcruise + `docs:build`

**Task 1 leftovers (tracked for later phases):** `MDXBlocks`→features until content-pages migrate. Glossary data → `content/glossary` (done in Task 4). Diagram engine `@/diagrams` (Task 3); demos `@content/diagrams` (Task 4).

---

### Task 2: Rewrite `data` (ex-entities)

**Files:** `src/data/**` → `src/data/**`; scripts under `scripts/core/` path updates as needed

- [x] Audit, design note, rewrite schemas/store/graph with TSDoc
- [x] Verify entity tests + index scripts still resolve

---

### Task 3: Rewrite diagram engine

**Files:** `src/diagrams/**` → `src/diagrams/**`; tests → `tests/diagrams/`

- [x] Deep audit (DiagramRenderer, createDiagramSpec, scene*)
- [x] Stable `public.ts` + TSDoc; internals `@internal`
- [x] Modularize; characterization + full diagrams suite green
- [x] Skill: diagrama

**Task 3 notes:** Engine at `src/diagrams` with `@2` wiring + shims; tests at `tests/diagrams/`. Subagent API limits → completed in parent session. Focused suite green; run full `tests/diagrams` before Task 4.

---

### Task 4: Move/rewrite `content/`

**Files:** MDX → `content/mdx/`; demos → `content/diagrams/`; glossary data → `content/glossary/`

- [x] **PART A (mechanical):** MDX `src/database/content/**` → `content/mdx/**`; scripts/globs/loaders/editor paths updated; redirect README at `src/database/content/`; indexes regenerated
- [x] **PART B:** Move `content/diagrams` → `content/diagrams/`; update diagram-usages + editor write roots
- [x] Demos only import `@/diagrams` + `@/design` public APIs; rewrite as needed
- [x] `content/` must not import app pages

---

### Task 5: Rewrite `content-pages`

- [x] `shared`, `exercise`, `study-plan` with TSDoc + README DoD

---

### Task 6: Rewrite `fixed-pages`

- [x] **PART A:** `home/`, `glossary/`, `mathematicians/`, `graph/` — `@/fixed-pages` + shims; AppRouter + MDXBlocks wired; generic MDX route shells stay in `src/content-pages/pages/` until Task 7 (documented in `src/fixed-pages/README.md`)
- [x] **PART B:** `editor/` — migrate `src/fixed-pages/editor/**` → `src/fixed-pages/editor/**` + shims; AppRouter + `DiagramEditorPage` wired; bugbot review when editor closes

---

### Task 7: App cutover

- [x] `src/app`, flip `@`→`src`, delete `@2`, delete `src` legacy
- [x] Update skills, CODEMAP, depcruise-only-src, code-graph reindex, full-check

---

## Execution notes

- One implementer subagent per task; review after each
- Never parallelize diagram engine + editor
- Expand tasks 2–7 into fine-grained steps when entering that phase
