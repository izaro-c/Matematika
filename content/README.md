# `content/` — authored material

Data and demos that authors edit. **No app imports from `src2`.**

| Folder | What |
|---|---|
| `mdx/` | MDX pages (theorems, exercises, plans, bios, …). Today: `src/database/content/` |
| `diagrams/` | Published interactive demos tied to those pages. Today: `src/widgets/diagrams/` |
| `glossary/` | Dictionary term data (UI lives in `src2/fixed-pages/glossary/`) |

The TypeScript that **reads** this tree will live in `src2/data/` after migration.
