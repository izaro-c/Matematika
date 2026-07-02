# Context pack: revisión pedagógica

## Cuándo usarlo

Para evaluar claridad, rigor, motivación y progresión conceptual sin escribir cambios.

## Herramienta recomendada

Gemini.

## Archivos que debe leer

- `AGENTS.md`, `ai/current-state.md` y `ai/goals/pedagogy.md`.
- Skill `project-philosophy` y las páginas/dependencias estrictamente necesarias.
- `ai/indexes/content-map.json` o `graph-map.json` solo para localizar contexto.

## Archivos que puede modificar

Ninguno durante la revisión.

## Archivos prohibidos

Todo el repositorio en modo escritura; también generados y `.auxiliary/` como fuentes.

## Comandos mínimos de validación

```bash
npm run validate-references
npm run validate-graph
```

Si no puede ejecutar comandos, debe marcarlos como no ejecutados.

## Criterios de aceptación

- Hallazgos priorizados con archivo, evidencia, impacto y corrección propuesta.
- Se distinguen intuición, prueba, error matemático y preferencia estilística.
- Se revisan autonomía, universalidad, casos límite y orden topológico.

## Riesgos típicos

Reescribir por gusto, suavizar el rigor, tratar una visualización como prueba y afirmar sin evidencia.

## Prompt corto recomendado

> Declara objetivo, alcance de lectura, prohibición de escritura, validaciones posibles y resultado esperado. Revisa `[páginas]` con `project-philosophy`. Devuelve solo hallazgos priorizados con evidencia, impacto y corrección; separa errores matemáticos, pedagógicos y de estilo.
