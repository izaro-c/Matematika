# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-21

**Fase:** Reforma DiagramSpec v3 posterior a Fase 8, cerrada para los 55 diagramas `visual-exact`.

**Estado:** El editor usa DiagramSpec v3 como contrato vigente y conserva lectores v1/v2. Los 55 diagramas con autoría exacta están migrados canónicamente; los 29 `code-preview` continúan fuera de esta migración y mantienen TSX autoritativo.

## Roadmap de autoría

La matriz canónica es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). Las Fases 0–8 están cerradas. El informe reproducible del cierre es [`reports/editor-phase-8-quality-and-governance.md`](reports/editor-phase-8-quality-and-governance.md).

## Capacidades vigentes del editor

- El catálogo distingue documentos, diagramas, estado real y capacidad real; búsqueda, filtros, recientes y estados vacío/carga/error se verifican en navegador.
- La autoría MDX visual y Monaco comparten una sola fuente lossless. El outline, los formularios de bloques, la creación por tipo, enlaces semánticos, targets, preview publicado y diff estructural no introducen una segunda vía de persistencia.
- `parseEditorDocument` proyecta rangos de remark-mdx/ESTree sin serializar de nuevo el documento. CRUD, movimiento y metadatos producen mutaciones localizadas con fingerprint, bytes esperados y validación posterior.
- Los cambios amplios, destructivos o parciales exigen un diff vigente. Versiones esperadas, backups, conflicto `409`, recuperación de red, diálogo de navegación y `beforeunload` evitan escritura o descarte silencioso.
- Los diagramas usan `DiagramSpec v3`, una unión discriminada de `point`, `path`, `angle`, `region`, `mark`, `annotation` y `control`. Intersección, punto medio y proyección son puntos construidos y satisfacen cualquier slot con capacidad `point`.
- El registro semántico compartido gobierna capacidades y slots; schema, toolbar, inspector y validación rechazan referencias incompatibles y propiedades ajenas a cada variante.
- Renombrado, borrado transitivo, referencias, grupos, pasos y expresiones pasan por comandos de grafo reversibles. `visibleWhen`, sliders, anotaciones y viewport se persisten mediante eventos de interacción.
- El workbench presenta una sola navegación por tareas (`Diseñar`, `Secuencia`, `Enlaces MDX`, `Comprobar`, `Código TSX`), árbol de escena, lienzo flexible e inspector contextual. En móvil usa navegación inferior entre escena, lienzo y propiedades.
- La selección es inmediata para puntos, paths, regiones y anotaciones; Mayús permite selección múltiple tanto en el árbol como en el lienzo y copiar conserva el cierre de referencias.
- El panel izquierdo separa objetos, organización y configuración del diagrama. El catálogo de creación agrupa por intención y puede presentar una misma construcción en más de un grupo sin duplicar su semántica.
- Etiquetas nativas y vinculadas conservan tamaño, posición y desplazamiento. Las lecturas bajo el título pueden ocultarse, generarse automáticamente o componerse como valores e igualdades de dos o más etiquetas; el texto se deriva de sus nombres.
- Textos, fórmulas, etiquetas, paneles y variantes comparten plantillas con múltiples cálculos `{= expresión | precision: 2 | unit: "cm"}`. Cada valor decide unidad y precisión; `{value}` queda plegado como compatibilidad. El mismo parser protege KaTeX, deriva dependencias y participa en renombrado, copia y borrado transitivo.
- La interfaz del workbench se verificó en Chromium a 390×844, 1024×768, 1440×900 y 1600×1100, en claro y oscuro, sin overflow horizontal ni diagnósticos de consola.
- Los diálogos gestionan foco inicial, ciclo de Tab, Escape y restauración. Toolbar, tabs, bloques, enlaces, puntos y sliders tienen operación por teclado, nombres y roles accesibles; el foco global es visible.
- La paleta activa contiene exclusivamente los nueve tokens Arts & Crafts autorizados y los pares funcionales de temas claro/oscuro superan los contrastes AA comprobados.

## Arquitectura editorial vigente

- `leccion` ya no es un tipo de contenido. Los siete procedimientos de demostración viven en `database/content/methods/` como `type: "metodo"`, con IDs canónicos `metodo-*`; las URL antiguas `leccion-metodo-*` redirigen a `/metodo/metodo-*`.
- `proofMethod` referencia directamente una página `metodo-*` y los validadores comprueban tanto su existencia como su tipo.
- `ContentLayout` es el layout editorial general. Sustituye a `TriptychLayout`, `NotebookLayout`, `SimulationLayout` e `InteractiveLessonLayout`; `CodexLayout` permanece especializado para demostraciones.
- La sincronización texto-diagrama usa exclusivamente `MathStore`. `StepBind` y `StepSection` permiten vincular pasos desde cualquier MDX, con scopes independientes; `LessonStore`, `HighlightLink` y `SimSection` se eliminaron.
- Los métodos mantienen una proporción equilibrada texto-diagrama y el mismo marco canónico que las demás visualizaciones: borde sólido con radio de 20 px y acento semántico. Se verificaron los siete métodos a 390×844, 1024×768 y 1440×900, además de modo oscuro y redirects, sin errores ni desbordamiento horizontal.

## Métricas conservadoras

- MDX: 120/120 documentos del corpus con roundtrip byte a byte; 120 `fully-editable`, 0 parciales, 0 solo lectura, 0 no soportados y 0 regiones opacas. Esto no garantiza MDX externo al corpus.
- Diagramas: 84 finales; 55 `visual-exact` en v3, 29 `code-preview`, 0 inválidos y 37 componentes internos excluidos.
- Renderer: Poincaré, paralelogramo, ALA y Pitágoras pasan invariantes de escena, layout y screenshots diferenciados por tema. No existe baseline pixel-perfect.
- Rendimiento: el diff evita construir una LCS superior a 4.000.000 de celdas y cae a un hunk conservador. La fixture de 2.500 párrafos queda por debajo de 5 s con cobertura V8; el dato no es un SLA multiplataforma.
- Cobertura del editor: 292 pruebas; 61,76% líneas, 49,74% ramas, 46,97% funciones globales. Los pisos de riesgo son por subsistema y archivo; motor MDX 87,96% líneas / 63,67% ramas / 90,2% funciones, y guardas de `useEditorCore` 73,49% / 62,98% / 75,86%.

## Evidencia de cierre

- `npm run full-check`: PASS; lint, tipos, 102 archivos/971 pruebas, arquitectura, referencias, DAG, Lean, cobertura de contenido y bridge.
- Aceptación dirigida de diagramas: todas las matrices pasan; cubren schema/capacidades, puntos construidos, etiquetas, plantillas con varios cálculos, renderer, runtime, comandos de grafo, roundtrip y escena de estrés de 250 objetos.
- Catálogo: 84 finales, 55 `visual-exact`, 29 `code-preview`, 0 inválidos; `editor:diagrams:check`, `editor:diagrams:v3-check` y `diagram-usages:check` pasan.
- E2E del workbench: el flujo real 20 de la suite pasa en cuatro resoluciones, claro/oscuro y con gate de consola; edita una etiqueta, guarda, cierra y reabre el diagrama comprobando su persistencia y que no queden callbacks de resize sobre un board liberado. La suite declara 20 flujos totales.
- `npm run editor:release-check`: PASS; artefactos generados, roundtrip 120/120, lint dirigido, 170 unitarias, 79 integraciones, arquitectura, tipos, build, 292 pruebas con cobertura, E2E 18/18, regresión visual, referencias, DAG, Lean y bridge.
- Lint global: 0 errores y 473 advertencias históricas. El alcance amplio de diagramas queda en 114 advertencias; los módulos nuevos de plantillas, schema v3, comandos de grafo y workbench no añaden errores.
- Dependency Cruiser: 0 errores y 10 advertencias históricas.
- Lean: build de 12 trabajos, 66 nodos verificados y 9 bloques; 24/24 páginas y 25/25 demostraciones enlazadas. Los `sorry` de `PendingTheorems` y `PendingDemonstrations` siguen declarados y no se presentan como certificados.
- Los índices y el informe de deuda se regeneraron únicamente mediante `npm run ai:index` y `npm run ai:debt`.

## Deuda y límites explícitos

- Falta una sesión humana con NVDA, JAWS o VoiceOver. La evidencia actual cubre DOM, contraste, foco, teclado y Chromium automatizado.
- El lint global conserva 473 advertencias y el alcance amplio de diagramas 114. No hay errores aceptados, pero parser AST, ciclo de vida de JSXGraph, viewport y overlay KaTeX mantienen deuda de complejidad y tipado heredado.
- El build conserva `EditorPage` en 787,74 kB (211,70 kB gzip), `OrbitControls` en 900,76 kB y `MathFactory` en 989,43 kB, además del aviso de `eval` interno de JessieCode/JSXGraph.
- Las ramas del motor MDX y de las guardas de `useEditorCore` requieren más casos; la recalibración del gate registra la línea base real, no una mejora ficticia.
- Las referencias a conceptos todavía no publicados continúan como avisos y producen páginas “En construcción”. Dependency Cruiser mantiene 56 avisos de arquitectura históricos.
- Los 29 diagramas `code-preview` solo podrán migrar a autoría exacta con aceptación matemática individual.
- La regresión visual compara invariantes, tamaño y digests light/dark; no detecta toda variación subpíxel.

## Veredicto

`DIAGRAMSPEC V3 CERRADO PARA 55 VISUAL-EXACT — FULL-CHECK, ROUNDTRIP, MATRIZ SEMÁNTICA Y UI RESPONSIVE APROBADOS; 29 CODE-PREVIEW Y DEUDA DE LINT HISTÓRICA EXPLÍCITOS`
