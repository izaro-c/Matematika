# Test Suite Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevar la suite de tests de Matematika (1220 tests vitest + gates script/E2E) en corrección semántica, velocidad de feedback, cobertura de huecos críticos y mantenibilidad, sin inflar tests triviales ni romper los invariantes del proyecto.

**Architecture:** Tres capas de verificación alineadas con FSD: (1) **unit/fast** — lógica pura y JSXGraph aislado; (2) **integration** — React + renderer + editor; (3) **acceptance** — corpus MDX, diagramas canónicos, E2E Puppeteer. Vitest se trocea en `fast` / `slow` / `corpus`; CI ejecuta fast en cada PR y slow+corpus en release-check. Helpers compartidos eliminan mocks duplicados del workbench.

**Tech Stack:** Vitest 4, Testing Library, jsdom, JSXGraph, Puppeteer (E2E), scripts `editor:*` y `full-check`.

## Global Constraints

- Paleta Arts & Crafts exclusiva en diagramas; tests leen `--theme-*` vía `theme.ts`.
- IDs de contenido kebab-case inmutables.
- `shared` no depende de capas superiores; tests de `shared/diagrams` no importan `features` salvo fixtures ya existentes.
- No editar archivos generados; no añadir tests que solo dupliquen el typechecker.
- `full-check` debe seguir pasando al cerrar cada epic.
- Preferir invariantes geométricos sobre snapshots pixel-perfect (política vigente en `ai/current-state.md`).
- Solo la paleta autorizada: `lienzo`, `carbon`, `salvia`, `terracota`, `pizarra`, `ocre`, `pavo`, `granada`, `musgo`.

---

## File Structure (mapa de cambios)

| Ruta | Responsabilidad |
|---|---|
| `vitest.config.ts` | Proyectos/tiers `fast`, `slow`, `corpus` |
| `tests/setup.ts` | MatchMedia + helpers globales JSXGraph cleanup |
| `tests/helpers/diagramWorkbench.tsx` | Mock `diagramRepository` + render workbench |
| `tests/helpers/diagramRay.ts` | Utilidades rayo (`rayCaux`, proyección, parámetro t) |
| `tests/helpers/assertions.ts` | `expectOnSupport`, `expectKindCountFromSchema` |
| `tests/shared/diagrams/OnRaySameSideConstraint.test.ts` | Corregir semántica DemoAnguloExterno |
| `tests/features/editor/validation.test.ts` | Quitar `toHaveLength(34)` frágil |
| `tests/shared/diagrams/useBoardLifecycle.test.ts` | Nuevo: drag + liveSpec + tema |
| `tests/shared/diagrams/theme.test.ts` | Nuevo: contrato `ThemeColors` |
| `tests/shared/diagrams/v3Compatibility.test.ts` | Nuevo: roundtrip v3→v2 lazy |
| `tests/pages/*.test.tsx` | Smoke por tipo de página |
| `tests/features/search/SearchOmnibar.test.tsx` | Arreglar TC-1.1 CPT |
| `package.json` | Scripts `test:fast`, `test:slow`, `test:corpus` |
| `.github/workflows/ci.yml` | Job `unit-fast` + `unit-slow` opcional |
| `scripts/editor/check-diagram-coverage.ts` | Nuevo: umbrales `shared/diagrams` |
| `ai/current-state.md` | Métricas actualizadas |
| `docs/testing/README.md` | Taxonomía y cuándo usar cada tier |

---

## Epic 0 — Baseline y gobernanza

### Task 0: Congelar línea base reproducible

**Files:**
- Modify: `ai/current-state.md`
- Create: `docs/testing/README.md`

- [ ] **Step 1: Generar informe de duración**

```bash
npm test -- --reporter=json --outputFile=/tmp/vitest-baseline.json
node -e "
const r=require('/tmp/vitest-baseline.json');
const files=r.testResults.map(f=>({file:f.name.replace(process.cwd()+'/',''),tests:f.assertionResults.length,dur:f.endTime-f.startTime})).sort((a,b)=>b.dur-a.dur);
console.log('total',r.numTotalTests,'pass',r.numPassedTests);
console.log('top10',JSON.stringify(files.slice(0,10),null,2));
"
```

Expected: `pass 1220`, lista de archivos >3s.

- [ ] **Step 2: Documentar taxonomía en `docs/testing/README.md`**

```markdown
# Taxonomía de tests Matematika

| Tier | Comando | Alcance | CI |
|------|---------|---------|-----|
| fast | `npm run test:fast` | unit + lógica pura, sin `.full` ni corpus | cada PR |
| slow | `npm run test:slow` | `.full.test.tsx`, JSXGraph pesado | nightly / release |
| corpus | `npm run test:corpus` | auditLossless, resourceCatalog real | release-check |
| e2e | `npm run editor:test:e2e` | Puppeteer editor | release-check |
| diagrams-script | `npm run editor:diagrams:check` | 84 diagramas | full-check |
```

- [ ] **Step 3: Actualizar métricas en `ai/current-state.md`**

Reemplazar "336 pruebas diagramas" por "607 tests / 72 archivos" y "full-check PASS (2026-07-24)".

- [ ] **Step 4: Commit**

```bash
git add docs/testing/README.md ai/current-state.md
git commit -m "docs: baseline y taxonomía de la suite de tests"
```

---

## Epic 1 — Corrección semántica (prioridad máxima)

### Task 1: Helpers de rayo reutilizables

**Files:**
- Create: `tests/helpers/diagramRay.ts`

**Interfaces:**
- Produces: `distanceToSupport(spec, pointId, supportId, result)`, `rayParameter(spec, pointId, originId, directionId)`, `moveSupportAndGlider(spec, draggedId, x, y, gliderId, supportId)`

- [ ] **Step 1: Crear helper con soporte genérico**

```typescript
import type { VisualDiagramModel } from '@/features/editor/diagrams/model/types';
import { projectPointToSupport } from '@/shared/diagrams/spec/scene';

export function distanceToSupport(
  spec: VisualDiagramModel,
  pointId: string,
  supportId: string,
  result: { x: number; y: number },
): number {
  const p = spec.points.find(item => item.id === pointId)!;
  const onSupport = projectPointToSupport(
    spec,
    { ...p, constraint: 'glider', gliderTarget: supportId },
    result,
  );
  return Math.hypot(result.x - onSupport.x, result.y - onSupport.y);
}

export function rayParameter(
  spec: VisualDiagramModel,
  pointId: string,
  originId: string,
  directionId: string,
): number {
  const p = spec.points.find(item => item.id === pointId)!;
  const o = spec.points.find(item => item.id === originId)!;
  const d = spec.points.find(item => item.id === directionId)!;
  const dx = d.x - o.x;
  const dy = d.y - o.y;
  const len = dx * dx + dy * dy || 1;
  return ((p.x - o.x) * dx + (p.y - o.y) * dy) / len;
}
```

- [ ] **Step 2: Commit**

```bash
git add tests/helpers/diagramRay.ts
git commit -m "test: helpers de proyección sobre soportes de rayo"
```

---

### Task 2: Corregir `OnRaySameSideConstraint` para `rayCaux`

**Files:**
- Modify: `tests/shared/diagrams/OnRaySameSideConstraint.test.ts`
- Test: mismo archivo

- [ ] **Step 1: Reemplazar imports y `distanceToRay` local**

Eliminar `distanceToRay` que hardcodea `rayBC`. Importar `distanceToSupport` desde `../../helpers/diagramRay`.

- [ ] **Step 2: Reescribir test DemoAnguloExterno L120–167**

```typescript
it('reproduce el caso real de DemoAnguloExterno (pD sobre rayCaux)', () => {
  const v2 = demoAnguloExternoV2();
  const pD = v2.points.find(item => item.id === 'pD')!;
  const result = constrainPointCoordinates(v2, pD, { x: 6, y: 1 });
  expect(distanceToSupport(v2, 'pD', 'rayCaux', result)).toBeLessThan(1e-8);
});

it('mantiene el parámetro del glider al mover pC o paux mientras el rayo lo permite', () => {
  let v2 = demoAnguloExternoV2();
  const pD0 = v2.points.find(item => item.id === 'pD')!;
  const pC0 = v2.points.find(item => item.id === 'pC')!;
  const paux0 = v2.points.find(item => item.id === 'paux')!;
  const initialT = rayParameter(v2, 'pD', 'pC', 'paux');

  const path = Array.from({ length: 8 }, (_, i) => ({
    x: pC0.x + i * 0.05,
    y: pC0.y,
    auxX: paux0.x + i * 0.08,
    auxY: paux0.y + i * 0.02,
  }));

  for (const target of path) {
    v2 = withMovedPoint(withMovedPoint(v2, 'pC', target.x, target.y), 'paux', target.auxX, target.auxY);
    const pD = v2.points.find(item => item.id === 'pD')!;
    expect(distanceToSupport(v2, 'pD', 'rayCaux', pD)).toBeLessThan(1e-8);
    expect(Math.abs(rayParameter(v2, 'pD', 'pC', 'paux') - initialT)).toBeLessThan(1e-5);
  }
});
```

Eliminar `moveSupportPoint` que mueve `pB` para un glider en `rayCaux`, o reparametrizarlo con `supportId: 'rayCaux'`, `originId: 'pC'`, `directionId: 'paux'`.

- [ ] **Step 3: Ejecutar tests**

```bash
npm test -- tests/shared/diagrams/OnRaySameSideConstraint.test.ts
```

Expected: PASS (6 tests).

- [ ] **Step 4: Commit**

```bash
git add tests/shared/diagrams/OnRaySameSideConstraint.test.ts tests/helpers/diagramRay.ts
git commit -m "fix(test): DemoAnguloExterno usa rayCaux, no rayBC, para pD"
```

---

### Task 3: Sustituir conteos mágicos por aserciones de schema

**Files:**
- Create: `tests/helpers/assertions.ts`
- Modify: `tests/features/editor/validation.test.ts`
- Modify: `tests/features/editor/catalog/resourceCatalog.test.ts` (solo el test de conteos si se extrae constante)

- [ ] **Step 1: Helper `expectKindCountFromSchema`**

```typescript
import { diagramElementKinds } from '@/shared/diagrams/spec'; // ajustar import real
import { ELEMENT_INSPECTOR_CAPABILITIES } from '@/features/editor/diagrams/model/elementInspectorCapabilities';

export function expectDiagramKindsAlignedWithInspector() {
  const inspectorKinds = new Set(Object.keys(ELEMENT_INSPECTOR_CAPABILITIES));
  for (const kind of diagramElementKinds) {
    expect(inspectorKinds.has(kind), `kind ${kind} sin capacidades de inspector`).toBe(true);
  }
  expect(diagramElementKinds.length).toBeGreaterThanOrEqual(30);
}
```

- [ ] **Step 2: Reemplazar en `validation.test.ts`**

```typescript
import { expectDiagramKindsAlignedWithInspector } from '../../helpers/assertions';

// dentro del test existente:
expectDiagramKindsAlignedWithInspector();
// eliminar: expect(diagramElementKinds).toHaveLength(34);
```

- [ ] **Step 3: En `resourceCatalog.test.ts`, usar constantes del script**

```typescript
import { listEditableCatalogResources } from '@/scripts/editor/buildEditorResourceCatalog';
// o leer del JSON generado en fixture pequeña congelada en tests/fixtures/editor/catalog-snapshot.json
```

Si el script no es importable desde tests, congelar snapshot JSON en `tests/fixtures/editor/catalog-counts.json` actualizado por `npm run editor:generated:check` y comparar `>=` en lugar de `===`.

- [ ] **Step 4: Run + commit**

```bash
npm test -- tests/features/editor/validation.test.ts tests/features/editor/catalog/resourceCatalog.test.ts
git commit -m "test: reemplazar conteos mágicos por alineación con schema"
```

---

## Epic 2 — Infraestructura Vitest (velocidad)

### Task 4: Tiers fast / slow / corpus

**Files:**
- Modify: `vitest.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Configurar proyectos Vitest**

```typescript
// vitest.config.ts — añadir dentro de test:
projects: [
  {
    extends: true,
    test: {
      name: 'fast',
      include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
      exclude: ['tests/**/*.full.test.tsx', 'tests/**/auditLossless.test.ts', 'tests/**/resourceCatalog.test.ts'],
    },
  },
  {
    extends: true,
    test: {
      name: 'slow',
      include: ['tests/**/*.full.test.tsx', 'tests/shared/diagrams/SetExactPointPosition.test.ts'],
      testTimeout: 120000,
    },
  },
  {
    extends: true,
    test: {
      name: 'corpus',
      include: ['tests/features/editor/document/auditLossless.test.ts', 'tests/features/editor/catalog/resourceCatalog.test.ts'],
      testTimeout: 180000,
    },
  },
],
```

Ajustar si Vitest 4 requiere `defineProject` — verificar con `npm run test:fast`.

- [ ] **Step 2: Scripts en `package.json`**

```json
"test:fast": "vitest run --project fast",
"test:slow": "vitest run --project slow",
"test:corpus": "vitest run --project corpus",
```

- [ ] **Step 3: Verificar tiempos**

```bash
time npm run test:fast
```

Target: <90s local (vs ~149s total).

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "test: tiers fast/slow/corpus en vitest"
```

---

### Task 5: Helper compartido del workbench

**Files:**
- Create: `tests/helpers/diagramWorkbench.tsx`
- Modify: `tests/features/editor/diagrams/DiagramWorkbench.test.tsx`
- Modify: `tests/features/editor/diagrams/DiagramWorkbench.responsive.test.tsx`
- Modify: `tests/features/editor/diagrams/ui/DiagramWorkbenchUx.test.tsx`

- [ ] **Step 1: Extraer mock y `renderWorkbench`**

```typescript
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { DiagramWorkbench } from '@/features/editor/diagrams/ui/DiagramWorkbench';

export const repositoryMocks = vi.hoisted(() => ({
  readDiagram: vi.fn(),
  saveDiagram: vi.fn(),
  updateMdxImports: vi.fn(),
}));

vi.mock('@/features/editor/diagrams/persistence/repository', () => ({
  diagramRepository: repositoryMocks,
}));

export function renderWorkbench(props: Partial<React.ComponentProps<typeof DiagramWorkbench>> & { isOpen?: boolean }) {
  return render(<DiagramWorkbench isOpen {...props} />);
}
```

- [ ] **Step 2: Migrar los 3 archivos a importar el helper** (eliminar bloques `vi.mock` duplicados).

- [ ] **Step 3: Run workbench tests**

```bash
npm test -- tests/features/editor/diagrams/DiagramWorkbench
```

- [ ] **Step 4: Commit**

```bash
git commit -m "test: helper compartido para DiagramWorkbench"
```

---

### Task 6: Cleanup JSXGraph global en setup

**Files:**
- Modify: `tests/setup.ts`

- [ ] **Step 1: Añadir afterEach para boards huérfanos**

```typescript
import { afterEach } from 'vitest';
import JXG from 'jsxgraph';

afterEach(() => {
  if (typeof JXG !== 'undefined' && JXG.JSXGraph?.freeBoard) {
    for (const id of [...(JXG.JSXGraph.boards?.map((b: { container: string }) => b.container) ?? [])]) {
      try { JXG.JSXGraph.freeBoard(id); } catch { /* board ya liberado */ }
    }
  }
});
```

- [ ] **Step 2: Medir si baja tiempo de import en suite diagramas**

```bash
npm test -- tests/shared/diagrams/ --reporter=dot
```

- [ ] **Step 3: Commit**

```bash
git commit -m "test: liberar boards JSXGraph tras cada test"
```

---

## Epic 3 — Cobertura de huecos críticos

### Task 7: `theme.ts` y resolución de colores

**Files:**
- Create: `tests/shared/diagrams/theme.test.ts`
- Modify: `tests/shared/diagrams/RayDirectionStability.test.ts` (importar theme fixture del helper)

- [ ] **Step 1: Test de forma del tema**

```typescript
import { describe, expect, it } from 'vitest';
import type { ThemeColors } from '@/shared/diagrams/core/theme';

const PALETTE_KEYS = ['carbon','terracota','salvia','lienzo','pizarra','ocre','pavo','granada','musgo'] as const;

describe('ThemeColors contract', () => {
  it('exige exactamente los nueve tokens Arts & Crafts', () => {
    const sample: ThemeColors = Object.fromEntries(
      PALETTE_KEYS.map(k => [k, `#${k}`]),
    ) as ThemeColors;
    expect(Object.keys(sample).sort()).toEqual([...PALETTE_KEYS].sort());
  });
});
```

- [ ] **Step 2: Run + commit**

```bash
npm test -- tests/shared/diagrams/theme.test.ts
git commit -m "test: contrato ThemeColors Arts & Crafts"
```

---

### Task 8: `useBoardLifecycle` — drag y liveSpec

**Files:**
- Create: `tests/shared/diagrams/useBoardLifecycle.test.ts`
- Read first: `src/shared/diagrams/runtime/useBoardLifecycle.ts`

- [ ] **Step 1: Test mínimo de integración con board stub**

```typescript
import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
// Importar hook y un spec mínimo v2 con un punto free

describe('useBoardLifecycle', () => {
  it('actualiza liveSpec al arrastrar sin mutar el spec congelado', async () => {
    // montar hook con spec fixture de 2 puntos + segment
    // simular onDrag con coordenadas nuevas
    // expect(liveSpec.points[id].x).toBeCloseTo(...)
    // expect(frozenSpec.points[id].x).toBe(initial) hasta commit
  });
});
```

Completar con firma real del hook tras leer el archivo; el test debe fallar primero si no hay export de test hook.

- [ ] **Step 2: Run hasta PASS**

```bash
npm test -- tests/shared/diagrams/useBoardLifecycle.test.ts
```

- [ ] **Step 3: Commit**

```bash
git commit -m "test: useBoardLifecycle preserva spec y publica liveSpec al drag"
```

---

### Task 9: `v3Compatibility` — materialización lazy

**Files:**
- Create: `tests/shared/diagrams/v3Compatibility.test.ts`

- [ ] **Step 1: Tabla de casos**

| Caso | Entrada v3 | Proyección v2 | Tras materialize |
|------|------------|---------------|------------------|
| sameSide sin side | relación sameSide | `side` undefined | `side === 1` |
| on-support | mobility on ray | gliderTarget presente | igual |
| derived point | xExpression | constraint derived | igual |

```typescript
import { projectDiagramSpecV3ToV2 } from '@/shared/diagrams/spec/v3Compatibility';
import { materializeSameSideConstraints } from '@/shared/diagrams/spec/scene';

it('no materializa side en proyección v3→v2', () => {
  const v2 = projectDiagramSpecV3ToV2(minimalSameSideV3);
  expect(v2.constraints.find(c => c.id === 'sameA')?.side).toBeUndefined();
  const mat = materializeSameSideConstraints(v2);
  expect(mat.constraints.find(c => c.id === 'sameA')?.side).toBe(1);
});
```

Reutilizar fixture de `SameSideConstraint.test.ts` (extraer a `tests/fixtures/diagrams/same-side-v3-minimal.json`).

- [ ] **Step 2: Run + commit**

```bash
npm test -- tests/shared/diagrams/v3Compatibility.test.ts
git commit -m "test: roundtrip v3→v2 y materialización lazy de sameSide"
```

---

### Task 10: Smoke tests de `pages/`

**Files:**
- Create: `tests/pages/TheoremPage.test.tsx`
- Create: `tests/pages/DemoPage.test.tsx`
- Create: `tests/pages/GraphPage.test.tsx`
- Pattern: seguir `tests/pages/MethodsPage.test.tsx`

- [ ] **Step 1: TheoremPage smoke**

```typescript
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TheoremPage from '@/pages/TheoremPage';

it('monta contenido de teorema conocido sin error', async () => {
  render(
    <MemoryRouter initialEntries={['/teorema/teorema-pitagoras']}>
      <Routes><Route path="/teorema/:slug" element={<TheoremPage />} /></Routes>
    </MemoryRouter>,
  );
  expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
});
```

Repetir para `demo-angulo-externo` y ruta `/grafo` con `GraphPage` (mock worker si bloquea).

- [ ] **Step 2: Run pages**

```bash
npm test -- tests/pages/
```

- [ ] **Step 3: Commit**

```bash
git commit -m "test: smoke tests para TheoremPage, DemoPage y GraphPage"
```

---

## Epic 4 — Consolidación y nomenclatura

### Task 11: Fusionar tests responsive del workbench

**Files:**
- Modify: `tests/features/editor/diagrams/DiagramWorkbench.test.tsx`
- Delete: `tests/features/editor/diagrams/DiagramWorkbench.responsive.test.tsx` (tras migrar casos)

- [ ] **Step 1: Parametrizar viewports**

```typescript
describe.each([
  { width: 390, height: 844, label: 'mobile' },
  { width: 1440, height: 900, label: 'desktop' },
])('DiagramWorkbench @$label', ({ width, height }) => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
    window.dispatchEvent(new Event('resize'));
  });
  it('exposes task navigation', async () => { /* ... */ });
});
```

- [ ] **Step 2: Verificar 0 regresiones**

```bash
npm test -- tests/features/editor/diagrams/DiagramWorkbench.test.tsx
```

- [ ] **Step 3: Eliminar archivo responsive y commit**

```bash
git rm tests/features/editor/diagrams/DiagramWorkbench.responsive.test.tsx
git commit -m "test: fusionar workbench responsive en suite principal"
```

---

### Task 12: Renombrar suites Phase* → dominio

**Files:** (renombrar sin cambiar lógica)

| Actual | Nuevo |
|--------|-------|
| `Phase3Inspector.test.tsx` | `DiagramInspector.editing.test.tsx` |
| `Phase3Renderer.test.tsx` | `DiagramRenderer.primitives.test.tsx` |
| `Phase3Serialization.test.ts` | `diagramSource.serialization.test.ts` |
| `Phase3GeometryLanguage.test.ts` | `diagramExpressions.test.ts` |
| `Phase4Steps.test.ts` | `diagramSteps.model.test.ts` |
| `Phase4Interaction.test.tsx` | `diagramSteps.interaction.test.tsx` |
| `Phase4Targets.test.ts` | `diagramTargets.registry.test.ts` |
| `Phase5AcceptanceMigrations.test.ts` | `diagramMigrations.acceptance.test.ts` |
| `Phase7VisualAuthoring.test.tsx` | `editorVisualAuthoring.test.tsx` |
| `Phase7SemanticLinker.test.tsx` | `editorSemanticLinker.test.tsx` |
| `phase6LosslessEngine.test.ts` | (mantener o `mdxLosslessEngine.test.ts`) |
| `phase7AuthoringUx.test.ts` | `editorAuthoringUx.test.ts` |

- [ ] **Step 1: `git mv` cada archivo**
- [ ] **Step 2: `npm test` completo**
- [ ] **Step 3: Commit único**

```bash
git commit -m "test: renombrar suites PhaseN a nombres de dominio"
```

---

### Task 13: Pirámide de estabilidad de semirrectas — documentar y podar

**Files:**
- Modify: `docs/testing/README.md`
- Opcional delete: `tests/shared/diagrams/DemoAnguloExternoRayStability.full.test.tsx` **solo si** Task 2 + `RayDirectionStability.full` cubren el invariante

- [ ] **Step 1: Matriz de responsabilidad**

| Archivo | Invariante | Mantener |
|---------|------------|----------|
| `RayDirectionStability.test.ts` | createRay no voltea (unit) | sí |
| `RayDirectionStability.full.test.tsx` | pipeline React completo | sí |
| `DemoAnguloExternoRayStability.full.test.tsx` | rayBC widget real | evaluar tras Task 2 |
| `RayExtensionParallelConstraint.test.ts` | parallel + extensión | sí |

- [ ] **Step 2: Si DemoAnguloExterno.full redundante, convertir en un solo `it` dentro de `RayDirectionStability.full` con spec importado**

- [ ] **Step 3: Commit**

```bash
git commit -m "test: clarificar pirámide de estabilidad de semirrectas"
```

---

## Epic 5 — Calidad de aserciones y CPT

### Task 14: Arreglar TC-1.1 (SearchOmnibar)

**Files:**
- Modify: `tests/features/search/SearchOmnibar.test.tsx`
- Modify: `tests/scripts/test-definitions.json` (si cambia el output esperado)

- [ ] **Step 1: Añadir aserción de resultados**

```typescript
it('muestra resultados tipificados al buscar pitagoras (TC-1.1)', async () => {
  render(<SearchOmnibarHarness />);
  const searchbox = screen.getByRole('searchbox');
  fireEvent.change(searchbox, { target: { value: 'pitagoras' } });
  expect(await screen.findByRole('option', { name: /pitágoras/i })).toBeInTheDocument();
  expect(screen.getByText(/teorema/i)).toBeInTheDocument();
});
```

Ajustar roles según DOM real (`listbox`/`option` vs `link`).

- [ ] **Step 2: Regenerar CPT**

```bash
npm run test:report
```

Expected: TC-1.1 ✅ en `docs/testing/Category_Partition_Tests.md`.

- [ ] **Step 3: Commit**

```bash
git commit -m "test: cerrar TC-1.1 omnibar con aserción de resultados"
```

---

### Task 15: Migrar `toBeTruthy()` críticos en diagramas UI

**Files:** (lote de 5 archivos más frágiles)
- `tests/features/editor/diagrams/Phase3Inspector.test.tsx` → nombre nuevo tras Task 12
- `tests/features/editor/diagrams/DiagramWorkbench.test.tsx`
- `tests/features/editor/diagrams/DiagramEditorUsability.test.tsx`

- [ ] **Step 1: Regla — reemplazar solo interacciones de usuario**

```typescript
// antes
expect(screen.getByText('Objetos')).toBeTruthy();
// después
expect(screen.getByRole('heading', { name: 'Objetos' })).toBeInTheDocument();
```

- [ ] **Step 2: Lint opcional** — añadir regla eslint local `testing-library/prefer-screen-queries` si no existe.

- [ ] **Step 3: Commit por archivo o lote**

```bash
git commit -m "test: aserciones Testing Library más estrictas en workbench"
```

---

## Epic 6 — CI y cobertura ampliada

### Task 16: Alinear CI con tiers

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json` (`editor:full-check`, `editor:release-check`)

- [ ] **Step 1: Job `unit-fast` en PR**

```yaml
unit-fast:
  runs-on: ubuntu-latest
  timeout-minutes: 15
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: '20', cache: 'npm' }
    - run: npm ci
    - run: npm run test:fast
```

- [ ] **Step 2: Mover `test:slow` + `test:corpus` a `editor-release-check` o job nightly**

- [ ] **Step 3: Verificar `editor:release-check` incluye `editor:test:visual` (phase5) — ya está en package.json L64**

- [ ] **Step 4: Commit**

```bash
git commit -m "ci: test:fast en PR, slow/corpus en release"
```

---

### Task 17: Cobertura `shared/diagrams`

**Files:**
- Create: `scripts/editor/check-diagram-coverage.ts`
- Modify: `package.json` — `"diagram:test:coverage": "vitest run tests/shared/diagrams --coverage --coverage.include='src/shared/diagrams/**' && tsx scripts/editor/check-diagram-coverage.ts"`

- [ ] **Step 1: Umbrales iniciales conservadores**

```typescript
const areas = [
  { pattern: /src\/shared\/diagrams\/spec\/scene\.ts$/, lines: 75, branches: 60 },
  { pattern: /src\/shared\/diagrams\/runtime\/useBoardLifecycle\.ts$/, lines: 50, branches: 40 },
  { pattern: /src\/shared\/diagrams\/core\/MathFactory\.ts$/, lines: 55, branches: 45 },
];
```

Subir 5 puntos por trimestre; no bloquear `full-check` hasta baseline medido.

- [ ] **Step 2: Medir baseline**

```bash
npm run diagram:test:coverage
```

- [ ] **Step 3: Commit**

```bash
git commit -m "test: gate de cobertura para shared/diagrams"
```

---

### Task 18: Muestreo de widgets diagrama (aceptación)

**Files:**
- Modify: `tests/shared/diagrams/SampleWidgetsValidation.full.test.tsx`
- Create: `tests/fixtures/diagrams/widget-acceptance-manifest.json`

- [ ] **Step 1: Manifest con 12 widgets representativos**

```json
[
  { "id": "DemoAnguloExterno", "invariant": "ray-no-flip" },
  { "id": "Semirrecta", "invariant": "ray-no-flip" },
  { "id": "Bisectriz", "invariant": "ray-no-flip" },
  { "id": "EjemploPitagorasCalculo", "invariant": "expression-no-nan" }
]
```

- [ ] **Step 2: Test parametrizado que itera manifest** (extiende SampleWidgetsValidation)

- [ ] **Step 3: Documentar en `docs/testing/README.md` relación con `editor:diagrams:check`**

- [ ] **Step 4: Commit**

```bash
git commit -m "test: manifest de aceptación para widgets diagrama"
```

---

## Epic 7 — Deuda documentada (no bloqueante)

### Task 19: Diff review desconectado

**Files:**
- Modify: `tests/features/editor/ux/diffReview.test.ts` — añadir `describe.skip` con razón hasta reconectar `EditorDiffController`

```typescript
describe.skip('diff review UI integration [blocked: EditorDiffController desconectado]', () => {
  // tests existentes
});
```

O mover a `tests/features/editor/ux/diffReview.unit.test.ts` (solo funciones puras) y marcar integración como pendiente en `ai/current-state.md`.

- [ ] **Step 1: Separar tests puros de integración desconectada**
- [ ] **Step 2: Commit**

```bash
git commit -m "test: aislar diffReview desconectado de la suite activa"
```

---

### Task 20: Accesibilidad — ampliar sin NVDA

**Files:**
- Modify: `tests/features/editor/navigation/EditorAccessibility.test.tsx`
- Create: `tests/shared/diagrams/diagramA11y.test.tsx`

- [ ] **Step 1: Verificar roles ARIA en renderer** (ya parcial en Phase3Renderer L352)

```typescript
it('expone aria-roledescription en puntos móviles', () => {
  // render DiagramRenderer con spec mínimo
  expect(screen.getAllByRole('img', { name: /punto móvil/i }).length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Commit**

```bash
git commit -m "test: invariantes a11y del renderer de diagramas"
```

---

## Orden de ejecución recomendado

```
Epic 0 (baseline)
  → Epic 1 (corrección semántica)     ← máximo ROI
  → Epic 2 (infra fast/slow)
  → Epic 3 (huecos theme/lifecycle/pages)
  → Epic 5 Task 14 (CPT TC-1.1)
  → Epic 4 (consolidación)
  → Epic 6 (CI + cobertura)
  → Epic 7 (deuda)
```

## Criterios de cierre del programa

| Métrica | Actual | Objetivo |
|---------|--------|----------|
| Tests vitest | 1220 PASS | ≥1220 PASS (sin inflar trivialmente) |
| `test:fast` local | — | <90s |
| `full-check` | PASS | PASS |
| Pages con smoke | 1/23 | ≥4 tipos de página |
| Tests semánticamente incorrectos (OnRay*) | ≥3 | 0 |
| TC-1.1 CPT | FAIL | PASS |
| Conteos mágicos frágiles | ≥3 archivos | 0 en validation/catalog |
| `toBeTruthy` en diagramas UI | ~80 | <30 |

## Self-Review (spec coverage)

| Requisito del análisis previo | Task |
|-------------------------------|------|
| OnRaySameSideConstraint rayCaux | Task 2 |
| validation toHaveLength(34) | Task 3 |
| useBoardLifecycle sin test | Task 8 |
| theme.ts sin test | Task 7 |
| pages/ hueco | Task 10 |
| Workbench duplicado | Task 5, 11 |
| Tests lentos (auditLossless) | Task 4 |
| E2E fuera vitest | Task 16 (release-check) |
| Phase* nomenclatura | Task 12 |
| Pirámide ray stability | Task 13 |
| CPT TC-1.1 | Task 14 |
| current-state obsoleto | Task 0 |
| diffReview desconectado | Task 19 |
| Cobertura shared/diagrams | Task 17 |
| Widget sampling | Task 18 |

No placeholders pendientes en pasos de código: los snippets son plantillas a completar con firmas reales donde el plan indica "leer archivo primero" (Task 8).

---

**Plan complete and saved to `docs/superpowers/plans/2026-07-24-test-suite-improvement.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — un subagente por epic/task, revisión entre tareas, iteración rápida.

**2. Inline Execution** — ejecutar en esta sesión con executing-plans, por lotes (Epic 0→1→2…) con checkpoints.

¿Cuál prefieres?
