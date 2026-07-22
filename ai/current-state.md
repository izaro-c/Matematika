# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-22

**Fase:** Refactor del workbench de diagramas posterior al cierre DiagramSpec v3 (Fase 8).

**Estado:** El editor usa DiagramSpec v3 como contrato vigente y conserva lectores v1/v2. El workbench vive en `src/features/editor/diagrams/ui/` con inspector modular, primitivos compartidos y hooks `useWorkbenchActions` / `useWorkbenchKeyboard`. El catálogo reporta 56 diagramas `visual-exact` y 28 `code-preview`; los 29 históricos `code-preview` pueden haber cambiado de categoría en un caso.

## Roadmap de autoría

La matriz canónica es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). Las Fases 0–8 están cerradas. El informe reproducible del cierre es [`reports/editor-phase-8-quality-and-governance.md`](reports/editor-phase-8-quality-and-governance.md). La validación post-refactor del workbench está en [`reports/diagram-editor-final-validation.md`](reports/diagram-editor-final-validation.md).

## Capacidades vigentes del editor

- El catálogo distingue documentos, diagramas, estado real y capacidad real; búsqueda, filtros, recientes y estados vacío/carga/error se verifican en navegador.
- La autoría MDX visual y Monaco comparten una sola fuente lossless. El outline, los formularios de bloques, la creación por tipo, enlaces semánticos, targets, preview publicado y diff estructural no introducen una segunda vía de persistencia.
- `parseEditorDocument` proyecta rangos de remark-mdx/ESTree sin serializar de nuevo el documento. CRUD, movimiento y metadatos producen mutaciones localizadas con fingerprint, bytes esperados y validación posterior.
- Los cambios amplios, destructivos o parciales exigen un diff vigente en el motor MDX; en `EditorPage` el guardado es directo y el flujo de revisión de diff queda desconectado (botón deshabilitado) hasta reconectar `EditorDiffController`.
- Los diagramas usan `DiagramSpec v3`, una unión discriminada de `point`, `path`, `angle`, `region`, `mark`, `annotation` y `control`. Intersección, punto medio y proyección son puntos construidos y satisfacen cualquier slot con capacidad `point`.
- El registro semántico compartido gobierna capacidades y slots; schema, toolbar, inspector y validación rechazan referencias incompatibles y propiedades ajenas a cada variante. `validation.ts` consume constantes exportadas desde `shared/diagrams/spec`.
- Renombrado, borrado transitivo, referencias, grupos, pasos y expresiones pasan por comandos de grafo reversibles. `visibleWhen`, sliders, anotaciones y viewport se persisten mediante eventos de interacción.
- El workbench presenta una sola navegación por tareas (`Diseñar`, `Secuencia`, `Enlaces MDX`, `Comprobar`, `Código TSX`), árbol de escena, lienzo flexible e inspector contextual descompuesto (`inspector/`). En móvil usa navegación inferior entre escena, lienzo y propiedades.
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
- Diagramas: 84 finales; 56 `visual-exact` en v3, 28 `code-preview`, 0 inválidos y 38 componentes internos excluidos (`editor:diagrams:check`, 2026-07-22).
- Subsistema diagramas: 336 pruebas en `tests/features/editor/diagrams/` (36 archivos), todas PASS.
- Renderer: Poincaré, paralelogramo, ALA y Pitágoras pasan invariantes de escena, layout y screenshots diferenciados por tema. No existe baseline pixel-perfect.
- Rendimiento: el diff evita construir una LCS superior a 4.000.000 de celdas y cae a un hunk conservador. La fixture de 2.500 párrafos queda por debajo de 5 s con cobertura V8; el dato no es un SLA multiplataforma.
- Cobertura del editor: cifras de la línea base Fase 8 pendientes de recalibrar tras el refactor; el gate global no se completó en esta validación.

## Evidencia de cierre (2026-07-22)

- `npm test -- tests/features/editor/diagrams/`: PASS (336/336).
- `npm run editor:diagrams:check`: PASS (56 visual-exact, 28 code-preview, 0 inválidos).
- `npm run editor:diagrams:v3-check`: PASS (56 canónicos, 0 pendientes).
- `npm run lint`: PASS (0 errores, ~487 advertencias históricas).
- `npm run typecheck`: PASS.
- `npm run full-check`: **FAIL** — 11 pruebas del motor MDX lossless fallan también en `HEAD` sin cambios locales; ver [`reports/diagram-editor-final-validation.md`](reports/diagram-editor-final-validation.md).

## Deuda y límites explícitos

- Falta una sesión humana con NVDA, JAWS o VoiceOver. La evidencia actual cubre DOM, contraste, foco, teclado y Chromium automatizado.
- El lint global conserva ~487 advertencias; el alcance amplio de diagramas mantiene deuda de complejidad y tipado heredado en parser AST, ciclo de vida de JSXGraph, viewport y overlay KaTeX.
- **11 tests del editor MDX** (`useEditorCore`, fases 6–7, `diagnosticNavigation`) bloquean `full-check`; incluyen `requiresReview` ausente en planes de mutación, `navigationTargetForHunk` no exportada y `saveCurrentFile` que devuelve `false` en escenarios de integración.
- **Diff review desconectado** en `EditorPage`: guardado directo; `EditorDiffController` sin cablear; botones de revisión deshabilitados en UI de seguridad.
- El build conserva chunks pesados (`EditorPage`, `OrbitControls`, `MathFactory`) y el aviso de `eval` interno de JessieCode/JSXGraph.
- Los diagramas `code-preview` solo podrán migrar a autoría exacta con aceptación matemática individual.
- La regresión visual compara invariantes, tamaño y digests light/dark; no detecta toda variación subpíxel.

## Veredicto

`WORKBENCH DE DIAGRAMAS REFACTORIZADO Y VALIDADO — 336 PRUEBAS, V3-CHECK Y TYPECHECK OK; FULL-CHECK BLOQUEADO POR 11 TESTS MDX PREEXISTENTES Y DIFF REVIEW SIN RECONECTAR`
