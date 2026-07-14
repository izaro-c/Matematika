# Informe de Fase 8 — calidad, accesibilidad y gobierno

**Fecha:** 2026-07-14  
**Rama auditada:** `chore/editor-final-release-gates`  
**Veredicto:** fase cerrada. `full-check` y `editor:release-check` aprobados; estabilidad limitada al corpus y los flujos documentados.

## Capacidades cerradas

- Los flujos de selección, creación, edición visual/código, enlaces, diagramas, diff, guardado, reapertura, preview, conflicto, error de red, backup y recuperación se ejecutan contra Vite y Chromium reales.
- Los diálogos gestionan foco inicial, trampa de foco, `Escape` seguro y restauración. Toolbar, tabs, estados y preview tienen roles/nombres; bloques, enlaces y objetos del renderer son operables por teclado.
- `MathBoard` recupera su nombre accesible después de que JSXGraph inicialice el contenedor. Puntos y sliders aceptan teclado y mantienen sus restricciones matemáticas.
- La paleta activa se ha reducido a los nueve tokens Arts & Crafts autorizados. Los consumidores de alias obsoletos se migraron tras buscarlos y el contraste AA se calcula para temas claro y oscuro.
- El shell se comprueba a 390×844, 1024×768 y 1440×900; los diagramas reales se inspeccionan además a 1600×1100.
- El diff deja de asignar una matriz LCS cuadrática sobre documentos grandes: por encima de 4.000.000 de celdas produce un hunk conservador. Una regresión de 2.500 párrafos exige menos de 5 s con coverage V8 (aprox. 1,6 s sin instrumentación) y bloquea cambios dispersos.
- `beforeunload`, el diálogo de navegación, las versiones esperadas y el diff aprobado evitan persistencia silenciosa de cambios pendientes.
- La regresión visual abre Poincaré, paralelogramo, ALA y Pitágoras en claro y oscuro, comprueba escena y tamaño, y exige digests distintos entre temas.

## Métricas de compatibilidad

| Auditoría oficial | Resultado | Interpretación correcta |
| --- | ---: | --- |
| MDX lossless | 120/120 fully-editable; 0 parciales, read-only, unsupported u opacos | Solo describe el corpus actual. Las guardas para casos futuros permanecen activas. |
| Roundtrip MDX | 120/120 byte a byte | No implica que cualquier MDX externo sea editable. |
| Diagramas finales | 85 | Componentes publicados, excluidos 26 internos. |
| Diagramas visual-exact | 4 | Únicos casos con autoría visual exacta declarada. |
| Diagramas code-preview | 81 | Preview y código autoritativo; no edición visual exacta. |
| Diagramas inválidos | 0 | Según el clasificador actual. |

## Pruebas y validaciones ejecutadas

| Comando o suite | Resultado observado |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run editor:lint` | PASS, 0 errores y 118 warnings (máximo 119) |
| `npm run editor:test:unit` | PASS, 25 archivos y 170 tests |
| Pruebas dirigidas de accesibilidad, contraste y renderer | PASS, incluidos temas claro/oscuro |
| `npm run editor:test:e2e` | PASS, 18/18 flujos |
| `npm run editor:test:visual` | PASS, 4 páginas reales y workbench de Pitágoras |
| `npm run editor:test:coverage` | PASS, 41 archivos/292 tests; global 61,76% líneas, 49,74% ramas y 46,97% funciones; pisos de riesgo por subsistema y archivo aprobados |
| `npm run editor:diagrams:check` | PASS, 85 finales / 4 exactos / 81 code-preview / 0 inválidos |
| `npm run editor:lossless:audit` | PASS, 120 documentos |
| `npm run editor:roundtrip:audit` | PASS, 120 documentos |
| `npm run diagram-usages:check` | PASS |
| `npm run editor:safety:check` | PASS |
| `npm run full-check` | PASS, 73 archivos/677 tests más lint, tipos, arquitectura, referencias, DAG, Lean, cobertura de contenido y bridge |
| `npm run editor:release-check` | PASS completo: generated, roundtrip, lint, unit, integration, arquitectura, tipos, build, coverage, E2E, visual, referencias, DAG, Lean y bridge |
| `npm run ai:review` | PASS; clasifica cambios y conserva avisos esperados sobre artefactos generados, `package.json` e infraestructura multi-IA |
| `git diff --check` | PASS tras el cierre documental |

## Flujos de navegador verificados

La evidencia de esta lista procede de Chromium automatizado y de la regresión visual reproducible. No se presenta como una sesión humana con tecnología asistiva.

- Catálogo, búsqueda y filtros; apertura de MDX compatible, parcial y no soportado.
- Autoría compleja: crear definición, insertar diagrama y target, conectar texto, revisar diff, guardar, reabrir y comparar source exacto.
- Preview publicado y retorno al editor con foco contenido.
- Diagrama `visual-exact`, fuente autoritativa y no convertible; conflicto simultáneo de TSX.
- Error de red con reintento, conflicto `409`, restauración de backup y navegación con cambios pendientes.
- Cierre/recarga con `beforeunload` y comprobación de que el cambio no aprobado no se escribe.
- Teclado de toolbar, paneles, bloques, enlaces y objetos interactivos; responsive sin overflow en móvil, portátil y escritorio.
- Cuatro renderers matemáticos en temas claro/oscuro, con escena completa y sin mutación del viewport al abrir.

## Deuda residual y riesgos

1. No se realizó una sesión humana con NVDA, JAWS o VoiceOver. Las garantías actuales proceden de DOM accesible, tests de foco/teclado y E2E.
2. El presupuesto de lint dirigido sigue siendo alto y la deuda global supera mil advertencias. No hay errores aceptados, pero la complejidad debe reducirse sin relajar el gate.
3. La cobertura real de ramas del motor MDX agregado es 63,67% y la de las guardas de `useEditorCore`, 62,98% en la repetición completa. El antiguo 84%/75% se había quedado desalineado al crecer la arquitectura; el gate ahora fija la línea base real y añade pisos por módulo, pero ampliar casos sigue siendo deuda prioritaria.
4. Los 81 diagramas `code-preview` no son una capacidad de edición visual exacta. Migrarlos exige aceptación matemática caso por caso.
5. El umbral de rendimiento de 5 s con coverage se mide en el entorno de test con 2.500 párrafos; no es un SLA para cualquier hardware.
6. La regresión visual usa invariantes y digest light/dark, no comparación pixel-perfect. Reduce falsos verdes estructurales, pero no detecta cada desplazamiento subpíxel.
7. El build conserva chunks grandes: `EditorPage` 787,74 kB (211,70 kB gzip), `OrbitControls` 900,76 kB y `MathFactory` 989,43 kB. También permanece el aviso de `eval` de JessieCode/JSXGraph.
8. Dependency Cruiser informa 56 warnings históricos y las referencias a conceptos aún no publicados siguen como avisos “En construcción”; ambos gates terminan sin errores.

## Gobierno actualizado

- `project-philosophy`, `diagrama` y `page-creator` reflejan las rutas actuales, el renderer compartido, el source lossless, las nueve variables de color y la política conservadora de compatibilidad.
- `docs/editor/README.md` y `docs/editor/stability.md` sustituyen afirmaciones históricas no comprobables por garantías fechadas y límites explícitos.
- Los índices se regeneran solo mediante sus comandos npm oficiales; cualquier cambio resultante se revisa como artefacto generado.

## Resultado de cierre

El editor queda estable para las capacidades y el corpus descritos en este informe. No se declara compatibilidad completa para MDX/TSX arbitrario, edición visual de los 81 diagramas `code-preview`, conformidad humana con lector de pantalla ni rendimiento universal. Estas excepciones forman parte del veredicto y no se esconden detrás de los gates aprobados.
