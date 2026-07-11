# Baseline de corrección de las fases 0–3

## Base

- Rama de origen: `fix/editor-safe-persistence`
- Rama de trabajo: `fix/editor-phases-0-3`
- Commit base: `ee4ebdace4eb65e7a6868ee8557229fd5f9637cd`

## Validaciones previas

| Comando | Resultado previo | Observación |
| --- | --- | --- |
| `npm run typecheck` | aprobado | sin errores |
| `npm run test:editor` | aprobado | 52 pruebas, pero incluía una aserción trivial |
| `npm run editor:roundtrip:audit` | aprobado | medía el parser/serializador legacy |
| `npm run editor:roundtrip:check` | aprobado | aceptaba la baseline legacy de 120 archivos |
| `npm run lint -- src/features/editor tests/features/editor scripts/editor` | aprobado | sin salida de lint |
| `npm run depcruise` | aprobado con avisos | 171 warnings, incluido un ciclo en `editor/document` |
| `npm run ai:review` | aprobado | árbol limpio antes del cambio |
| `git diff --check` | aprobado | árbol limpio |

## Corpus previo

La baseline legacy clasificaba 6 documentos exactos, 27 no idempotentes y 87 desconocidos. La auditoría denominada lossless solo analizaba tres veces el mismo source; clasificaba 85 `read-only` y 35 `unsupported`, principalmente porque trataba ESM como body y omitía GFM/matemáticas.

## Riesgos confirmados

- `useEditorCore` analizaba el documento completo y además lo separaba/reconstruía con el parser legacy.
- El cambio visual → código serializaba bloques y podía vaciar un documento `unsupported`.
- Metadata, imports y exports se proyectaban como bloques opacos y degradaban compatibilidad.
- El parser productivo no usaba GFM ni matemáticas pese a que Vite sí los configura.
- Añadir, mover, eliminar, metadata y reemplazo de bloques reserializaban el body completo.
- Los headings exponían `##` dentro del texto editable.
- Los parches no validaban bloque, hash ni duplicados y comprobaban preservación con `includes`.
- Había una prueba `expect(true).toBe(true)` y otra que solo leía un JSON generado.

Este informe no contiene timestamps variables y sirve como relevo estable, no como gate ejecutable.
