# Filosofía Editorial y Principios Epistemológicos de Redacción

La enciclopedia modela el conocimiento matemático como un **grafo acíclico dirigido (DAG) de nodos atómicos hiperenlazados**. Para asegurar que el contenido sea riguroso, pedagógico y universalmente accesible, toda redacción debe regirse por los siguientes principios meta-editoriales:

---

## 1. Principio de Inmediación Ontológica, Entrada Directa y Tono No Defensivo

- **Apertura descriptiva pura (Cero introducciones metatextuales):** La primera oración de un nodo debe enunciar de forma directa y asertiva la definición, el postulado o el hecho matemático nuclear en lenguaje natural sobrio.
  - **En axiomas (`type: "axioma"`):** Comenzar directamente con el enunciado geométrico del postulado (e.g. *«Por tres puntos no colineales pasa a lo sumo un plano.»*). Queda estrictamente prohibido iniciar con fórmulas redundantes como *«El Axioma I.X de Hilbert establece...»*.
  - **En definiciones (`type: "definicion"`):** Definir inmediatamente el objeto o relación formal (e.g. *«La traza puntual es la asignación conjuntista que asocia a cada recta o plano...»*).
  - **En teoremas (`type: "teorema"`):** Enunciar inmediatamente la proposición condicional (e.g. *«Si dos lados de un triángulo son congruentes entre sí, entonces los ángulos opuestos a dichos lados son también congruentes entre sí.»*).
  - **En demostraciones (`type: "demostracion"`):** Declarar de entrada el objetivo de deducción y el método formal de inferencia (e.g. *«Demostración formal del teorema del triángulo isósceles mediante la aplicación del criterio de congruencia LAL...»*).
  - **En modelos (`type: "modelo"`):** Declarar de entrada la estructura formal y el marco de satisfacción.
- **Accesibilidad universal y cero jerga burocrática:** La prosa debe ser limpia, fluida y transparente, sin exigir formación especializada previa para comprender las ideas fundamentales. Reemplazar verbos rebuscados por verbos funcionales directos: *«establece»*, *«describe»*, *«permite»*, *«determina»*, *«garantiza»*, *«satisface»*, *«induce»*.
- **Tono asertivo y no defensivo:** Presentar las definiciones directamente por lo que son, sin caer en sobre-correcciones o explicaciones negativas innecesarias.
- **Modularidad y no duplicación con fórmulas:** No sobre-explicar en párrafos de prosa redundante lo que una signatura o fórmula matemática ya declara con exactitud. El visor interactivo de KaTeX (`SymbolDictionaryManager`) asume la labor pedagógica de inspección de símbolos.

### Muletillas del Marco Axiomático — Prohibición Total

El marco axiomático hilbertiano es el **contexto presuposicional global** de la enciclopedia. No debe anunciarse en cada artículo. Queda terminantemente prohibido comenzar el segundo párrafo (o cualquier párrafo de transición) con:

| ❌ Muletilla prohibida | ✅ Sustitución directa |
|---|---|
| *«En la geometría sintética y en la geometría hilbertiana...»* | Comenzar con la esencia conceptual del objeto |
| *«En la fundamentación de David Hilbert...»* | Comenzar con la motivación estructural o deductiva |
| *«Dentro del sistema axiomático de Hilbert...»* | Comenzar con la conexión con otros conceptos |
| *«En la geometría sintética de David Hilbert...»* | Comenzar con la relevancia en geometría absoluta |

**Excepción legítima:** Nombrar a Hilbert o la geometría sintética está permitido cuando: (1) la página describe ese concepto directamente, (2) se establece un contraste explícito con otro sistema formal, o (3) la referencia tiene valor histórico no redundante.

**Nota sobre primer párrafo:** El `<Capitular>` introduce la definición o enunciado. Si el segundo párrafo comienza con una de las muletillas anteriores, reemplazarlo completamente con la esencia conceptual del objeto en prosa directa.


---

## 2. Principio de Disciplina de Tipos, Dominios Primitivos y Trazas Puntuales

- **Politipado estricto en estructuras multisort:** En teorías axiomáticas multisort (como la geometría sintética de Hilbert $\mathcal{S}_{\text{Hil}} = (\mathcal{P}, \mathcal{L}, \Pi, \dots)$), los dominios primitivos poseen el mismo rango ontológico y son conjuntos mutuamente disjuntos por pares:
  $$\mathcal{P} \cap \mathcal{L} = \emptyset, \quad \mathcal{P} \cap \Pi = \emptyset, \quad \mathcal{L} \cap \Pi = \emptyset$$
  El universo global se particiona como $\mathcal{U} = \mathcal{P} \sqcup \mathcal{L} \sqcup \Pi$.
- **Prohibición de colapso de tipos (Type Mismatch):** Queda estrictamente prohibido aplicar relaciones de pertenencia o inclusión conjuntista entre dominios primitivos distintos:
  - Expresiones como $\ell \subseteq \pi$ o $\ell \cap \pi$ son inválidas porque una recta $\ell \in \mathcal{L}$ no es un subconjunto del plano $\pi \in \Pi$.
  - La relación primitiva formal en Hilbert es la **incidencia sintética** ($P \, \mathbf{I} \, \ell$, $P \, \mathbf{I} \, \pi$).
  - La inclusión lineal de una recta en un plano debe formularse mediante cuantificación pura sobre puntos:
    $$\forall P \in \mathcal{P} \ (P \, \mathbf{I} \, \ell \implies P \, \mathbf{I} \, \pi)$$
- **Mediación analítica por trazas de incidencia ($\operatorname{tr}$):**
  - La traza se define formalmente como la aplicación hacia el conjunto potencia de puntos $\mathcal{P}(\mathcal{P})$:
    $$
    \begin{aligned}
    \operatorname{tr}_{\mathcal{L}}\colon \mathcal{L} &\longrightarrow \mathcal{P}(\mathcal{P}) \\
    \ell &\longmapsto \operatorname{tr}(\ell) = \{ P \in \mathcal{P} \mid P \, \mathbf{I} \, \ell \}
    \end{aligned}
    $$
    $$
    \begin{aligned}
    \operatorname{tr}_{\Pi}\colon \Pi &\longrightarrow \mathcal{P}(\mathcal{P}) \\
    \pi &\longmapsto \operatorname{tr}(\pi) = \{ P \in \mathcal{P} \mid P \, \mathbf{I} \, \pi \}
    \end{aligned}
    $$
  - **Frontera ontológica de la traza:** El operador $\operatorname{tr}$ se aplica **únicamente** a los objetos primitivos no puntuales ($\mathcal{L}$ y $\Pi$). Las figuras compuestas derivadas (segmentos $\overline{AB}$, triángulos $\triangle ABC$, semiplanos) ya son formalmente subconjuntos de puntos por su propia definición sintética ($\overline{AB} \subseteq \mathcal{P}$), por lo que no requieren ni admiten aplicación de $\operatorname{tr}$.

---

## 3. Posiciones Relativas en el Espacio Tridimensional y Paralelismo Reflexivo

- **Coplanaridad como condición sine qua non del paralelismo de rectas:**
  - Dos rectas $\ell_1, \ell_2 \in \mathcal{L}$ son **paralelas** ($\ell_1 \parallel \ell_2$) si y solo si son **coplanares** en algún plano $\pi$ y son idénticas o no comparten ningún punto común:
    $$\operatorname{tr}(\ell_1) \cup \operatorname{tr}(\ell_2) \subseteq \operatorname{tr}(\pi) \implies (\ell_1 \parallel \ell_2 \iff \ell_1 = \ell_2 \lor \operatorname{tr}(\ell_1) \cap \operatorname{tr}(\ell_2) = \emptyset)$$
  - La inclusión de $\ell_1 = \ell_2$ es indispensable para asegurar que el paralelismo sea una relación de equivalencia reflexiva ($\ell \parallel \ell$).
- **Rectas que se Cruzan (Alabeadas / Skew Lines):**
  - Dos rectas en el espacio son cruzadas si ningún plano común las contiene:
    $$\operatorname{cruzadas}(\ell_1, \ell_2) \iff \forall \pi \in \Pi \ (\operatorname{tr}(\ell_1) \cup \operatorname{tr}(\ell_2) \not\subseteq \operatorname{tr}(\pi))$$
  - Como consecuencia necesaria (teorema), sus trazas puntuales son disjuntas ($\operatorname{tr}(\ell_1) \cap \operatorname{tr}(\ell_2) = \emptyset$), pero **no son paralelas**.
- **Planos Paralelos en el Espacio:**
  - Dos planos son paralelos si y solo si son idénticos o tienen trazas disjuntas:
    $$\pi_1 \parallel \pi_2 \iff (\pi_1 = \pi_2 \lor \operatorname{tr}(\pi_1) \cap \operatorname{tr}(\pi_2) = \emptyset)$$

---

## 4. Epistemología de Dependencias en el DAG (`isDependency={true}`)

- **Definiciones Nominales:**
  - Las definiciones nominales dependen **única y exclusivamente de los conceptos primitivos o términos base** necesarios para formular el objeto (e.g. `traza` depende de `punto`, `recta`, `plano`, `incidencia`).
  - No deben colocarse axiomas como dependencias (`isDependency={true}`) en definiciones nominales, pues ello ataría conceptualmente la definición a un sistema formal específico, impidiendo su reutilización en geometrías no euclidianas o finitas.
- **Teoremas y Demostraciones:**
  - Las demostraciones (`type: "demostracion"`) sí declaran con `isDependency={true}` los axiomas, definiciones previas y lemas específicos que justifican las deducciones formales.

---

## 5. Principio de Rigor Absoluto en Teoremas y Demostraciones

- **Cero pasos informales o saltos deductivos:** Queda terminantemente prohibido el uso de expresiones evasivas como *«es trivial»*, *«obviamente»*, *«se deduce fácilmente»* o *«por inspección visual»*.
- **Justificación explícita de cada transición deductiva:**
  1. Cada afirmación en una prueba debe estar respaldada unívocamente por:
     - Una **hipótesis de partida**.
     - Un **axioma formal** específico (e.g. *«por el Axioma III.1 de transporte de segmentos»*).
     - Una **definición previa** (e.g. *«por la definición de ángulo suplementario»*).
     - Un **lema o teorema demostrado con anterioridad**.
  2. En demostraciones por contradicción (*reductio ad absurdum*), declarar formalmente la hipótesis contraria $\neg Q$, derivar explícitamente la contradicción con un axioma o hipótesis conocida ($R \land \neg R$), y concluir formalmente $Q$.
- **Desacoplamiento estricto entre Enunciado del Teorema y su Demostración:**
  - El archivo del **teorema** (`theorems/teorema-xyz.mdx`) formula la proposición matemática formal, el contexto deductivo, las hipótesis y la tesis.
  - El archivo de la **demostración** (`demonstrations/demo-xyz.mdx`) desarrolla el argumento deductivo paso a paso.

---

## 6. Definición Sintética Rigurosa de Ángulos, Congruencia y Perpendicularidad

- **Definición de Ángulo:**
  - En geometría sintética de Hilbert, un **ángulo** $\angle(h,k)$ o $\angle ABC$ está formado por dos semirrectas $h = \overrightarrow{BA}$ y $k = \overrightarrow{BC}$ no colineales que comparten un origen común $B$ (el vértice).
- **Ángulos Suplementarios (o Adyacentes Lineales):**
  - Dos ángulos $\angle(h,k)$ y $\angle(h',k)$ son suplementarios si comparten la semirrecta $k$ y sus otras dos semirrectas $h$ y $h'$ son semirrectas opuestas de una misma recta (i.e. $h \cup h' = \ell \setminus \{B\}$ con vértice $B$).
- **Ángulo Recto y Perpendicularidad Sintética:**
  - Un ángulo es **recto** si es congruente con su ángulo suplementario adyacente ($\angle(h,k) \cong \angle(h',k)$).
  - Dos rectas secantes $\ell_1, \ell_2$ son **perpendiculares** ($\ell_1 \perp \ell_2$) si el ángulo que forman en su punto de intersección es un ángulo recto.
  - Esta formulación es puramente sintética y relacional, **completamente libre de medidas en grados ($90^\circ$) o radianes ($\pi/2$)**, las cuales son construcciones métricas posteriores.
- **Diferenciación entre Identidad conjuntista ($=$) y Congruencia ($\cong$):**
  - $\overline{AB} = \overline{BA}$ como conjuntos de puntos.
  - $\overline{AB} \cong \overline{CD}$ como relación de congruencia entre segmentos.
  - Prohibido escribir $\overline{AB} = \overline{CD}$ cuando se refiere a congruencia de longitud antes de introducir métricas.

---

## 7. Principio de Deslinde entre Semántica de Modelos y Metalógica

- **Satisfacción frente a Verificación:**
  - En una estructura concreta $\mathcal{M}$, la validez de los axiomas corresponde a la relación semántica: $\mathcal{M} \models \mathcal{T}$.
  - La sección se titula `Satisfacción de axiomas de...`.
- **Invariantes estructurales vs. Propiedades de la teoría:**
  - **Propiedades del modelo:** Invariantes intrínsecos de la tupla relacional (cardinalidad, regularidad, autodualidad, simetría).
  - **Propiedades metalógicas:** La consistencia o completitud pertenecen a la *teoría formal* $\mathcal{T}$. $\mathcal{M}$ es un testigo semántico de la consistencia, no una propiedad interna del modelo.

---

## 8. Principio de Respeto a la Frontera Epistémica (Cero Anacronismo)

- **Prohibición de contaminación de marcos externos:** No atribuir a un objeto propiedades que pertenecen a estratos deductivos posteriores.
- **Sin nociones métricas o de orden en incidencia pura:** No hablar de longitud, distancia o áreas en incidencia básica o relaciones de orden antes de postular la congruencia y la teoría de medida.

---

## 9. Principio de Estructura Libre: Adaptar la Forma al Objeto

**No existe ninguna estructura de página obligatoria.** Cada nodo MDX adopta la organización que sirve mejor a su naturaleza matemática.

### Lo que NO se debe hacer

Imponer mecánicamente la secuencia:
> `<Capitular>` → párrafo 1 → párrafo 2 → `<Definicion>` → `<SeccionPropiedades>` → `<Nota>`

Esta plantilla puede ser adecuada para algunas definiciones ricas, pero no para axiomas simples, relaciones primitivas, entradas biográficas, o cualquier nodo donde esa estructura sobra o distorsiona.

### Principio rector

> *¿Qué necesita el lector para entender este objeto y navegar correctamente en el grafo?*

Los componentes JSX (`<SeccionPropiedades>`, `<Nota>`, `<Separador>`, `<NombreVariante>`) son **herramientas opcionales**, no requisitos.

### Redundancia entre párrafos

Si el primer párrafo (introducido con `<Capitular>`) ya define el objeto, el segundo párrafo no debe repetir esa definición con otras palabras. Debe aportar algo nuevo: motivación, conexión deductiva, contraste histórico, o implicaciones formales. Si no hay nada nuevo que decir, el segundo párrafo se elimina.

---

## 10. Terminología Canónica en Euskara Batua

Las siguientes traducciones son **términos canónicos fijados** en el glosario de Matematika. No traducir de forma alternativa sin actualizar primero el glosario oficial.

| Castellano | ❌ Incorrecto | ✅ Canónico en EU |
|---|---|---|
| Rectas soporte (de un ángulo) | `sortutako zuzenak` | `zuzen euskarriak` (sg. `zuzen euskarria`) |
| Ángulo suplementario | `angelu osagarria` | `angelu betegarria` |
| Ángulo complementario | `angelu betegarria` | `angelu osagarria` |
| Semirrecta | cualquier variante libre | `zuzenerdia` (pl. `zuzenerdi`) |
| Segmento | cualquier variante libre | `zuzenkia` (pl. `zuzenkiak`) |
| Triángulo rectángulo | cualquier variante libre | `triangelu angeluzuzena` |
| Perpendicularidad | cualquier variante libre | `perpendikulartasuna` |

> Ver el glosario completo en [euskara-glossary.md](./euskara-glossary.md).
