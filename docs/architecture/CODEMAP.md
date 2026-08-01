# CODEMAP — ¿Dónde edito X?

Mapa vivo del monorepo Matematika. FSD + dominios-producto. Si no está aquí, añade una fila en el mismo PR.

## Dominios

| Dominio | Rutas |
|---|---|
| `app-shell` | `src/app/`, `src/pages/`, `src/widgets/navigation/` |
| `editor` | `src/features/editor/` |
| `diagrams` | `src/shared/diagrams/`, UI: `src/features/editor/diagrams/`, `src/widgets/diagrams/` |
| `content` | `src/database/content/`, `src/features/glossary/`, `src/entities/content/` |
| `progress` | `src/features/progress/` |
| `graph` | `src/features/graph/`, `src/entities/graph/`, `src/widgets/graph/` |
| `exercises` | `src/features/exercises/` |
| `shared-kit` | `src/shared/design/`, `src/shared/ui/`, `src/shared/stores/`, `src/shared/lib/` |

## Quiero cambiar…

| X | Ve a |
|---|---|
| Color / tipografía / spacing de producto | `src/shared/design/` + `src/app/theme.css` + `src/app/styles/` |
| Rol semántico (axioma, teorema, …) | `src/shared/design/semanticTokens.ts` |
| Paleta del inspector de diagramas | `src/shared/design/diagramPalette.ts` |
| Spec / escena / viewport de diagrama | `src/shared/diagrams/spec/` (`scene*.ts` partidos por cohesión) |
| Contrato público diagrams | `src/shared/diagrams/public.ts` |
| Runtime JSXGraph / board | `src/shared/diagrams/runtime/` |
| Canvas / inspector del editor | `src/features/editor/diagrams/ui/` |
| Guardar, diff, unsaved, safety | `src/features/editor/` (`core/`, `ux/`, `ui/diff/`, `ui/safety/`) |
| Demo publicada en página | `src/widgets/diagrams/` |
| ConceptLink / diccionario | `src/features/glossary/` + `src/entities/content/` |
| Página MDX | `src/database/content/` |
| Plan de estudio / progreso | `src/features/progress/` |
| Grafo de conocimiento UI | `src/features/graph/` + `src/widgets/graph/` |
| Stores canónicos (Zustand) | `src/shared/stores/` |
| Constantes de dominio | `*/constants.ts` del slice (ver READMEs) |
| Fronteras de import | `.dependency-cruiser.js` |

## Fronteras (depcruise)

- `pages` → features/widgets; nunca al revés
- `widgets` ↛ `features` (excepción: `widgets/mdx/MDXBlocks.tsx`)
- `widgets/diagrams` ↛ `features/editor`
- `shared` ↛ capas superiores
- `features` ↛ otras features (deep-import)
- Tokens: no `#hex` de producto en features; usar `shared/design`

## Anti-patrones

- Deep-import a internos de otro slice
- Duplicar nombres de color Arts & Crafts fuera de `shared/design` / `theme.css`
- Shims de reexport “para siempre”
- God-file sin plan de cohesión documentado

## READMEs de dominio

- [editor](../../src/features/editor/README.md)
- [diagrams](../../src/shared/diagrams/README.md)
- [design](../../src/shared/design/README.md)
- [glossary](../../src/features/glossary/README.md)
- [progress](../../src/features/progress/README.md)
- [graph](../../src/features/graph/README.md)
- [exercises](../../src/features/exercises/README.md)
