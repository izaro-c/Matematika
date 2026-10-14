---
name: code-graph
description: Consulta y mantiene el grafo de código de Matematika vía codebase-memory-mcp (search_graph, trace_path, get_architecture, get_code_snippet). Usar de forma proactiva al explorar arquitectura FSD, buscar definiciones o callers, analizar impacto de refactors, trazar flujos de datos o rutas HTTP; también al iniciar tareas amplias en src/, scripts/ o tests/, y para reindexar cuando el sello esté obsoleto.
---

# Grafo de código (codebase-memory-mcp)

Grafo estructural del repositorio TypeScript. **Cargar esta skill antes de explorar código** cuando grep o lectura lineal serían lentos o incompletos.

## Cuándo usar el grafo (sin esperar petición explícita)

| Situación | Herramienta |
|---|---|
| Buscar definición de símbolo | `search_graph` (`query` o `name_pattern`) |
| Callers, callees, impacto | `trace_path` (`mode: calls`) |
| Flujo de datos / argumentos | `trace_path` (`mode: data_flow`) |
| Arquitectura, hotspots, capas FSD | `get_architecture` |
| Leer implementación | `get_code_snippet` (tras obtener `qualified_name`) |
| Búsqueda textual enriquecida | `search_code` |
| Consulta Cypher ad hoc | `query_graph` |

## Cuándo NO usar el grafo

- Archivos **MDX** de contenido (`content/mdx/`) y assets estáticos: usar `Grep`/`Read`.
- Texto literal, comentarios o cadenas no indexadas: `Grep`.
- Validación de producto: suites de tests o verificación de tipos (independiente del grafo MCP).

> [!IMPORTANT]
> **Prohibición estricta de `Grep` para símbolos TypeScript**: Está terminantemente prohibido utilizar `Grep`, `ripgrep` o escaneo exploratorio recursivo en `src/` para buscar definiciones de tipos, interfaces, clases o funciones. Para cualquier símbolo TypeScript debe usarse el MCP `codebase-memory` con `project: "home-izaro-Proiektuak-Matematika"`.

## Flujo recomendado al cargar la skill

1. Usar herramientas MCP (`search_graph`, `trace_path`, `get_architecture`, `get_code_snippet`).
2. Si el grafo requiere reindexar o tras cambios estructurales grandes → llamar MCP `index_repository`:
   - `repo_path`: raíz del workspace (`/home/izaro/Proiektuak/Matematika`)
   - `mode`: `full` (refactors grandes o primera sesión); `moderate` (cambios acotados); `fast` (solo verificación rápida)
3. Usar el grafo para la tarea; no repetir `Grep`/`Glob` para lo que el grafo ya resuelve.

## Prioridad de herramientas (Ahorro de Tokens)

Para minimizar el consumo de tokens y evitar lecturas masivas de contexto en el agente:
1. `search_graph` → localiza la definición y firma del símbolo TS devolviendo su `qualified_name` (sin volcar archivos).
2. `trace_path` / `get_architecture` → traza relaciones, callers, callees y contexto arquitectónico sin inspección manual.
3. `get_code_snippet` → lectura quirúrgica de la implementación del símbolo especificado por `qualified_name`.
4. `view_file` con rangos de líneas acotados (`StartLine`/`EndLine`) → solo si se requiere contexto periférico no resuelto por snippet.
5. `Grep` → **prohibido para símbolos TS**; exclusivo para cadenas literales, comentarios o archivos de contenido MDX.

## Proyecto MCP

- **Identificador canónico del proyecto**: `project: "home-izaro-Proiektuak-Matematika"`
- Almacenado en `.codebase-memory/stamp.json`.
- Todas las herramientas del MCP `codebase-memory` que requieran o acepten el parámetro `project` deben usar `"home-izaro-Proiektuak-Matematika"`.
- Guardarlo en el sello (`stamp.json`); no hardcodear rutas absolutas de máquina en documentación.

## Límites conocidos

- Cobertura principal: **TypeScript/JavaScript**, CSS, HTML, YAML.
- No sustituye `depcruise`, `validate-graph` ni el grafo MDX del proyecto.
- `index_status` no existe como herramienta MCP; el estado viene de `index_repository` y `get_architecture`.

## Referencia detallada

Patrones de consulta y ejemplos: [references/tool-selection.md](references/tool-selection.md).
