<!-- 2026-10-24 · opus/high · $2.45 · 59 turnos · corregido 0b9bc41f · propuestas fd6eb9e4 -->

## cardinalidad — rigor ✗ · simpleza △ · modularidad △ · enlaces △ · paridad ✗ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: «$|A| = |B| \iff \exists f\colon A \longrightarrow B \quad (f \text{ biyectiva})$» → «$A \sim B \iff \exists f\colon A \longrightarrow B \quad (f \text{ biyectiva})$». Después se añade: «La equipotencia es una relación de equivalencia, porque la identidad, la inversa de una biyección y la composición de dos biyecciones son biyecciones. Por eso se escribe $\lvert A \rvert = \lvert B \rvert$ cuando $A \sim B$, y $\lvert A \rvert$ se llama **cardinalidad** de $A$.» — La prosa definía $A \sim B$, pero la fórmula usaba $|A|$, que nunca se definía. Además, escribir «=» exige que la equipotencia sea una relación de equivalencia, y esa justificación faltaba. Se enlazan `relacion-equivalencia`, `funcion-inversa` y `composicion-funciones`, sin dependencia.
- [rigor] es/en/eu: «se escribe $|A| \le |B|$ si existe una aplicación inyectiva de $A$ en $B$» → se añade «y $\lvert A \rvert < \lvert B \rvert$ si además $A$ y $B$ no son equipotentes». — El teorema de Cantor usaba «<» sin que estuviera definido.
- [rigor] es/en/eu: «En la geometría euclidiana continua, toda recta contiene $\mathfrak{c}$ puntos, una densidad que garantiza formalmente la continuidad geométrica y la ausencia de huecos en el espacio» → «Con los axiomas de continuidad (Axioma V.1 y Axioma V.2), la traza de toda recta $\ell$ está en biyección con $\mathbb{R}$, así que $\lvert \operatorname{tr}(\ell) \rvert = \mathfrak{c}$». — La frase original era falsa por tres motivos:
  - Invierte la implicación: tener $\mathfrak{c}$ puntos no garantiza la continuidad. Un contraejemplo es el plano cartesiano sobre un cuerpo ordenado no arquimediano de cardinal $\mathfrak{c}$, como $\mathbb{R}(t)$.
  - «Densidad» es una propiedad del orden, no del cardinal: $\mathbb{Q}$ es denso y numerable.
  - El resultado no es propio de la geometría euclidiana: vale con I–III y V.
  
  Ahora la frase usa $\operatorname{tr}(\ell)$, como piden las convenciones (§3). Se enlazan `axioma-arquimedes`, `axioma-completitud` y `traza`, y salen los enlaces `sistema-euclidiano` y `espacio`.
- [rigor] es/en/eu: «aplicación inyectiva» (`inyectividad`) ahora lleva `isDependency={true}`. — El orden $\le$ se define dentro del `<Definicion>` mediante inyecciones, así que la inyectividad es constitutiva.
- [rigor] es/en/eu: «entonces necesariamente $|A| = |B|$» → «entonces $\lvert A \rvert = \lvert B \rvert$». — «Necesariamente» es un intensificador vacío (convenciones §4).
- [enlaces] es/en/eu: «teorema de Cantor-Bernstein-Schröder» y «teorema de Cantor» no tenían enlace → `<ConceptLink targetId="teorema-cantor-bernstein">` y `<ConceptLink targetId="teorema-cantor">`. — Pilar 2. Son IDs canónicos nuevos; comprobé con Grep que no se usaban en el corpus.
- [enlaces] es/en/eu: «La potencia del continuo» → enlazada a `potencia-del-continuo`, el ID que ya usa `numero-real`. Además, «7 puntos» → `<ConceptLink targetId="punto">`, que recupera el enlace a `punto` que se perdió al reescribir la viñeta del continuo.
- [notación] es/en/eu: todas las apariciones de `|A|`, `|\mathbb{N}|`, `|\mathbb{R}|`… → `\lvert … \rvert`. — Así lo pide la tabla de notación KaTeX para la cardinalidad («`|S|` sin balanceo», desaconsejado).
- [paridad] en: «<Capitular letra="C" />ardinality **(or** cardinal number)» → «<Capitular letra="C" />**ardinality** (or cardinal number)». — La negrita caía sobre «(or» y no sobre el término definido.
- [paridad] en: «its power set <ConceptLink targetId="conjunto-potencia">$\wp(A)$</ConceptLink>» → «its <ConceptLink targetId="conjunto-potencia">power set</ConceptLink> $\wp(A)$». — Era KaTeX dentro de un enlace (Golden Rule 1) y no coincidía con `es`/`eu`, donde el enlace está en el nombre.
- [rigor] es/en/eu, `description`: «Medida del tamaño o cantidad de elementos de un conjunto formalizada mediante clases de equipotencia bajo biyecciones.» → «Tamaño de un conjunto: dos conjuntos tienen la misma cardinalidad si y solo si existe una biyección entre ellos.» — El texto no usa clases de equipotencia, y «medida» induce a confusión con la teoría de la medida.

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «Introducida por Georg Cantor, la teoría de cardinales supera las paradojas del infinito prescindiendo del recuento secuencial y fundándose en el principio de equipotencia: dos conjuntos poseen el mismo tamaño intrínseco si y solo si…» → «Georg Cantor la fundó en la equipotencia y no en el recuento, lo que permite comparar también conjuntos infinitos. Con este criterio, un conjunto infinito puede ser equipotente a una parte propia suya: $n \longmapsto 2n$ es una biyección de $\mathbb{N}$ en el conjunto de los números pares.» — El segundo párrafo repetía la definición. Ahora aporta el ejemplo que explica de qué «paradoja» se trataba. Alternativa descartada: borrar el párrafo.
- [simpleza] es/en/eu: «aplicable con plena validez tanto a» → «aplicable tanto a» (y «with full validity», «erabateko baliozkotasunez»). — Era un adjetivo valorativo.
- [modularidad] es/en/eu: los teoremas de Cantor-Bernstein-Schröder y de Cantor salen del `<Definicion>` a un párrafo propio: «Dos teoremas dan forma a este orden. El teorema de Cantor-Bernstein-Schröder lo hace antisimétrico: … El teorema de Cantor impide que tenga un máximo: …». — Son teoremas con nodo propio, no parte de la definición. Alternativa descartada: una `<SeccionPropiedades>` con dos `<PropiedadItem>` (ids `teorema-cantor-bernstein` y `teorema-cantor`).
- [rigor/enlaces] es/en/eu: «El cardinal $\aleph_0 = …$, característico de las sucesiones discretas y los números racionales» → «El cardinal $\aleph_0 = …$ de los conjuntos numerables infinitos, como los números naturales y los números racionales». — «Sucesiones discretas» no tiene un sentido preciso. Se añaden enlaces a `conjunto-numerable` (ID nuevo) y `numero-natural`.

### Pendiente para la autora
- [fuentes] es/en/eu: «Über eine Eigenschaft des Inbegriffes aller reellen algebraischen Zahlen … 77 (1874)» — Ese artículo prueba que $\mathbb{R}$ no es numerable, pero el concepto de *Mächtigkeit* (equipotencia) aparece en «Ein Beitrag zur Mannigfaltigkeitslehre», *J. reine angew. Math.* 84 (1878). No puedo comprobar desde el repositorio cuál conviene citar como fuente primaria.
- [fuentes] es/en/eu: «Naive Set Theory … Capítulos 21–24» — Por lo que recuerdo del índice de Halmos, la §21 es aritmética ordinal y «Cardinal Numbers» es la §25, así que el rango correcto sería 22–25. No lo puedo verificar desde el repositorio.

### Avisos de los scripts
- check-links «entre» (es) / «between» (en) — descartados: es «el orden entre cardinales», no la intermediación $A * B * C$.
- check-links «elementuak» (eu) — descartado: son los elementos de un conjunto, no los *Elementos* de Euclides.
- check-links «teoremas» / «theorems» / «teoremek» (tras las propuestas) — descartados: es una mención de nivel meta, y los dos teoremas se enlazan por su nombre en la frase siguiente.
- En la versión intermedia también salieron «composición», «inverse» y «puntos» — corregidos con los enlaces `composicion-funciones`, `funcion-inversa` y `punto`.

### Diagrama
No necesita. Probé a imaginar dos manipulaciones:
- **Emparejar dos conjuntos finitos con flechas** y ver cuándo se puede formar una biyección: es exactamente lo que enseña `BiyeccionSagital.tsx` en la página `biyeccion`. Aquí solo lo repetiría.
- **Desplazar el emparejamiento $n \mapsto 2n$** entre $\mathbb{N}$ y los pares con posiciones discretas: el lector solo vería una correspondencia fija avanzar. No hay ninguna condición que pueda romper ni hipótesis que deba variar, así que sería una figura estática animada.

Lo propio de esta página (Cantor-Bernstein, $\lvert A \rvert < \lvert \wp(A) \rvert$, $\aleph_0$ y $\mathfrak{c}$) no tiene un objeto manipulable que enseñe más que el texto.

### Resumen
Ahora se define $\lvert A \rvert$ (antes se usaba sin definir) y también «<». Se corrige la afirmación falsa de que $\mathfrak{c}$ puntos garantizan la continuidad, `inyectividad` pasa a ser dependencia y se arreglan la notación $\lvert\cdot\rvert$ y dos fallos de paridad en `en`. Como propuestas: el segundo párrafo ya no repite la definición, los teoremas salen del bloque de definición y se precisa $\aleph_0$. Quedan para la autora las dos fuentes por verificar.

Nota: mi primer `validate-nodes` manual regeneró `src/data/graph/graph_structure.json`, que `checkpoint.sh` rechaza, y no tenía permiso para revertirlo con git. Ejecuté `checkpoint.sh discard`, reescribí los tres MDX y guardé sin volver a validar a mano. Los dos commits son `0b9bc41f` (correcciones) y `fd6eb9e4` (propuestas).

══ TODO OK · 1 nodo(s): cardinalidad
VEREDICTO: errores
