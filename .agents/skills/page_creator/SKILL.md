# Skill: page_creator — Generador de Contenido Matemático para Matematika

> **Fuente de verdad única.** Este documento absorbe y reemplaza `STYLEGUIDE.md`.
> Toda decisión arquitectónica, estética y de contenido de Matematika vive aquí.

## Índice

1. [Filosofía del Proyecto](#1-filosofía-del-proyecto)
2. [Regla de IDs Invariante (CRÍTICO)](#2-regla-de-ids-invariante-crítico)
3. [Formato de Metadata](#3-formato-de-metadata)
4. [El Campo `links` — Conexiones Explícitas](#4-el-campo-links--conexiones-explícitas)
5. [Tipos de Contenido y Schemas Completos](#5-tipos-de-contenido-y-schemas-completos)
6. [Estructura de Páginas MDX](#6-estructura-de-páginas-mdx)
7. [Guía de Escritura Matemática](#7-guía-de-escritura-matemática)
8. [Sistema de Enlazado Semántico](#8-sistema-de-enlazado-semántico)
9. [Paleta Arts & Crafts](#9-paleta-arts--crafts)
10. [Grafo y Red de Dependencias](#10-grafo-y-red-de-dependencias)
11. [Convenciones de Naming](#11-convenciones-de-naming)
12. [Estructura de Archivos](#12-estructura-de-archivos)
13. [Exportación de Simulaciones y Diagramas](#13-exportación-de-simulaciones-y-diagramas)
21. [Fuentes de Referencia](#15-fuentes-de-referencia)
22. [Validación Automática (OBLIGATORIA)](#16-validación-automática-obligatorio)
23. [Checklist de Integridad Referencial](#17-checklist-de-integridad-referencial)
24. [Checklist de Calidad por Tipo](#18-checklist-de-calidad-por-tipo)

---

## 1. Filosofía del Proyecto

- **Jardín Digital, no PDF interactivo:** Cada concepto es un nodo navegable en una red de conocimiento. La lectura puede ser lineal o exploratoria.
- **Universalidad absoluta:** El contenido matemático no tiene país, currículo ni sistema educativo. Es atemporal.
- **Interactividad como norma:** Si un concepto puede visualizarse, se visualiza. Si un ejercicio puede hacerse interactivo, lo es.
- **Elegante y limpio:** El diseño sirve a las matemáticas, no compite con ellas.
- **Rigor sobre accesibilidad:** Todo enunciado está justificado. Toda definición es precisa. Toda demostración es completa.
- **Orden topológico:** El contenido se construye de abajo arriba, desde los axiomas. Un concepto no puede referenciar algo que depende lógicamente de él.

---

## 2. Regla de IDs Invariante (CRÍTICO)

Los IDs son las claves primarias de la base de datos de contenido. **NUNCA** se traducen, **NUNCA** se modifican, **NUNCA** se duplican.

### 2.1 Formato — kebab-case ESTRICTO

Todos los IDs DEBEN usar **kebab-case** (minúsculas separadas por guiones). **snake_case está prohibido.**

```
Correcto:   "teorema-pitagoras", "axioma-incidencia-1", "demo-pons-asinorum"
Incorrecto: "teorema_pitagoras", "axioma_incidencia_1", "demo_pons_asinorum"
```

Esto incluye:
- `metadata.id` en cada archivo MDX
- `targetId` en `<ConceptLink>` y `<RefLink>`
- Todas las referencias en `requires`, `demos`, `lemmas`, `corollaries`, `parentTheorem`, `relatedTheorem`, `concept`, `axiomas`, `satisfies`, `axioms_verified`, `authors`, `mathematicians`, `links`, `seeAlso`
- Los literales `type` en metadata: `"caso-de-uso"`, `"plan-de-estudio"` (kebab-case)
- Nombres de archivo: `teorema-pitagoras.mdx`, `demo-pons-asinorum.mdx`

### 2.2 Invariancia

El ID es el mismo en todos los contextos. El título puede traducirse o adaptarse, pero el ID nunca cambia.

### 2.3 IDs de Matemáticos

Los IDs de matemáticos usan el **apellido en kebab-case**, en minúsculas. Si el apellido es ambiguo, se añade una palabra disambiguadora.

```
Correcto:   "euclides", "hilbert", "lobachevski", "dedekind", "gauss"
Correcto (disambiguación): "newton-isaac"
Incorrecto: "richard-dedekind" (nombre propio innecesario)
Incorrecto: "C.F. Gauss" (sin espacios ni puntos en IDs)
```

---

## 3. Formato de Metadata

Todo archivo MDX DEBE exportar un objeto `metadata` con **claves entre comillas dobles**. Las claves sin comillas o con comillas simples están **PROHIBIDAS**.

```typescript
// CORRECTO
export const metadata = {
  "id": "teorema-pitagoras",
  "title": "Teorema de Pitágoras",
  ...
};

// INCORRECTO
export const metadata = {
  id: "teorema-pitagoras",     // ← sin comillas
  'title': 'Teorema...',       // ← comillas simples
  ...
};
```

**Indentación:** 2 espacios en todo el archivo. No tabs, no indentación de 4 espacios.

---

## 4. El Campo `links` y el Grafo de Dependencias

**REGLA CRÍTICA:** Ya no se utilizan campos manuales como `requires`, `links`, o `seeAlso` en la metadata para declarar las relaciones.

Todas las dependencias lógicas y referenciales **se extraen automáticamente de los `<ConceptLink>`** que utilices en el cuerpo del texto MDX. 

- Si un teorema requiere una definición, simplemente enlaza a esa definición en el texto con `<ConceptLink targetId="mi-definicion">`.
- El sistema analizará el AST del documento y construirá el grafo axiomático basándose en esos enlaces.
- Es imperativo que todo concepto matemático mencinado en el texto esté envuelto en su respectivo `<ConceptLink>`, no solo por navegación del usuario, sino porque es lo que forma la red de conocimiento subyacente.
- **El DAG Lógico:** El script de validación (`validate-logical-graph.ts`) extrae estos ConceptLinks para construir un DAG estricto. **NOTA:** Los nodos de tipo `definicion` son extirpados automáticamente del grafo por el script (ya que son puramente léxicos y causarían un efecto embudo). Por tanto, las definiciones no generan dependencias formales en el árbol lógico final, pero DEBEN enlazarse en el texto para facilitar la navegación del usuario.
- **`isDependency={false}`:** CRÍTICO. Si estás enlazando a un concepto que **no es un predecesor lógico estricto** en el árbol de construcciones lógicas (e.g. un lema enlazando a su teorema padre, o una definición genérica de otra rama), **debes usar** `isDependency={false}` en el `<ConceptLink>`. Esto evita ciclos o dependencias falsas, permitiendo cumplir la regla de oro: TODO término matemático debe enlazarse.
  ```jsx
  <ConceptLink targetId="teorema-separacion" isDependency={false}>teorema de separación</ConceptLink>
  ```
- Para referencias cruzadas generales en el texto, usar `<RefLink targetId="...">` — son enlaces semáticos de cuerpo que abren el MarginaliaPanel, pero NO crean una conexión formal en metadata.

---

## 5. Tipos de Contenido y Schemas Completos

Cada archivo MDX DEBE exportar un objeto `metadata`. Los schemas Zod (`src/store/schemas.ts`) son la fuente de verdad para los campos. A continuación, los **schemas completos** para cada tipo.

### 5.1 Axioma (`type: "axioma"`)

```
"id": string (kebab-case)
"type": "axioma"
"title": string
"description": string — explicación informal de lo que afirma el axioma
"statement"?: string — enunciado formal (opcional, puede usar LaTeX)
"authors"?: string[] — IDs de matemáticos
"hasSimulation"?: boolean — si tiene diagrama interactivo
```

**Reglas:**
- El axioma debe ser independiente (no demostrable desde otros axiomas de su sistema)
- Usa solo términos primitivos o previamente definidos
- La descripción informal debe reflejar fielmente el enunciado formal

### 5.2 Definición (`type: "definicion"`)

```
"id": string (kebab-case)
"type": "definicion"
"title": string
"description": string — explicación informal
"statement"?: string — definición formal (opcional)
"authors"?: string[]
"color"?: string — uno de los tokens Arts & Crafts
"hasSimulation"?: boolean — si tiene diagrama interactivo
```

**Reglas:**
- Toda definición DEBE formularse usando solo términos previamente definidos o primitivos
- Las dependencias de una definición se expresan a través de `links` (NO existe `requires` ni `usedBy` en definiciones; las dependencias se generan automáticamente desde los `links`)
- La definición debe ser minimal (sin condiciones extra más allá de lo necesario)
- La notación formal debe coincidir con la descripción verbal

### 5.3 Sistema Axiomático (`type: "sistema-axiomatico"`)

```
"id": string (kebab-case)
"type": "sistema-axiomatico"
"title": string
"description": string — qué teoría define este sistema
"axiomas": string[] — IDs de los axiomas que componen el sistema (EN ORDEN)
"models"?: string[] — IDs de modelos que satisfacen este sistema
"authors"?: string[]
"hasSimulation"?: boolean
```

**Reglas:**
- Un sistema axiomático es un **conjunto de axiomas** que define una teoría matemática. NO es un modelo.
- El array `axiomas` DEBE listar los IDs en el orden lógico convencional
- Todos los IDs en `axiomas` DEBEN existir en `src/content/axioms/`
- Todos los IDs en `models` DEBEN existir en `src/content/models/`
- Ejemplos: "Geometría Absoluta", "Geometría Euclídea", "Geometría Hiperbólica"

### 5.4 Teorema / Lema / Corolario (`type: "teorema" | "lema" | "corolario"`)

```
"id": string (kebab-case)
"type": "teorema" | "lema" | "corolario"
"title": string
"description": string
"statement"?: string — enunciado formal (requerido para teoremas, opcional para lemas/corolarios)
"color"?: string — token Arts & Crafts
"branch"?: string — código de rama MSC2020 (singular, forma corta)
"branches"?: string[] — códigos de rama MSC2020 (plural)
"authors"?: string[] — IDs de matemáticos
"demos"?: string[] — IDs de archivos de demostración que prueban esto
"lemmas"?: string[] — IDs de lemas usados en la demostración
"corollaries"?: string[] — IDs de corolarios que se derivan
"parentTheorem"?: string — REQUERIDO si type es "lema" o "corolario"
"examples"?: string[] — IDs de ejemplos asociados
"exercises"?: string[] — IDs de ejercicios asociados
"difficulty"?: "básico" | "intermedio" | "avanzado"
"hasSimulation"?: boolean
```

**Reglas de clasificación:**
- **Teorema:** Resultado principal que es objetivo de la teoría. Tiene su propia demostración.
- **Lema:** Resultado auxiliar usado específicamente para probar un teorema. Debe tener `parentTheorem`.
- **Corolario:** Consecuencia directa de un teorema, usualmente con poca o ninguna demostración adicional. Debe tener `parentTheorem`.

- Todo teorema DEBE tener al menos una demostración (salvo que sea postulado o axioma)
- El array `requires` debe formar un orden topológico válido (no dependencias circulares)

### 5.5 Demostración (`type: "demostracion"`)

```
"id": string (kebab-case)
"type": "demostracion"
"title": string
"description"?: string
"parentTheorem": string — ID del teorema que se prueba
"lemmas"?: string[] — IDs de lemas usados
"proofMethod"?: "directo" | "contradiccion" | "induccion" | "contraposicion" | "constructivo" | "geometrico" | "exhaustivo" | "reduccion"
"authors"?: string[]
"layout"?: "split" | "text" — split (por defecto para pruebas geométricas): diagrama izquierda, texto derecha; text: ancho completo
"dependencias"?: string[] — IDs de contenido del que depende esta demostración
```

**Reglas:**
- Toda demostración DEBE tener un `parentTheorem` apuntando a un teorema existente
- El campo `layout` determina el renderizado: `"split"` para diagrama+lado a lado, `"text"` para ancho completo
- Las demostraciones geométricas DEBEN usar `layout: "split"`
- Cada paso de la demostración DEBE tener un `<MedievalStep>` correspondiente en el cuerpo y un `<InteractiveElement>` conectando a un elemento del diagrama
- **PATRÓN DE EXPORT:** Las demostraciones exportan `Component` (no body MDX plano). Ver §6.2.

### 5.6 Ejemplo (`type: "ejemplo"`)

```
"id": string (kebab-case)
"type": "ejemplo"
"title": string
"description"?: string
"relatedTheorem"?: string — ID del teorema o definición ilustrado
"difficulty"?: "básico" | "intermedio" | "avanzado"
"hasSimulation"?: boolean
```

Un ejemplo es un **problema resuelto y desarrollado** que ilustra un teorema o definición. DEBE mostrar razonamiento completo.

### 5.7 Ejercicio (`type: "ejercicio"`)

```
"id": string (kebab-case)
"type": "ejercicio"
"title": string
"description"?: string
"relatedTheorem"?: string
"difficulty"?: "básico" | "intermedio" | "avanzado"
"hint"?: string — pista visible antes de revelar la solución
"hasSimulation"?: boolean
```

Los ejercicios DEBEN ser interactivos cuando sea posible (usando `<Hueco>`, `<Pregunta>`, y otros componentes de ejercicio en el cuerpo MDX).

### 5.8 Modelo (`type: "modelo"`)

```
"id": string (kebab-case)
"type": "modelo"
"title": string
"description"?: string — descripción de la estructura concreta
"satisfies": string — ID del sistema axiomático que este modelo satisface
"axioms_verified"?: string[] — IDs de axiomas específicos verificados por este modelo
"hasDiagram"?: boolean — si el modelo tiene representación visual
"hasSimulation"?: boolean
```

**DISTINCIÓN CRÍTICA:** Un modelo es una **estructura concreta** que satisface un conjunto de axiomas. NO es un sistema axiomático. Ejemplos:
- Modelo de 3 puntos (satisface axiomas de incidencia)
- Plano de Fano (satisface axiomas de plano proyectivo)
- Plano cartesiano (satisface geometría euclídea)
- Disco de Poincaré (satisface geometría hiperbólica)

Los modelos NO participan en la cadena de dependencias del grafo axiomático. Se conectan vía `satisfies` → `sistema-axiomatico` y `axioms_verified` → axiomas individuales.

### 5.9 Caso de Uso (`type: "caso-de-uso"`)

```
"id": string (kebab-case)
"type": "caso-de-uso"
"title": string
"description"?: string
"concept"?: string — ID del teorema/definición ilustrado
"domain"?: string — p. ej. "ingeniería", "medicina", "economía", "arte", "naturaleza", "física", "astronomía"
"difficulty"?: "básico" | "intermedio" | "avanzado"
```

Un caso de uso muestra cómo un concepto matemático se aplica a un dominio del mundo real. Es narrativo, con notación formal mínima.

### 5.10 Lección (`type: "leccion"`)

```
"id": string (kebab-case)
"type": "leccion"
"title": string
"description"?: string
"difficulty"?: "básico" | "intermedio" | "avanzado"
"hasSimulation"?: boolean
"hasVisualizer"?: boolean
```

Las lecciones son explicaciones pedagógicas. Pueden abarcar múltiples conceptos y no están sujetas al grafo estricto de dependencias de teoremas/definiciones.

### 5.11 Matemático (`type: "matematico"`)

```
"id": string (kebab-case) — apellido solo, disambiguar si es necesario
"type": "matematico"
"name": string — nombre completo para mostrar
"birthYear"?: number
"deathYear"?: number
"country"?: string
"description": string
"image"?: string
```

### 5.12 Plan de Estudio (`type: "plan-de-estudio"`)

```
"id": string (kebab-case) — REQUERIDO (no opcional)
"type": "plan-de-estudio"
"title": string
"subtitle"?: string
"description": string
"requiredNodes"?: string[]
```

Los planes de estudio PUEDEN referenciar currículos específicos (p. ej. "Selectividad", "EBAU"). Esta es la ÚNICA excepción a la regla de universalidad.

---

## 6. Estructura de Páginas MDX

### 6.1 Reglas Generales (TODOS los tipos de contenido)

**Componentes requeridos/disponibles:**
- `<Capitular letra="X" />` — capitular decorativa al inicio de cada página (OBLIGATORIO al principio)
- `<Separador />` — entre cada sección principal (NUNCA usar `---`)
- `<Formula>` — para ecuaciones destacadas/importantes
- `<Definicion title="...">` — para definiciones formales inline dentro de una página
- `<Nota>` — para observaciones, comentarios, casos límite
- `<Cita author="...">` — para citas y epígrafes
- `<Corolario>` — para corolarios embebidos en páginas de teoremas
- `<EquationRow>` — para ecuaciones multi-línea alineadas
- `<Demostracion>` — bloque formal de demostración (para pruebas cortas inline)

**PROHIBIDO:**
- `---` como separador de sección (usar `<Separador />`)
- Enlaces Markdown estándar `[texto](url)` para navegación interna (usar `<ConceptLink>` y `<RefLink>`)
- `\sen` en LaTeX (usar `\sin`)
- `<ConceptLink>` anidados con el mismo `targetId` (ej: `<ConceptLink targetId="x"><ConceptLink targetId="x">...</ConceptLink></ConceptLink>` es un BUG)
- **Falta de línea en blanco tras imports/exports:** El parser de MDX (Acorn) falla catastróficamente si no hay un salto de línea en blanco entre las declaraciones `import`/`export` y las etiquetas JSX/Markdown (como `<Capitular>`).
- **Símbolos LaTeX sin doble escape en propiedades JS/TSX:** Cuando se pasa código LaTeX como string literal a una prop de componente (ej. `<KatexText text={"$\\overline{AB}$"} />`), las barras invertidas deben estar **doblemente escapadas** (`\\`) para que no se interpreten como secuencias de escape de JavaScript.
- **JSXGraph Clipping:** En los gráficos, asegurar `keepaspectratio: true` y `axis: false` por defecto para evitar errores visuales de recorte fuera del viewport.
- **Variables CSS:** Usar estrictamente las variables definidas en `styles/tokens.css` (e.g., `--color-terracota`, `--color-salvia`). No usar colores hardcoded.

**Principios de estructura:**
- La página debe ser legible, comprensible, visual y atractiva; pero sobre todo, DEBE ser completa y rigurosa matemáticamente.
- **Lenguaje simple y directo:** Evitar prosa recargada, rimbombante o poética. El estilo debe ser claro, elegante, directo y riguroso.
- La página DEBE ser modular: una demostración o corolario NUNCA va en la página de un teorema, tienen su propio archivo.
- **Enunciados formales:** Deben usar **exclusivamente símbolos matemáticos puros** (`\forall, \exists, \implies, \in, \exists!`) sin palabras intercaladas en la fórmula. Poner siempre los `$$` en líneas independientes para que MDX los centre como bloque.
- **InteractiveElement vs ConceptLink:** Usar `<InteractiveElement target="id">` para hacer brillar elementos de un diagrama interactivo de la página actual. Usar `<ConceptLink targetId="concepto">` para enlazar términos del glosario.
- **Evitar LaTeX dentro de ConceptLinks:** NUNCA envolver código LaTeX (`$A$`) directamente dentro de un `ConceptLink` porque puede romper el parser MDX. Usar texto puro: `<ConceptLink targetId="punto">A</ConceptLink>`.

> [!IMPORTANT]
> **CONCEPTLINK UNIVERSAL — REGLA DE ORO, CRÍTICA Y ESENCIAL:**
> 
> En TODAS las páginas, **ABSOLUTAMENTE TODO término matemático LLEVA UN CONCEPTLINK**. No hay excepciones. Si el concepto aún no tiene página creada, el `<ConceptLink>` se pone igualmente con el `targetId` que tendrá cuando se cree. El sistema enlaza automáticamente a una **página "en construcción"**. NUNCA omitir un ConceptLink porque la página destino no exista todavía. Si dudas sobre si crear dependencia lógica, añade `isDependency={false}`.

```mdx
// CORRECTO — aunque "semejanza" no tenga página aún
El concepto de <ConceptLink targetId="semejanza">semejanza</ConceptLink> es fundamental.

// INCORRECTO — omitir el link
El concepto de semejanza es fundamental.
```

### 6.2 Estructura Canónica por Tipo de Contenido

A continuación, las estructuras canónicas para cada tipo de página. Estas son **guías adaptables**, no plantillas rígidas. Lo importante es que el contenido quede completo, riguroso y pedagógicamente claro.

#### 6.2.1 Axioma

```
<Capitular letra="X" />
Intro: qué afirma el axioma y por qué es fundamental.

<Separador />

### Enunciado Formal
<Formula>$$ ... $$</Formula>
<Nota>Notación o aclaración.</Nota>

<Separador />

### Discusión
Qué afirma, por qué es necesario, qué pasaría sin él.

<Separador />

### Relación con otros axiomas
Cómo se conecta con los demás axiomas de su sistema.

<Separador />

### Observaciones
Validez en geometrías no euclídeas, formulaciones equivalentes, contexto histórico si es relevante.
```

#### 6.2.2 Definición — Primitiva (punto, recta, plano)

Las definiciones de conceptos primitivos tienen estructura rica porque no se definen explícitamente, sino vía los axiomas que las gobiernan.

```
<Capitular letra="X" />
Intro: definición euclidiana clásica + enfoque moderno (concepto primitivo).

<Separador />

### Enunciado Informal
Descripción intuitiva del concepto.

<Separador />

### Definición Axiomática
Qué axiomas gobiernan este concepto (incidencia, orden, congruencia). Lista con ConceptLinks a cada axioma.

<Separador />

### Notación
Tabla con notaciones usuales ($A$, $\overline{AB}$, etc.)

<Separador />

### Observaciones
Modelos donde aparece, propiedades clave.
```

#### 6.2.3 Definición — Derivada (triángulo, circunferencia, ángulo, etc.)

Las definiciones de conceptos derivados son más concisas: se construyen a partir de los primitivos.

```
<Capitular letra="X" />
Intro: qué es el concepto y de qué primitivos se construye.

<Separador />

### Enunciado Formal
<Formula>$$ ... $$</Formula>
Descripción formal con InteractiveElement si hay diagrama.

<Separador />

### [Sección opcional según relevancia]
- "Definición Axiomática" si el concepto está gobernado por axiomas específicos
- "Clasificación" si hay tipos (ej. ángulos agudo/recto/obtuso)
- "Notación" si hay notaciones variadas

<Separador />

### Observaciones
Contexto, propiedades clave, conexiones con otros conceptos.
```

#### 6.2.4 Teorema / Lema / Corolario

La estructura se adapta al teorema. Lo importante es que quede rigurosamente explicado, comprensible, visual (diagrama interactivo apropiado) y completo. **El teorema se enfoca en sí mismo**: lemas, corolarios y demostraciones tienen sus propias páginas (los links se generan automáticamente desde metadata).

```
<Capitular letra="X" />
Intro: qué establece el teorema y por qué importa.

<Separador />

### Enunciado Formal
<Formula>$$ ... $$</Formula>
Hipótesis y tesis claras con cuantificadores precisos.

<Separador />

### Demostración
Link a la demostración dedicada: <ConceptLink targetId="demo-x">Demostración: ...</ConceptLink>
(Sin prueba inline — la demo tiene su propia página)

<Separador />

### Discusión
Por qué importa, qué técnicas usa, contexto si es relevante.

<Separador />

### Observaciones
Casos límite, validez en otras geometrías, relaciones a otras páginas (usar <RefLink> para no crear dependencia).
```

**Notas:**
- El contexto histórico se incluye cuando es relevante para entender el teorema (ej. Pitágoras, Paralelas), no como sección obligatoria
- Si el teorema tiene diagrama interactivo, importar y exportar como `Simulation`
- Los lemas y corolarios siguen la misma estructura, con `parentTheorem` en metadata

#### 6.2.5 Demostración

Las demostraciones son el corazón pedagógico de Matematika. Su diseño es el más exigente.

**DIAGRAMAS EN DEMOSTRACIONES — REGLA FUNDAMENTAL:**

Cada paso de una demostración DEBE tener su propio diagrama que ilustre ese paso específico. La excepción es cuando **conviene unificar** los diagramas: si varios pasos comparten la misma construcción geométrica y solo cambia qué elemento se resalta, un solo diagrama con highlight reactivo es más claro que múltiples diagramas casi idénticos.

| Patrón | Cuándo usar | Diagramas |
|---|---|---|
| **Un diagrama por paso** | POR DEFECTO. Cuando cada paso introduce elementos nuevos o cambia la construcción visiblemente | `diagrams={{ "step1": Step1Diagram, "step2": Step2Diagram, ... }}` |
| **Un diagrama unificado** | Cuando los pasos comparten la misma construcción y solo cambia el highlight | `diagrams={{ "default": SharedDiagram }}` o `diagram={<SharedDiagram />}` |
| **Híbrido** | Algunos pasos comparten construcción, otros introducen elementos nuevos | `diagrams={{ "default": SharedDiagram, "step3": Step3Diagram }}` |

Cuando hay varios diagramas, el `DemonstrationSection` los muestra con **transiciones sticky**: el panel izquierdo permanece fijo mientras el texto scrollea, y los diagramas cambian con una transición de fundido suave (opacity 700ms). El estudiante ve el diagrama correcto para cada paso sin perder el contexto visual.

**REFERENCIAS AL DIAGRAMA — REGLA CRÍTICA:**

TODO en el texto que se refiera a un elemento del diagrama DEBE tener un `<InteractiveElement>` correspondiente. Esto incluye:

- Nombres de puntos, segmentos, ángulos, polígonos en el texto → `<InteractiveElement target="lado-ab">lado AB</InteractiveElement>`
- Variables mencionadas en prosa que corresponden a elementos visuales → `<InteractiveElement target="altura-c">la altura $h$</InteractiveElement>`
- **Referencias dentro de fórmulas**: si una fórmula menciona un elemento del diagrama (ej. $a^2 + b^2 = c^2$ donde $a$, $b$, $c$ son lados visibles), envolver cada variable en `<InteractiveElement>`:
  ```mdx
  <InteractiveElement target="cateto-a" color="terracota">$a$</InteractiveElement>^2 +
  <InteractiveElement target="cateto-b" color="salvia">$b$</InteractiveElement>^2 =
  <InteractiveElement target="hipotenusa-c" color="pizarra">$c$</InteractiveElement>^2
  ```
- **Si dentro de una fórmula no se puede** (ej. LaTeX complejo con fracciones, subíndices, etc.), especificar **fuera de la fórmula** a qué se refiere cada símbolo:
  ```mdx
  <Formula>
    $$ \frac{AD}{DB} = \frac{AE}{EC} $$
  </Formula>
  donde <InteractiveElement target="seg-ad">$AD$</InteractiveElement> y <InteractiveElement target="seg-db">$DB$</InteractiveElement> son los segmentos en el lado $AB$, y <InteractiveElement target="seg-ae">$AE$</InteractiveElement>, <InteractiveElement target="seg-ec">$EC$</InteractiveElement> los correspondientes en el lado $AC$.
  ```

Cada `<MedievalStep>` DEBE contener al menos un `<InteractiveElement>` referenciando un elemento del diagrama. No hay excepciones: si un paso no tiene nada que resaltar en el diagrama, el paso no necesita diagrama (y probablemente pertenece a la sección de análisis, no a un paso de la demostración).

> [!IMPORTANT]
> **CONCEPTLINK UNIVERSAL — REGLA DE ORO, CRÍTICA Y ESENCIAL:**
> 
> En TODAS las páginas, **ABSOLUTAMENTE TODO término matemático LLEVA UN CONCEPTLINK**. No hay excepciones. Si el concepto aún no tiene página creada, el `<ConceptLink>` se pone igualmente con el `targetId` que tendrá cuando se cree. El sistema enlaza automáticamente a una **página "en construcción"**. NUNCA omitir un ConceptLink porque la página destino no exista todavía. Si dudas sobre si crear dependencia lógica, añade `isDependency={false}`.

```mdx
// CORRECTO — aunque "semejanza" no tenga página aún
El concepto de <ConceptLink targetId="semejanza">semejanza</ConceptLink> es fundamental.

// INCORRECTO — omitir el link
El concepto de semejanza es fundamental.
```

**Dos patrones de demostración según complejidad:**

**Patrón A — MDX body (demostraciones simples, 1-3 pasos, diagrama unificado):**

```mdx
export const metadata = { ... "layout": "split" ... };

import { DemonstrationSection } from "../../components/content/DemonstrationSection";
import { MedievalStep } from "../../components/content/MedievalStep";
import { InteractiveElement } from "../../components/ui/VisualBind";
import { MiDiagrama } from "../../diagrams/Teoremas/MiDiagrama";

<DemonstrationSection diagram={<MiDiagrama />}>

<Capitular letra="X" />
Intro breve del método de demostración.

<Separador />

### Hipótesis y Tesis
**Hipótesis:** ... **Tesis:** ...

<MedievalStep number={1} title="..." target="elemento">
  Paso con <InteractiveElement target="elemento">elemento</InteractiveElement>.
</MedievalStep>

<MedievalStep number={2} title="...">
  ...
  $\blacksquare$
</MedievalStep>

<Separador />

### Análisis
Comentario sobre la técnica empleada.

</DemonstrationSection>
```

**Patrón B — Component + JSX (demostraciones complejas, 4+ pasos, diagrama por paso):**

```mdx
export const metadata = { ... "layout": "split" ... };

import { DemonstrationSection } from "../../components/content/DemonstrationSection";
import { MedievalStep } from "../../components/content/MedievalStep";
import { InteractiveElement } from "../../components/ui/VisualBind";
import { Step1Diagram } from "../../diagrams/Teoremas/Step1Diagram";
import { Step2Diagram } from "../../diagrams/Teoremas/Step2Diagram";
import { Step3Diagram } from "../../diagrams/Teoremas/Step3Diagram";

export const Component = () => {
  const diagrams = {
    "step1": Step1Diagram,
    "step2": Step2Diagram,
    "step3": Step3Diagram
  };

  return (
    <DemonstrationSection diagrams={diagrams}>
      <MedievalStep number={1} target="step1" title="Construcción">
        Partimos de <InteractiveElement target="punto-a" color="terracota">$A$</InteractiveElement> y
        <InteractiveElement target="punto-b" color="terracota">$B$</InteractiveElement>...
      </MedievalStep>

      <MedievalStep number={2} target="step2" title="Razonamiento">
        Por el <ConceptLink targetId="axioma-congruencia-1">axioma de transporte</ConceptLink>,
        el <InteractiveElement target="segmento-cd" color="salvia">segmento $CD$</InteractiveElement>...
      </MedievalStep>

      <MedievalStep number={3} target="step3" title="Conclusión">
        Por lo tanto:
        <Formula>
          $$ \frac{<InteractiveElement target="seg-ad">AD</InteractiveElement>}{DB} = \frac{AE}{EC} $$
        </Formula>
        donde $AD$ es el segmento entre $A$ y $D$, y $DB$ entre $D$ y $B$. $\blacksquare$
      </MedievalStep>
    </DemonstrationSection>
  );
};
```

**Reglas CRÍTICAS para demostraciones:**
1. **Diagrama por paso por defecto** — cada paso tiene su propio diagrama a menos que convenga unificar
2. **Transiciones sticky** — cuando hay varios diagramas, el panel izquierdo es sticky y los diagramas cambian con fundido
3. **Importar `InteractiveElement` desde `../../components/ui/VisualBind`** (NUNCA desde MDXBlocks)
4. **Importar `DemonstrationSection` y `MedievalStep` desde `../../components/content/`**
5. `InteractiveElement` escribe en `MathStore.highlight` — el diagrama lee de ahí para iluminar elementos
6. El `target` string DEBE coincidir exactamente con el nombre del elemento en el diagrama
7. **TODO lo que se refiera al diagrama DEBE tener `<InteractiveElement>`**, incluyendo variables dentro de fórmulas (o explicación fuera de la fórmula si no se puede dentro)
8. **Cada `MedievalStep` DEBE contener al menos un `<InteractiveElement>`** referenciando un elemento del diagrama
9. **Todos los conceptos matemáticos mencionados DEBEN tener `<ConceptLink>`** — aunque la página destino no exista aún
10. El último MedievalStep termina con $\blacksquare$

#### 6.2.6 Sistema Axiomático

```
<Capitular letra="X" />
Intro: qué teoría define este sistema y su importancia.

<Separador />

### Contexto Histórico (si es relevante)
Quién formuló el sistema, qué problema resolvía, evolución histórica.

<Separador />

### Axiomas
Lista agrupada por grupos (Incidencia, Orden, Congruencia, Continuidad) con ConceptLinks a cada axioma.

<Separador />

### Modelos
Qué modelos satisfacen este sistema (con ConceptLinks).

<Separador />

### Propiedades
Consistencia, independencia, completitud del sistema.

<Separador />

### Comparación con otros sistemas
Diferencias con sistemas relacionados (ej. absoluto vs euclidiano vs hiperbólico). Tabla comparativa si aplica.
```

#### 6.2.7 Modelo

```
<Capitular letra="X" />
Intro: qué estructura concreta es este modelo y qué sistema satisface.

<Separador />

### Definición del Modelo
Universo (puntos, rectas, planos), interpretación de primitivos. Fórmula con la definición formal.

<Separador />

### Verificación de Axiomas
Uno por uno, verificar cada axioma del sistema que satisface.

<Separador />

### Propiedades
Características notables del modelo (finito, minimal, etc.).

<Separador />

### Contraejemplos
Qué axiomas NO se satisfacen y por qué. Útil para entender independencia de axiomas.

<Separador />

### Nota
Limitaciones del modelo, conexión con modelos más ricos.
```

#### 6.2.8 Matemático

```
<Capitular letra="X" />
Bio: vida, época, contexto cultural y académico.

<Separador />

### Contribuciones
Obras principales, teoremas, axiomas, técnicas. Con ConceptLinks a cada contribución.

<Separador />

### Influencia
Impacto en las matemáticas, legado, cómo influyó en generaciones posteriores.

<Separador />

### Obras
Lista de obras principales con fechas.
```

#### 6.2.9 Ejemplo

```
<Capitular letra="X" />
Contexto: problema real o motivación que lleva al ejemplo.

<Separador />

### Enunciado
Planteamiento del problema.

<Separador />

### Resolución
Paso a paso con <Paso> si es complejo, o prose normal si es simple.

<Separador />

### Resultado
Respuesta final clara.

<Separador />

### Generalización
Qué se puede generalizar del ejemplo. Conexión al teorema relacionado.
```

#### 6.2.10 Ejercicio

La estructura se adapta al ejercicio pedagógicamente. Elementos disponibles:

- `<Pregunta>` con `<Hueco respuesta="...">` para preguntas interactivas
- `<Solucion>` revelable con desarrollo paso a paso (usar `<Paso>` para pasos)
- `<ErrorComun>` para advertir sobre errores típicos
- `<Nota>` para pistas o comentarios

El ejercicio se construye con los elementos que mejor se adapten a su pedagogía. No hay plantilla rígida.

#### 6.2.11 Caso de Uso

```
<Capitular letra="X" />
Contexto: dominio real (ingeniería, naturaleza, arte, etc.) y situación concreta.

<Separador />

### Problema
Planteamiento del problema real, sin formalismo excesivo.

<Separador />

### El concepto matemático
Link al teorema/definición que aplica: <ConceptLink targetId="...">...</ConceptLink>

<Separador />

### Aplicación
Cómo se aplica el concepto al problema.

<Separador />

### Resultado
Solución y su interpretación en el contexto real.

<Separador />

### Nota
Limitaciones, otras aplicaciones, conexiones.
```

#### 6.2.12 Lección

Estructura libre adaptada al contenido pedagógico. Las lecciones explican técnicas, métodos o conceptos transversales y no están sujetas al grafo estricto de dependencias.

### 6.3 MedievalStep con `target`

`MedievalStep` soporta el prop `target` para **auto-highlight al hacer scroll**. Usando `IntersectionObserver`, cuando el paso entra en la zona central de la pantalla, activa `MathStore.highlight` automáticamente.

```tsx
// target como string — un solo elemento se resalta
<MedievalStep number={1} target="triangulo" title="El triángulo">
  ...
</MedievalStep>

// target como array — múltiples elementos se resaltan simultáneamente
<MedievalStep number={2} target={["cuadrado-a", "cuadrado-b", "cuadrado-c"]} title="Construcción">
  ...
</MedievalStep>

// sin target — el paso no activa auto-highlight (solo hover manual)
<MedievalStep number={3} title="Conclusión">
  ...
</MedievalStep>
```

**Cuándo usar `target`:**
- Siempre que el paso tenga elementos visuales correspondientes en el diagrama
- Usar array cuando el paso involucra múltiples elementos simultáneamente
- Omitir `target` solo en pasos de razonamiento puro sin correspondencia visual

---

## 7. Guía de Escritura Matemática

### 7.1 Tono y Estilo

- Escribir en **tercera persona impersonal**: "Se define...", "Se demuestra...", "Nótese que..."
- Ser **preciso y conciso**. Cada frase debe transmitir información.
- Sin preguntas retóricas, sin signos de exclamación, sin lenguaje casual.
- Usar **negrita** para términos clave que se introducen o enfatizan.
- Usar *cursiva* para variables matemáticas en texto (p. ej. "sea *x* un número real").

### 7.2 Cómo Escribir una Definición Rigurosa

Una definición DEBE:
1. Especificar el **tipo de cosa** que se define (conjunto, relación, función, propiedad, estructura)
2. Usar solo **términos previamente definidos o primitivos**
3. Ser **minimal**: sin condiciones extra más allá de lo necesario
4. Incluir la **notación formal** (LaTeX) cuando corresponda

```
Una **circunferencia** es el conjunto de puntos del plano que equidistan
de un punto fijo llamado **centro**. La distancia constante se denomina
**radio**.

<Formula>
  $$ C(O, r) = \{ P \mid \overline{OP} = r \} $$
</Formula>
```

### 7.3 Cómo Enunciar un Teorema

Todo teorema DEBE:
1. Enunciar las **hipótesis** claramente (qué se da)
2. Enunciar la **conclusión** claramente (qué se prueba)
3. Usar **cuantificadores** precisos ("para todo", "existe", "si... entonces...")

```
**Teorema de Pitágoras.** En un triángulo rectángulo, el cuadrado de la
hipotenusa es igual a la suma de los cuadrados de los catetos.

<Formula>
  $$ a^2 + b^2 = c^2 $$
</Formula>

donde $c$ es la longitud de la hipotenusa y $a, b$ las longitudes de los catetos.
```

### 7.4 Cómo Estructurar una Demostración

Una demostración DEBE:
1. Progresar **paso a paso**, cada paso justificado por una definición, axioma, teorema previo o paso lógico
2. Terminar con un **marcador de conclusión** claro (la UI añade $\blacksquare$ automáticamente)
3. Usar **diagramas** para pruebas geométricas (cada paso debe iluminar la parte relevante)

### 7.5 Errores Comunes

- **Razonamiento circular:** Un teorema no puede depender de un resultado que depende de él
- **Cuantificadores ambiguos:** Especificar "para todo" vs "existe" explícitamente
- **Casos omitidos:** Asegurar que todos los casos están cubiertos (p. ej. triángulos acutángulos/obtusángulos/rectángulos)
- **Sobrecarga de notación:** Definir todo símbolo antes de usarlo
- **Converso falso:** Distinguir entre un teorema y su converso

---

## 8. Sistema de Enlazado Semántico

La navegación interna NUNCA usa enlaces Markdown estándar `[texto](url)`. Usar EXCLUSIVAMENTE estos componentes:

| Componente | Propósito | Import path |
|-----------|---------|-------------|
| `<ConceptLink targetId="slug">texto</ConceptLink>` (o `targetId={["slug1", "slug2"]}`) | Abre el MarginaliaPanel con preview del nodo (o abre múltiples si es un array). Crea relación semántica. | Global (MDXComponents) |
| `<RefLink targetId="slug">texto</RefLink>` | Igual que ConceptLink pero sin crear dependencia formal. | Global (MDXComponents) |
| `<GlossaryLink term="term">texto</GlossaryLink>` | Tooltip rápido para términos auxiliares/glosario. | Global (MDXComponents) |
| `<VisualBind color="token" element="id">texto</VisualBind>` | Vincula texto a elemento del diagrama adyacente; al hover ilumina el elemento. | Global (MDXComponents) |
| `<InteractiveElement target="var" color="token">text</InteractiveElement>` | Vincula texto inline a una variable del diagrama; escribe en `MathStore.highlight`. (IMPORTANTE: Usa `target=`, NUNCA `highlight=`). | `../../components/ui/VisualBind` (importar explícitamente) |

**Distinción ConceptLink vs RefLink:**
- `ConceptLink` — terracota, para referencias que son parte del flujo lógico del contenido
- `RefLink` — pizarra, para referencias cruzadas suaves o complementarias
- Ambos abren el MarginaliaPanel; la diferencia es visual y semántica

**Tokens de color** para VisualBind/InteractiveElement: `terracota`, `salvia`, `pizarra`, `carbon`, `granada`, `ocre`, `pavo`, `musgo`.

**IMPORTANTÍSIMO:** `InteractiveElement` DEBE importarse desde `../../components/ui/VisualBind`. Hay un solo `InteractiveElement` en el proyecto — el de VisualBind — que escribe en `MathStore.highlight`. Los diagramas leen de `MathStore.highlight` para iluminar elementos.

---

## 9. Paleta Arts & Crafts

**Fuente única de verdad** para colores. La relación texto ↔ gráfico en color es **1:1 e inmutable**.

| Token | Clase Tailwind | Hex | Significado matemático |
|-------|---------------|-----|---------------------|
| `lienzo` | `bg-lienzo` | `#F8F6F1` | Fondo general, lienzo |
| `carbon` | `text-carbon` | `#333333` | Ejes, bordes, texto principal, grid |
| `salvia` | `text-salvia` | `#A2C2A2` | Planos, coeficientes, geometría secundaria, líneas de construcción |
| `terracota` | `text-terracota` | `#C86446` | Puntos, vectores, incógnitas, elementos interactivos primarios |
| `pizarra` | `text-pizarra` | `#5D7080` | Distancias, resultados, mediciones secundarias, valores calculados |
| `ocre` | `text-ocre` | `#c49b4f` | Resaltados, valores especiales, elementos auxiliares |
| `pavo` | `text-pavo` | `#3b5e6b` | Acento alternativo, elementos terciarios |
| `granada` | `text-granada` | `#8b3a3a` | Errores, contradicciones, elementos críticos, contraejemplos |
| `musgo` | `text-musgo` | `#4a5d23` | Aplicaciones, resultados verificados/correctos |

**Variables CSS:** `var(--theme-<token>)` — p. ej. `var(--theme-terracota)`.
**En JSXGraph:** usar el hex directamente (`#C86446`).

---

## 10. Grafo y Red de Dependencias

### 10.1 Qué Tipos Participan

| Tipo | ¿En grafo? | Tipo de arista |
|------|-----------|----------------|
| `axioma` | Sí | Fuente (sin aristas entrantes) |
| `definicion` | Sí | `links` |
| `teorema` | Sí | `requires`, `demos`, `lemmas`, `corollaries` |
| `lema` | Sí | `requires`, `parentTheorem` |
| `corolario` | Sí | `requires`, `parentTheorem` |
| `sistema-axiomatico` | Sí | Organiza axiomas (nodo grupo) |
| `demostracion` | Sí | `parentTheorem` |
| `ejemplo` | No | Conectado vía `relatedTheorem` |
| `ejercicio` | No | Conectado vía `relatedTheorem` |
| `modelo` | Sí | Conectado vía `satisfies` + `axioms_verified` |
| `caso-de-uso` | No | Conectado vía `concept` |
| `leccion` | No | Solo pedagógico |
| `matematico` | No | Solo referencia |
| `plan-de-estudio` | No | Separado |

### 10.2 Orden Topológico

El grafo DEBE ser un DAG (grafo dirigido acíclico). El orden topológico es:

```
axiomas → definiciones → lemas → teoremas → corolarios → demostraciones
```

Un teorema no puede `require` algo que depende de él. Si el teorema A requiere el teorema B, entonces B debe probarse antes que A — B debe existir y su demostración debe existir.

### 10.3 Conexiones de Modelos

Los modelos NO añaden aristas al grafo de dependencias. En su lugar:
- Un modelo enlaza a un `sistema-axiomatico` vía `satisfies`
- Un modelo enlaza a `axiomas` individuales vía `axioms_verified`
- Un sistema axiomático enlaza a sus modelos vía `models`

Estas conexiones se muestran en una vista "Modelos" separada, no en el grafo principal de dependencias.

---

## 11. Convenciones de Naming

- **IDs:** `kebab-case` (p. ej. `teorema-pitagoras`, `axioma-incidencia-1`). **snake_case prohibido.**
- **Nombres de archivo:** `kebab-case.mdx` (debe coincidir exactamente con el ID)
- **Componentes React:** `PascalCase.tsx`
- **Imports de diagramas:** rutas relativas explícitas, p. ej. `../../diagrams/Teoremas/DemoPitagorasEuclides`
- **Rutas:**
  - `/teorema/:id` — teoremas, lemas, corolarios
  - `/definicion/:id` — definiciones
  - `/axioma/:id` — axiomas
  - `/sistema/:id` — sistemas axiomáticos
  - `/demo/:id` — demostraciones
  - `/ejemplo/:id` — ejemplos
  - `/ejercicio/:id` — ejercicios
  - `/modelo/:id` — modelos
  - `/caso/:id` — casos de uso
  - `/leccion/:slug` — lecciones
  - `/bio/:slug` — biografías de matemáticos
  - `/plan/:id` — planes de estudio
  - `/rama/:id` — ramas MSC2020

---

## 12. Estructura de Archivos

```
src/content/
  axioms/                 — Axiomas
  definitions/            — Definiciones
  theorems/               — Teoremas, lemas y corolarios
  axiomatic-systems/      — Sistemas axiomáticos
  demonstrations/         — Demostraciones
  models/                 — Modelos (estructuras concretas)
  examples/               — Ejemplos resueltos
  exercises/              — Ejercicios interactivos
  usecases/               — Casos de uso reales
  lessons/                — Lecciones pedagógicas
  mathematicians/         — Biografías de matemáticos
  plans/                  — Planes de estudio

src/diagrams/
  Axiomas/                — Visualizaciones de axiomas
  Definiciones/           — Diagramas de definiciones
  Teoremas/               — Diagramas de teoremas y demos
  Models/                 — Diagramas de modelos
  Demos/                  — Diagramas de demostraciones adicionales
  Theorems/               — Visualizaciones de teoremas (a consolidar con Teoremas/)
```

> **Nota de reorganización:** Los directorios vacíos (`Pitagoras/`, `Geometria/`, `Euclides/`, `Algebra/`, `Calculo/`, `Analisis/`, `Estadistica/`, `Probabilidad/`, `LinearAlgebra/`, `MetodosDemostracion/`, `Ejercicios/`, `CasosUso/`) están reservados para contenido futuro. Usar la categoría existente más adecuada al crear nuevos diagramas.

---

## 13. Exportación de Simulaciones y Diagramas

El `ContentStore` carga los exports de los archivos MDX según los campos de metadata:

| Tipo de contenido | Export `Component` | Export `Simulation` | Export `Diagram` |
|-------------------|-------------------|--------------------|--------------------|
| Teorema, Lema, Corolario | default (body MDX) | Si `hasSimulation: true` | — |
| Definición | default (body MDX) | Si `hasSimulation: true` | — |
| Axioma | default (body MDX) | Si `hasSimulation: true` | — |
| Sistema axiomático | default (body MDX) | Si `hasSimulation: true` | — |
| Demostración | `export const Component` | — | — |
| Ejemplo | default (body MDX) | Si `hasSimulation: true` | — |
| Ejercicio | default (body MDX) | Si `hasSimulation: true` | — |
| Modelo | default (body MDX) | Si `hasSimulation: true` | Si `hasDiagram: true` |
| Caso de uso | default (body MDX) | Automático (si existe) | — |
| Lección | default (body MDX) | Si `hasSimulation: true` | — |
| Matemático | default (body MDX) | — | — |
| Plan de estudio | default (body MDX) | — | — |

**Patrón para teoremas/axiomas/definiciones (SimulationLayout):**
```typescript
import { MyDiagram } from '../../diagrams/Categoria/MyDiagram';
export const Simulation = MyDiagram;

export const metadata = {
  ...
  "hasSimulation": true,
};
```

**Patrón para modelos (inline en ModelPage):**
```typescript
import { ModelDiagram } from '../../diagrams/Models/ModelDiagram';
export const Diagram = ModelDiagram;

export const metadata = {
  ...
  "hasDiagram": true,
};
```

**Patrón para demostraciones (Component export):**
```typescript
export const Component = () => {
  return (
    <DemonstrationSection diagrams={{ "default": MyDiagram }}>
      <MedievalStep ...>...</MedievalStep>
    </DemonstrationSection>
  );
};
```

---

## 14. Diseño de Diagramas e Interactividad (JSXGraph)

Al diseñar diagramas con JSXGraph, asegúrate de cumplir con estas directrices clave:

1. **Recorte en Layouts Responsivos (`aspect-video`):** Los diagramas usan un contenedor con proporción 16:9 (`md:aspect-video`). Si configuras un `boundingbox` de ancho 10 (`[-5, 5, 5, -5]`) con `keepaspectratio: true`, la altura visible será de `10 * 9/16 = 5.625` (aproximadamente desde `Y=-2.81` a `Y=2.81`). Cualquier punto fuera de estas Y **quedará invisible o recortado**. Centraliza las coordenadas de tus elementos para que caigan siempre en la "zona segura".
2. **Tokens de Color CSS:** Solo puedes usar los tokens documentados en la **Paleta Arts & Crafts**. Si usas un token inexistente (ej. `--theme-ambar`), la variable evaluará a vacío y JSXGraph dibujará elementos transparentes e invisibles. Usa siempre validaciones de color válidas (ej. `--theme-ocre`, `--theme-salvia`).
3. **Mapeo de InteractiveElement:** El atributo `target` de un `<InteractiveElement>` debe enrutar 1:1 a un string en la lógica `if (highlight === 'foo')` del diagrama. Presta atención especial a los estados de reset o default (`!highlight`) para restaurar correctamente la visibilidad y opacidades.
4. **Libertad de Modificación:** Si un diagrama ilustra conceptos abstractos de congruencia, permite que los vértices del modelo "maestro" sean arrastrables (`fixed: false`). Esto demuestra dinámicamente cómo las construcciones derivadas (clones o dependientes) responden al cambio en tiempo real, aumentando el valor pedagógico.
5. **Restricción Geométrica Rigurosa (`gliders`):** Si un punto representa conceptualmente un valor estrictamente sobre una recta o segmento (ej. en cortaduras de Dedekind o axiomas de orden), NUNCA uses `point` libre (`fixed: false`). Usa `glider` atado al objeto base para garantizar matemáticamente que el estudiante no pueda arrastrarlo fuera del dominio válido de 1D.
6. **Controles Reactivos (Sliders Dinámicos):** Cuando tengas controles HTML (`<input type="range">`) cuyo rango dependa de dimensiones variables del diagrama (ej. un multiplicador $n$ para superar un segmento), actualiza dinámicamente el límite `max` escuchando los eventos de arrastre (`point.on('drag', ...)`) para asegurar que el usuario siempre pueda alcanzar la condición demostrativa.

---

## 15. Fuentes de Referencia

Al generar contenido matemático, usar estas fuentes para rigor:

| Fuente | Contenido |
|--------|-----------|
| Euclid / Heath, *The Thirteen Books of the Elements* | Proposiciones geométricas clásicas (Libros I–IV) |
| Hilbert, *Grundlagen der Geometrie* (1899) | Fundación axiomática moderna |
| Hartshorne, *Geometry: Euclid and Beyond* | Puente entre Euclides y Hilbert |
| Greenberg, *Euclidean and Non-Euclidean Geometries* | Geometría no euclídea, demostraciones rigurosas |
| Venema, *Foundations of Geometry* | Tratamiento moderno accesible |
| MSC2020 (Mathematical Subject Classification) | Códigos de rama/categoría |

---

## 16. Validación Automática (OBLIGATORIA)

**Tras crear o editar contenido, el agente DEBE ejecutar estas validaciones:**

### 16.1 Validación de schemas y referencias
```bash
npm run generate-index
npm run validate-graph
npm run validate-references
```

### 15.2 Typecheck y lint
```bash
npx tsc --noEmit -p tsconfig.app.json
npx eslint <archivos-modificados>
```

### 15.3 Si alguna validación falla
- Corregir los errores antes de dar el contenido por terminado
- Re-ejecutar las validaciones hasta que pasen

### 15.4 Script de validación del skill
```bash
node .opencode/skills/antigravity/scripts/validate.mjs
```
Este script verifica: IDs kebab-case, claves entre comillas, integridad referencial, nombre de archivo = ID, y más.

---

## 17. Checklist de Integridad Referencial

Antes de finalizar CUALQUIER contenido, verificar:

- [ ] El ID está en kebab-case (sin guiones bajos)
- [ ] Todas las claves de metadata usan comillas dobles
- [ ] El nombre del archivo coincide exactamente con `metadata.id` (p. ej. `teorema-pitagoras.mdx` → `"id": "teorema-pitagoras"`)
- [ ] Todos los IDs en `requires`, `demos`, `lemmas`, `corollaries`, `parentTheorem`, `relatedTheorem`, `concept` existen como archivos de contenido
- [ ] Todos los IDs en `axiomas` (en sistema-axiomatico) existen en `src/content/axioms/`
- [ ] Todos los IDs en `models` (en sistema-axiomatico) existen en `src/content/models/`
- [ ] `satisfies` (en modelo) apunta a un sistema-axiomatico existente
- [ ] Todos los IDs en `axioms_verified` (en modelo) existen en `src/content/axioms/`
- [ ] Todos los IDs en `mathematicians`/`authors` existen en `src/content/mathematicians/`
- [ ] Todos los `targetId` en `<ConceptLink>` y `<RefLink>` apuntan a IDs existentes
- [ ] Si `hasSimulation: true`, el archivo exporta un componente `Simulation`
- [ ] Si `hasDiagram: true`, el archivo exporta un componente `Diagram`
- [ ] No hay enlaces Markdown internos `[texto](url)` — solo `<ConceptLink>`, `<RefLink>` o `<GlossaryLink>`
- [ ] No hay referencias a currículos específicos en contenido que no sea `plan-de-estudio`
- [ ] `<Capitular>` está presente al inicio
- [ ] `<Separador />` se usa entre secciones (no `---`)
- [ ] No hay `\sen` en LaTeX — usar `\sin`
- [ ] El orden topológico se respeta (no dependencias circulares)
- [ ] `InteractiveElement` se importa desde `../../components/ui/VisualBind` (no desde MDXBlocks)

---

## 18. Checklist de Calidad por Tipo

### Axioma
- [ ] El axioma es independiente (no demostrable desde otros axiomas de su sistema)
- [ ] Usa solo términos primitivos o previamente definidos
- [ ] La descripción informal refleja fielmente el enunciado formal
- [ ] Enlaza con los sistemas axiomáticos que lo incluyen

### Definición
- [ ] Usa solo términos primitivos o previamente definidos (verificar `links`)
- [ ] Es minimal (sin condiciones extra)
- [ ] La notación formal coincide con la descripción verbal
- [ ] Sería aceptada en un libro de texto de matemáticas contemporáneo

### Teorema / Lema / Corolario
- [ ] Las dependencias `requires` forman un orden topológico válido
- [ ] Si es lema o corolario, `parentTheorem` está establecido
- [ ] Tiene al menos una demostración (salvo axiomas/postulados)
- [ ] Si es lema, es genuinamente auxiliar (no un teorema mayor)
- [ ] El enunciado es preciso con cuantificadores adecuados

### Demostración
- [ ] `parentTheorem` apunta a un teorema existente
- [ ] Cada paso está justificado (por axioma, definición, o teorema previo)
- [ ] Cada `MedievalStep` tiene un `<InteractiveElement>` correspondiente en el cuerpo
- [ ] `InteractiveElement` está importado desde VisualBind (no desde MDXBlocks)
- [ ] El método de demostración (`proofMethod`) describe correctamente el enfoque
- [ ] Para split-layout: cada paso tiene diagrama o usa uno compartido
- [ ] La demostración es completa (sin huecos)
- [ ] Usa `export const Component` (no body MDX plano)

### Sistema Axiomático
- [ ] Todos los `axiomas` existen y forman una teoría coherente
- [ ] El orden de los axiomas sigue la práctica matemática convencional
- [ ] La descripción explica qué hace distintivo a este sistema
- [ ] Los modelos listados son modelos genuinos del sistema

### Modelo
- [ ] `satisfies` apunta a un sistema axiomático válido
- [ ] `axioms_verified` lista axiomas que el modelo demuestrablemente satisface
- [ ] La descripción define el universo y la interpretación de los primitivos
- [ ] Si `hasDiagram: true`, el diagrama representa correctamente la estructura

### Ejemplo / Ejercicio / Caso de Uso
- [ ] El teorema/definición referenciado existe
- [ ] La solución/razonamiento es completo y correcto
- [ ] El nivel de dificultad es apropiado

---

## Plantillas de referencia

Las plantillas MDX listas para copiar están en `templates/`:
- `templates/teorema.mdx` — Plantilla de teorema
- `templates/demostracion.mdx` — Plantilla de demostración
- `templates/definicion.mdx` — Plantilla de definición
- `templates/axioma.mdx` — Plantilla de axioma
- `templates/modelo.mdx` — Plantilla de modelo
- `templates/ejercicio.mdx` — Plantilla de ejercicio

## Referencia de componentes

La API completa de componentes MDX está en `reference/components.md`.
