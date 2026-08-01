# Workbench de diagramas como estándar (eliminar `editor/v2`)

**Fecha:** 2026-08-01  
**Estado:** aprobado (diseño)  
**Decisión:** opción B — mover UI de `src/features/editor/v2/` a `src/features/editor/diagrams/ui/` y eliminar el prefijo `V2`.

## Problema

Existen dos capas de naming para un solo workbench:

- `editor/v2/` — UI actual (`DiagramWorkbench`, `V2*`)
- `editor/diagrams/` — modelo, hooks, source, host y editores compartidos

El escape hatch v1 (`?diagram=v1`, `DiagramWorkbench` legacy) ya no es el estándar. El prefijo `v2` solo añade fricción de imports y confunde con `DiagramSpec` v2/v3 en `shared/diagrams`.

## Objetivo

1. Un solo árbol de UI del workbench bajo `src/features/editor/diagrams/ui/`.
2. Nombres sin prefijo de versión: `DiagramWorkbench` es el shell canónico.
3. Borrar `src/features/editor/v2/` y `tests/features/editor/v2/`.
4. Actualizar skill `diagrama` y `docs/editor/README.md` para apuntar al layout nuevo.

## No-objetivos

- Unificar `/editor` (MDX) y `/editor_v2` (sandbox de diagramas).
- Renombrar o migrar `DiagramSpec` v2↔v3 / `projectDiagramSpecV3ToV2`.
- Caza agresiva de editores huérfanos: solo borrar lo que typecheck/tests demuestren muerto tras el move.
- Cambiar comportamiento del overlay fullscreen del host (ya `fixed inset-0 z-50`).

## Árbol objetivo

```
src/features/editor/diagrams/
  model|hooks|source|state|diagnostics|persistence|references/   # sin cambio estructural
  ui/
    DiagramWorkbench.tsx          # ← DiagramWorkbench
    DiagramWorkbenchHost.tsx      # overlay; entra a DiagramWorkbench
    workbenchSelection.ts         # ← editorV2Selection
    canvas/                       # BoardHost, CanvasStage, Chrome, frames, fitScale…
    inspector/                    # paneles + sections (sin prefijo V2)
    scene/                        # SceneTree, GroupsAndLayers, batch toolbar existente
    relations/                    # sin cambio de contrato
    primitives/                   # sin cambio
    modals/                       # Code, Presets, Settings, MdxLink, Guided, Confirm, Divergence
    # Diagram*Editor / Field ya compartidos: quedan en ui/ o bajo inspector/ si el import queda local
```

### Renombres de símbolos (mínimo útil)

| Antes | Después |
| --- | --- |
| `DiagramWorkbench` | `DiagramWorkbench` |
| `WorkbenchHeader` | `WorkbenchHeader` |
| `WorkbenchToolbar` | `WorkbenchToolbar` |
| `WorkbenchSceneTree` | `WorkbenchSceneTree` |
| `WorkbenchElementInspector` | `WorkbenchElementInspector` |
| `WorkbenchStepsEditor` | `WorkbenchStepsEditor` |
| `WorkbenchDiagnosticsPanel` | `WorkbenchDiagnosticsPanel` |
| `V2*Modal` / canvas `V2*` | mismo rol sin prefijo `V2` (`CodeModal`, `BoardHost`, …) |
| `pages/DiagramEditorPage` | `pages/DiagramEditorPage` |
| `tests/features/editor/v2/` | `tests/features/editor/diagrams/workbench/` |

Alias de reexport temporales: **no**. Move + fix imports en el mismo cambio.

### Rutas URL

| Ruta | Acción |
| --- | --- |
| `/editor_v2` | Se mantiene; renderiza `DiagramEditorPage` |
| `/editor-v2` | Redirect a `/editor_v2` (ya existe) |

## Entradas / callers a actualizar

- `DiagramWorkbenchHost` → `DiagramWorkbench`
- `EditorPage` (vía host)
- `AppRouter` + `DiagramEditorPage`
- Tests bajo `tests/features/editor/diagrams/` y el árbol `workbench/`
- `.agents/skills/diagrama/SKILL.md` y `references/visual-authoring.md`
- `docs/editor/README.md` (fila de diagramas de autoría)

## Orden de implementación

1. `git mv` de `v2/ui/*` hacia los subdirectorios de `diagrams/ui/` (canvas, inspector, scene, modals, raíz).
2. Renombrar archivos y símbolos; actualizar imports relativos y `@/…`.
3. Mover tests `tests/features/editor/v2` → `tests/features/editor/diagrams/workbench`.
4. Eliminar carpeta `src/features/editor/v2/`.
5. Actualizar docs/skill.
6. Verificar: host + workbench tests, `npm run typecheck`, `git diff --check`.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Colisión de nombres con restos v1 borrados (`WorkbenchHeader`, etc.) | Los docks v1 ya están `D` en el working tree; confirmar que no queden paths fantasma antes del rename |
| Imports rotos en tests con mocks de `DiagramWorkbench` | Actualizar mocks al path/`DiagramWorkbench` nuevo en el mismo PR |
| Confusión con DiagramSpec “v2” | No tocar `shared/diagrams`; el README aclara que “workbench” ≠ versión de spec |

## Criterio de éxito

- `rg "features/editor/v2|DiagramWorkbench|from ['\"].*/v2/" src tests` → 0 (salvo menciones históricas en ADR/docs datados si se dejan).
- `src/features/editor/v2/` no existe.
- Overlay del host sigue fullscreen; sandbox `/editor_v2` sigue abriendo el workbench.
- Suites workbench + `DiagramWorkbenchHost` + typecheck verdes.
