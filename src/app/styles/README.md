# Estilos de app (`src/app/styles`)

CSS de composición visual. Los **tokens tipados** están en `src/design/` (TypeScript), no aquí.

## Glosario rápido

| Concepto | Qué es | Dónde |
|---|---|---|
| **Página de contenido** | Axioma, definición, teorema, etc. | `ContentLayout` + `content-layout*.css` |
| **Columna de texto** | Lectura principal | `.content-reading` |
| **Columna de diagrama** | Visualización sticky | `.content-diagram` |
| **Bloque secundario** | Ejemplos / ejercicios debajo | `.content-secondary` |
| **Índice** | Sidebar / drawer de navegación local | `.content-metadata` |
| **Color de tipo** | Acento según axioma/definición/… | `--page-accent`, `content-layout-type-color.css` |
| **Proporción** | Cuánto espacio texto vs diagrama | `variant` + vars en `content-layout-columns.css` |
| **Códice** | Layout de **demostraciones** | `CodexLayout` + `codex-layout.css` |
| **Clases `.ac-*`** | UI Arts & Crafts reutilizable | `ac-classes.css`, `ac-pill.css` |

## Pipeline (`../index.css`)

| Archivo | En una frase |
|---|---|
| `../theme.css` | Pigmentos `--theme-*` |
| `katex.css` | Retoques KaTeX |
| `ac-classes.css` | Tipografía/superficies `.ac-eyebrow`, `.ac-label`, botones… |
| `base.css` | `html` / `body` |
| `utilities.css` | Helpers sueltos |
| `ac-pill.css` | Badges `.ac-pill` |
| `mdx-prose.css` | Tipografía del MDX (`.prose`, `.editorial-reading`) |
| `content-layout.css` | Layout de páginas de contenido (entrada) |
| `codex-layout.css` | Layout de demostraciones |
| `theorem-wide-tree.css` | Teorema muy ancho + árbol axiomático (≥1600px) |
| `paper-and-ink.css` | Grano de papel y tinta |
| `page-loading.css` | Pantalla de espera de ruta / MDX |
| `skeletons.css` | Skeletons de diagrama y grafo |

## Layout de páginas de contenido

Entrada: `content-layout.css` →

1. **`content-layout-columns.css`** — rejilla texto | diagrama. **Proporciones = variables al inicio del archivo.**
2. **`content-layout-index.css`** — índice (drawer móvil, columna en escritorio).
3. **`content-layout-type-color.css`** — pinta la página con `--page-accent`.

Componente: `src/components/layouts/ContentLayout.tsx`.

### Proporciones (`data-layout-variant`)

Escritorio (≥1024px): **diagrama = `--content-diagram-share` (50%)**; texto = resto.
Dentro de la columna de texto: tope `--content-reading-measure` + margen `--content-reading-inset`.
Móvil/tablet: diagrama apilado a ancho completo.

```css
/* content-layout-columns.css → .content-layout { … } */
--content-diagram-share: 50%;
--content-reading-measure: 85ch;
--content-reading-measure-solo: 140ch;
--content-reading-inset: clamp(1.5rem, 4vw, 3.5rem);
```

### Zonas en el DOM

```
.content-layout
├── .content-metadata     ← índice (opcional)
└── .content-content
    ├── .content-primary
    │   ├── .content-reading   ← children (texto)
    │   └── .content-diagram   ← diagram (opcional)
    └── .content-secondary     ← secondary (opcional)
```

## Relación con `src/design`

| Capa | Qué editar |
|---|---|
| `theme.css` | Valores de color |
| `src/design/*.ts` | Nombres tipados y acentos de tipo de página |
| estos CSS | Layout y composición |

No duplicar hex ni listas de color fuera de theme/design.
