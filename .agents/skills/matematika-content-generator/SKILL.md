---
name: matematika-content-generator
description: Guía y estándar estricto para la generación automatizada y manual de contenido atómico en MDX para la Enciclopedia Matemática en Castellano, Euskara e Inglés. Utilizar siempre que se creen o editen artículos, definiciones, teoremas, demostraciones o ejemplos.
---

# Guía Estricta de Generación de Contenido — Enciclopedia Matemática

Esta skill define el protocolo obligatorio e inflexible para redactar y estructurar páginas atómicas de la Enciclopedia Matemática en tres idiomas (**Castellano**, **Euskara** e **Inglés**).

---

## 1. Filosofía Central: Enciclopedia Hiperenlazada, Educativa y Rigurosa

La Enciclopedia Matemática es una red semántica hiperenlazada de conocimiento matemático. Para maximizar su valor pedagógico y formal, todo contenido debe adherirse a cuatro pilares:

1. **Simplicidad y Foco Atómico:** Una página de definición contiene **únicamente la definición y su formulación formal precisa**. Toda propiedad con relevancia matemática demostrable es un nodo independiente de tipo `teorema` (con su propia página y demostración interactiva `/demo/:id`), y se enlaza en la definición mediante la tríada estructurada `<SeccionPropiedades>`, `<PropiedadesGrupo>` y `<PropiedadItem>`. No se incluyen introducciones históricas largas, divagaciones ni explicaciones redundantes: todo concepto auxiliar se delega a su propia página mediante `<ConceptLink>`.
2. **Claridad Educativa sin Florituras:** Explicaciones directas, accesibles y limpias. Sin retórica innecesaria, metáforas confusas ni texto de relleno.
3. **Rigor Matemático Absoluto (100%):** Cada afirmación debe ser matemáticamente exacta, formal y consistente en su marco teórico. Prohibido atribuir propiedades dependientes de estructura adicional (ej. métricas o medidas de Lebesgue) como si fueran universales del concepto abstracto.
4. **Estructura Modular por Ramas Matemáticas:** Si un concepto tiene definiciones, caracterizaciones o propiedades distintas según la rama matemática (ej. Geometría sintética, Geometría analítica, Topología, Álgebra), la página se divide en **secciones explícitas para cada rama** (`### Geometría sintética`, `### Geometría analítica`, etc.), con la formulación formal precisa de cada una.

---

## 2. Dependencias Lógicas y Grafo de Axiomas (`isDependency={true}`)

El Grafo de Conocimiento infiere automáticamente las aristas deductivas a partir del atributo `isDependency={true}` en los componentes `<ConceptLink>`. Para garantizar que el árbol de axiomas y teoremas se construya sin errores:

### 2.1. En Demostraciones (`type: "demostracion"`)
- **Obligatorio en Justificaciones Deductivas:** En cada paso `<ProofStep>`, todo axioma, lema, teorema previo o definición que fundamente formalmente la deducción **debe llevar `isDependency={true}`**:
  ```tsx
  <ProofStep number={2} title="Trazado de la paralela">
    Por el <ConceptLink targetId="axioma-paralelas-euclides" isDependency={true}>axioma de las paralelas</ConceptLink>, existe una única <ConceptLink targetId="recta">recta</ConceptLink> paralela...
  </ProofStep>
  ```
- **Prohibido en el Teorema Demostrado (`parentTheorem`):** El teorema que se está demostrando nunca debe llevar `isDependency={true}` en el texto de la demostración para evitar ciclos y autorreferencias espurias.
- **Enlaces Contextuales:** Términos descriptivos o elementos auxiliares del diagrama no llevan `isDependency`.

### 2.2. En Definiciones Derivadas (`type: "definicion"`, `subtype: "derivado"`)
- **Obligatorio en Conceptos Constitutivos:** Los conceptos matemáticos indispensables sobre los que se construye la fórmula o definición formal llevan `isDependency={true}`:
  ```tsx
  Un <ConceptLink targetId="triangulo">triángulo</ConceptLink> es un polígono delimitado por tres <ConceptLink targetId="segmento" isDependency={true}>segmentos</ConceptLink> que unen tres <ConceptLink targetId="punto" isDependency={true}>puntos</ConceptLink> no colineales.
  ```

### 2.3. En Conceptos Primitivos (`subtype: "primitivo"`)
- **Prohibido `isDependency={true}`:** Los conceptos primitivos son raíces topológicas (nivel `-1` en el grafo lógico) y actúan como cortafuegos. No deben declarar dependencias hacia otros conceptos dentro de su cuerpo.

---

## 3. Estándar para Conceptos Primitivos (`subtype: "primitivo"`)

Un concepto es primitivo cuando constituye una noción fundacional no definida constructivamente dentro de una teoría axiomática formal (ej. *punto*, *recta*, *plano*, *estar entre*, *incidencia*, *pertenencia*).

### Reglas de Redacción para Conceptos Primitivos:
1. **Metadatos:** Declarar explícitamente `subtype: "primitivo"`.
2. **Párrafo Inicial:** Breve, directo y formal, estableciendo que se trata de una noción elemental o primitiva del espacio/teoría.
3. **División por Ramas Matemáticas:**
   - **Rama Sintética / Axiomática:** Se explicita que es un término primitivo no definido en el sistema formal, gobernado por sus axiomas rectores (incidencia, orden, congruencia).
   - **Rama Analítica / Espacios Vectoriales:** Se expone su realización formal concreta (ej. $n$-tupla $(x_1, \dots, x_n) \in \mathbb{R}^n$).
   - **Rama Topológica / Conjuntista:** Se define como elemento $x \in X$ del conjunto portador.
4. **Propiedades Rigurosamente Condicionadas:** Especificar siempre el marco formal de cada propiedad (*"En la geometría sintética..."*, *"En presencia de una métrica..."*).

---

## 4. Protocolo Obligatorio de Investigación Previa y Contraste de Rigor

Antes de redactar o modificar cualquier concepto, definición, teorema o demostración, todo generador/subagente debe **contrastar activamente la información** antes de escribir:

1. **Búsqueda e Investigación Previa en Fuentes Canónicas:** Realizar búsquedas y contrastar la formulación formal contra las fuentes de referencia de la matemática moderna (Wolfram MathWorld, nLab, Encyclopaedia of Mathematics, Stacks Project, Bourbaki, Hilbert, Tarski, literatura académica actual).
2. **Resaltado y Selección Rigurosa de Información:**
   - Extraer la definición formal unificadora y las caracterizaciones exactas por ramas matemáticas.
   - Descartar anacronismos, vaguedades o pseudo-definiciones históricas (ej. utilizar intuiciones de Euclides como axiomas o propiedades formales modernas).
   - Asegurar que la notación matemática, cuantificadores ($\forall, \exists$), pertenencias ($\in$) y restricciones de dominio ($n \ge 2$, entornos abiertos) coincidan rigurosamente con los estándares de la matemática actual.
3. **Epistemología de Modelos vs Teoría Abstracta:** Verificar que no se confunda una estructura abstracta con un modelo particular (ej. el concepto abstracto de punto no equivale únicamente a su modelo cartesiano $\mathbb{R}^n$).

---

## 5. Reglas de Autorreferencia y Enlazado

- **Prohibición Total de Autorreferencias:** Una página con `id: "concepto"` **nunca debe contener un `<ConceptLink targetId="concepto">` apuntando a sí misma**.
- **Hiper-enlazado Exhaustivo:** Todos los conceptos matemáticos con potencial de poseer página propia deben ir envueltos en `<ConceptLink targetId="...">` desde su primera mención (salvo el propio `id`).
- **Persona Gramatical:** Tercera persona del singular impersonal estricta en los tres idiomas:
  - Castellano: *"Se define como...", "Un triángulo es..."* (Prohibido *"vemos"*, *"consideremos"*).
  - Euskara: *"Honela definitzen da...", "Egitura aljebraiko bat da..."* (Euskara Batua según UZEI/Euskalterm).
  - Inglés: *"Is defined as...", "A point is..."* (Estilo enciclopédico neutro).

---

## 6. Glosario Obligatorio de Euskara Técnico y Falsos Amigos

| ❌ Término Prohibido / Antipatrón | ✅ Término Correcto | Ámbito / Significado |
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

## 7. Estándares de Notación KaTeX y Dominio Matemático

- **Conjuntos numéricos:** Usar $\mathbb{R}$, $\mathbb{Z}$, $\mathbb{N}$, $\mathbb{Q}$, $\mathbb{C}$.
- **Segmentos geométricos:** Usar $\overline{AB}$ para el segmento continuo (nunca $AB$ a secas, que representa la distancia escalar $d(A, B)$).
- **Ángulos:** Usar $\angle ABC$ o $\widehat{ABC}$.
- **Espacios y planos:** Letra caligráfica $\mathcal{P}$ para planos, $\mathcal{E}$ para espacios.
- **Prohibido `\card`:** Usar $\lvert G \rvert$ o $\text{card}(G)$.
- **Plepas en tablas Markdown:** En tablas markdown, nunca usar `|` dentro de KaTeX; usar `\lvert ... \rvert` o `\mid`.
- **Restricciones de dominio:** Especificar siempre $\text{GL}_n(\mathbb{R})$ con $n \ge 2$, entornos abiertos $(x_0 - \delta, x_0 + \delta) \subset I$ para derivadas, etc.

---

## 8. Taxonomía MSC 2020 (`branch`)

Cada artículo debe especificar un código válido de **MSC 2020** registrado en `src/data/content/msc2020.ts` dentro de la propiedad `branch`:
- Geometría Euclidiana y Absoluta: `51M`
- Teoría de Grupos: `20` (o `20D`, `20F`)
- Análisis Real / Funciones de una variable: `26A`
- Álgebra Lineal: `15A`
- Fundamentos y Lógica: `03`

---

## 9. Secuencia Estricta de Componentes MDX

### 9.1. Esquema de Definición Atómica (Concepto Estándar o Multirrama)
```tsx
export const metadata = {
  id: "identificador",
  lang: "es", // "eu" | "en"
  type: "definicion",
  subtype: "derivado", // "primitivo" si es noción no definida
  title: "Título",
  description: "Descripción concisa en una frase.",
  branch: "51M", // Código MSC 2020
  hasSimulation: true, // true | false
  sources: [
    { title: "Obra", author: "Autor", locator: "Capítulo/Sección", role: "primary" }
  ]
};

import { Componente } from '@content/diagrams/Definiciones/Componente';
export const Simulation = Componente;

<Capitular letra="X" />... Párrafo inicial accesible e hiperenlazado ...

<Definicion title="">
  ... Definición formal directa y precisa en KaTeX ...
</Definicion>

<Separador />

### Geometría sintética (o rama correspondiente)
... Definición o axiomas rectores de la rama ...

### Geometría analítica (si aplica)
... Realización analítica / coordenadas / fórmula ...

<Separador />

<SeccionPropiedades>
  <PropiedadesGrupo title="Rama / Categoría de propiedades">
    <PropiedadItem id="teorema-identificador-1" title="Nombre formal en el idioma del archivo">
      $ \text{Fórmula o relación simbólica concisa} $
    </PropiedadItem>
    <PropiedadItem id="teorema-identificador-2" title="Nombre formal 2">
      $ \forall x \in X, \; P(x) \implies Q(x) $
    </PropiedadItem>
  </PropiedadesGrupo>
</SeccionPropiedades>
```

### 9.2. Esquema de Demostración Formal Paso a Paso
```tsx
export const metadata = {
  id: "demo-identificador",
  type: "demostracion",
  title: "Demostración: Nombre del Teorema",
  description: "Descripción breve del método deductivo empleado.",
  parentTheorem: "teorema-identificador",
  branch: "51M",
  proofMethod: "metodo-directo",
  authors: ["euclides"],
  tags: ["geometria", "triangulos"],
  layout: "split",
  sources: [...]
};

import { DiagramaDemo } from "@content/diagrams/Demos/DiagramaDemo";

<DemonstrationSection diagram={<DiagramaDemo />}>

<Capitular letra="D" />ado un ... se demuestra formalmente el <ConceptLink targetId="teorema-identificador">Teorema</ConceptLink>.

<Separador />

### Demostración paso a paso

<ProofStep number={1} target="elemento1" title="Título del paso">
  Fijación de hipótesis y configuración inicial.
</ProofStep>

<ProofStep number={2} target="elemento2" title="Paso deductivo">
  Por el <ConceptLink targetId="axioma-paralelas-euclides" isDependency={true}>axioma de las paralelas</ConceptLink> y el <ConceptLink targetId="teorema-previo" isDependency={true}>teorema previo</ConceptLink>, se deduce...
</ProofStep>

<Separador />

### Análisis deductivo
<Nota>
  Observaciones formales sobre el método de prueba.
</Nota>

</DemonstrationSection>
```

---

## 10. Modelos de Oro (Golden Exemplars)

Toma como referencia exacta la estructura y estilo de los siguientes artículos modelo aprobados:

### 10.1. Geometría (MSC 51M) — `triangulo`
- Castellano: `content/mdx/es/definitions/triangulo.mdx`
- Euskara: `content/mdx/eu/definitions/triangulo.mdx`
- Inglés: `content/mdx/en/definitions/triangulo.mdx`

### 10.2. Álgebra Abstracta (MSC 20) — `grupo`
- Castellano: `content/mdx/es/definitions/grupo.mdx`
- Euskara: `content/mdx/eu/definitions/grupo.mdx`
- Inglés: `content/mdx/en/definitions/grupo.mdx`

### 10.3. Análisis Matemático (MSC 26A) — `derivada`
- Castellano: `content/mdx/es/definitions/derivada.mdx`
- Euskara: `content/mdx/eu/definitions/derivada.mdx`
- Inglés: `content/mdx/en/definitions/derivada.mdx`

### 10.4. Demostración Formal Paso a Paso — `demo-suma-angulos-triangulo`
- Castellano: `content/mdx/es/demonstrations/demo-suma-angulos-triangulo.mdx`
- Euskara: `content/mdx/eu/demonstrations/demo-suma-angulos-triangulo.mdx`
- Inglés: `content/mdx/en/demonstrations/demo-suma-angulos-triangulo.mdx`

---

## 11. Protocolo de Auto-Auditoría en 5 Filtros

Antes de concluir la creación o edición de cualquier archivo MDX, todo subagente debe ejecutar este chequeo:

1. **Filtro 1: Simetría Trilingüe:** El identificador `id` debe existir de forma exacta en los tres directorios (`content/mdx/es/`, `content/mdx/eu/`, `content/mdx/en/`) con idéntico mapa de metadatos y sin autorreferencias al propio `id`.
2. **Filtro 2: Falsos Amigos en Euskara:** Consultar el Glosario de la Sección 6 para verificar que no existan errores como `nekez`, `ekitzaile`, `strictly`, etc.
3. **Filtro 3: Dominio Matemático y Rigor KaTeX:** Notación correcta ($\overline{AB}$ para segmentos, $\text{dim} = 0$, $\mathbb{R}^n$, $\lvert G \rvert$), sin macros inválidas como `\card`.
4. **Filtro 4: Causalidad Lógica y Subtipo:**
   - Si es primitivo: `subtype: "primitivo"` y sin `isDependency={true}` en su cuerpo.
   - Si es derivado: `subtype: "derivado"` y con `isDependency={true}` en los conceptos constitutivos.
   - Si es demostración: `isDependency={true}` en cada axioma/teorema/lema que justifique un paso deductivo en `<ProofStep>`.
5. **Filtro 5: Validación Estática de Grafo y Referencias:**
   ```bash
   npm run validate-references && npm run validate-graph
   ```

