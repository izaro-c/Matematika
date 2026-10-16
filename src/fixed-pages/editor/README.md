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

## UI strings (i18n)

- Every visible string lives in `editor.<area>.<key>` of `TranslationDictionary` (`src/i18n/types.ts`). Areas: `common`, `nav`, `language`, `landing`, `create`, `mdx`, `diagram`, `save` (add `errors` and others when their first key arrives). Call it as `t('editor.save.saving')`.
- The engine (`session/`, `save/`, `document/`, `diagrams/model|save|checks`) never writes sentences: it returns an `EditorMessage` (`{ code: 'save.documentUpToDate', params? }`, code relative to `editor.`) from `types/editorMessage.ts`, and the UI renders it with `translateEditorText(t, text)`. `save/saveCapability.ts` is the reference implementation.
- `EditorText = EditorMessage | string`: a plain string is the legacy, untranslated form and is removed batch by batch.
- Plurals and document/diagram variants are chosen by code (`…One` / `…Other`, `document…` / `diagram…`), never by concatenating words: Basque inflects and reorders them.
- `npm run editor:safety:check` also runs `scripts/editor/check-hardcoded-strings.ts`: it fails when `ui/**` or `diagrams/ui/**` gain visible literals (JSX text and `title`/`placeholder`/`aria-label`/`alt`/`label`… attributes). Pending files are listed in `scripts/editor/hardcoded-strings-baseline.json` (file → count); it only shrinks. After migrating a batch run `npm run editor:i18n:baseline`.
