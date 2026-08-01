# Design: `src2` + `content` architecture

**Date:** 2026-08-01  
**Status:** draft — awaiting user review (scaffold READMEs written; no code moved)  
**Scope:** Folder layout and documentation only. No code migration in this phase.  
**Coexists with:** current `src/` until a later cutover plan.

## Goal

Reorganize application code so any contributor can answer “where does X live?” without FSD jargon (`entities`, `widgets`, `platform`, `chrome`).

## Decisions (locked)

| Decision | Choice |
|---|---|
| Shape | Product domains + thin internal folders (`ui` / `model` / `lib` only when needed) |
| Folder language | English, plain words |
| Authored material | Repo-root `content/` (not under `src2`) |
| Diagram demos vs engine | Demos in `content/diagrams/`; engine in `src2/diagrams/` |
| Page families | `fixed-pages/` (product URLs) vs `content-pages/` (MDX templates) |
| Extra content-page types | Only when UI truly differs (`exercise`, `study-plan`); rest → `content-pages/shared/` |
| Target tree | `src2/` scaffold beside `src/` |

## Tree

```
content/                         # MATERIAL (authors edit this)
  mdx/                           # theorems, exercises, plans, bios, …
  diagrams/                      # published demos tied to MDX
  glossary/                      # dictionary data (not UI)

src2/
  README.md                      # map: “where is X?”

  app/                           # bootstrap: main, routes, providers
  design/                        # colors, type, tokens, theme
  components/                    # reusable UI (not full screens)
  lib/                           # hooks, pure helpers, generic stores
  data/                          # schemas, ContentStore, lean graph types/json
  diagrams/                      # ENGINE: spec, runtime, renderer

  fixed-pages/                   # stable product screens
    home/
    glossary/                    # glossary UI (data in content/glossary)
    mathematicians/              # index/listing (bios MDX in content/mdx)
    graph/
    editor/

  content-pages/                 # how an MDX entry is rendered
    shared/                      # common shell (theorem, definition, …)
    exercise/
    study-plan/
```

## How to find things

| Question | Go to |
|---|---|
| Authored MDX / demo / glossary term data? | `content/` |
| App startup / router? | `src2/app/` |
| Colors / typography? | `src2/design/` |
| Button, layout, nav chrome, MDX blocks? | `src2/components/` |
| Shared hooks / stores / helpers? | `src2/lib/` |
| Zod schemas, content index API, lean graph JSON? | `src2/data/` |
| DiagramSpec / JSXGraph runtime / renderer? | `src2/diagrams/` |
| Fixed URL screen (home, graph, editor, …)? | `src2/fixed-pages/<name>/` |
| How a content MDX type looks? | `src2/content-pages/shared/` (or `exercise` / `study-plan`) |
| Published Pitágoras demo component? | `content/diagrams/` |

## Import rules

```
content/         →  must not import src2
design/          →  must not import pages, diagrams engine, data domain UI
components/      →  design, lib
lib/             →  design (minimal); not pages
data/            →  design, lib
diagrams/        →  design, lib, data (types only)
fixed-pages/     →  components, design, lib, data, diagrams
content-pages/   →  components, design, lib, data, diagrams
app/             →  may compose all (wiring only)
```

- `fixed-pages` ↛ `content-pages` and reverse; compose in `app` routes.
- New MDX type with distinct React UI → new folder under `content-pages/`; otherwise use `shared/`.

## Old → new map

| Today | New |
|---|---|
| `src/database/content/**` | `content/mdx/**` |
| `src/widgets/diagrams/**` | `content/diagrams/**` |
| Glossary term data (when extracted) | `content/glossary/` |
| `src/app/**` | `src2/app/` |
| `src/shared/design/**`, theme tokens | `src2/design/` |
| `src/shared/ui/**`, layouts, nav, mdx blocks | `src2/components/` |
| `src/shared/{hooks,lib,stores}/**` | `src2/lib/` |
| `src/shared/templates/**` | `src2/components/` or `content-pages/shared/` |
| `src/shared/diagrams/**` | `src2/diagrams/` |
| `src/entities/**` | `src2/data/` |
| `src/features/editor/**` | `src2/fixed-pages/editor/` |
| `src/features/graph/**`, `src/widgets/graph/**` | `src2/fixed-pages/graph/` |
| `src/features/glossary/**` (UI) | `src2/fixed-pages/glossary/` |
| `src/features/progress/**` | `src2/content-pages/study-plan/` |
| `src/features/exercises/**` | `src2/content-pages/exercise/` |
| `src/features/metadata/**` | `src2/data/` and/or `fixed-pages/editor/` |
| `src/widgets/{layouts,navigation,mdx,content}` | `src2/components/` |
| `src/pages/Home/**` | `src2/fixed-pages/home/` |
| Generic MDX route screens | `src2/content-pages/shared/` |

## Out of scope (later plans)

- Moving files / updating imports / Vite aliases / depcruise
- Deleting or renaming `src/`
- Updating skills (`project-philosophy`, `page-creator`, `diagrama`) — required at cutover
- Rewriting `docs/architecture/CODEMAP.md` to point at `src2` (do when migration starts)

## Success criteria

- A new contributor finds MDX, diagram engine, editor, and graph without reading FSD docs.
- `content/` never depends on `src2`.
- Scaffold READMEs match this spec.
- No application code lives in `src2` until an explicit migration plan runs.

## Skill impact (at cutover, not now)

When `src/` is retired, update: `project-philosophy`, `page-creator`, `diagrama`, `code-graph` path notes, `.dependency-cruiser.js`, `AGENTS.md` references to `src/`.
