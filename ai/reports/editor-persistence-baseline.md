# Baseline de persistencia del editor — Fase 4

## Base

- Rama: `fix/editor-safe-persistence`
- Commit: `21d1bcf`
- Árbol inicial: limpio

## Validaciones previas

| Comando | Resultado | Observación |
| --- | --- | --- |
| `npm run test:editor` | aprobado | 56 pruebas |
| `npm run editor:roundtrip:check` | aprobado | 120 MDX exactos |
| `npm run typecheck` | aprobado | sin errores |
| `npm run lint -- src/features/editor tests/features/editor` | aprobado | sin errores |
| `npm run depcruise` | aprobado con deuda | 170 warnings preexistentes |
| `npm run ai:review` | aprobado | árbol limpio |
| `git diff --check` | aprobado | sin cambios |

## Persistencia localizada

- Backend de desarrollo: plugin `editorAPI` en `vite.config.ts`.
- Lectura y aplicación productiva MDX: `src/features/editor/core/useEditorCore.ts`.
- Lecturas auxiliares: `src/features/editor/ui/EditorPage.tsx`.
- Hooks legacy sin consumidores: `src/features/editor/hooks/useEditorState.ts` y `useEditorActions.ts`.
- Persistencia de diagramas fuera de esta fase: `DiagramWorkbench.tsx`, expresamente prohibido por el alcance.

## Riesgos confirmados

- `fetch` y conocimiento HTTP dentro del hook React y componentes.
- Estado repartido entre `saving`, `dirtyState` y mensajes libres.
- Ninguna revisión local, versión remota, cancelación ni descarte de respuestas antiguas.
- `GET /api/content` devuelve texto sin hash ni versión.
- `POST /api/content` acepta `{ path, content }`, escribe directamente y responde `{ success: true }`.
- Un `200` no demuestra path, revisión ni source confirmado.
- `/api/draft` guarda strings en memoria y dispara HMR; reiniciar el backend los pierde.
- No existen backups, restauración, temporales, rename atómico ni `409`.
- La protección de ruta es léxica y no comprueba escape mediante symlink.
- No hay límite de body ni validación estructurada de requests/responses.
