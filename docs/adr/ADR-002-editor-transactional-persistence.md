# ADR-002: Persistencia transaccional del editor

## Estado

Aceptada para la Fase 4. El guardado visual productivo continúa deshabilitado.

## Decisión

1. Cada lectura devuelve `source`, SHA-256 y una versión opaca `sha256:<hash>`.
2. Cada cambio local recibe una revisión numérica creciente. Las respuestas se aceptan únicamente para el archivo y revisión correspondientes.
3. El cliente HTTP valida todos los payloads con Zod y convierte red, aborto, validación, autorización, ausencia, conflicto y servidor en errores discriminados.
4. Los repositorios verifican path, revisión, hash y versión; React no interpreta HTTP.
5. El estado de persistencia es una unión discriminada gestionada por reducer. Un borrador confirmado no limpia `dirty` y una revisión nueva invalida `saved`.
6. El coordinador usa debounce sustituible para borradores y latest-wins cancelable por operación. Latest-wins solo descarta autoridad local antigua; el servidor siempre aplica concurrencia optimista mediante `expectedVersion`.
7. Cambiar de archivo cancela timers y solicitudes. Si existen cambios locales sin confirmar, el cambio se bloquea para evitar descartarlos silenciosamente. El desmontaje dispone el coordinador de forma idempotente.
8. Los borradores se guardan fuera del corpus en `.matematika/editor/drafts/`, incluyen identidad, source, hash, versión base y revisión, y nunca modifican el archivo real.
9. Aplicar contenido valida request, ruta, symlinks, extensión, hash, versión y source; crea un backup, escribe y valida un temporal en el mismo filesystem y lo renombra atómicamente.
10. Los backups viven en `.matematika/editor/backups/` como registros inmutables con ID UUID, path, source, hash y versión. Restaurar comprueba la versión actual, crea un backup del estado sustituido y usa el mismo reemplazo atómico.
11. Un conflicto devuelve `409` con `expectedVersion`, `actualVersion`, path y revisión. No existe fusión ni sobrescritura automática.

## Condiciones de carrera

- Respuestas cruzadas: la solicitud anterior se aborta y su generación queda invalidada.
- Edición durante aplicación: una confirmación anterior actualiza la versión base, pero el estado permanece dirty y no muestra la revisión nueva como guardada.
- Cambio de archivo: se abortan cargas y guardados; una respuesta tardía no coincide con el archivo activo.
- Error después del rename pero antes de responder: el cliente conserva dirty; el reintento detectará versión distinta y exigirá recarga, sin sobrescribir.
- Dos clientes: solo el primero cuya versión coincida puede aplicar; el segundo recibe `409`.
- Source idéntico: se trata como aplicación explícita y genera backup; no se infiere éxito localmente.

## Límites

- `VISUAL_SAVE_POLICY` y el autosave de borrador permanecen deshabilitados.
- No existe todavía UX de diff o fusión de conflictos.
- La retención de backups es ilimitada y requiere una política operativa posterior.
- `DiagramWorkbench` queda fuera de esta fase por prohibición expresa. Su endpoint heredado para TSX se conserva mediante un adaptador backend atómico; su migración al cliente tipado corresponde a la fase específica del workbench.
- Los hooks legacy sin consumidores se retirarán durante la modularización de `EditorPage`.
