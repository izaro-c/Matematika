# Reforma DiagramSpec v3 y workbench de diagramas

**Fecha:** 2026-07-21  
**Alcance:** `src/shared/diagrams/`, editor visual y los 55 diagramas previamente `visual-exact`.  
**Fuera de alcance:** revisión matemática individual de los 29 `code-preview`, MDX y Lean.

## Resultado

DiagramSpec v3 es el contrato vigente. La escena se modela con una unión discriminada de siete familias: `point`, `path`, `angle`, `region`, `mark`, `annotation` y `control`. Los lectores v1/v2 continúan disponibles exclusivamente como entrada de migración.

Los 55 componentes exactos se regeneraron canónicamente sin cambiar rutas, nombres de componente ni IDs públicos. El catálogo final contiene 84 diagramas: 55 `visual-exact`, 29 `code-preview` y 0 inválidos.

## Contrato semántico

- Intersección, punto medio y proyección son `PointObject` con una `definition` discriminada. Un punto medio puede ser extremo de segmento, centro de círculo o referencia de otra construcción.
- Perpendicular, paralela, bisectriz y extensión son construcciones de paths; los ángulos comparten barrido, dirección y marcador; las marcas comparten variante y parámetros; las etiquetas y demás textos son anotaciones con contenido y anclaje tipados.
- El registro de capacidades (`point`, `linear-support`, `segment`, `circle`, `measurable`, etc.) define los slots válidos y elimina listas incompatibles entre toolbar, inspector, schema y runtime.
- El schema rechaza cardinalidades erróneas, propiedades ajenas a la variante y referencias sin la capacidad solicitada. Un marcador cuadrado requiere una relación explícita de perpendicularidad.
- Definiciones, relaciones, anclajes y expresiones forman el grafo derivado. `dependencies`, `fixed` y extensiones semánticas duplicadas no se persisten en v3.

## Mutación, runtime y persistencia

- Renombrar reescribe referencias, relaciones, pasos, grupos y expresiones mediante el AST de expresiones.
- Borrar calcula dependientes transitivos, muestra el impacto y produce una cascada reversible. Duplicar y editar referencias conservan grupos y targets.
- `visibleWhen` se consume para puntos, elementos y sliders. Los cambios de puntos, sliders y anotaciones llegan al modelo persistente.
- La planificación de escena usa orden topológico O(V+E); una escena de 250 objetos evita validación cuadrática durante la construcción.
- Los fallos temporales de expresiones se deduplican. Se retiró además el atributo JSXGraph inválido `highlightColor` de labels, que generaba decenas de advertencias por frame; se conserva `highlightStrokeColor` y la variable CSS del resaltado.
- El acceso dinámico de JSXGraph queda detrás de un adaptador tipado compartido en selección y utilidades del runtime.

## Workbench

La interfaz deja de tener dos niveles de tabs. Una única barra organiza las tareas `Diseñar`, `Secuencia`, `Enlaces MDX`, `Comprobar` y `Código TSX`.

En `Diseñar`:

- el árbol de escena está a la izquierda, agrupado por capa, con búsqueda, visibilidad y bloqueo directos;
- el lienzo flexible y el catálogo buscable ocupan el centro;
- el inspector contextual está a la derecha y muestra el tipo semántico seleccionado;
- punto libre y selección son acciones inmediatas; el resto vive en un único catálogo, sin botones duplicados;
- etiquetas globales pasan al menú `Vista`; la creación de pasos vive únicamente en `Secuencia`;
- todos los controles primarios tienen un área táctil mínima de 44 px.

En móvil se muestra una sola vista y la navegación `Escena / Lienzo / Propiedades` queda en la parte inferior. El status de guardado se compacta sin solapar el contenido. En tablet y escritorio vuelven las tres columnas.

Los puntos construidos aparecen como `Punto · Punto medio`, `Punto · Intersección`, etc. en el árbol, y como `Punto construido` en el inspector. Las etiquetas nativas y vinculadas se pueden mostrar, ocultar, dimensionar, desplazar y anclar sin abandonar el editor visual.

La selección funciona sobre puntos, trazados, regiones y anotaciones. Mayús extiende la selección desde el lienzo y desde el árbol; copiar varios objetos incluye las referencias necesarias. El panel izquierdo separa inventario, organización y configuración general, mientras que el catálogo agrupa herramientas por intención y permite accesos cruzados sin crear tipos semánticos duplicados.

El inspector usa secciones planas y contextuales. Snap y magnetismo desaparecen cuando la movilidad elegida no puede consumirlos. Las etiquetas nativas exponen tamaño, posición y desplazamiento; las lecturas bajo el título pueden ocultarse, ser automáticas o formar igualdades de cualquier cardinalidad, siempre con texto derivado de las etiquetas.

Textos, fórmulas, etiquetas, paneles y variantes comparten un editor de plantillas. Un contenido admite varios cálculos independientes con `{= expresión | precision: 2 | unit: "cm"}`; el insertador visual permite elegir fórmula, unidad y decimales sin escribir la sintaxis. Las llaves KaTeX se preservan y `{value}` queda como compatibilidad plegada. Las expresiones incrustadas se validan, renderizan sin ruido temporal y participan en dependencias, renombrado por AST, copia y borrado transitivo.

## Evidencia reproducible

Comandos ejecutados:

```bash
npm run typecheck
npx vitest run <17 suites dirigidas de diagramas>
npm test -- --run
npm run editor:diagrams:check
npm run editor:diagrams:v3-check
npm run diagram-usages:check
MATEMATIKA_E2E_ONLY_FLOW=20 MATEMATIKA_E2E_KEEP_EVIDENCE=1 npm run editor:test:e2e
npm run full-check
```

Resultados:

- aceptación dirigida final: 12 archivos, 130 pruebas, 130 aprobadas, además de las matrices previas de la reforma;
- suite global: 102 archivos, 971 pruebas, 971 aprobadas;
- `full-check`: aprobado de extremo a extremo;
- catálogo: 84 finales, 55 exactos, 29 con preview de código, 0 inválidos;
- E2E focal: 390×844, 1024×768, 1440×900 y 1600×1100, claro y oscuro, sin overflow horizontal;
- el mismo flujo modifica una etiqueta, guarda, cierra y reabre el editor, verifica el valor persistido y exige una consola de navegador limpia, incluido el ciclo de vida de resize de JSXGraph;
- consola del workbench real: 0 errores y 0 advertencias;
- roundtrip canónico y checks v3/usos: aprobados.

Las capturas de la última ejecución se producen en el directorio temporal que imprime el E2E cuando `MATEMATIKA_E2E_KEEP_EVIDENCE=1`; no se versionan artefactos efímeros.

## Deuda explícita

El gate global admite advertencias históricas. El alcance amplio de diagramas registra 114 advertencias de lint, igual que la auditoría inicial; los módulos nuevos de plantillas, schema v3 y comandos de grafo quedan limpios, pero `useBoardLifecycle`, `MathBoard`, viewport, overlay KaTeX y el parser AST aún concentran complejidad y `any` heredados. El `full-check` pasa porque el repositorio no trata advertencias como errores. Esta deuda no invalida el contrato ni las pruebas funcionales, pero impide afirmar “cero advertencias” para todo el subsistema.

Los 29 `code-preview` mantienen implementaciones especiales y deberán convertirse uno a uno con aceptación matemática y visual propia.
