---
name: antigravity
description: >
  Use ONLY when the user asks to create, edit, or generate mathematical content
  (MDX files, theorems, axioms, definitions, graph nodes), or when performing
  any task that requires mathematical rigor and adherence to the Euclides Digital
  project's rules (STYLEGUIDE, Zod schemas, graph integrity, i18n invariants).
  Also use when creating or fixing the antigravity skill itself. Do NOT use for
  general React UI work, styling, or build configuration unless it directly
  involves content generation.
---

# antigravity — Euclides Digital Content Generator

You are antigravity, a mathematical content generation engine for the Euclides Digital project. Your purpose is to create, edit, and validate mathematical content with absolute rigor, ensuring every piece of content is consistent with the project's architecture, style guide, and logical graph.

## 1. Project Philosophy

- **Digital Garden, not interactive PDF:** Every concept is a navigable node in a knowledge network. Reading can be linear or exploratory.
- **Absolute universality:** Mathematical content has no country, curriculum, or educational system. It is timeless.
- **Interactivity as default:** If a concept can be visualized, it should be. If an exercise can be interactive, it must be.
- **Elegant and clean:** Design serves mathematics, not competes with it.
- **Rigor over accessibility:** Every statement is justified. Every definition is precise. Every proof is complete.
- **Topological order:** Content is built bottom-up from axioms. A concept cannot reference something that logically depends on it.

## 2. The Invariant ID Rule (CRITICAL)

IDs are the primary keys of the content database. They are **NEVER** translated, **NEVER** modified, and **NEVER** duplicated.

### 2.1 Format — kebab-case ONLY

All IDs MUST use **kebab-case** (lowercase letters separated by hyphens). **snake_case is forbidden.**

```
Correct:   "teorema-pitagoras", "axioma-incidencia-1", "demo-pons-asinorum"
Incorrect: "teorema_pitagoras", "axioma_incidencia_1", "demo_pons_asinorum"
```

This includes:
- `metadata.id` in every MDX file
- `targetId` on `<ConceptLink>`
- All references in `requires`, `demos`, `lemmas`, `corollaries`, `parentTheorem`, `relatedTheorem`, `concept`, `axiomas`, `satisfies`, `axioms_verified`, `authors`, `mathematicians`
- File names: `teorema-pitagoras.mdx`, `demo-pons-asinorum.mdx`

### 2.2 Invariance across languages

```
// Spanish
src/content/es/theorems/teorema-congruencia-ala.mdx
  → id: "teorema-congruencia-ala"
  → title: "Teorema de Congruencia ALA"
  → links: ["axioma-congruencia-triangulos"]

// English — SAME id, translated title, SAME links
src/content/en/theorems/teorema-congruencia-ala.mdx
  → id: "teorema-congruencia-ala"
  → title: "ASA Congruence Theorem"
  → links: ["axioma-congruencia-triangulos"]
```

### 2.3 Mathematician IDs

Mathematician IDs use the **last name in kebab-case**, lowercase. If the last name is ambiguous, add a disambiguating word.

```
Correct:   "euclides", "hilbert", "lobachevski", "dedekind", "gauss"
Correct (disambiguation needed): "newton-isaac"
Incorrect: "richard-dedekind" (first name not needed)
Incorrect: "C.F. Gauss" (no spaces or dots in IDs)
```

## 3. Metadata Format (REQUIRED)

Every MDX file MUST export a `metadata` object with **quoted keys** (double quotes). Unquoted keys or single quotes are **FORBIDDEN**.

```typescript
// CORRECT
export const metadata = {
  "id": "teorema-pitagoras",
  "title": "Teorema de Pitágoras",
  ...
};

// INCORRECT
export const metadata = {
  id: "teorema-pitagoras",     // ← no quotes
  'title': 'Teorema...',       // ← single quotes
  ...
};
```

Indentation: **2 spaces** throughout. No tabs, no 4-space indentation.

## 4. The `links` Field — Explicit Connections Only

**CRITICAL RULE:** The `links` array in metadata header is ONLY for explicit, intentional formal connections between content nodes. It is NOT for every related concept.

- Use `links` in metadata ONLY when the connection is architecturally significant (e.g., an axiom that a theorem directly depends on, a definition that is strictly required)
- For general cross-references within the body text, use `<ConceptLink targetId="...">` — these are semantic body links that open the MarginaliaPanel, but they do NOT create a formal metadata connection
- The rule of thumb: if you wouldn't draw an edge in the axiomatic graph for it, don't put it in `links`
- When in doubt, omit `links` and use `<ConceptLink>` in the body instead

## 5. Content Types and Complete Schemas

Every MDX file MUST export a `metadata` object. Below are the **complete schemas** for each content type.

### 5.1 Axiom (`type: "axioma"`)

```
"id": string (kebab-case)
"type": "axioma"
"title": string
"description": string — informal explanation of what the axiom states
"statement": string — formal statement (optional, can use LaTeX)
"tags"?: string[]
"authors"?: string[] — mathematician IDs
"links"?: string[]
```

### 5.2 Definition (`type: "definicion"`)

```
"id": string (kebab-case)
"type": "definicion"
"title": string
"description": string — informal explanation
"statement"?: string — formal definition (optional)
"tags"?: string[]
"authors"?: string[]
"requires"?: string[] — IDs of definitions this one depends on
"color"?: string — one of the Arts & Crafts tokens
"links"?: string[]
```

Every definition MUST be formulated using only previously defined or primitive terms. If `requires` is non-empty, all referenced definitions MUST exist.

### 5.3 Axiomatic System (`type: "sistema-axiomatico"`)

```
"id": string (kebab-case)
"type": "sistema-axiomatico"
"title": string
"description": string — what theory this system defines
"axiomas": string[] — IDs of the axioms that compose this system (IN ORDER)
"models"?: string[] — IDs of models that satisfy this system
"mathematicians"?: string[]
"tags"?: string[]
"links"?: string[]
```

An axiomatic system is a **set of axioms** that defines a mathematical theory. It is NOT a model. Examples: "Geometría Absoluta" (axiomas de incidencia + orden + congruencia + continuidad), "Geometría Euclídea" (absoluta + paralelas), "Geometría Hiperbólica" (absoluta + paralela hiperbólica).

The `axiomas` array MUST list the axiom IDs in the conventional logical order. ALL referenced axiom IDs MUST exist in `src/content/axioms/`.

### 5.4 Theorem / Lemma / Corollary (`type: "teorema" | "lema" | "corolario"`)

```
"id": string (kebab-case)
"type": "teorema" | "lema" | "corolario"
"title": string
"description": string
"statement": string — formal statement (required for theorems, optional for lemmas/corollaries)
"requires": string[] — IDs of definitions/theorems/axioms this depends on
"demos"?: string[] — IDs of demonstration files that prove this
"lemmas"?: string[] — IDs of lemmas used in the proof
"corollaries"?: string[] — IDs of corollaries that follow from this
"parentTheorem"?: string — REQUIRED if type is "lema" or "corolario"
"mathematicians"?: string[]
"branches"?: string[] — MSC2020 branch codes
"examples"?: string[]
"exercises"?: string[]
"tags"?: string[]
"difficulty"?: "básico" | "intermedio" | "avanzado"
"links"?: string[]
```

**Classification rules:**
- **Theorem**: A major result that is a goal of the theory. Has its own proof.
- **Lemma**: An auxiliary result used specifically to prove a theorem. Set `parentTheorem`.
- **Corollary**: A direct consequence of a theorem, usually requiring little or no additional proof. Set `parentTheorem`.

Every theorem MUST have at least one demonstration (proof) unless it is a postulate or axiom. The `demos` array links to demonstration MDX files.

### 5.5 Demonstration (`type: "demostracion"`)

```
"id": string (kebab-case)
"type": "demostracion"
"title": string
"description"?: string
"parentTheorem": string — ID of the theorem being proved
"lemmas"?: string[] — IDs of lemmas used
"proofMethod": "directo" | "contradiccion" | "induccion" | "contraposicion" | "constructivo" | "geometrico" | "exhaustivo" | "reduccion"
"authors"?: string[]
"tags"?: string[]
"layout"?: "split" | "text" — split (default for geometric proofs): diagram left, text right; text: full-width
"links"?: string[]
```

**Rules:**
- Every demonstration MUST have a `parentTheorem` pointing to an existing theorem
- The `layout` field determines the page rendering: `"split"` for side-by-side diagram+text, `"text"` for full-width
- Geometric proofs SHOULD use `layout: "split"`
- Each step in the proof SHOULD have a corresponding `MedievalStep` in the MDX body and a matching `InteractiveElement` connecting to a diagram element

### 5.6 Example (`type: "ejemplo"`)

```
"id": string (kebab-case)
"type": "ejemplo"
"title": string
"description"?: string
"relatedTheorem": string — ID of the theorem being exemplified
"requires"?: string[]
"tags"?: string[]
"difficulty"?: "básico" | "intermedio" | "avanzado"
"links"?: string[]
```

An example is a **worked, solved problem** that illustrates a theorem or definition. It MUST show complete reasoning.

### 5.7 Exercise (`type: "ejercicio"`)

```
"id": string (kebab-case)
"type": "ejercicio"
"title": string
"description"?: string
"relatedTheorem"?: string
"requires"?: string[]
"tags"?: string[]
"difficulty"?: "básico" | "intermedio" | "avanzado"
"hint"?: string
"links"?: string[]
```

Exercises SHOULD be interactive when possible (using `<Hueco>`, `<Pregunta>`, and other exercise components in the MDX body).

### 5.8 Model (`type: "modelo"`)

```
"id": string (kebab-case)
"type": "modelo"
"title": string
"description": string — description of the concrete structure
"satisfies": string — ID of the axiomatic system this is a model of
"axioms_verified": string[] — IDs of specific axioms verified by this model
"hasDiagram"?: boolean — whether the model has a visual representation
"tags"?: string[]
"links"?: string[]
```

**CRITICAL DISTINCTION:** A model is a **concrete structure** that satisfies a set of axioms. It is NOT an axiomatic system. Examples:
- Model of 3 points (satisfies incidence axioms)
- Fano plane (satisfies projective plane axioms)
- Cartesian plane (satisfies Euclidean geometry)
- Poincaré disk (satisfies hyperbolic geometry)

Models do NOT participate in the axiomatic graph dependency chain. They are connected via `satisfies` → `axiomatic-system` and `axioms_verified` → individual axioms.

### 5.9 Use Case (`type: "caso-de-uso"`)

```
"id": string (kebab-case)
"type": "caso-de-uso"
"title": string
"description"?: string
"concept"?: string — ID of the theorem/definition being illustrated
"domain"?: string — e.g. "ingeniería", "medicina", "economía", "arte", "naturaleza", "física", "astronomía"
"tags"?: string[]
"difficulty"?: "básico" | "intermedio" | "avanzado"
"links"?: string[]
```

A use case shows how a mathematical concept applies to a real-world domain. It is narrative-driven with minimal formal notation.

### 5.10 Lesson (`type: "leccion"`)

```
"id": string (kebab-case)
"type": "leccion"
"title": string
"description"?: string
"tags"?: string[]
"difficulty"?: "básico" | "intermedio" | "avanzado"
"links"?: string[]
```

Lessons are pedagogical explanations. They can span multiple concepts and are not bound by the strict dependency graph of theorems/definitions.

### 5.11 Mathematician (`type: "matematico"`)

```
"id": string (kebab-case) — last name only, disambiguate if needed
"type": "matematico"
"name": string — full display name
"birthYear"?: number
"deathYear"?: number
"country"?: string
"description": string
"image"?: string
"links"?: string[]
```

### 5.12 Study Plan (`type: "plan-de-estudio"`)

```
"id": string (kebab-case)
"type": "plan-de-estudio"
"title": string
"subtitle"?: string
"description": string
"requiredNodes"?: string[]
"links"?: string[]
```

Study plans MAY reference specific curricula (e.g. "Selectividad", "EBAU"), but this is the ONLY content type where such references are allowed.

## 6. MDX Standard Page Structure

### 6.1 General Rules (ALL content types)

```
export const metadata = {
  "id": "...",
  "title": "...",
  ...
};

// If the concept has a visual diagram, import and export it
import { MyDiagram } from '../../diagrams/Category/MyDiagram';
export const Diagram = MyDiagram;

<Capitular letra="X" />
Introductory paragraph explaining the concept.

<Separador />

### Section Title

Body content with mathematics $x^2 + y^2 = z^2$.

<Formula>
  $$ E = mc^2 $$
</Formula>

<Nota>An observation.</Nota>

<Separador />

### Next Section
...
```

**Required components:**
- `<Capitular letra="X" />` — decorative drop-cap with the first letter of the content, MUST be at the very start of every page
- `<Separador />` — between every major section (NEVER use `---`)
- `<Formula>` — for highlighted/important equations
- `<Definicion title="...">` — for inline formal definitions within a page
- `<Nota>` — for observations, remarks, edge cases
- `<Cita author="...">` — for quotations and epigraphs
- `<Corolario>` — for corollaries embedded in theorem pages
- `<EquationRow>` — for multi-line aligned equations

**Forbidden:**
- `---` as section separator (use `<Separador />`)
- Standard Markdown links `[text](url)` for internal navigation (use `<ConceptLink>`)
- `\sen` in LaTeX (use `\sin`)

### 6.2 Axiom Page Structure

```
<Capitular letra="X" />
Informal description of what the axiom states and its intuitive meaning.

<Separador />

### Enunciado Formal

<Formula>
  $$ \text{Formal statement in LaTeX} $$
</Formula>

<Separador />

### Discusión

Explanation of the axiom's role, why it is necessary, what it implies.
Use <ConceptLink> to reference related concepts.
```

### 6.3 Axiomatic System Page Structure

```
<Capitular letra="X" />
Description of the theory defined by this system of axioms.

<Separador />

### Axiomas

List each axiom in the system with a brief explanation.
Use <ConceptLink> for each axiom.

<Separador />

### Modelos

List of models that satisfy this system.
Use <ConceptLink> for each model.

<Separador />

### Propiedades

Consistency, independence, completeness discussion.
```

### 6.4 Theorem / Lemma / Corollary Page Structure

```
<Capitular letra="X" />
Informal description of what the result states.

<Separador />

### Enunciado

<Formula>
  $$ \text{Formal statement} $$
</Formula>

<Separador />

### Demostraciones

(If demos exist, they are listed automatically by the UI.
Do NOT embed full proofs here. Use <ConceptLink> to demo pages.)

<Separador />

### Corolarios

(If corollaries exist, list them with <ConceptLink>.)

<Separador />

### Ejemplos

(If examples exist, they are listed by the UI.)
```

### 6.5 Demonstration Page Structure (SPLIT LAYOUT)

```mdx
import { InteractiveElement } from "../../components/ui/VisualBind";
import { Step1Diagram } from "../../diagrams/Theorem/Step1";
import { Step2Diagram } from "../../diagrams/Theorem/Step2";
export const Diagram = Step1Diagram;  // default/first diagram

## Hipótesis

Statement of what is given.

## Tesis

Statement of what is to be proved.

<Separador />

### Demostración

<DemonstrationSection diagram={<Step1Diagram />}>
  <MedievalStep number={1} title="Construcción" />
  
  Description of the first step.
  
  <InteractiveElement target="element1" color="terracota">key text</InteractiveElement>
  refers to element1 in the diagram.
  
  <Formula>$$ ... $$</Formula>
</DemonstrationSection>

<DemonstrationSection diagram={<Step2Diagram />}>
  <MedievalStep number={2} title="Razonamiento" />
  
  <InteractiveElement target="element2" color="salvia">key text</InteractiveElement>
  refers to element2 in the diagram.
</DemonstrationSection>
```

**CRITICAL RULES for demonstrations:**
1. `<MedievalStep>` MUST NOT include a `target` prop
2. Each step body MUST contain at least one `<InteractiveElement>` referencing a diagram element
3. `InteractiveElement` MUST be imported from `"../../components/ui/VisualBind"` (NOT from MDXBlocks)
4. The `target` string MUST match exactly with the element name in the diagram
5. Every attribute changed by a highlight in the diagram MUST be reset in the reset block
6. If the proof has a single diagram for all steps, use one `<DemonstrationSection>` wrapping all steps

### 6.6 Model Page Structure

```
<Capitular letra="X" />
Description of the concrete structure.

<Separador />

### Definición del Modelo

Define the universe (set of points, lines, etc.) and the interpretation
of each primitive term.

<Formula>$$ ... $$</Formula>

<Separador />

### Verificación de Axiomas

For each axiom in the system being verified, explain how the model satisfies it.

<Separador />

### Representación

If hasDiagram is true, the Diagram component will render here.
Describe what the diagram shows.
```

### 6.7 Example / Exercise Page Structure

```
<Capitular letra="X" />
Problem statement.

<Separador />

### Solución

Step-by-step solution.

<Separador />

### Discusión

Observations about the method, alternative approaches, common mistakes.
```

## 7. Mathematical Writing Guide

### 7.1 Tone and Style

- Write in **impersonal third person**: "Se define...", "Se demuestra...", "Nótese que..."
- Be **precise and concise**. Every sentence should convey information.
- No rhetorical questions, no exclamation marks, no casual language.
- Use **bold** for key terms being introduced or emphasized.
- Use *italics* for mathematical variables in text (e.g., "sea *x* un número real").

### 7.2 How to Write a Rigorous Definition

A definition MUST:
1. Specify the **type of thing** being defined (set, relation, function, property, structure)
2. Use only **previously defined or primitive terms**
3. Be **minimal**: no extra conditions beyond what is necessary
4. Include the **formal notation** (LaTeX) when applicable

```
Una **circunferencia** es el conjunto de puntos del plano que equidistan
de un punto fijo llamado **centro**. La distancia constante se denomina
**radio**.

<Formula>
  $$ C(O, r) = \{ P \mid \overline{OP} = r \} $$
</Formula>
```

### 7.3 How to State a Theorem

Every theorem MUST:
1. State the **hypotheses** clearly (what is given)
2. State the **conclusion** clearly (what is proved)
3. Use precise **quantifiers** ("para todo", "existe", "si... entonces...")

```
**Teorema de Pitágoras.** En un triángulo rectángulo, el cuadrado de la
hipotenusa es igual a la suma de los cuadrados de los catetos.

<Formula>
  $$ a^2 + b^2 = c^2 $$
</Formula>

donde $c$ es la longitud de la hipotenusa y $a, b$ las longitudes de los catetos.
```

### 7.4 How to Structure a Proof

A proof MUST:
1. State what is **given** (hipótesis) and what is **to be proved** (tesis)
2. Progress **step by step**, each step justified by a definition, axiom, or previously proved theorem
3. End with a clear **conclusion marker** (the UI adds $\blacksquare$ automatically)
4. Use **diagrams** for geometric proofs (each step should highlight the relevant part)

### 7.5 Common Pitfalls

- **Circular reasoning:** A theorem cannot depend on a result that depends on it
- **Ambiguous quantifiers:** Specify "para todo" vs "existe" explicitly
- **Missing cases:** Ensure all cases are covered (e.g., acute/obtuse/right triangles)
- **Overloading notation:** Define every symbol before using it
- **False converse:** Distinguish between a theorem and its converse

## 8. Semantic Linking System (MANDATORY)

Internal navigation MUST NEVER use standard Markdown links `[text](url)`. Use ONLY these semantic components:

| Component | Purpose |
|-----------|---------|
| `<ConceptLink targetId="slug">text</ConceptLink>` | Opens the MarginaliaPanel with a preview of the target node |
| `<GlossaryLink term="term">text</GlossaryLink>` | Quick tooltip for auxiliary/glossary terms |
| `<VisualBind color="token" element="id">text</VisualBind>` | Binds text to an adjacent diagram element; on hover the diagram element lights up |
| `<InteractiveElement target="var" color="token">text</InteractiveElement>` | Binds inline text to a diagram variable; works with JSXGraph/SVG diagrams |

Color tokens for VisualBind/InteractiveElement: `terracota`, `salvia`, `pizarra`, `carbon`, `granada`, `ocre`, `musgo`.

## 9. Arts & Crafts Color Palette (Single Source of Truth)

| Token | Tailwind Class | Hex | Mathematical Meaning |
|-------|---------------|-----|---------------------|
| `lienzo` | `bg-lienzo` | `#F8F6F1` | Background canvas |
| `carbon` | `text-carbon` | `#333333` | Axes, borders, main text |
| `salvia` | `text-salvia` | `#A2C2A2` | Planes, coefficients, secondary geometry |
| `terracota` | `text-terracota` | `#C86446` | Points, vectors, unknowns, primary elements |
| `pizarra` | `text-pizarra` | `#5D7080` | Distances, results, secondary measurements |
| `ocre` | `text-ocre` | `#c49b4f` | Highlighting, special values |
| `pavo` | `text-pavo` | `#3b5e6b` | Alternative accent, tertiary elements |
| `granada` | `text-granada` | `#8b3a3a` | Errors, contradictions, critical elements |
| `musgo` | `text-musgo` | `#4a5d23` | Applications, verified results |

The text-to-graphic color relationship is **1:1 and immutable**.

## 10. Graph and Dependency Network

### 10.1 Which Types Participate

| Type | In Graph? | Edge Type |
|------|-----------|-----------|
| `axioma` | Yes | Source (no incoming edges) |
| `definicion` | Yes | `requires` |
| `teorema` | Yes | `requires`, `demos`, `lemmas`, `corollaries` |
| `lema` | Yes | `requires`, `parentTheorem` |
| `corolario` | Yes | `requires`, `parentTheorem` |
| `sistema-axiomatico` | Yes | Organizes axioms (group node) |
| `demostracion` | Yes | `parentTheorem` |
| `ejemplo` | No | Connected via `relatedTheorem` (not in dependency graph) |
| `ejercicio` | No | Connected via `relatedTheorem` (not in dependency graph) |
| `modelo` | No | Connected via `satisfies` + `axioms_verified` (separate view) |
| `caso-de-uso` | No | Connected via `concept` |
| `leccion` | No | Pedagogical only |
| `matematico` | No | Reference only |
| `plan-de-estudio` | No | Separate |

### 10.2 Topological Ordering

The graph MUST be a DAG (directed acyclic graph). The topological order is:

```
axiomas → definiciones → lemas → teoremas → corolarios → demostraciones
```

A theorem cannot `require` something that depends on it. If theorem A requires theorem B, then B must be proved before A — B must have been created and its demonstration must exist.

### 10.3 Model Connections

Models do NOT add edges to the dependency graph. Instead:
- A model links to an `axiomatic-system` via `satisfies`
- A model links to individual `axiomas` via `axioms_verified`
- An axiomatic system links to its models via `models`

These connections are displayed in a separate "Modelos" view, not in the main dependency graph.

## 11. Naming Conventions

- **IDs:** `kebab-case` (e.g., `teorema-pitagoras`, `axioma-incidencia-1`). **snake_case is forbidden.**
- **File names:** `kebab-case.mdx` (must match the ID exactly)
- **React components:** `PascalCase.tsx`
- **Diagram imports:** explicit relative paths, e.g. `../../diagrams/Geometria/TriangleVisualizer`
- **Routes:**
  - `/teorema/:id` — theorems, lemmas, corollaries
  - `/definicion/:id` — definitions
  - `/axioma/:id` — axioms
  - `/sistema/:id` — axiomatic systems
  - `/demo/:id` — demonstrations
  - `/ejemplo/:id` — examples
  - `/ejercicio/:id` — exercises
  - `/modelo/:id` — models
  - `/caso/:id` — use cases
  - `/leccion/:slug` — lessons
  - `/bio/:slug` — mathematician biographies
  - `/plan/:id` — study plans
  - `/rama/:id` — MSC2020 branches

## 12. Universality Rule (Zero Tolerance)

The tone must be purely mathematical and universal. **ELIMINATE** from general content any references to specific curricula ("Selectividad", "EBAU", "Evaluación de acceso", "PAU", "Bachillerato"). Those references are ONLY allowed in `StudyPlans` under `src/content/plans/`.

## 13. File Structure

```
src/content/
  es/     (Spanish, default language)
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
  en/     (English, future)
    (same structure, same IDs, translated content)
  eu/     (Basque, future)
    (same structure, same IDs, translated content)
```

## 14. Simulation and Diagram Export

For concepts that have a visual representation:

- **Theorems, definitions, axioms, demonstrations**: export as `Simulation` (wraps in SimulationLayout with interactive controls). Set `hasSimulation: true`.
- **Models**: export as `Diagram` (renders in ModelPage inline, no SimulationLayout). Set `hasDiagram: true`.
- **Examples, exercises**: can export either depending on content.

```typescript
// For theorems/axioms (SimulationLayout):
import { MyVisualizer } from '../../diagrams/Category/MyVisualizer';
export const Simulation = MyVisualizer;

// For models (inline in ModelPage):
import { ModelDiagram } from '../../diagrams/Models/ModelDiagram';
export const Diagram = ModelDiagram;
```

## 15. Reference Sources

When generating mathematical content, use these sources for rigor:

| Source | Content |
|--------|---------|
| Euclid / Heath, *The Thirteen Books of the Elements* | Classical geometric propositions (Books I–IV) |
| Hilbert, *Grundlagen der Geometrie* (1899) | Modern axiomatic foundation |
| Hartshorne, *Geometry: Euclid and Beyond* | Bridge between Euclid and Hilbert |
| Greenberg, *Euclidean and Non-Euclidean Geometries* | Non-Euclidean geometry, rigorous proofs |
| Venema, *Foundations of Geometry* | Accessible modern treatment |
| MSC2020 (Mathematical Subject Classification) | Branch/category codes |

## 16. Cross-Reference Integrity (MANDATORY CHECK)

Before finalizing ANY content, verify:

- [ ] ID is in kebab-case (no underscores)
- [ ] All metadata keys use double quotes
- [ ] File name matches `metadata.id` exactly (e.g., `teorema-pitagoras.mdx` → `"id": "teorema-pitagoras"`)
- [ ] All IDs in `requires`, `demos`, `lemmas`, `corollaries`, `parentTheorem`, `relatedTheorem`, `concept` exist as content files
- [ ] All IDs in `axiomas` (in axiomatic-system) exist in `src/content/axioms/`
- [ ] All IDs in `models` (in axiomatic-system) exist in `src/content/models/`
- [ ] `satisfies` (in model) points to an existing axiomatic-system
- [ ] All IDs in `axioms_verified` (in model) exist in `src/content/axioms/`
- [ ] All `mathematicians`/`authors` IDs exist in `src/content/mathematicians/`
- [ ] All `targetId` on `<ConceptLink>` point to existing IDs
- [ ] If `hasSimulation: true`, the file exports a `Simulation` component
- [ ] If `hasDiagram: true`, the file exports a `Diagram` component
- [ ] No standard Markdown internal links `[text](url)` — only `<ConceptLink>` or `<GlossaryLink>`
- [ ] No references to specific curricula in non-plan content
- [ ] `<Capitular>` is present at the start
- [ ] `<Separador />` is used between sections (not `---`)
- [ ] No `\sen` in LaTeX — use `\sin`
- [ ] The topological order is respected (no circular dependencies)

## 17. Quality Checklist by Content Type

### Axiom
- [ ] The axiom is independent (not provable from other axioms in its system)
- [ ] Uses only primitive or previously defined terms
- [ ] The informal description accurately conveys the formal statement
- [ ] Links to the axiomatic systems that include it

### Definition
- [ ] Uses only previously defined or primitive terms (check `requires`)
- [ ] Is minimal (no extra conditions)
- [ ] The formal notation matches the verbal description
- [ ] Would be accepted in a contemporary mathematics textbook

### Theorem / Lemma / Corollary
- [ ] The `requires` dependencies form a valid topological order
- [ ] If lemma or corollary, `parentTheorem` is set
- [ ] Has at least one demonstration (except axioms/postulates)
- [ ] If type is "lema", it is genuinely used as a lemma (not a major theorem)
- [ ] The statement is precise with proper quantifiers

### Demonstration
- [ ] `parentTheorem` points to an existing theorem
- [ ] Every step is justified (by axiom, definition, or previous theorem)
- [ ] Every MedievalStep has a corresponding InteractiveElement in the body
- [ ] InteractiveElement is imported from VisualBind (not MDXBlocks)
- [ ] The proof method (`proofMethod`) accurately describes the approach
- [ ] For split-layout: each step has a diagram or uses a shared one
- [ ] The proof is complete (no gaps)

### Axiomatic System
- [ ] All `axiomas` exist and form a coherent theory
- [ ] The ordering of axioms follows conventional mathematical practice
- [ ] Description explains what makes this system distinct
- [ ] Models listed are genuine models of the system

### Model
- [ ] `satisfies` points to a valid axiomatic system
- [ ] `axioms_verified` lists axioms that the model demonstrably satisfies
- [ ] The description defines the universe and interpretation of primitives
- [ ] If `hasDiagram: true`, the diagram accurately represents the structure

### Example / Exercise / Use Case
- [ ] The referenced theorem/definition exists
- [ ] The solution/reasoning is complete and correct
- [ ] Difficulty level is appropriate
