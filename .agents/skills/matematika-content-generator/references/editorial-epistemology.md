# Filosofía Editorial y Principios Epistemológicos de Redacción

La enciclopedia modela el conocimiento matemático como un **grafo de nodos atómicos hiperenlazados**. Para asegurar que el contenido sea riguroso, pedagógico y universalmente accesible, toda redacción debe regirse por los siguientes principios meta-editoriales:

---

## 1. Principio de Inmediación Ontológica, Entrada Directa y Tono No Defensivo

- **Apertura descriptiva pura (Cero introducciones metatextuales):** La primera oración de un nodo debe enunciar de forma directa y asertiva la definición, el postulado o el hecho matemático nuclear en lenguaje natural sobrio.
  - **En axiomas (`type: "axioma"`):** Comenzar directamente con el enunciado geométrico del postulado (e.g. *«Por tres puntos no colineales pasa a lo sumo un plano.»* o *«Si dos puntos distintos de una recta inciden en un plano...»*). Queda estrictamente prohibido iniciar con fórmulas metalingüísticas redundantes como *«El Axioma I.X de Hilbert establece...»* o *«Este axioma describe...»*, dado que el título y los metadatos ya identifican unívocamente la entidad.
  - **En definiciones (`type: "definicion"`):** Definir inmediatamente el dominio o la clase de objeto formal (e.g. *«Un punto es cualquier elemento del dominio primitivo...»*).
  - **En modelos (`type: "modelo"`):** Declarar de entrada la estructura formal y el marco de satisfacción (e.g. *«El modelo de tres puntos es una estructura geométrica finita que satisface...»*).
- **Accesibilidad universal y cero jerga burocrática:** La prosa debe ser limpia, fluida y transparente, sin exigir formación especializada previa para comprender las ideas fundamentales. Reemplazar verbos rebuscados (*«rige»*, *«marco ontológico»*) por verbos directos y funcionales: *«establece»*, *«describe»*, *«permite»*, *«determina»*, *«garantiza»*, *«satisface»*, *«induce»*.
- **Tono asertivo y no defensivo:** Presentar las definiciones directamente por lo que son, sin caer en sobre-correcciones o explicaciones negativas innecesarias (e.g. evitar frases reactivas como *«no se definen como subconjuntos unos de otros...»* o *«sin reducir unos a colecciones de otros...»* a menos que se trate explícitamente de una sección comparativa entre modelos).
- **Cero redundancias léxicas y sintéticas:**
  - No repetir la misma cualidad o predicado (e.g. *«convexa»*) de manera reiterativa entre la entradilla, la definición formal y la sección de propiedades.
  - En geometría sintética politipada, no superponer de forma redundante *«contener»* e *«incidir»* (e.g. evitar *«toda recta contiene al menos dos puntos distintos que inciden en ella»*); emplear la formulación canónica directa: *«toda recta incide al menos con dos puntos distintos»*.
- **Títulos y encabezados claros, naturales y sobrios:**
  - Emplear siempre títulos y subtítulos directos y sobrios (e.g. `### Geometría plana y espacial`, `### Modelos y consistencia`, `### Definición formal`).
  - Prohibido utilizar encabezados inflados de corte metamatemático barroco o pomposo (e.g. evitar *«Modularidad y estratificación dimensional»*, *«Propiedades metalógicas del sistema»* o *«Teoremas fundamentales derivados de la incidencia»*).
- **Intuición previa a la formalización:** Explicar siempre de forma directa y sencilla el significado intuitivo del objeto antes de presentar el bloque formal formalizado.

---

## 2. Principio de Disciplina de Tipos, Dominios Primitivos y Trazas Puntuales

- **Politipado estricto en estructuras multisort:** En teorías axiomáticas multisort (como la geometría sintética de Hilbert $\mathcal{S}_{\text{Hil}} = (\mathcal{P}, \mathcal{L}, \Pi, \dots)$), los dominios primitivos poseen el mismo rango ontológico y son conjuntos mutuamente disjuntos ($\mathcal{P} \cap \mathcal{L} = \emptyset$, $\mathcal{P} \cap \Pi = \emptyset$, $\mathcal{L} \cap \Pi = \emptyset$). El universo global del discurso se particiona formalmente como $\mathcal{U} = \mathcal{P} \sqcup \mathcal{L} \sqcup \Pi$.
- **Uniformidad estricta en las definiciones primitivas:**
  - En `punto.mdx`: *«...es cualquier elemento del dominio primitivo de puntos $\mathcal{P}$»* ($P \in \mathcal{P}$).
  - En `recta.mdx`: *«...es cualquier elemento del dominio primitivo de rectas $\mathcal{L}$»* ($\ell \in \mathcal{L}$).
  - En `plano.mdx`: *«...es cualquier elemento del dominio primitivo de planos $\Pi$»* ($\pi \in \Pi$).
  - Prohibido referirse a $\mathcal{P}$ como el «conjunto base» de toda la estructura, para evitar sugerir erróneamente que las rectas o planos son meros subconjuntos de puntos en la base primitiva.
- **Prohibición de colapso de tipos (Type Mismatch):** Queda estrictamente prohibido aplicar relaciones de pertenencia o inclusión conjuntista entre dominios primitivos distintos:
  - Expresiones como $\ell \subseteq \pi$ o $\ell \cap \pi$ son inválidas porque una recta $\ell \in \mathcal{L}$ no es un subconjunto del plano $\pi \in \Pi$.
  - La relación primitiva formal en Hilbert es la **incidencia sintética** ($P \, \mathbf{I} \, \ell$, $P \, \mathbf{I} \, \pi$ con $\mathbf{I}_{\mathcal{P}\mathcal{L}} \subseteq \mathcal{P} \times \mathcal{L}$ e $\mathbf{I}_{\mathcal{P}\Pi} \subseteq \mathcal{P} \times \Pi$).
  - La inclusión lineal de una recta en un plano debe formularse mediante cuantificación pura sobre puntos:
    $$\forall P \in \mathcal{P} \ (P \, \mathbf{I} \, \ell \implies P \, \mathbf{I} \, \pi)$$
- **Mediación analítica por trazas de incidencia ($\operatorname{tr}$):**
  - Las expresiones $P \in \ell$, $P \in \pi$ o $\ell \subseteq \pi$ son abreviaciones informales admisibles únicamente si se explicitan como la **traza puntual** de los elementos incidentes:
    $$\operatorname{tr}(\ell) = \{ P \in \mathcal{P} \mid P \, \mathbf{I} \, \ell \}, \quad \operatorname{tr}(\pi) = \{ P \in \mathcal{P} \mid P \, \mathbf{I} \, \pi \}$$
  - En teoremas de intersección entre primitivos atómicos disjuntos (como dos planos $\pi_1 \neq \pi_2$ intersecándose en una recta $\ell$), formular rigurosamente sobre las trazas: $\operatorname{tr}(\ell) = \operatorname{tr}(\pi_1) \cap \operatorname{tr}(\pi_2)$.
- **Distinción explícita de puntos en lógica de primer orden:** En cuantificaciones existenciales que involucren múltiples puntos (como en I.3, I.5, I.7 o I.8), declarar siempre de forma explícita las condiciones de desigualdad mutua $(A \neq B \land B \neq C \land A \neq C)$ para asegurar interpretabilidad exacta en lógica de predicados.
- **Evitar el sesgo del artículo determinado:** Prohibido usar *«el»* o *«la»* cuando existan múltiples entidades del mismo rango epistemológico. Usar *«un concepto primitivo»* (coexiste con rectas y planos), *«un sistema formal»* o *«una relación de orden»*, evitando sugerir falsas unicidades salvo cuando exista un teorema formal de unicidad.

---

## 3. Principio de Deslinde entre Semántica de Modelos y Metalógica

- **Satisfacción frente a Verificación:**
  - En una estructura concreta $\mathcal{M}$, la validez de los axiomas de una teoría formal $\mathcal{T}$ corresponde a la relación semántica de modelado: $\mathcal{M} \models \mathcal{T}$.
  - El grupo de propiedades que evalúa los axiomas debe titularse `Satisfacción de axiomas de...` (evitando «Verificación», que refiere al procedimiento algorítmico o metalógico de prueba).
- **Invariantes estructurales vs. Propiedades de la teoría:**
  - **Propiedades del modelo:** Son exclusivamente los invariantes intrínsecos de la tupla relacional (e.g. cardinalidad, regularidad combinatoria, autodualidad, transitividad del grupo de automorfismos, aciclicidad, dimensiones vectoriales, ausencia/presencia de paralelismo).
  - **Propiedades metalógicas:** La consistencia, completitud, decidibilidad o categoricidad son propiedades de la *teoría formal* $\mathcal{T}$, no de una estructura particular $\mathcal{M}$. Una estructura $\mathcal{M}$ actúa como *testigo semántico* de la consistencia de $\mathcal{T}$ (por el Teorema de Validez, $\exists \mathcal{M} \, (\mathcal{M} \models \mathcal{T}) \implies \operatorname{Cons}(\mathcal{T})$), pero la consistencia jamás debe listarse como un `<PropiedadItem>` interno del modelo.

---

## 4. Principio de Respeto a la Frontera Epistémica (Cero Anacronismo Teórico)

- **Prohibición de contaminación de marcos externos:** No atribuir a un objeto propiedades, dimensiones o etiquetas formales que sólo existen en teorías más ricas o posteriores (topológicas, analíticas o algebraicas) a menos que se aclare explícitamente dicha procedencia.
- **No atribuir orden, figuras poligonales o diferenciabilidad a primitivos de incidencia pura:**
  - No afirmar como propiedad intrínseca de la recta que *«se extiende indefinidamente en ambos sentidos»* en su definición básica de nivel 0, ya que nociones como *«sentido»* o *«prolongación ilimitada»* presuponen axiomas de orden lineal ($A * B * C$) y continuidad que no existen en geometrías de incidencia finitas (como Fano).
  - **Prohibición de figuras dependientes de orden en incidencia pura:** En el estrato de Incidencia pura (Grupo I de Hilbert), los **segmentos no existen todavía**, ya que requieren la relación primitiva de intermediación u orden lineal $A * X * B$ (Grupo II). Por tanto, en axiomas como I.3 (puntos no colineales), la terna no colineal **no determina un triángulo en el Grupo I**, sino los vértices fundamentales de la configuración discreta que dará lugar al triángulo una vez introducido el orden.
  - No emplear términos procedentes de variedades diferenciables (como *«superficie lisa»* o *«liso»*) para definir objetos primitivos como el plano; utilizar lenguaje puramente geométrico (*«superficie elemental uniforme y sin curvatura»*).
- **Prohibición de expresiones vagas:** Evitar etiquetas ambiguas o informales como *«geometría intuitiva»*; emplear siempre la denominación formal precisa (*«geometría elemental»*, *«geometría sintética»* o *«geometría euclidiana»*).
- **Preferencia por el lenguaje natural en lo intuitivo:** Si una propiedad de partida se puede formular con claridad en lenguaje llano (*«sin partes ni extensión dimensional»*), se debe emplear lenguaje natural en lugar de forzar etiquetas técnicas anacrónicas (*«dimensión inductiva cero»*) que aún no han sido construidas deductivamente en ese estrato.

---

## 5. Principio de Fidelidad al Orden Deductivo Real

- **No presuponer lo derivado en lo primitivo:** Nunca explicar una noción básica o primitiva asumiendo conceptos construidos a posteriori que dependen de ella.
- **Deslinde estricto entre axiomas existenciales y teoremas derivados:**
  - En los resúmenes y descripciones de axiomas puramente existenciales (como el **Axioma I.7**), no se debe atribuir al axioma la demostración completa de la figura resultante.
  - El Axioma I.7 postula estrictamente que si dos planos distintos comparten un punto, comparten al menos un **segundo punto común** ($B \neq A$); que su intersección sea *exactamente* la recta completa $\overleftrightarrow{AB}$ es un **teorema derivado** de la conjunción de I.7 con I.1, I.6 e I.4–I.5.
- **Completitud en cadenas deductivas de incidencia:**
  - Para demostrar formalmente que la intersección de dos planos distintos $\pi_1 \neq \pi_2$ es *exactamente* una recta $\overleftrightarrow{AB}$, la deducción formal requiere conjuntamente:
    1. Existencia de un segundo punto común ($B \neq A$, **Axioma I.7**).
    2. Existencia y unicidad de la recta determinada por dos puntos (**Axioma I.1**).
    3. Inclusión de la recta completa en ambos planos (**Axioma I.6**, $\operatorname{tr}(\overleftrightarrow{AB}) \subseteq \operatorname{tr}(\pi_1) \cap \operatorname{tr}(\pi_2)$).
    4. Unicidad del plano determinado por tres puntos no colineales (**Axiomas I.4 e I.5**), que garantiza que cualquier punto común exterior forzaría $\pi_1 = \pi_2$.
- **Diferenciación entre relación primitiva y construcción métrica:** Identificar siempre la relación primitiva pura (como la congruencia sintética $\cong$, el orden $*$ o la incidencia $\mathbf{I}$) frente a construcciones numéricas posteriores (como funciones de distancia $d(A,B) \in \mathbb{R}$, medidas de área o coordenadas numéricas). Por ejemplo, la congruencia compara pares de puntos directamente como segmentos congruentes; la distancia métrica es una construcción posterior.
- **Formulación del paralelismo euclidiano (Grupo IV):**
  - El axioma IV postula la **cota superior y unicidad** (a lo sumo una paralela coplanar por un punto exterior).
  - La **existencia** de al menos una paralela es un teorema previo demostrable en geometría absoluta (mediante ángulos alternos internos y orden), sin requerir el postulado euclidiano.
- **Definición formal precisa con «si y solo si» ($\iff$):** En definiciones de conceptos derivados (como el `semiplano`), enunciar las condiciones matemáticas de pertenencia de forma nítida y simétrica mediante $\iff$, explicitando los axiomas de los que dependen causalmente.

---

## 6. Principio de Estratificación Axiomática Condicional y Modularidad

- **Las propiedades no son intrínsecas, sino axiomáticas:** Los objetos matemáticos no poseen propiedades "mágicas" aisladas; su comportamiento depende estrictamente de las reglas que los axiomas establecen sobre ellos.
- **Formalización de Signaturas y Estructuras en Teoría de Modelos:**
  - **Signatura formal:** Tupla de 4 elementos $\sigma = (\mathcal{S}_{\text{sorts}}, \mathcal{F}, \mathcal{R}, \text{ar})$ donde $\text{ar}$ es la función de aridad tipada.
  - **Estructura general:** Tupla $\mathcal{S} = (\mathcal{D}_1, \dots, \mathcal{D}_k, \mathcal{F}_1, \dots, \mathcal{F}_p, \mathcal{R}_1, \dots, \mathcal{R}_m)$. En teorías puramente relacionales (como Hilbert), $\mathcal{F} = \emptyset$.
  - **Constantes algebraicas:** En signaturas politipadas, una constante (como el elemento neutro $e$ de un grupo) se formaliza sintácticamente como función 0-aria: $\text{ar}(e) = \emptyset \to G$, con tipo $\text{sort}(e) = G$.
  - **Desacoplamiento de tupla estructural y satisfacción semántica:** Separar la definición extensional de la tupla respecto a la relación de modelado: *«$\mathcal{S}_{\text{euc}} = (\mathcal{P}, \mathcal{L}, \Pi, \dots)$ tal que $\mathcal{S}_{\text{euc}} \models \mathcal{T}_{\text{abs}} \cup \{\text{Axioma IV}\}$»*, nunca concatenar la igualdad con $\models$ en una sola asignación.
- **Modularidad y desacoplamiento de conceptos auxiliares:**
  - Si un concepto formal (como `signatura`, `geometria-sintetica`, `geometria-hilbertiana`, `dominio`, `conjunto-disjunto`) posee entidad propia, **debe contar con su propia página en el grafo**.
  - En los nodos que utilicen dichos conceptos, **no se debe duplicar ni sobre-explicar** su definición: basta con referenciarlos mediante `<ConceptLink targetId="...">` para preservar la pureza y concisión de cada artículo.
- **Modularidad en páginas de Sistemas Axiomáticos (`type: "sistema-axiomatico"`):**
  - Un sistema axiomático formaliza exclusivamente el marco teórico ($\mathcal{S}, \sigma, \mathcal{T}$).
  - **Prohibido desglosar o demostrar teoremas derivados** dentro de la página del sistema; las proposiciones demostradas son teoremas con entidad propia y pertenecen a sus respectivos archivos en `theorems/`.
  - **Prohibido reiterar resúmenes de axiomas o modelos:** La interfaz de la plataforma renderiza automáticamente las cuadrículas de tarjetas interactivas de `system.axiomas` y `system.models`. El cuerpo del sistema debe limitarse a la estructura formal, los ámbitos dimensionales y las propiedades de modelos/consistencia.
- **Exposición en capas condicionales:** Estructurar las relaciones en niveles claros (*«En sistemas de incidencia...»*, *«Al añadir orden...»*, *«Al añadir congruencia...»*, *«Al fijar el paralelismo...»*, *«Al añadir continuidad...»*).

---

## 7. Principio de Cobertura Balanceada y Cero Ejemplos Flotantes

- **Prohibición de ejemplos aislados o descontextualizados:** Evitar ejemplos sueltos entre paréntesis que enuncien fragmentos de axiomas sin trazabilidad.
- **Cobertura completa de familias axiomáticas:** Cuando se resuma un grupo axiomático (como la continuidad), la síntesis debe abarcar honestamente todos sus principios esenciales (p. ej. V.1 Arquímedes —ausencia de infinitesimales— y V.2 Completitud —ausencia de huecos—).
- **Acceso interactivo sistemático a axiomas:** Enlazar siempre a todos los axiomas de la familia de forma compacta y accesible (`<ConceptLink targetId="axioma-incidencia-1">I.1</ConceptLink>`, `<ConceptLink targetId="axioma-incidencia-2">I.2</ConceptLink>`, etc.) para permitir al usuario abrir su panel lateral interactivo con su enunciado y diagrama.
