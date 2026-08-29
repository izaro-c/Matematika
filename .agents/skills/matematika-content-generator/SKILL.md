---
name: matematika-content-generator
description: Guía y estándar técnico, epistemológico y editorial para la generación, formalización, hiperenlace y estructuración de contenido en MDX para la Enciclopedia Matemática Matematika (Castellano, Euskara Batua e Inglés).
---

# Guía de Generación y Estructuración de Contenido — Matematika

Esta especificación establece el estándar técnico, formal, lingüístico y metodológico para la creación y refactorización de nodos atómicos en formato MDX dentro de la plataforma **Matematika**. Su propósito es garantizar el máximo rigor matemático, la preservación de fronteras ontológicas, la estabilidad del grafo acíclico dirigido (DAG), la interactividad visual y la paridad trilingüe estricta (**Castellano**, **Euskara Batua** e **Inglés**).

---

## 1. Filosofía Editorial y Principios Epistemológicos de Redacción

La enciclopedia modela el conocimiento matemático como un **grafo de nodos atómicos hiperenlazados**. Para asegurar que el contenido sea riguroso, pedagógico y universalmente accesible, toda redacción debe regirse por los siguientes principios meta-editoriales:

### 1.1. Principio de Inmediación Ontológica, Entrada Directa y Tono No Defensivo
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

### 1.2. Principio de Disciplina de Tipos, Dominios Primitivos y Trazas Puntuales
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

### 1.3. Principio de Deslinde entre Semántica de Modelos y Metalógica
- **Satisfacción frente a Verificación:**
  - En una estructura concreta $\mathcal{M}$, la validez de los axiomas de una teoría formal $\mathcal{T}$ corresponde a la relación semántica de modelado: $\mathcal{M} \models \mathcal{T}$.
  - El grupo de propiedades que evalúa los axiomas debe titularse `Satisfacción de axiomas de...` (evitando «Verificación», que refiere al procedimiento algorítmico o metalógico de prueba).
- **Invariantes estructurales vs. Propiedades de la teoría:**
  - **Propiedades del modelo:** Son exclusivamente los invariantes intrínsecos de la tupla relacional (e.g. cardinalidad, regularidad combinatoria, autodualidad, transitividad del grupo de automorfismos, aciclicidad, dimensiones vectoriales, ausencia/presencia de paralelismo).
  - **Propiedades metalógicas:** La consistencia, completitud, decidibilidad o categoricidad son propiedades de la *teoría formal* $\mathcal{T}$, no de una estructura particular $\mathcal{M}$. Una estructura $\mathcal{M}$ actúa como *testigo semántico* de la consistencia de $\mathcal{T}$ (por el Teorema de Validez, $\exists \mathcal{M} \, (\mathcal{M} \models \mathcal{T}) \implies \operatorname{Cons}(\mathcal{T})$), pero la consistencia jamás debe listarse como un `<PropiedadItem>` interno del modelo.

### 1.4. Principio de Respeto a la Frontera Epistémica (Cero Anacronismo Teórico)
- **Prohibición de contaminación de marcos externos:** No atribuir a un objeto propiedades, dimensiones o etiquetas formales que sólo existen en teorías más ricas o posteriores (topológicas, analíticas o algebraicas) a menos que se aclare explícitamente dicha procedencia.
- **No atribuir orden, figuras poligonales o diferenciabilidad a primitivos de incidencia pura:**
  - No afirmar como propiedad intrínseca de la recta que *«se extiende indefinidamente en ambos sentidos»* en su definición básica de nivel 0, ya que nociones como *«sentido»* o *«prolongación ilimitada»* presuponen axiomas de orden lineal ($A * B * C$) y continuidad que no existen en geometrías de incidencia finitas (como Fano).
  - **Prohibición de figuras dependientes de orden en incidencia pura:** En el estrato de Incidencia pura (Grupo I de Hilbert), los **segmentos no existen todavía**, ya que requieren la relación primitiva de intermediación u orden lineal $A * X * B$ (Grupo II). Por tanto, en axiomas como I.3 (puntos no colineales), la terna no colineal **no determina un triángulo en el Grupo I**, sino los vértices fundamentales de la configuración discreta que dará lugar al triángulo una vez introducido el orden.
  - No emplear términos procedentes de variedades diferenciables (como *«superficie lisa»* o *«liso»*) para definir objetos primitivos como el plano; utilizar lenguaje puramente geométrico (*«superficie elemental uniforme y sin curvatura»*).
- **Prohibición de expresiones vagas:** Evitar etiquetas ambiguas o informales como *«geometría intuitiva»*; emplear siempre la denominación formal precisa (*«geometría elemental»*, *«geometría sintética»* o *«geometría euclidiana»*).
- **Preferencia por el lenguaje natural en lo intuitivo:** Si una propiedad de partida se puede formular con claridad en lenguaje llano (*«sin partes ni extensión dimensional»*), se debe emplear lenguaje natural en lugar de forzar etiquetas técnicas anacrónicas (*«dimensión inductiva cero»*) que aún no han sido construidas deductivamente en ese estrato.

### 1.5. Principio de Fidelidad al Orden Deductivo Real
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

### 1.6. Principio de Estratificación Axiomática Condicional y Modularidad
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

### 1.7. Principio de Cobertura Balanceada y Cero Ejemplos Flotantes
- **Prohibición de ejemplos aislados o descontextualizados:** Evitar ejemplos sueltos entre paréntesis que enuncien fragmentos de axiomas sin trazabilidad.
- **Cobertura completa de familias axiomáticas:** Cuando se resuma un grupo axiomático (como la continuidad), la síntesis debe abarcar honestamente todos sus principios esenciales (p. ej. V.1 Arquímedes —ausencia de infinitesimales— y V.2 Completitud —ausencia de huecos—).
- **Acceso interactivo sistemático a axiomas:** Enlazar siempre a todos los axiomas de la familia de forma compacta y accesible (<ConceptLink targetId="axioma-incidencia-1">I.1</ConceptLink>, <ConceptLink targetId="axioma-incidencia-2">I.2</ConceptLink>, etc.) para permitir al usuario abrir su panel lateral interactivo con su enunciado y diagrama.

### 1.8. Principio de Grafo Hipertextual Abierto, Cobertura Biográfica y Enriquecimiento Continuo
- **Trazabilidad conceptual exhaustiva (Grafo Abierto):** Todo concepto matemático, figura geométrica, dominio, estructura algebraica/métrica, método o noción formal (e.g. *«espacio»*, *«dimensión»*, *«colinealidad»*, *«coplanaridad»*, *«conjunto convexo»*, *«conjuntos disjuntos»*, *«geometría absoluta»*, *«geometría hiperbólica»*, *«lógica matemática»*, *«teoría de modelos»*, *«grupo»*, *«cuerpo»*, *«cuerpo finito»*, *«álgebra»*, *«álgebra lineal»*, *«distancia»*, *«continuidad»*, *«segmento»*, *«semirrecta»*, *«ángulo»*, *«triángulo»*, *«relación»*, *«relación binaria»*, *«transposición»*, *«isomorfismo»*, *«traza»*, *«cardinalidad»*, *«subespacio»*, *«dualidad»*, *«variedad algebraica»*) **debe llevar obligatoriamente un `<ConceptLink targetId="...">`**, incluso si la página de destino aún no existe o está pendiente de redactar.
- **Prohibición de texto plano en conceptos enlazables:** Jamás se debe dejar un concepto matemático relevante como texto plano sin hiperenlace con el pretexto de que la página aún no está creada. El sistema de rutas dinámicas de la enciclopedia gestiona de forma transparente los enlaces a nodos futuros.
- **Cobertura biográfica completa:** Cada vez que se cite o mencione a un matemático fundamental en el texto histórico o motivacional (e.g. Descartes, Fermat, Euclides, Poncelet, Steiner, von Staudt, Pasch, Peano, Hilbert, Klein, Fano, Lebesgue, Menger, Urysohn, Hurewicz, Wallman), debe existir su archivo biográfico en `mathematicians/` y su correspondiente enlace `<ConceptLink targetId="...">`.
- **Estructuración nativa de propiedades:** Toda sección de propiedades debe emplear los componentes MDX nativos (`<SeccionPropiedades>`, `<PropiedadesGrupo>` y `<PropiedadItem id="..." title="...">`) en lugar de listas de viñetas genéricas en Markdown plano.

### 1.9. Principio de Simbología y Notación Estándar, Internacional y Moderna (ISO 80000-2)
- **Universalidad y modernidad:** Se deben utilizar **siempre** los símbolos matemáticos contemporáneos e internacionalmente estandarizados por la comunidad matemática global y el estándar **ISO 80000-2**.
- **Cero notaciones arcaicas o ambiguas:**
  - **Congruencia geométrica:** Utilizar **siempre `\cong` ($\cong$)** para figuras, segmentos y ángulos ($\overline{AB} \cong \overline{CD}$, $\angle ABC \cong \angle DEF$). Prohibido usar `\equiv` ($\equiv$) para congruencia geométrica (salvo citas textuales históricas con aclaración), ya que colisiona con la aritmética modular y la equivalencia lógica.
  - **Congruencia angular y aridad formal:** En Hilbert §1, los ángulos se definen por pares de semirrectas no colineales concurrentes (o ternas de puntos con vértice común). La congruencia angular se denota $\angle ABC \cong \angle DEF$ o $\angle(h,k) \cong \angle(h',k')$, y su aridad de primer orden es $\cong_{\angle} \, \subseteq \mathcal{P}^6$. Prohibido $\angle A \cong \angle B$.
  - **Segmento abierto vs. cerrado:** Emplear $\operatorname{seg}(AB)$ para el segmento abierto (excluyendo extremos $A$ y $B$), y $\overline{AB}$ para el segmento cerrado o clausura geométrica.
  - **Semejanza geométrica:** Utilizar **`\sim` ($\sim$)** ($\triangle ABC \sim \triangle DEF$).
  - **Paralelismo y perpendicularidad:** Utilizar **`\parallel` ($\parallel$)** y **`\perp` ($\perp$)**.

---

## 2. Esquema Real de Metadatos (`export const metadata`)

Los metadatos se validan en tiempo de compilación según los esquemas de `src/data/content/schemas.ts`.

### 2.1. Campos Comunes (`BaseContentSchemaFields`)

Todo archivo `.mdx` debe exportar un objeto `metadata` con los campos correspondientes:

```typescript
export const metadata = {
  id: "identificador-kebab-case",   // Obligatorio. Coincide con el nombre del archivo
  lang: "es",                       // "es" | "eu" | "en" (por defecto "es")
  type: "definicion",               // Tipo de nodo (ver tabla de tipos)
  subtype: "primitivo",             // Opcional para definiciones ('primitivo' | 'nominal' | 'derivado' | etc.)
  title: "Título Formal",           // Título principal visible
  description: "Resumen conciso...",// Descripción para resúmenes, SEO y tarjetas
  branch: "51A",                    // Código MSC 2020 canónico registrado en src/data/content/msc2020.ts (ej. "51A", "51M", "15A", "03B")
  branches: ["51A", "51M", "03B"],  // Ramas MSC secundarias opcionales (códigos 2 dígitos o 2 dígitos + letra)
  tags: ["geometria", "incidencia"],// Etiquetas temáticas opcionales
  hasSimulation: true,              // true si monta componente interactivo
  hasDiagram: false,                // true si monta diagrama estático/interactivo
  sources: [                        // Referencias bibliográficas opcionales
    {
      title: "Grundlagen der Geometrie",
      author: "David Hilbert",
      locator: "Capítulo I, §1",
      role: "primary"               // "primary" | "secondary" | "formalization"
    }
  ]
};
```

> [!IMPORTANT]
> **Compatibilidad de códigos `branch` y `branches` con la taxonomía del proyecto (`msc2020.ts`):**
> - Los códigos deben pertenecer a la tabla de ramas registradas (`mscNames`, `mscHierarchy` en `src/data/content/msc2020.ts`).
> - Utilizar códigos de **2 dígitos** (`"51"`, `"03"`, `"15"`) o **2 dígitos + 1 letra** (`"51A"`, `"51M"`, `"03B"`, `"15A"`).
> - **Prohibido** emplear subcódigos numéricos de 5 caracteres (como `"51A05"` o `"51M04"`) como valor de `branch`, ya que no están indexados en las tablas de nombres multilenguaje y rompen la navegación por migas de pan (*breadcrumbs*) y el árbol taxonómico de ramas.

### 2.2. Tipos de Contenido y Campos Específicos

| `type` | Campos Específicos Principales | Descripción y Restricciones Estructurales |
| :--- | :--- | :--- |
| **`definicion`** | `subtype?: 'primitivo' \| 'nominal' \| 'fundamentada' \| 'derivado' \| 'algebraico' \| 'analitico'`, `statement?: string`, `authors?: string[]`, `color?: string` | Noción matemática base o derivada. Admite `<SeccionPropiedades>` para teoremas intrínsecos. |
| **`axioma`** | `axiomSystem?: string`, `axiomFamily?: string`, `alternativeGroup?: string`, `statement?: string`, `authors?: string[]` | Postulado atómico e indecomponible. **Prohibido `<SeccionPropiedades>`**. |
| **`teorema`** | `statement?: string`, `authors?: string[]`, `requires?: string[]`, `lemmas?: string[]`, `corollaries?: string[]`, `demos?: string[]`, `examples?: string[]`, `exercises?: string[]`, `difficulty?: 'básico' \| 'intermedio' \| 'avanzado'` | Proposición demostrable principal dentro de una teoría. |
| **`lema`** | *(Igual que teorema)* | Proposición auxiliar intermedia para la demostración de un teorema. |
| **`corolario`** | `parentTheorem?: string`, *(demás campos de teorema)* | Consecuencia directa e inmediata de un teorema demostrado. |
| **`demostracion`** | `parentTheorem?: string`, `proofMethod?: string` (ej. `"metodo-contradiccion"`), `lemmas?: string[]`, `layout?: 'split' \| 'text'`, `dependencias?: string[]`, `authors?: string[]` | Demostración paso a paso con justificación axiomática. |
| **`sistema-axiomatico`** | `axiomas: string[]`, `models?: string[]`, `authors?: string[]` | Formalización del marco teórico ($\mathcal{S}, \sigma, \mathcal{T}$). Sin demostraciones en su cuerpo. |
| **`modelo`** | `satisfies: string \| string[]`, `axioms_verified?: string[]`, `hasDiagram?: boolean` | Estructura concreta que satisface un sistema. Requiere `<SeccionPropiedades>` para satisfacción e invariantes. |
| **`metodo`** | `subtype: 'demostracion' \| 'construccion' \| 'calculo' \| 'algoritmo'`, `links?: string[]`, `seeAlso?: string[]`, `requires?: string[]` | Procedimiento matemático o técnica demostrativa constructiva. |
| **`matematico`** | `name: string`, `birthYear: number`, `deathYear: number`, `country: string`, `image?: string` | Entrada biográfica histórica y contextualización epistemológica. |

---

## 3. Grafo Lógico, Enlaces Hipertextuales, Paridad Trilingüe y Causalidad (`isDependency`)

### 3.1. Enlaces a Páginas Futuras o No Creadas (Grafo Abierto)
- **Es totalmente obligatorio y bienvenido enlazar a conceptos, axiomas o teoremas que todavía no existen en el repositorio.**
- En la interfaz web, esos enlaces se renderizan de manera transparente conduciendo a una página provisional (*"En construcción"*), facilitando la navegación orgánica futura y la visión global del grafo de conocimiento.
- En la suite de validación estática (`npm run validate-references`), los enlaces a IDs aún no creados generan avisos informativos (`[WARN]`), **sin bloquear nunca la compilación**.

### 3.2. Causalidad Lógica con `isDependency` frente a Hiperenlaces Contextuales
El atributo `isDependency={true}` en `<ConceptLink>` se reserva **estrictamente** para alimentar el Grafo Acíclico Dirigido (DAG) deductivo:

```tsx
<!-- Dependencia causal formal del concepto (construye el DAG): -->
<ConceptLink isDependency="{true}" targetId="axioma-orden-4">Axioma de Pasch</ConceptLink>

<!-- Hiperenlace contextual o explicativo estándar (NO afecta al DAG): -->
<ConceptLink targetId="sistema-absoluto">geometría absoluta</ConceptLink>
```

| Contexto / Subtipo | Regla de `isDependency` | Justificación y Ejemplos |
| :--- | :--- | :--- |
| **Concepto primitivo** (`subtype: "primitivo"`) | **Prohibido `isDependency={true}`** (Omitir) | Nodo raíz de Grado 0 absoluto (`punto`, `recta`, `plano`, `incidencia`, `concepto-primitivo`). Los axiomas los gobiernan pero no los definen. |
| **Axiomas (`type: "axioma"`)** | **Obligatorio en primitivos de signatura** | Debe aplicarse a los términos primitivos de su signatura (`punto`, `recta`, `plano`) y a las relaciones primitivas que postula (`incidencia`, `estar-entre`, `congruencia`), actuando como Grado $-1$ del DAG. |
| **Concepto derivado** (`subtype: "derivado"`) | **`true` en conceptos y axiomas constitutivos** | Elementos esenciales sin los cuales el concepto no puede existir (e.g. `semiplano` $\to$ `recta`, `plano`, `segmento`, `axioma-orden-4`). |
| **Concepto construido / Espacio** (`espacio`) | **`true` en dominios y axiomas constitutivos** | El espacio tridimensional se compone de `punto`, `recta`, `plano` y los axiomas `axioma-incidencia-8` (3D) e `axioma-incidencia-7` (intersección planar). |
| **Conceptos nominales / Meta-conceptos** | **Omitir o `false`** | Nociones estructurales o de teoría de modelos (`dimension`, `signatura`, `estructura-geometrica`, `dominio`, `conjunto-disjunto`) que no actúan como cuellos de botella en el DAG de geometría sintética. |
| **Teoremas y demostraciones** (`type: "teorema"` / `type: "demostracion"`) | **`true` en axiomas, teoremas y lemas usados** | Justifica el paso deductivo de la prueba lógica formal. |
| **Modelos (`type: "modelo"`)** | **Omitir** (`false` por defecto) | Un modelo es una estructura semántica de satisfacción, no un nodo deductivo antecedente. |
| **Biografías y contextos históricos** | **Prohibido** | Las entradas biográficas no intervienen en las cadenas de inferencia lógica. |
| **Autorreferencia** | **Prohibido** | Prohibido enlazar con `isDependency={true}` al propio ID del archivo (evita ciclos lógicos fatales). |

### 3.3. Paridad Trilingüe Estricta (`es`, `en`, `eu`)
- **Coincidencia 1:1 absoluta:** Todo `<ConceptLink targetId="...">` introducido en el texto en castellano (`es/`) **debe estar presente de forma idéntica en las versiones en inglés (`en/`) y euskera (`eu/`)**.
- **Coherencia de `isDependency`:** Si un enlace lleva `isDependency={true}` en un idioma, debe llevarlo exactamente igual en los otros dos.
- **Correspondencia en diagramas:** Los identificadores de elementos y colores en `<VisualBind>` deben coincidir 1:1 en las tres variantes lingüísticas.

### 3.4. Catálogo de Convenciones Canónicas de `targetId`

Para asegurar la uniformidad en todo el corpus documental, se deben emplear los siguientes identificadores kebab-case canónicos:

| Área Temática | Término / Concepto | `targetId` Canónico |
| :--- | :--- | :--- |
| **Geometría Sintética** | Punto / Recta / Plano / Semiplano / Espacio | `punto`, `recta`, `plano`, `semiplano`, `espacio` |
| | Segmento / Semirrecta (Rayo) / Ángulo | `segmento`, `semirrecta`, `angulo` |
| | Triángulo / Polígono / Poliedro | `triangulo`, `poligono`, `poliedro` |
| | Incidencia / Traza de incidencia puntual | `incidencia`, `traza` |
| | Colinealidad / Coplanaridad / Paralelismo | `colinealidad`, `coplanaridad`, `paralelas` |
| | Orden e intermediación ($A * B * C$) | `estar-entre` |
| | Congruencia / Perpendicularidad | `congruencia`, `perpendicular` |
| | Continuidad / Axioma de Arquímedes / Axioma de Pasch | `continuidad`, `arquimedes`, `pasch` |
| | Geometría sintética / hilbertiana / analítica | `geometria-sintetica`, `geometria-hilbertiana`, `geometria-analitica` |
| | Geometría discreta / Geometría finita | `geometria-discreta`, `geometria-finita` |
| | Sistema de incidencia / absoluto / euclidiano / hiperbólico | `sistema-incidencia`, `sistema-absoluto`, `sistema-euclidiano`, `sistema-hiperbolico` |
| | Espacio proyectivo / Dualidad geométrica | `espacio-proyectivo`, `dualidad` |
| | Modelo tres puntos / Modelo de Fano / Modelo cartesiano | `modelo-tres-puntos`, `modelo-fano`, `modelo-cartesiano` |
| **Lógica y Fundamentos** | Lógica matemática / Teoría de modelos / Consistencia lógica | `logica`, `teoria-modelos`, `consistencia-logica` |
| | Sistema axiomático / Axioma / Teorema / Demostración | `sistema-axiomatico`, `axioma`, `teorema`, `demostracion` |
| | Concepto primitivo / Estructura matemática / Signatura | `concepto-primitivo`, `estructura-geometrica`, `signatura` |
| | Dominio primitivo / Conjunto / Conjuntos disjuntos / Conjunto convexo | `dominio`, `conjunto`, `conjunto-disjunto`, `conjunto-convexo` |
| | Relación / Relación binaria / Transposición (relación inversa) | `relacion`, `relacion-binaria`, `transposicion` |
| | Relación de equivalencia / Clase de equivalencia / Conjunto cociente | `relacion-equivalencia`, `clase-equivalencia`, `conjunto-cociente` |
| | Isomorfismo / Cardinalidad | `isomorfismo`, `cardinalidad` |
| **Álgebra y Métricas** | Álgebra / Álgebra lineal / Operación binaria / Grupo / Simetría | `algebra`, `algebra-lineal`, `operacion-binaria`, `grupo`, `simetria` |
| | Cuerpo / Cuerpo finito ($\mathbb{F}_q$) / Espacio vectorial / Subespacio | `cuerpo`, `cuerpo-finito`, `espacio-vectorial`, `subespacio` |
| | Base vectorial / Dimensión / Distancia métrica / Espacio métrico | `base`, `dimension`, `distancia`, `espacio-metrico` |
| **Geometría Algebraica** | Geometría algebraica / Variedad algebraica / Variedad de Fano | `geometria-algebraica`, `variedad-algebraica`, `variedad-fano` |
| | Programa de Erlangen | `programa-erlangen` |
| **Teoremas Notables** | Teorema de Desargues / Teorema de la recta de intersección | `teorema-desargues`, `teorema-interseccion-planos` |

---

## 4. Catálogo de Componentes MDX Disponibles

Los siguientes componentes están disponibles globalmente en cualquier archivo `.mdx`:

### 4.1. Estructura y Texto
- **`<Capitular letra="E" />`**: Inicializa el primer párrafo con letra capital estilizada de imprenta clásica.
- **`<Separador />`**: Línea divisoria horizontal estilizada con adorno central clásico.
- **`<Nota>`**: Bloque de anotación lateral o comentario pedagógico complementario.
- **`<Cita author="Autor">`**: Bloque de cita destacada con autor.

### 4.2. Matemáticas y Definiciones
- **`<Definicion title="...">`**: Contenedor formal para la definición matemática o enunciado axiomático.
- **`<Formula title="...">`**: Recuadro estilizado para ecuaciones o fórmulas destacadas que requieren scroll horizontal asistido en pantallas pequeñas.
- **`<EquationRow>`**: Agrupador horizontal centrado para varias fórmulas en línea.

### 4.3. Hiperenlaces y Vinculación Visual
- **`<ConceptLink targetId="..." isDependency={true|false}>Texto</ConceptLink>`**: Enlace semántico a otra página del grafo.
- **`<VisualBind element="..." color="...">Fórmula/Término</VisualBind>`**: Vincula texto o símbolos con elementos interactivos del diagrama (`color`: `"musgo"` | `"azul"` | `"terracota"` | `"ocre"` | `"carbon"`).
  - `"terracota"`: Puntos fundamentales, vértices, orígenes.
  - `"carbon"`: Rectas, ejes, vectores, aristas.
  - `"azul"`: Planos, subespacios, regiones primarias.
  - `"musgo"`: Elementos secundarios, círculos interiores, componentes singulares.
  - `"ocre"`: Planos o rectas coplanares secantes.

### 4.4. Aislamiento Léxico entre KaTeX y el Árbol AST de JSX
Queda terminantemente prohibido anidar etiquetas JSX dentro de delimitadores matemáticos de KaTeX (`$`, `$$` o `\text{...}`). Dicha práctica corrompe el árbol sintáctico (AST) y rompe los parsers en tiempo de compilación.

```tsx
<!-- ❌ INCORRECTO: Anidación de JSX dentro del delimitador matemático (Rompe el parser) -->
$\mathcal{P} = \{ \text{<VisualBind color="terracota" element="A">A</VisualBind>}, \text{<VisualBind color="terracota" element="B">B</VisualBind>} \}$

<!-- ✅ CORRECTO: KaTeX interno contenido dentro de la etiqueta JSX -->
$\mathcal{P} = \{$ <VisualBind color="terracota" element="A">$A$</VisualBind>, <VisualBind color="terracota" element="B">$B$</VisualBind> $\}$
```

### 4.5. Bloque Estructurado de Propiedades (`<SeccionPropiedades>`)
Permite estructurar propiedades matemáticas derivadas o catalogar satisfacciones de axiomas e invariantes.

```tsx
<SeccionPropiedades>
  <PropiedadesGrupo title="Satisfacción de axiomas de incidencia">
    <PropiedadItem id="axioma-incidencia-1" title="Determinación unívoca de la recta">
      Para cualquier par de puntos distintos en $\mathcal{P}$, existe exactamente una recta en $\mathcal{L}$ incidente con ambos...
    </PropiedadItem>
  </PropiedadesGrupo>
  <PropiedadesGrupo title="Propiedades estructurales y combinatorias">
    <PropiedadItem id="configuracion-regular" title="Regularidad de la configuración">
      La estructura forma una configuración simétrica...
    </PropiedadItem>
  </PropiedadesGrupo>
</SeccionPropiedades>
```

> [!WARNING]
> **Reglas de uso de `<SeccionPropiedades>` por tipología:**
> 1. **Prohibición estricta en Axiomas (`type: "axioma"`):** Un axioma es un postulado atómico e indivisible. **No debe contener `<SeccionPropiedades>`**. Prohibido crear propiedades que repitan la propia definición (e.g. `unicidad-recta` en I.1, `no-vaciedad-recta` en I.2, `determinacion-plano` en I.4). Las consecuencias deductivas son **teoremas** y pertenecen a `theorems/`.
> 2. **Uso legítimo en Definiciones (`type: "definicion"`):** Para agrupar propiedades matemáticas demostradas del concepto definido (e.g. convexidad en `semiplano`).
> 3. **Uso legítimo en Modelos (`type: "modelo"`):** Debe estructurarse estrictamente en dos bloques:
>    - `Satisfacción de axiomas de [Familia]` (evaluando los postulados del sistema).
>    - `Propiedades estructurales, [algebraicas / combinatorias / topológicas]` (aislando los invariantes intrínsecos de la estructura).
> 4. **Prohibición en Sistemas Axiomáticos (`type: "sistema-axiomatico"`):** No emplear `<SeccionPropiedades>` para crear listas manuales de axiomas o modelos componentes. La interfaz de la plataforma los genera automáticamente a partir de los metadatos `axiomas` y `models`.

---

## 5. Estándares de Notación KaTeX y Símbolos Canónicos Modernos (ISO 80000-2)

Toda fórmula y notación matemática en Matematika debe seguir rigurosamente la tabla de símbolos canónicos contemporáneos:

| Concepto Matemático | Símbolo Canónico | Comando KaTeX | Ejemplo de Uso | Prohibido / Desaconsejado |
| :--- | :---: | :--- | :--- | :--- |
| **Congruencia geométrica** | $\cong$ | `\cong` | $\overline{AB} \cong \overline{CD}$, $\angle ABC \cong \angle DEF$ | $\equiv$ *(reservado a aritmética modular / lógica)* |
| **Congruencia angular** | $\angle ABC \cong \angle DEF$ | `\angle ABC \cong \angle DEF` | $\angle(h,k) \cong \angle(h',k')$ | $\angle A \cong \angle B$ *(sesgo puntual)* |
| **Semejanza geométrica** | $\sim$ | `\sim` | $\triangle ABC \sim \triangle A'B'C'$ | $\approx$ *(reservado a aproximación numérica)* |
| **Paralelismo** | $\parallel$ | `\parallel` | $\ell \parallel m$ | $\slash\slash$, $\parallel\mkern-2mu\parallel$ |
| **Perpendicularidad** | $\perp$ | `\perp` | $\ell \perp m$ | $\top$, $\bot$ *(reservado a lógica: falsedad)* |
| **Incidencia sintética** | $\mathbf{I}$ | `\mathbf{I}` | $P \, \mathbf{I} \, \ell$, $P \, \mathbf{I} \, \pi$ | $I$ cursiva ambigua, $\in$ (entre primitivos) |
| **Traza de incidencia puntual** | $\operatorname{tr}$ | `\operatorname{tr}` | $\operatorname{tr}(\ell) \subseteq \operatorname{tr}(\pi)$ | $\ell \subseteq \pi$ *(colapso de tipos)* |
| **Pertenencia conjuntista** | $\in$ | `\in` | $P \in \mathcal{P}$, $x \in X$ | $\epsilon$ (letra griega épsilon) |
| **Intermediación / Orden** | $*$ o $\mathbf{B}$ | `*` o `\mathbf{B}` | $A * B * C$, $\mathbf{B}(A, B, C)$ | $B(A,B,C)$ sin negrita |
| **Segmento abierto** | $\operatorname{seg}(AB)$ | `\operatorname{seg}(AB)` | $\operatorname{seg}(AB) \cap \ell = \emptyset$ | $(A,B)$ *(ambiguo con pares ordenados)* |
| **Segmento cerrado** | $\overline{AB}$ | `\overline{AB}` | $\overline{AB} = \operatorname{seg}(AB) \cup \{A, B\}$ | $\underline{AB}$, $AB$ sin barra para el conjunto |
| **Semirrecta (Rayo)** | $\overrightarrow{AB}$ | `\overrightarrow{AB}` | $\overrightarrow{AB}$ (origen $A$, pasa por $B$) | $\vec{AB}$ *(reservado a vectores)* |
| **Recta generada** | $\overleftrightarrow{AB}$ | `\overleftrightarrow{AB}` | $\overleftrightarrow{AB}$ (recta que une $A$ y $B$) | $\overline{AB}$ *(colisión con segmento)* |
| **Ángulo** | $\angle ABC$ | `\angle ABC` | $\angle ABC$ o $\widehat{ABC}$ | $<ABC$ |
| **Triángulo** | $\triangle ABC$ | `\triangle ABC` | $\triangle ABC$ | $\Delta ABC$ *(delta griega mayúscula)* |
| **Partición del universo** | $\sqcup$ | `\sqcup` | $\mathcal{U} = \mathcal{P} \sqcup \mathcal{L} \sqcup \Pi$ | $\cup$ simple sin disyunción |
| **Doble implicación** | $\iff$ | `\iff` | $A \sim_\ell B \iff \operatorname{seg}(AB) \cap \ell = \emptyset$ | $\leftrightarrow$, `<=>` |
| **Implicación directa** | $\implies$ | `\implies` | $P \implies Q$ | `->`, $\to$ *(reservado a funciones)* |
| **Conjunto vacío** | $\emptyset$ | `\emptyset` | $A \cap B = \emptyset$ | $\Phi$, $\phi$, $\{\}$ |
| **Conjuntos numéricos** | $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}, \mathbb{C}$ | `\mathbb{R}`, etc. | $x \in \mathbb{R}^n$ | $\mathbf{R}$, $R$ cursiva |
| **Cardinalidad** | $\lvert S \rvert$ o $\text{card}(S)$ | `\lvert S \rvert` | $\dim(V) = \lvert B \rvert$ | `\card`, $|S|$ *(sin balanceo de barras)* |
| **Tablas KaTeX** | $\mid$ o $\lvert \dots \rvert$ | `\mid` | $S = \{ x \in \mathbb{R} \mid x > 0 \}$ | `|` directo *(rompe el parser Markdown)* |

---

## 6. Glosario Técnico de Euskara Batua

Para asegurar precisión sintáctica y un registro académico riguroso en euskera, es imperativo ceñirse al siguiente glosario técnico normalizado:

| ❌ Término Desaconsejado / Calco | ✅ Término Académico Canónico | Significado / Contexto de Uso |
|---|---|---|
| `nekez` (*raras veces*) | **`nahitaez`** / **`ezinbestean`** | Necesidad lógica formal (*"necesariamente"*). |
| `ekitzaile` (*activista*) | **`ebakitzaile`** | Recta o plano en posición *"secante"*. |
| `Bien baturak...` | **`Bi axiomek batera...`** | Conjunción axiomática (no suma aritmética $\sum$). |
| `haiek barnean hartzen dituen` | **`haiekin intziditzen duen`** | Incidencia sintética pura frente a contención conjuntista. |
| `koproportzio` | **`koziente`** | Estructura o conjunto *"cociente"*. |
| `tratuaren` | **`higikariaren`** / **`gorputzaren`** | Móvil / cuerpo en movimiento. |
| `konhexu` | **`konbexu`** / **`ganbil`** | Espacio o conjunto *"convexo"*. |
| `strictly` | **`zorrozki`** / **`zorrotz`** | Demostración o condición *"estrictamente"* válida. |
| `alderanzgarri` | **`alderantzizgarri`** | Operador o matriz *"invertible"*. |
| `Asociatibitatea` | **`Asoziatibitatea`** / **`Elkartuzkotasuna`** | Propiedad de *"asociatividad"*. |
| `zuzenki segmentuen` | **`zuzenkien`** / **`segmentuen`** | *"Segmentos"* de recta. |
| `Parerik gabe aldeen...` | **`Alde-parerik kongruente gabe`** | *"Sin pares de lados congruentes"*. |
| `transposaketa` | **`transposizio`** | Operación de *"transposición"* o relación conversa. |

---

## 7. Protocolo de Verificación y Auditoría

Antes de dar por finalizada la edición de cualquier nodo, es obligatorio ejecutar la suite de validación automatizada del proyecto:

```bash
# 1. Validar integridad de esquemas, campos y referencias cruzadas
npm run validate-references

# 2. Verificar aciclicidad y dependencias causales del Grafo Lógico (DAG)
npm run validate-graph

# 3. Comprobación estricta de tipos e interoperabilidad TypeScript / MDX
npm run typecheck
```