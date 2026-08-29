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
- **Cero redundancias léxicas:** No repetir la misma cualidad o adjetivo (e.g. *«convexa»*) de manera reiterativa entre la entradilla, la definición formal y la sección de propiedades.
- **Intuición previa a la formalización:** Explicar siempre de forma directa y sencilla el significado del objeto antes de presentar el bloque formal.

### 1.2. Principio de Respeto a la Frontera Epistémica (Cero Anacronismo Teórico)
- **Prohibición de contaminación de marcos externos:** No atribuir a un objeto propiedades, dimensiones o etiquetas formales que sólo existen en teorías más ricas o posteriores (topológicas, analíticas o algebraicas) a menos que se aclare explícitamente dicha procedencia.
- **No atribuir orden, infinitud o diferenciabilidad a primitivos de incidencia pura:**
  - No afirmar como propiedad intrínseca de la recta que *«se extiende indefinidamente en ambos sentidos»* en su definición básica de nivel 0, ya que nociones como *«sentido»* o *«prolongación ilimitada»* presuponen axiomas de orden lineal ($A * B * C$) y continuidad que no existen en geometrías de incidencia finitas (como Fano).
  - No emplear términos procedentes de variedades diferenciables (como *«superficie lisa»* o *«liso»*) para definir objetos primitivos como el plano; utilizar lenguaje puramente geométrico (*«superficie elemental uniforme y sin curvatura»*).
- **Prohibición de expresiones vagas:** Evitar etiquetas ambiguas o informales como *«geometría intuitiva»*; emplear siempre la denominación formal precisa (*«geometría elemental»*, *«geometría sintética»* o *«geometría euclidiana»*).
- **Preferencia por el lenguaje natural en lo intuitivo:** Si una propiedad de partida se puede formular con claridad en lenguaje llano (*«sin partes, longitud, área o volumen»*), se debe emplear lenguaje natural en lugar de forzar etiquetas técnicas anacrónicas (*«dimensión inductiva cero»*) que aún no han sido construidas deductivamente en ese estrato.

### 1.3. Principio de Fidelidad al Orden Deductivo Real
- **No presuponer lo derivado en lo primitivo:** Nunca explicar una noción básica o primitiva asumiendo conceptos construidos a posteriori que dependen de ella.
- **Diferenciación entre relación primitiva y construcción métrica:** Identificar siempre la relación primitiva pura (como la congruencia sintética $\cong$, el orden $*$ o la incidencia $\mathbf{I}$) frente a construcciones numéricas posteriores (como funciones de distancia $d(A,B) \in \mathbb{R}$, medidas de área o coordenadas numéricas). Por ejemplo, la congruencia compara pares de puntos directamente como segmentos congruentes; la distancia métrica es una construcción posterior.
- **Definición formal precisa con «si y solo si» ($\iff$):** En definiciones de conceptos derivados (como el `semiplano`), enunciar las condiciones matemáticas de pertenencia de forma nítida y simétrica mediante $\iff$, explicitando los axiomas de los que dependen causalmente.

### 1.4. Principio de Precisión Ontológica y Cuantificación
- **Evitar el sesgo del artículo determinado:** Prohibido usar *«el»* o *«la»* cuando existan múltiples entidades del mismo rango epistemológico. Usar *«un concepto primitivo»* (coexiste con rectas y planos), *«un sistema formal»* o *«una relación de orden»*, evitando sugerir falsas unicidades salvo cuando exista un teorema formal de unicidad.

### 1.5. Principio de Estratificación Axiomática Condicional y Modularidad
- **Las propiedades no son intrínsecas, sino axiomáticas:** Los objetos matemáticos no poseen propiedades "mágicas" aisladas; su comportamiento depende estrictamente de las reglas que los axiomas establecen sobre ellos.
- **Modularidad y desacoplamiento de conceptos auxiliares:**
  - Si un concepto formal (como `signatura`, `geometria-sintetica`, `geometria-hilbertiana`, `dominio`, `conjunto-disjunto`) posee entidad propia, **debe contar con su propia página en el grafo**.
  - En los nodos que utilicen dichos conceptos, **no se debe duplicar ni sobre-explicar** su definición: basta con referenciarlos mediante `<ConceptLink targetId="...">` para preservar la pureza y concisión de cada artículo.
- **Signaturas explícitas en variedades:** Al clasificar o listar variedades de espacios o teorías geométricas en un nodo de nivel superior, explicitar siempre su **signatura formal** y su **teoría axiomática** ($\mathcal{S} \models \mathcal{T}$).
- **Exposición en capas condicionales:** Estructurar las relaciones en niveles claros (*«En sistemas de incidencia...»*, *«Al añadir orden...»*, *«Al añadir congruencia...»*, *«Al fijar el paralelismo...»*, *«Al añadir continuidad...»*).

### 1.6. Principio de Cobertura Balanceada y Cero Ejemplos Flotantes
- **Prohibición de ejemplos aislados o descontextualizados:** Evitar ejemplos sueltos entre paréntesis que enuncien fragmentos de axiomas sin trazabilidad.
- **Cobertura completa de familias axiomáticas:** Cuando se resuma un grupo axiomático (como la continuidad), la síntesis debe abarcar honestamente todos sus principios esenciales (p. ej. V.1 Arquímedes —ausencia de infinitesimales— y V.2 Completitud —ausencia de huecos—).
- **Acceso interactivo sistemático a axiomas:** Enlazar siempre a todos los axiomas de la familia de forma compacta y accesible (<ConceptLink targetId="axioma-incidencia-1">I.1</ConceptLink>, <ConceptLink targetId="axioma-incidencia-2">I.2</ConceptLink>, etc.) para permitir al usuario abrir su panel lateral interactivo con su enunciado y diagrama.

### 1.7. Principio de Grafo Hipertextual Abierto y Cobertura Biográfica
- **Trazabilidad conceptual total:** Todo término técnico, magnitud o concepto matemático (incluso nociones estructurales como *«dimensión»*, *«longitud»*, *«área»*, *«volumen»*, *«conjunto»*, *«continuidad»*, *«distancia»*, *«signatura»*, *«dominio»*) debe contar con su respectivo `<ConceptLink>`.
- **Cobertura biográfica completa:** Cada vez que se cite o mencione a un matemático fundamental en el texto histórico o motivacional (e.g. Descartes, Fermat, Euclides, Poncelet, Steiner, von Staudt, Pasch, Peano, Hilbert, Lebesgue, Menger, Urysohn, Hurewicz, Wallman), debe existir su archivo biográfico en `mathematicians/` y su correspondiente enlace `<ConceptLink targetId="...">`.
- **Estructuración nativa de propiedades:** Toda sección de propiedades debe emplear los componentes MDX nativos (`<SeccionPropiedades>`, `<PropiedadesGrupo>` y `<PropiedadItem id="..." title="...">`) en lugar de listas de viñetas genéricas en Markdown plano.

### 1.8. Principio de Simbología y Notación Estándar, Internacional y Moderna (ISO 80000-2)
- **Universalidad y modernidad:** Se deben utilizar **siempre** los símbolos matemáticos contemporáneos e internacionalmente estandarizados por la comunidad matemática global y el estándar **ISO 80000-2**.
- **Cero notaciones arcaicas o ambiguas:**
  - **Congruencia geométrica:** Utilizar **siempre `\cong` ($\cong$)** para figuras, segmentos y ángulos ($\overline{AB} \cong \overline{CD}$, $\angle ABC \cong \angle DEF$). Prohibido usar `\equiv` ($\equiv$) para congruencia geométrica, ya que colisiona con la aritmética modular ($a \equiv b \pmod m$) y la equivalencia lógica.
  - **Semejanza geométrica:** Utilizar **`\sim` ($\sim$)** ($\triangle ABC \sim \triangle DEF$).
  - **Paralelismo y perpendicularidad:** Utilizar **`\parallel` ($\parallel$)** y **`\perp` ($\perp$)**.
  - **Notaciones históricas:** Si un autor histórico empleó un símbolo arcaico en su texto fundacional (como Hilbert usando $\equiv$ en 1899), se emplea el símbolo estándar moderno ($\cong$) en todo el aparato matemático y se añade, si procede, una breve nota histórica explicativa.

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
  branch: "51M04",                  // Código MSC 2020 opcional (ej. "51M", "15A", "03")
  branches: ["51M04", "51A05"],     // Ramas MSC secundarias opcionales
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

## 3. Grafo Lógico, Enlaces Hipertextuales y Causalidad (`isDependency`)

### 3.1. Enlaces a Páginas Futuras o No Creadas
- **Es totalmente válido y bienvenido enlazar a conceptos, axiomas o teoremas que todavía no existen en el repositorio.**
- En la interfaz web, esos enlaces se renderizan de manera segura conduciendo a una página provisional ("*En construcción*").
- En la suite de validación estática (`npm run validate-references`), estos enlaces generan únicamente un aviso informativo (`[WARN]`), sin bloquear la compilación.

### 3.2. Causalidad Lógica con `isDependency`

El atributo `isDependency={true}` en `<ConceptLink>` se utiliza para alimentar el Grafo Acíclico Dirigido (DAG) deductivo:

```tsx
<ConceptLink targetId="axioma-orden-4" isDependency={true}>Axioma de Pasch</ConceptLink>
```

| Contexto | `isDependency` | Regla |
| :--- | :--- | :--- |
| **Concepto primitivo** (`subtype: "primitivo"`) | Omitir o `false` | **Prohibido `isDependency={true}`**. Es un nodo raíz (nivel 0); no tiene dependencias conceptuales previas. |
| **Concepto derivado** (`subtype: "derivado"`) | `true` en conceptos base | Define los conceptos constitutivos a partir de los cuales se construye el nuevo ente (e.g. `recta`, `plano`, `axioma-orden-4` para `semiplano`). |
| **Demostración** (`type: "demostracion"`) | `true` en axiomas/lemas | Justifica el paso deductivo en la prueba lógica. |
| **Enlaces divulgativos o contextuales** | Omitir o `false` | Enlace hipertextual estándar de navegación sin alterar el DAG causal. |
| **Autorreferencia** | — | **Prohibido** enlazar con `isDependency={true}` al propio ID del archivo (evita ciclos lógicos). |

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

### 4.4. Bloque Estructurado de Propiedades y Teoremas
- **`<SeccionPropiedades>`, `<PropiedadesGrupo>` y `<PropiedadItem>`**:
  Permite enumerar propiedades, axiomas o teoremas derivados de forma limpia y tipografiada.

```tsx
<SeccionPropiedades>
  <PropiedadesGrupo title="Propiedades Geométricas Fundamentales">
    <PropiedadItem id="conjunto-convexo" title="Convexidad">
      Todo semiplano es un <ConceptLink targetId="conjunto-convexo">conjunto convexo</ConceptLink>...
    </PropiedadItem>
    <PropiedadItem id="angulo" title="Regiones interiores poligonales">
      La intersección de semiplanos permite definir la región interior...
    </PropiedadItem>
  </PropiedadesGrupo>
</SeccionPropiedades>
```

---

## 5. Estándares de Notación KaTeX y Símbolos Canónicos Modernos (ISO 80000-2)

Toda fórmula y notación matemática en Matematika debe seguir rigurosamente la tabla de símbolos canónicos contemporáneos:

| Concepto Matemático | Símbolo Canónico | Comando KaTeX | Ejemplo de Uso | Prohibido / Desaconsejado |
| :--- | :---: | :--- | :--- | :--- |
| **Congruencia geométrica** | $\cong$ | `\cong` | $\overline{AB} \cong \overline{CD}$, $\angle A \cong \angle B$ | $\equiv$ *(reservado a aritmética modular / lógica)* |
| **Semejanza geométrica** | $\sim$ | `\sim` | $\triangle ABC \sim \triangle A'B'C'$ | $\approx$ *(reservado a aproximación numérica)* |
| **Paralelismo** | $\parallel$ | `\parallel` | $\ell \parallel m$ | $\slash\slash$, $\parallel\mkern-2mu\parallel$ |
| **Perpendicularidad** | $\perp$ | `\perp` | $\ell \perp m$ | $\top$, $\bot$ *(reservado a lógica: falsedad)* |
| **Incidencia sintética** | $\mathbf{I}$ | `\mathbf{I}` | $P \, \mathbf{I} \, \ell$, $\ell \, \mathbf{I} \, \pi$ | $I$ cursiva ambigua |
| **Pertenencia conjuntista** | $\in$ | `\in` | $P \in \ell$, $x \in X$ | $\epsilon$ (letra griega épsilon) |
| **Intermediación / Orden** | $*$ o $\mathbf{B}$ | `*` o `\mathbf{B}` | $A * B * C$, $\mathbf{B}(A, B, C)$ | $B(A,B,C)$ sin negrita |
| **Segmento geométrico** | $\overline{AB}$ | `\overline{AB}` | $\overline{AB} \subset \ell$ | $\underline{AB}$, $AB$ sin barra para el conjunto |
| **Semirrecta (Rayo)** | $\overrightarrow{AB}$ | `\overrightarrow{AB}` | $\overrightarrow{AB}$ (origen $A$, pasa por $B$) | $\vec{AB}$ *(reservado a vectores)* |
| **Recta generada** | $\overleftrightarrow{AB}$ | `\overleftrightarrow{AB}` | $\overleftrightarrow{AB}$ (recta que une $A$ y $B$) | $\overline{AB}$ |
| **Ángulo** | $\angle ABC$ | `\angle ABC` | $\angle ABC$ o $\widehat{ABC}$ | $<ABC$ |
| **Triángulo** | $\triangle ABC$ | `\triangle ABC` | $\triangle ABC$ | $\Delta ABC$ *(delta griega mayúscula)* |
| **Doble implicación** | $\iff$ | `\iff` | $A \in \mathcal{H} \iff \overline{AB} \cap \ell = \emptyset$ | $\leftrightarrow$, `<=>` |
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
```
