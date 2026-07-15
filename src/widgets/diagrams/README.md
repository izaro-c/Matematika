# Fachada de diagramas

`@/widgets/diagrams` es la API pública mínima para contratos compartidos por los
diagramas. Su propósito actual es estabilizar tres fronteras y convivir con el
runtime modular basado en `MathBoard`:

- tokens de la paleta Arts & Crafts y lectura de su variable CSS;
- resolución tipada de targets de `highlight` o `step`;
- tipos base de JSXGraph y del registro de elementos.

## Uso

```ts
import {
  getDiagramColor,
  isDiagramTargetActive,
  type DiagramBoard,
  type DiagramElementRegistry,
} from '@/widgets/diagrams';

const terracota = getDiagramColor('terracota');
const isActive = isDiagramTargetActive(highlight, 'segmento-ab');
```

Los consumidores nuevos deben importar estos contratos desde la fachada, no
desde `lib/` ni `types/`. Los componentes de diagrama siguen importándose por
su ruta concreta para conservar los imports MDX actuales.

## Edición visual

El editor visual reconoce diagramas escritos con:

- `MathBoard` desde `@/shared/diagrams/core/MathBoard`;
- primitivas de `MathFactory` desde `@/shared/diagrams/core/MathFactory`;
- creación registrada como `els.id = createPoint(...)` o como variable local
  posteriormente asignada a `els.id`;
- pasos opcionales descritos por `stepTargets` o por el bloque
  `@matematika-diagram-model`.

La auditoría se ejecuta con:

```bash
npm run editor:diagrams:check
```

Los diagramas JSXGraph legacy con `JXG.JSXGraph.initBoard` se reportan aparte
porque todavía requieren reescritura a `MathBoard`. Las escenas Three.js,
simulaciones HTML y placeholders quedan fuera del editor geométrico visual.

## Límites

La fachada no reexporta `MathBoard`, `MathFactory`, `MathUtils`,
`MathStoreContext`. Ese módulo tiene una ruta explícita para
mantener clara la frontera FSD. Tampoco incluye helpers geométricos específicos,
estado React ni adapters de compatibilidad: solo se añadirá una responsabilidad
cuando tenga un contrato estable y pilotos que la justifiquen.

No se deben añadir:

- imports desde `app`, `pages`, `widgets`, `features` o `entities`;
- colores fuera de `DIAGRAM_THEME_TOKENS`;
- tipos abiertos con `any`;
- adapters de store o reexports de compatibilidad;
- utilidades ligadas a un único diagrama.

## Deuda residual visible

La migración principal ya usa el core compartido en
`src/shared/diagrams/core/`. La deuda residual vive en los diagramas reportados
como `Legacy JSXGraph` por la auditoría, más escenas 3D/HTML que no pertenecen
al editor geométrico visual. Cada migración restante debe conservar geometría e
interacción y registrar explícitamente puntos y elementos editables.
