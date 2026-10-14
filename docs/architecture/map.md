# Architectural Map & Atlas

> **TL;DR**: Canonical high-density architecture atlas for Matematika. Maps `src/` layers, `content/` layout, hard architectural boundaries, and targeted verification workflows.

## 1. Source Layout (`src/`)

| Folder | Responsibility & Key Elements |
|---|---|
| `app/` | Startup, router (`wouter`), global providers, global CSS (`app/styles/`). |
| `design/` | Design tokens ("Arts and Crafts"), typography, KaTeX macros/styles. |
| `components/` | Generic reusable UI elements (buttons, modals, dialogs; not full screens). |
| `lib/` | Hooks, generic Zustand stores (`MathStore`, `GlossaryStore`, `NavigationStore`), utilities. |
| `data/` | `ContentStore`, metadata schemas (Zod). |
| `diagrams/` | Interactive diagram engine (model/schemas v3, geometry math, JSXGraph adapters, React renderers). |
| `fixed-pages/` | Fixed app screens (`home`, `graph`, `glossary`, `mathematicians`, `editor`). |
| `content-pages/` | Renderers for MDX content types (`theorem`, `definition`, etc.). |
| `i18n/` | Translations, localized routing. |

## 2. Content Location (`content/`)

- `content/mdx/`: Atomic MDX mathematical nodes (`es/`, `en/`, `eu/`).
- `content/diagrams/`: Published interactive diagram modules (`.tsx`).

## 3. Inviolable Architectural Boundaries

- **Screen Isolation**: `fixed-pages` and `content-pages` do **NOT** import each other.
- **Engine vs Content**: `src/diagrams/` is strictly the engine; authored diagrams live in `content/diagrams/`.
- **Library Encapsulation**: JSXGraph is only touched inside `src/diagrams/jsxgraph/`. No other module may directly import `jsxgraph`.

## 4. Command Cheat-Sheet

| Workflow | Commands |
|---|---|
| **Routine verification** | `npm run typecheck`<br>`npm run test:fast`<br>`npx vitest run <path>` |
| **Content checks** | `npm run validate-references && npm run validate-graph && npm run content:coverage` |
| **Full release** | `npm run full-check`<br>`npm run editor:release-check` |
| **Avoid in routine tasks** | Do **NOT** run full `npm run dev` or `npm run test` on routine agent tasks. |
