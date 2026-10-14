# Matematika — Documentación Técnica

Esta es la documentación técnica de **Matematika**, una enciclopedia matemática interactiva construida con React, TypeScript y MDX. 

El proyecto combina tres ideas centrales:
1. **Contenido interconectado**: Los artículos no están aislados; forman un grafo de conocimiento navegable.
2. **Diagramas reactivos**: Simulaciones geométricas y analíticas 2D integradas mediante JSXGraph.
3. **Editor visual sin pérdidas**: Un editor híbrido (código + WYSIWYG) que permite modificar documentos MDX sin alterar el formato ni destruir bloques no editados.

---

## Índice de la documentación

| Sección | Documento | Qué explica |
|---|---|---|
| **Arquitectura** | [docs/architecture/map.md](architecture/map.md) | **Atlas y mapa canónico**: capas de `src/`, layout de `content/`, límites duros y atajos de comandos. |
| | [docs/architecture/fsd-design.md](architecture/fsd-design.md) | Estructura modular por capas en `src/`, rutas en Wouter, Zustand stores y tokens visuales. |
| | [docs/architecture/diagram-engine.md](architecture/diagram-engine.md) | Motor de diagramas reactivos, DiagramSpec v3, adaptadores JSXGraph, capas KaTeX y reactividad con `MathStore`. |
| | [docs/architecture/editor-engine.md](architecture/editor-engine.md) | Cómo funciona por dentro el editor MDX, parsing AST por offsets, Monaco y reglas de seguridad. |
| | [docs/architecture/knowledge-graph.md](architecture/knowledge-graph.md) | Grafo lógico de conceptos (DAG), niveles de jerarquía, axiomas incompatibles y visualización 2D. |
| | [docs/architecture/seo-and-metadata.md](architecture/seo-and-metadata.md) | Infraestructura de SEO, metadatos dinámicos, Open Graph, JSON-LD, sitemap y robots.txt. |
| **Contenido** | [docs/content/mdx-authoring-guide.md](content/mdx-authoring-guide.md) | Guía práctica para crear o editar MDX, metadatos Zod, enlaces `<ConceptLink>` y comandos de comprobación. |
| **Calidad y CI** | [docs/quality-and-ci/validation-pipelines.md](quality-and-ci/validation-pipelines.md) | Catálogo de scripts en `scripts/`, comprobaciones de grafo, referencias y el release gate. |
| **Testing** | [docs/testing/testing-strategy.md](testing/testing-strategy.md) | Pruebas unitarias con Vitest, E2E con Puppeteer, pruebas visuales y auditorías roundtrip del corpus. |

---

## Stack de un vistazo

- **UI & Runtime**: React 19, TypeScript, Vite.
- **Rutas & Estado**: Wouter, Zustand (`MetadataStore`, `GraphStore`, `MathStore`, `GlossaryStore`, `NavigationStore`, `UserProgressStore`).
- **Estilos & Tipografía**: Tailwind CSS, sistema de diseño "Arts and Crafts", KaTeX.
- **Visualización & Edición**: JSXGraph, `react-force-graph-2d`, Monaco Editor (`@monaco-editor/react`).
- **Procesamiento MDX**: Unified, Remark, Zod.

---

## Comandos habituales

```bash
# Verificación rápida recomendada para agentes y desarrollo rutinario
npm run typecheck
npm run test:fast

# Servidor de desarrollo (ejecuta comprobaciones de índice y referencias al arrancar)
npm run dev

# Comprobar la integridad de los archivos MDX del corpus
npm run editor:roundtrip:check

# Pasar todas las validaciones de código, tipos, tests y depcruise
npm run full-check

# Release check completo del editor (tests + e2e + cobertura + roundtrip)
npm run editor:release-check
```

Las skills de agentes (contenido, diagramas, grafo de código) están en [`.agents/skills/`](../.agents/skills/).
Las directivas compactas de navegación residen en [`AGENTS.md`](../AGENTS.md).