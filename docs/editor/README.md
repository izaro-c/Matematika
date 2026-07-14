# Editor de Matematika

Referencia operativa del editor MDX y del workbench de diagramas. Los ADR explican las decisiones; este documento describe las garantías comprobables, sus límites y los gates de mantenimiento.

## Arquitectura y autoridad

| Área | Ruta | Responsabilidad |
| --- | --- | --- |
| Documento lossless | `src/features/editor/document/` | Source autoritativo, proyección posicional, parches localizados y compatibilidad. |
| Orquestación y estado | `src/features/editor/core/`, `state/` | Apertura, revisión, guardado y estados visibles. |
| Persistencia | `src/features/editor/persistence/` | Versiones, conflictos, borradores, backups y recuperación. |
| UI | `src/features/editor/ui/` | Navegación, autoría, diálogos, preview y estados. No accede al filesystem. |
| Diagramas de autoría | `src/features/editor/diagrams/` | Modelo, parser/generador TSX, historial y workbench. |
| Spec y runtime común | `src/shared/diagrams/spec/`, `runtime/` | `DiagramSpec v2`, semántica y renderer usado por editor, preview y publicación. |
| Diagramas publicados | `src/widgets/diagrams/` | Componentes consumidos por MDX; usan el núcleo compartido. |
| Backend local | `vite.config.ts`, `scripts/editor/editorPersistenceBackend.ts` | API de desarrollo y escritura atómica. |

El source completo es siempre la autoridad. Una edición visual nunca reconstruye el documento completo ni escribe fuera de los rangos autorizados. Una fuente de diagrama manual permanece en `code-preview` salvo que el roundtrip AST completo sea exacto.

## Compatibilidad medida

| Estado | Garantía de escritura visual |
| --- | --- |
| `fully-editable` | Parches localizados habilitados. |
| `partially-editable` | Solo regiones seguras; diff obligatorio. |
| `read-only` | Lectura visual; escritura bloqueada. |
| `unsupported` | Código autoritativo; conversión bloqueada. |

La auditoría oficial del corpus actual mide 120/120 documentos como `fully-editable`, con metadata válida, 0 regiones opacas y roundtrip byte a byte 120/120. Es una métrica del corpus fechado, no una promesa de compatibilidad con MDX arbitrario: los clasificadores y bloqueos siguen siendo obligatorios para cualquier documento nuevo.

La auditoría de diagramas mide 85 componentes finales: 4 `visual-exact`, 81 `code-preview`, 26 componentes internos excluidos y 0 inválidos. No se anuncia edición visual exacta para los 81 casos de código.

## Accesibilidad y responsive

- Todo diálogo mueve el foco al abrir, lo contiene con `Tab`/`Shift+Tab`, admite `Escape` cuando la acción es segura y restaura el foco al cerrar.
- Toolbar, tabs, estados de carga y error, diff y preview exponen nombres, estados ARIA y regiones anunciables.
- Los bloques editables se abren con `Enter` o `F2`; `Alt+↑/↓` conserva la reordenación. Puntos móviles y sliders del renderer aceptan flechas; `Shift` amplía el paso.
- El foco global usa un anillo de 3 px y `prefers-reduced-motion` desactiva animaciones no esenciales.
- La paleta canónica contiene solo `lienzo`, `carbon`, `salvia`, `terracota`, `pizarra`, `ocre`, `pavo`, `granada` y `musgo`. Un test calcula contraste WCAG AA en claro y oscuro.
- El E2E comprueba ausencia de overflow a 390×844, 1024×768 y 1440×900; la regresión de diagramas añade 1600×1100.

La semántica ARIA se prueba automáticamente. No se ha ejecutado en esta fase una sesión humana con NVDA, JAWS o VoiceOver; esa verificación asistiva permanece como validación manual recomendada, no como compatibilidad declarada.

## Persistencia y recuperación

- El guardado aplica `expectedVersion`, hash y revisión local; un `409` conserva el source local.
- Antes de escribir se crea backup y se usa temporal + rename atómico.
- El borrador explícito vive fuera del corpus; `DRAFT_AUTOSAVE_ENABLED` permanece en `false`.
- Cambiar de recurso abre una confirmación si hay cambios. Cerrar o recargar activa `beforeunload` y el E2E comprueba que el source pendiente no se persiste sin revisión.
- Error de red, reintento, conflicto externo, restauración de backup, estados vacíos y loading forman parte de las suites.

## Rendimiento

El diff exacto usa LCS solo hasta 4.000.000 de celdas. Por encima del presupuesto conserva prefijo/sufijo y produce un único hunk conservador; cambios dispersos quedan bloqueados en vez de provocar una matriz cuadrática o un falso positivo. La regresión usa 2.500 párrafos, exige resolver el flujo completo de una edición localizada en menos de 5 s incluso con coverage V8 y bloquea cambios dispersos. Sin instrumentación se observó aproximadamente 1,6 s. Son evidencias del entorno de test, no un benchmark de todos los equipos.

El índice inverso `diagramUsageIndex.json` evita escanear todo el corpus al abrir un diagrama. Solo se regenera con `npm run diagram-usages:index`.

## Comandos operativos

| Comando | Propósito |
| --- | --- |
| `npm run editor:lossless:check` | Comprueba la clasificación MDX frente a la baseline. |
| `npm run editor:roundtrip:check` | Comprueba roundtrip exacto del corpus. |
| `npm run editor:diagrams:check` | Mide soporte real de diagramas. |
| `npm run editor:test:unit` | Documento, estado, diagramas y validación. |
| `npm run editor:test:integration` | Persistencia, concurrencia y hook principal. |
| `npm run editor:test:e2e` | 18 flujos reales contra Vite y Chromium. |
| `npm run editor:test:visual` | Renderers reales en claro/oscuro y editor de Pitágoras. |
| `npm run editor:test:coverage` | Umbrales por archivo crítico. |
| `npm run editor:lint` | Lint dirigido con presupuesto máximo explícito. |
| `npm run editor:architecture` | FSD/dependencias y patrones de seguridad. |
| `npm run editor:generated:check` | Ejecuta comandos oficiales y falla si los artefactos versionados derivan. |
| `npm run editor:full-check` | Gates del editor sin navegador. |
| `npm run editor:release-check` | Gate de release completo, incluido E2E y visual. |
| `npm run full-check` | Gate global de producto. |

Los artefactos generados se actualizan exclusivamente mediante `generate-index`, `content:coverage`, `diagram-usages:index`, `lean:graph`, `ai:index` y `ai:debt`. No se editan a mano.

## Fixtures y regresiones

Los MDX de regresión viven en `tests/fixtures/editor/`; las specs en `tests/fixtures/diagrams/`. Un bug de fidelidad debe aislarse allí, probar su roundtrip y ejecutarse contra los gates dirigidos. Las baselines solo se actualizan mediante `editor:lossless:audit` o `editor:roundtrip:audit` después de revisar que el cambio del corpus sea intencional.
