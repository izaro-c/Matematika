# Fachada de diagramas

`@/shared/diagrams` es la API pública mínima para contratos compartidos por los
diagramas. Su propósito actual es estabilizar tres fronteras sin cambiar el
runtime de JSXGraph:

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
} from '@/shared/diagrams';

const terracota = getDiagramColor('terracota');
const isActive = isDiagramTargetActive(highlight, 'segmento-ab');
```

Los consumidores nuevos deben importar estos contratos desde la fachada, no
desde `lib/` ni `types/`. Los componentes de diagrama siguen importándose por
su ruta concreta para conservar los imports MDX actuales.

## Límites

La fachada no reexporta `MathBoard`, `MathFactory`, `MathUtils`,
`MathStoreContext` ni `LessonStore`. Esos módulos viven en capas superiores y
reexportarlos desde `shared` escondería la inversión FSD en vez de resolverla.
Tampoco incluye helpers geométricos específicos, estado React ni un wrapper de
lifecycle: solo se añadirá una responsabilidad cuando tenga un contrato estable
y pilotos que la justifiquen.

No se deben añadir:

- imports desde `app`, `pages`, `widgets`, `features` o `entities`;
- colores fuera de `DIAGRAM_THEME_TOKENS`;
- tipos abiertos con `any`;
- adapters de store o reexports de compatibilidad;
- utilidades ligadas a un único diagrama.

## Deuda residual visible

La migración general queda fuera de esta fase. Tras el piloto siguen existiendo
55 diagramas con imports a `MathStoreContext`, 27 a `LessonStore`, 11 a
`MathBoard`/`MathFactory`, 526 apariciones de `any`, 55 helpers locales de tema,
51 inicializaciones directas de JSXGraph y tres wrappers parciales
(`JXGBoard`, `JSXGraphWrapper` y `MathBoard`).

El siguiente lote deberá decidir el puerto de interacción y el owner del
lifecycle antes de mover wrappers. Hasta entonces, cada piloto debe ser pequeño,
conservar geometría e interacción y no ampliar las aristas FSD.
