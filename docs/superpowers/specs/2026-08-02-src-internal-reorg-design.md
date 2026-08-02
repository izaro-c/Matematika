# Design: internal `src/` reorganization (findability)

**Date:** 2026-08-02  
**Status:** approved (brainstorming) — awaiting user review of this file  
**Depends on:** [2026-08-01-src2-architecture-design.md](./2026-08-01-src2-architecture-design.md) (outer layout done; cutover `src2` → `src` complete)  
**Scope:** Reorganize **inside** existing top-level folders so code is easy to find and identify. Outer names (`app`, `design`, `components`, `lib`, `data`, `diagrams`, `fixed-pages`, `content-pages`) stay.

## Goal

A contributor can answer “where does X live?” using READMEs and plain English folder names — without jargon (`spec`, `core`, `helpers`, `persistence`, `contracts`, `hooks` as a junk drawer).

## Locked decisions

| Decision | Choice |
|---|---|
| Scope | Findability (renames, READMEs, misplaced moves) **+** hotspot redesign of `diagrams` engine and `fixed-pages/editor` |
| Folder language | Plain English |
| `src/diagrams/` vs `editor/diagrams/` | **Keep both path names**; clarity via internals + READMEs |
| Approach | Rename-first **plus** new directories/subdirectories when they help identification; rewrite logic **when** it clarifies boundaries/findability (not speculative rewrites) |
| New folder rule | Only if it groups **≥3 files** with the same reason to be there |
| Outside hotspots | Cheap renames/READMEs **+** move clearly misplaced pieces (metadata, glossary data, `lib/helpers`) |
| Out of scope | Rewriting DiagramSpec format from scratch; rewriting the whole editor from scratch; renaming outer top-level `src/*` folders |

## Target trees

### 1. Diagram engine — `src/diagrams/`

Replace `spec` / `core` / `runtime` with four top-level dirs:

```
src/diagrams/
  README.md
  model/                 # what a diagram is (contract)
    schema/              # schema v2/v3, migrations, v3*, types
    expressions/
    semantics/           # semantics, infoPanels, playback, history
  geometry/              # pure scene math
    coordinates/         # sceneCoordinates, scenePointMotion, …
    curves/
    areas/
    layout/              # sceneBounds, scenePlan, viewport, scene*
  jsxgraph/              # MathBoard, MathFactory, MathUtils, theme (was core/)
  render/                # paint + lifecycle (was runtime/)
    lifecycle/           # useBoardLifecycle (split into modules)
    elements/            # createBoardElement, boardElementHelpers
    interaction/         # selection, hover, hit-testing, viewport hooks
    DiagramRenderer.tsx
  public.ts
  index.ts
  constants.ts
```

**Import rules**

- `model` and `geometry` must not import `jsxgraph` or `render`.
- `render` may import `model`, `geometry`, `jsxgraph`.
- Public entry remains `@/diagrams` / `public.ts`; update internal paths.

**Allowed rewrites:** split god-files (`v3Compatibility`, `useBoardLifecycle`, `schema*`, `MathFactory`) into named modules; clarify barrels. **Not allowed:** new DiagramSpec version / greenfield renderer.

### 2. Editor — `fixed-pages/editor/`

Lean top-level; strong subdirs under `diagrams/model` and `diagrams/ui`. Path `editor/diagrams/` **stays**.

```
fixed-pages/editor/
  README.md
  session/               # was core/ — open/parse/validate document
  document/              # MDX structural ops
  save/                  # was persistence/ + editor state/ — API, drafts, save
  review/                # was ux/ — diff, safety, diagnostic navigation
  files/                 # paths, imports, file tree helpers (from lib/)
  types/                 # shared editor types (from lib/)
  metadata/              # metadata field definitions (from lib/)
  templates/             # was catalog/
  navigation/            # editorNavigationModel — if still <3 files after move, fold into session/
  diagrams/              # workbench (name kept)
    model/
      elements/
      constraints/
      scene/
      tools/
    source/              # generate/parse embedded diagram source
    save/                # local diagram repo while editing
    history/             # was diagrams/state/ — undo/redo
    checks/              # was diagnostics/
    ui/
      workbench/
      canvas/
      toolbar/
      inspector/
      scene/
      constraints/
      panels/
      modals/
      primitives/
  ui/                    # document editor chrome (not workbench)
    page/
    panels/
    blocks/
    preview/
    diff/
    safety/
    create/
    components/
```

**Naming ban (as folder names):** `persistence`, `contracts`, `hooks` (as a catch-all), `core`, `ux`, `lib` (inside editor). React hooks live **next to** the UI they serve (e.g. under `ui/workbench/`), not in a global `hooks/` dump.

**Import rules**

- `diagrams/model` must not import `diagrams/ui`.
- Document side (`session` / `document` / `ui`) talks to the workbench via a small façade (e.g. `DiagramWorkbench`), not deep `diagrams/ui/*` internals.

**Allowed rewrites:** split god-files (`DiagramWorkbench`, `GroupsAndLayersManager`, `useEditorCore`, `EditorPage`, `VisualEditorBlock`); tighten façades. **Not allowed:** full editor rewrite.

### 3. Shared lib and misplaced pieces

```
src/lib/
  theme/                 # was hooks/useThemeColors + helpers/constants.ts (DIFF_COLORS, DOMAIN_ICONS, …)
  stores/                # kept — Navigation, Glossary, UserProgress, DynamicVar
  page-context/          # was helpers/*Context* + MathStore*
  mdx/                   # mdxParser
  routes.ts              # was routeHelper
  README.md

content/glossary/        # glossaryDictionary data (authored material)

src/content-pages/
  screens/               # was pages/ (TheoremPage, …)
  shared/
  exercise/
  study-plan/

src/data/
  content/
  graph/
  metadata/              # MetadataStore (from content-pages/shared/metadata)

src/components/
  metadata/              # MetadataSidebar, PageDependencyGraph (UI only)
```

`design/`, `app/`, most of `components/`: README refresh only unless a file is clearly misplaced.

## Old → new map (internal)

| Today | New |
|---|---|
| `src/diagrams/spec/**` | `src/diagrams/model/**` + `src/diagrams/geometry/**` |
| `src/diagrams/core/**` | `src/diagrams/jsxgraph/**` |
| `src/diagrams/runtime/**` | `src/diagrams/render/**` |
| `editor/core/**` | `editor/session/**` |
| `editor/persistence/**` + `editor/state/**` | `editor/save/**` |
| `editor/ux/**` | `editor/review/**` |
| `editor/lib/**` | `editor/files/**`, `editor/types/**`, `editor/metadata/**` |
| `editor/catalog/**` | `editor/templates/**` |
| `editor/diagrams/state/**` | `editor/diagrams/history/**` |
| `editor/diagrams/diagnostics/**` | `editor/diagrams/checks/**` |
| `editor/diagrams/hooks/**` | next to owning UI / model |
| `lib/hooks/**` | `lib/theme/**` |
| `lib/helpers/constants.ts` | `lib/theme/` |
| `lib/helpers/*Context*`, `MathStore*` | `lib/page-context/**` |
| `lib/helpers/mdxParser.ts` | `lib/mdx/**` |
| `lib/helpers/routeHelper.ts` | `lib/routes.ts` |
| `lib/helpers/glossaryDictionary.ts` | `content/glossary/` |
| `content-pages/pages/**` | `content-pages/screens/**` |
| `content-pages/shared/metadata` store | `data/metadata/` |
| `content-pages/shared/metadata/ui` | `components/metadata/` |

## Execution order (PR-sized)

1. `src/diagrams/` → four dirs + subdirs + god-file splits  
2. `lib/` reorg + `glossaryDictionary` → `content/glossary/` + metadata → `data/` + `components/`  
3. `content-pages/pages` → `screens/`  
4. `fixed-pages/editor/` renames + `diagrams/model|ui` subdirs + splits  
5. READMEs, Vite aliases if any, depcruise, skills/CODEMAP still citing old paths  
6. Per-PR verification (domain tests / `full-check` as appropriate)

Prefer one domain per PR. Do not run parallel agents on overlapping paths (`diagrams` engine + `editor/diagrams` at once).

**Subagents (if used):** only Cursor-native **Grok** or **Composer**, one domain at a time.

## Success criteria

- New contributor finds diagram format math, JSXGraph adapters, renderer, editor session, save path, and workbench UI via README tables — without FSD/`spec`/`core` jargon.
- No catch-all `helpers/` or editor `hooks/` dump.
- Largest god-files split into named modules (or justified `ponytail:` ceiling comments).
- Each migration PR leaves the touched domain compiling and its tests green.

## Non-goals

- Renaming `src/diagrams` or `editor/diagrams` top segments.
- Moving authored MDX/demos layout under `content/` (already done).
- Introducing new dependencies for the reorg.
- Global “perfect” cluster redesign unrelated to findability.

## Follow-up after this spec

1. User reviews this file.  
2. `writing-plans` → implementation plan (phased tasks).  
3. Execute by phase; stamp/reindex code-graph after structural moves.
