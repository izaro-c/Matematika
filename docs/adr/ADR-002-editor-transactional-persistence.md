# ADR-002: Persistencia transaccional del editor

## Estado

Aceptada e implementada. La política visual productiva está habilitada por compatibilidad de documento: `fully-editable` puede aplicar cambios seguros y `partially-editable` exige diff aprobado vigente. `read-only` y `unsupported` siguen bloqueados.

## Decisión

1. Cada lectura devuelve `source`, SHA-256 y una versión opaca `sha256:<hash>`.
2. Cada cambio local recibe una revisión numérica creciente de forma síncrona mediante `SOURCE_CHANGED` y el editor se vuelve `dirty` inmediatamente. La resolución de hash (`SOURCE_HASH_RESOLVED`) ocurre en segundo plano y se valida contra la revisión y el archivo actuales. Las respuestas se aceptan únicamente para el archivo y revisión correspondientes.
3. El cliente HTTP valida todos los payloads con Zod y convierte red, aborto, validación, autorización, ausencia, conflicto y servidor en errores discriminados.
4. Los repositorios verifican path, revisión, hash y versión; React no interpreta HTTP.
5. El estado de persistencia es una unión discriminada gestionada por reducer. Un borrador confirmado no limpia `dirty` y una revisión nueva invalida `saved`.
6. El coordinador usa debounce sustituible para borradores y latest-wins cancelable por operación. Latest-wins solo descarta autoridad local antigua; el servidor siempre aplica concurrencia optimista mediante `expectedVersion`.
7. Cambiar de archivo cancela timers y solicitudes. Si existen cambios locales sin confirmar (incluso con hash pendiente), el cambio se bloquea para evitar descartarlos silenciosamente. El desmontaje dispone el coordinador de forma idempotente y descarta resoluciones de hash pendientes.
8. Los borradores se guardan fuera del corpus en `.matematika/editor/drafts/`, incluyen identidad, source, hash, versión base y revisión, y nunca modifican el archivo real.
9. Aplicar contenido valida request, ruta, symlinks, extensión, hash, versión y source; crea un backup, escribe y valida un temporal en el mismo filesystem y lo renombra atómicamente.
10. Los backups viven en `.matematika/editor/backups/` como registros inmutables con ID UUID, path, source, hash y versión. Restaurar comprueba la versión actual, crea un backup del estado sustituido y usa el mismo reemplazo atómico.
11. Un conflicto devuelve `409` con `expectedVersion`, `actualVersion`, path y revisión (tanto para `content-conflict` como `draft-conflict`). No existe fusión ni sobrescritura automática.

## Condiciones de carrera

- Respuestas cruzadas: la solicitud anterior se aborta y su generación queda invalidada.
- Edición durante aplicación: una confirmación anterior actualiza la versión base, pero el estado permanece dirty y no muestra la revisión nueva como guardada.
- Cambio de archivo: se abortan cargas y guardados; una respuesta tardía no coincide con el archivo activo.
- Error después del rename pero antes de responder: el cliente conserva dirty; el reintento detectará versión distinta y exigirá recarga, sin sobrescribir.
- Dos clientes: solo el primero cuya versión coincida puede aplicar; el segundo recibe `409`.
- Source idéntico: se trata como aplicación explícita y genera backup; no se infiere éxito localmente.

## Política de borradores multi-sesión

Para evitar interferencias entre múltiples pestañas o clientes concurrentes:
1. Las revisiones de borrador se aíslan por sesión utilizando el `editorSessionId`.
2. Las revisiones numéricas (`localRevision`) son inmutables y solo comparables dentro de la misma sesión; diferentes sesiones no se pueden ordenar mediante `localRevision`.
3. El servidor almacena un puntero global `latest.json` para el archivo, el cual apunta al último borrador aceptado por el servidor.
4. Las revisiones anteriores del borrador de cada sesión se conservan en la carpeta `revisions/` para permitir la recuperación histórica.
5. Se rechaza cualquier borrador basado en una versión base obsoleta (que no coincida con el archivo real).
6. Al aplicar (`applyContent`) o restaurar (`restoreBackup`) el archivo, todos los borradores vinculados a la versión antigua quedan invalidados y eliminados físicamente del servidor.

## Identidad canónica y Locks de rutas

Para evitar conflictos de concurrencia cuando se utilizan diferentes alias de una misma ruta (por ejemplo, `./file.mdx`, `file.mdx`, etc.) o enlaces simbólicos (symlinks):
1. El backend resuelve el path del archivo a su `realpath` absoluto de forma canónica.
2. Tanto el archivo efectivo como la `lockKey` utilizan esta ruta resuelta canónicamente.
3. Para archivos que todavía no existen, se obtiene el `realpath` de su directorio padre y se combina con su `basename` normalizado.
4. Todas las operaciones críticas de persistencia (`saveDraft`, `readDraft`, `applyContent`, `createContent`, `restoreBackup`, invalidación/eliminación de borradores) se sincronizan bajo el mismo lock canónico, impidiendo carreras concurrentes de escritura silenciosa.

## Límites

- `VISUAL_SAVE_POLICY` está `enabled`, condicionado por compatibilidad y aprobación de diff.
- `DRAFT_AUTOSAVE_ENABLED` permanece `false`; sólo existe guardado manual de borrador.
- Existe UX de diff/aprobación. No existe fusión automática de conflictos.
- La retención de backups es ilimitada y requiere una política operativa posterior.
- `DiagramWorkbench` queda fuera de esta fase por prohibición expresa. Su endpoint heredado para TSX se conserva mediante un adaptador backend atómico; su migración al cliente tipado corresponde a la fase específica del workbench.
- Los hooks legacy sin consumidores se retirarán durante la modularización de `EditorPage`.

## Nota de Fase 8

Los gates de release del editor se normalizan en `package.json` bajo `editor:*` y en `.github/workflows/ci.yml`. El guardado visual queda autorizado sólo bajo las reglas anteriores; cualquier ampliación de superficie debe añadir E2E, cobertura y documentación antes de declararse estable.
