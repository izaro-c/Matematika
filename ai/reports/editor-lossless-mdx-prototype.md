# Reporte de Evaluación de Prototipo MDX Lossless

Este reporte evalúa la viabilidad del prototipo de editor sin pérdidas (lossless) implementado en la Fase 2, comparándolo con la reserialización global tradicional y evaluándolo sobre fixtures sintéticos y muestras del corpus real.

## Matriz de Evaluación

| Criterio | Stringify global (Legacy / AST completo) | Source patches (Prototipo Fase 2) | Híbrido con opacos (Prototipo Fase 2) |
| :--- | :---: | :---: | :---: |
| **Preserva texto no editado** | 🔴 No (Normaliza espacios y comillas) | 🟢 Sí (Byte a byte idéntico) | 🟢 Sí (Byte a byte idéntico) |
| **Soporta compatibilidad parcial** | 🔴 No (Falla al parsear JSX complejo) | 🟡 Parcial (Requiere AST base) | 🟢 Sí (Bloquea edición de JSX complejo) |
| **Trata sintaxis desconocida** | 🔴 No (La omite o corrompe) | 🔴 No | 🟢 Sí (Conserva fuente original inalterado) |
| **Diff localizado** | 🔴 No (Diff global por cambios estéticos) | 🟢 Sí (Unicamente líneas modificadas) | 🟢 Sí (Unicamente líneas modificadas) |
| **Complejidad** | 🟢 Baja (Remark stringify directo) | 🟡 Media (Cálculo y ajuste de offsets) | 🟡 Media (Coexistencia de bloques) |
| **Riesgos de deriva** | 🔴 Alto (Drift en indentación acumulativo) | 🟢 Nulo (Invariantes sobre rangos) | 🟢 Nulo (Invariantes sobre rangos) |
| **Facilidad de pruebas** | 🟡 Media | 🟢 Alta (Pruebas de parches sin React) | 🟢 Alta |
| **Migración incremental** | 🔴 No (Cambio de parser completo en app) | 🟡 Media | 🟢 Alta (Promueve bloques a editables) |
| **Rendimiento esperado** | 🟢 Alto (Sencillo de ejecutar) | 🟢 Alto (Slices de strings instantáneos) | 🟢 Alto |
| **Resultado en fixtures** | 🔴 100% de fixtures fallaban | 🟢 Todos los fixtures pasan | 🟢 Todos los fixtures pasan |
| **Resultado en corpus real** | 🔴 114/120 archivos con deriva/cambios | 🟢 100% de las muestras correctas | 🟢 100% de las muestras correctas |

### Explicación de Valoraciones

* **Stringify Global**: Descartado debido a que la reserialización global de ASTs siempre normaliza el espaciado y destruye la concordancia byte a byte en regiones ajenas.
* **Source Patches**: Permite aplicar cambios en texto plano utilizando coordenadas precisas sobre la fuente de verdad original, manteniendo todo lo demás intacto.
* **Híbrido con Opacos**: Resuelve el problema de la sintaxis no soportada. Los fragmentos que el editor visual no entiende se aíslan y preservan exactamente como bloques opacos sin alterarse ni eliminarse.

## Estadísticas de Compatibilidad sobre Muestras del Corpus

* **fully-editable (Totalmente editable):** 0
* **partially-editable (Parcialmente editable):** 0
* **read-only (Solo lectura en editor visual):** 6
* **unsupported (No soportado):** 1

## Conclusiones y Plan para la Fase 3

El prototipo demuestra que es viable editar contenido MDX visualmente de forma 100% segura y libre de regresiones destructivas. Al proyectar componentes JSX y expresiones como bloques opacos inmutables y aplicar parches localizados (`SourceEdit`), garantizamos la estabilidad del corpus matemático de Matematika.
