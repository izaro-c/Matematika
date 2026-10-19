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
| `ui/primitives/` | Shared UI primitives (see below) |

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

## UI primitives

`ui/primitives/` holds `Button`, `IconButton`, `SegmentedControl`, `Tabs`, `Panel`/`PanelHeader`, `Field`, `Modal` and `Toast`/`ToastRegion`. Their look lives in `src/app/styles/editor-primitives.css` (`.ed-*` classes), not in Tailwind strings: an old printed book with plain paper, one rule, small caps in Garamond, and the ☞ manicule only where it means "here" (the primary button, the checked segment). No eyebrows, no hint under every heading, no pills or shadows.

- `diagrams/ui/primitives` (`DiagramButton`, `DiagramField`, `DiagramPanel`, `DiagramTabBar`, `diagramControlClassName`) are thin wrappers over these; new code imports `ui/primitives` directly.
- `SegmentedControl` is a radio group and `Tabs` (`variant="tabs"`) a tab list, both with arrow keys; `Tabs variant="nav"` is a row of section links with `aria-current`.
- `Field` takes a single control and links its label, help and error (`aria-describedby`, `aria-invalid`); a bare control uses `controlClassName`.
- `Modal` traps focus with `useModalFocus`; pass `dismissible={false}` while an action must finish.

## Public API

Prefer stable paths (`ui/page/EditorPage`, `session/…`, `diagrams/ui/workbench/DiagramWorkbench`).

## UI strings (i18n)

- Every visible string lives in `editor.<area>.<key>` of `TranslationDictionary` (`src/i18n/types.ts`). Areas: `common`, `nav`, `language`, `landing`, `create`, `mdx`, `diagram`, `save` (add `errors` and others when their first key arrives). The diagram workbench UI (`diagrams/ui/**`) has one area per folder: `diagramEditors` (root-level editors and dialogs), `diagramCanvas`, `diagramConstraints`, `diagramInspector`, `diagramModals`, `diagramPanels`, `diagramScene`, `diagramToolbar`, `diagramWorkbench`, plus `diagramOptions` (object-kind, layout, type and layer labels, read through `diagrams/ui/diagramLabels.ts`). Sentences with inline `<b>`/`<code>` keep a single translation and are rendered with `diagrams/ui/primitives/richText.tsx`. Call it as `t('editor.save.saving')`.
- The engine (`session/`, `save/`, `document/`, `diagrams/model|save|checks`) never writes sentences: it returns an `EditorMessage` (`{ code: 'save.documentUpToDate', params? }`, code relative to `editor.`) from `types/editorMessage.ts`, and the UI renders it with `translateEditorText(t, text)`. `save/saveCapability.ts` is the reference implementation.
- `EditorText = EditorMessage | string`: a plain string is the legacy, untranslated form and is removed batch by batch.
- Plurals and document/diagram variants are chosen by code (`…One` / `…Other`, `document…` / `diagram…`), never by concatenating words: Basque inflects and reorders them.
- `npm run editor:safety:check` also runs `scripts/editor/check-hardcoded-strings.ts`: it fails when `ui/**` or `diagrams/ui/**` gain visible literals (JSX text and `title`/`placeholder`/`aria-label`/`alt`/`label`… attributes). Pending files are listed in `scripts/editor/hardcoded-strings-baseline.json` (file → count); it only shrinks. After migrating a batch run `npm run editor:i18n:baseline`.
