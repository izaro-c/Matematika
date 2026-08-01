# Domain: `progress`

**Qué es:** plan de estudio, checkpoints, botones de lectura, minimapa.

**Qué no es:** store canónico (usa `@/shared/stores/UserProgressStore`).

## Layout

| Ruta | Rol |
|---|---|
| `ui/` | StudyPlan*, ReadingButton, TaxonomyGraph, StudyTask |
| `context/` | contexto React del plan si existe |
| `constants.ts` | geometría minimapa / highlight ms |

## Stores

- `@/shared/stores/UserProgressStore`
- `@/shared/stores/NavigationStore`
- `@/shared/stores/DynamicVarStore`
