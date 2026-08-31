# Grafo Lógico, Enlaces Hipertextuales, Paridad Trilingüe y Causalidad (`isDependency`)

El conocimiento en Matematika se estructura como un **Grafo Acíclico Dirigido (DAG)** de dependencias lógicas y una red hipertextual abierta de navegación conceptual.

---

## 1. Principio de Grafo Abierto y Enlaces a Páginas Futuras

- **Es totalmente obligatorio y prioritario enlazar a todo concepto, axioma, teorema o método matemático con `<ConceptLink targetId="...">`, exista o no el archivo en el repositorio.**
- En la interfaz web, los enlaces hacia páginas pendientes se renderizan como enlaces activos hacia una vista pedagógica provisional (*"En construcción"*), permitiendo al lector visualizar la red conceptual global.
- En la suite de validación estática (`npm run validate-references`), los enlaces a IDs aún no creados generan avisos informativos (`[WARN]`), **sin bloquear la compilación**.

---

## 2. Causalidad Lógica con `isDependency` vs. Hiperenlaces Contextuales

El atributo `isDependency={true}` en `<ConceptLink>` se reserva **estrictamente** para construir el Grafo Acíclico Dirigido (DAG) deductivo:

```tsx
<!-- Dependencia causal deductiva formal (construye el DAG): -->
<ConceptLink isDependency={true} targetId="axioma-congruencia-5">Axioma III.5 (LAL)</ConceptLink>

<!-- Hiperenlace contextual o pedagógico estándar (NO afecta al DAG): -->
<ConceptLink targetId="geometria-sintetica">geometría sintética</ConceptLink>
```

### Matriz de Reglas Rigurosas para `isDependency`

| Contexto / Tipo / Subtipo | Regla de `isDependency` | Justificación y Ejemplos |
| :--- | :--- | :--- |
| **Concepto primitivo** (`subtype: "primitivo"`) | **Prohibido `isDependency={true}`** (Omitir) | Nodo raíz de Grado 0 absoluto (`punto`, `recta`, `plano`, `incidencia`, `concepto-primitivo`). Los axiomas los gobiernan pero no los definen. |
| **Axiomas (`type: "axioma"`)** | **Obligatorio en primitivos de signatura** | Se aplica a los términos primitivos de su signatura (`punto`, `recta`, `plano`) y a las relaciones primitivas que postula (`incidencia`, `estar-entre`, `congruencia`), actuando como Grado $-1$ del DAG. |
| **Concepto derivado** (`subtype: "derivado"`) | **`true` en conceptos y axiomas constitutivos** | Elementos esenciales sin los cuales el concepto no puede definirse (e.g. `semiplano` $\to$ `recta`, `plano`, `segmento`, `axioma-orden-4`; `triangulo-rectangulo` $\to$ `triangulo`, `angulo`, `perpendicular`). |
| **Conceptos nominales / Meta-conceptos** | **Omitir o `false`** | Nociones estructurales o de teoría de modelos (`dimension`, `signatura`, `estructura-geometrica`, `dominio`, `conjunto-disjunto`) que no actúan como cuellos de botella en el DAG deductivo. |
| **Teoremas (`type: "teorema"` / `type: "lema"`)** | **`true` en axiomas, teoremas y lemas antecedentes** | Justifica los fundamentos lógicos del enunciado. **Prohibido marcar `isDependency={true}` hacia su propia demostración**. |
| **Demostraciones (`type: "demostracion"`)** | **`true` en axiomas, lemas y método de prueba** | Enlaza con `isDependency={true}` a los axiomas o lemas utilizados como pasos de inferencia y al método formal (`metodo-contradiccion`, `metodo-directo`). |
| **Modelos (`type: "modelo"`)** | **Omitir** (`false` por defecto) | Un modelo es una estructura semántica de satisfacción, no un nodo deductivo antecedente. |
| **Ejercicios y Ejemplos** (`type: "ejercicio"`, `"ejemplo"`) | **`true` en el teorema/definición evaluada** | Conecta la aplicación práctica con su fundamento teórico. |
| **Biografías históricas (`type: "matematico"`)** | **Prohibido** | Las entradas biográficas no intervienen en las cadenas de inferencia lógica. |
| **Autorreferencia y Ciclos** | **Terminantemente Prohibido** | Prohibido enlazar con `isDependency={true}` al propio ID del archivo o crear cadenas de dependencia circulares ($A \to B \to A$). |

---

## 3. Paridad Trilingüe Estricta (`es`, `en`, `eu`)

- **Coincidencia 1:1 absoluta:** Todo `<ConceptLink targetId="...">` introducido en el texto en castellano (`es/`) **debe estar presente de forma idéntica en las versiones en inglés (`en/`) y euskera (`eu/`)**.
- **Coherencia de `isDependency`:** Si un enlace lleva `isDependency={true}` en un idioma, debe llevarlo exactamente igual en los otros dos.
- **Correspondencia en diagramas:** Los identificadores de elementos y colores en `<VisualBind>` deben coincidir 1:1 en las tres variantes lingüísticas.

---

## 4. Catálogo Canónico de `targetId`

Para asegurar la uniformidad absoluta en todo el corpus documental, se deben emplear los siguientes identificadores kebab-case canónicos:

| Área Temática | Término / Concepto | `targetId` Canónico |
| :--- | :--- | :--- |
| **Geometría Sintética Base** | Punto / Recta / Plano / Semiplano / Espacio | `punto`, `recta`, `plano`, `semiplano`, `espacio` |
| | Segmento / Semirrecta (Rayo) / Ángulo | `segmento`, `semirrecta`, `angulo` |
| | Triángulo / Polígono / Poliedro | `triangulo`, `poligono`, `poliedro` |
| | Incidencia / Traza de incidencia puntual | `incidencia`, `traza` |
| | Colinealidad / Coplanaridad / Paralelismo | `colinealidad`, `coplanaridad`, `paralelas` |
| | Orden e intermediación ($A * B * C$) | `estar-entre` |
| **Congruencia y Figuras** | Congruencia / Congruencia de triángulos | `congruencia`, `congruencia-triangulos` |
| | Ángulos suplementarios / Ángulos adyacentes | `angulos-suplementarios`, `angulos-adyacentes` |
| | Ángulos opuestos por el vértice / Ángulo recto | `angulos-opuestos-vertice`, `angulo-recto` |
| | Perpendicularidad / Rectas perpendiculares | `perpendicular`, `rectas-perpendiculares` |
| | Triángulo rectángulo / Hipotenusa / Cateto | `triangulo-rectangulo`, `hipotenusa`, `cateto` |
| | Triángulo isósceles / Triángulo equilátero / Triángulo escaleno | `triangulo-isosceles`, `triangulo-equilatero`, `triangulo-escaleno` |
| | Bisectriz de un ángulo / Mediatriz de un segmento | `bisectriz`, `mediatriz` |
| | Vértice / Lado / Base / Ángulo en la base | `vertice`, `lado`, `base`, `angulo-base` |
| | Criterios de congruencia (LAL, ALA, LLL, LAA) | `criterio-congruencia`, `criterio-lal`, `criterio-ala`, `criterio-lll`, `criterio-laa` |
| **Axiomas de Congruencia** | Axioma III.1 (Transporte de segmentos) | `axioma-congruencia-1` |
| | Axioma III.2 (Transitividad de segmentos) | `axioma-congruencia-2` |
| | Axioma III.3 (Aditividad de segmentos) | `axioma-congruencia-3` |
| | Axioma III.4 (Transporte de ángulos) | `axioma-congruencia-4` |
| | Axioma III.5 (Criterio LAL) | `axioma-congruencia-5` |
| **Paralelismo y No Euclidianas** | Axioma de paralelas euclídeo / Axioma de Playfair | `axioma-paralelas-euclides`, `axioma-playfair` |
| | Axioma de paralelas hiperbólico / Ángulo de paralelismo | `axioma-paralelas-hiperbolico`, `angulo-paralelismo` |
| | Recta secante / Rectas paralelas / Rectas ultraparalelas | `secante`, `paralelas`, `ultraparalelas` |
| | Rectas cruzadas (alabeadas) / Planos paralelos | `rectas-cruzadas`, `planos-paralelos` |
| | Ángulos alternos internos / Ángulos correspondientes | `angulos-alternos-internos`, `angulos-correspondientes` |
| **Continuidad y Métricas** | Continuidad / Axioma de Arquímedes / Axioma de completitud | `continuidad`, `axioma-arquimedes`, `axioma-completitud` |
| | Axioma de Cantor / Cortadura de Dedekind | `axioma-cantor`, `cortadura-dedekind` |
| | Distancia métrica / Métrica euclidiana / Espacio métrico | `distancia`, `metrica-euclidiana`, `espacio-metrico` |
| **Sistemas Axiomáticos** | Sistema de incidencia / Sistema absoluto | `sistema-incidencia`, `sistema-absoluto` |
| | Sistema euclidiano / Sistema hiperbólico / Geometría elíptica | `sistema-euclidiano`, `sistema-hiperbolico`, `geometria-eliptica` |
| | Geometría sintética / hilbertiana / analítica | `geometria-sintetica`, `geometria-hilbertiana`, `geometria-analitica` |
| **Teoremas Clásicos** | Teorema del triángulo isósceles (Pons Asinorum) | `teorema-triangulo-isosceles` |
| | Teorema de los ángulos opuestos por el vértice | `teorema-angulos-opuestos-verticales` |
| | Teorema de congruencia ALA | `teorema-congruencia-ala` |
| | Teorema de ángulos alternos internos | `teorema-angulos-alternos-internos` |
| | Teorema de la suma angular del triángulo | `teorema-suma-angulos-triangulo` |
| | Teorema de Tales / Teorema de Pitágoras | `teorema-tales`, `teorema-pitagoras` |
| | Teorema del área del rectángulo / triángulo | `teorema-area-rectangulo`, `teorema-area-triangulo` |
| | Teorema de aditividad del área | `teorema-area-aditividad` |
| | Teorema de Desargues / Teorema de Pappus | `teorema-desargues`, `teorema-pappus` |
| **Demostraciones** | Demostración: Triángulo isósceles | `demo-triangulo-isosceles` |
| | Demostración: Ángulos opuestos por el vértice | `demo-angulos-opuestos-verticales` |
| | Demostración: Existencia y unicidad de la bisectriz | `demo-existencia-bisectriz` |
| | Demostración: Ángulos alternos internos | `demo-angulos-alternos-internos` |
| | Demostración: Suma angular del triángulo | `demo-suma-angulos-triangulo` |
| | Demostración: Tales / Pitágoras (Euclides / Áreas) | `demo-tales`, `demo-pitagoras-euclides`, `demo-pitagoras-areas` |
| | Demostración: Área del rectángulo / triángulo / aditividad | `demo-area-rectangulo`, `demo-area-triangulo`, `demo-area-aditividad` |
| **Métodos de Demostración** | Método directo / Por contradicción (Reductio ad absurdum) | `metodo-directo`, `metodo-contradiccion` |
| | Inducción matemática / Método por disección de áreas | `metodo-induccion`, `metodo-diseccion-areas` |
| **Modelos Semánticos** | Modelo tres puntos / Plano de Fano | `modelo-tres-puntos`, `modelo-fano` |
| | Plano cartesiano / Disco de Poincaré / Semiplano de Poincaré | `modelo-cartesiano`, `modelo-poincare`, `modelo-semiplano-poincare` |
| **Lógica y Fundamentos** | Lógica matemática / Teoría de modelos / Consistencia lógica | `logica`, `teoria-modelos`, `consistencia-logica` |
| | Signatura formal / Estructura matemática / Dominio primitivo | `signatura`, `estructura-geometrica`, `dominio` |
| | Relación binaria / Relación de equivalencia / Clase de equivalencia | `relacion-binaria`, `relacion-equivalencia`, `clase-equivalencia` |
| | Función / Operador / Aplicación / Inyectividad | `funcion`, `operador`, `aplicacion`, `inyectividad` |
| | Conjunto potencia / Conjunto disjunto / Conjunto convexo / Partición | `conjunto-potencia`, `conjunto-disjunto`, `conjunto-convexo`, `particion` |
| **Álgebra y Cuadriláteros** | Cuadrilátero / Paralelogramo / Rectángulo / Cuadrado | `cuadrilatero`, `paralelogramo`, `rectangulo`, `cuadrado` |
| | Circunferencia / Radio / Diámetro | `circunferencia`, `radio`, `diametro` |
| | Grupo / Cuerpo / Espacio vectorial / Isomorfismo | `grupo`, `cuerpo`, `espacio-vectorial`, `isomorfismo` |
| **Matemáticos Históricos** | Euclides / Hilbert / Pasch / Fano / Pitágoras / Tales | `euclides`, `hilbert`, `pasch`, `fano`, `pitagoras`, `tales` |
| | Arquímedes / Dedekind / Descartes / Peano / Bolyai / Lobachevski | `arquimedes`, `dedekind`, `descartes`, `peano`, `bolyai`, `lobachevski` |
| | Fermat / Poncelet / Staudt / Steiner / Menger / Lebesgue / Hurewicz / Urysón / Wallman | `fermat`, `poncelet`, `staudt`, `steiner`, `menger`, `lebesgue`, `hurewicz`, `urysohn`, `wallman` |
