# Domain: `graph`

**Qué es:** UI y worker del grafo de conocimiento.

**Qué no es:** grafo MDX de validación (`npm run validate-graph`), content MDX.

## Layout

| Ruta | Rol |
|---|---|
| `GraphPage.tsx` | `/grafo`: lienzo de tinta (ForceGraph2D) y cartela |
| `ui/` | componentes de grafo (`GraphCartouche`: título, búsqueda y leyenda de `/grafo`) |
| `lib/` | helpers (`graphInk.ts`: tiempos y trazos de las microinteracciones del lienzo) |
| `GraphStore.ts` | estado local del feature (si migra a shared, actualizar CODEMAP) |
| `graph.worker.ts` | worker |
| `constants.ts` | layout / physics defaults editables |

Widgets publicados: `src/widgets/graph/`.
