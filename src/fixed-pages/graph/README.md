# Domain: `graph`

**Qué es:** UI y worker del grafo de conocimiento.

**Qué no es:** grafo Lean/MDX de validación (`npm run validate-graph`), content MDX.

## Layout

| Ruta | Rol |
|---|---|
| `ui/` | componentes de grafo |
| `lib/` | helpers |
| `GraphStore.ts` | estado local del feature (si migra a shared, actualizar CODEMAP) |
| `graph.worker.ts` | worker |
| `constants.ts` | layout / physics defaults editables |

Widgets publicados: `src/widgets/graph/`.
