# 02 — Arquitectura del Sistema

## Stack Tecnológico y Justificación

| Tecnología | Rol | Porqué |
|---|---|---|
| React 19 | UI framework | Componentes funcionales, Hooks, integración perfecta con MDX |
| Vite 8 | Build tool | `import.meta.glob` para el ContentStore + HMR instantáneo |
| TypeScript strict | Lenguaje | Modelado tipado de estructuras matemáticas y schemas de contenido |
| Tailwind CSS v4 | Estilos | Tokens semánticos + utilidades atómicas |
| Wouter | Router | Minimalista y sin boilerplate; rutas generadas dinámicamente |
| Zustand | Estado | Stores locales (por lección) y globales (navegación/búsqueda) |
| MDX | Contenido | Markdown con JSX: permite integrar componentes React en los textos |
| JSXGraph | Gráficos 2D | Geometría plana, funciones, sistemas de ecuaciones |
| Three.js | Gráficos 3D | Geometría espacial, planos, vectores en el espacio |
| KaTeX | Tipografía matemática | Alto rendimiento; integración con `remark-math` y `rehype-katex` |

---

## Estructura de Carpetas

```
src/
├── App.tsx                    # Rutas dinámicas generadas desde ContentStore
├── store/
│   ├── ContentStore.ts        # import.meta.glob → índice maestro de todo el contenido
│   ├── MathStoreContext.tsx   # Provider de Zustand local por lección/teorema
│   ├── NavigationStore.ts     # Estado global: Marginalia, Omnibar, tema
│   └── GlossaryStore.ts       # Diccionario de símbolos globales
├── components/
│   ├── ui/
│   │   └── MDXBlocks.tsx      # Componentes inyectados en el MDXProvider global
│   ├── MarginaliaPanel.tsx    # Panel lateral derecho de navegación contextual
│   ├── SearchOmnibar.tsx      # Buscador universal (Cmd+K)
│   ├── BiographyLayout.tsx    # Layout para páginas de matemáticos
│   ├── InteractiveLessonLayout.tsx
│   └── ...
├── pages/
│   ├── HomePage.tsx           # Portada / índice visual
│   ├── TheoremPage.tsx
│   ├── DefinitionPage.tsx
│   ├── ExamplePage.tsx        # Página de ejemplos resueltos
│   ├── ExercisePage.tsx       # Página de ejercicios interactivos
│   ├── BranchPage.tsx         # Vista por rama matemática
│   ├── StudyPlanPage.tsx      # Roadmap de un plan de estudio concreto
│   ├── HistoryTimeline.tsx    # Índice visual de matemáticos
│   └── DictionaryPage.tsx
├── diagrams/                  # Simuladores JSXGraph/Three.js organizados por tema
│   ├── LinearAlgebra/
│   ├── Pitagoras/
│   └── MetodosDemostracion/
├── content/                   # TODO el contenido en MDX
│   ├── lessons/
│   ├── theorems/
│   ├── definitions/
│   ├── examples/
│   ├── exercises/
│   ├── mathematicians/
│   ├── demonstrations/
│   └── plans/
scripts/
├── auto_maths.cjs             # Generación automática de MDX en lote
└── populate_maths.cjs         # Relleno de contenido existente
```

---

## Patrones Arquitectónicos

### A. ContentStore (Data Layer)
`import.meta.glob` escanea todas las carpetas de `src/content/` y genera un índice en tiempo de build. Cada archivo MDX exporta su `metadata` (frontmatter tipado por `schemas.ts`) y su componente React. El ContentStore provee getters: `getAllTheorems()`, `getLessonById()`, `getAllMathematicians()`, etc.

### B. Rutas Dinámicas (No hardcoding)
`App.tsx` itera el ContentStore para registrar rutas en Wouter. No se añaden rutas a mano. Añadir un `.mdx` nuevo en la carpeta correcta es suficiente para que aparezca en la app.

### C. Estado Aislado por Contexto (MathProvider)
El estado matemático de la simulación de un nodo es **local**. Al entrar en `/teorema/pitagoras`, se monta un `MathProvider` con un store de Zustand virgen. Al salir, React desmonta el Provider y el Garbage Collector limpia los listeners de JSXGraph/Three.js (evitando memory leaks).

**Excepción:** Los stores de navegación (`NavigationStore`) y glosario (`GlossaryStore`) sí son globales: persisten entre rutas.

### D. Panel Marginalia (Navegación sin cambio de ruta)
Cuando el usuario hace clic en un `<ConceptLink>`, no navega. El componente emite una acción al `NavigationStore` global que desliza el `MarginaliaPanel` desde la derecha, mostrando la información del nodo destino (con un botón "Leer artículo completo" que sí navega si el usuario quiere).

> **Por qué no tooltips/popups:** Se descartaron el 2026-06-15 porque al estar el link cerca del borde del viewport, el popup se cortaba visualmente. El panel lateral no tiene este problema.

### E. Schemas Tipados (src/store/schemas.ts)
Cada tipo de contenido tiene un schema Zod que valida el frontmatter del MDX:
- `TheoremSchema`: `{ id, title, branch, tags, requires[], summary }`
- `LessonSchema`: `{ id, title, branch, summary, simulation? }`
- `ExerciseSchema`: `{ id, title, difficulty, relatedTheorems[] }`
- `ExampleSchema`: `{ id, title, relatedTheorems[] }`
- `MathematicianSchema`: `{ slug, name, born, died, nationality, contributions[] }`
