# Context pack: autoría de contenido

## Cuándo usarlo

Para crear o modificar una página matemática MDX.

## Herramienta recomendada

OpenCode con el agente de contenido.

## Archivos que debe leer

- `AGENTS.md`, `ai/current-state.md` y `ai/goals/pedagogy.md`.
- Skill `page-creator`, schema, plantilla y páginas dependientes del tipo elegido.
- `ai/indexes/content-map.json` y, si hay dependencias, `graph-map.json`.

## Archivos que puede modificar

La página bajo `src/database/content/` y solo los artefactos asociados autorizados.

## Archivos prohibidos

IDs existentes, generados, código general, Lean o diagramas sin cargar su skill y ampliar el alcance.

## Comandos mínimos de validación

```bash
npm run typecheck
npm run validate-references
npm run validate-graph
npm run validate-lean
npm run bridge:audit
```

## Criterios de aceptación

- Metadata válida, ID kebab-case estable y dependencias topológicas.
- Motivación, precisión, casos límite y exposición impersonal.
- Enlaces semánticos y justificaciones explícitas; la interacción no actúa como prueba.

## Riesgos típicos

Inventar IDs o `leanId`, duplicar conceptos, depender de un currículo y justificar por apariencia.

## Prompt corto recomendado

> Declara objetivo, alcance, archivos permitidos/prohibidos, validaciones y resultado esperado. Carga `page-creator` y crea/modifica `[id y tipo]` usando schema, plantilla y dependencias reales. No inventes IDs ni toques Lean/diagramas sin autorización. Entrega archivos, validaciones y deuda.
