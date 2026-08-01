# DiagramSpec V3 nativo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar la proyección V3→V2 del runtime y del editor, dejando solo migración histórica V2→V3.

**Architecture:** Tres fases encadenadas. Fase 1 hace que el runtime acepte `DiagramSpec` (V3 + legacy views lazy). Fase 2 mueve `VisualDiagramModel` a V3. Fase 3 borra `projectDiagramSpecV3ToV2` y los getters legacy. Spec: `docs/superpowers/specs/2026-08-01-diagram-spec-v3-native-design.md`.

**Tech Stack:** TypeScript, Vitest, DiagramSpec V3 (`src/shared/diagrams/spec/`), editor workbench (`src/features/editor/`).

## Global Constraints

- No añadir dependencias.
- No reescribir widgets MDX de contenido.
- Gates: `npm run editor:diagrams:v3-check`, tests `tests/shared/diagrams` + `tests/features/editor/diagrams` + `tests/features/editor/v2` según la fase.
- Cada tarea termina con suite verde y commit propio si el usuario lo pide.
- Medir progreso: `rg -l 'projectDiagramSpecV3ToV2' src`.

## File map

| Zona | Rol |
| --- | --- |
| `src/shared/diagrams/runtime/DiagramRenderer.tsx` | Deja de proyectar eagerly |
| `src/shared/diagrams/spec/scene.ts` (+ viewport, areaRegions, curveGeometry) | Tipado/`DiagramSpec` |
| `src/shared/diagrams/runtime/useBoardLifecycle.ts` (+ utils, Katex, selection, viewport hooks) | Consumir `DiagramSpec` |
| `src/shared/diagrams/spec/v3Compatibility.ts` | Legacy views en F1; borrar proyección en F3 |
| `src/features/editor/diagrams/model/types.ts` | `VisualDiagramModel` → V3 en F2 |
| `src/features/editor/diagrams/source/{parser,generator}.ts` | Roundtrip V3 en F2 |
| `tests/shared/diagrams/**`, `tests/features/editor/**` | Gates por fase |

---

### Task 1: Baseline y harness de medición

**Files:**
- Create: `docs/superpowers/specs/2026-08-01-diagram-spec-v3-native-design.md` (ya escrito)
- Test: comandos de medición (no archivo nuevo obligatorio)

**Interfaces:**
- Consumes: nada
- Produces: lista actual de callers de `projectDiagramSpecV3ToV2`

- [ ] **Step 1:** Correr `rg -n 'projectDiagramSpecV3ToV2' src scripts tests` y guardar el conteo en el mensaje de commit / nota de sesión.
- [ ] **Step 2:** Correr `npm run editor:diagrams:v3-check` (esperado: 56/56).
- [ ] **Step 3:** Correr `npm test -- tests/shared/diagrams/DiagramRenderer.test.tsx` como smoke baseline.

---

### Task 2: DiagramRenderer sin proyección eager

**Files:**
- Modify: `src/shared/diagrams/runtime/DiagramRenderer.tsx`
- Modify: `src/shared/diagrams/spec/migrations.ts` / `v3Compatibility.ts` solo si hace falta exportar un `normalizeDiagramSpecForRuntime(spec)` mínimo
- Test: `tests/shared/diagrams/DiagramRenderer.test.tsx`

**Interfaces:**
- Consumes: `migrateDiagramSpec`, `attachDiagramSpecLegacyViews`, `DiagramSpec`
- Produces: `DiagramRenderer` interno trabaja sobre `DiagramSpec` (V3 con getters o V2 legacy)

- [ ] **Step 1:** Escribir/ajustar test que monte un `DiagramSpecV3` puro (sin campos `points` enumerables) y espere render sin throw.
- [ ] **Step 2:** Correr el test; debe fallar si aún se depende de proyección eager incorrecta, o pasar tras el cambio — TDD según estado actual.
- [ ] **Step 3:** En `DiagramRenderer`, sustituir el `useMemo` que llama `projectDiagramSpecV3ToV2` por: si `version===3` → `attachDiagramSpecLegacyViews(migrate…)` / spec ya V3; si V2 → camino actual `materializeSameSideConstraints`.
- [ ] **Step 4:** `npm test -- tests/shared/diagrams/DiagramRenderer.test.tsx` verde.
- [ ] **Step 5:** Commit: `fix(diagrams): render V3 via legacy views without eager project`.

---

### Task 3: Tipar scene + viewport contra DiagramSpec

**Files:**
- Modify: `src/shared/diagrams/spec/scene.ts`
- Modify: `src/shared/diagrams/spec/viewport.ts`
- Modify: `src/shared/diagrams/spec/areaRegions.ts`
- Modify: `src/shared/diagrams/spec/curveGeometry.ts`
- Test: `tests/shared/diagrams/*.test.ts*` (los que toquen scene/viewport)

**Interfaces:**
- Consumes: `DiagramSpec` / union temporal `DiagramSpec | DiagramSpecV2`
- Produces: `createScenePlan`, `withMovedPoint`, etc. aceptan V3+views

- [ ] **Step 1:** Cambiar firmas públicas de `createScenePlan` / `resolvePointCoordinates` / `withMovedPoint` a aceptar `DiagramSpec` (mantener compat V2 si `version===2`).
- [ ] **Step 2:** Donde `withMovedPoint` proyecta V3→V2, operar sobre views o devolver V3 actualizado (preferible: mutar/reconstruir objects y `attachDiagramSpecLegacyViews`).
- [ ] **Step 3:** Suite `tests/shared/diagrams` verde (excluir `*.full.test.tsx` si es demasiado lento; correr full al final de fase).
- [ ] **Step 4:** Commit: `refactor(diagrams): scene/viewport accept DiagramSpec`.

---

### Task 4: Runtime hooks (lifecycle, selection, katex, utils)

**Files:**
- Modify: `src/shared/diagrams/runtime/useBoardLifecycle.ts`
- Modify: `src/shared/diagrams/runtime/useDiagramSelection.ts`
- Modify: `src/shared/diagrams/runtime/useDiagramViewport.ts`
- Modify: `src/shared/diagrams/runtime/diagramRuntimeUtils.ts`
- Modify: `src/shared/diagrams/runtime/DiagramKatexOverlay.tsx`
- Test: `tests/shared/diagrams/*`

**Interfaces:**
- Consumes: `DiagramSpec` desde Task 3
- Produces: hooks tipados sin importar `projectDiagramSpecV3ToV2`

- [ ] **Step 1:** Sustituir tipos `DiagramSpecV2` en props de hooks por `DiagramSpec` (o union).
- [ ] **Step 2:** Eliminar imports de `projectDiagramSpecV3ToV2` en `src/shared/diagrams/runtime/`.
- [ ] **Step 3:** Verificar gate: `rg 'projectDiagramSpecV3ToV2' src/shared/diagrams/runtime` → vacío.
- [ ] **Step 4:** `npm test -- tests/shared/diagrams` (rápido) verde.
- [ ] **Step 5:** Commit: `refactor(diagrams): runtime hooks speak DiagramSpec`.

---

### Task 5: Cierre Fase 1

**Files:**
- Test only / docs note

- [ ] **Step 1:** `npm run editor:diagrams:v3-check`.
- [ ] **Step 2:** `npm test -- tests/shared/diagrams tests/features/editor/diagrams/generator.test.ts tests/features/editor/v2` (smoke editor).
- [ ] **Step 3:** Anotar en el spec: Fase 1 ✅ + conteo restante de `projectDiagramSpecV3ToV2` (debe quedar solo en editor/source/model/compat).

---

### Task 6: VisualDiagramModel = DiagramSpecV3

**Files:**
- Modify: `src/features/editor/diagrams/model/types.ts`
- Modify: `src/features/editor/diagrams/model/templateModels.ts`
- Modify: `src/features/editor/diagrams/model/diagramElements.ts` (+ graphCommands, clipboard, selectors según compile errors)
- Modify: `src/features/editor/diagrams/model/v3Projection.ts` (simplificar o eliminar helpers legacy)
- Test: `tests/features/editor/diagrams/model.test.ts` (o equivalente)

**Interfaces:**
- Consumes: `DiagramSpecV3`
- Produces: `VisualDiagramModel` alias de V3; factories crean `objects`/`relations`

- [ ] **Step 1:** Cambiar `export type VisualDiagramModel = DiagramSpecV3` (o `DiagramSpec` sin getters en el modelo editable).
- [ ] **Step 2:** Arreglar errores de `tsc -b` empezando por `templateModels` y `createTemplateModel`.
- [ ] **Step 3:** Tests de model verdes.
- [ ] **Step 4:** Commit: `refactor(editor): VisualDiagramModel is DiagramSpecV3`.

---

### Task 7: Parser / generator sin proyección

**Files:**
- Modify: `src/features/editor/diagrams/source/parser.ts`
- Modify: `src/features/editor/diagrams/source/generator.ts`
- Modify: `scripts/editor/parseDiagramSourceAST.ts` si proyecta
- Test: `tests/features/editor/diagrams/generator.test.ts`, roundtrip tests

**Interfaces:**
- Consumes: `parseDiagramSpecV3`, `migrateDiagramSpec`
- Produces: parser → V3 model; generator → TSX V3 sin `migrateDiagramSpecV2ToV3` desde modelo ya V3

- [ ] **Step 1:** Quitar `projectDiagramSpecV3ToV2` del parser.
- [ ] **Step 2:** Generador valida con schema V3 directamente.
- [ ] **Step 3:** `npm test -- tests/features/editor/diagrams/generator.test.ts` + roundtrip relevante.
- [ ] **Step 4:** Commit: `refactor(editor): diagram source roundtrip stays on V3`.

---

### Task 8: UI/workbench compile + tests editor

**Files:**
- Modify: callers en `src/features/editor/v2/**` y `diagrams/ui/**` que asuman `points`/`elements` mutables
- Test: `tests/features/editor/v2`, `tests/features/editor/diagrams`

- [ ] **Step 1:** `npx tsc -b` limpio.
- [ ] **Step 2:** Suite editor diagrams+v2 verde.
- [ ] **Step 3:** Commit: `fix(editor): workbench follows V3 model`.

---

### Task 9: Borrar projectDiagramSpecV3ToV2 y legacy views

**Files:**
- Modify: `src/shared/diagrams/spec/v3Compatibility.ts` (eliminar proyección + `attachDiagramSpecLegacyViews` si ya no hay lectores)
- Modify: exports en `spec/index.ts` / `public.ts`
- Modify: `.agents/skills/diagrama/**` referencias obsoletas
- Test: full diagrams gates

**Interfaces:**
- Consumes: solo `migrateDiagramSpecV2ToV3` para histórico
- Produces: API pública sin `projectDiagramSpecV3ToV2`

- [ ] **Step 1:** `rg projectDiagramSpecV3ToV2 src` → 0; borrar función y tests que la exijan.
- [ ] **Step 2:** Eliminar getters legacy si ningún caller tipa `DiagramSpecLegacyViews` en producción.
- [ ] **Step 3:** `npm run editor:diagrams:v3-check` + `npm run editor:lossless:check` (regenerar baseline si el check lo exige y el diff es solo ruido de timestamps — si no, investigar).
- [ ] **Step 4:** Commit: `chore(diagrams): remove V3→V2 projection layer`.

---

### Task 10: Verificación final

- [ ] **Step 1:** `npm run editor:diagrams:v3-check`
- [ ] **Step 2:** `npm test -- tests/shared/diagrams tests/features/editor/diagrams tests/features/editor/v2`
- [ ] **Step 3:** Actualizar el spec a **Estado: hecho** con fecha de cierre.

---

## Execution handoff

Plan listo. Opciones:

1. **Subagent-driven** (recomendado): `superpowers:subagent-driven-development` — tarea a tarea con revisión.
2. **Inline:** `superpowers:executing-plans` en esta sesión.

Empezar solo tras aprobación explícita del spec + de este plan.
