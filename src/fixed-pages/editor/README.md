# Domain: `editor`

**Qué es:** autoría de documentos MDX y diagramas (diff, safety, inspector, workbench).

**Qué no es:** runtime JSXGraph publicado (`shared/diagrams`), demos de página (`widgets/diagrams`), tokens de color (`shared/design`).

## Layout

| Ruta | Rol |
|---|---|
| `core/` | ciclo de vida del editor (`useEditorCore`, …) |
| `diagrams/` | UI + modelo de trabajo del diagrama en el editor |
| `document/` | documento MDX en edición |
| `persistence/` | guardar / cargar |
| `ui/` | páginas y paneles de UI (diff, safety, …) |
| `ux/` | políticas UX (p. ej. diff review) |
| `lib/` | contratos y helpers del feature |
| `constants.ts` | números/límites editables del editor |

## API pública

Preferir imports desde rutas estables del feature (`ui/EditorPage`, `core/…`). No importar desde `widgets/`.

## Constantes / estilo

- Constantes de producto: [`constants.ts`](./constants.ts)
- Colores: `@/shared/design` (no hex locales)
