# Context pack: refactor de código

## Cuándo usarlo

Para un refactor pequeño con comportamiento estable, límites claros y tests existentes o añadibles.

## Herramienta recomendada

Codex.

## Archivos que debe leer

- `AGENTS.md`, `ai/current-state.md` y `ai/goals/code-quality.md`.
- `ai/indexes/project-map.json`, `component-map.json` y la sección relevante de `debt-map.json`.
- Código, tests y configuración arquitectónica directamente afectados.

## Archivos que puede modificar

Rutas `src/` nombradas en el alcance y sus tests relacionados.

## Archivos prohibidos

MDX, `lean/`, generados, lockfiles, gobierno IA y cualquier ruta no declarada.

## Comandos mínimos de validación

```bash
npm run typecheck
npm run test -- <test-relacionado>
npm run depcruise
npm run ai:review
```

## Criterios de aceptación

- El comportamiento observable se conserva o el cambio está especificado.
- El diff reduce una responsabilidad concreta sin violar FSD.
- Tests y tipos cubren la frontera modificada; la deuda restante queda declarada.

## Riesgos típicos

Abstracción prematura, ampliación oportunista, imports invertidos y tests que fijan implementación.

## Prompt corto recomendado

> Declara objetivo, alcance, archivos permitidos/prohibidos, validaciones y resultado esperado. Lee este pack y refactoriza solo `[rutas]` para `[responsabilidad]`, preservando `[comportamiento]`. Ejecuta las validaciones mínimas y entrega diff, resultados y deuda sin ampliar el alcance.
