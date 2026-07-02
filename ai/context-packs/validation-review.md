# Context pack: revisión de validación

## Cuándo usarlo

Antes de commit, relevo o aprobación de un diff ya existente.

## Herramienta recomendada

Codex u OpenCode `validator`; VS Code para aprobación humana.

## Archivos que debe leer

- `AGENTS.md`, `ai/current-state.md`, el diff y el objetivo relacionado.
- `ai/indexes/command-map.json` y skills solo para zonas tocadas.
- Fuentes de cualquier artefacto generado presente en el diff.

## Archivos que puede modificar

Ninguno en modo revisión; correcciones solo con autorización explícita.

## Archivos prohibidos

Todo cambio no autorizado, generados manualmente y trabajo ajeno.

## Comandos mínimos de validación

```bash
npm run ai:review
git diff --check
```

Después se ejecutan los comandos que `ai:review` recomiende; para producto completo, `npm run full-check`.

## Criterios de aceptación

- El diff coincide con el alcance y no incluye rutas accidentales.
- Cada comando se informa con resultado; lo no ejecutado queda explícito.
- Los hallazgos incluyen severidad, evidencia, impacto y corrección.

## Riesgos típicos

Confundir warning con fallo, corregir durante una revisión, ocultar validaciones omitidas y aprobar generados huérfanos.

## Prompt corto recomendado

> Declara alcance del diff, archivos permitidos/prohibidos, validaciones y resultado esperado. Revisa en solo lectura, ejecuta `ai:review` y las comprobaciones proporcionales. Prioriza defectos verificables; entrega hallazgos por severidad, resultados y riesgos residuales.
