# Declaración de estabilidad del editor

**Fecha:** 2026-07-14
**Alcance:** corpus y arquitectura presentes en el repositorio; no MDX o TSX arbitrario.

## Veredicto

El editor queda estable para los flujos comprobados de autoría, revisión y recuperación. La estabilidad no significa edición visual universal: 4 diagramas son `visual-exact` y 81 permanecen deliberadamente en `code-preview`; un documento futuro puede clasificarse como parcial, solo lectura o no soportado.

El cierre del 2026-07-14 aprobó tanto `npm run full-check` como `npm run editor:release-check`, incluidos 18/18 flujos E2E y la regresión visual de cuatro páginas reales.

| Subsistema | Estado | Evidencia | Límite explícito |
| --- | --- | --- | --- |
| Motor MDX | Estable en corpus | 120/120 roundtrip exacto y metadata válida | La métrica no cubre sintaxis externa al corpus. |
| Compatibilidad visual | Conservadora | 120 fully-editable; guardas para los otros tres estados | La clasificación se recalcula por documento. |
| Persistencia | Estable | Integración + E2E de red, 409, backup y reintento | Backend local de Vite; resolución de conflicto manual. |
| Protección de datos | Estable | Diff vigente, rangos esperados, diálogo de navegación y `beforeunload` | No hay autosave automático. |
| Diagramas | Estable con capacidad desigual | 85 finales: 4 visual-exact, 81 code-preview, 0 inválidos | No se regenera código manual complejo. |
| Renderer compartido | Estable en casos de aceptación | Cuatro páginas reales, screenshots light/dark y conteos estructurales | Regresión por invariantes/digest, no baseline pixel-perfect. |
| Accesibilidad | Verificada automáticamente | Foco modal, teclado, roles, nombres y contraste AA claro/oscuro | Falta sesión humana con lector de pantalla. |
| Responsive | Verificado | 390×844, 1024×768, 1440×900 y 1600×1100 | Monaco/JSXGraph siguen orientados a autoría avanzada de escritorio. |
| Rendimiento del diff | Protegido | 2.500 párrafos; presupuesto LCS de 4 M de celdas | Umbral de 5 s con coverage; ~1,6 s sin instrumentar. No es un SLA multiplataforma. |

## Deuda aceptada

- `editor:lint` conserva un presupuesto histórico de 119 advertencias; esta fase lo deja por debajo del máximo, sin errores. La complejidad del parser/generador y algunos efectos React deben reducirse de forma incremental.
- El gate de cobertura se recalibró contra la arquitectura estructural real: motor MDX 87,96% líneas / 63,67% ramas / 90,2% funciones; guardas de `useEditorCore` 73,49% / 62,98% / 75,86% en la repetición completa. Se añadieron pisos por archivo para impedir que el agregado oculte módulos débiles. Las ramas siguen siendo deuda prioritaria.
- El lint global informa más de mil advertencias históricas en todo el repositorio. El gate global no las trata como error, pero no se presentan como deuda resuelta.
- La validación de lector de pantalla es semántica y automatizada; falta una pasada manual con tecnología asistiva real.
- Los 81 diagramas `code-preview` son funcionales y previsualizables, pero no visualmente editables con roundtrip exacto.
- El build todavía genera chunks grandes (`EditorPage` 787,74 kB, `OrbitControls` 900,76 kB y `MathFactory` 989,43 kB) y conserva el aviso de `eval` interno de JessieCode/JSXGraph.
- Las referencias a conceptos sin página publicada y 56 avisos históricos de Dependency Cruiser siguen visibles aunque sus gates no registran errores.

El detalle reproducible de comandos, resultados y riesgos está en `ai/reports/editor-phase-8-quality-and-governance.md`.
