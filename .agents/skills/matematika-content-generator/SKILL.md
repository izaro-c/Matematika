---
name: matematika-content-generator
description: Use whenever creating, writing, formalizing, translating, reviewing or refactoring MDX content nodes (definiciones, axiomas, teoremas, demostraciones, matemáticos…) in the Matematika encyclopedia under content/mdx (Castellano, Euskara Batua, English), and whenever the user wants to fill gaps in the knowledge graph — "rellenar huecos", "páginas en construcción", "enlaces rotos", "IDs que faltan", "qué nodo escribo ahora", "hutsuneak bete". Ensures strict deductive rigor, correct DAG causality and trilingual parity. Use it even if the user only names a concept ("escribe colinealidad", "traduce lado al euskera") without saying "nodo" or "MDX".
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
→ **Decisiones vinculantes del proyecto** (marco axiomático, notación, citas, IDs canónicos, cadena de áreas): [convenciones-proyecto.md](./references/convenciones-proyecto.md)

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
- Paridad 1:1 entre `es/` `en/` `eu/`. Mismos `<ConceptLink>`, mismos `isDependency`, mismas fórmulas. Redacta primero `es` completo y deriva `en`/`eu` de él frase a frase: traducir libremente cada idioma por separado es lo que hace divergir los enlaces.
- Teorema declara `demos: ["demo-..."]`; demostración declara `parentTheorem: "teorema-..."`.
- Refs: [dag-and-hyperlinks.md](./references/dag-and-hyperlinks.md) · [euskara-glossary.md](./references/euskara-glossary.md)

**4. Validación** (tras cada lote de 3 nodos / 9 archivos MDX), desde la raíz del repo:
```bash
node .claude/skills/matematika-content-generator/scripts/check-parity.mjs <id> [<id>...]
npm run validate-references && npm run validate-graph && npm run typecheck
```
`check-parity.mjs` compara los tres idiomas: metadatos no traducibles (`id`, `lang`, `type`, `branch`, `demos`, `parentTheorem`), conjunto de `targetId`, `isDependency`, `PropiedadItem`, secuencia de componentes y número de fórmulas. Diferencias en metadatos, enlaces o dependencias son errores a corregir; una diferencia de ±1 fórmula inline puede ser legítima (una traducción que fusiona dos símbolos), revísala y decide.

En `validate-graph`, la línea `[INFO] Ciclo roto forzosamente` significa que has creado un ciclo: no es informativa, corrígela (casi siempre es un `isDependency` de teorema → su demostración).

---

## Modo «Rellenar huecos»

Cuando el usuario pida rellenar huecos, reducir páginas «En construcción» o decidir qué escribir a continuación:

1. **Ranking.** Desde la raíz del repo:
   ```bash
   node .claude/skills/matematika-content-generator/scripts/rank-missing-ids.mjs --top 20
   ```
   Ordena los `targetId` sin nodo por `score = 2·(nodos que lo enlazan) + (enlaces con isDependency)`. Pesa más lo que otros nodos necesitan como antecedente, porque un hueco ahí rompe la cadena deductiva, no solo la navegación. Muestra la tabla al usuario y propón los 3 primeros como lote; si el usuario ya nombró IDs, úsalos.
2. **Inferir el significado desde los enlaces.** El ID lo inventó quien escribió el enlace, así que el nodo debe servir a esos usos:
   ```bash
   node .claude/skills/matematika-content-generator/scripts/rank-missing-ids.mjs --contexts <id>
   ```
   Si los contextos muestran que un mismo ID se usa para conceptos distintos (p. ej. `lado` de triángulo y de ángulo), no lo resuelvas en silencio: elige el sentido común a la mayoría, escribe el nodo para ese sentido y lista al usuario los enlaces que habría que redirigir.
3. **Elegir tipo y ubicación.** Carpeta según tipo (`definitions/`, `axioms/`, `theorems/`, `demonstrations/`, `mathematicians/`…), el nombre de archivo es exactamente el `id`. Conceptos meta (`teorema`, `axioma`, `conjunto`) son `definicion` con `subtype: "nominal"`; obras como `elementos-euclides` no tienen tipo de nodo propio, consúltalo antes de inventar uno.
4. **Antecedentes primero.** Si el nodo nuevo depende (`isDependency`) de otro ID que también falta, escribe primero el antecedente o díselo al usuario; un nodo cuyas dependencias no existen queda colgando en el DAG.
5. **Escribir los tres idiomas** siguiendo el flujo de arriba (es → en → eu) y validar el lote. Al terminar, vuelve a ejecutar el ranking y reporta cuántos enlaces rotos se han resuelto.
6. **Registro.** Añade los nodos nuevos a la sección 2 («En Espera de Revisión») de `docs/progreso-reescritura.md` y actualiza los contadores del resumen; solo el usuario los pasa a aprobados.

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
3. **Diagramas interactivos y vinculación con MDX:** Cuando un nodo geométrico requiera o posea diagrama interactivo, delegar su creación o refactorización a la skill especializada **`matematika-diagram-generator`**. Mantener rigurosamente atados los identificadores de `<VisualBind element="..." color="...">` con los `id`/`targetId` del diagrama en los tres idiomas. En diagramas por pasos (`steps`), no ocultar la figura base: mantener siempre visible la estructura completa en `visibleTargets` y dirigir el foco mediante resaltes de énfasis (`objectStates: { id: { emphasis: 'primary' } }`).
4. **Hiperenlaces conceptuales exhaustivos:** Todo concepto matemático formal, relacional o abstracto (e.g. `biyeccion`, `simetria`, `reflexividad`, `teorema`) debe tener `<ConceptLink targetId="...">`, exista o no el archivo en el repositorio.
5. **Causalidad DAG:** `parentTheorem` NUNCA lleva `isDependency={true}` en su propia demostración (es el consecuente demostrado, no un antecedente lógico).
6. **Dominios primitivos disjuntos:** Nunca $\ell\subseteq\pi$; usar $P\,\mathbf{I}\,\ell$ o $\operatorname{tr}(\ell)$.
7. **Traza puntual:** $\operatorname{tr}$ solo a objetos no puntuales ($\mathcal{L}$, $\Pi$). Las figuras compuestas son subconjuntos de $\mathcal{P}$ por definición.
8. **Paralelismo:** Coplanaridad + reflexividad. Rectas no coplanares = *cruzadas/alabeadas*, no paralelas.
9. **Sin `<SeccionPropiedades>` en `axioma`:** Sus consecuencias son teoremas.
10. **Paridad trilingüe 1:1:** Idénticos `<ConceptLink isDependency>`, componentes y fórmulas en `es`, `eu` y `en`.
11. **Aciclicidad:** Ningún nodo depende de sí mismo ni crea ciclos causales.
12. **Cero definiciones inline de conceptos externos:** Siempre delegar a `<ConceptLink>`.
13. **Citas de Hilbert:** edición canónica *Grundlagen der Geometrie* 7.ª ed. (1930) y posteriores; locators por capítulo y § según [convenciones-proyecto.md](./references/convenciones-proyecto.md). **No citar números de *Satz*:** nombrar el resultado.
14. **Fundamentación de semirrectas opuestas:** Explicitar siempre la relación de intermediación ($A * O * A'$, $B * O * B'$) mediante `<ConceptLink targetId="estar-entre" isDependency={true}>` (Axiomas de Orden, Grupo II).
15. **Definición sintética de ángulos suplementarios:** Se definen por incidencia y orden (comparten un lado y los otros dos son semirrectas opuestas de una misma recta), nunca mediante medida métrica angular ($180^\circ$).
16. **Metadatos obligatorios de idioma:** Todo archivo MDX debe incluir explícitamente `lang: "es" | "eu" | "en"` en su objeto `metadata`.