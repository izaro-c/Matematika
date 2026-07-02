# Context pack: tooling y automatización

## Cuándo usarlo

Para crear o cambiar automatizaciones repetibles, locales y verificables.

## Herramienta recomendada

Codex; ChatGPT para definir trade-offs de permisos o recuperación.

## Archivos que debe leer

- `AGENTS.md`, `ai/current-state.md` y `ai/goals/automation.md`.
- `ai/indexes/command-map.json`, `project-map.json` y tooling relacionado.
- Tests, documentación operativa y contratos de entrada/salida afectados.

## Archivos que puede modificar

Scripts, tests y documentación nombrados; `package.json` solo si el alcance lo autoriza.

## Archivos prohibidos

Producto, MDX, Lean, generados, despliegues, secretos y escrituras externas no autorizadas.

## Comandos mínimos de validación

```bash
npm run typecheck
npm run test -- <test-del-tool>
git diff --check
npm run ai:review
```

## Criterios de aceptación

- Disparador, entradas, salidas, permisos, coste y recuperación están definidos.
- El tool es determinista o documenta su variabilidad, es idempotente y falla con diagnóstico.
- Se prueba al menos un caso válido y uno fallido.

## Riesgos típicos

Permisos implícitos, efectos laterales, dependencia del entorno y automatización sin vía de recuperación.

## Prompt corto recomendado

> Declara objetivo, alcance, archivos permitidos/prohibidos, validaciones y resultado esperado. Implementa `[tool]` con entradas/salidas, permisos y recuperación explícitos. Limita efectos laterales, prueba éxito y fallo, y entrega uso, resultados y deuda.
