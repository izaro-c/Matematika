# Resultado de la Fase 4 — persistencia segura del editor

## Resumen

- Rama: `fix/editor-safe-persistence`
- Commit base: `21d1bcf`
- Objetivo: confirmar y aplicar el source exacto mediante contratos validados, revisiones y concurrencia optimista.
- Fases 0–4: completamente endurecidas, validadas y cerradas.
- Guardado visual productivo: deshabilitado.
- Autosave de borrador productivo: deshabilitado; infraestructura probada.

## Arquitectura anterior

`useEditorCore` ejecutaba `fetch`, interpretaba respuestas libres y combinaba `saving`, `dirtyState` y mensajes. El backend devolvía texto en lectura, escribía directamente con `writeFileSync`, guardaba borradores en memoria y carecía de versión, backup, temporal, restauración y `409`.

## Arquitectura resultante

- Cliente: `EditorApiClient`, único límite `fetch`, contratos Zod y `AbortSignal`.
- Dominio: `ContentRepository` y `DraftRepository` comprueban identidad, revisión, hash y versión. `DraftRepository` recalcula hash localmente y rechaza discrepancias antes de enviar.
- Estado: reducer con estados discriminados desde `loading` hasta `saved`, `save-error`, `conflict` y `cancelled`.
- Revisiones: contador local inequívoco; SHA-256 para source y versión remota.
- Coordinación: debounce centralizado y cancelación/generación latest-wins.
- Backend: locks por ruta canónica (`lockKey` basada en `realpath`), control de symlinks y extensiones, límite de request, `409` estructurados (`content-conflict`, `draft-conflict`), backup previo y temporal+rename.
- Borradores: JSON atómico separado del corpus, aislado por sesión y revisión, con soporte multi-sesión.
- Restauración: versionada, con backup del estado sustituido.

## Matriz de carreras

| Caso | Antes | Ahora | Prueba |
| --- | --- | --- | --- |
| Respuestas cruzadas | la última en resolver podía ganar | generación y abort controller descartan la antigua | `saveCoordinator.test.ts` |
| Cambio de archivo | respuesta anterior podía mutar el nuevo estado | abort + identidad; cambios dirty bloquean el cambio | `useEditorCore.test.ts` |
| Desmontaje | sin cleanup coordinado | `dispose()` de forma de clean idempotente | `saveCoordinator.test.ts` |
| Edición durante guardado | podía quedar clean incorrectamente | éxito antiguo actualiza base pero conserva dirty | `editorPersistenceState.test.ts` |
| Conflicto externo | sobrescritura directa | `expectedVersion` y `409` | reducer, cliente y backend |
| Error de red | cadena genérica | `network-error`, source local conservado | cliente e integración |
| Payload inválido | `200` podía aceptarse | `invalid-response`, nunca saved | `editorApiClient.test.ts` |
| Lock por alias de ruta | locks separados por alias de string | lock unificado bajo realpath canónico | `editorPersistenceBackend.test.ts` |

## Backend y Directorios

- Lectura: `GET /api/content?path=...`.
- Borrador: `GET/POST /api/draft`.
- Aplicación: `POST /api/content`.
- Restauración: `POST /api/content/restore`.
- Raíces de escritura: contenido y directorios de diagramas autorizados bajo `src/`.
- Borradores: `.matematika/editor/drafts/`.
- Backups: `.matematika/editor/backups/`.
- Temporales: junto al archivo objetivo para conservar atomicidad del rename.
- Respuestas: JSON validado; `400`, `403`, `404`, `409` (`content-conflict`/`draft-conflict`), `413` y `500` estructurados.

## Resultados de Auditoría y Corpus

Se ha generado y validado con éxito el corpus de 120 documentos MDX bajo el `schemaVersion: 3`:
- exact: 120
- format-only: 0
- semantic-risk: 0
- non-idempotent: 0
- parse-error: 0
- unknown: 0
- reversibleOperationExact true: 94
- reversibleOperationExact null: 26

## Pruebas

La suite de pruebas del editor se ha ampliado y consolidado con 138 casos de prueba, cubriendo:
- Concurrencia de múltiples alias (como `database/content/test.mdx` y `./test.mdx`) en `applyContent`.
- Carreras entre `restoreBackup` and `applyContent` con alias equivalentes.
- Verificación de no-sobrescritura concurrente usando alias symlink.
- Pruebas del modelo multi-sesión de borradores (`latest.json` y aislamiento de sesiones).
- Pruebas de hash incoherente en `DraftRepository`.
- Bloqueo inmediato en cambio de archivo bajo hash de edición pendiente.
- Toggles de modo seguros durante el cálculo asíncrono de hash.
- Desmontaje tolerante a resoluciones de hash pendientes sin pérdidas de memoria ni warnings.
- Coordinación exacta de guardado y edición concurrente con hashes pendientes.
- Validación del payload extendido de `draft-conflict` en cliente y backend.
- Limpieza total de advertencias React, `act()` y lint en la suite de pruebas del editor.

## Riesgos residuales

- Autosave permanece apagado hasta un gate de producto posterior.
- No hay política automática de retención de backups.
- La resolución visual de conflictos se limita a informar y exigir recarga.
- Metadata visual y operaciones estructurales continúan bloqueadas.
- `DiagramWorkbench` y hooks legacy conservan red heredada fuera del flujo MDX; no se modificaron por prohibición expresa.
