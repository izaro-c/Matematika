# ADR-001: Arquitectura lossless del editor MDX

## Estado

Aceptada e implementada para las fases 0–3. La persistencia visual transaccional (Fase 4) queda pendiente.

## Contexto

El flujo legacy separaba metadata, imports, body y exports, proyectaba el body a bloques y reconstruía todo el documento. Esa mezcla permitía normalización, duplicación de la envolvente y pérdida del body. El prototipo inicial con AST mantenía a la vez esa representación reconstruible y el source completo, por lo que no eliminaba la ruta de corrupción.

## Decisión

1. `EditorDocument.source` es la única autoridad persistente y siempre contiene el documento completo.
2. `envelope` contiene únicamente rangos de metadata, imports y exports sobre `source`; `bodyRange` también apunta a `source`. Ninguna parte se reconstruye desde objetos JavaScript.
3. El parser sintáctico comparte el subconjunto no transformador del pipeline Vite: `remark-parse`, `remark-mdx`, `remark-gfm` y `remark-math`. No compila, importa ni ejecuta código.
4. La proyección recibe solo nodos del body. En esta fase son editables únicamente párrafos simples y el texto de headings simples.
5. Listas, tablas, matemáticas, JSX, expresiones y cualquier nodo no soportado se proyectan como bloques opacos literales e inmutables.
6. Cada bloque conserva el rango del nodo y, si es editable, un `editRange` exacto. En headings el rango editable excluye los marcadores Markdown y conserva `depth` por separado.
7. Un parche exige `operationId`, `blockId`, rango, `expectedSource` y replacement. Después de aplicarlo se analiza de nuevo el documento; todos los bloques, rangos y el hash se reemplazan por los recalculados.
8. El hash del documento base identifica la revisión local. Un hash o `expectedSource` obsoleto, un rango ajeno, un bloque opaco, solapamientos, operaciones duplicadas o inserciones ambiguas se rechazan.
9. Hasta la Fase 4 quedan deshabilitados el guardado visual, metadata visual, añadir, eliminar, mover y reemplazar globalmente bloques. El guardado manual en código envía el source exacto y comprueba el estado HTTP.
10. `parseMDX`, `stringifyMDX`, `parseBodyToBlocks` y `stringifyBlocksToBody` se han retirado de apertura, cambio de modo, edición visual, cálculo de candidato y auditoría. Permanecen en el parser legacy y en hooks huérfanos sin consumidores productivos; su retirada física es deuda separada.
11. Compatibilidad significa:
    - `fully-editable`: todo nodo del body proyectado admite parches localizados;
    - `partially-editable`: mezcla de bloques editables y opacos;
    - `read-only`: body sin bloques editables seguros;
    - `unsupported`: el parser sintáctico no puede construir el documento.

## Flujos

- Apertura: leer source completo → analizar → separar rangos → clasificar → abrir en código.
- Código a visual: analizar el source completo actual → bloquear `unsupported` → proyectar solo body → conservar source.
- Visual a código: exponer `EditorDocument.source`; no serializar.
- Edición visual: construir parche localizado → validar revisión, bloque y slice → aplicar → reanalizar.
- Guardado: solo manual desde código para MDX durante estas fases; el guardado visual sigue deshabilitado.

## Consecuencias

La editabilidad visual es deliberadamente menor, pero un documento no editado no atraviesa ninguna serialización. El corpus se audita mediante apertura, proyección, cambios de modo y tres ciclos reales. La Fase 4 deberá añadir persistencia transaccional sin relajar estas invariantes.
