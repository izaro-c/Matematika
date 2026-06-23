# Explicación de dependencias del proyecto Matematika

---

## 🏗️ Build & Tooling

### `vite` (devDependency)
**Motor de desarrollo y empaquetado.** Equivalente a Maven/Gradle en Java. Proporciona:
- Servidor de desarrollo con Hot Module Replacement (HMR): los cambios se reflejan al instante sin recargar la página
- Empaquetado para producción (`vite build`): tree-shaking, code splitting, minificación
- Soporte nativo para TypeScript, JSX, CSS modules
- Plugin system para extender funcionalidad (Tailwind, React, MDX)

### `@vitejs/plugin-react` (devDependency)
**Plugin de Vite para React.** Habilita:
- JSX Transform automático (no necesita `import React from 'react'`)
- Fast Refresh: preserva el estado de los componentes durante HMR
- Optimización de React para producción

### `typescript` (devDependency)
**Compilador de TypeScript.** Añade tipado estático a JavaScript. Equivalente a `javac`. Proporciona:
- Verificación de tipos en tiempo de compilación (`tsc -b`)
- Interfaces, genéricos, enums, modificadores de acceso (`private`, `readonly`)
- Archivo `tsconfig.json` para configuración del compilador

### `tsx` (devDependency)
**Ejecutor de TypeScript.** Permite ejecutar archivos `.ts` directamente sin compilar, como si fueran scripts. Usado en los scripts del proyecto: `validate-graph`, `generate-content-index`, etc. Equivalente a ejecutar un `.jar` o un script Python.

### `eslint` + plugins (devDependencies)
**Linter de código.** Analiza el código en busca de errores, malas prácticas y problemas de estilo. Equivalente a Checkstyle/PMD en Java. Plugins adicionales:
- `@eslint/js`: reglas base de ESLint
- `typescript-eslint`: reglas específicas para TypeScript
- `eslint-plugin-react-hooks`: reglas para hooks de React (useEffect, useState)
- `eslint-plugin-react-refresh`: reglas para Fast Refresh
- `eslint-plugin-sonarjs`: reglas de calidad de código de Sonar

### `husky` (devDependency)
**Git hooks.** Ejecuta scripts automáticamente en eventos de Git (pre-commit, pre-push). Usado para validación antes de commit.

### `lint-staged` (devDependency)
**Ejecuta linters solo en archivos modificados.** Optimiza husky para no analizar todo el proyecto en cada commit.

---

## ⚛️ Frontend Core

### `react` + `react-dom`
**Librería de interfaces de usuario.** El núcleo de la aplicación. Proporciona:
- **Componentes**: funciones que devuelven JSX (HTML aumentado con lógica)
- **Virtual DOM**: actualiza solo las partes de la página que cambian
- **Hooks**: `useState`, `useEffect`, `useRef` para estado y efectos
- **React 19**: soporte para Server Components y mejoras de rendimiento

### `wouter`
**Router minimalista para React.** Equivalente a `@RequestMapping` en Spring MVC. Gestiona:
- Navegación entre páginas sin recargar (SPA)
- Rutas dinámicas (`/teorema/:id`)
- Navegación programática (`useLocation`, `Link`)

### `@xyflow/react` (ReactFlow)
**Motor de grafos interactivos.** Renderiza el DAG de axiomas como un grafo visual con:
- Nodos arrastrables y conectables
- Layouts automáticos
- Zoom, paneo, selección
- Usado en `AxiomaticTree.tsx` para el grafo de dependencias

### `dagre`
**Algoritmo de layout para grafos dirigidos.** Calcula posiciones óptimas para nodos y aristas en un DAG. ReactFlow usa dagre internamente para posicionar los nodos del grafo de axiomas.

### `react-force-graph-2d`
**Visualización de grafos con física de fuerzas.** Alternativa a ReactFlow para grafos que necesitan simulación física (nodos que se repelen, aristas que actúan como muelles).

### `@react-three/fiber` + `@react-three/drei` + `three` + `three-stdlib`
**Renderizado 3D con Three.js en React.** Usado para visualizaciones matemáticas tridimensionales (modelos geométricos, superficies). Three.js es el motor 3D; fiber lo integra con React; drei añade helpers (cámaras, luces, controles).

### `@monaco-editor/react`
**Editor de código integrado.** El mismo editor que VS Code, empaquetado como componente React. Usado en el Editor de contenidos para que el Autor pueda escribir MDX con resaltado de sintaxis y autocompletado.

---

## 🎨 Estilos

### `tailwindcss` + `@tailwindcss/vite` (devDependencies)
**Framework CSS utilitario.** En lugar de escribir CSS tradicional, se usan clases como `text-carbon`, `bg-lienzo`, `rounded-sm` directamente en el JSX. El plugin de Vite compila solo las clases usadas (tree-shaking de CSS). La paleta Arts & Crafts del proyecto está definida como tokens de Tailwind.

### `autoprefixer` + `postcss` (devDependencies)
**Procesamiento de CSS.** Autoprefixer añade prefijos de navegador automáticamente (-webkit-, -moz-). PostCSS es el motor de transformación de CSS que usa Tailwind.

---

## 📝 Contenido MDX

### `@mdx-js/rollup` + `@mdx-js/react`
**MDX: Markdown + JSX.** Permite escribir contenido matemático en archivos `.mdx` que mezclan Markdown con componentes React. El plugin de Rollup/Vite compila los archivos `.mdx` a componentes React. Cada teorema, definición y demostración es un archivo MDX.

### `remark-math` + `rehype-katex`
**LaTeX en Markdown.** `remark-math` reconoce bloques `$$...$$` en Markdown. `rehype-katex` los renderiza como fórmulas matemáticas tipográficamente correctas.

### `katex`
**Motor de renderizado de LaTeX.** Más rápido que MathJax. Renderiza fórmulas matemáticas en el navegador con tipografía profesional.

### `remark-gfm`
**Soporte para GitHub Flavored Markdown.** Añade tablas, listas de tareas, tachado, etc.

---

## 🗃️ Estado y Validación

### `zustand`
**Gestor de estado global.** Equivalente a los `@Service` de Spring o al patrón Redux. Cada "store" es un almacén de estado con acciones:
- `GraphStore.ts`: estado del grafo principal
- `GraphSandboxStore.ts`: estado del modo sandbox
- `GlossaryStore.ts`: términos del glosario
- `LessonStore.ts`: progreso en lecciones

Ventajas sobre Redux: API mínima, sin boilerplate, soporte para suscripciones selectivas.

### `zod`
**Validación de esquemas en runtime.** Equivalente a Bean Validation (`@NotNull`, `@Size`) en Java. Define y valida la estructura de los metadatos de cada archivo MDX:
```typescript
const DemoSchema = z.object({
  id: z.string(),
  type: z.literal('demostracion'),
  parentTheorem: z.string(),
  proofMethod: z.enum(['directo', 'contradiccion', ...]),
});
```
Si un archivo MDX tiene metadatos inválidos, Zod lanza un error descriptivo.

---

## 🧪 Testing

### `vitest`
**Framework de testing.** Equivalente a JUnit. Compatible con la API de Jest (`describe`, `it`, `expect`). Integrado con Vite para ejecución rápida. Soporta:
- Tests unitarios
- Tests de integración
- Cobertura de código (`--coverage`)
- Modo watch (re-ejecuta al guardar)

### `@testing-library/react` + `@testing-library/jest-dom`
**Testing de componentes React.** Renderiza componentes en un DOM virtual y permite hacer assertions sobre el contenido renderizado. `jest-dom` añade matchers como `toBeInTheDocument()`.

### `jsdom`
**Implementación del DOM para Node.js.** Simula un navegador en el entorno de testing para que los componentes React puedan renderizarse sin un navegador real.

---

## 📊 Diagramas y Documentación

### `@mermaid-js/mermaid-cli`
**Generación de diagramas Mermaid.** Convierte texto plano en diagramas (flujo, secuencia, clases). Alternativa a PlantUML para documentación rápida.

### `typedoc`
**Generación de documentación de API.** Equivalente a Javadoc. Analiza el código TypeScript y genera documentación HTML a partir de tipos, interfaces y comentarios JSDoc.

---

## 🔍 Utilidades

### `fuse.js`
**Búsqueda difusa (fuzzy search).** Motor de la Omnibar: permite buscar teoremas, definiciones y conceptos escribiendo aproximaciones. Tolera errores tipográficos y ordena por relevancia.

### `puppeteer`
**Automatización de navegador.** Controla Chrome/Chromium programáticamente. Usado para:
- Generar PDFs de contenido
- Tests end-to-end
- Capturas de pantalla automatizadas

### `gh-pages` / `ghpages`
**Despliegue en GitHub Pages.** Publica la carpeta `dist/` en la rama `gh-pages` para hosting estático gratuito.

---

## 🔧 Desarrollo

### `dependency-cruiser` (devDependency)
**Análisis de dependencias entre módulos.** Genera grafos de dependencias del código fuente para detectar acoplamiento excesivo, dependencias circulares, y violaciones de arquitectura (ej: una capa Boundary importando directamente de Database).

### `rollup-plugin-visualizer` (devDependency)
**Visualización del bundle.** Genera un diagrama interactivo mostrando el tamaño de cada módulo en el build final. Ayuda a identificar dependencias pesadas y optimizar el tamaño.

---

## Resumen visual

```
┌─────────────────────────────────────────────────────┐
│  MATEMATIKA — Stack Technology                      │
├─────────────────────────────────────────────────────┤
│  🖥️  UI        React 19 + wouter + @xyflow/react     │
│  🎨  Styles     Tailwind CSS 4 + PostCSS             │
│  📝  Content    MDX + remark-math + KaTeX            │
│  🗃️  State      Zustand 5 + Zod 4                    │
│  🏗️  Build      Vite 8 + TypeScript 6 + ESLint        │
│  🧪  Test       Vitest 4 + Testing Library           │
│  🚀  Deploy     GitHub Pages + gh-pages              │
│  📊  Diagrams   Mermaid + typedoc + PlantUML         │
└─────────────────────────────────────────────────────┘
```
