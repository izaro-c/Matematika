# Domain: `editor`

**What:** Authoring MDX documents and diagrams (diff, safety, inspector, workbench).

**Not:** Published JSXGraph runtime (`src/diagrams/`), demos (`content/diagrams/`), design tokens (`src/design/`).

## Layout

| Path | Role |
|---|---|
| `session/` | Open/parse/validate document (`useEditorCore`, …) |
| `document/` | MDX structural operations |
| `save/` | API, drafts, save coordination |
| `review/` | Diff review, safety presentation |
| `files/` | Paths, imports, file-tree helpers |
| `types/` | Shared editor types/contracts |
| `metadata/` | Metadata field definitions |
| `templates/` | Resource catalog / templates |
| `diagrams/` | Diagram workbench (model + UI) |
| `ui/page/` | Editor page chrome |

## Diagrams workbench

| Path | Role |
|---|---|
| `diagrams/model/` | Elements, constraints, scene, tools |
| `diagrams/source/` | Generate/parse embedded diagram source |
| `diagrams/history/` | Undo/redo + diagram state hook |
| `diagrams/checks/` | Diagnostics |
| `diagrams/save/` | Local diagram repository while editing |
| `diagrams/ui/workbench/` | Main workbench shell |
| `diagrams/ui/canvas/` | Board host / stage |
| `diagrams/ui/toolbar/` | Tools chrome |
| `diagrams/ui/inspector/` | Element inspectors |
| `diagrams/ui/constraints/` | Constraint editors |

## Public API

Prefer stable paths (`ui/page/EditorPage`, `session/…`, `diagrams/ui/workbench/DiagramWorkbench`).
