# `src` — application code (new layout)

Scaffold only. Current app still runs from `src/`.

## Where is X?

| Looking for… | Folder |
|---|---|
| App startup, routes, providers | `app/` |
| Colors, typography, design tokens | `design/` |
| Reusable UI (not a full screen) | `components/` |
| Hooks, helpers, generic stores | `lib/` |
| Schemas, ContentStore, lean graph data types | `data/` |
| Diagram **engine** (spec / runtime / renderer) | `diagrams/` |
| Fixed product screens (home, graph, editor, …) | `fixed-pages/` |
| How MDX content types are rendered | `content-pages/` |

## Authored material

MDX, published diagram demos, and glossary **data** live in repo-root [`content/`](../content/README.md) — not here.

## Rules (short)

- `fixed-pages` and `content-pages` do not import each other.
- `diagrams/` here = engine. Demos = `content/diagrams/`.
- Prefer `content-pages/shared/` unless the type needs its own UI (`exercise`, `study-plan`).

