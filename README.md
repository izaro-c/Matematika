# Matematika - Enciclopedia Viva

Matematika es una plataforma enciclopédica interactiva diseñada para explorar el conocimiento matemático. En lugar de presentar páginas aisladas, los conceptos, teoremas y biografía de matemáticos están entrelazados en una red navegable.

---

## Características Principales

1. **Grafo de Conocimiento**: Lienzo interactivo bidimensional que mapea las relaciones lógicas entre conceptos, teoremas y axiomas.
2. **Validación Estricta con Zod**: Contenido escrito en MDX (Markdown + React) con metadatos validados en tiempo de compilación.
3. **Lectura Marginal (Marginalia)**: Panel lateral desplegable para consultar referencias y conceptos sin perder el contexto de lectura.
4. **Diagramas Reactivos con JSXGraph**: Simulaciones 2D interactivas integradas en el contenido y sincronizadas con variables numéricas.
5. **Editor MDX Sin Pérdidas**: Editor híbrido (Monaco + panel visual) que aplica modificaciones mediante rangos de offsets para preservar el formato original.

---

## Documentación Técnica

La documentación completa del proyecto se encuentra en la carpeta [/docs](docs/README.md):

- **[docs/architecture/fsd-design.md](docs/architecture/fsd-design.md)**: Estructura FSD en `src/`, capas, rutas en Wouter y Zustand stores.
- **[docs/architecture/editor-engine.md](docs/architecture/editor-engine.md)**: Motor del editor MDX sin pérdidas, Monaco y reglas de seguridad estática.
- **[docs/architecture/diagram-engine.md](docs/architecture/diagram-engine.md)**: Integración de JSXGraph con React, capas KaTeX y reactividad con `MathStore`.
- **[docs/architecture/knowledge-graph.md](docs/architecture/knowledge-graph.md)**: Grafo de conocimiento (DAG), ordenación topológica y prevención de ciclos lógicos.
- **[docs/content/mdx-authoring-guide.md](docs/content/mdx-authoring-guide.md)**: Guía práctica para redactar o editar artículos MDX y uso de `<ConceptLink>`.
- **[docs/quality-and-ci/validation-pipelines.md](docs/quality-and-ci/validation-pipelines.md)**: Scripts de validación en `scripts/` y secuencia del gate de release.
- **[docs/testing/testing-strategy.md](docs/testing/testing-strategy.md)**: Pruebas unitarias con Vitest, E2E con Puppeteer y auditorías de integridad.

---

## Stack Tecnológico

- **Framework**: React 19 + TypeScript
- **Arquitectura**: Feature-Sliced Design (FSD)
- **Bundler**: Vite + Rollup
- **Routing**: Wouter (dispatchers de 1, 2 y 3 segmentos con i18n)
- **Contenido**: MDX (`@mdx-js/rollup`) + Remark Math + KaTeX
- **Validación**: Zod
- **Visualización**: `react-force-graph-2d` + JSXGraph + Monaco Editor
- **Estilos**: Tailwind CSS (sistema de diseño "Arts and Crafts")

---

## Requisitos Previos e Instalación

- **Node.js** (v20+) y **npm**

1. Clonar e instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en el navegador.

3. Compilar para producción:
   ```bash
   npm run build
   ```

---

## Validaciones y Comandos

- **`npm run lint`**: Validación de estilo con ESLint.
- **`npm run typecheck`**: Verificación estricta de tipos TypeScript (`tsc -b`).
- **`npm run test`**: Ejecutar suite de pruebas con Vitest.
- **`npm run depcruise`**: Verificar fronteras arquitectónicas FSD.
- **`npm run validate-references`**: Valida que los enlaces `<ConceptLink>` apunten a artículos existentes.
- **`npm run validate-graph`**: Comprueba que el grafo de conocimiento no contenga ciclos lógicos.
- **`npm run editor:release-check`**: Gate completo de lanzamiento del editor (tests + e2e + cobertura + roundtrip).
- **`npm run full-check`**: Ejecuta la suite completa de calidad del repositorio.

---

## Cómo Añadir Contenido

El contenido reside en la carpeta `content/mdx/` distribuido por categorías (`theorems`, `definitions`, `examples`, `exercises`, `usecases`, `demonstrations`, `mathematicians`, `axioms`, `axiomatic-systems`, `models`, `lessons`, `study-plans`).

Cada archivo `.mdx` debe exportar la constante `metadata` validada por Zod:

```mdx
export const metadata = {
  id: "teorema-ejemplo",
  type: "teorema",
  title: "Teorema de Ejemplo",
  description: "Descripción breve que aparecerá en el panel lateral.",
  statement: "El enunciado formal con matemáticas en LaTeX: $a^2 = b^2 + c^2$.",
  requires: ["definicion-previa"],
};

<Capitular letra="C" />onsidérese el <ConceptLink targetId="definicion-asociada">concepto asociado</ConceptLink>...
```

Para navegar entre conceptos usa siempre `<ConceptLink targetId="slug-del-archivo">Texto</ConceptLink>`. No utilices etiquetas `<a>` ni `<Link>` convencionales. Consulta la [guía de redacción en docs](docs/content/mdx-authoring-guide.md) para más detalles.

---

## Arquitectura del Proyecto (FSD)

```
src/
├── app/            # Punto de entrada (AppRouter, proveedores, CSS global)
├── fixed-pages/    # Pantallas de la app (home, grafo, diccionario, editor, historia)
├── content-pages/  # Plantillas de visualización de artículos MDX
├── widgets/        # Componentes complejos de UI (SearchOmnibar, MarginaliaPanel)
├── features/       # Lógica de dominio y stores (GlossaryStore, GraphStore, MathStore)
├── entities/       # Acceso a datos, ContentStore y esquemas Zod
├── shared/         # Componentes base, UI atómica, wrappers de JSXGraph e i18n
└── data/           # Índices generados y estructuras del grafo
```
