# Domain: `progress`

**Qué es:** plan de estudio, checkpoints, botones de lectura, minimapa.

**Qué no es:** store canónico (usa `@/lib/stores/UserProgressStore`).

## Layout

| Ruta | Rol |
|---|---|
| `ui/` | StudyPlan*, ReadingButton, TaxonomyGraph, StudyTask |
| `context/` | contexto React del plan si existe |
| `constants.ts` | geometría minimapa / highlight ms |

## Stores

- `@/lib/stores/UserProgressStore`
- `@/lib/stores/NavigationStore`
- `@/lib/stores/DynamicVarStore`
