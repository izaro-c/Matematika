# Fixtures de Regresión del Editor de Matematika

Este directorio contiene fixtures sintéticos mínimos diseñados para aislar fallas o comportamientos propensos a corrupción en el pipeline actual del parser/serializador MDX.

## Fixtures

* **`demonstration-section-jsx-prop.mdx`**: Prueba componentes JSX que reciben otras expresiones JSX como propiedades (ej. `prop={<span>...</span>}`).
* **`nested-components.mdx`**: Prueba el anidamiento de componentes JSX (como `<Outer><Inner /></Outer>`), un fallo conocido en la jerarquía del parser regex actual.
* **`object-prop.mdx`**: Prueba el pase de objetos JS literales como propiedades a componentes (ej. `config={{ ... }}`).
* **`array-prop.mdx`**: Prueba el pase de arrays JS literales como propiedades a componentes (ej. `items={[ ... ]}`).
* **`multiline-expression.mdx`**: Prueba bloques de expresiones JS multilínea insertadas en el cuerpo del MDX (ej. `{(() => { ... })()}`).
* **`repeated-indentation.mdx`**: Prueba listas o bloques anidados para evitar la deriva o acumulación de espacios e indentaciones indeseadas.
* **`proof-steps.mdx`**: Prueba la sintaxis interactiva y propiedades estructuradas de los pasos de demostración (`<Demostracion>` y `<ProofStep>`).
* **`imports-exports.mdx`**: Prueba la separación y mantenimiento intacto de importaciones y exportaciones adicionales al inicio y final del documento.
* **`capitular-first-paragraph.mdx`**: Prueba el procesamiento del bloque especial `<Capitular>` al principio del primer párrafo físico.
