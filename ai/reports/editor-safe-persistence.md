# Resultado de la Fase 4 — persistencia segura del editor

## Resumen

- Rama: `fix/editor-safe-persistence`
- Commit base: `21d1bcf`
- Objetivo: confirmar y aplicar el source exacto mediante contratos validados, revisiones y concurrencia optimista.
- Guardado visual productivo: deshabilitado.
- Autosave de borrador productivo: deshabilitado; infraestructura probada.

## Arquitectura anterior

`useEditorCore` ejecutaba `fetch`, interpretaba respuestas libres y combinaba `saving`, `dirtyState` y mensajes. El backend devolvía texto en lectura, escribía directamente con `writeFileSync`, guardaba borradores en memoria y carecía de versión, backup, temporal, restauración y `409`.

## Arquitectura resultante

- Cliente: `EditorApiClient`, único límite `fetch`, contratos Zod y `AbortSignal`.
- Dominio: `ContentRepository` y `DraftRepository` comprueban identidad, revisión, hash y versión.
- Estado: reducer con estados discriminados desde `loading` hasta `saved`, `save-error`, `conflict` y `cancelled`.
- Revisiones: contador local inequívoco; SHA-256 para source y versión remota.
- Coordinación: debounce centralizado y cancelación/generación latest-wins.
- Backend: servicio testeable, path normalizado, control de symlinks y extensiones, límite de request, `409`, backup previo y temporal+rename.
- Borradores: JSON atómico separado del corpus.
- Restauración: versionada, con backup del estado sustituido.

## Matriz de carreras

| Caso | Antes | Ahora | Prueba |
| --- | --- | --- | --- |
| Respuestas cruzadas | la última en resolver podía ganar | generación y abort controller descartan la antigua | `saveCoordinator.test.ts` |
| Cambio de archivo | respuesta anterior podía mutar el nuevo estado | abort + identidad; cambios dirty bloquean el cambio | `useEditorCore.test.ts` |
| Desmontaje | sin cleanup coordinado | `dispose()` idempotente invalida callbacks | `saveCoordinator.test.ts` |
| Edición durante guardado | podía quedar clean incorrectamente | éxito antiguo actualiza base pero conserva dirty | `editorPersistenceState.test.ts` |
| Conflicto externo | sobrescritura directa | `expectedVersion` y `409` | reducer, cliente y backend |
| Error de red | cadena genérica | `network-error`, source local conservado | cliente e integración |
| Payload inválido | `200` podía aceptarse | `invalid-response`, nunca saved | `editorApiClient.test.ts` |

## Backend

- Lectura: `GET /api/content?path=...`.
- Borrador: `GET/POST /api/draft`.
- Aplicación: `POST /api/content`.
- Restauración: `POST /api/content/restore`.
- Raíces de escritura: contenido y directorios de diagramas autorizados bajo `src/`.
- Borradores: `.matematika/editor/drafts/`.
- Backups: `.matematika/editor/backups/`.
- Temporales: junto al archivo objetivo para conservar atomicidad del rename.
- Respuestas: JSON validado; `400`, `403`, `404`, `409`, `413` y `500` estructurados.

## Riesgos residuales

- Autosave permanece apagado hasta un gate de producto posterior.
- No hay política automática de retención de backups.
- La resolución visual de conflictos se limita a informar y exigir recarga.
- Metadata visual y operaciones estructurales continúan bloqueadas.
- `DiagramWorkbench` y hooks legacy conservan red heredada fuera del flujo MDX; no se modificaron por prohibición expresa.

## Siguiente fase

Fase 5: modularización de `EditorPage` y retirada de arquitectura heredada. No se inicia en este trabajo.
