# Estado actual

**Actualizado:** 2026-08-01

**Fase:** Plan de mejora arquitectónica aplicado (Fases 0–4 parcial).

**Siguiente:** más migraciones `code-preview` → `visual-exact` con aceptación matemática; descomponer `scene.ts` solo con evidencia de cohesión.

## Vivo

- Estabilidad editor: [`docs/editor/stability.md`](../docs/editor/stability.md)
- Gates: `editor:*`, `ai:index`, `ai:debt`, `full-check`
- Diagramas: regenerar con `npm run editor:diagrams:check` (DemoExistenciaBisectriz ya es `visual-exact`)
- MDX corpus: 120/120 roundtrip exacto (baselines en `reports/`)
- UI `features/editor/v2/` colapsada en `diagrams/ui/`
- Stores canónicos solo en `src/shared/stores/` (shims de features eliminados)
- `entities/content/searchApi` sin Zustand (dictionary desde `glossaryDictionary`)
- Diff review reconectado (`EditorDiffController` + aprobación en `useEditorCore`)
- Editor model: `workingScene` / `materializeEditorModel` / `applySceneMutation` (sin `editorV2` en UI)
- Runtime: `createElement` extraído a `createBoardElement.ts` + `boardElementHelpers.ts`
- Excepción muerta `MaterialPracticoSection` eliminada de `.dependency-cruiser.js`

## Bloqueos / deuda explícita

- Modelo dual escena-de-trabajo ↔ V3 sigue en `shared`/`model` (aceptable; UI ya no lo ve)
- Widgets 3D (`Incidence5–8`, `Plano`) fuera de DiagramSpec 2D
- Placeholders restantes (`DemoExistenciaPerpendicular`, `DemoAngulosAlternosInternos`, …) y demos JSXGraph legacy
- Sin pasada humana con lector de pantalla
- God-file residual: `scene.ts` (~1315)
