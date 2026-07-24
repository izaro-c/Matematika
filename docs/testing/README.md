# Taxonomía de tests Matematika

## Tiers Vitest

| Tier | Comando | Alcance | CI |
|------|---------|---------|-----|
| **fast** | `npm run test:fast` | Unit + integración ligera; excluye `.full.test.tsx`, `auditLossless`, `resourceCatalog` | PR (`unit-fast` job) |
| **slow** | `npm run test:slow` | `.full.test.tsx` con JSXGraph + React; `SetExactPointPosition` | `editor:release-check` |
| **corpus** | `npm run test:corpus` | Auditoría MDX lossless; catálogo real de recursos | `editor:release-check` / `full-check` |
| **all** | `npm test` | Suite completa (1220+ tests) | `full-check` |

## Gates fuera de Vitest

| Gate | Comando | Qué verifica |
|------|---------|--------------|
| E2E editor | `npm run editor:test:e2e` | Puppeteer: UX segura del editor |
| E2E diagramas | `npm run editor:test:visual` | Diagramas publicados (Pitágoras, Poincaré, ALA, Paralelogramo) |
| Diagramas script | `npm run editor:diagrams:check` | 84 diagramas finales, visual-exact vs code-preview |
| Roundtrip MDX | `npm run editor:roundtrip:check` | 120 MDX byte-a-byte |

## Helpers compartidos

| Archivo | Uso |
|---------|-----|
| [`tests/helpers/diagramRay.ts`](../helpers/diagramRay.ts) | Proyección sobre soportes, parámetro de rayo, simulación glider |
| [`tests/helpers/assertions.ts`](../helpers/assertions.ts) | Alineación schema ↔ inspector |
| [`tests/helpers/diagramWorkbench.ts`](../helpers/diagramWorkbench.ts) | Factory de mocks `diagramRepository` para tests del workbench |

## Convenciones

- **`.full.test.tsx`**: tubería completa React + MathBoard + JSXGraph; ejecutar en tier `slow`.
- **Invariantes geométricos** preferidos sobre snapshots pixel-perfect.
- **Labels UI**: preferir `getByRole` / `getByLabelText` estable; evitar `toHaveLength(N)` acoplado al corpus.

## Huecos documentados

- `useBoardLifecycle`: cubierto indirectamente vía tests de escena y `.full`; sin test unitario del hook (requeriría refactor de export).
- `pages/`: smoke mínimo (`MethodsPage`); ampliar en follow-up.
- `diffReview` integración: tests de funciones puras activos; UI desconectada hasta reconectar `EditorDiffController`.

## CPT (Category Partition Tests)

Teoría en [`tests/scripts/test-definitions.json`](../scripts/test-definitions.json). Regenerar tabla con:

```bash
npm run test:report
```

Resultado inyectado en [`Category_Partition_Tests.md`](Category_Partition_Tests.md).
