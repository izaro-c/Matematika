# Declaración de estabilidad del editor

**Fecha de cierre:** 2026-07-14 (veredicto); métricas vivas en [`ai/current-state.md`](../../ai/current-state.md).
**Alcance:** corpus y arquitectura presentes en el repositorio; no MDX o TSX arbitrario.

## Veredicto

El editor queda estable para los flujos comprobados de autoría, revisión y recuperación. La estabilidad no significa edición visual universal: el catálogo mezcla `visual-exact` y `code-preview` deliberados; un documento futuro puede clasificarse como parcial, solo lectura o no soportado.

El cierre del 2026-07-14 aprobó `npm run full-check` y `npm run editor:release-check` (E2E + regresión visual). Conteos actuales: `npm run editor:diagrams:check` / `ai/current-state.md`.

| Subsistema | Estado | Evidencia | Límite explícito |
| --- | --- | --- | --- |
| Motor MDX | Estable en corpus | Roundtrip exacto + metadata válida del corpus | No cubre sintaxis externa al corpus. |
| Compatibilidad visual | Conservadora | Clasificación por documento + guardas | Se recalcula por documento. |
| Persistencia | Estable | Integración + E2E de red, 409, backup y reintento | Backend local de Vite; resolución de conflicto manual. |
| Protección de datos | Estable | Diff vigente, rangos, diálogo de navegación y `beforeunload` | No hay autosave automático. |
| Diagramas | Estable con capacidad desigual | `editor:diagrams:check` | Solo `visual-exact` admite roundtrip visual. |
| Renderer compartido | Estable en casos de aceptación | Páginas reales + invariantes/digest | No baseline pixel-perfect. |
| Accesibilidad | Verificada automáticamente | Foco modal, teclado, roles, contraste AA | Falta sesión humana con lector de pantalla. |
| Responsive | Verificado | 390×844 … 1600×1100 | Monaco/JSXGraph orientados a escritorio. |
| Rendimiento del diff | Protegido | Presupuesto LCS de 4 M de celdas | No es un SLA multiplataforma. |

## Deuda aceptada

- `editor:lint` conserva presupuesto histórico de advertencias; complejidad de parser/generador a reducir de forma incremental.
- Cobertura del editor: pisos por archivo; ramas siguen siendo deuda prioritaria (recalibrar tras refactors).
- Lint global histórico fuera del gate de error.
- Validación de lector de pantalla automatizada; falta pasada humana.
- Diagramas `code-preview`: previsualizables, no editables visualmente con roundtrip exacto.
- Chunks grandes de build y aviso `eval` interno de JessieCode/JSXGraph.
- Referencias a conceptos sin página y avisos históricos de Dependency Cruiser sin error de gate.

Baselines: `ai/reports/editor-roundtrip-baseline.*` y `ai/reports/editor-lossless-compatibility.*` (`editor:roundtrip:*` / `editor:lossless:*`).
