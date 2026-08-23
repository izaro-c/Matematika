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
| **Arquitectura** | [docs/architecture/fsd-design.md](file:///home/izaro/Proiektuak/Matematika_Drafts/docs/architecture/fsd-design.md) | Estructura FSD en `src/`, capas, rutas en Wouter, Zustand stores y tokens visuales. |
| | [docs/architecture/editor-engine.md](file:///home/izaro/Proiektuak/Matematika_Drafts/docs/architecture/editor-engine.md) | Cómo funciona por dentro el editor MDX, parsing AST por offsets, Monaco y reglas de seguridad. |
| | [docs/architecture/diagram-engine.md](file:///home/izaro/Proiektuak/Matematika_Drafts/docs/architecture/diagram-engine.md) | Integración de JSXGraph con React, capas KaTeX para fórmulas y reactividad con `MathStore`. |
| | [docs/architecture/knowledge-graph.md](file:///home/izaro/Proiektuak/Matematika_Drafts/docs/architecture/knowledge-graph.md) | Grafo lógico de conceptos (DAG), niveles de jerarquía, axiomas incompatibles y visualización 2D. |
| **Contenido** | [docs/content/mdx-authoring-guide.md](file:///home/izaro/Proiektuak/Matematika_Drafts/docs/content/mdx-authoring-guide.md) | Guía práctica para crear o editar MDX, metadatos Zod, enlaces `<ConceptLink>` y comandos de comprobación. |
| **Calidad y CI** | [docs/quality-and-ci/validation-pipelines.md](file:///home/izaro/Proiektuak/Matematika_Drafts/docs/quality-and-ci/validation-pipelines.md) | Explicación de los scripts en `scripts/`, comprobaciones de grafo, referencias y el gate de release. |
| **Testing** | [docs/testing/testing-strategy.md](file:///home/izaro/Proiektuak/Matematika_Drafts/docs/testing/testing-strategy.md) | Pruebas unitarias con Vitest, E2E con Puppeteer, pruebas de diagramas y auditorías roundtrip del corpus. |

---

## Stack de un vistazo

- **UI & Runtime**: React 19, TypeScript, Vite.
- **Rutas & Estado**: Wouter, Zustand (`MetadataStore`, `GraphStore`, `MathStore`, `GlossaryStore`, `ProgressStore`).
- **Estilos & Tipografía**: Tailwind CSS, sistema de diseño "Arts and Crafts", KaTeX.
- **Visualización & Edición**: JSXGraph, `react-force-graph-2d`, Monaco Editor (`@monaco-editor/react`).
- **Procesamiento MDX**: Unified, Remark, Zod.

---

## Comandos habituales

```bash
# Servidor de desarrollo (ejecuta comprobaciones de índice y referencias al arrancar)
npm run dev

# Pasar todas las validaciones de código, tipos, tests y depcruise
npm run full-check

# Release check completo del editor (tests + e2e + cobertura + roundtrip)
npm run editor:release-check

# Comprobar la integridad de los archivos MDX del corpus
npm run editor:roundtrip:check
```

Para normas de contribución y guías de desarrollo de agentes, consulta [AGENTS.md](file:///home/izaro/Proiektuak/Matematika_Drafts/AGENTS.md).