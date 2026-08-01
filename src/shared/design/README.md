# Domain: `shared-kit` / design tokens

**Única fuente de colores y roles semánticos de producto.**

## Editar color

1. Pigmentos claro/oscuro → `src/app/theme.css` (`--theme-*`)
2. Referencias CSS tipadas → [`primitives.ts`](./primitives.ts) (`THEME_COLOR_VARS`)
3. Roles (teorema, axioma, …) → [`semanticTokens.ts`](./semanticTokens.ts)
4. Acentos de página → [`pageAccents.ts`](./pageAccents.ts)
5. Paleta UI del inspector de diagramas → [`diagramPalette.ts`](./diagramPalette.ts)
6. Clases utilitarias → [`uiClasses.ts`](./uiClasses.ts)

## API pública

```ts
import { THEME_COLOR_VARS, SEMANTIC_COLOR_ROLES, DIAGRAM_PALETTE_TOKENS } from '@/shared/design';
```

## Anti-patrón

Duplicar listas `carbon/salvia/…` o `#hex` en features. Si hace falta una etiqueta UI, deriva de estos tokens.
