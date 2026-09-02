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
| **3. Causalidad DAG** | `isDependency={true}` en antecedentes lógicos y conceptuales constitutivos (axiomas, lemas, teoremas previos, conceptos primitivos y definiciones derivadas sobre las que se formula o demuestra el enunciado). En demostraciones: axiomas, lemas, método y conceptos de prueba. **Nunca desde un teorema hacia su propia demostración.** |

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
| `definicion` | Conceptos primitivos o derivados constitutivos | ✅ Permitido |
| `axioma` | Primitivos de signatura | ❌ Prohibido |
| `teorema` / `lema` | Axiomas, teoremas y conceptos constitutivos (primitivos/derivados) | Opcional |
| `demostracion` | Axiomas, lemas, método y conceptos de inferencia | — |
| `sistema-axiomatico` | N/A (campo `axiomas`) | ❌ Prohibido |
| `modelo` | Omitir | ✅ Requerido |
| `metodo` / `ejercicio` / `caso-de-uso` | Según aplique | ❌ Prohibido |
| `matematico` | ❌ Prohibido | ❌ Prohibido |

→ Esquema completo: [metadata-schema.md](./references/metadata-schema.md)

---

## Golden Rules (resumen ejecutivo)

1. **KaTeX y JSX:** Nunca JSX dentro de `$` ni `$$`. `<VisualBind>` solo puede envolver expresiones KaTeX inline en la prosa (`<VisualBind element="...">$...$</VisualBind>`). Los bloques desplegados `$$ ... $$` son LaTeX puro.
2. **Criterio para `<Nota>`:** Pensar bien cuándo añadirla y cuándo no. La nota debe ser la excepción y no la norma: reservarla para aspectos verdaderamente relevantes e importantes, evitando sobrecorrecciones o justificaciones accesorias.
3. **Diagramas interactivos por pasos (`steps`):** No ocultar la figura base para aislar elementos de un paso. Mantener siempre visible la estructura base completa en `visibleTargets` y dirigir el foco mediante resaltes de énfasis (`objectStates: { id: { emphasis: 'primary' } }`).
4. **Hiperenlaces conceptuales exhaustivos:** Todo concepto matemático formal, relacional o abstracto (e.g. `biyeccion`, `simetria`, `reflexividad`, `teorema`) debe tener `<ConceptLink targetId="...">`, exista o no el archivo en el repositorio.
5. **Causalidad DAG:** `parentTheorem` NUNCA lleva `isDependency={true}` en su propia demostración (es el consecuente demostrado, no un antecedente lógico).
6. **Dominios primitivos disjuntos:** Nunca $\ell\subseteq\pi$; usar $P\,\mathbf{I}\,\ell$ o $\operatorname{tr}(\ell)$.
7. **Traza puntual:** $\operatorname{tr}$ solo a objetos no puntuales ($\mathcal{L}$, $\Pi$). Las figuras compuestas son subconjuntos de $\mathcal{P}$ por definición.
8. **Paralelismo:** Coplanaridad + reflexividad. Rectas no coplanares = *cruzadas/alabeadas*, no paralelas.
9. **Sin `<SeccionPropiedades>` en `axioma`:** Sus consecuencias son teoremas.
10. **Paridad trilingüe 1:1:** Idénticos `<ConceptLink isDependency>`, componentes y fórmulas en `es`, `eu` y `en`.
11. **Aciclicidad:** Ningún nodo depende de sí mismo ni crea ciclos causales.
12. **Cero definiciones inline de conceptos externos:** Siempre delegar a `<ConceptLink>`.
13. **Citas de Hilbert (§5 *Grundlagen*):** Satz 11 (isósceles), Satz 12 (LLL), Satz 13 (congruencia de ángulos suplementarios adyacentes), Satz 14 (ángulos opuestos por el vértice). Citar con estricta exactitud.
14. **Fundamentación de semirrectas opuestas:** Explicitar siempre la relación de intermediación ($A * O * A'$, $B * O * B'$) mediante `<ConceptLink targetId="estar-entre" isDependency={true}>` (Axiomas de Orden, Grupo II).
15. **Definición sintética de ángulos suplementarios:** Se definen por incidencia y orden (comparten un lado y los otros dos son semirrectas opuestas de una misma recta), nunca mediante medida métrica angular ($180^\circ$).
16. **Metadatos obligatorios de idioma:** Todo archivo MDX debe incluir explícitamente `lang: "es" | "eu" | "en"` en su objeto `metadata`.