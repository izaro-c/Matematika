# ADR-001: Arquitectura de Editor MDX sin pérdida (Lossless)

## 1. Estado
Aprobado (Fase 2 - Spikes y Prototipo)

## 2. Contexto
El editor visual actual de Matematika opera mediante un ciclo completo de deserialización y reserialización:
```text
MDX original -> bloques visuales -> MDX reconstruido
```
Este flujo se basa en expresiones regulares secuenciales complejas en `parser.ts` para extraer secciones del documento. Debido a la falta de un modelo sintáctico (AST) estructurado, el serializador reconstruye globalmente todo el documento al guardar. Esto introduce corrupciones conocidas en el corpus:
- Deriva de sangrado (indentation drift) acumulativo en bloques anidados como `<ProofStep>`.
- Pérdida de expresiones JSX anidadas complejas.
- Conversión incorrecta de propiedades de arrays u objetos en strings planos.
- Alteraciones y formateados estéticos no deseados en áreas del documento que el usuario no ha editado.

Para estabilizar el editor, necesitamos una arquitectura que permita editar elementos de forma visual y aplicar parches localizados sin reserializar ni alterar el resto del código fuente original.

## 3. Requisitos y Fuerzas
- **Preservación Literal**: Las regiones del documento no modificadas por el usuario deben permanecer idénticas byte a byte.
- **Compatibilidad Parcial**: Ciertos documentos pueden contener sintaxis avanzada o componentes interactivos complejos que no son editables visualmente; deben poder tratarse de forma segura sin eliminarse ni corromperse.
- **Seguridad**: No se debe ejecutar código o expresiones MDX del usuario (`eval`, `new Function` o imports dinámicos) durante la carga o edición.
- **Determinismo**: La conversión y el comportamiento del editor deben ser predecibles y testeables de manera aislada (sin depender del entorno de React).
- **Rendimiento**: El análisis y la aplicación de cambios locales deben realizarse en milisegundos para permitir una experiencia interactiva ágil.

## 4. Alternativas Evaluadas

### Alternativa A — Stringify global del AST
Consiste en parsear el MDX a un árbol de sintaxis abstracta (AST) usando Remark/Unified, realizar modificaciones sobre los nodos del AST, y regenerar todo el archivo MDX usando un formateador global del AST.
- *Ventajas*: Implementación conceptualmente simple; Remark maneja toda la serialización.
- *Riesgos*: Los formateadores globales de AST (como `remark-stringify`) normalizan agresivamente el espaciado, las comillas, la indentación de los párrafos y el estilo de las etiquetas JSX. Es casi imposible evitar cambios estéticos indeseados y pérdida de comentarios en áreas no modificadas del archivo, incumpliendo el principio de preservación literal.

### Alternativa B — Parches sobre Rangos y Offsets (Seleccionada)
Consiste en parsear el MDX con un parser formal (Remark/Unified) que conserve las coordenadas exactas de inicio y fin (offsets) de cada nodo. Cuando el editor edita un bloque visual, calcula la diferencia local y genera una lista de parches discretos (`SourceEdit`). Estos parches se aplican directamente sobre la cadena de texto original.
- *Ventajas*: Preserva byte a byte el resto del documento original. Los parches son quirúrgicos e independientes de la normalización del AST.
- *Riesgos*: Requiere sincronizar las coordenadas si se realizan múltiples ediciones, y re-parsear el documento tras los cambios para re-calcular los rangos.

### Alternativa C — Documento Híbrido con Bloques Opacos (Seleccionada)
Consiste en segmentar el documento en bloques editables y bloques opacos. Si un fragmento de JSX o MDX contiene sintaxis no soportada o compleja (ej. expresiones multilínea o componentes anidados), el parser lo identifica como un bloque opaco que conserva intacto su source exacto y rango. La UI del editor renderiza estos bloques en modo de solo lectura o los bloquea de edición visual, pero los mantiene inalterados al guardar.
- *Ventajas*: Evita corromper sintaxis no comprendida; proporciona un camino de transición incremental.
- *Riesgos*: Limita la editabilidad de ciertos documentos complejos.

## 5. Decisión
Se adopta una arquitectura combinada de **Parches sobre Rangos locales** y **Bloques Opacos (Alternativas B y C)**, utilizando el parser `remark-mdx` / Unified para el análisis estructural y la extracción de coordenadas textuales (offsets), bajo las siguientes invariantes:
1. El código fuente original es la única autoridad de verdad.
2. Un bloque visual editable proyecta su contenido y su rango original de coordenadas.
3. Las modificaciones visuales se traducen a parches `SourceEdit` que especifican el rango exacto, la fuente original esperada (`expectedSource`) y el texto de reemplazo (`replacement`).
4. Si la fuente esperada en el rango no coincide con el archivo original, la operación se rechaza por seguridad (detección de fuentes obsoletas).
5. Las operaciones de parches solapadas se rechazan.
6. Cualquier documento editado es validado volviéndolo a parsear antes de confirmarse.
7. Los nodos complejos o JSX desconocidos se proyectan como bloques opacos inmutables.

## 6. Clasificación de Compatibilidad Visual
Se establece el tipo `VisualCompatibility` para clasificar qué nivel de edición visual permite un documento:
- `'fully-editable'`: Todos los bloques del documento son editables visualmente (párrafos simples, títulos, listas estándar).
- `'partially-editable'`: El documento contiene tanto bloques editables como bloques opacos. El editor permite modificar visualmente los editables y mantiene intactos los opacos.
- `'read-only'`: El documento contiene estructuras complejas que impiden la edición visual segura (ej. exportaciones dinámicas), permitiendo únicamente edición en modo código.
- `'unsupported'`: Archivo con fallos graves de parseo estructural.

## 7. Consecuencias
- *Positivas*: Garantía absoluta contra la corrupción silenciosa del corpus matemático; posibilidad de editar de forma incremental el contenido sin romper JSX ni estructuraciones complejas; tests unitarios 100% fiables sobre flujos de parches.
- *Negativas*: Mayor complejidad en el core del editor al tener que mapear y re-calcular rangos de texto; restricción temporal de editabilidad visual completa para archivos con sintaxis no soportada.
