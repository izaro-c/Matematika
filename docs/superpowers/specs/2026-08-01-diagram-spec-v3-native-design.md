# DiagramSpec V3 nativo (runtime → editor)

**Fecha:** 2026-08-01  
**Estado:** hecho ✅ (2026-08-01) — Fases 1–3. API pública sin `projectDiagramSpecV3ToV2` / legacy views. Copia de trabajo interna: `toWorkingSceneV2` (solo scene/editor).  
**Decisión:** opción B — migración por fases (no big-bang).

## Problema

El corpus ya es V3 canónico (`editor:diagrams:v3-check`: 56/56). El runtime y el editor siguen hablando forma V2 (`points` / `elements` / `constraints`) vía `projectDiagramSpecV3ToV2` (~949 LOC + callers). Eso duplica el modelo y bloquea borrar la capa de compat.

## Objetivo

1. Runtime consume `DiagramSpecV3` / `DiagramSpec` sin proyectar a V2 en caliente.
2. Editor usa `VisualDiagramModel = DiagramSpecV3` (mutaciones sobre `objects` / `relations`).
3. `projectDiagramSpecV3ToV2` desaparece. Queda solo migración **histórica** `V2→V3` (+ parse V2 deprecated).

## No-objetivos

- Reescribir widgets de contenido MDX (ya emiten V3).
- Unificar `/editor` (MDX) y `/editor_v2` (sandbox) — no son duplicados.
- Optimizaciones de JSXGraph no pedidas.

## Hechos del código

- `DiagramSpec = DiagramSpecV3 & DiagramSpecLegacyViews` (`spec/v3.ts`).
- Ya existe `attachDiagramSpecLegacyViews`: getters no enumerables `points`/`elements`/`sliders` con proyección lazy.
- `DiagramRenderer` proyecta V3→V2 en `useMemo` antes de scene/lifecycle.
- `VisualDiagramModel = DiagramSpecV2` (`features/editor/diagrams/model/types.ts`).
- Generador: edita V2 → `migrateDiagramSpecV2ToV3` al emitir. Parser: V3 → proyecta a V2 para el workbench.

## Enfoque

Usar la ventana de **legacy views** como puente, no como destino. Cada fase reduce callers de `projectDiagramSpecV3ToV2` medibles con `rg`.

### Fase 1 — Runtime nativo (corte principal)

**Gate de salida:** `rg projectDiagramSpecV3ToV2 src/shared/diagrams/runtime` → 0 hits.  
Scene/viewport/lifecycle aceptan `DiagramSpec` (V3 + views). Preferir leer `objects` donde sea barato; donde el coste sea alto, consumir getters legacy **sin** materializar proyección eagerly en el Renderer.

Pasos:

1. `DiagramRenderer`: dejar de llamar `projectDiagramSpecV3ToV2`; normalizar con `migrateDiagramSpec` + `attachDiagramSpecLegacyViews` cuando `version===3`.
2. Tipar APIs de `scene.ts` / `viewport.ts` / `areaRegions.ts` / `curveGeometry.ts` / `diagramRuntimeUtils.ts` / `useBoardLifecycle` / Katex overlay como `DiagramSpec | DiagramSpecV2` → luego solo `DiagramSpec` cuando los tests lo permitan.
3. Tests: `tests/shared/diagrams/*` pasan con specs V3 sin proyección explícita en el test harness del renderer.
4. Commit por subpaso cuando el suite shared/diagrams+editor preview esté verde.

### Fase 2 — Modelo del editor = V3

**Gate de salida:** `VisualDiagramModel` es `DiagramSpecV3` (o `DiagramSpec` sin getters mutables). Mutaciones del workbench escriben `objects`/`relations`.

Pasos:

1. Cambiar el alias de tipo; adaptar `templateModels`, `diagramElements`, comandos de grafo, clipboard, steps.
2. Parser: entregar V3 al workbench (sin `projectDiagramSpecV3ToV2`).
3. Generador: validar/emitir V3 directo (`parseDiagramSpecV3`); eliminar round-trip V2.
4. Tests editor (v2 + model + source) verdes; actualizar fixtures.

### Fase 3 — Borrar proyección

**Gate de salida:** `projectDiagramSpecV3ToV2` eliminado; `attachDiagramSpecLegacyViews` eliminado o reducido a test-only.

Pasos:

1. Eliminar proyección y getters legacy.
2. Conservar `migrateDiagramSpecV2ToV3` + `parseDiagramSpecV2` marcados `@deprecated` para fuentes históricas / tooling.
3. Actualizar skill `diagrama` y ADR corto si hace falta.
4. `npm run editor:diagrams:v3-check` + `editor:lossless:check` + suite diagrams.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `scene.ts` / `useBoardLifecycle` son monolitos V2 | Fase 1 usa legacy views; no reescribir 3k LOC de golpe |
| Pérdida de fidelidad roundtrip editor | Mantener `editor:lossless:*` y roundtrip generator como gates |
| Tests anclados a forma V2 | Migrar fixtures a V3 en la misma tarea que el código |

## Criterio de éxito

- 0 usos de `projectDiagramSpecV3ToV2` en `src/`.
- Corpus V3 sigue 56/56.
- Workbench V2 + preview MDX sin regresión en tests existentes del editor/diagrams.

## Progreso

- **Fase 1 (parcial):** `DiagramRenderer` ya no llama `projectDiagramSpecV3ToV2`; usa `prepareSceneSpec` en `scene.ts`. `createScenePlan` / viewport aceptan V3. Gate: `rg projectDiagramSpecV3ToV2 src/shared/diagrams/runtime` → 0. Queda proyección dentro de `prepareSceneSpec` / `withMovedPoint` hasta Fases 2–3.
- Callers restantes en `src/`: `scene.ts`, `v3Compatibility.ts`, `features/editor/diagrams/source/parser.ts`, `model/modelRenaming.ts`.
