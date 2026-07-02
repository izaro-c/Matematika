# Auditoría de calidad de código

**Fecha:** 2026-07-02

**Alcance:** arquitectura frontend, TypeScript, React, UI, editor, grafos, diagramas y pruebas.

**Naturaleza:** auditoría de solo lectura sobre código de producto; no se ha refactorizado ni corregido ningún warning.

## Convenciones de evidencia

- **Hecho:** dato observado directamente en código, configuración o salida de un comando reproducible.
- **Heurística:** señal que orienta una revisión, pero no demuestra por sí sola un defecto.
- **Recomendación:** acción propuesta; requiere una tarea posterior con alcance propio.

Los recuentos de esta auditoría reflejan el árbol de trabajo del 2 de julio de 2026. Los índices de `ai/indexes/` y `ai/reports/debt-report.md` se han usado como inventario inicial, pero los datos críticos se han contrastado contra el código y las herramientas ejecutables.

## 1. Resumen ejecutivo

### Diagnóstico

**Hecho.** La base tiene fortalezas claras: TypeScript está en modo `strict`, las entidades no importan capas superiores, el contenido se valida con Zod, la aplicación tiene separación reconocible por capas y existen validadores de tipos, arquitectura, referencias, grafo, Lean y contenido.

**Hecho.** La salud nominal de los comandos oculta deuda relevante:

- `npm run depcruise` termina con código 0, pero informa **166 warnings y 0 errores** sobre 262 módulos y 744 dependencias.
- De esos 166 warnings, **66** pertenecen a una regla que también marca imports internos de la misma feature; solo **6** son cruces entre features distintas.
- La regla de `shared` no comprueba imports hacia `app`. Existen **56 imports `shared → app`**, 55 desde diagramas y uno desde `VisualBind`.
- ESLint encuentra **697 warnings y 0 errores** en `src`: 594 son usos reales de `any`.
- **529 de los 594 `any` (89,1 %)** están en `src/shared/diagrams/`; la deuda no está distribuida de forma uniforme.
- `src/pages/GraphPage.tsx` concentra las **9 únicas supresiones `@ts-*`** de `src`.
- Hay **246 literales hex** en TS/TSX de `src`; 91 están en diagramas y 72 en `src/shared/lib/constants.ts`.
- Existen 18 archivos `*.test.*` ejecutables. `npm run test:coverage` ejecuta **314 tests, todos verdes**, pero solo alcanza 14,53 % de statements en el alcance configurado y no instrumenta `pages`, `widgets`, `shared/ui` ni diagramas.

**Hecho.** Los tres riesgos principales son:

1. El contrato FSD declarado no coincide con la señal del guardrail ejecutable.
2. Las fronteras de librerías visuales —`react-force-graph-2d`, JSXGraph, React Flow y Monaco— están insuficientemente tipadas.
3. Editor, grafos y diagramas concentran coordinación, efectos y lógica sin pruebas proporcionales.

### Decisión recomendada

**Recomendación.** El primer refactor de producto debe ser pequeño y determinista: tipar la frontera de `GraphPage` y eliminar sus 9 `@ts-ignore` sin cambiar comportamiento ni colores. Es la deuda más acotada, verificable y con mejor relación impacto/riesgo.

**Recomendación.** Inmediatamente después debe calibrarse `.dependency-cruiser.js`. No conviene mover decenas de archivos hasta que la regla distinga:

- import interno de una slice frente a cruce real entre slices;
- composición intencional frente a inversión de dependencia;
- deuda conocida frente a regresión nueva;
- `shared → app`, actualmente invisible para la regla.

**Recomendación.** La migración masiva de colores y la reestructuración visual deben esperar al design system. La evolución de schemas del editor, rutas de aprendizaje, niveles y variantes pedagógicas debe esperar al sistema pedagógico multinivel. Sí conviene preparar antes tipos, pruebas y límites que reduzcan el riesgo de esas fases.

## 2. Estado actual del código

### 2.1 Inventario

| Métrica | Estado observado | Tipo |
| --- | ---: | --- |
| Archivos TS/TSX en `src` | 237 | Hecho |
| Componentes/archivos TSX en `src` | 197 | Hecho |
| Líneas TS/TSX en `src` | 26.685 | Hecho |
| Archivos MDX | 116 | Hecho |
| Diagramas TSX | 82 | Hecho |
| Líneas TSX en diagramas | 10.481 | Hecho |
| Archivos `*.test.ts(x)` | 18 | Hecho |
| Tests ejecutados por Vitest | 314 | Hecho |
| Tests fallidos en cobertura | 0 | Hecho |

**Hecho.** `tsconfig.app.json` activa `strict`, `noUnusedLocals`, `noUnusedParameters` y `noFallthroughCasesInSwitch`. También activa `skipLibCheck`, por lo que el tipado de dependencias no se valida internamente; esto es habitual, pero aumenta la importancia de tipar bien las fronteras propias.

**Heurística.** El tamaño del repositorio todavía permite refactors graduales. No hay evidencia que justifique una reescritura.

### 2.2 Arquitectura FSD

#### Estado por capa

| Capa | Estado | Evidencia |
| --- | --- | --- |
| `app` | Composición raíz razonable, pero aloja hooks/contextos consumidos hacia abajo | `MathStoreContext`, `StudyPlanContext` |
| `pages` | Predominan adaptadores de ruta; `GraphPage` contiene lógica de render y navegación | 22 archivos registrados; `GraphPage` tiene 284 líneas |
| `widgets` | Compone UI, pero importa features directamente | 8 warnings reales `widgets → features` |
| `features` | Agrupación por dominio reconocible; existen cruces de slice y 2 imports hacia `app` | 6 cruces entre features; `MathBoard` y `StudyTask` importan `app` |
| `entities` | Es la capa más limpia y mejor probada | 0 imports hacia `app/pages/widgets/features`; cobertura alta en contenido/grafo |
| `shared` | Mezcla primitives, composición MDX y componentes con estado de dominio | 57 warnings detectados, 56 imports adicionales hacia `app` no detectados |
| `database` | Contenido estático MDX separado | 116 MDX; fuera del alcance de cambios de esta auditoría |

**Hecho.** `.dependency-cruiser.js` define 4 reglas con severidad `error` y 9 con severidad `warn`. Las reglas FSD que más deuda revelan están en `warn`, de modo que `npm run depcruise` pasa aunque existan inversiones declaradas como no permitidas por `AGENTS.md`.

**Hecho.** Distribución de los 166 warnings:

| Regla | Warnings | Lectura |
| --- | ---: | --- |
| `fsd-features-cross-imports` | 66 | Ruidosa: incluye imports dentro de la misma feature |
| `fsd-shared-no-upper-layers` | 57 | Reales según la regla, pero omite `app` |
| `fsd-exception-mdxblocks` | 20 | La excepción se reporta como warning |
| `fsd-widgets-no-features` | 8 | Cruces reales según el contrato global |
| `no-orphans` | 8 | 7 candidatos reales y `vite-env.d.ts` |
| `fsd-pages-no-cross-imports` | 3 | Falsos positivos: imports internos de la slice `Home` |
| `fsd-features-no-upper-layers` | 2 | `MathBoard → MathStoreContext`; `StudyTask → StudyPlanContext` |
| `fsd-exception-shims` | 2 | Shims explícitos que siguen generando ruido |

**Hecho.** Los seis cruces entre features distintas son:

- `exercises → dynamic-vars` en `DeslizadorEnLine.tsx`;
- `exercises → lessons` en `Paso.tsx`, `Pregunta.tsx` y `Solucion.tsx`;
- `glossary → progress` en `ConceptLink.tsx` y `RefLink.tsx`.

**Heurística.** Algunos cruces podrían expresar composición válida del producto, pero hoy no existe una API pública de slice ni una decisión documentada que permita distinguirlo.

**Hecho.** `MDXBlocks.tsx` está en `shared/ui`, pero actúa como composition root de MDX e importa widgets y features. Dos shims en `shared/ui` reexportan desde capas superiores. La configuración reconoce las excepciones y, a la vez, las cuenta como warnings.

**Recomendación.** Antes de mover código, debe acordarse si:

1. `MDXBlocks` es realmente composición de `app` y debe subir de capa;
2. los diagramas son primitives inyectables sin stores o componentes de dominio que no pertenecen a `shared`;
3. widgets pueden consumir APIs públicas de features en la variante FSD adoptada por Matematika;
4. las excepciones se aceptan con allowlist explícita y fecha de retirada.

### 2.3 TypeScript y supresiones

**Hecho.** ESLint identifica 594 usos reales de `any`:

| Zona | `any` reales | Porcentaje aproximado |
| --- | ---: | ---: |
| `shared` | 531 | 89,4 % |
| `features` | 61 | 10,3 % |
| `pages` | 2 | 0,3 % |
| Solo `shared/diagrams` | 529 | 89,1 % del total |
| `features/graph` | 54 | 9,1 % del total |
| `features/editor` | 7 | 1,2 % del total |

**Hecho.** Los puntos de mayor densidad son:

- `Cuadrilatero.tsx`: 71;
- `MathFactory.ts`: 45;
- `DemoPitagorasEuclides.tsx`: 38;
- `CongruenciaALA.tsx`: 21;
- `Paralelogramo.tsx`: 20.

**Heurística.** El recuento no debe convertirse en una sustitución automática. JSXGraph expone APIs dinámicas y su tipado requiere interfaces de frontera, no cientos de casts locales.

**Hecho.** `GraphPage.tsx` contiene 9 `@ts-ignore` para:

- métodos imperativos del ref (`centerAt`, `zoom`, `zoomToFit`, `d3Force`);
- el propio `ref`;
- callbacks de render y eventos.

**Hecho.** `react-force-graph-2d` exporta `ForceGraphMethods`, `ForceGraphProps`, `GraphData`, `NodeObject` y `LinkObject`. Las supresiones no son inevitables por ausencia total de tipos en la dependencia.

**Hecho.** `useEditorActions.ts` define una interfaz local de Monaco con `any` en selecciones y rangos, aunque `@monaco-editor/react` y Monaco ofrecen tipos para estas fronteras.

**Recomendación.** Tipar primero fronteras, no hojas:

1. `GraphPage` con tipos exportados por `react-force-graph-2d`;
2. Monaco en editor;
3. una fachada JSXGraph común;
4. solo después reducir `any` en diagramas por familias.

### 2.4 Colores y hardcoding visual

**Hecho.** Se han contado 246 literales hex en TS/TSX de `src` y 18 en `src/app/index.css`.

**Hecho.** Los 18 hex de `index.css` definen los nueve tokens Arts & Crafts en tema claro y oscuro. Son definiciones canónicas, no deuda por sí mismas.

**Hecho.** `src/shared/lib/constants.ts` contiene 72 hex para estilos de tipos de contenido y grafo. Varios duplican valores de la paleta y otros introducen tonos no nombrados.

**Hecho.** `src/shared/lib/theme.ts` conserva una paleta azul/verde/ámbar ajena a Arts & Crafts. Solo se consume en `DemoTrianguloIsosceles.tsx`.

**Hecho.** Hay hardcoding duplicado en:

- `GraphPage.tsx` y `TaxonomyGraph.tsx`, con lógica de canvas y colores muy parecida;
- `graph.worker.ts`, `AxiomaticTree.tsx`, `graphUtils.ts` y componentes laterales del grafo;
- `HistoryTimeline.tsx`;
- 91 apariciones en diagramas, de las cuales muchas son fallback `#000`, pero otras incluyen rojo Tailwind `#ef4444` y la paleta antigua;
- `ProofStep.tsx`, con un `textShadow` hex.

**Heurística.** No todo hex fuera de CSS es un defecto funcional, pero contradice el principio de una única paleta y bloquea el cambio de tema cuando se usa en Canvas, Web Worker o JSXGraph.

**Recomendación.** Inventariar ahora; migrar en bloque solo después de fijar el design system. La excepción es `src/shared/lib/theme.ts`: debe marcarse como legado y retirarse en un refactor acotado del único consumidor, no ampliarse.

### 2.5 Componentes grandes y responsabilidades

**Hecho.** Archivos TS/TSX de producto de al menos 300 líneas:

| Archivo | Líneas | Señal principal |
| --- | ---: | --- |
| `features/graph/graph.worker.ts` | 516 | Algoritmo, adaptación de datos, estilos y protocolo worker |
| `shared/diagrams/Definiciones/Cuadrilatero.tsx` | 496 | 71 `any`, lifecycle y lógica geométrica |
| `shared/lib/glossaryDictionary.ts` | 483 | Dataset estático |
| `entities/content/ContentStore.ts` | 448 | Registro de 12 tipos y consultas |
| `entities/content/msc2020.ts` | 431 | Taxonomía/dataset |
| `features/editor/ui/EditorPage.tsx` | 425 | Orquestación, layout, formularios, Monaco y modales |
| `widgets/navigation/SearchOmnibar.tsx` | 408 | Indexación, búsqueda, teclado y presentación |
| `features/graph/ui/AxiomaticTree.tsx` | 366 | Estado, filtros, adaptación React Flow y paneles |
| `features/editor/hooks/useEditorActions.ts` | 345 | Persistencia, plantillas, comandos y Monaco |
| `widgets/content/MarginaliaPanel.tsx` | 344 | Panel complejo de navegación contextual |
| `shared/diagrams/Teoremas/DemoPitagorasEuclides.tsx` | 327 | Lógica geométrica y lifecycle |
| `features/progress/ui/TaxonomyGraph.tsx` | 301 | Canvas, navegación y progreso |

**Heurística.** `glossaryDictionary.ts` y `msc2020.ts` son grandes por volumen de datos; dividirlos no tiene el mismo retorno que separar un orquestador con efectos.

**Recomendación.** Priorizar por razones de cambio, no por líneas:

- editor: IO, estado, comandos y UI;
- grafo: cálculo, protocolo worker, navegación y render;
- diagramas: lifecycle, tema, store y geometría;
- omnibar: construcción del índice, motor de búsqueda y UI.

### 2.6 Diagramas

**Hecho.** `src/shared/diagrams/` contiene 82 TSX y 10.481 líneas.

**Hecho.**

- 55 diagramas definen su propio `getCSSVar`;
- 55 importan `useMathStore` desde `app`;
- 27 importan `useLessonStore` desde `features`;
- 11 importan `MathBoard` y 11 `MathFactory` desde `features/graph`;
- 51 inicializan JSXGraph directamente;
- 51 liberan el board explícitamente;
- 42 crean un `MutationObserver`;
- no existe una suite que monte diagramas y compruebe init/update/cleanup; la coincidencia de un import de diagrama en `mdxParser.test.ts` está dentro de texto de prueba.

**Hecho.** Existen tres bases parciales que se solapan:

- `shared/ui/JXGBoard.tsx`;
- `shared/ui/JSXGraphWrapper.tsx`;
- `features/graph/ui/MathBoard.tsx`.

Además, `shared/diagrams/types/jxg.ts` sigue exponiendo index signatures y métodos con `any`.

**Heurística.** El principal riesgo no es solo el tamaño: es la divergencia de lifecycle, tema, observers y tipos entre 82 implementaciones.

**Recomendación.** No migrar 82 diagramas de una vez. Diseñar una fachada canónica, probarla con dos diagramas representativos y medir:

- init una sola vez bajo `StrictMode`;
- cleanup de board y observers;
- reacción al tema;
- lectura/escritura de estado mediante puertos tipados;
- ausencia de imports hacia capas superiores desde el núcleo compartido.

### 2.7 Editor y hooks

**Hecho.** La feature editor no tiene cobertura en la ejecución actual. `test:coverage` muestra 0 % para hooks, librerías y UI del editor.

**Hecho.** `EditorPage.tsx` recibe el retorno completo de `useEditorState`, pasa 25 dependencias aproximadas a `useEditorActions` y vuelve a desestructurar ambos objetos. Esta frontera amplifica el acoplamiento.

**Hecho.** `useEditorState` mezcla:

- estado de documento;
- temporizador de draft;
- IO HTTP;
- selección Monaco;
- estado de layout;
- estado de cinco modales;
- construcción de URL de preview.

**Hecho.** `useEditorActions` mezcla:

- guardado;
- carga de plantillas;
- generación de imports;
- comandos Monaco;
- generación de snippets;
- transformación de links y referencias;
- operaciones de metadatos.

**Hecho.** Hay componentes editor legacy que solo son alcanzables a través de un barrel sin consumidores:

- `EditorToolbar.tsx`;
- `ImportsPanel.tsx`;
- `MetadataPanel.tsx`;
- `PreviewPane.tsx`;
- `RefModal.tsx`;
- las versiones no modales de `LinkModal`, `NewFileWizard`, `BlocksGallery` y `ComponentGallery`.

**Hecho.** El editor puede producir contenido contrario a las reglas vigentes:

- `applyLink` inserta `[texto](ruta)` en vez de `ConceptLink`;
- el snippet `medieval-step` crea `ProofStep` sin `justificacion`;
- un prompt usa `mi_teorema.mdx`, no kebab-case;
- ofrece `dorado`, que no pertenece a la paleta permitida;
- el wizard activo y los handlers de metadata no comparten una fuente de verdad derivada de `schemas.ts`.

**Hecho.** La prueba de “Editor API Security Rules” replica una función local en el test; no ejecuta el plugin real de `vite.config.ts`. Además, el test considera escribible `shared/templates`, mientras que el POST real permite `database/content` y `shared/diagrams`.

**Recomendación.** Extraer primero lógica pura y contratos; después añadir tests de integración del API. El rediseño del wizard por niveles debe esperar al sistema pedagógico multinivel.

### 2.8 Grafo y navegación

**Hecho.** Existen al menos tres visualizaciones relacionadas pero con modelos y motores diferentes:

- `GraphPage`: grafo semántico con `react-force-graph-2d`;
- `AxiomaticTree`: grafo lógico con React Flow y Web Worker;
- `TaxonomyGraph`: grafo de progreso con canvas force graph.

**Heurística.** Las tres vistas no deben fusionarse solo por compartir la palabra “grafo”: tienen propósitos distintos. Sí deben compartir tipos de identidad, navegación, tokens y utilidades de canvas cuando la semántica coincida.

**Hecho.** `GraphPage` y `TaxonomyGraph` duplican patrones de color, hover, etiquetas, anillos de progreso y canvas.

**Hecho.** `knowledgeGraphBuilder.ts`:

- reconstruye recursivamente descendientes MSC dentro de la resolución de cada item;
- filtra silenciosamente enlaces cuyo nodo no existe;
- usa strings abiertos para `group`;
- no tiene tests directos.

**Hecho.** `graph.worker.ts`:

- declara `WorkerInput` dos veces mediante merging accidental;
- recibe `graphData: unknown` y lo convierte con cast sin validación runtime;
- usa estado global mutable `structure`;
- contiene cálculo, mapping React Flow y colores hex;
- no tiene tests directos.

**Hecho.** `GraphStore.ts`:

- mantiene una tabla global de promesas pendientes;
- no establece timeout ni maneja `worker.onerror`;
- no aplica versión/cancelación al resultado;
- lanza nuevos cálculos tras toggles sin impedir que una respuesta antigua sobrescriba una más reciente;
- no añade `.catch` en los caminos de actualización;
- no tiene tests directos.

**Heurística.** La sobrescritura fuera de orden es un riesgo de carrera plausible; no se ha reproducido como bug en esta auditoría.

**Hecho.** `SearchOmnibar.tsx` construye su índice una vez al importar el módulo. Esto es coherente con contenido estático de build, pero dificulta tests e invalida actualizaciones HMR del editor sin recarga completa.

**Hecho.** La navegación por teclado y rutas básicas tiene pruebas, pero la construcción del índice, filtros, selección de resultados, glosario/MSC y accesibilidad del diálogo no tienen cobertura específica.

### 2.9 Pruebas y cobertura

**Hecho.** La suite actual cubre especialmente:

- schemas Zod y metadata MDX;
- `ContentStore`;
- entidades de grafo;
- stores simples;
- utilidades de rutas y parser MDX;
- validadores Lean/bridge/contenido;
- routing básico;
- `ProofStep`/`ProofStepExpander`;
- un caso de búsqueda en Omnibar.

**Hecho.** La cobertura V8 observada:

| Métrica | Cobertura |
| --- | ---: |
| Statements | 14,53 % |
| Branches | 9,28 % |
| Functions | 15,92 % |
| Lines | 14,73 % |

**Hecho.** El alcance de cobertura solo incluye:

```text
src/features/**
src/entities/**
src/shared/lib/**
```

Por tanto, no mide `app`, `pages`, `widgets`, `shared/ui` ni `shared/diagrams`.

**Heurística.** El 14,53 % no representa “cobertura total del frontend”; tampoco debe usarse como objetivo único porque incluye JSON generados con 0 %.

**Recomendación.** Antes de imponer umbrales globales, separar suites y alcances:

1. dominio puro;
2. features con estado/IO;
3. componentes críticos;
4. adapters de librerías visuales;
5. tests de arquitectura;
6. smoke tests de rutas.

## 3. Problemas prioritarios

### P0 — Supresiones TypeScript en `GraphPage`

**Hecho.** Son 9 supresiones, todas en un archivo y sobre una librería que exporta tipos útiles.

**Impacto.** Una actualización de la librería o cambio de callbacks puede romper navegación, cámara o interacción sin que TypeScript lo detecte.

**Recomendación.** Resolver como primer refactor de producto.

### P0 — Guardrail FSD con falsos positivos y punto ciego

**Hecho.** El comando pasa con 166 warnings; 69 warnings de dos reglas son imports legítimos dentro de una misma slice, mientras 56 imports `shared → app` no se evalúan.

**Impacto.** Se normaliza el ruido y una regresión real no cambia el estado del comando.

**Recomendación.** Calibrar como segundo refactor y establecer una ratchet: la deuda existente puede quedar allowlisted temporalmente, pero ninguna inversión nueva debe entrar.

### P1 — Editor capaz de generar deuda semántica

**Hecho.** Links, `ProofStep`, IDs y colores pueden salir contrarios a reglas globales.

**Impacto.** La automatización acelera la creación de contenido inválido y traslada el coste a revisión posterior.

**Recomendación.** Extraer command builders puros, derivar opciones de contratos canónicos y añadir tests antes de ampliar el editor.

### P1 — Protocolo asíncrono del grafo sin control de concurrencia

**Hecho.** No hay request versioning, cancelación, timeout, `worker.onerror` ni tests del protocolo.

**Impacto.** Estados rápidos de usuario pueden terminar mostrando un cálculo antiguo o dejar `isLoading` bloqueado.

**Recomendación.** Separar protocolo y cálculo puro, validar mensajes y aceptar solo la última respuesta.

### P1 — Fundación de diagramas fragmentada

**Hecho.** 55 helpers de tema, 42 observers, tres wrappers parciales y 529 `any`.

**Impacto.** Cada corrección de lifecycle, tema o tipos debe repetirse en decenas de archivos.

**Recomendación.** Crear una fachada canónica y migrar dos pilotos; no hacer sustitución masiva.

### P2 — Cobertura insuficiente en zonas de alto cambio

**Hecho.** Editor, worker, builders de grafo, páginas y diagramas carecen de cobertura directa proporcional.

**Impacto.** Los componentes más costosos de modificar son precisamente los menos protegidos.

**Recomendación.** Añadir characterization tests antes de descomponer.

### P2 — Duplicación y código editor legacy

**Hecho.** Hay un barrel no consumido que mantiene vivas versiones antiguas de componentes.

**Impacto.** Dos implementaciones aparentan ser válidas, divergen y confunden cambios posteriores.

**Recomendación.** Confirmar ausencia de import dinámico, borrar en una tarea aislada y comprobar build/tests.

## 4. Problemas que NO conviene tocar todavía

### Hasta después del design system

No conviene ejecutar todavía:

- migración masiva de los 246 hex;
- cambio global de clases `bg-white`, sombras, radios o espaciados;
- unificación visual de `GraphPage`, `AxiomaticTree` y `TaxonomyGraph`;
- descomposición de componentes guiada por apariencia;
- rediseño de `MarginaliaPanel`, Omnibar, editor o paneles del grafo.

**Motivo.** Sin tokens semánticos definitivos —superficie, tinta, acento, estado, foco, selección, error, relación lógica— se sustituiría hardcoding por otro hardcoding.

**Sí conviene hacer antes.** Inventario, tests de comportamiento, aislamiento de renderers y retirada del único tema azul legado.

### Hasta después del sistema pedagógico multinivel

No conviene ejecutar todavía:

- rediseño completo de `WizardData`;
- introducir `level`, itinerarios o variantes de explicación en `ContentStore`;
- cambiar rutas y taxonomía para secuencias pedagógicas;
- fusionar lecciones, demostraciones, ejercicios y páginas conceptuales;
- generalizar UI de progreso a niveles aún no definidos;
- reescribir MDX o schemas para acomodar una hipótesis de niveles.

**Motivo.** Se fijaría una abstracción pedagógica antes de disponer del contrato del sistema multinivel.

**Sí conviene hacer antes.** Hacer que el editor respete el schema actual, extraer funciones puras, tipar IDs y cubrir generación de comandos.

### Deuda que debe esperar a evidencia de rendimiento

No conviene todavía:

- reemplazar `ContentStore`;
- cambiar Zustand por otra solución;
- sustituir React Flow, force graph o JSXGraph;
- rehacer el algoritmo de layout;
- dividir datasets estáticos solo por número de líneas.

**Motivo.** No hay perfil de bundle, CPU, memoria o interacción que justifique esos cambios.

## 5. Ranking de refactors recomendados

### Ranking resumido

| Puesto | Refactor | Prioridad | Coste | Herramienta |
| ---: | --- | --- | --- | --- |
| 1 | Tipar `GraphPage` y eliminar 9 `@ts-ignore` | P0 | 0,5–1 día | Codex |
| 2 | Calibrar el guardrail FSD y establecer ratchet | P0 | 1–2 días | Codex + aprobación ChatGPT |
| 3 | Extraer contratos puros del editor y cubrir generación | P1 | 2–3 días | Codex |
| 4 | Hacer robusto el protocolo Worker del grafo | P1 | 2–3 días | Codex |
| 5 | Crear fachada canónica de diagramas con dos pilotos | P1 | 3–5 días | Codex; Antigravity para validación visual |
| 6 | Retirar componentes editor legacy no consumidos | P2 | 0,5–1 día | OpenCode o Codex |
| 7 | Extraer y probar el índice de búsqueda/navegación | P2 | 1–2 días | Codex |
| 8 | Descomponer `EditorPage` y `AxiomaticTree` tras characterization tests | P2 | 3–5 días por componente | Codex |
| 9 | Migrar tokens visuales tras el design system | Diferida | 5–10 días por lotes | Antigravity + Codex |
| 10 | Adaptar editor/contenido al sistema multinivel | Diferida | Por definir | ChatGPT + Codex |

### Fichas accionables

#### 1. Tipar `GraphPage`

- **Objetivo:** eliminar las 9 supresiones y hacer explícitos tipos de ref, nodos, links y callbacks sin cambiar comportamiento.
- **Archivos probables:** `src/pages/GraphPage.tsx`; solo si resulta imprescindible, tipos de `src/features/graph/lib/knowledgeGraphBuilder.ts`; test existente de rutas.
- **Riesgo:** bajo. El mayor riesgo es elegir parámetros genéricos incompatibles con los tipos anidados de la librería.
- **Comandos de validación:** `npx eslint src/pages/GraphPage.tsx --max-warnings=0`, `npm run typecheck`, `npm run test -- tests/boundary/routes.test.tsx`, `npm run depcruise`, `npm run ai:review`, `git diff --check`.
- **Criterio de aceptación:** cero `@ts-*` y cero `any` nuevos en `GraphPage`; mismos grupos, rutas, fuerzas, colores y timings; diff acotado; comandos verdes salvo baseline documentada de `depcruise`.
- **Coste aproximado:** 0,5–1 día.
- **Herramienta:** Codex, porque el cambio es local, tipado y verificable.

#### 2. Calibrar FSD

- **Objetivo:** hacer que `depcruise` distinga deuda real, imports internos de slice, composition roots y regresiones nuevas.
- **Archivos probables:** `.dependency-cruiser.js`; opcionalmente un test de arquitectura dedicado bajo `tests/`; documentación operativa solo si cambia el contrato.
- **Riesgo:** medio. Convertir warnings a errores sin baseline puede bloquear todo el repositorio; aceptar excepciones demasiado amplias perpetúa la deuda.
- **Comandos de validación:** `npm run depcruise`, `npx depcruise src --output-type json`, `npm run typecheck`, `npm run test`, `npm run ai:review`, `git diff --check`.
- **Criterio de aceptación:** imports dentro de `features/editor` o `pages/Home` no se cuentan como cruces; los 6 cruces reales siguen visibles; `shared → app` queda cubierto; excepciones están enumeradas y no por regex global; una fixture/regla demuestra que una nueva inversión falla.
- **Coste aproximado:** 1–2 días, incluida decisión de arquitectura.
- **Herramienta:** Codex para configuración y fixtures; ChatGPT debe aprobar el contrato de capas antes del merge.

#### 3. Contratos puros del editor

- **Objetivo:** separar IO/React de transformaciones y asegurar que el editor genera IDs, links, colores y `ProofStep` válidos según las reglas actuales.
- **Archivos probables:** `src/features/editor/hooks/useEditorActions.ts`, `useEditorState.ts`, `lib/editorPaths.ts`, `lib/editorUtils.ts`, un nuevo módulo `lib/editorCommands.ts` y tests de editor.
- **Riesgo:** medio. Puede alterar contenido generado, drafts o selección Monaco.
- **Comandos de validación:** `npm run typecheck`, `npm run test -- tests/features/editor`, `npm run test -- tests/shared/mdxParser.test.ts`, `npm run depcruise`, `npm run ai:review`, `git diff --check`.
- **Criterio de aceptación:** funciones puras cubiertas; `ConceptLink` para conceptos; `ProofStep` con justificación; IDs kebab-case; colores limitados a tokens permitidos; respuestas HTTP no exitosas tratadas; comportamiento de draft caracterizado.
- **Coste aproximado:** 2–3 días.
- **Herramienta:** Codex. El sistema multinivel queda explícitamente fuera.

#### 4. Protocolo Worker robusto

- **Objetivo:** tipar y validar mensajes, evitar resultados fuera de orden y cerrar errores/pendientes.
- **Archivos probables:** `src/features/graph/graph.worker.ts`, `GraphStore.ts`, tipos de `entities/graph` si son autoridad adecuada y tests nuevos del worker/store.
- **Riesgo:** medio-alto. Afecta el grafo axiomático y persistencia de toggles.
- **Comandos de validación:** `npm run typecheck`, tests dirigidos de worker/store, `npm run test`, `npm run depcruise`, `npm run validate-graph`, `npm run ai:review`, `git diff --check`.
- **Criterio de aceptación:** una sola `WorkerInput`; validación o type guard para `graphData`; solo la última request actualiza estado; error libera `isLoading`; pending requests se resuelven/rechazan; tests simulan respuestas invertidas.
- **Coste aproximado:** 2–3 días.
- **Herramienta:** Codex.

#### 5. Fachada canónica de diagramas

- **Objetivo:** centralizar lifecycle, tema, tipos y puertos de interacción sin migración masiva.
- **Archivos probables:** `src/shared/diagrams/types/jxg.ts`, `utils/cssVar.ts`, uno de los wrappers compartidos; dos diagramas piloto pequeños; tests nuevos.
- **Riesgo:** alto si se generaliza demasiado pronto; medio con solo dos pilotos.
- **Comandos de validación:** `npm run typecheck`, tests del wrapper/pilotos, `npm run lint -- <rutas>` o ESLint dirigido, `npm run depcruise`, pruebas visuales en tema claro/oscuro, `npm run ai:review`, `git diff --check`.
- **Criterio de aceptación:** init/cleanup probado bajo `StrictMode`; observer desconectado; tokens vía `getCSSVar`; puertos tipados; reducción medible de `any`; cero cambio matemático o visual en pilotos.
- **Coste aproximado:** 3–5 días.
- **Herramienta:** Codex para runtime/tipos/tests; Antigravity para comparar interacción y aspecto en navegador.

#### 6. Retirar editor legacy

- **Objetivo:** eliminar componentes duplicados alcanzables solo desde el barrel no consumido.
- **Archivos probables:** `src/features/editor/ui/index.ts` y los nueve candidatos identificados; sin tocar la implementación activa salvo imports.
- **Riesgo:** bajo-medio por posibles imports dinámicos no detectados.
- **Comandos de validación:** `rg` de símbolos/rutas, `npm run typecheck`, `npm run test`, `npm run build`, `npm run depcruise`, `npm run ai:review`, `git diff --check`.
- **Criterio de aceptación:** ningún consumidor real eliminado; build y tests verdes; una sola implementación por modal/panel; reducción de módulos sin cambio visible.
- **Coste aproximado:** 0,5–1 día.
- **Herramienta:** OpenCode para la comprobación mecánica de referencias o Codex si se incluyen tests.

#### 7. Extraer índice de búsqueda

- **Objetivo:** separar `buildIndex`, Fuse y navegación de la UI del Omnibar.
- **Archivos probables:** `src/widgets/navigation/SearchOmnibar.tsx`; un módulo en la slice adecuada, posiblemente `features/search/lib`; tests del índice y selección.
- **Riesgo:** medio por rutas, glosario y HMR.
- **Comandos de validación:** `npm run typecheck`, tests de Omnibar/índice, `npm run test -- tests/boundary/cpt.test.tsx`, `npm run depcruise`, `npm run ai:review`, `git diff --check`.
- **Criterio de aceptación:** índice inyectable y testeable; mismos resultados/rutas; selección glosario y contenido cubierta; UI reduce responsabilidades; sin nuevo cruce FSD.
- **Coste aproximado:** 1–2 días.
- **Herramienta:** Codex.

#### 8. Descomponer orquestadores grandes

- **Objetivo:** separar coordinación, estado derivado y presentación en `EditorPage` y `AxiomaticTree`.
- **Archivos probables:** los dos componentes, hooks/lib de sus propias slices y tests de caracterización.
- **Riesgo:** medio-alto; ambos concentran efectos y estado interactivo.
- **Comandos de validación:** typecheck, tests dirigidos, suite completa, depcruise, smoke de rutas y comprobación visual, `ai:review`, `git diff --check`.
- **Criterio de aceptación:** cada extracción tiene una única razón de cambio; no se crean “utils” genéricas; comportamiento, foco, teclado, filtros, selección y layout permanecen; cobertura de ramas críticas aumenta.
- **Coste aproximado:** 3–5 días por componente, en tareas separadas.
- **Herramienta:** Codex; Antigravity solo para regresión visual.

#### 9. Migración de tokens tras design system

- **Objetivo:** sustituir hardcoding por tokens semánticos y una fuente de verdad compatible con Canvas/Worker/DOM.
- **Archivos probables:** `index.css`, `constants.ts`, `theme.ts`, grafos, timeline, ProofStep y diagramas por lotes.
- **Riesgo:** alto antes del diseño; medio después de aprobar tokens y estados.
- **Comandos de validación:** typecheck, tests, depcruise, búsqueda de hex con allowlist, snapshots/comparación visual claro-oscuro, contraste y `full-check` aplicable.
- **Criterio de aceptación:** hex solo en definición canónica/allowlist; Canvas y Worker reciben tokens serializables; no desaparecen estados semánticos; tema oscuro y contraste revisados.
- **Coste aproximado:** 5–10 días repartidos por zonas.
- **Herramienta:** Antigravity para sistema visual y regresión; Codex para migración tipada y validadores.

#### 10. Adaptación multinivel

- **Objetivo:** adaptar editor, schemas, rutas y UI al contrato pedagógico aprobado, no anticiparlo.
- **Archivos probables:** por definir tras la especificación; probablemente schemas, tipos, editor, stores, páginas y tests.
- **Riesgo:** muy alto sin contrato pedagógico.
- **Comandos de validación:** todos los validadores de contenido/producto aplicables, más tests específicos del contrato multinivel.
- **Criterio de aceptación:** niveles no se convierten en currículo; cada concepto sigue siendo autónomo; rutas exploratorias permanecen; schemas y editor comparten fuente de verdad.
- **Coste aproximado:** por definir mediante RFC y prototipo.
- **Herramienta:** ChatGPT para revisar coherencia pedagógica/arquitectónica; Codex para implementación; Antigravity para UX.

## 6. Primer refactor recomendado

### Tipar `src/pages/GraphPage.tsx` sin cambiar comportamiento

#### Por qué es primero

**Hecho.** Es el único archivo con supresiones TypeScript, la dependencia ya exporta los tipos necesarios y el cambio puede validarse sin decisiones de design system ni pedagogía.

**Heurística.** La tarea revelará si los tipos propios `GraphNode`/`GraphLink` representan correctamente los objetos mutados por force graph. Ese conocimiento reduce riesgo antes de tocar otros grafos.

#### Alcance exacto

- Tipar `graphRef` con `ForceGraphMethods`.
- Usar genéricos/tipos exportados de `react-force-graph-2d` para datos y callbacks.
- Tipar `highlightNodes` y `highlightLinks`.
- Adaptar handlers a las firmas de la librería sin ensanchar con `any`.
- Eliminar las 9 parejas de `eslint-disable`/`@ts-ignore`.
- No cambiar colores, fuerzas, delays, navegación, DOM ni layout.

#### No alcance

- No migrar hex.
- No extraer componentes.
- No cambiar `knowledgeGraphBuilder` salvo tipos estrictamente necesarios.
- No añadir una abstracción común con `TaxonomyGraph`.
- No tocar editor, diagramas, MDX, Lean ni generados.

#### Validación y aceptación

Se aplican la ficha 1 del ranking y, además:

```bash
rg -n "@ts-|\\bany\\b" src/pages/GraphPage.tsx
npx eslint src/pages/GraphPage.tsx --max-warnings=0
npm run typecheck
npm run test -- tests/boundary/routes.test.tsx
npm run depcruise
npm run ai:review
git diff --check
```

`rg` debe devolver vacío. `depcruise` puede conservar el baseline documentado de warnings, pero no aumentarlo.

## 7. Segundo refactor recomendado

### Calibrar `.dependency-cruiser.js` y fijar una ratchet FSD

#### Por qué es segundo

**Hecho.** Toda extracción posterior puede empeorar o mejorar FSD; el guardrail actual no permite medirlo con precisión.

#### Decisiones previas necesarias

ChatGPT debe aprobar:

1. capa de composición de MDX;
2. ubicación de contextos de matemáticas y plan de estudio;
3. política `widgets → features`;
4. si diagramas reciben estado por props/ports o pertenecen a una slice superior;
5. allowlist temporal con propietario y criterio de retirada.

#### Implementación mínima

- Evitar que “cross-feature” capture imports dentro de la misma feature.
- Evitar que `pages/Home` se marque por importar sus propios componentes.
- Incluir `app` entre capas prohibidas para `shared`.
- Separar reglas de excepción de reglas que representan violación.
- Añadir una comprobación pequeña que falle ante una inversión nueva.
- No mover código de producto en esta tarea.

#### Validación y aceptación

Se aplican la ficha 2 del ranking. El objetivo no es llegar a cero warnings artificialmente, sino obtener un informe pequeño, estable y accionable.

## 8. Riesgos por zona del proyecto

| Zona | Riesgo | Evidencia | Acción próxima | Dependencia temporal |
| --- | --- | --- | --- | --- |
| `app/providers` | Medio | Dos capas inferiores importan contextos de `app`; 55 diagramas adicionales también | Decidir puertos/ubicación al calibrar FSD | Ninguna |
| `pages/GraphPage` | Alto y acotado | 9 `@ts-ignore`, canvas, ref imperativo | Primer refactor | Ninguna |
| `pages` restantes | Bajo-medio | 0 tests directos; cobertura no instrumentada | Characterization por rutas críticas | Design system para cambios visuales |
| `widgets/navigation` | Medio-alto | Omnibar 408 líneas, estado/índice/teclado juntos | Extraer índice y tests | Ninguna |
| `widgets/content` | Medio | Marginalia grande y acoplada a glossary | Tests antes de dividir | Sistema pedagógico para rediseño |
| `features/editor` | Alto | 0 % cobertura, IO + Monaco + generación, código legacy | Contratos puros y tests | Multinivel para nuevo wizard |
| `features/graph` | Alto | Worker 516 líneas, carreras plausibles, 0 % en piezas centrales | Protocolo robusto y tests | Design system para colores |
| `features/exercises` | Medio-alto | Componentes interactivos sin cobertura; cruces a lessons/dynamic-vars | Characterization por componente | Multinivel para progresión |
| `features/progress` | Medio | Store probado; UI/grafo no | Probar navegación/progreso | Multinivel |
| `entities/content` | Medio-bajo | Buena cobertura; cast tras Zod fallido y clase extensa | Mantener; endurecer fronteras en tarea separada | Multinivel antes de nuevos campos |
| `entities/graph` | Bajo-medio | Entidad probada; generados fuera de edición | Mantener validadores | Ninguna |
| `shared/diagrams` | Muy alto | 82 archivos, 529 `any`, 55 imports a app, 42 observers | Fachada con dos pilotos | Design system para migración visual |
| `shared/ui` | Medio-alto | Composition root y shims en capa inferior | Decisión FSD | Pedagogía para bloques |
| `shared/lib` | Medio | Fuentes de color duplicadas; datasets grandes | Retirar tema legado; no dividir por tamaño | Design system |
| `vite.config.ts` editor API | Medio-alto | Escritura local, lógica no exportada, test duplicado divergente | Extraer plugin/test de integración | Ninguna |
| `tests` | Medio | Buen dominio, baja UI/efectos; cobertura parcial | Alcances y characterization | Ninguna |

## 9. Validaciones recomendadas por tipo de cambio

| Tipo de cambio | Validaciones mínimas | Validaciones adicionales |
| --- | --- | --- |
| Tipado local sin comportamiento | ESLint dirigido, `typecheck`, test relacionado, `depcruise`, `ai:review`, `diff --check` | Build si cambia frontera de librería |
| Límite FSD/configuración | `depcruise` texto y JSON, `typecheck`, tests, `ai:review`, `diff --check` | Fixture negativa de arquitectura |
| Store/hook | `typecheck`, tests unitarios de transiciones, suite relacionada, `depcruise` | Fake timers, errores y concurrencia |
| Worker | `typecheck`, tests de cálculo y protocolo, suite completa | Respuestas fuera de orden, error, timeout, fallback Node |
| Editor/IO | `typecheck`, tests de funciones puras y API real, parser MDX | Path traversal, cuerpo vacío, status HTTP, debounce |
| Componente React | `typecheck`, Testing Library, ruta smoke | Teclado, foco, cleanup, StrictMode |
| Grafo/canvas | `typecheck`, tests de builder/handlers, smoke de ruta | Rendimiento con dataset grande, resize, tema, navegación |
| Diagrama JSXGraph | Skill `diagrama`, `typecheck`, test init/update/cleanup, `depcruise` | Comparación visual claro/oscuro y móvil |
| Tokens/design system | búsqueda de hex con allowlist, `typecheck`, tests | contraste, snapshots y revisión Antigravity |
| Contenido/pedagogía | Skills correspondientes y validadores de contenido/Lean | Fuera del alcance de esta auditoría |

**Recomendación.** `npm run full-check` sigue siendo la validación final de cambios de producto, pero durante un refactor debe ejecutarse primero el test dirigido para obtener feedback rápido.

## 10. Plan de refactor en fases

### Fase A — Cerrar puntos ciegos pequeños

Duración aproximada: 2–3 días.

1. Tipar `GraphPage`.
2. Calibrar FSD y fijar baseline/ratchet.
3. Registrar métricas iniciales: supresiones, warnings FSD reales y `any` por frontera.

**Salida:** cero supresiones en producto y arquitectura medible.

### Fase B — Proteger editor y navegación

Duración aproximada: 3–5 días.

1. Extraer command builders del editor.
2. Añadir tests del contrato actual.
3. Retirar componentes editor legacy.
4. Extraer índice de Omnibar y probar rutas/selección.

**Salida:** automatización que no genera deuda conocida y navegación refactorizable.

### Fase C — Robustecer el grafo

Duración aproximada: 3–5 días.

1. Separar protocolo Worker de cálculo.
2. Añadir control de versión/error.
3. Probar `knowledgeGraphBuilder` y worker.
4. Medir antes de optimizar MSC/layout.

**Salida:** grafos resistentes a cambios rápidos y con lógica central cubierta.

### Fase D — Fundación de diagramas

Duración aproximada: 3–5 días para el piloto.

1. Elegir wrapper canónico.
2. Definir tipos/ports.
3. Migrar dos diagramas representativos.
4. Comparar lifecycle, `any`, imports FSD y visual.
5. Decidir si se escala por familias.

**Salida:** patrón probado, no una migración masiva.

### Fase E — Después del design system

1. Aprobar tokens semánticos.
2. Migrar colores por zona.
3. Unificar patrones visuales de grafos y UI donde la semántica coincida.
4. Revisar accesibilidad y temas.

### Fase F — Después del sistema pedagógico multinivel

1. Aprobar el contrato de niveles sin convertirlo en currículo.
2. Adaptar schemas y tipos.
3. Adaptar editor y tests.
4. Evolucionar progreso, navegación y presentación.

## 11. Prompt exacto recomendado para el primer refactor

```text
Actúa como arquitecto senior de TypeScript y React para Matematika.

Objetivo:
Tipar por completo la frontera entre src/pages/GraphPage.tsx y react-force-graph-2d, eliminando las 9 supresiones @ts-ignore sin cambiar ningún comportamiento observable.

Lee:
- AGENTS.md
- ai/current-state.md
- ai/goals/code-quality.md
- ai/context-packs/code-refactor.md
- ai/audits/code-quality-audit.md, secciones 3, 5.1 y 6
- src/pages/GraphPage.tsx
- src/features/graph/lib/knowledgeGraphBuilder.ts
- los tipos exportados por react-force-graph-2d
- tests/boundary/routes.test.tsx

Alcance permitido:
- src/pages/GraphPage.tsx
- src/features/graph/lib/knowledgeGraphBuilder.ts solo si es imprescindible ajustar tipos sin cambiar datos
- un test directamente relacionado solo si resulta necesario para caracterizar comportamiento

Prohibido:
- cambiar colores, fuerzas, delays, rutas, layout, labels o interacción
- refactorizar TaxonomyGraph, AxiomaticTree o cualquier diagrama
- tocar MDX, Lean, generados, scripts, package.json, lockfile, índices o informes
- introducir any, unknown casts innecesarios o nuevas supresiones TypeScript/ESLint

Implementación esperada:
1. Usa ForceGraphMethods y los tipos/genéricos exportados por react-force-graph-2d.
2. Tipa graphRef, graphData, callbacks, highlightNodes y highlightLinks.
3. Elimina las 9 parejas eslint-disable/@ts-ignore.
4. Conserva exactamente el comportamiento actual.
5. Mantén el diff mínimo.

Validación:
rg -n "@ts-|\\bany\\b" src/pages/GraphPage.tsx
npx eslint src/pages/GraphPage.tsx --max-warnings=0
npm run typecheck
npm run test -- tests/boundary/routes.test.tsx
npm run depcruise
npm run ai:review
git diff --check

Criterios de aceptación:
- rg no devuelve coincidencias
- typecheck y el test dirigido pasan
- depcruise no aumenta su baseline
- no hay cambio visual o de navegación
- solo se modifican archivos autorizados

Entrega:
- resumen del cambio
- decisiones de tipos
- archivos modificados
- validaciones con resultado
- deuda residual, sin ampliar el alcance
```

## 12. Qué información debe revisar ChatGPT antes de aprobar

### Para aprobar el primer refactor

1. Diff completo de `GraphPage.tsx`.
2. Que `ForceGraphMethods` procede de la versión instalada de `react-force-graph-2d`, no de una interfaz inventada.
3. Que los genéricos no duplican `NodeObject`/`LinkObject` ni ensanchan todo a `unknown`.
4. Que `highlightNodes` es un set de nodos y `highlightLinks` un set de links.
5. Que callbacks de click/hover/canvas aceptan las firmas reales de la librería.
6. Que no se han modificado colores, física, timings ni rutas.
7. Resultado exacto de `rg`, ESLint dirigido, typecheck, test de rutas, depcruise, ai:review y diff check.
8. Estado final de `git status --short`, confirmando ausencia de generados o archivos ajenos.

### Antes de aprobar el segundo refactor

1. Matriz de capas adoptada por Matematika, incluida la política de widgets.
2. Lista exacta de seis cruces cross-feature reales.
3. Lista de 56 imports `shared → app`.
4. Decisión sobre `MDXBlocks`, shims y diagramas.
5. Diferencia entre baseline permitido y regresión nueva.
6. Una prueba negativa que demuestre que una inversión nueva falla.
7. Confirmación de que no se ha “arreglado” el informe ocultando rutas con exclusiones amplias.

### Antes de aprobar fases posteriores

1. Characterization tests de la zona.
2. Métrica antes/después relevante: warnings reales, `any`, módulos, cobertura o tiempo.
3. Evidencia de comportamiento conservado.
4. Decisiones de design system o sistema multinivel ya aprobadas cuando apliquen.
5. Deuda residual y siguiente lote acotado.

## Conclusión

**Hecho.** Matematika no necesita una reescritura. Necesita convertir sus fronteras implícitas en contratos verificables.

**Recomendación.** El orden de mayor retorno es:

1. eliminar las supresiones de `GraphPage`;
2. recuperar señal útil en FSD;
3. proteger editor y worker con funciones puras y tests;
4. probar una base común de diagramas;
5. reservar la migración visual y la evolución pedagógica para cuando existan sus contratos.

Este orden reduce riesgo antes de aumentar abstracción y mantiene cada cambio pequeño, medible y reversible.
