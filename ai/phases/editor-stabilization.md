# Épica: estabilización del editor de Matematika

## Estado

- Fase 0: corregida; apertura segura en código y acciones no lossless contenidas.
- Fase 1: corregida; gate real, recursivo y determinista sobre 120 MDX.
- Fase 2: alineada; ADR y arquitectura productiva coinciden.
- Fase 3: integrada dentro del alcance seguro; source completo, rangos, opacos y parches localizados.
- Fase 4: pendiente; persistencia visual transaccional.

## Métricas verificadas

| Métrica | Resultado |
| --- | ---: |
| MDX descubiertos recursivamente | 120 |
| `fully-editable` | 0 |
| `partially-editable` | 94 |
| `read-only` | 26 |
| `unsupported` | 0 |
| Documentos no editados modificados | 0 |
| Ciclos no idempotentes | 0 |
| Envelopes o bodies alterados | 0 |
| Pruebas del editor | 56 |
| Guardado visual | deshabilitado |
| Operaciones estructurales visuales | deshabilitadas |

## Criterios satisfechos

- El source completo es la única autoridad y el editor no ejecuta metadata.
- La envolvente no se proyecta como body ni se reconstruye.
- El parser reconoce MDX, GFM y matemáticas con la configuración sintáctica del build.
- Los bloques opacos se preservan y no admiten la API de edición.
- Los parches validan bloque, rango, source esperado, hash, duplicados y solapamientos, y reparsan el resultado.
- Cambiar de modo sin editar conserva cada byte.
- El guardado manual en código comprueba HTTP y envía el source exacto.

## Restricciones vigentes

No se inicia la Fase 4. Metadata visual, inserción, eliminación, movimiento, reemplazo global y guardado visual siguen bloqueados hasta tener parches y persistencia transaccional demostrables.
