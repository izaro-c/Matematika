# Design: `src` + `content` architecture

**Date:** 2026-08-01  
**Status:** approved — Task 7 cutover complete (`@`→`src`)  
**Scope:** Folder layout and documentation only. No code migration in this phase.  
**Primary tree:** `src/` + `content/` (legacy `src/` removed).

## Goal

Reorganize application code so any contributor can answer “where does X live?” without FSD jargon (`entities`, `widgets`, `platform`, `chrome`).

## Decisions (locked)

| Decision | Choice |
|---|---|
| Shape | Product domains + thin internal folders (`ui` / `model` / `lib` only when needed) |
| Folder language | English, plain words |
| Authored material | Repo-root `content/` (not under `src`) |
| Diagram demos vs engine | Demos in `content/diagrams/`; engine in `src/diagrams/` |
| Page families | `fixed-pages/` (product URLs) vs `content-pages/` (MDX templates) |
| Extra content-page types | Only when UI truly differs (`exercise`, `study-plan`); rest → `content-pages/shared/` |
| Target tree | `src/` scaffold beside `src/` |

## Tree

```
content/                         # MATERIAL (authors edit this)
  mdx/                           # theorems, exercises, plans, bios, …
  diagrams/                      # published demos tied to MDX
  glossary/                      # dictionary data (not UI)

src/
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
| App startup / router? | `src/app/` |
| Colors / typography? | `src/design/` |
| Button, layout, nav chrome, MDX blocks? | `src/components/` |
| Shared hooks / stores / helpers? | `src/lib/` |
| Zod schemas, content index API, lean graph JSON? | `src/data/` |
| DiagramSpec / JSXGraph runtime / renderer? | `src/diagrams/` |
| Fixed URL screen (home, graph, editor, …)? | `src/fixed-pages/<name>/` |
| How a content MDX type looks? | `src/content-pages/shared/` (or `exercise` / `study-plan`) |
| Published Pitágoras demo component? | `content/diagrams/` |

## Import rules

```
content/         →  must not import src
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
| `content/mdx/**` | `content/mdx/**` |
| `content/diagrams/**` | `content/diagrams/**` |
| Glossary term data (when extracted) | `content/glossary/` |
| `src/app/**` | `src/app/` |
| `src/design/**`, theme tokens | `src/design/` |
| `src/components/ui/**`, layouts, nav, mdx blocks | `src/components/` |
| `src/shared/{hooks,lib,stores}/**` | `src/lib/` |
| `src/content-pages/shared/templates/**` | `src/components/` or `content-pages/shared/` |
| `src/diagrams/**` | `src/diagrams/` |
| `src/data/**` | `src/data/` |
| `src/fixed-pages/editor/**` | `src/fixed-pages/editor/` |
| `src/fixed-pages/graph/**`, `src/widgets/graph/**` | `src/fixed-pages/graph/` |
| `src/fixed-pages/glossary/**` (UI) | `src/fixed-pages/glossary/` |
| `src/content-pages/study-plan/**` | `src/content-pages/study-plan/` |
| `src/content-pages/exercise/**` | `src/content-pages/exercise/` |
| `src/content-pages/shared/metadata/**` | `src/data/` and/or `fixed-pages/editor/` |
| `src/widgets/{layouts,navigation,mdx,content}` | `src/components/` |
| `src/content-pages/pages/Home/**` | `src/fixed-pages/home/` |
| Generic MDX route screens | `src/content-pages/shared/` |

## Out of scope (later plans)

- Moving files / updating imports / Vite aliases / depcruise
- Deleting or renaming `src/`
- Updating skills (`project-philosophy`, `page-creator`, `diagrama`) — required at cutover
- Rewriting `docs/architecture/CODEMAP.md` to point at `src` (do when migration starts)

## Success criteria

- A new contributor finds MDX, diagram engine, editor, and graph without reading FSD docs.
- `content/` never depends on `src`.
- Scaffold READMEs match this spec.
- No application code lives in `src` until an explicit migration plan runs.

## Skill impact (at cutover, not now)

When `src/` is retired, update: `project-philosophy`, `page-creator`, `diagrama`, `code-graph` path notes, `.dependency-cruiser.js`, `AGENTS.md` references to `src/`.
