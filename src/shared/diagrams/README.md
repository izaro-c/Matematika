# Domain: `diagrams` (shared contract)

**Qué es:** Spec v2/v3, escena, viewport, runtime de board y renderer público.

**Qué no es:** UI del workbench del editor (`features/editor/diagrams`), chrome de app.

## Layout

| Ruta | Rol |
|---|---|
| `spec/` | tipos, schema, escena (`scene*.ts`), viewport, migraciones |
| `spec/sceneTypes.ts` | tipos de escena + apariencia de paso |
| `spec/sceneCoordinates.ts` | resolución de puntos / soportes |
| `spec/scenePointMotion.ts` | constraints + movimiento |
| `spec/sceneBounds.ts` | viewport / bounds |
| `spec/scenePlan.ts` | plan de escena, grafo, revisiones |
| `runtime/` | lifecycle del board, createElement, helpers |
| `core/` | tipos de tema resuelto (`ThemeColors`), utilidades core |
| `constants.ts` | defaults editables (ángulos, viewport, capas) |
| `public.ts` / `index.ts` | barrel público |

## API pública

```ts
import { … } from '@/shared/diagrams';
// o
import { … } from '@/shared/diagrams/spec';
import { … } from '@/shared/diagrams/runtime/…';
```

`widgets/diagrams` y `features/editor` consumen este contrato. **`widgets/diagrams` no puede importar `features/editor`.**

## Constantes

- [`constants.ts`](./constants.ts) — padding de viewport, defaults de escena editables
- Colores de token de spec: `DiagramColorToken` en `spec/types.ts` alineado con `shared/design`

## OO suave

Clases/servicios solo si encapsulan invariantes de escena; el resto son funciones puras en `spec/`.
