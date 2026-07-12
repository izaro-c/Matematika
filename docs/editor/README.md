# Editor de Matematika

Este documento es la referencia operativa para mantener el editor MDX y el workbench de diagramas. Los ADRs explican las decisiones; este README explica cómo ejecutar, auditar y extender los gates de calidad instalados.

## Estado operativo

La estabilización de la épica del editor está completada y validada en su totalidad (Fases 0-8). El editor cuenta con soporte transaccional completo, control de compatibilidad, diff interactivo, y suite de pruebas unitarias, de integración y E2E que previenen regresiones críticas en CI de forma permanente.

## Arquitectura

| Área | Ruta | Responsabilidad |
| --- | --- | --- |
| Documento lossless | `src/features/editor/document/` | Parseo, envelope, proyección visual, parches localizados y compatibilidad. |
| Orquestación | `src/features/editor/core/useEditorCore.ts` | Apertura, modo código/visual, estado local, guardado manual y coordinación con persistencia. |
| Persistencia | `src/features/editor/persistence/` | Cliente tipado, repositorios, errores discriminados y coordinador latest-wins. |
| Estado | `src/features/editor/state/` | Reducer de persistencia y estados visibles. |
| UI | `src/features/editor/ui/` | Shell, toolbar, navegación y paneles. No debe acceder directamente a filesystem ni hacer `fetch`. |
| Diagramas | `src/features/editor/diagrams/` | Modelo, parser/generador TSX, reducer, índice inverso y UI del workbench. |
| Backend dev | `vite.config.ts` y `scripts/editor/editorPersistenceBackend.ts` | API local de lectura, borradores, backups y escritura atómica. |

## Compatibilidad MDX y Política de Guardado

El guardado visual está habilitado dinámicamente según el nivel de compatibilidad del documento:

| Estado | Significado | Escritura visual |
| --- | --- | --- |
| `fully-editable` | Todos los nodos del body son editables por parches localizados. | **Habilitado**. Guardado directo sin alterar el resto del documento. |
| `partially-editable` | Coexisten bloques editables y opacos preservados literalmente. | **Habilitado**. El guardado visual requiere revisión obligatoria de diff. |
| `read-only` | El body no tiene bloques visuales seguros. | **Deshabilitado**. Ninguna escritura visual permitida (sólo lectura). |
| `unsupported` | El parser no puede construir un documento seguro. | **Bloqueado**. Se fuerza la vista de código y se bloquea la conversión visual. |

## Persistencia y Backups

- El `source` completo es la autoridad.
- El guardado manual envía el source exacto con `expectedVersion`, hash y revisión local.
- Un borrador vive fuera del corpus en `.matematika/editor/drafts/` y no limpia `dirty`.
- Aplicar contenido crea backup, escribe temporal y renombra atómicamente.
- Los conflictos `409` preservan el source local y se notifican al usuario para resolución.
- Cambiar de archivo con cambios pendientes queda bloqueado mostrando un diálogo de confirmación.

## DiagramWorkbench

El workbench usa autoridad explícita de modelo o fuente. Un cambio visual desde fuente autoritativa produce `diverged`; una fuente inválida produce `invalid-source`; los estados inválidos bloquean guardado. Las referencias MDX se consultan mediante `src/entities/content/diagramUsageIndex.json`, generado por `npm run diagram-usages:index`, para evitar escaneo O(N) al abrir un diagrama.

## Comandos Operacionales

| Comando | Propósito | Escribe archivos |
| --- | --- | --- |
| `npm run editor:generated:check` | Regenera artefactos versionados y falla si aparece diff. | Sí (en caso de desactualización). |
| `npm run editor:roundtrip:check` | Compara el corpus MDX contra la baseline lossless. | No. |
| `npm run editor:test:unit` | Tests unitarios de documento, estado, diagramas y validación. | No. |
| `npm run editor:test:integration` | Persistencia, hook principal y round-trip integrado. | Solo temporales bajo `/tmp`. |
| `npm run editor:test:coverage` | Cobertura del editor y validación de umbrales por riesgo. | `coverage/`. |
| `npm run editor:test:e2e` | Ejecuta la suite completa de 14 flujos Puppeteer en CI/local. | No. |
| `npm run editor:lint` | ESLint acotado al editor con límite estricto de warnings. | No. |
| `npm run editor:architecture` | Dependency Cruiser más chequeo de seguridad de patrones. | No. |
| `npm run editor:full-check` | Ejecución local rápida de todos los gates (sin E2E). | Sí (si generados cambian). |
| `npm run editor:release-check` | Gate completo de CI/Pre-release (incluye tests, lint, coverage, E2E y Lean). | No (salvo reportes). |

## Fixtures y Regresiones

Los fixtures MDX viven en `tests/fixtures/editor/`. Para agregar una regresión:

1. Crear un fixture mínimo que aisle la corrupción en `tests/fixtures/editor/`.
2. Agregar una aserción en `tests/features/editor/roundtrip.test.ts`.
3. Ejecutar `npm run editor:roundtrip:check` y `npm run editor:test:unit`.
4. Regenerar baseline solo con `npm run editor:roundtrip:audit` cuando el cambio del corpus sea intencional y revisado.
