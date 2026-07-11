# Épica: estabilización del editor de Matematika

## Estado

- Fases 0–4: completadas, endurecidas y validadas.
- Persistencia transaccional completamente implementada con locking canónico de rutas y política multi-sesión de borradores.
- Guardado visual productivo: todavía deshabilitado por contención de seguridad.
- Siguiente fase: Fase 5, modularización de `EditorPage` y retirada de legado estructural.

## Garantías de Fases 0–4

- Cliente API único con Zod, errores tipados (`content-conflict`, `draft-conflict`, etc.) y soporte para cancelación.
- Repositorios que verifican de forma estricta path, revisión, hash y versión. `DraftRepository` recalcula hash localmente y rechaza discrepancias antes de enviar.
- Reducer de estado robusto sin combinaciones booleanas contradictorias.
- Debounce y operaciones en vuelo coordinadas mediante latest-wins cancelable.
- Las respuestas antiguas y de otros archivos no limpian dirty ni confirman revisiones.
- Borradores persistentes por sesión y revisión, aislados y recuperables mediante punteros de sesión y un puntero global `latest.json`.
- Aplicación explícita mediante CAS con `expectedVersion` y resolución canónica de rutas (`realpath`).
- Backend con locks exclusivos por `lockKey` canónica (resolviendo alias `./`, `//` y symlinks internos).
- backups atómicos inmutables con UUID previo a escrituras en `.matematika/editor/backups/`.
- Restauración versionada que respalda el estado sustituido y realiza rename atómico.
- Los 120 documentos MDX del corpus son exactos, idempotentes y superan el gate lossless en tres ciclos.
- 94 documentos editables superan la edición reversible en el corpus.

## Métricas

| Métrica | Resultado |
| --- | ---: |
| MDX del corpus | 120 |
| Cambios accidentales | 0 |
| Ciclos no idempotentes | 0 |
| Pruebas del editor | 131 aprobadas |
| Warnings Dependency Cruiser preexistentes | 170 |
