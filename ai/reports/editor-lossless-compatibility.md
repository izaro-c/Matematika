# Informe de Compatibilidad Lossless del Corpus

Este informe detalla el nivel de compatibilidad de los documentos del corpus con el nuevo motor de edición sin pérdidas (lossless).

## Resumen de Compatibilidad

| Compatibilidad | Cantidad | Porcentaje |
| :--- | ---: | ---: |
| **fully-editable** | 0 | 0.00% |
| **partially-editable** | 0 | 0.00% |
| **read-only** | 85 | 70.83% |
| **unsupported** | 35 | 29.17% |
| **Total** | **120** | **100.00%** |

## Detalle por Archivo

| Archivo | Compatibilidad | Bloques (Edit/Opaque) | Razones / Diagnósticos |
| :--- | :---: | :---: | :--- |
| `src/database/content/axiomatic-systems/sistema-absoluto.mdx` | `read-only` | 24 (6/18) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axiomatic-systems/sistema-euclidiano.mdx` | `read-only` | 15 (2/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axiomatic-systems/sistema-hiperbolico.mdx` | `read-only` | 17 (3/14) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axiomatic-systems/sistema-incidencia.mdx` | `read-only` | 16 (3/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-arquimedes.mdx` | `read-only` | 16 (3/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-completitud.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/axioms/axioma-congruencia-1.mdx` | `read-only` | 16 (3/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-congruencia-2.mdx` | `read-only` | 14 (3/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-congruencia-3.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/axioms/axioma-congruencia-4.mdx` | `read-only` | 16 (4/12) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-congruencia-5.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/axioms/axioma-incidencia-1.mdx` | `read-only` | 15 (3/12) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-incidencia-2.mdx` | `read-only` | 13 (3/10) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-incidencia-3.mdx` | `read-only` | 14 (3/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-incidencia-4.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/axioms/axioma-incidencia-5.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/axioms/axioma-incidencia-6.mdx` | `read-only` | 13 (3/10) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-incidencia-7.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/axioms/axioma-incidencia-8.mdx` | `read-only` | 13 (3/10) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-orden-1.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/axioms/axioma-orden-2.mdx` | `read-only` | 13 (4/9) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-orden-3.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/axioms/axioma-orden-4.mdx` | `read-only` | 14 (3/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-paralelas-euclides.mdx` | `read-only` | 16 (3/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/axioms/axioma-paralelas-hiperbolico.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/definitions/altura.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/definitions/angulo.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/definitions/angulos-suplementarios.mdx` | `read-only` | 17 (8/9) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/bisectriz.mdx` | `read-only` | 20 (4/16) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/circunferencia.mdx` | `read-only` | 14 (3/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/congruencia.mdx` | `read-only` | 11 (3/8) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/contenido.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/definitions/cuadrilatero.mdx` | `read-only` | 20 (5/15) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/estar-entre.mdx` | `read-only` | 11 (3/8) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/incidencia.mdx` | `read-only` | 12 (3/9) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/mediana.mdx` | `read-only` | 17 (3/14) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/mediatriz.mdx` | `read-only` | 18 (4/14) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/paralelas.mdx` | `read-only` | 13 (3/10) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/paralelogramo.mdx` | `read-only` | 20 (4/16) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/perpendicular.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/definitions/plano.mdx` | `read-only` | 14 (4/10) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/punto.mdx` | `read-only` | 14 (4/10) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/recta.mdx` | `read-only` | 16 (5/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/segmento.mdx` | `read-only` | 18 (5/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/definitions/semirrecta.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/definitions/teoria-medida-area.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/definitions/triangulo.mdx` | `read-only` | 15 (4/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-angulo-externo.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-angulos-alternos-internos.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/demonstrations/demo-angulos-opuestos-verticales.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-area-aditividad.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-area-invariancia.mdx` | `read-only` | 2 (0/2) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-area-rectangulo.mdx` | `read-only` | 4 (0/4) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-area-triangulo.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/demonstrations/demo-congruencia-aal.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/demonstrations/demo-congruencia-ala.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/demonstrations/demo-congruencia-lll.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/demonstrations/demo-desigualdad-triangular.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-dos-rectas-un-punto.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-existencia-bisectriz.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/demonstrations/demo-existencia-perpendicular.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-invariancia-triangulacion.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/demonstrations/demo-pitagoras-areas.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-pitagoras-euclides.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-punto-medio-perpendicular.mdx` | `read-only` | 2 (0/2) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-punto-medio.mdx` | `read-only` | 2 (0/2) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-reciproco-triangulo-isosceles.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-rectas-coincidentes.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-suma-angulos-triangulo.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/demonstrations/demo-tales.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/demonstrations/demo-triangulacion-poligono.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/demonstrations/demo-triangulo-isosceles.mdx` | `read-only` | 3 (0/3) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/examples/ejemplo-pitagoras-calculo.mdx` | `read-only` | 10 (2/8) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/exercises/ejercicio-pitagoras-cateto.mdx` | `read-only` | 8 (0/8) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/lessons/leccion-metodo-constructivo.mdx` | `read-only` | 21 (9/12) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/lessons/leccion-metodo-contradiccion.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/lessons/leccion-metodo-contraposicion.mdx` | `read-only` | 23 (10/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/lessons/leccion-metodo-directo.mdx` | `read-only` | 26 (12/14) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/lessons/leccion-metodo-exhaustivo.mdx` | `read-only` | 25 (10/15) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/lessons/leccion-metodo-geometrico.mdx` | `read-only` | 27 (14/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/lessons/leccion-metodo-induccion.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/mathematicians/arquimedes.mdx` | `read-only` | 7 (2/5) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/mathematicians/bolyai.mdx` | `read-only` | 7 (1/6) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/mathematicians/dedekind.mdx` | `read-only` | 7 (3/4) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/mathematicians/euclides.mdx` | `read-only` | 14 (3/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/mathematicians/hilbert.mdx` | `read-only` | 10 (3/7) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/mathematicians/lobachevski.mdx` | `read-only` | 7 (1/6) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/mathematicians/pasch.mdx` | `read-only` | 7 (1/6) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/mathematicians/pitagoras.mdx` | `read-only` | 12 (5/7) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/mathematicians/tales.mdx` | `read-only` | 13 (5/8) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/models/modelo-cartesiano.mdx` | `read-only` | 13 (2/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/models/modelo-fano.mdx` | `read-only` | 14 (1/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/models/modelo-poincare.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/models/modelo-tres-puntos.mdx` | `read-only` | 24 (5/19) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/plans/plan-de-estudio-camino-teorema-pitagoras.mdx` | `read-only` | 31 (11/20) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/corolario-rectas-coincidentes.mdx` | `read-only` | 12 (3/9) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/lema-punto-medio.mdx` | `read-only` | 13 (2/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-angulo-externo.mdx` | `read-only` | 14 (3/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-angulos-alternos-internos.mdx` | `read-only` | 17 (3/14) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-angulos-opuestos-verticales.mdx` | `read-only` | 11 (2/9) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-area-aditividad.mdx` | `read-only` | 11 (3/8) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-area-invariancia.mdx` | `read-only` | 12 (3/9) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-area-rectangulo.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/theorems/teorema-area-triangulo.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/theorems/teorema-congruencia-aal.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/theorems/teorema-congruencia-ala.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/theorems/teorema-congruencia-lll.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/theorems/teorema-desigualdad-triangular.mdx` | `read-only` | 14 (3/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-dos-rectas-un-punto.mdx` | `read-only` | 13 (3/10) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-existencia-bisectriz.mdx` | `read-only` | 13 (3/10) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-existencia-perpendicular.mdx` | `read-only` | 14 (3/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-invariancia-triangulacion.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/theorems/teorema-pitagoras.mdx` | `read-only` | 16 (3/13) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-punto-medio-perpendicular.mdx` | `read-only` | 15 (3/12) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-reciproco-triangulo-isosceles.mdx` | `read-only` | 15 (3/12) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-suma-angulos-triangulo.mdx` | `read-only` | 14 (3/11) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/theorems/teorema-tales.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/theorems/teorema-triangulacion-poligono.mdx` | `unsupported` | 0 (0/0) | Document contains critical parse exceptions. |
| `src/database/content/theorems/teorema-triangulo-isosceles.mdx` | `read-only` | 15 (3/12) | Document has ESM imports or exports (read-only visual mode). |
| `src/database/content/usecases/caso-gps-trilateracion.mdx` | `read-only` | 18 (4/14) | Document has ESM imports or exports (read-only visual mode). |
