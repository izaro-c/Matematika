---
name: matematika-content-generator
description: Use when creating, formalizing, translating, or refactoring MDX content nodes in the Matematika encyclopedia (Castellano, Euskara Batua, English) to ensure strict deductive rigor, correct DAG causality, and trilingual parity.
---

# Generador y Estándar de Contenido — Matematika

Grafo acíclico dirigido (DAG) de nodos atómicos hiperenlazados, con paridad trilingüe estricta (**Castellano · Euskara Batua · Inglés**).

---

## Los Tres Pilares Innegociables

| Pilar | Regla ejecutiva |
|---|---|
| **1. Rigor deductivo** | Lógica de primer orden. Cero pasos informales. Tipado multisort estricto: $\mathcal{P}\cap\mathcal{L}=\emptyset$, $\mathcal{P}\cap\Pi=\emptyset$, $\mathcal{L}\cap\Pi=\emptyset$. Usar incidencia sintética o $\operatorname{tr}(\ell)$, nunca $\ell\subseteq\pi$. |
| **2. Grafo abierto** | Todo concepto matemático → `<ConceptLink targetId="...">`. Los `targetId` son kebab-case en castellano/neutro y **nunca se traducen**. Si la página no existe, el enlace se pone igualmente. |
| **3. Causalidad DAG** | `isDependency={true}` solo en antecedentes sin los cuales el nodo no puede existir. En definiciones: solo conceptos primitivos constitutivos. En axiomas: primitivos de signatura. En demostraciones: axiomas, lemas y método. **Nunca desde un teorema hacia su demostración.** |

→ Detalles y casos borde: [editorial-epistemology.md](./references/editorial-epistemology.md)

---

## Flujo de Trabajo

```
1. Ontología y tipo  →  2. Metadatos y prosa MDX  →  3. Grafo + paridad trilingüe  →  4. Validación
```

**1. Tipo de entidad:** `definicion` · `axioma` · `teorema` · `lema` · `corolario` · `demostracion` · `modelo` · `sistema-axiomatico` · `metodo` · `ejercicio` · `ejemplo` · `caso-de-uso` · `matematico`

**2. Metadatos y redacción:**
- `id` kebab-case universal, `type`, `branch` MSC2020 (e.g. `"51A"`).
- Primera oración: definición o enunciado directo. **Cero muletillas del marco axiomático** (→ ver abajo).
- JSX disponibles: `<Definicion>` `<VisualBind>` `<SeccionPropiedades>` `<Capitular>` `<Nota>` `<Separador>`
- KaTeX conforme ISO 80000-2. **Nunca JSX dentro de `$`.**
- Refs: [metadata-schema.md](./references/metadata-schema.md) · [mdx-components.md](./references/mdx-components.md) · [katex-notation.md](./references/katex-notation.md)

**3. Grafo y paridad:**
- Paridad 1:1 entre `es/` `en/` `eu/`. Mismos `<ConceptLink>`, mismos `isDependency`, mismas fórmulas.
- Teorema declara `demos: ["demo-..."]`; demostración declara `parentTheorem: "teorema-..."`.
- Refs: [dag-and-hyperlinks.md](./references/dag-and-hyperlinks.md) · [euskara-glossary.md](./references/euskara-glossary.md)

**4. Validación** (tras cada lote de 3 nodos / 9 archivos MDX):
```bash
npm run validate-references && npm run validate-graph && npm run typecheck
```

---

## Reglas de Redacción

### Contexto presuposicional — sin muletillas

El marco hilbertiano es global. **Prohibido** comenzar párrafos con:
*«En la geometría sintética...»* / *«En la fundamentación de Hilbert...»* / *«Dentro del sistema axiomático...»*

El segundo párrafo expone la esencia conceptual, la motivación deductiva o la conexión con otros nodos — nunca anuncia el marco.

**Excepción:** Nombrar a Hilbert/geometría sintética es válido cuando se describe ese concepto directamente, se contrasta con otro sistema formal, o el valor histórico es no redundante.

### Estructura libre — adaptar al objeto

No hay plantilla obligatoria. La estructura emerge de la naturaleza del nodo:
- Un axioma simple puede ser solo `<Capitular>` + `<Definicion>`.
- Una definición rica puede añadir `<SeccionPropiedades>` y `<Nota>`.
- Una entrada biográfica es solo prosa con `<ConceptLink>`.

> *¿Qué necesita el lector para entender este objeto y navegar el grafo?* Quita lo que sobre. Añade lo que falte.

### Terminología canónica en euskara

| ❌ Incorrecto | ✅ Canónico |
|---|---|
| `sortutako zuzenak` (rectas soporte) | `zuzen euskarriak` |
| confundir betegarria / osagarria | suplementario → `betegarria`; complementario → `osagarria` |

→ Glosario completo: [euskara-glossary.md](./references/euskara-glossary.md)

---

## Tabla de Tipos de Contenido

| Tipo | `isDependency` | `<SeccionPropiedades>` |
| :--- | :---: | :---: |
| `definicion` | Conceptos primitivos constitutivos | ✅ Permitido |
| `axioma` | Primitivos de signatura | ❌ Prohibido |
| `teorema` / `lema` | Axiomas/teoremas antecedentes | Opcional |
| `demostracion` | Axiomas, lemas y método | — |
| `sistema-axiomatico` | N/A (campo `axiomas`) | ❌ Prohibido |
| `modelo` | Omitir | ✅ Requerido |
| `metodo` / `ejercicio` / `caso-de-uso` | Según aplique | ❌ Prohibido |
| `matematico` | ❌ Prohibido | ❌ Prohibido |

→ Esquema completo: [metadata-schema.md](./references/metadata-schema.md)

---

## Golden Rules (resumen ejecutivo)

1. Nunca JSX dentro de `$` / `$$`.
2. Dominios primitivos disjuntos: nunca $\ell\subseteq\pi$; usar $P\,\mathbf{I}\,\ell$ o $\operatorname{tr}(\ell)$.
3. $\operatorname{tr}$ solo a objetos no puntuales ($\mathcal{L}$, $\Pi$). Las figuras compuestas son subconjuntos de $\mathcal{P}$ por definición.
4. Paralelismo: coplanaridad + reflexividad. Rectas no coplanares = *cruzadas/alabeadas*, no paralelas.
5. Sin `<SeccionPropiedades>` en `axioma`. Sus consecuencias son teoremas.
6. Paridad trilingüe 1:1 en todos los `<ConceptLink isDependency>`.
7. Aciclicidad: ningún nodo depende de sí mismo.
8. Cero definiciones inline de conceptos externos — siempre `<ConceptLink>`.