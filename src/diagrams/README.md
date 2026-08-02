# `diagrams/` — diagram engine

**What:** DiagramSpec model, scene geometry, JSXGraph adapters, and renderer.

**Not:** Editor workbench UI (`fixed-pages/editor/diagrams/`), published demos (`content/diagrams/`).

## Layout

| Folder | Role |
|---|---|
| `model/` | Contract: types, Zod schemas, migrations, expressions, semantics |
| `geometry/` | Pure scene math: coordinates, curves, areas, layout/viewport |
| `jsxgraph/` | Low-level JSXGraph adapters (`MathBoard`, `MathFactory`) |
| `render/` | Paint + lifecycle (`DiagramRenderer`, board hooks) |

## Imports

```ts
import { createDiagramSpec, DiagramRenderer } from '@/diagrams';
import { … } from '@/diagrams/model';
import { … } from '@/diagrams/geometry';
import { MathBoard } from '@/diagrams/jsxgraph';
import { useBoardLifecycle } from '@/diagrams/render/lifecycle';
```

**Rules:** `model` / `geometry` must not import `jsxgraph` or `render`. `render` may import all three.

## Constants

Editable defaults: [`constants.ts`](./constants.ts).
