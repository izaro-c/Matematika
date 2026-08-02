# `lib/`

Shared app utilities (not screens).

| Folder / file | Role |
|---|---|
| `theme/` | Theme colors hook + UI constants (difficulty colors, domain icons) |
| `stores/` | Zustand app state (navigation, glossary UI, progress, dynamic vars) |
| `page-context/` | React context providers used across content pages (MathStore, diagram sync, …) |
| `mdx/` | MDX parse helpers |
| `routes.ts` | `appPath()` URL builder |

Glossary **data** lives in `content/glossary/`. Metadata store: `data/metadata/`; metadata UI: `components/metadata/`.
