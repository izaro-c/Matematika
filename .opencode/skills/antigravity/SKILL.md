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

## 2. The Invariant ID Rule (CRITICAL)

IDs are the primary keys of the content database. They are NEVER translated, NEVER modified, and NEVER duplicated.

- `metadata.id` — NEVER translate even if the title changes language
- `targetId` on `<ConceptLink>` — NEVER translate
- `links` arrays in metadata — NEVER translate
- MSC2020 taxonomy codes — NEVER translate

Example — Spanish and English versions of the same theorem:
```
src/content/es/theorems/teorema_congruencia_ala.mdx
  → id: "teorema-congruencia-ala"   ← INVARIANT
  → title: "Teorema de Congruencia ALA"
  → links: ["axioma-congruencia-triangulos"]  ← INVARIANT

src/content/en/theorems/teorema_congruencia_ala.mdx
  → id: "teorema-congruencia-ala"   ← SAME INVARIANT ID
  → title: "ASA Congruence Theorem"
  → links: ["axioma-congruencia-triangulos"]  ← SAME INVARIANT
```

## 2b. The `links` Field — Explicit Connections Only

**CRITICAL RULE:** The `links` array in metadata header is ONLY for explicit, intentional formal connections between content nodes. It is NOT for every related concept.

- Use `links` in metadata ONLY when the connection is architecturally significant (e.g., an axiom that a theorem directly depends on, a definition that is strictly required)
- For general cross-references within the body text, use `<ConceptLink targetId="...">` — these are semantic body links that open the MarginaliaPanel, but they do NOT create a formal metadata connection
- The rule of thumb: if you wouldn't draw an edge in the axiomatic graph for it, don't put it in `links`
- When in doubt, omit `links` and use `<ConceptLink>` in the body instead

## 3. Content Types and Schemas

Every MDX file MUST export a `metadata` object. The metadata is validated against Zod schemas defined in `src/store/schemas.ts`. Below are the fields for each content type.

### 3.1 Theorem (`type: "teorema" | "lema" | "corolario"`)
```
id: string (snake_case, e.g. "teorema-pitagoras")
type: "teorema" | "lema" | "corolario"
title: string
description: string
statement?: string (optional, the formal statement)
color?: string (one of the Arts & Crafts palette)
branch?: string
branches?: string[]
mathematicians?: string[] (IDs of mathematicians)
lemmas?: string[]
corollaries?: string[]
demos?: string[] (IDs of demonstrations)
requires?: string[] (IDs of definitions/theorems this depends on)
examples?: string[]
exercises?: string[]
parentTheorem?: string (if this is a corollary/lemma)
tags?: string[]
difficulty?: "básico" | "intermedio" | "avanzado"
links?: string[]
```

### 3.2 Axiom (`type: "axioma"`)
```
id: string
type: "axioma"
title: string
description: string
statement?: string
tags?: string[]
authors?: string[]
links?: string[]
```

### 3.3 Definition (`type: "definicion"`)
```
id: string
type: "definicion"
title: string
description: string
statement?: string
tags?: string[]
authors?: string[]
color?: string
usedBy?: string[]
links?: string[]
```

### 3.4 Lesson (`type: "leccion"`)
```
id: string
type: "leccion"
title: string
description?: string
tags?: string[]
difficulty?: "básico" | "intermedio" | "avanzado"
links?: string[]
```

### 3.5 Demonstration (`type: "demostracion"`)
```
id: string
type: "demostracion"
title: string
description?: string
parentTheorem?: string
lemmas?: string[]
proofMethod?: "directo" | "contradiccion" | "induccion" | "contraposicion" | "constructivo" | "geometrico" | "exhaustivo" | "reduccion"
authors?: string[]
tags?: string[]
layout?: "split" | "text"
links?: string[]
```

### 3.6 Example (`type: "ejemplo"`)
```
id: string
type: "ejemplo"
title: string
description?: string
relatedTheorem?: string
requires?: string[]
tags?: string[]
difficulty?: "básico" | "intermedio" | "avanzado"
links?: string[]
```

### 3.7 Exercise (`type: "ejercicio"`)
```
id: string
type: "ejercicio"
title: string
description?: string
relatedTheorem?: string
requires?: string[]
tags?: string[]
difficulty?: "básico" | "intermedio" | "avanzado"
hint?: string
links?: string[]
```

### 3.8 Use Case (`type: "caso_de_uso"`)
```
id: string
type: "caso_de_uso"
title: string
description?: string
concept?: string (ID of the theorem/definition being illustrated)
domain?: string (e.g. "ingeniería", "medicina", "economía", "arte", "naturaleza", "física", "astronomía")
tags?: string[]
difficulty?: "básico" | "intermedio" | "avanzado"
links?: string[]
```

### 3.9 Model (`type: "modelo"`)
```
id: string
type: "modelo"
title: string
description?: string
axiomas?: string[] (IDs of axioms in this model)
tags?: string[]
```

### 3.10 Study Plan (`type: "plan_de_estudio"`)
```
id: string
type: "plan_de_estudio"
title: string
subtitle?: string
description: string
requiredNodes?: string[]
links?: string[]
```

### 3.11 Mathematician (`type: "matematico"`)
```
id?: string
type: "matematico"
name: string
birthYear?: number
deathYear?: number
country?: string
description: string
image?: string
links?: string[]
```

## 4. MDX Standard Page Structure

Every content page MDX MUST follow this structure:

```
export const metadata = {
  "id": "snake_case_id",
  "title": "Title",
  "description": "Description",
  ...
};

// Optional: import and export simulation
import { Simulation } from '../../diagrams/Category/Simulator';
export const Simulation = Simulation;

<Capitular letra="X" />
Introductory paragraph with **bold** for key terms.

<Separador />

### Section Title

Content with mathematics $x^2 + y^2 = z^2$.

<Formula>
  $$ E = mc^2 $$
</Formula>

<Nota>
  An important observation.
</Nota>

<Separador />

### Next Section
...
```

**Rules:**
- Every page MUST start with `<Capitular letra="X" />` — the first letter of the content, decorative drop-cap
- Every section MUST be separated by `<Separador />` (never `---`)
- Formal definitions inside MDX MUST use `<Definicion title="...">...</Definicion>`
- Highlighted formulas MUST use `<Formula>...</Formula>`
- Notes/observations MUST use `<Nota>...</Nota>`
- Epigraphs/quotes MUST use `<Cita author="...">...</Cita>`
- Corollaries embedded in theorem/definition pages MUST use `<Corolario>...</Corolario>`
- Multi-line equations MUST use `<EquationRow>...</EquationRow>`
- Sequential steps MUST use `<MedievalStep number={1} title="...">...</MedievalStep>`

### Demonstrations (Proofs) — ALWAYS in Their Own Page

**CRITICAL RULE:** Full proofs/demonstrations of theorems are NEVER embedded in the theorem's MDX file. They MUST live in their own file at `src/content/demonstrations/<id>.mdx` and be connected via the `demos` metadata field.

Why:
- Keeps the theorem page clean and readable
- The TheoremPage automatically renders a "Demostraciones Disponibles" section with links to each demo
- Each demo can have its own layout (split/text), interactive diagrams, and step-by-step navigation

The flow:
1. Theorem MDX: set `demos: ["demo-mi-demo"]` in metadata (no `<Demostracion>` block)
2. Demo MDX: set `parentTheorem: "id-del-teorema"` to link back
3. The UI automatically shows navigation buttons between theorem and demo

The `<Demostracion>` component is still available and can be used for embedding a short inline proof or partial derivation within definition pages, lessons, or other explanatory content — but NEVER for a theorem's full proof.

### MedievalStep `target` Prop — DO NOT USE

`<MedievalStep>` MUST NOT include a `target` prop. Diagram highlights are driven ONLY by `<InteractiveElement>` (hover) in the body text, NOT by MedievalStep's IntersectionObserver.

The `target` prop on MedievalStep was previously used for auto-highlighting via `MathStore.highlight`, but this conflicted with the proper hover-based highlight flow. Remove it entirely.

```mdx
<MedievalStep number={1} title="Hipótesis" />
```

### MedievalStep per-step diagram (when needed)

In demonstration MDX files (`layout: "split"`), each step can have its own diagram by wrapping it in its own `<DemonstrationSection>`:

```mdx
<DemonstrationSection diagram={<Step1Diagram />}>
  <MedievalStep number={1} title="Primer paso" />
  ...
</DemonstrationSection>

<DemonstrationSection diagram={<Step2Diagram />}>
  <MedievalStep number={2} title="Segundo paso" />
  ...
</DemonstrationSection>
```

### InteractiveElement Cross-References (MANDATORY)

Every `<InteractiveElement target="...">` in the MDX body MUST have a corresponding named element in the diagram's `elementsRef`. The diagram responds to `LessonStore.activeStep` — if the highlight value doesn't match any element, the hover has no visual effect.

IMPORTANT: All demonstration MDX files MUST import `InteractiveElement` from `"../../components/ui/VisualBind"`, NOT from `"../../components/ui/MDXBlocks"`. The VisualBind variant writes to `LessonStore`, which is what the Euclides diagrams read.

```mdx
import { InteractiveElement } from "../../components/ui/VisualBind";
```

Rules:
- Each proof step MUST include at least one `<InteractiveElement>` referencing the diagram element being discussed
- The `target` string MUST be identical in the MDX and the diagram component
- Test by tracing: `MDX: target="ladoA"` → `VisualBind setActiveStep('ladoA')` → `LessonStore.activeStep = 'ladoA'` → `diagram useEffect: if (highlight === 'ladoA')`
- Every attribute changed in the highlight block MUST be explicitly reset to its default in the effect's reset block

## 5. Semantic Linking System (MANDATORY)

Internal navigation MUST NEVER use standard Markdown links `[text](url)`. Use ONLY these semantic components:

| Component | Purpose |
|-----------|---------|
| `<ConceptLink targetId="slug">text</ConceptLink>` | Opens the MarginaliaPanel with a preview of the target node |
| `<GlossaryLink term="term">text</GlossaryLink>` | Quick tooltip for auxiliary/glossary terms |
| `<VisualBind color="token" element="id">text</VisualBind>` | Binds text to an adjacent diagram element; on hover the diagram element lights up |
| `<InteractiveElement target="var" color="token">text</InteractiveElement>` | Binds inline text to a simulation variable, works with JSXGraph diagrams |

Color tokens for VisualBind/InteractiveElement: `terracota`, `salvia`, `pizarra`, `carbon`, `granada`.

## 6. Arts & Crafts Color Palette (Single Source of Truth)

| Token | Tailwind Class | Hex | Mathematical Meaning |
|-------|---------------|-----|---------------------|
| `lienzo` | `bg-lienzo` | `#F8F6F1` | Background canvas |
| `carbon` | `text-carbon` | `#333333` | Axes, borders, main text |
| `salvia` | `text-salvia` | `#A2C2A2` | Planes, coefficients |
| `terracota` | `text-terracota` | `#C86446` | Points, vectors, unknowns |
| `pizarra` | `text-pizarra` | `#5D7080` | Distances, results, secondary elements |
| `ocre` | `text-ocre` | `#c49b4f` | Highlighting |
| `pavo` | `text-pavo` | `#3b5e6b` | Alternative accent |
| `granada` | `text-granada` | `#8b3a3a` | Errors, critical elements |
| `musgo` | `text-musgo` | `#4a5d23` | Applications, use cases |

The text-to-graphic color relationship is **1:1 and immutable**.

### Graph Node Colors (for React Flow)

| Node Type | Background | Text | Badge |
|-----------|-----------|------|-------|
| `axioma` | `#1c1917` (dark) | `#f8f6f1` | AXIOMA |
| `lema` | `#4a6070` (blue-gray) | `#ffffff` | LEMA |
| `corolario` | `#b85c38` (terracotta) | `#ffffff` | COROLARIO |
| `teorema` | `#6b9e6b` (green) | `#ffffff` | TEOREMA |
| `definicion` | `#8b7355` (brown) | `#ffffff` | DEFINICION |

## 7. Naming Conventions

- **IDs / slugs:** `snake_case` in lowercase. Example: `teorema_pitagoras`, `axioma-paralelas` (hyphens in file paths, underscores in metadata — check existing convention per content type)
- **File names:** `snake_case.mdx`
- **React components:** `PascalCase.tsx`
- **Diagram imports:** explicit relative paths, e.g. `../../diagrams/LinearAlgebra/MatrixVisualizer`
- **Routes:** `/teorema/:id`, `/definicion/:id`, `/axioma/:id`, `/ejemplo/:id`, `/ejercicio/:id`, `/demo/:id`, `/caso/:id`, `/modelo/:id`, `/plan/:id`, `/bio/:slug`, `/:slug` (lessons), `/rama/:id`

## 8. Universality Rule (Zero Tolerance)

The tone must be purely mathematical and universal. **ELIMINATE** from general content any references to specific curricula ("Selectividad", "EBAU", "Evaluación de acceso", "PAU", "Bachillerato"). Those references are ONLY allowed in `StudyPlans` under `src/content/plans/`.

## 9. Graph and Dependency Network

Every theorem, lemma, corollary, and definition participates in the axiomatic graph (`graph_structure.json`). When creating a theorem, you MUST identify and declare:

- **`requires`**: IDs of definitions or theorems this theorem formally depends on
- **`lemmas`**: IDs of lemmas used in the proof of this theorem
- **`corollaries`**: IDs of corollaries that follow from this theorem
- **`demos`**: IDs of demonstrations (proofs) available for this theorem
- **`parentTheorem`**: If this is a lemma or corollary, the ID of its parent theorem
- **`models`**: If this is an axiom, which mathematical models include it

The topological order of the graph MUST be respected: a theorem cannot require something that depends on it.

## 10. Mathematical Translation Guide (for i18n)

### Criterion Nomenclature (Spanish → English)
- LAL (Lado-Ángulo-Lado) → SAS (Side-Angle-Side)
- ALA (Ángulo-Lado-Ángulo) → ASA (Angle-Side-Angle)
- LLL (Lado-Lado-Lado) → SSS (Side-Side-Side)
- TAL (Teorema del Ángulo-Lado) → AAS (Angle-Angle-Side)

### LaTeX Acronyms
- `\text{sen}` → `\sin`
- `\text{mcd}` → `\gcd`
- `\text{mcm}` → `\text{lcm}` (or `\operatorname{lcm}`)
- `\text{arctg}` → `\arctan`

#### CRITICAL: `\sen` is NOT a valid KaTeX command
**Never use `\sen` in LaTeX math mode (`$...$` or `$$...$$`) — KaTeX will throw an error.**
- In Spanish content: use `\sin` (not `\sen`, not `\text{sen}`) inside math mode
- The translation note `\text{sen} → \sin` above is for **plain text or bilingual documentation only**
- In diagram code (`.tsx`), write `sin` as plain text, never `sen` (e.g. `a/sin(α)` not `a/sen(α)`)
- Correct: `$$\sin(\alpha) = \frac{a}{2R}$$`
- WRONG: `$$\sen(\alpha) = \frac{a}{2R}$$`

### Notation
- Maintain Hilbert's strict convention (with overline `\overline{AB}`) in ALL languages — add an explanatory note in the glossary of non-Spanish versions

## 11. File Structure by Language

```
src/content/
  es/     (Spanish, default)
    axioms/
    theorems/
    definitions/
    lessons/
    demonstrations/
    examples/
    exercises/
    usecases/
    mathematicians/
    models/
    plans/
  en/     (English)
    (same structure, same IDs, translated content)
  eu/     (Basque, future)
    (same structure, same IDs, translated content)
```

## 12. Simulation Export

If a concept has `hasSimulation: true`, the MDX file MUST:
1. Import the simulation component from `../../diagrams/<Category>/<ComponentName>`
2. Export it as `export const Simulation = <ComponentName>`
3. Ensure the simulation component lives in `src/diagrams/` (not in `src/components/`)

## 13. Cross-Reference Integrity (MANDATORY CHECK)

Before finalizing any generated content, verify:

- [ ] All `links` in metadata point to existing content IDs
- [ ] All `targetId` on `<ConceptLink>` point to existing IDs
- [ ] All `parentTheorem`, `relatedTheorem`, `concept` point to real content
- [ ] All `authors`/`mathematicians` exist as biographies
- [ ] All `demos`/`demostraciones` exist as demonstration files
- [ ] All `corollaries`, `examples`, `exercises`, `requires` point to existing IDs
- [ ] All `axiomas` in models point to real axiom IDs

## 14. Quality Checklist (Run Before Completing)

- [ ] No references to "Selectividad", "EBAU", or similar curricula in base content (only in StudyPlans)
- [ ] No standard Markdown internal links `[text](url)` — replaced with `<ConceptLink>` or `<GlossaryLink>`
- [ ] If the concept could have a visual simulation, it has one (`hasSimulation: true` + exported `Simulation`)
- [ ] Diagram colors use the semantic tokens matching the text
- [ ] File name (slug) = `metadata.id` = `targetId` of links pointing to it
- [ ] `<Capitular>` is present at the start
- [ ] `<Separador>` is used between sections (not `---`)
- [ ] Theorem proofs are in their own demo file (not inline `<Demostracion>` in the theorem MDX)
- [ ] The `demos` metadata field links to the demo file
- [ ] The demo file has `parentTheorem` pointing back to the theorem
