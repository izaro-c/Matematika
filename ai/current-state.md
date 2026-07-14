# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-14

**Fase:** Fase 8 — calidad, accesibilidad y gobierno, cerrada.

**Estado:** La épica de autoría del editor (Fases 0–8) está cerrada para el corpus y los flujos comprobados. El cierre no declara edición visual universal: el source MDX/TSX continúa siendo la autoridad, la compatibilidad se calcula de forma conservadora y 81 diagramas permanecen expresamente en `code-preview`.

## Roadmap de autoría

La matriz canónica es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). Las Fases 0–8 están cerradas. El informe reproducible del cierre es [`reports/editor-phase-8-quality-and-governance.md`](reports/editor-phase-8-quality-and-governance.md).

## Capacidades vigentes del editor

- El catálogo distingue documentos, diagramas, estado real y capacidad real; búsqueda, filtros, recientes y estados vacío/carga/error se verifican en navegador.
- La autoría MDX visual y Monaco comparten una sola fuente lossless. El outline, los formularios de bloques, la creación por tipo, enlaces semánticos, targets, preview publicado y diff estructural no introducen una segunda vía de persistencia.
- `parseEditorDocument` proyecta rangos de remark-mdx/ESTree sin serializar de nuevo el documento. CRUD, movimiento y metadatos producen mutaciones localizadas con fingerprint, bytes esperados y validación posterior.
- Los cambios amplios, destructivos o parciales exigen un diff vigente. Versiones esperadas, backups, conflicto `409`, recuperación de red, diálogo de navegación y `beforeunload` evitan escritura o descarte silencioso.
- Los diagramas usan el renderer compartido. Cuatro casos tienen autoría `visual-exact`; el resto conserva TSX autoritativo con preview, sin fingir roundtrip visual.
- La interfaz responde a 390×844, 1024×768 y 1440×900. Las páginas de aceptación del renderer también se verifican a 1600×1100 y en temas claro/oscuro.
- Los diálogos gestionan foco inicial, ciclo de Tab, Escape y restauración. Toolbar, tabs, bloques, enlaces, puntos y sliders tienen operación por teclado, nombres y roles accesibles; el foco global es visible.
- La paleta activa contiene exclusivamente los nueve tokens Arts & Crafts autorizados y los pares funcionales de temas claro/oscuro superan los contrastes AA comprobados.

## Métricas conservadoras

- MDX: 120/120 documentos del corpus con roundtrip byte a byte; 120 `fully-editable`, 0 parciales, 0 solo lectura, 0 no soportados y 0 regiones opacas. Esto no garantiza MDX externo al corpus.
- Diagramas: 85 finales; 4 `visual-exact`, 81 `code-preview`, 0 inválidos y 26 componentes internos excluidos. El índice de usos generado contiene 84 componentes con usos indexables.
- Renderer: Poincaré, paralelogramo, ALA y Pitágoras pasan invariantes de escena, layout y screenshots diferenciados por tema. No existe baseline pixel-perfect.
- Rendimiento: el diff evita construir una LCS superior a 4.000.000 de celdas y cae a un hunk conservador. La fixture de 2.500 párrafos queda por debajo de 5 s con cobertura V8; el dato no es un SLA multiplataforma.
- Cobertura del editor: 292 pruebas; 61,76% líneas, 49,74% ramas, 46,97% funciones globales. Los pisos de riesgo son por subsistema y archivo; motor MDX 87,96% líneas / 63,67% ramas / 90,2% funciones, y guardas de `useEditorCore` 73,49% / 62,98% / 75,86%.

## Evidencia de cierre

- `npm run full-check`: PASS; lint, tipos, 73 archivos/677 pruebas, arquitectura, referencias, DAG, Lean, cobertura de contenido y bridge.
- `npm run editor:release-check`: PASS; artefactos generados, roundtrip 120/120, lint dirigido, 170 unitarias, 79 integraciones, arquitectura, tipos, build, 292 pruebas con cobertura, E2E 18/18, regresión visual, referencias, DAG, Lean y bridge.
- `editor:lint`: 0 errores y 118 advertencias, por debajo del máximo 119.
- Dependency Cruiser: 0 errores y 56 advertencias históricas.
- Lean: build de 12 trabajos, 66 nodos verificados y 9 bloques; 24/24 páginas y 25/25 demostraciones enlazadas. Los `sorry` de `PendingTheorems` y `PendingDemonstrations` siguen declarados y no se presentan como certificados.
- Los índices y el informe de deuda se regeneraron únicamente mediante `npm run ai:index` y `npm run ai:debt`.

## Deuda y límites explícitos

- Falta una sesión humana con NVDA, JAWS o VoiceOver. La evidencia actual cubre DOM, contraste, foco, teclado y Chromium automatizado.
- El lint global conserva más de mil advertencias y el editor 118. No hay errores aceptados, pero parser, generador, efectos React y componentes grandes mantienen deuda de complejidad.
- El build conserva `EditorPage` en 787,74 kB (211,70 kB gzip), `OrbitControls` en 900,76 kB y `MathFactory` en 989,43 kB, además del aviso de `eval` interno de JessieCode/JSXGraph.
- Las ramas del motor MDX y de las guardas de `useEditorCore` requieren más casos; la recalibración del gate registra la línea base real, no una mejora ficticia.
- Las referencias a conceptos todavía no publicados continúan como avisos y producen páginas “En construcción”. Dependency Cruiser mantiene 56 avisos de arquitectura históricos.
- Los 81 diagramas `code-preview` solo podrán migrar a autoría exacta con aceptación matemática individual.
- La regresión visual compara invariantes, tamaño y digests light/dark; no detecta toda variación subpíxel.

## Veredicto

`FASE 8 CERRADA — RELEASE-CHECK Y FULL-CHECK APROBADOS; ESTABILIDAD LIMITADA AL CORPUS Y FLUJOS DOCUMENTADOS, CON DEUDA RESIDUAL EXPLÍCITA`
