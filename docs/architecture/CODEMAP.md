# CODEMAP — ¿Dónde edito X?

Mapa vivo del monorepo Matematika. **Primario:** `src/` + `content/`.

Docs in-code: [DOCSTYLE.md](./DOCSTYLE.md) · generar API: `npm run docs:build` → `docs/api/`  
Migración: [plan](../superpowers/plans/2026-08-01-src-migration.md) · [spec](../superpowers/specs/2026-08-01-src-architecture-design.md)

## Alias

| Alias | Raíz |
|---|---|
| `@/` | `src/` |
| `@content/` | `content/` |

## Árbol

| Dominio | Ruta |
|---|---|
| Material MDX / demos / glossary data | `content/mdx/`, `content/diagrams/`, `content/glossary/` |
| Arranque | `src/app/` |
| Design tokens | `src/design/` |
| UI reutilizable | `src/components/` |
| Hooks / stores / helpers | `src/lib/` |
| Schemas / ContentStore / lean graph | `src/data/` |
| Motor de diagramas | `src/diagrams/` |
| Pantallas fijas | `src/fixed-pages/` |
| Plantillas MDX / ejercicios / plan / route shells | `src/content-pages/` (`shared/`, `exercise/`, `study-plan/`, `pages/`) |

## Fronteras

- `fixed-pages` ↛ `content-pages` (y al revés); composición en `app/`
- `design` ↛ diagrams / pages / data
- `content/` ↛ app / pages / components / lib / design / data (motor `@/diagrams` OK)
- Ver `.dependency-cruiser.js`

## DoD al tocar un dominio

1. Audit (code-graph) + design note en README del dominio  
2. TSDoc en exports públicos ([DOCSTYLE](./DOCSTYLE.md))  
3. Tests + `depcruise` + `docs:build`  

## READMEs

- [src](../../src/README.md)
- [content](../../content/README.md)
