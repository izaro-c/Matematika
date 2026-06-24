---
name: page-creator
description: Genera páginas MDX de contenido matemático con metadatos Zod validados, enlazado semántico con ConceptLink/RefLink, paleta Arts & Crafts exclusiva, y rigor matemático Greenberg/Hilbert. Usa esta skill para crear o modificar cualquier archivo MDX en src/database/content/.
---

# Skill: page_creator — Generador de Contenido Matemático para Matematika

> **Fuente pedagógica.** Este documento gobierna MDX, navegación y escritura. Para páginas con `leanId`, Lean es la verdad mecánica verificable y MDX es la capa pedagógica.

**Skills hermanas:**
- `project-philosophy` — principios no negociables (cárgala si dudas sobre la filosofía del proyecto)
- `diagrama` — para crear diagramas interactivos asociados a este contenido (cárgala cuando el contenido necesite visualización)

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
14. [Diseño de Diagramas e Interactividad (JSXGraph)](#14-diseño-de-diagramas-e-interactividad-jsxgraph)
15. [Fuentes de Referencia](#15-fuentes-de-referencia)
16. [Validación Automática (OBLIGATORIA)](#16-validación-automática-obligatorio)
17. [Checklist de Integridad Referencial](#17-checklist-de-integridad-referencial)
18. [Checklist de Calidad por Tipo](#18-checklist-de-calidad-por-tipo)
19. [Clasificación de Conceptos Derivados](#19-clasificación-de-conceptos-derivados)
20. [Rigor en Definiciones y Casos Límite](#20-rigor-en-definiciones-y-casos-límite)
21. [Clasificaciones Jerárquicas](#21-clasificaciones-jerárquicas)

---

## 1. Filosofía del Proyecto

- **Jardín Digital, no PDF interactivo:** Cada concepto es un nodo navegable en una red de conocimiento. La lectura puede ser lineal o exploratoria.
- **Universalidad absoluta:** El contenido matemático no tiene país, currículo ni sistema educativo. Es atemporal.
- **Interactividad como norma:** Si un concepto puede visualizarse, se visualiza. Si un ejercicio puede hacerse interactivo, lo es.
- **Elegante y limpio:** El diseño sirve a las matemáticas, no compite con ellas.
- **Rigor sobre accesibilidad:** Todo enunciado está justificado. Toda definición es precisa. Toda demostración es completa y obedece estrictamente a la axiomática de Greenberg/Hilbert (Regla Lógica de Justificaciones).
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

> [!WARNING]
> **REGLA DEL ID OBLIGATORIO:** Absolutamente TODOS los archivos de contenido DEBEN incluir el campo `"id"` explícitamente en el objeto `metadata`. Su ausencia corrompe la indexación y la resolución de referencias cruzadas, causando fallos catastróficos.

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

**REGLA CRÍTICA:** Para páginas sin `leanId`, el grafo puente actual se deriva de `<ConceptLink>` y metadata legacy. Para páginas con `leanId`, Lean es la autoridad mecánica de dependencias y el validador `validate-lean` compara `lean_graph.json` contra MDX.

Los `<ConceptLink>` siguen siendo obligatorios para navegación, pedagogía, Marginalia y legibilidad del jardín, incluso cuando Lean ya verifica la prueba.

- Si un teorema requiere una definición, simplemente enlaza a esa definición en el texto con `<ConceptLink targetId="mi-definicion">`.
- El sistema analizará el AST del documento y construirá el grafo axiomático basándose en esos enlaces.
- Es imperativo que todo concepto matemático mencionado en el texto esté envuelto en su respectivo `<ConceptLink>`, no solo por navegación del usuario, sino porque es lo que forma la red de conocimiento subyacente.
- **`isDependency={false}`:** CRÍTICO. Si estás enlazando a un concepto que **no es un predecesor lógico estricto** en el árbol de construcciones lógicas (e.g. un lema enlazando a su teorema padre, o una definición genérica de otra rama), **debes usar** `isDependency={false}` en el `<ConceptLink>`. Esto evita ciclos o dependencias falsas, permitiendo cumplir la regla de oro: TODO término matemático debe enlazarse.
  ```jsx
  <ConceptLink targetId="teorema-separacion" isDependency={false}>teorema de separación</ConceptLink>
  ```
- Para referencias cruzadas generales en el texto, usar `<RefLink targetId="...">` — son enlaces semánticos de cuerpo que abren el MarginaliaPanel, pero NO crean una conexión formal en metadata.
- Nunca inventes `leanId`: usa una declaración existente de `lean/Matematika/...` o Mathlib, o deja el campo ausente.

### 4.1 Campos Lean opcionales

Estos campos pueden aparecer en axiomas, definiciones, teoremas, lemas, corolarios y demostraciones:

```
"leanId"?: string — identificador Lean completo
"leanCommitSha"?: string — SHA o "local-bridge" durante desarrollo local
"leanVerified"?: boolean — generado por contentIndex, no escribir manualmente
"axiomSystem"?: string — para axiomas propios sin equivalente Mathlib
"stepTacticMap"?: Record<string, string[]> — solo demostraciones
```

En demostraciones, `stepTacticMap` mapea el número 1-based de cada `<MedievalStep>` a IDs de bloques anotados en Lean:

```json
"stepTacticMap": {
  "1": ["ala-step1-transport"],
  "2": ["ala-step2-apply-lal"]
}
```

---

## 5. Tipos de Contenido y Schemas Completos

Cada archivo MDX DEBE exportar un objeto `metadata`. Los schemas Zod (`src/entities/content/schemas.ts`) son la fuente de verdad para los campos. A continuación, los **schemas completos** para cada tipo.

### 5.1 Axioma (`type: "axioma"`)

```
"id": string (kebab-case)
"type": "axioma"
"title": string
"description": string — explicación informal de lo que afirma el axioma
"statement"?: string — enunciado formal (opcional, puede usar LaTeX)
"authors"?: string[] — IDs de matemáticos
"hasSimulation"?: boolean — si tiene diagrama interactivo
"leanId"?: string
"leanCommitSha"?: string
"leanVerified"?: boolean — generado, no manual
"axiomSystem"?: string
```

**Reglas:**
- El axioma debe ser independiente (no demostrable desde otros axiomas de su sistema)
- Usa solo términos primitivos o previamente definidos
- La descripción informal debe reflejar fielmente el enunciado formal

### 5.2 Definición (`type: "definicion"`)

```
"id": string (kebab-case)
"type": "definicion"
"subtype": "primitivo" | "nominal" | "fundamentada" — OBLIGATORIO para el DAG lógico
"title": string
"description": string — explicación informal
"statement"?: string — definición formal (opcional)
"authors"?: string[]
"color"?: string — uno de los tokens Arts & Crafts
"hasSimulation"?: boolean — si tiene diagrama interactivo
"leanId"?: string
"leanCommitSha"?: string
"leanVerified"?: boolean — generado, no manual
```

**Reglas Topológicas de Definiciones:**
- **primitivo:** Grado 0. Cortafuegos lógico. NO propaga dependencias (ej. Punto, Recta).
- **nominal:** Propaga dependencias léxicas. Abreviaturas conjuntistas (ej. Segmento).
- **fundamentada:** Propaga dependencias de existencia. Requiere axiomas o lemas (ej. Punto Medio).

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
"leanId"?: string
"leanCommitSha"?: string
"leanVerified"?: boolean — generado, no manual
```

**Reglas:**
- Un sistema axiomático es un **conjunto de axiomas** que define una teoría matemática. NO es un modelo.
- El array `axiomas` DEBE listar los IDs en el orden lógico convencional
- Todos los IDs en `axiomas` DEBEN existir en `src/database/content/axioms/`
- Todos los IDs en `models` DEBEN existir en `src/database/content/models/`

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
"leanId"?: string
"leanCommitSha"?: string
"leanVerified"?: boolean — generado, no manual
"stepTacticMap"?: Record<string, string[]> — MedievalStep.number → bloques Lean
```

**Reglas:**
- Toda demostración DEBE tener un `parentTheorem` apuntando a un teorema existente
- El campo `layout` determina el renderizado: `"split"` para diagrama+lado a lado, `"text"` para ancho completo
- Las demostraciones geométricas DEBEN usar `layout: "split"` SIEMPRE, sin excepción, independientemente de su longitud, para mantener la consistencia.
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

Los ejercicios DEBEN tener **interacción progresiva**:
- Presentar una pregunta o hueco que el estudiante debe intentar resolver primero.
- La solución NUNCA se muestra estáticamente desde el principio. Se revela paso a paso (vía `<Paso>`) o tras interactuar.

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

**DISTINCIÓN CRÍTICA:** Un modelo es una **estructura concreta** que satisface un conjunto de axiomas. NO es un sistema axiomático.

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

### 5.11 Matemático (`type: "matematico"`)

```
"id": string (kebab-case)
"type": "matematico"
"name": string
"birthYear"?: number
"deathYear"?: number
"country"?: string
"description": string
"image"?: string
```

### 5.12 Plan de Estudio (`type: "plan-de-estudio"`)

```
"id": string (kebab-case)
"type": "plan-de-estudio"
"title": string
"subtitle"?: string
"description": string
"requiredNodes"?: string[]
```

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
- `<ConceptLink>` anidados con el mismo `targetId`
- Falta de línea en blanco tras imports/exports
- Símbolos LaTeX sin doble escape en propiedades JS/TSX (`\\`)

**Principios de estructura:**
- La página debe ser legible, comprensible, visual y atractiva; pero sobre todo, DEBE ser completa y rigurosa matemáticamente.
- **Enunciados formales:** Deben usar **exclusivamente símbolos matemáticos puros** (`\forall, \exists, \implies, \in, \exists!`) sin palabras intercaladas en la fórmula. Poner siempre los `$$` en líneas independientes para que MDX los centre como bloque.
- **Evitar LaTeX dentro de ConceptLinks:** NUNCA envolver código LaTeX (`$A$`) directamente dentro de un `ConceptLink`. Usar texto puro: `<ConceptLink targetId="punto">A</ConceptLink>`.

> [!IMPORTANT]
> **CONCEPTLINK UNIVERSAL — REGLA DE ORO, CRÍTICA Y ESENCIAL:**
> 
> En TODAS las páginas, **ABSOLUTAMENTE TODO término matemático LLEVA UN CONCEPTLINK**. No hay excepciones. Si dudas sobre si crear dependencia lógica, añade `isDependency={false}`.

### 6.2 Estructura Canónica por Tipo de Contenido

A continuación, las estructuras canónicas para cada tipo de página.

#### 6.2.1 Axioma, 6.2.2 Definición, 6.2.3 Definición Derivada, 6.2.4 Teorema

(Misma estructura que la convención estándar. Ver plantillas).

#### 6.2.5 Demostración

Las demostraciones son el corazón pedagógico de Matematika. Su diseño es el más exigente y obedece estrictamente a la axiomática moderna.

**ESTRUCTURA DE LA DEMOSTRACIÓN — LA REGLA LÓGICA DE GREENBERG:**

El principal mandato para la creación de demostraciones es el rigor matemático puro e inquebrantable, basado en la estructuración de Marvin Jay Greenberg. Quedan estrictamente prohibidas las secciones de «Introducción» o «Tesis» sueltas. Se debe ir directo a la demostración paso a paso.

La demostración comienza directamente con el `<Capitular />` seguido del contenido íntegro de la sección `### Enunciado Formal` del teorema padre: la primera letra del enunciado es la `<Capitular />`, y el resto del texto del enunciado continúa a continuación, sin título, sin introducción, sin frases como «Se demuestra...». Después del enunciado, un `<Separador />` y los pasos en `<MedievalStep>`.

> [!CAUTION]
> **PROHIBIDO** anteponer frases introductorias («Se demuestra que...», «La siguiente prueba...», etc.). La demostración arranca directamente con el enunciado. **PROHIBIDO** añadir un encabezado `### Enunciado Formal`. **PROHIBIDO** describir el método de prueba.

**REGLA LÓGICA 1 (CRÍTICA):** Cada afirmación matemática dentro de un paso DEBE estar justificada exclusivamente por uno (o una combinación explícita) de los siguientes seis tipos de justificación permitidos:
1. **"Por hipótesis..."**
2. **"Por axioma..."** (con `<ConceptLink>` obligatorio al axioma).
3. **"Por teorema..."** (previamente demostrado, con `<ConceptLink>` obligatorio al teorema).
4. **"Por definición..."** (con `<ConceptLink>` obligatorio a la definición).
5. **"Por el paso N..."** (referenciando un paso numérico previo del propio argumento).
6. **"Por regla de lógica..."** (ej. Modus Ponens, reducción al absurdo, transitividad de la igualdad).

Los pasos pueden agruparse por fluidez narrativa dentro de un mismo `<MedievalStep>`, pero la correspondencia atómica entre Afirmación y Justificación debe ser matemáticamente rastreable en el texto. **Jamás se asume una propiedad visual topológica ("se ve en el diagrama que las rectas se cortan"); toda intersección debe justificarse con el Axioma de Pasch, Barra Cruzada o los Axiomas de Incidencia.**

**DIAGRAMAS EN DEMOSTRACIONES — REGLA FUNDAMENTAL:**

Cada paso de una demostración DEBE visualizarse en el diagrama. Si es necesario, se pueden añadir múltiples diagramas en una demostración, asignándole uno a un paso o a un grupo de pasos específicos.

| Patrón | Cuándo usar | Diagramas |
|---|---|---|
| **Un diagrama por paso** | POR DEFECTO. Cuando cada paso introduce elementos nuevos o cambia la construcción visiblemente | `diagrams={{ "step1": Step1Diagram, "step2": Step2Diagram, ... }}` |
| **Un diagrama unificado** | Cuando los pasos comparten la misma construcción y solo cambia el highlight | `diagrams={{ "default": SharedDiagram }}` o `diagram={<SharedDiagram />}` |
| **Híbrido** | Algunos pasos comparten construcción, otros introducen elementos nuevos | `diagrams={{ "default": SharedDiagram, "step3": Step3Diagram }}` |

Cuando hay varios diagramas, el `DemonstrationSection` los muestra con **transiciones sticky**: el panel izquierdo permanece fijo mientras el texto scrollea, y los diagramas cambian con una transición de fundido suave (opacity 700ms). El estudiante ve el diagrama correcto para cada paso sin perder el contexto visual. **Split-Layout es OBLIGATORIO para TODAS las demostraciones geométricas**, por cortas que sean.

**REFERENCIAS AL DIAGRAMA — REGLA CRÍTICA:**

TODO elemento del texto que se refiera a un elemento del diagrama DEBE estar conectado con `<InteractiveElement>`.
Esta conexión no es opcional y tiene reglas estrictas:
- **Resaltado:** El `target` debe coincidir con el ID del elemento en el diagrama para que este se resalte al interactuar.
- **Color:** El elemento en el texto DEBE ser del mismo color que el elemento en el diagrama utilizando la prop `color`.

Cada `<MedievalStep>` DEBE contener al menos un `<InteractiveElement>` referenciando un elemento del diagrama. No hay excepciones: si un paso no tiene nada que resaltar en el diagrama, el paso no necesita diagrama (y probablemente pertenece a la sección de análisis, no a un paso de la demostración).

**Patrón — Component + JSX (demostraciones con justificación de Greenberg):**

```mdx
export const metadata = { ... "layout": "split" ... };

import { DemonstrationSection } from "../../components/content/DemonstrationSection";
import { MedievalStep } from "../../components/content/MedievalStep";
import { InteractiveElement } from "../../components/ui/VisualBind";
import { Step1Diagram } from "../../diagrams/Teoremas/Step1Diagram";
import { Step2Diagram } from "../../diagrams/Teoremas/Step2Diagram";

export const Component = () => {
  const diagrams = {
    "step1": Step1Diagram,
    "step2": Step2Diagram
  };

  return (
    <DemonstrationSection diagrams={diagrams}>
      <MedievalStep number={1} target="step1" title="Existencia">
        Por el <ConceptLink targetId="axioma-incidencia-1">Axioma de Incidencia 1</ConceptLink>, dados los puntos <InteractiveElement target="punto-a" color="terracota">$A$</InteractiveElement> y <InteractiveElement target="punto-b" color="terracota">$B$</InteractiveElement>, existe una única <InteractiveElement target="recta-ab" color="salvia">recta $AB$</InteractiveElement> que los contiene.
      </MedievalStep>

      <MedievalStep number={2} target="step2" title="Construcción">
        Por el <ConceptLink targetId="axioma-orden-2">Axioma de Extensión (Orden 2)</ConceptLink>, existe un punto <InteractiveElement target="punto-c" color="terracota">$C$</InteractiveElement> tal que $A * B * C$.
      </MedievalStep>

      <MedievalStep number={3} target="step2" title="Conclusión">
        Por el Paso 2 y por la <ConceptLink targetId="definicion-segmento">definición de segmento</ConceptLink>, concluimos que el punto $B$ pertenece al segmento $AC$. $\blacksquare$
      </MedievalStep>
    </DemonstrationSection>
  );
};
```

---

## 7. Guía de Escritura Matemática

### 7.1 Tono y Estilo

- **Formal y directo**: Escribir en **tercera persona impersonal** ("Se define...", "Se demuestra...").
- **Precisión absoluta y concisión**: Sin adornos literarios, sin metáforas divulgativas, sin lenguaje casual. Cada frase debe transmitir información estricta.
- Sin preguntas retóricas y sin signos de exclamación.
- Usar **negrita** para términos clave que se introducen o enfatizan.

### 7.2 Cómo Escribir una Definición Rigurosa

Una definición DEBE:
1. Especificar el **tipo de cosa** que se define (conjunto, relación, función, propiedad, estructura)
2. Usar solo **términos previamente definidos o primitivos**
3. Ser **minimal**: sin condiciones extra más allá de lo necesario
4. Incluir la **notación formal** (LaTeX) cuando corresponda
5. **Rigor vs Teoremas (CRÍTICO):** Nunca incluir propiedades derivadas en la definición axiomática básica.
6. **Notación estandarizada:** Para la relación "estar entre", usar siempre la notación estandarizada de Hilbert `A * B * C` en lugar de texto como "B está entre A y C" dentro de las definiciones formales o fórmulas.

### 7.3 Cómo Enunciar un Teorema

Todo teorema DEBE:
1. Enunciar las **hipótesis** claramente (qué se da)
2. Enunciar la **conclusión** claramente (qué se prueba)
3. Usar **cuantificadores** precisos ("para todo", "existe", "si... entonces...")

### 7.4 Cómo Estructurar una Demostración

Una demostración DEBE:

1. **Seguir la Regla Lógica 1 de Greenberg:** Progresar paso a paso, donde CADA afirmación esté estrictamente justificada por una de las 6 justificaciones categóricas:
   - Hipótesis
   - Axioma (con ConceptLink)
   - Teorema previo (con ConceptLink)
   - Definición (con ConceptLink)
   - Paso lógico/numérico previo
   - Regla de Lógica formal

2. **Prohibición Topológica Visual:** En la geometría axiomática, nunca se puede argumentar que un punto está entre otros dos o que dos rectas intersecan "porque así se representa en la figura". Toda relación espacial abstracta debe ser reducida a un enunciado de Incidencia, Orden o Congruencia.

3. Terminar con un marcador de conclusión claro (la UI añade $\blacksquare$ automáticamente).

4. Usar diagramas para pruebas geométricas (cada paso debe iluminar la parte relevante).

5. Si la demostración se basa en Reducción al Absurdo (RAA), el Paso 1 debe establecerse formalmente dictando "Por regla lógica de Reducción al Absurdo, supongamos la negación de la conclusión...".

---

## 8. Sistema de Enlazado Semántico

La navegación interna NUNCA usa enlaces Markdown estándar `[texto](url)`. Usar EXCLUSIVAMENTE estos componentes:

| Componente | Propósito | Import path |
|---|---|---|
| `<ConceptLink targetId="slug">texto</ConceptLink>` | Abre el MarginaliaPanel. Crea relación semántica y dependencia formal (si `isDependency` no es `false`). | Global (MDXComponents) |
| `<RefLink targetId="slug">texto</RefLink>` | Igual que `ConceptLink` pero sin crear dependencia formal. | Global (MDXComponents) |
| `<GlossaryLink term="term">texto</GlossaryLink>` | Tooltip rápido para términos auxiliares/glosario. | Global (MDXComponents) |
| `<VisualBind color="token" element="id">texto</VisualBind>` | Vincula texto a elemento del diagrama adyacente. | Global (MDXComponents) |
| `<InteractiveElement target="var" color="token">text</InteractiveElement>` | Vincula texto inline a una variable del diagrama; escribe en `MathStore.highlight`. | `../../components/ui/VisualBind` |

---

## 9. Paleta Arts & Crafts

| Token | Clase Tailwind | Hex | Significado matemático |
|---|---|---|---|
| `lienzo` | `bg-lienzo` | `#F8F6F1` | Fondo general, lienzo |
| `carbon` | `text-carbon` | `#333333` | Ejes, bordes, texto principal, grid |
| `salvia` | `text-salvia` | `#A2C2A2` | Planos, coeficientes, geometría secundaria |
| `terracota` | `text-terracota` | `#C86446` | Puntos, vectores, incógnitas |
| `pizarra` | `text-pizarra` | `#5D7080` | Distancias, resultados, mediciones |
| `ocre` | `text-ocre` | `#c49b4f` | Resaltados, valores especiales |
| `pavo` | `text-pavo` | `#3b5e6b` | Acento alternativo |
| `granada` | `text-granada` | `#8b3a3a` | Errores, contradicciones, absurdos lógicos (RAA) |
| `musgo` | `text-musgo` | `#4a5d23` | Aplicaciones, resultados verificados |

---

## 10. Grafo y Red de Dependencias

### 10.1 Qué Tipos Participan

El grafo DEBE ser un DAG topológico estricto. A partir de ahora, la distinción topológica se fundamenta en la inversión de primitivos: los primitivos de grado 0 garantizan la contención lógica sin sobredimensionar la cascada deductiva.

---

## 11. Convenciones de Naming

- IDs: kebab-case estricto.
- Componentes React: PascalCase.tsx.

---

## 12. Estructura de Archivos (FSD)

### 12.1 Ubicación de archivos MDX

Todo contenido MDX vive en `src/database/content/`, organizado por tipo:

```
src/database/content/
  axioms/             → axioma-*.mdx
  axiomatic-systems/  → sistema-*.mdx
  definitions/        → definicion-*.mdx
  theorems/           → teorema-*.mdx, lema-*.mdx, corolario-*.mdx
  demonstrations/     → demo-*.mdx
  examples/           → ejemplo-*.mdx
  exercises/          → ejercicio-*.mdx
  lessons/            → leccion-*.mdx
  mathematicians/     → matematico-*.mdx
  models/             → modelo-*.mdx
  plans/              → plan-de-estudio-*.mdx
  usecases/           → caso-de-uso-*.mdx
```

### 12.2 Archivos de soporte

| Qué | Dónde |
|---|---|
| Diagramas interactivos | `src/shared/diagrams/{Axiomas,Definiciones,Teoremas,Demos,Models}/` |
| Plantillas MDX | `src/shared/templates/{tipo}.template.mdx` |
| Schemas Zod | `src/entities/content/schemas.ts` |
| Índice de contenido | `src/entities/content/contentIndex.json` |
| Constantes y paleta | `src/shared/lib/constants.ts` |
| Componentes UI | `src/shared/ui/` |
| Componentes de ejercicio | `src/features/exercises/ui/` |

---

## 13. Exportación de Simulaciones y Diagramas

Se mantiene inalterado. Exportar `Component`, `Simulation` o `Diagram` según tipo de nodo.

---

## 14. Diseño de Diagramas e Interactividad (JSXGraph)

Se mantiene inalterado. Reglas de `boundingbox`, tokens de color, hibridación exploratoria y gliders estrictos.

---

## 15. Fuentes de Referencia

| Fuente | Contenido |
|---|---|
| Euclid / Heath, *The Thirteen Books of the Elements* | Proposiciones geométricas clásicas |
| Hilbert, *Grundlagen der Geometrie* (1899) | Fundación axiomática moderna |
| Greenberg, *Euclidean and Non-Euclidean Geometries* | Geometría no euclídea, Regla Lógica de las 6 Justificaciones, rigor atómico |
| Hartshorne, *Geometry: Euclid and Beyond* | Puente entre Euclides y Hilbert |

---

## 16. Validación Automática (OBLIGATORIA)

Tras crear o editar contenido, ejecutar:

```
npm run typecheck
npm run validate-graph
npm run validate-lean
```

---

## 17. Checklist de Integridad Referencial

- [ ] El ID está en kebab-case.
- [ ] Todas las claves de metadata usan comillas dobles.
- [ ] Todo `targetId` apunta a IDs existentes.

---

## 18. Checklist de Calidad por Tipo

### Demostración

- [ ] `parentTheorem` apunta a un teorema existente
- [ ] Rigor de Greenberg: Cada afirmación en los pasos utiliza estrictamente una de las 6 justificaciones (Hipótesis, Axioma, Teorema, Definición, Paso Previo, Regla Lógica).
- [ ] No existen deducciones topológicas basadas en asunciones visuales del diagrama (ej. asumir intersecciones sin invocar el Axioma de Pasch).
- [ ] Cada `MedievalStep` tiene un `<InteractiveElement>` correspondiente en el cuerpo
- [ ] `InteractiveElement` está importado desde `VisualBind` (no desde MDXBlocks)
- [ ] El método de demostración (`proofMethod`) describe correctamente el enfoque
- [ ] Para split-layout: cada paso tiene diagrama o usa uno compartido
- [ ] La demostración es completa (sin huecos) y finaliza con $\blacksquare$
- [ ] Usa `export const Component` (no body MDX plano)

---

## 19. Clasificación de Conceptos Derivados

Se mantiene inalterado. Uso de tablas exhaustivas y ConceptLinks.

---

## 20. Rigor en Definiciones y Casos Límite

Toda definición geométrica DEBE mencionar qué sucede cuando las condiciones ideales no se cumplen.

---

## 21. Clasificaciones Jerárquicas

Se mantiene inalterado. Ordenar tablas taxonómicas de menor a mayor especificidad.
