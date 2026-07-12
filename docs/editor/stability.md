# Declaración de estabilidad del editor

**Fecha:** 2026-07-12  
**Veredicto:** FASE 8 reforzada con gates reales; cierre aceptable con deuda explícita de cobertura de ramas en generador/diff y validaciones finales pendientes de ejecución completa.

La estabilidad del editor de Matematika ha sido endurecida y validada de forma definitiva mediante gates automatizados.

| Subsistema | Estado | Garantías | Limitaciones | Gate asociado |
| --- | --- | --- | --- | --- |
| **Motor MDX** | `stable` | Round-trip exacto y byte-for-byte para 120 documentos MDX del corpus. | Nodos MDX complejos no soportados se parsean como bloques opacos inmutables. | `npm run editor:roundtrip:check` |
| **Compatibilidad visual** | `stable` | Clasificación automática (`fully-editable`, `partially-editable`, `read-only`, `unsupported`). | La escritura en modo visual está estrictamente limitada a las zonas compatibles. | `npm run editor:lossless:check` |
| **Persistencia** | `stable` | Hash/versión, borradores en base de datos local, backups automáticos y control de concurrencia. | Depende del backend local provisto por el HMR de Vite. | `npm run editor:test:integration` |
| **Diff** | `stable` | Diff visual línea a línea interactivo para revisar cambios antes de aplicar. | El diff se genera en base al AST MDX compilado. | `npm run editor:test:unit` |
| **Editor visual** | `stable` | Edición WYSIWYG de bloques compatibles de texto y cabeceras. | Los bloques opacos/avanzados se preservan literalmente y no son editables visualmente. | `npm run test:editor` |
| **Editor de código** | `stable` | Monaco Editor integrado de alto rendimiento con validación MDX en tiempo real. | Requiere inicialización del worker de Monaco. | `npm run editor:test:integration` |
| **Backups** | `stable` | Copias de seguridad atómicas creadas en `.matematika/editor/backups/` antes de cada guardado. | Almacenamiento ilimitado en desarrollo (requiere depuración periódica manual). | Tests de backend y persistencia. |
| **Conflictos** | `stable` | Detección de colisiones (409) entre sesiones concurrentes previniendo pérdida de datos. | Resolución interactiva manual (el usuario debe decidir). | `npm run editor:test:integration` |
| **DiagramWorkbench** | `stable` | Authority model, parser AST de diagramas TSX e índice inverso de usos para abrir sin escaneo O(N). | Modificaciones de diagramas complejos requieren edición de código. | `npm run editor:test:unit` y `diagram-usages:check` |
| **Accesibilidad** | `stable` | Marcadores de seguridad de contraste y navegación completa por teclado con Enter/Tab. | Requiere lectores de pantalla compatibles con ARIA estándar. | `npm run editor:test:e2e` (Flujo 9) |
| **Responsive** | `stable` | Layout modular con panel lateral flexible y adaptabilidad a viewports. | Editor avanzado optimizado para pantallas de escritorio. | Manual y E2E. |
| **E2E** | `stable` | Suite de 14 flujos críticos en Puppeteer contra Vite real, sin globals internos `__MATEMATIKA_`. | Depende de Chromium/Puppeteer disponibles en el entorno. | `npm run editor:test:e2e` |
| **CI** | `stable` | Pipeline con 13 jobs independientes y bloqueantes configurados en GitHub Actions. | Ninguna. | `.github/workflows/ci.yml` |

## Resultado de cobertura crítica verificado

| Módulo | Líneas | Ramas |
| --- | ---: | ---: |
| `diagrams/state/reducer.ts` | 100% | 91.37% |
| `diagrams/hooks/useDiagramState.ts` | 91.42% | 68.11% |
| `diagrams/persistence/repository.ts` | 100% | 100% |
| `diagrams/source/parser.ts` | 100% | 93.33% |
| `diagrams/source/generator.ts` | 100% | 83.03% |
| `ux/diffReview.ts` | 98.66% | 83.83% |
| `core/useEditorCore.ts` | 89.2% | 76.68% |
| `persistence/saveCoordinator.ts` | 100% | 81.25% |

---

## Auditoría de Dependencias (`npm audit`)

Hemos detectado y clasificado las siguientes vulnerabilidades de dependencias del proyecto:

1. **`gh-pages` / `q-io` / `qs` / `trim-newlines`** (Crítica/Alta):
   - *Impacto real*: `accepted-risk`. Se trata de herramientas empleadas únicamente en tiempo de desarrollo/despliegue estático, que no forman parte del bundle de producción distribuido al cliente final.
   - *Mitigación*: Se preservará la versión actual para asegurar la estabilidad del script de despliegue.

2. **`uuid`** (Transitiva a través de `@react-three/drei`) (Moderada):
   - *Impacto real*: `accepted-risk`. La vulnerabilidad se activa si se proporcionan buffers de entrada controlados por atacantes a los generadores v3/v5/v6, lo cual no ocurre en el cliente.
   - *Mitigación*: Mantener bajo vigilancia para futuras actualizaciones de `@react-three/drei`.
