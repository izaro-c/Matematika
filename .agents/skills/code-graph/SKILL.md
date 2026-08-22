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

- Archivos **Lean** (`.lean`), **MDX** de contenido (`src/database/content/`) y assets estáticos: usar `Grep`/`Read`.
- Texto literal, comentarios o cadenas: `Grep`.
- Validación de producto: `npm run full-check` (independiente del grafo MCP).

## Flujo recomendado al cargar la skill

1. Usar herramientas MCP (`search_graph`, `trace_path`, `get_architecture`, `get_code_snippet`).
2. Si el grafo requiere reindexar o tras cambios estructurales grandes → llamar MCP `index_repository`:
   - `repo_path`: raíz del workspace
   - `mode`: `full` (refactors grandes o primera sesión); `moderate` (cambios acotados); `fast` (solo verificación rápida)
3. Usar el grafo para la tarea; no repetir `Grep`/`Glob` para lo que el grafo ya resuelve.

## Prioridad de herramientas

1. `search_graph` → localizar símbolo
2. `trace_path` / `get_architecture` → relaciones y contexto
3. `get_code_snippet` → leer código
4. `Grep` / `Read` → solo lo no indexado o búsqueda literal

## Proyecto MCP

El nombre del proyecto lo devuelve `index_repository` (derivado de la ruta del repo). Guardarlo en el sello; no hardcodear rutas absolutas de máquina en documentación.

## Límites conocidos

- Cobertura principal: **TypeScript/JavaScript**, CSS, HTML, YAML.
- No sustituye `depcruise`, `validate-graph` ni el grafo Lean-MDX del proyecto.
- `index_status` no existe como herramienta MCP; el estado viene de `index_repository` y `get_architecture`.

## Referencia detallada

Patrones de consulta y ejemplos: [references/tool-selection.md](references/tool-selection.md).
