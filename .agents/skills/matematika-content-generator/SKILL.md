---
name: matematika-content-generator
description: Guía y estándar técnico exhaustivo para la generación, estructuración y validación de contenido atómico en MDX para la Enciclopedia Matemática Matematika (Castellano, Euskara e Inglés).
---

# Guía Estricta de Generación de Contenido — Enciclopedia Matematika

Esta skill establece el estándar normativo e inflexible para redactar, estructurar, hiperenlazar y validar páginas de contenido en formato MDX para la plataforma **Matematika**, garantizando rigor lógico absoluto, atomicidad modular, accesibilidad pedagógica y simetría trilingüe (**Castellano**, **Euskara Batua** e **Inglés**).

---

## 1. Filosofía Arquitectónica y Separación por Marcos (`framework`)

La enciclopedia modela el conocimiento matemático como un **bosque de sistemas deductivos (DAGs)** interconectados semánticamente, evitando el reduccionismo de forzar toda la matemática bajo una única raíz.

### 1.1. Los Cinco Marcos Teóricos Canónicos
Todo artículo debe declarar formalmente su marco teórico en los metadatos (`framework`):

1. **`sintetico` (MSC: `51M`, `51A`):** Geometría sintética pura (Hilbert, Tarski, Birkhoff). Trata con entes geométricos primitivos no definidos numéricamente y sus axiomas de incidencia, orden, congruencia y continuidad.
2. **`afin-vectorial` (MSC: `15A`, `51N`):** Geometría analítica, álgebra lineal y espacios afines $\mathbb{A}^n(K)$ sobre un cuerpo $K$. Los objetos se construyen como variedades lineales ($p + V$).
3. **`proyectivo` (MSC: `51A`, `51E`):** Geometría proyectiva axiomática y algebraica ($\mathbb{P}(V)$, coordenadas homogéneas, geometrías finitas como el Plano de Fano $PG(2,2)$).
4. **`diferencial-metrico` (MSC: `53A`, `53C`, `54A`):** Topología general, espacios métricos y variedades de Riemann. Los objetos lineales se generalizan a curvas geodésicas ($\nabla_{\dot{\gamma}} \dot{\gamma} = 0$).
5. **`set-teorico` (MSC: `03E`, `03B`, `03C`):** Teoría axiomática de conjuntos ($\text{ZFC}$), lógica formal y teoría de modelos.

### 1.2. Principio de Separación Epistemológica (Sintaxis vs. Semántica)
- **Prohibición de Contaminación de Marcos:** La definición formal en el bloque `<Definicion>` de un concepto sintético (ej. `recta`) **nunca debe contener coordenadas cartesianas, vectores ni métricas**.
- **Tratamiento de Modelos:** La realización de una teoría abstracta en un dominio concreto (ej. $\mathbb{R}^2$ como modelo de los axiomas de Hilbert) se desarrolla en la sección de modelos del artículo o se traslada a un nodo dedicado de tipo `type: "modelo"`.

---

## 2. Grafo de Conocimiento y Causalidad Lógica (`isDependency`)

El analizador estático (`npm run validate-graph`) infiere el Grafo Acíclico Dirigido (DAG) deductivo examinando los atributos `isDependency={true}` en los enlaces `<ConceptLink>`.

### 2.1. Reglas de Marcado Deductivo

| Tipo de Nodo | Elemento / Contexto | `isDependency` | Justificación |
| :--- | :--- | :--- | :--- |
| **Primitivo** (`subtype: "primitivo"`) | Cualquier enlace en su cuerpo | **`false` (o ausente)** | Es una raíz del grafo (nivel 0 / -1). Prohibido tener dependencias entrantes. |
| **Derivado** (`subtype: "derivado"`) | Conceptos constitutivos en `<Definicion>` | **`true`** | Obligatorio. Define la causalidad constructiva del nuevo ente. |
| **Demostración** (`type: "demostracion"`) | Axiomas, lemas y teoremas en `<ProofStep>` | **`true`** | Obligatorio. Fundamenta el paso inferencial en el árbol lógico. |
| **Demostración** (`type: "demostracion"`) | El teorema demostrado (`parentTheorem`) | **`false` (o ausente)** | Prohibido. Evita ciclos lógicos y autorreferencias espurias. |
| **Cualquier nodo** | Términos auxiliares o contexto divulgativo | **`false` (o ausente)** | Permite la navegación hipertextual sin alterar el DAG causal. |

### 2.2. Prohibición Absoluta de Autorreferencias
Un archivo con `id: "concepto"` **nunca** debe incluir `<ConceptLink targetId="concepto">` apuntando a sí mismo.

---

## 3. Catálogo Exhaustivo de Componentes MDX y Sintaxis

### 3.1. `<Capitular letra="X" />`
Inicializa el artículo estilizando la primera letra del primer párrafo descriptivo.
```tsx
<Capitular letra="L"/>a recta es un concepto primitivo fundamental...
```

### 3.2. `<ConceptLink targetId="..." isDependency={true|false}>Texto</ConceptLink>`
Crea enlaces hipertextuales en la enciclopedia e informa al motor de grafos.
- `targetId`: Identificador exacto del archivo MDX destino (sin extensión `.mdx`).
- `isDependency`: Booleano opcional (por defecto `false`).

### 3.3. `<VisualBind element="..." color="...">Fórmula</VisualBind>`
Vincula términos matemáticos en el texto o fórmulas con elementos interactivos del diagrama (JSXGraph / Canvas / WebGL).
- `element`: Identificador del objeto en el script de simulación (`pA`, `lineAB`, `segBC`, `polyABC`).
- `color`: Nombre del token de color del tema:
  - `"musgo"`: Primario geométrico (#2D5A27 / verde natural).
  - `"azul"`: Elementos secundarios (#1E40AF).
  - `"terracota"`: Elementos destacados o auxiliares (#C2410C).
  - `"ocre"`: Elementos angulares (#B45309).

```tsx
Dados dos puntos <VisualBind color="musgo" element="pA">$A$</VisualBind> y <VisualBind color="musgo" element="pB">$B$</VisualBind>, la recta <VisualBind color="azul" element="lineAB">$\overleftrightarrow{AB}$</VisualBind>...
```

### 3.4. `<Definicion title="..."> ... </Definicion>`
Bloque destacado para la formulación matemática estricta.
- En conceptos primitivos: Declaración abstracta en la firma de la teoría ($\ell \in \mathcal{L}$).
- En conceptos derivados: Construcción simbólica unívoca con cuantificadores y pertenencias.

### 3.5. `<Separador />`
Línea divisoria horizontal estilizada para separar secciones estructurales mayores.

### 3.6. `<SeccionPropiedades>`, `<PropiedadesGrupo>` y `<PropiedadItem>`
Bloques estructurados para enunciar y enlazar teoremas demostrables derivados del concepto.
- Todo `<PropiedadItem>` debe incluir `id` (apuntando al teorema correspondiente) y `title` formal.
- No debe utilizarse para duplicar axiomas completos.

```tsx
<SeccionPropiedades>
  <PropiedadesGrupo title="Teoremas de Incidencia">
    <PropiedadItem id="teorema-interseccion-rectas" title="Intersección en espacios lineales">
      $ \forall \ell_1, \ell_2 \in \mathcal{L}, \; \ell_1 \neq \ell_2 \implies |\ell_1 \cap \ell_2| \le 1 $
    </PropiedadItem>
  </PropiedadesGrupo>
</SeccionPropiedades>
```

### 3.7. `<DemonstrationSection>`, `<ProofStep>` y `<Nota>`
Componentes dedicados a páginas de demostración formal paso a paso (`type: "demostracion"`).
- `<DemonstrationSection diagram={<DiagramaDemo />}>`: Contenedor principal en layout dividido (*split view*).
- `<ProofStep number={n} target="elemVisual" title="...">`: Paso deductivo con foco interactivo.
- `<Nota title="...">`: Observaciones metamatemáticas o comentarios pedagógicos.

```tsx
<ProofStep number="{1}" target="pC" title="Construcción del punto auxiliar">
  Por el <ConceptLink isDependency="{true}" targetId="axioma-orden-extension">axioma de extensión</ConceptLink>, existe un punto <VisualBind color="terracota" element="pC">$C$</VisualBind> tal que $A * B * C$.
</ProofStep>
```

---

## 4. Integración de Diagramas Interactivos y Simulaciones

Todo artículo con `hasSimulation: true` debe enlazar su componente interactivo de JSXGraph o React mediante exportación nominal:

```tsx
// Importación del componente de diagrama visual
import { DiagramaRecta } from '@content/diagrams/Definiciones/DiagramaRecta';

// Exportación obligatoria para el motor de renderizado
export const Simulation = DiagramaRecta;
```

---

## 5. Especificación del Esquema de Metadatos

```typescript
export interface ContentMetadata {
  id: string;                         // Identificador único (kebab-case, ej: "recta")
  conceptKey: string;                 // Clave conceptual unificadora para perspectivas (ej: "recta")
  lang: 'es' | 'eu' | 'en';           // Código de idioma
  type: 'definicion' | 'axioma' | 'teorema' | 'demostracion' | 'modelo' | 'ejemplo';
  subtype?: 'primitivo' | 'derivado'; // Obligatorio si type === 'definicion'
  framework: 'sintetico' | 'afin-vectorial' | 'proyectivo' | 'diferencial-metrico' | 'set-teorico';
  branch: string;                     // Código MSC 2020 válido (ej: "51M04", "15A03")
  title: string;                      // Título formal del artículo
  description: string;                // Resumen conciso de 1 frase para metadatos y tooltips
  hasSimulation: boolean;             // true si monta componente interactivo
  
  // Para demostraciones:
  parentTheorem?: string;             // ID del teorema que demuestra
  proofMethod?: 'metodo-directo' | 'reduccion-al-absurdo' | 'induccion' | 'construccion';
  layout?: 'split' | 'stacked';

  // Navegación multiperspectiva:
  perspectives?: {
    framework: string;
    targetId: string;
    label: { es: string; eu: string; en: string };
  }[];

  sources: {
    title: string;
    author: string;
    locator: string;
    role: 'primary' | 'secondary';
  }[];
}
```

---

## 6. Plantillas Maestras Completas

### 6.1. Concepto Primitivo Sintético (`recta.mdx`)
```tsx
export const metadata = {
  id: "recta",
  conceptKey: "recta",
  lang: "es",
  type: "definicion",
  subtype: "primitivo",
  framework: "sintetico",
  title: "Recta",
  description: "Concepto geométrico primitivo caracterizado implícitamente por los axiomas del sistema formal.",
  branch: "51M04",
  hasSimulation: true,
  perspectives: [
    {
      framework: "afin-vectorial",
      targetId: "recta-afin",
      label: { es: "Espacio Afín", eu: "Espazio Afina", en: "Affine Space" }
    }
  ],
  sources: [
    { title: "Grundlagen der Geometrie", author: "David Hilbert", locator: "Capítulo I, §1", role: "primary" }
  ]
};

import { DiagramaRecta } from '@content/diagrams/Definiciones/DiagramaRecta';
export const Simulation = DiagramaRecta;

<Capitular letra="L"/>a recta es un <ConceptLink targetId="concepto-primitivo">concepto primitivo</ConceptLink> fundamental de la geometría sintética. No admite una definición constructiva explícita; su naturaleza formal queda determinada por los <ConceptLink targetId="axioma">axiomas</ConceptLink> que gobiernan su relación de <ConceptLink targetId="incidencia">incidencia</ConceptLink> con los <ConceptLink targetId="punto">puntos</ConceptLink> y los <ConceptLink targetId="plano">planos</ConceptLink>.

<Definicion title="Declaración Formal">
  En una <ConceptLink targetId="estructura-de-incidencia">estructura de incidencia</ConceptLink> formal, una recta es un elemento básico:
  $$
  \ell \in \mathcal{L}
  $$
  donde $\mathcal{L}$ representa el conjunto de rectas de la signatura geométrica.
</Definicion>

<Separador/>

### Caracterización axiomática

- **<ConceptLink targetId="axiomas-incidencia-hilbert">Incidencia</ConceptLink>:** Cualesquiera dos puntos distintos determinan una única recta que pasa por ambos. Toda recta contiene al menos dos puntos.
- **<ConceptLink targetId="axiomas-orden-hilbert">Orden e intermediación</ConceptLink>:** En geometrías ordenadas, la relación ternaria <ConceptLink targetId="estar-entre">estar entre</ConceptLink> dota a la recta de un <ConceptLink targetId="orden-lineal">orden lineal</ConceptLink> estricto, denso y sin extremos.
- **Separación lineal:** Todo punto perteneciente a una recta determina una partición de sus puntos restantes en dos <ConceptLink targetId="semirrecta">semirrectas</ConceptLink> disjuntas y convexas.

### Realizaciones en modelos canónicos

- **Espacio afín real $\mathbb{A}^n(\mathbb{R})$:** Variedad afín de dimensión $1$ generada por un punto de paso y un vector director.
- **Plano cartesiano $\mathbb{R}^2$:** Conjunto de pares $(x, y)$ que satisfacen la ecuación lineal general $Ax + By + C = 0$, con $(A, B) \neq (0, 0)$.
- **Geometrías no euclidianas:** Círculos máximos en la esfera $S^2$, o curvas ortogonales a la frontera en el disco de Poincaré.

<Separador/>

<SeccionPropiedades>
  <PropiedadesGrupo title="Teoremas fundamentales">
    <PropiedadItem id="teorema-interseccion-rectas" title="Intersección en espacios lineales">
      $ \forall \ell_1, \ell_2 \in \mathcal{L}, \; \ell_1 \neq \ell_2 \implies |\ell_1 \cap \ell_2| \le 1 $
    </PropiedadItem>
    <PropiedadItem id="teorema-determinacion-plano-recta-punto" title="Determinación del plano">
      $ \forall \ell \in \mathcal{L}, \; \forall P \notin \ell \implies \exists! \, \pi \text{ tal que } \ell \subset \pi \land P \in \pi $
    </PropiedadItem>
  </PropiedadesGrupo>
</SeccionPropiedades>
```

### 6.2. Concepto Derivado (`triangulo.mdx`)
```tsx
export const metadata = {
  id: "triangulo",
  conceptKey: "triangulo",
  lang: "es",
  type: "definicion",
  subtype: "derivado",
  framework: "sintetico",
  title: "Triángulo",
  description: "Figura geométrica delimitada por tres segmentos determinados por tres puntos no colineales.",
  branch: "51M04",
  hasSimulation: true,
  sources: [
    { title: "Grundlagen der Geometrie", author: "David Hilbert", locator: "Capítulo I, §4", role: "primary" }
  ]
};

import { DiagramaTriangulo } from '@content/diagrams/Definiciones/DiagramaTriangulo';
export const Simulation = DiagramaTriangulo;

<Capitular letra="U"/>n triángulo es la figura geométrica fundamental del plano formada por tres vértices no alineados y los tres segmentos que los conectan dos a dos.

<Definicion title="Definición Constructiva">
  Dados tres <ConceptLink isDependency="{true}" targetId="punto">puntos</ConceptLink> no colineales <VisualBind color="musgo" element="pA">$A$</VisualBind>, <VisualBind color="musgo" element="pB">$B$</VisualBind> y <VisualBind color="musgo" element="pC">$C$</VisualBind>, el triángulo <VisualBind color="musgo" element="polyABC">$\triangle ABC$</VisualBind> se define formalmente como la unión de los tres <ConceptLink isDependency="{true}" targetId="segmento">segmentos</ConceptLink> que determinan:
  $$
  \triangle ABC = \overline{AB} \cup \overline{BC} \cup \overline{CA}
  $$
</Definicion>

<Separador/>

### Elementos constitutivos

- **Vértices:** La terna de puntos no colineales $\{A, B, C\}$.
- **Lados:** Los tres segmentos $\overline{AB}$, $\overline{BC}$ y $\overline{CA}$.
- **Ángulos interiores:** Los tres <ConceptLink targetId="angulo">ángulos</ConceptLink> $\angle BAC$, $\angle ABC$ y $\angle BCA$.

<Separador/>

<SeccionPropiedades>
  <PropiedadesGrupo title="Teoremas clásicos asociados">
    <PropiedadItem id="teorema-suma-angulos-triangulo" title="Suma de ángulos interiores">
      $ \angle A + \angle B + \angle C = \pi \text{ (en geometría euclidiana)} $
    </PropiedadItem>
    <PropiedadItem id="teorema-desigualdad-triangular" title="Desigualdad triangular">
      $ \overline{AB} < \overline{AC} + \overline{CB} $
    </PropiedadItem>
  </PropiedadesGrupo>
</SeccionPropiedades>
```

### 6.3. Demostración Paso a Paso (`demo-interseccion-rectas.mdx`)
```tsx
export const metadata = {
  id: "demo-interseccion-rectas",
  type: "demostracion",
  title: "Demostración: Intersección máxima de dos rectas distintas",
  description: "Prueba por reducción al absurdo fundamentada en el primer axioma de incidencia de Hilbert.",
  parentTheorem: "teorema-interseccion-rectas",
  framework: "sintetico",
  branch: "51M04",
  proofMethod: "reduccion-al-absurdo",
  authors: ["hilbert"],
  tags: ["incidencia", "rectas", "unicidad"],
  layout: "split",
  sources: [
    { title: "Grundlagen der Geometrie", author: "David Hilbert", locator: "Capítulo I, §1", role: "primary" }
  ]
};

import { DiagramaDemoInterseccion } from "@content/diagrams/Demos/DiagramaDemoInterseccion";

<DemonstrationSection diagram="{<DiagramaDemoInterseccion"/>}>

<Capitular letra="S"/>e demuestra que dos <ConceptLink targetId="recta">rectas</ConceptLink> distintas coplanares no pueden cortarse en más de un <ConceptLink targetId="punto">punto</ConceptLink>.

<Separador/>

### Demostración paso a paso

<ProofStep number="{1}" target="lineasIniciales" title="Hipótesis de reducción al absurdo">
  Sean <VisualBind color="musgo" element="lineA">$\ell_1$</VisualBind> y <VisualBind color="azul" element="lineB">$\ell_2$</VisualBind> dos rectas distintas ($\ell_1 \neq \ell_2$). Supongamos por reducción al absurdo que intersecan en al menos dos puntos distintos <VisualBind color="terracota" element="pP">$P$</VisualBind> y <VisualBind color="terracota" element="pQ">$Q$</VisualBind> ($P \neq Q$).
</ProofStep>

<ProofStep number="{2}" target="incidenciaDoble" title="Aplicación del axioma de incidencia">
  Por hipótesis, $P \in \ell_1 \land Q \in \ell_1$, y simultáneamente $P \in \ell_2 \land Q \in \ell_2$. Sin embargo, por el <ConceptLink isDependency="{true}" targetId="axiomas-incidencia-hilbert">Axioma I.1 de Incidencia</ConceptLink>, por dos puntos distintos pasa una **única** recta.
</ProofStep>

<ProofStep number="{3}" target="conclusionAbsurdo" title="Contradicción y conclusión">
  La existencia de dos rectas que contienen a $P$ y a $Q$ implica $\ell_1 = \ell_2$, lo cual contradice la hipótesis inicial $\ell_1 \neq \ell_2$. Por tanto, $|\ell_1 \cap \ell_2| \le 1$.
</ProofStep>

<Separador/>

### Análisis deductivo
<Nota title="Alcance del resultado">
  Esta demostración depende exclusivamente del Axioma I.1. Por tanto, es válida en toda geometría de incidencia lineal, con independencia de los axiomas de paralelas o de orden.
</Nota>

</DemonstrationSection>
```

---

## 7. Estándares de Notación KaTeX

- **Conjuntos numéricos:** $\mathbb{R}$, $\mathbb{Z}$, $\mathbb{N}$, $\mathbb{Q}$, $\mathbb{C}$.
- **Segmentos geométricos:** Usar $\overline{AB}$ para el segmento como conjunto de puntos. Reservar $d(A, B)$ o $AB$ para la distancia numérica.
- **Semirrectas:** $\overrightarrow{AB}$.
- **Rectas generadas:** $\overleftrightarrow{AB}$.
- **Ángulos:** $\angle ABC$ o $\widehat{ABC}$.
- **Planos y espacios:** $\pi$, $\alpha$, $\beta$ para planos sintéticos; letra caligráfica $\mathcal{P}$ para el conjunto de puntos, $\mathcal{L}$ para rectas y $\mathcal{E}$ para espacios afines.
- **Cardinalidad:** $\lvert S \rvert$ o $\text{card}(S)$ (prohibido `\card`).
- **Tablas Markdown:** Usar siempre `\mid` o `\lvert \dots \rvert` dentro de KaTeX (prohibido `|` suelto para evitar romper el parser Markdown).

---

## 8. Glosario Técnico de Euskara Batua

| ❌ Término Prohibido | ✅ Término Correcto | Ámbito / Significado |
|---|---|---|
| `nekez` (significa *raras veces*) | **`nahitaez`** / **`ezinbestean`** | *"necesariamente"* |
| `ekitzaile` (significa *activista*) | **`ebakitzaile`** | Recta *"secante"* |
| `koproportzio` (inexistente) | **`koziente`** | *"cociente"* |
| `tratuaren` (del trato) | **`higikariaren`** / **`gorputzaren`** | Móvil / cuerpo en movimiento |
| `konhexu` ('h' incorrecta) | **`konbexu`** / **`ganbil`** | *"convexo"* |
| `strictly` (anglicismo) | **`zorrozki`** / **`zorrotz`** | *"estrictamente"* |
| `alderanzgarri` | **`alderantzizgarri`** | Matriz *"invertible"* |
| `Asociatibitatea` (con 'c') | **`Asoziatibitatea`** / **`Elkartuzkotasuna`** | *"asociatividad"* |
| `zuzenki segmentuen` (redundancia) | **`zuzenkien`** / **`segmentuen`** | *"segmentos de recta"* |
| `Parerik gabe aldeen...` | **`Alde-parerik kongruente gabe`** | *"sin pares de lados congruentes"* |

---

## 9. Protocolo de Auto-Auditoría en 5 Filtros

Antes de dar por concluida la redacción de cualquier archivo:

1. **Filtro 1: Simetría Trilingüe:** El identificador `id` existe en `content/mdx/es/`, `content/mdx/eu/` y `content/mdx/en/` con idénticos metadatos estructurales.
2. **Filtro 2: Corrección Léxica en Euskara:** Comprobación estricta contra el glosario técnico de la Sección 8.
3. **Filtro 3: Notación KaTeX:** KaTeX limpio, uso de $\overline{AB}$, sin macros inexistentes.
4. **Filtro 4: Integridad Causal:** 
   - Primitivos: `subtype: "primitivo"` sin `isDependency={true}`.
   - Derivados: `subtype: "derivado"` con `isDependency={true}` en conceptos base.
   - Demostraciones: `isDependency={true}` en axiomas y lemas justificativos.
5. **Filtro 5: Validación Estática:**
   ```bash
   npm run validate-references && npm run validate-graph
   ```