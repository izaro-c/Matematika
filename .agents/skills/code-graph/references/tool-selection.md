# Selección de herramientas del grafo

## search_graph

```text
# Por nombre natural
query: "diagram renderer"

# Por patrón
name_pattern: "DiagramRenderer"
label: "Function"
file_pattern: "src/shared/diagrams/**"

# Semántico (modo full/moderate)
semantic_query: ["persist", "editor", "save"]
```

Paginar con `offset` cuando `has_more: true`.

## trace_path

```text
function_name: "useEditorCore"
direction: "inbound" | "outbound" | "both"
depth: 3
mode: "calls" | "data_flow" | "cross_service"
```

Usar `inbound` antes de refactors destructivos.

## get_architecture

```text
aspects: ["overview"]           # compacto
aspects: ["clusters", "hotspots"] # módulos y acoplamiento
aspects: ["boundaries", "layers"] # violaciones FSD
path: "src/features/editor"      # acotar a directorio
```

## query_graph (ejemplos)

```cypher
MATCH (f:Function)-[:CALLS]->(g:Function)
WHERE f.file_path CONTAINS 'editor'
RETURN f.name, g.name LIMIT 50
```

```cypher
MATCH (r:Route) RETURN r.name, r.qualified_name LIMIT 30
```

## Flujo típico: impacto de refactor

1. `code-graph:check` → reindexar si hace falta
2. `search_graph` → `qualified_name` del símbolo
3. `trace_path` (`inbound`, depth 4)
4. `get_architecture` (`boundaries`) si toca capas FSD
5. `get_code_snippet` en los 3–5 nodos más conectados
