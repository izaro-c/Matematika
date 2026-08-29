---
name: matematika-content-generator
description: Guía y estándar técnico para la generación, redacción y estructuración de contenido en MDX para la Enciclopedia Matemática Matematika (Castellano, Euskara Batua e Inglés).
---

# Guía de Generación y Estructuración de Contenido — Matematika

Esta skill establece el estándar técnico y editorial para redactar, estructurar, hiperenlazar y validar páginas de contenido en formato MDX para la plataforma **Matematika**, garantizando rigor matemático, modularidad, interactividad visual y coherencia trilingüe (**Castellano**, **Euskara Batua** e **Inglés**).

---

## 1. Filosofía Editorial y Principios Epistemológicos de Redacción

La enciclopedia modela el conocimiento como un **grafo de nodos atómicos hiperenlazados**. Para asegurar que el contenido sea riguroso, pedagógico y universalmente accesible, toda redacción debe regirse por los siguientes principios meta-editoriales:

### 1.1. Principio de Lenguaje Llano, Pedagogía Directa y Tono No Defensivo
- **Accesibilidad universal:** La prosa debe ser limpia, fluida y transparente para cualquier lector, sin exigir formación especializada previa para comprender las ideas fundamentales.
- **Cero jerga burocrática u oscura:** Evitar arcaísmos, términos rebuscados o formulismos barrocos. Reemplazar expresiones como *«rige»* o *«marco ontológico»* por verbos directos y comunes: *«establece»*, *«describe»*, *«permite»*, *«determina»*, *«garantiza»*.
- **Tono asertivo y no defensivo:** Presentar las definiciones directamente por lo que son, sin caer en sobre-correcciones o explicaciones negativas innecesarias (e.g. evitar frases reactivas como *«no se definen como subconjuntos unos de otros...»* o *«sin reducir unos a colecciones de otros...»* a menos que se trate explícitamente de una sección comparativa entre modelos).
- **Cero redundancias léxicas y sintéticas:**
  - No repetir la misma cualidad o adjetivo (e.g. *«convexa»*) de manera reiterativa entre la entradilla, la definición formal y la sección de propiedades.
  - En geometría sintética politipada, no superponer de forma redundante *«contener»* e *«incidir»* (e.g. evitar *«toda recta contiene al menos dos puntos distintos que inciden en ella»*); emplear la formulación canónica directa: *«toda recta incide al menos con dos puntos distintos»* o *«toda recta contiene al menos dos puntos distintos»*.
- **Títulos y encabezados claros, naturales y no sobrecargados:**
  - Emplear siempre títulos y subtítulos directos, sobrios y naturales (e.g. `### Geometría plana y espacial`, `### Modelos y consistencia`, `### Definición formal`).
  - Prohibido utilizar encabezados inflados de corte metamatemático barroco o pomposo (e.g. evitar *«Modularidad y estratificación dimensional»*, *«Propiedades metalógicas del sistema»* o *«Teoremas fundamentales derivados de la incidencia»*).
- **Intuición previa a la formalización:** Explicar siempre de forma directa y sencilla el significado del objeto antes de presentar el bloque formal.

### 1.2. Principio de Respeto a la Frontera Epistémica (Cero Anacronismo Teórico)
- **Prohibición de contaminación de marcos externos:** No atribuir a un objeto propiedades, dimensiones o etiquetas formales que sólo existen en teorías más ricas o posteriores (topológicas, analíticas o algebraicas) a menos que se aclare explícitamente dicha procedencia.
- **No atribuir orden, figuras poligonales o diferenciabilidad a primitivos de incidencia pura:**
  - No afirmar como propiedad intrínseca de la recta que *«se extiende indefinidamente en ambos sentidos»* en su definición básica de nivel 0, ya que nociones como *«sentido»* o *«prolongación ilimitada»* presuponen axiomas de orden lineal ($A * B * C$) y continuidad que no existen en geometrías de incidencia finitas (como Fano).
  - **Prohibición de figuras dependientes de orden en incidencia pura:** En el estrato de Incidencia pura (Grupo I de Hilbert), los **segmentos no existen todavía**, ya que requieren la relación primitiva de intermediación u orden lineal $A * X * B$ (Grupo II). Por tanto, en axiomas como I.3 (puntos no colineales), la terna no colineal **no determina un triángulo en el Grupo I**, sino los vértices fundamentales de la configuración discreta que dará lugar al triángulo una vez introducido el orden.
  - No emplear términos procedentes de variedades diferenciables (como *«superficie lisa»* o *«liso»*) para definir objetos primitivos como el plano; utilizar lenguaje puramente geométrico (*«superficie elemental uniforme y sin curvatura»*).
- **Prohibición de expresiones vagas:** Evitar etiquetas ambiguas o informales como *«geometría intuitiva»*; emplear siempre la denominación formal precisa (*«geometría elemental»*, *«geometría sintética»* o *«geometría euclidiana»*).
- **Preferencia por el lenguaje natural en lo intuitivo:** Si una propiedad de partida se puede formular con claridad en lenguaje llano (*«sin partes ni extensión dimensional»*), se debe emplear lenguaje natural en lugar de forzar etiquetas técnicas anacrónicas (*«dimensión inductiva cero»*) que aún no han sido construidas deductivamente en ese estrato.

### 1.3. Principio de Fidelidad al Orden Deductivo Real
- **No presuponer lo derivado en lo primitivo:** Nunca explicar una noción básica o primitiva asumiendo conceptos construidos a posteriori que dependen de ella.
- **Deslinde estricto entre axiomas existenciales y teoremas derivados:**
  - En los resúmenes y descripciones de axiomas puramente existenciales (como el **Axioma I.7**), no se debe atribuir al axioma la demostración completa de la figura resultante.
  - El Axioma I.7 postula estrictamente que si dos planos distintos comparten un punto, comparten al menos un **segundo punto común** ($B \neq A$); que su intersección sea *exactamente* la recta completa $\overleftrightarrow{AB}$ es un **teorema derivado** de la conjunción de I.7 con I.1, I.6 e I.4–I.5.
- **Diferenciación entre relación primitiva y construcción métrica:** Identificar siempre la relación primitiva pura (como la congruencia sintética $\cong$, el orden $*$ o la incidencia $\mathbf{I}$) frente a construcciones numéricas posteriores (como funciones de distancia $d(A,B) \in \mathbb{R}$, medidas de área o coordenadas numéricas). Por ejemplo, la congruencia compara pares de puntos directamente como segmentos congruentes; la distancia métrica es una construcción posterior.
- **Incidencia sintética vs. Pertenencia conjuntista y trazas puntuales:**
  - En la geometría sintética de Hilbert, la relación primitiva formal es la **incidencia posicional** ($P \, \mathbf{I} \, \ell$, $P \, \mathbf{I} \, \pi$ con $\mathbf{I}_{\mathcal{P}\mathcal{L}} \subseteq \mathcal{P} \times \mathcal{L}$ e $\mathbf{I}_{\mathcal{P}\Pi} \subseteq \mathcal{P} \times \Pi$), no la pertenencia conjuntista ($\in$).
  - Por economía notacional estándar, se escribe $\mathbf{I}$ para denotar $\mathbf{I}_{\mathcal{P}\mathcal{L}}$ o $\mathbf{I}_{\mathcal{P}\Pi}$ según el tipo de sus argumentos.
  - Las expresiones $P \in \ell$, $P \in \pi$ o $\ell \subseteq \pi$ son abreviaciones informales por abuso de lenguaje que identifican una recta o plano con su **traza de puntos incidentes**: $\operatorname{tr}(\ell) = \{ P \in \mathcal{P} \mid P \, \mathbf{I} \, \ell \}$.
  - En teoremas de intersección entre primitivos atómicos disjuntos (como dos planos $\pi_1, \pi_2 \in \Pi$ intersecándose en una recta $\ell \in \mathcal{L}$), formular rigurosamente sobre las trazas: $\operatorname{tr}(\ell) = \operatorname{tr}(\pi_1) \cap \operatorname{tr}(\pi_2)$.
- **Completitud en cadenas deductivas de incidencia:**
  - Para demostrar que la intersección de dos planos distintos $\pi_1 \neq \pi_2$ es *exactamente* una recta $\overleftrightarrow{AB}$, la deducción formal requiere conjuntamente:
    1. Existencia de un segundo punto común ($B \neq A$, **Axioma I.7**).
    2. Existencia y unicidad de la recta determinada por dos puntos (**Axioma I.1**).
    3. Inclusión de la recta completa en ambos planos (**Axioma I.6**, $\operatorname{tr}(\overleftrightarrow{AB}) \subseteq \operatorname{tr}(\pi_1) \cap \operatorname{tr}(\pi_2)$).
    4. Unicidad del plano determinado por tres puntos no colineales (**Axiomas I.4 e I.5**), que garantiza que cualquier punto común exterior forzaría $\pi_1 = \pi_2$.
- **Formulación del paralelismo euclidiano (Grupo IV):**
  - El axioma IV postula la **cota superior y unicidad** (a lo sumo una paralela coplanar por un punto exterior).
  - La **existencia** de al menos una paralela es un teorema previo demostrable en geometría absoluta (mediante ángulos alternos internos y orden), sin requerir el postulado euclidiano.
- **Definición formal precisa con «si y solo si» ($\iff$):** En definiciones de conceptos derivados (como el `semiplano`), enunciar las condiciones matemáticas de pertenencia de forma nítida y simétrica mediante $\iff$, explicitando los axiomas de los que dependen causalmente.

### 1.4. Principio de Precisión Ontológica, Dominios Primitivos y Cuantificación
- **Uniformidad estricta en los dominios primitivos de Hilbert:**
  - En la estructura sintética $\mathcal{S}_{\text{Hil}} = (\mathcal{P}, \mathcal{L}, \Pi, \dots)$, los tres conjuntos poseen exactamente el mismo estatus ontológico: son los tres dominios primitivos (sorts) disjuntos que componen el universo del discurso global $\mathcal{U} = \mathcal{P} \sqcup \mathcal{L} \sqcup \Pi$.
  - Emplear la misma fórmula homogénea en las definiciones formales:
    - En `punto.mdx`: *«...es cualquier elemento del dominio primitivo de puntos $\mathcal{P}$»* ($P \in \mathcal{P}$).
    - En `recta.mdx`: *«...es cualquier elemento del dominio primitivo de rectas $\mathcal{L}$»* ($\ell \in \mathcal{L}$).
    - En `plano.mdx`: *«...es cualquier elemento del dominio primitivo de planos $\Pi$»* ($\pi \in \Pi$).
  - Prohibido referirse a $\mathcal{P}$ como el «conjunto base» de toda la estructura, para evitar sugerir que las rectas o planos son meros subconjuntos de puntos en la base primitiva.
- **Distinción explícita de puntos en fórmulas de primer orden:** En cuantificaciones existenciales que involucren múltiples puntos (como en los axiomas I.3 o I.8), hacer siempre explícitas las condiciones de desigualdad mutua $(A \neq B \land B \neq C \land A \neq C)$ para asegurar claridad semántica e interpretabilidad en lógica de primer orden.
- **Evitar el sesgo del artículo determinado:** Prohibido usar *«el»* o *«la»* cuando existan múltiples entidades del mismo rango epistemológico. Usar *«un concepto primitivo»* (coexiste con rectas y planos), *«un sistema formal»* o *«una relación de orden»*, evitando sugerir falsas unicidades salvo cuando exista un teorema formal de unicidad.

### 1.5. Principio de Estratificación Axiomática Condicional y Modularidad
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

### 1.6. Principio de Cobertura Balanceada y Cero Ejemplos Flotantes
- **Prohibición de ejemplos aislados o descontextualizados:** Evitar ejemplos sueltos entre paréntesis que enuncien fragmentos de axiomas sin trazabilidad.
- **Cobertura completa de familias axiomáticas:** Cuando se resuma un grupo axiomático (como la continuidad), la síntesis debe abarcar honestamente todos sus principios esenciales (p. ej. V.1 Arquímedes —ausencia de infinitesimales— y V.2 Completitud —ausencia de huecos—).
- **Acceso interactivo sistemático a axiomas:** Enlazar siempre a todos los axiomas de la familia de forma compacta y accesible (<ConceptLink targetId="axioma-incidencia-1">I.1</ConceptLink>, <ConceptLink targetId="axioma-incidencia-2">I.2</ConceptLink>, etc.) para permitir al usuario abrir su panel lateral interactivo con su enunciado y diagrama.

### 1.7. Principio de Grafo Hipertextual Abierto, Cobertura Biográfica y Enriquecimiento Continuo
- **Trazabilidad conceptual exhaustiva (Grafo Abierto):** Todo concepto matemático, figura geométrica, dominio, estructura algebraica/métrica, método o noción formal (e.g. *«espacio»*, *«dimensión»*, *«colinealidad»*, *«coplanaridad»*, *«conjunto convexo»*, *«conjuntos disjuntos»*, *«geometría absoluta»*, *«geometría hiperbólica»*, *«lógica matemática»*, *«teoría de modelos»*, *«grupo»*, *«cuerpo»*, *«álgebra»*, *«distancia»*, *«continuidad»*, *«segmento»*, *«semirrecta»*, *«ángulo»*) **debe llevar obligatoriamente un `<ConceptLink targetId="...">`**, incluso si la página de destino aún no existe o está pendiente de redactar.
- **Prohibición de texto plano en conceptos enlazables:** Jamás se debe dejar un concepto matemático relevante como texto plano sin hiperenlace con el pretexto de que la página aún no está creada. El sistema de rutas dinámicas de la enciclopedia gestiona de forma transparente los enlaces a nodos futuros.
- **Cobertura biográfica completa:** Cada vez que se cite o mencione a un matemático fundamental en el texto histórico o motivacional (e.g. Descartes, Fermat, Euclides, Poncelet, Steiner, von Staudt, Pasch, Peano, Hilbert, Lebesgue, Menger, Urysohn, Hurewicz, Wallman), debe existir su archivo biográfico en `mathematicians/` y su correspondiente enlace `<ConceptLink targetId="...">`.
- **Estructuración nativa de propiedades:** Toda sección de propiedades debe emplear los componentes MDX nativos (`<SeccionPropiedades>`, `<PropiedadesGrupo>` y `<PropiedadItem id="..." title="...">`) en lugar de listas de viñetas genéricas en Markdown plano.

### 1.8. Principio de Simbología y Notación Estándar, Internacional y Moderna (ISO 80000-2)
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

| `type` | Campos Específicos Principales | Descripción |
| :--- | :--- | :--- |
| **`definicion`** | `subtype?: 'primitivo' \| 'nominal' \| 'fundamentada' \| 'derivado' \| 'algebraico' \| 'analitico'`, `statement?: string`, `authors?: string[]`, `color?: string` | Noción matemática base o derivada. |
| **`axioma`** | `axiomSystem?: string`, `axiomFamily?: string`, `alternativeGroup?: string`, `statement?: string`, `authors?: string[]` | Postulado o axioma de un sistema formal. |
| **`teorema`** | `statement?: string`, `authors?: string[]`, `requires?: string[]`, `lemmas?: string[]`, `corollaries?: string[]`, `demos?: string[]`, `examples?: string[]`, `exercises?: string[]`, `difficulty?: 'básico' \| 'intermedio' \| 'avanzado'` | Proposición demostrable principal. |
| **`lema`** | *(Igual que teorema)* | Proposición auxiliar intermedia. |
| **`corolario`** | `parentTheorem?: string`, *(demás campos de teorema)* | Consecuencia directa de un teorema. |
| **`demostracion`** | `parentTheorem?: string`, `proofMethod?: string` (ej. `"metodo-contradiccion"`), `lemmas?: string[]`, `layout?: 'split' \| 'text'`, `dependencias?: string[]`, `authors?: string[]` | Demostración paso a paso. |
| **`sistema-axiomatico`** | `axiomas: string[]`, `models?: string[]`, `authors?: string[]` | Conjunto de axiomas que constituyen una teoría. |
| **`modelo`** | `satisfies: string \| string[]`, `axioms_verified?: string[]`, `hasDiagram?: boolean` | Estructura concreta que satisface un sistema. |
| **`metodo`** | `subtype: 'demostracion' \| 'construccion' \| 'calculo' \| 'algoritmo'`, `links?: string[]`, `seeAlso?: string[]`, `requires?: string[]` | Procedimiento matemático o técnica demostrativa. |
| **`matematico`** | `name: string`, `birthYear?: number`, `deathYear?: number`, `country?: string`, `image?: string` | Biografía de un matemático histórico. |

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
<ConceptLink targetId="axioma-orden-4" isDependency={true}>Axioma de Pasch</ConceptLink>

<!-- Hiperenlace contextual o explicativo estándar (NO afecta al DAG): -->
<ConceptLink targetId="sistema-absoluto">geometría absoluta</ConceptLink>
```

| Contexto / Subtipo | Regla de `isDependency` | Justificación y Ejemplos |
| :--- | :--- | :--- |
| **Concepto primitivo** (`subtype: "primitivo"`) | **Prohibido `isDependency={true}`** (Omitir) | Nodo raíz de Grado 0 absoluto (`punto`, `recta`, `plano`, `incidencia`, `concepto-primitivo`). Los axiomas los gobiernan pero no los definen. |
| **Concepto derivado** (`subtype: "derivado"`) | **`true` en conceptos y axiomas constitutivos** | Elementos esenciales sin los cuales el concepto no puede existir (e.g. `semiplano` $\to$ `recta`, `plano`, `segmento`, `axioma-orden-4`). |
| **Concepto construido / Espacio** (`espacio`) | **`true` en dominios y axiomas constitutivos** | El espacio tridimensional se compone de `punto`, `recta`, `plano` y los axiomas `axioma-incidencia-8` (3D) e `axioma-incidencia-7` (intersección planar). |
| **Conceptos nominales / Meta-conceptos** | **Omitir o `false`** | Nociones estructurales o de teoría de modelos (`dimension`, `signatura`, `estructura-geometrica`, `dominio`, `conjunto-disjunto`) que no actúan como cuellos de botella en el DAG de geometría sintética. |
| **Demostración** (`type: "demostracion"`) | **`true` en axiomas, teoremas y lemas usados** | Justifica el paso deductivo de la prueba lógica. |
| **Enlaces divulgativos, comparativos o contextuales** | **Omitir o `false`** | Navegación enciclopédica estándar que enriquece la prosa sin distorsionar la jerarquía causal. |
| **Autorreferencia** | **Prohibido** | Prohibido enlazar con `isDependency={true}` al propio ID del archivo (evita ciclos lógicos). |

### 3.3. Paridad Trilingüe Estricta (`es`, `en`, `eu`)
- **Coincidencia 1:1 absoluta:** Todo `<ConceptLink targetId="...">` introducido en el texto en castellano (`es/`) **debe estar presente de forma idéntica en las versiones en inglés (`en/`) y euskera (`eu/`)**.
- **Coherencia de `isDependency`:** Si un enlace lleva `isDependency={true}` en un idioma, debe llevarlo exactamente igual en los otros dos.

### 3.4. Catálogo de Convenciones Canónicas de `targetId`

Para asegurar la uniformidad en todo el corpus documental, se deben emplear los siguientes identificadores kebab-case canónicos:

| Área Temática | Término / Concepto | `targetId` Canónico |
| :--- | :--- | :--- |
| **Geometría Sintética** | Punto / Recta / Plano / Semiplano / Espacio | `punto`, `recta`, `plano`, `semiplano`, `espacio` |
| | Segmento / Semirrecta (Rayo) / Ángulo | `segmento`, `semirrecta`, `angulo` |
| | Triángulo / Polígono / Poliedro | `triangulo`, `poligono`, `poliedro` |
| | Incidencia / Colinealidad / Coplanaridad | `incidencia`, `colinealidad`, `coplanaridad` |
| | Orden e intermediación ($A * B * C$) | `estar-entre` |
| | Congruencia / Paralelismo / Perpendicularidad | `congruencia`, `paralelas`, `perpendicular` |
| | Continuidad / Axioma de Arquímedes / Axioma de Pasch | `continuidad`, `arquimedes`, `pasch` |
| | Geometría sintética / hilbertiana / analítica | `geometria-sintetica`, `geometria-hilbertiana`, `geometria-analitica` |
| | Sistema de incidencia / absoluto / euclidiano / hiperbólico | `sistema-incidencia`, `sistema-absoluto`, `sistema-euclidiano`, `sistema-hiperbolico` |
| | Espacio proyectivo / Modelo de Fano / Modelo tres puntos | `espacio-proyectivo`, `modelo-fano`, `modelo-tres-puntos` |
| **Lógica y Fundamentos** | Lógica matemática / Teoría de modelos | `logica`, `teoria-modelos` |
| | Sistema axiomático / Axioma / Teorema / Demostración | `sistema-axiomatico`, `axioma`, `teorema`, `demostracion` |
| | Concepto primitivo / Estructura matemática / Signatura | `concepto-primitivo`, `estructura-geometrica`, `signatura` |
| | Dominio / Conjunto / Conjuntos disjuntos / Conjunto convexo | `dominio`, `conjunto`, `conjunto-disjunto`, `conjunto-convexo` |
| **Álgebra y Métricas** | Álgebra / Álgebra lineal / Operación binaria / Grupo | `algebra`, `algebra-lineal`, `operacion-binaria`, `grupo` |
| | Cuerpo / Espacio vectorial / Base vectorial / Dimensión | `cuerpo`, `espacio-vectorial`, `base`, `dimension` |
| | Relación de equivalencia / Clase de equivalencia / Conjunto cociente | `relacion-equivalencia`, `clase-equivalencia`, `conjunto-cociente` |
| | Distancia métrica / Espacio métrico / Cardinalidad | `distancia`, `espacio-metrico`, `cardinalidad` |
| | Sistema o modelo cartesiano | `modelo-cartesiano` |

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

### 4.4. Bloque Estructurado de Propiedades (`<SeccionPropiedades>`)
- **`<SeccionPropiedades>`, `<PropiedadesGrupo>` y `<PropiedadItem>`**:
  Permite estructurar propiedades matemáticas derivadas o catalogar axiomas componentes.

```tsx
<SeccionPropiedades>
  <PropiedadesGrupo title="Propiedades Geométricas Fundamentales">
    <PropiedadItem id="conjunto-convexo" title="Convexidad">
      Todo semiplano es un <ConceptLink targetId="conjunto-convexo">conjunto convexo</ConceptLink>: si contiene dos puntos cualesquiera $A$ y $B$, contiene enteramente al segmento abierto $\operatorname{seg}(AB)$ que los une.
    </PropiedadItem>
    <PropiedadItem id="angulo" title="Regiones interiores poligonales">
      La intersección de semiplanos permite definir la región interior de un <ConceptLink targetId="angulo">ángulo</ConceptLink>...
    </PropiedadItem>
  </PropiedadesGrupo>
</SeccionPropiedades>
```

> [!WARNING]
> **Prohibición estricta de `<SeccionPropiedades>` en páginas de Axiomas (`type: "axioma"`):**
> - Un **axioma** es un postulado atómico e indivisible. **No debe contener `<SeccionPropiedades>`**.
> - **Prohibido crear propiedades que repitan la propia definición:** No desglosar el enunciado formal en pseudopropiedades redundantes (e.g. `unicidad-recta` en I.1, `no-vaciedad-recta` en I.2, `no-colinealidad` en I.3, `determinacion-plano` en I.4).
> - **Comentarios pedagógicos:** Cualquier aclaración, intuición o articulación con otros axiomas pertenece a la prosa narrativa previa o a un bloque `<Nota>`.
> - **Consecuencias deductivas:** Las proposiciones que se deducen de los axiomas son **teoremas** o **corolarios** y deben tener su propio nodo en el grafo (`theorems/`), no figurar como ítems de propiedades de un axioma.
> - **Ámbito de uso legítimo de `<SeccionPropiedades>`:**
>   1. **Definiciones (`type: "definicion"`):** Para agrupar propiedades matemáticas demostradas del concepto definido (e.g. convexidad en `semiplano`).
>   2. **Modelos (`type: "modelo"`):** Para catalogar propiedades de satisfacción e isomorfismo estructural (e.g. propiedades combinatorias en `modelo-fano`).
> - **Prohibición de duplicación en Sistemas Axiomáticos (`type: "sistema-axiomatico"`):**
>   - No emplear `<SeccionPropiedades>` para crear listas manuales de axiomas o modelos componentes. La interfaz de la plataforma (`AxiomaticSystemPage`) las genera automáticamente de forma interactiva a partir de los metadatos `axiomas` y `models`.

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
| **Incidencia sintética** | $\mathbf{I}$ | `\mathbf{I}` | $P \, \mathbf{I} \, \ell$, $P \, \mathbf{I} \, \pi$ | $I$ cursiva ambigua |
| **Traza de incidencia puntual** | $\operatorname{tr}$ | `\operatorname{tr}` | $\operatorname{tr}(\ell) = \operatorname{tr}(\pi_1) \cap \operatorname{tr}(\pi_2)$ | $\ell = \pi_1 \cap \pi_2$ *(abuso sin matizar)* |
| **Pertenencia conjuntista** | $\in$ | `\in` | $P \in \mathcal{P}$, $x \in X$ | $\epsilon$ (letra griega épsilon) |
| **Intermediación / Orden** | $*$ o $\mathbf{B}$ | `*` o `\mathbf{B}` | $A * B * C$, $\mathbf{B}(A, B, C)$ | $B(A,B,C)$ sin negrita |
| **Segmento abierto** | $\operatorname{seg}(AB)$ | `\operatorname{seg}(AB)` | $\operatorname{seg}(AB) \cap \ell = \emptyset$ | $\overline{AB}$ *(reservado a cerrado/clausura)* |
| **Segmento cerrado** | $\overline{AB}$ | `\overline{AB}` | $\overline{AB} = \operatorname{seg}(AB) \cup \{A, B\}$ | $\underline{AB}$, $AB$ sin barra para el conjunto |
| **Semirrecta (Rayo)** | $\overrightarrow{AB}$ | `\overrightarrow{AB}` | $\overrightarrow{AB}$ (origen $A$, pasa por $B$) | $\vec{AB}$ *(reservado a vectores)* |
| **Recta generada** | $\overleftrightarrow{AB}$ | `\overleftrightarrow{AB}` | $\overleftrightarrow{AB}$ (recta que une $A$ y $B$) | $\overline{AB}$ |
| **Ángulo** | $\angle ABC$ | `\angle ABC` | $\angle ABC$ o $\widehat{ABC}$ | $<ABC$ |
| **Triángulo** | $\triangle ABC$ | `\triangle ABC` | $\triangle ABC$ | $\Delta ABC$ *(delta griega mayúscula)* |
| **Partición del universo** | $\sqcup$ | `\sqcup` | $\mathcal{U} = \mathcal{P} \sqcup \mathcal{L} \sqcup \Pi$ | $\cup$ simple sin disyunción |
| **Doble implicación** | $\iff$ | `\iff` | $A \sim_\ell B \iff \operatorname{seg}(AB) \cap \ell = \emptyset$ | $\leftrightarrow$, `<=>` |
| **Implicación directa** | $\implies$ | `\implies` | $P \implies Q$ | `->`, $\to$ *(reservado a funciones)* |
| **Conjunto vacío** | $\emptyset$ | `\emptyset` | $A \cap B = \emptyset$ | $\Phi$, $\phi$, $\{\}$ |
| **Conjuntos numéricos** | $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}, \mathbb{C}$ | `\mathbb{R}`, etc. | $x \in \mathbb{R}^n$ | $\mathbf{R}$, $R$ cursiva |
| **Cardinalidad** | $\lvert S \rvert$ o $\text{card}(S)$ | `\lvert S \rvert` | $\dim(V) = \lvert B \rvert$ | `\card` *(comando KaTeX inexistente)* |
| **Tablas KaTeX** | $\mid$ o $\lvert \dots \rvert$ | `\mid` | $S = \{ x \in \mathbb{R} \mid x > 0 \}$ | `|` directo *(rompe el parser Markdown)* |

---

## 6. Glosario Técnico de Euskara Batua

| ❌ Término Desaconsejado | ✅ Término Correcto | Significado / Contexto |
|---|---|---|
| `nekez` (*raras veces*) | **`nahitaez`** / **`ezinbestean`** | *"necesariamente"* |
| `ekitzaile` (*activista*) | **`ebakitzaile`** | Recta *"secante"* |
| `koproportzio` | **`koziente`** | *"cociente"* |
| `tratuaren` | **`higikariaren`** / **`gorputzaren`** | Móvil / cuerpo en movimiento |
| `konhexu` | **`konbexu`** / **`ganbil`** | *"convexo"* |
| `strictly` | **`zorrozki`** / **`zorrotz`** | *"estrictamente"* |
| `alderanzgarri` | **`alderantzizgarri`** | Matriz *"invertible"* |
| `Asociatibitatea` | **`Asoziatibitatea`** / **`Elkartuzkotasuna`** | *"asociatividad"* |
| `zuzenki segmentuen` | **`zuzenkien`** / **`segmentuen`** | *"segmentos de recta"* |
| `Parerik gabe aldeen...` | **`Alde-parerik kongruente gabe`** | *"sin pares de lados congruentes"* |

---

## 7. Verificación y Auditoría

Para validar la coherencia del contenido:

```bash
# Validar referencias cruzadas y metadatos
npm run validate-references

# Validar integridad del grafo lógico acíclico
npm run validate-graph

# Chequeo estricto de tipos TypeScript
npm run typecheck
```
