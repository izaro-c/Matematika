# Épica: estabilización del editor de Matematika

## Estado

- Fases 0–3: corregidas y validadas; motor MDX lossless y gate de corpus.
- Fase 4: persistencia transaccional implementada y probada.
- Guardado visual productivo: todavía deshabilitado.
- Siguiente fase: Fase 5, modularización de `EditorPage` y retirada de legado estructural.

## Garantías de Fase 4

- Cliente API único con Zod, errores tipados y cancelación.
- Repositorios que verifican path, revisión, hash y versión.
- Reducer sin combinaciones booleanas contradictorias.
- Debounce y operaciones en vuelo coordinadas mediante latest-wins cancelable.
- Respuestas antiguas y de otro archivo no limpian dirty ni confirman revisiones nuevas.
- Borradores separados, persistentes y recuperables.
- Aplicación explícita con `expectedVersion` y conflicto `409`.
- Backend con rutas y symlinks protegidos, backup previo, temporal validado y rename atómico.
- Restauración versionada que respalda el estado sustituido.
- El source enviado coincide exactamente con la autoridad documental.
- Guardado visual y autosave continúan bloqueados.

## Métricas

| Métrica | Resultado |
| --- | ---: |
| MDX del corpus | 120 |
| Cambios accidentales | 0 |
| Ciclos no idempotentes | 0 |
| Pruebas del editor | 96 aprobadas |
| Warnings Dependency Cruiser preexistentes | 170 |
