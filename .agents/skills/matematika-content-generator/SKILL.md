---
name: matematika-content-generator
description: Use whenever creating, writing, formalizing, translating, reviewing or refactoring MDX content nodes (definiciones, axiomas, teoremas, demostraciones, matemáticos…) in the Matematika encyclopedia under content/mdx (Castellano, Euskara Batua, English), and whenever the user wants to fill gaps in the knowledge graph — "rellenar huecos", "páginas en construcción", "enlaces rotos", "IDs que faltan", "qué nodo escribo ahora", "hutsuneak bete", and when opening a new theoretical framework or axiomatic system ("nuevo marco teórico", "sistema de los reales", "axiomas de Peano"). Ensures strict deductive rigor, correct DAG causality and trilingual parity. Use it even if the user only names a concept ("escribe colinealidad", "traduce lado al euskera") without saying "nodo" or "MDX".
---

# Generador y Estándar de Contenido — Matematika

Grafo acíclico dirigido (DAG) de nodos atómicos hiperenlazados, con paridad trilingüe estricta (**Castellano · Euskara Batua · Inglés**).

## Antes de empezar (cualquier agente: Claude, Gemini/Antigravity, Codex)

1. Lee esta página entera y [convenciones-proyecto.md](./references/convenciones-proyecto.md). Las demás referencias, cuando el paso las nombre.
2. Abre **un nodo de referencia del mismo tipo** (tabla de abajo) y copia su estructura, no la inventes.
3. Escribe cada archivo **completo**. Nunca dejes marcadores como `...`, `// resto igual` o `[continúa]`: el archivo se publica tal cual.
4. No inventes fuentes, ediciones ni locators. Si no conoces la página o el § exacto, cita la obra sin locator y avísalo en tu informe.
5. Toca solo los archivos del lote. Si ves un fallo en otro nodo, anótalo en el informe; no lo arregles de paso.
6. Termina siempre con `validate-nodes.mjs` (paso 4) y **pega su línea final** (`══ TODO OK …` o `══ FALLO …`) en el informe. Sin esa línea el trabajo no está terminado.

### Nodos de referencia (aprobados por el usuario)

| Tipo | Imitar | Qué mirar |
| :--- | :--- | :--- |
| `definicion` primitiva | `punto` | sin `isDependency`, prosa corta |
| `definicion` nominal / meta | `signatura`, `dominio` | enlaces sin dependencia |
| `definicion` derivada | `semiplano`, `segmento` | dependencias constitutivas, `<SeccionPropiedades>` |
| `axioma` | `axioma-incidencia-1`, `axioma-congruencia-5` | `<Definicion title="Enunciado formal">`, diagrama, sin propiedades |
| `teorema` + `demostracion` | `teorema-triangulo-isosceles` + `demo-triangulo-isosceles` | `demos` / `parentTheorem`, `<ProofStep diagramStep>` |
| `modelo` | `modelo-fano` | dos `<PropiedadesGrupo>` (satisfacción / estructura) |
| `sistema-axiomatico` | `sistema-incidencia`, `sistema-absoluto` | `axiomas`, `models`, `extends` |
| `matematico` | `pasch` | solo prosa con enlaces |

Las rutas son `content/mdx/es/<carpeta>/<id>.mdx`; la carpeta depende del tipo (paso 3 de «Rellenar huecos»).

### Errores que cometen los agentes (y que `lint-node.mjs` detecta)

| Error | Correcto |
| :--- | :--- |
| `$\in <VisualBind …>\mathcal{H}</VisualBind>$` | `$\in$ <VisualBind …>$\mathcal{H}$</VisualBind>` |
| `<VisualBind element="ladoAB">` sin ese destino en el diagrama | usar la clave real (`targetId ?? id` de un objeto o grupo con `"target": true`) o añadirla al diagrama con la skill de diagramas |
| `targetId="reflection"` en `en/` | `targetId` siempre igual que en `es/` |
| `criterio-lll`, `reflexividad` | IDs canónicos de convenciones-proyecto.md §5 |
| «(Satz 12 de Hilbert)» | nombrar el resultado |
| «En la geometría sintética de Hilbert, …» al abrir párrafo | empezar por el contenido |
| `isDependency` del teorema a su `demo-…` | la demo cuelga del teorema, nunca al revés |
| Un componente inventado (`<Teorema>`, `<Proof>`) | solo los de `MDXComponents` o importados en el archivo |

---

## Los Tres Pilares Innegociables

| Pilar | Regla ejecutiva |
|---|---|
| **1. Rigor deductivo** | Lógica de primer orden. Cero pasos informales. Tipado multisort estricto: $\mathcal{P}\cap\mathcal{L}=\emptyset$, $\mathcal{P}\cap\Pi=\emptyset$, $\mathcal{L}\cap\Pi=\emptyset$. Usar incidencia sintética o $\operatorname{tr}(\ell)$, nunca $\ell\subseteq\pi$. |
| **2. Grafo abierto y dependencias futuras** | Todo concepto matemático → `<ConceptLink targetId="...">`. Los `targetId` son kebab-case en castellano/neutro y **nunca se traducen**. Si la página no existe, el enlace se pone igualmente. **Obligatorio añadir tanto los enlaces contextuales como las dependencias constitutivas (`isDependency={true}`) aunque las páginas de destino no existan todavía** en el repositorio (generando avisos no bloqueantes de «En construcción»). Jamás omitir una dependencia formal por estar pendiente de redacción. |
| **3. Causalidad DAG** | `isDependency={true}` en antecedentes lógicos y conceptuales constitutivos (axiomas, lemas, teoremas previos, conceptos primitivos y definiciones derivadas sobre las que se formula o demuestra el enunciado). En demostraciones: axiomas, lemas, método y conceptos de prueba. **Nunca desde un teorema hacia su propia demostración ni hacia un consecuente.** |

→ Detalles y casos borde: [editorial-epistemology.md](./references/editorial-epistemology.md)
→ **Decisiones vinculantes del proyecto** (marco axiomático, notación, citas, IDs canónicos, cadena de áreas): [convenciones-proyecto.md](./references/convenciones-proyecto.md)
→ **Varios marcos teóricos, nivel meta y relaciones entre sistemas**: [dag-and-hyperlinks.md §3](./references/dag-and-hyperlinks.md)

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
node .agents/skills/matematika-content-generator/scripts/validate-nodes.mjs <id> [<id>...]
```
Un solo comando que encadena, para esos IDs:
- `lint-node.mjs`: reglas duras por archivo (metadatos, JSX en KaTeX, componentes, DAG, IDs canónicos, `VisualBind` ↔ diagrama).
- `check-parity.mjs`: compara los tres idiomas (metadatos no traducibles, `targetId`, `isDependency`, `PropiedadItem`, secuencia de componentes y número de fórmulas). Una diferencia de ±1 fórmula inline puede ser legítima (una traducción que fusiona dos símbolos): revísala y decide.
- `check-links.mjs` (aviso): conceptos que el texto nombra sin `<ConceptLink>`, con el `targetId` sugerido a partir de los títulos y enlaces del corpus. Comprueba que el ID sugerido es el sentido correcto antes de aplicarlo.
- `check-style.mjs` (aviso): saltos deductivos («obviamente», «es trivial»), relleno valorativo («riguroso», «fundamental»), frases de más de 50 palabras, términos en negrita que ya tienen nodo propio y nodos que parecen contener varios conceptos.
- `verify-diagram.ts` para cada diagrama importado.
- `validate-references`, filtrado a estos nodos. Los enlaces a páginas aún no escritas solo se cuentan: son obligatorios (Pilar 2), no un fallo.
- `validate-graph`: ciclos, conflictos axiomáticos e inclusión de `extends`. Una línea `Ciclo roto forzosamente` es un fallo, casi siempre un `isDependency` de teorema → su demostración.

Lint y paridad se ejecutan también en el pre-commit y en CI sobre los nodos modificados (`npm run content:check`), así que un `ERROR` bloquea el commit aunque no hayas lanzado este comando.

Para revisar un lote ya escrito (propio o de otro agente), sigue [review-rubric.md](./references/review-rubric.md): cubre lo que los scripts no ven (corrección del enunciado, pasos justificados, un concepto por nodo, paridad de sentido). En Claude Code, el subagente `content-reviewer` la aplica.

Si además tocaste `.ts`/`.tsx`, añade `--typecheck`. Corrige cada `ERROR`; cada `WARN` es una decisión tuya, justifícala en el informe si lo dejas.

---

## Modo «Rellenar huecos»

Cuando el usuario pida rellenar huecos, reducir páginas «En construcción» o decidir qué escribir a continuación:

1. **Ranking.** Desde la raíz del repo:
   ```bash
   node .agents/skills/matematika-content-generator/scripts/rank-missing-ids.mjs --top 20
   ```
   Ordena los `targetId` sin nodo por `score = 2·(nodos que lo enlazan) + (enlaces con isDependency)`. Pesa más lo que otros nodos necesitan como antecedente, porque un hueco ahí rompe la cadena deductiva, no solo la navegación. Muestra la tabla al usuario y propón los 3 primeros como lote; si el usuario ya nombró IDs, úsalos.
2. **Inferir el significado desde los enlaces.** El ID lo inventó quien escribió el enlace, así que el nodo debe servir a esos usos:
   ```bash
   node .agents/skills/matematika-content-generator/scripts/rank-missing-ids.mjs --contexts <id>
   ```
   Si los contextos muestran que un mismo ID se usa para conceptos distintos (p. ej. `lado` de triángulo y de ángulo), no lo resuelvas en silencio: elige el sentido común a la mayoría, escribe el nodo para ese sentido y lista al usuario los enlaces que habría que redirigir.
3. **Elegir tipo y ubicación.** Carpeta según tipo (`definitions/`, `axioms/`, `theorems/`, `demonstrations/`, `mathematicians/`…), el nombre de archivo es exactamente el `id`. Conceptos meta (`teorema`, `axioma`, `conjunto`) son `definicion` con `subtype: "nominal"`; obras como `elementos-euclides` no tienen tipo de nodo propio, consúltalo antes de inventar uno.
4. **Antecedentes primero.** Si el nodo nuevo depende (`isDependency`) de otro ID que también falta, escribe primero el antecedente o díselo al usuario; un nodo cuyas dependencias no existen queda colgando en el DAG.
5. **Escribir los tres idiomas** siguiendo el flujo de arriba (es → en → eu) y validar el lote. Al terminar, vuelve a ejecutar el ranking y reporta cuántos enlaces rotos se han resuelto.
6. **Registro.** Añade los nodos nuevos a la sección 2 («En Espera de Revisión») de `docs/progreso-reescritura.md` y actualiza los contadores del resumen; solo el usuario los pasa a aprobados.

---

## Modo «Nuevo marco teórico»

Cuando el usuario quiera abrir otro sistema (números reales, aritmética de Peano, grupos, conjuntos…):

1. **Sistema primero.** Crea `content/mdx/<lang>/axiomatic-systems/sistema-<nombre>.mdx` (tipo `sistema-axiomatico`), con `axiomas` (todos, también los heredados), `extends` si amplía otro sistema y `branch` MSC de su rama (p. ej. `"26A"` para ℝ, `"03E"` para conjuntos; comprueba que esté en `src/data/content/msc2020.ts`). Si ya hay modelos que lo citan en `builtIn` (como `sistema-cuerpo-real`), usa exactamente ese ID.
2. **Axiomas.** Un archivo por axioma en `axioms/`, con `axiomSystem` (el sistema donde se postula), `axiomFamily` (grupo, para agruparlo en la interfaz) y `alternativeGroup` cuando dos axiomas son incompatibles entre sí (como IV e IV<sub>hip</sub>).
3. **Signatura y primitivos.** Las nociones primitivas del sistema son `definicion` con `subtype: "primitivo"`; la signatura se enuncia en el `<Definicion title="Estructura formal">` del sistema, como en `sistema-absoluto`.
4. **Puentes, no dependencias.** Otro sistema entra solo por los metadatos `extends` (inclusión de teorías) y `builtIn` (un modelo construido dentro de otra teoría). Nunca pongas `isDependency={true}` de un axioma de geometría a un nodo de ℝ ni al revés (ver [dag-and-hyperlinks.md §3](./references/dag-and-hyperlinks.md)).
5. Valida con `validate-nodes.mjs` el sistema y sus axiomas juntos: la comprobación de `extends` necesita ambos.

---

## Reglas de Redacción

### Contexto presuposicional — sin muletillas

El marco de cada nodo lo fijan sus metadatos (`branch`, `axiomSystem`, sus dependencias) y no se anuncia en la prosa. Hoy casi todo el corpus es geometría de Hilbert, pero un nodo de otro sistema (números reales, conjuntos) sigue la misma regla. **Prohibido** comenzar párrafos con:
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
4. **Hiperenlaces y dependencias hacia páginas futuras:** Todo concepto matemático formal, relacional o abstracto debe tener `<ConceptLink targetId="...">`, exista o no el archivo en el repositorio. Si dicho concepto es un antecedente lógico constitutivo del nodo, **debe llevar obligatoriamente `isDependency={true}` aunque la página no haya sido creada aún**. Jamás omitir `isDependency={true}` por el hecho de que el nodo destino esté en construcción.
5. **Causalidad DAG y Aciclicidad:** `parentTheorem` NUNCA lleva `isDependency={true}` en su propia demostración. No invertir la jerarquía ni crear ciclos ($A \to B \to A$): los conceptos atómicos o componentes (`vertice`, `lado`) no dependen de sus agregados (`poligono`, `triangulo`), sino al revés.
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
17. **Cero propiedades de relleno:** No rellenar artificialmente `<SeccionPropiedades>` con propiedades triviales o simétricas solo para alcanzar un número fijo (como 3). Si una definición solo tiene 1 o 2 propiedades verdaderamente constitutivas y no triviales, se dejan esas; si no tiene ninguna que no sea tautológica o heredada de conceptos más primitivos, se prescinde de la sección.