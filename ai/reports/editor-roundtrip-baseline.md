# Reporte de Oráculo de Round-Trip del Editor

## Resumen del Corpus

* **Total de archivos descubiertos:** 120
* **Porcentaje de documentos exactos (sin cambios):** 5.00%
* **Documentos modificados en el primer ciclo:** 114
* **Documentos no idempotentes:** 27
* **Documentos con errores de parseo:** 0

## Resumen por Clasificación

| Clasificación | Cantidad | Descripción |
| :--- | :---: | :--- |
| **exact** | 6 | Identidad textual exacta entre todos los ciclos. |
| **format-only** | 0 | Cambios limitados a BOM, saltos de línea LF/CRLF o espacios finales. |
| **semantic-risk** | 0 | Cambios estructurales relevantes en bloques, metadatos, JSX o fórmulas. |
| **non-idempotent** | 27 | Deriva acumulativa (el archivo sigue cambiando tras el ciclo 1). |
| **parse-error** | 0 | Excepción crítica durante el parseo/serialización. |
| **unknown** | 87 | Cambios en el cuerpo que el auditor no puede asegurar como inocuos. |

## Detalle de Archivos por Clasificación

### Clasificación: `non-idempotent` (27 archivos)

| Archivo | Regiones Afectadas | Señales | Info Adicional |
| :--- | :--- | :--- | :--- |
| `src/database/content/demonstrations/demo-angulo-externo.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-angulos-alternos-internos.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-angulos-opuestos-verticales.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-area-aditividad.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-area-invariancia.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-area-rectangulo.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-area-triangulo.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-congruencia-aal.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-congruencia-ala.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-congruencia-lll.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-desigualdad-triangular.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-dos-rectas-un-punto.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-existencia-bisectriz.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-existencia-perpendicular.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-invariancia-triangulacion.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-pitagoras-areas.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-pitagoras-euclides.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-punto-medio-perpendicular.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-punto-medio.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-reciproco-triangulo-isosceles.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-rectas-coincidentes.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-suma-angulos-triangulo.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-tales.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-triangulacion-poligono.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/demonstrations/demo-triangulo-isosceles.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/examples/ejemplo-pitagoras-calculo.mdx` | unknown | non-idempotent-derivation | Idempotente: No |
| `src/database/content/exercises/ejercicio-pitagoras-cateto.mdx` | unknown | non-idempotent-derivation | Idempotente: No |

### Clasificación: `unknown` (87 archivos)

| Archivo | Regiones Afectadas | Señales | Info Adicional |
| :--- | :--- | :--- | :--- |
| `src/database/content/axiomatic-systems/sistema-absoluto.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axiomatic-systems/sistema-euclidiano.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axiomatic-systems/sistema-hiperbolico.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axiomatic-systems/sistema-incidencia.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-arquimedes.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-completitud.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-congruencia-1.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-congruencia-2.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-congruencia-3.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-congruencia-4.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-congruencia-5.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-incidencia-1.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-incidencia-2.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/axioms/axioma-incidencia-3.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-incidencia-4.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-incidencia-5.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-incidencia-6.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-incidencia-7.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-incidencia-8.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-orden-1.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-orden-2.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-orden-3.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-orden-4.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-paralelas-euclides.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/axioms/axioma-paralelas-hiperbolico.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/altura.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/angulo.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/angulos-suplementarios.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/bisectriz.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/circunferencia.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/congruencia.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/contenido.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/cuadrilatero.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/definitions/estar-entre.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/incidencia.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/mediana.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/mediatriz.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/paralelas.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/paralelogramo.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/definitions/perpendicular.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/plano.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/punto.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/recta.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/segmento.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/semirrecta.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/teoria-medida-area.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/definitions/triangulo.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/lessons/leccion-metodo-constructivo.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/lessons/leccion-metodo-contradiccion.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/lessons/leccion-metodo-contraposicion.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/lessons/leccion-metodo-directo.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/lessons/leccion-metodo-exhaustivo.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/lessons/leccion-metodo-geometrico.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/lessons/leccion-metodo-induccion.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/mathematicians/euclides.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/mathematicians/pitagoras.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/mathematicians/tales.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/models/modelo-cartesiano.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/models/modelo-fano.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/models/modelo-poincare.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/models/modelo-tres-puntos.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/plans/plan-de-estudio-camino-teorema-pitagoras.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/theorems/corolario-rectas-coincidentes.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/lema-punto-medio.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-angulo-externo.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/theorems/teorema-angulos-alternos-internos.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-angulos-opuestos-verticales.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-area-aditividad.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-area-invariancia.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-area-rectangulo.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/theorems/teorema-area-triangulo.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-congruencia-aal.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-congruencia-ala.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/theorems/teorema-congruencia-lll.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/theorems/teorema-desigualdad-triangular.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-dos-rectas-un-punto.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-existencia-bisectriz.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-existencia-perpendicular.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-invariancia-triangulacion.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/theorems/teorema-pitagoras.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-punto-medio-perpendicular.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-reciproco-triangulo-isosceles.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-suma-angulos-triangulo.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-tales.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/theorems/teorema-triangulacion-poligono.mdx` | body | body-changed | Idempotente: Sí |
| `src/database/content/theorems/teorema-triangulo-isosceles.mdx` | unknown | - | Idempotente: Sí |
| `src/database/content/usecases/caso-gps-trilateracion.mdx` | body | body-changed | Idempotente: Sí |

### Clasificación: `exact` (6 archivos)

| Archivo | Regiones Afectadas | Señales | Info Adicional |
| :--- | :--- | :--- | :--- |
| `src/database/content/mathematicians/arquimedes.mdx` |  | - | Idempotente: Sí |
| `src/database/content/mathematicians/bolyai.mdx` |  | - | Idempotente: Sí |
| `src/database/content/mathematicians/dedekind.mdx` |  | - | Idempotente: Sí |
| `src/database/content/mathematicians/hilbert.mdx` |  | - | Idempotente: Sí |
| `src/database/content/mathematicians/lobachevski.mdx` |  | - | Idempotente: Sí |
| `src/database/content/mathematicians/pasch.mdx` |  | - | Idempotente: Sí |

## Limitaciones del Análisis

* Este auditor evalúa el comportamiento del parser regex actual. El parser carece de un modelo AST completo, por lo que ciertos anidamientos complejos de JSX (ej. componentes dentro de propiedades o bloques indentados dentro de etiquetas) pueden perderse o corromperse.
* La clasificación `format-only` se aplica con extrema precaución, requiriendo correspondencia exacta después de normalizar el BOM y los saltos de línea extremos.

## Puerta de Calidad Estricta (Fase 3)

* En la Fase 3 se exigirá que no exista ningún archivo catalogado como `semantic-risk`, `non-idempotent`, `parse-error` o `unknown`. Actualmente, esta puerta fallará debido a las deficiencias conocidas del parser de producción.
