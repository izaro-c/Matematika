# Context pack: navegación y grafo

## Cuándo usarlo

Para cambiar navegación semántica, Marginalia, construcción del grafo o dependencias lógicas.

## Herramienta recomendada

Codex.

## Archivos que debe leer

- `AGENTS.md`, `ai/current-state.md` y el objetivo `ui-product` o `code-quality`.
- `ai/indexes/graph-map.json`, `content-map.json` y componentes implicados.
- Schemas, fuentes del grafo, tests y páginas concretas afectadas.

## Archivos que puede modificar

Código, tests o MDX expresamente declarados; para MDX se carga `page-creator`.

## Archivos prohibidos

JSON generado, IDs existentes, Lean sin `lean-formalizer` y rutas fuera del flujo.

## Comandos mínimos de validación

```bash
npm run typecheck
npm run validate-references
npm run validate-graph
npm run depcruise
```

## Criterios de aceptación

- Se distingue enlace de navegación de dependencia lógica.
- No hay referencias rotas, ciclos ni inversión topológica.
- Marginalia conserva contexto y los tests cubren el recorrido cambiado.

## Riesgos típicos

Editar generados, convertir toda mención en dependencia, romper IDs y mezclar rutas con semántica.

## Prompt corto recomendado

> Declara objetivo, alcance, archivos permitidos/prohibidos, validaciones y resultado esperado. Cambia `[flujo o relación]` en `[rutas]`, distinguiendo navegación y dependencia lógica. No edites índices generados ni IDs. Valida referencias, DAG, tipos y arquitectura.
