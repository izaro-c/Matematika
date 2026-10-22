# Convenciones globales del proyecto (vinculantes)

Decisiones fijadas tras la auditoría de octubre de 2026. Prevalecen sobre cualquier uso anterior del contenido. Todo nodo nuevo o reescrito debe cumplirlas en los tres idiomas.

---

## 1. Marco axiomático

Cada sistema es un nodo `sistema-axiomatico` que lista **todos** sus axiomas en `axiomas` y declara en `extends` los sistemas que amplía (`validate-graph` exige que los axiomas del sistema base estén incluidos). Cada modelo declara en `satisfies` los sistemas que cumple y, si se construye dentro de otra teoría (ℝ, ℂ, conjuntos), en `builtIn` el sistema de esa teoría: así el grafo muestra la consistencia relativa sin crear ciclos.

| Sistema | Axiomas | Nodo |
| :--- | :--- | :--- |
| Incidencia | I.1–I.8 | `sistema-incidencia` |
| **Geometría absoluta** | I, II, III **y** V (V.1 Arquímedes, V.2 completitud). **Nunca** IV. | `sistema-absoluto` |
| Euclidiana | absoluta + IV (`axioma-paralelas-euclides`) | `sistema-euclidiano` |
| Hiperbólica | absoluta + IV<sub>hip</sub> (`axioma-paralelas-hiperbolico`) | `sistema-hiperbolico` |
| Números reales *(pendiente)* | cuerpo ordenado completo | `sistema-cuerpo-real` (ya referenciado como `builtIn` de `modelo-cartesiano` y `modelo-poincare`) |

`extends` actual: `sistema-absoluto` → `sistema-incidencia`; `sistema-euclidiano` y `sistema-hiperbolico` → `sistema-absoluto`.

- Si una prueba de geometría absoluta usa V.1 o V.2, se dice explícitamente (p. ej. Saccheri–Legendre usa Arquímedes). Lo que solo usa I–III se presenta como válido «sin axiomas de continuidad».
- Los grupos I.4–I.8 son espaciales. Un modelo plano (tres puntos, Fano, $\mathbb{R}^2$, disco de Poincaré) **solo** modela los axiomas planos (I.1–I.3 y los demás grupos restringidos al plano). Nunca se afirma que un modelo plano satisface un sistema que contiene I.4–I.8.
- Paralelismo **reflexivo**: $\ell \parallel \ell$. En modelos sin paralelas se dice «no existen dos rectas paralelas distintas».
- Consistencia: se prueba con modelos (consistencia relativa). Ni Bolyai ni Lobachevski la demostraron; Beltrami (1868), Klein y Poincaré dieron los modelos.

## 2. Citas de Hilbert

Edición canónica: ***Grundlagen der Geometrie*, 7.ª edición (1930) y posteriores** (numeración estable de Teubner). Locators permitidos:

| Contenido | Locator |
| :--- | :--- |
| Elementos, conceptos primitivos | `Capítulo I, §1` |
| Axiomas I (incidencia) | `Capítulo I, §2` |
| Axiomas II (orden), definición de segmento | `Capítulo I, §3` |
| Consecuencias del orden: semirrecta, semiplano, polígono/triángulo, separación | `Capítulo I, §4` |
| Axiomas III (congruencia), definición de ángulo | `Capítulo I, §5` |
| Consecuencias de la congruencia: isósceles, LAL completo, ALA, suplementarios, opuestos por el vértice, LLL, ángulo recto, perpendicular, bisectriz, ángulo exterior | `Capítulo I, §6` |
| Axioma IV (paralelas) | `Capítulo I, §7` |
| Axiomas V (continuidad) | `Capítulo I, §8` |
| Consistencia e independencia | `Capítulo II` |
| Teoría de la proporción (sin continuidad) | `Capítulo III` |
| Área en el plano (contenido, sin continuidad) | `Capítulo IV` |

**No se citan números de *Satz*.** Se nombra el resultado («primer teorema de congruencia», «congruencia de suplementos»…). Los nodos `definicion` nominales ajenos a Hilbert (grupo, derivada…) no citan los *Grundlagen*.

## 3. Notación (además de `katex-notation.md`)

### Dominios y tipos
- $\mathcal{P}$ = **solo** puntos; $\mathcal{L}$ = rectas; $\Pi$ = planos. Planos: $\pi, \sigma, \pi_1, \pi_2$. **Nunca** se nombra un plano con $\mathcal{P}$ ni con $\alpha$.
- Rectas: $\ell, m, n$; secante/transversal: $t$. Se escribe `\ell`, nunca `l`.
- Conjunto potencia: $\wp(\mathcal{P})$ (`\wp`), nunca $\mathcal{P}(\mathcal{P})$.
- Lenguaje/signatura: $\sigma$ o $\mathcal{L}_\sigma$; nunca $\mathcal{L}$ a secas.
- Contención: $\operatorname{tr}(\ell) \subseteq \operatorname{tr}(\pi)$; diferencia: $\operatorname{tr}(\pi) \setminus \operatorname{tr}(\ell)$; corte: $\operatorname{seg}(AB) \cap \operatorname{tr}(\ell)$. Prohibidos $\ell \subseteq \pi$, $\pi \setminus \ell$, $X \cap \ell$, $P \in \ell$, $P \notin \ell$ (usar $P \,\mathbf{I}\, \ell$, $\neg(P \,\mathbf{I}\, \ell)$ o $P \in \operatorname{tr}(\ell)$).
- Figuras compuestas (segmentos, semirrectas, semiplanos, interiores) son subconjuntos de $\mathcal{P}$ y usan $\in, \subseteq, \cap$ directamente.

### Objetos
- **Ángulo**: par no ordenado de semirrectas $\angle AOB = \{\overrightarrow{OA}, \overrightarrow{OB}\} = \angle(h,k)$; traza $\operatorname{tr}(\angle AOB) = \overrightarrow{OA} \cup \overrightarrow{OB}$. Nunca «$\angle AOB = \overrightarrow{OA}\cup\overrightarrow{OB}$». No existen ángulos llanos ni «convexos/no convexos»: todo ángulo es propio.
- **Triángulo**: $\triangle ABC = \{\overline{AB}, \overline{BC}, \overline{CA}\}$; traza $\operatorname{tr}(\triangle ABC) = \overline{AB}\cup\overline{BC}\cup\overline{CA}$. Nunca «$\triangle ABC = \overline{AB}\cup\dots$».
- **Congruencia de triángulos** $\triangle ABC \cong \triangle A'B'C'$: siempre respecto a la correspondencia ordenada $A\mapsto A'$, $B\mapsto B'$, $C\mapsto C'$ (lados y ángulos homólogos congruentes).
- Semiplano abierto de $\ell$ (en $\pi$) que contiene a $B$: $\mathcal{H}_\ell(B)$. Interior: $\operatorname{Int}(\angle AOB)$, $\operatorname{Int}(\triangle ABC)$.
- Intermediación: **solo** $A * B * C$ (nunca $A\text{-}B\text{-}C$). Colinealidad: $\operatorname{Col}(A,B,C)$.
- Congruencia: **solo** $\cong$ (nunca $\equiv$). Relaciones primitivas en signaturas: $\cong_{\mathrm{seg}}$, $\cong_{\angle}$.
- Orden de segmentos/ángulos (sintético): $\overline{AB} < \overline{CD}$, $\angle\alpha < \angle\beta$ (enlazar `orden-segmentos`, `orden-angulos`).

### Medidas (solo donde exista medida: sistemas con V)
- Longitud: $|AB|$ (enlazar `longitud`). Nunca $|\overline{AB}|$ ni $\overline{AB}^2$.
- Medida angular en grados: $|\alpha|$, $|\angle ABC|$ (enlazar `medida-angular`), con $0^\circ < |\alpha| < 180^\circ$. Suma angular: $|\alpha|+|\beta|+|\gamma| = 180^\circ$. Formulación sintética equivalente: «congruente con la suma de dos ángulos rectos» (enlazar `angulo-recto`).
- **No se usan radianes en nodos geométricos.** El número $\pi$ solo aparece en contextos analíticos (modelos, circunferencia, biografías, área hiperbólica) y en esos nodos ningún plano se llama $\pi$ (usar $\sigma$).
- Ángulo de paralelismo: $\theta(d)$ (nunca $\Pi(d)$).
- Distancia $d(\cdot,\cdot)$: solo en modelos analíticos o espacios métricos, nunca en enunciados sintéticos (usar congruencia, o $|AB|$).
- Área: $\operatorname{A}(R)$ (`\operatorname{A}`), idéntica en los tres idiomas (nunca `\text{Área}`, `\mu`).

### Nomenclatura de axiomas
«Axioma I.1», «Axioma III.5», «Axioma IV», «Axioma V.1» (con punto, números romanos). Nunca «III-5», «IV.1».

## 4. Prohibiciones de vocabulario en nodos sintéticos
- «Curvatura» (nula, negativa…) solo en nodos de modelos analíticos o en notas que contrastan explícitamente con la geometría diferencial; nunca para caracterizar un plano o axioma sintético.
- «Ángulo llano», «medida», «distancia» como si fueran sintéticos.
- Intensificadores vacíos: «rigurosamente», «estrictamente», «de forma necesaria», «unívocamente» (salvo cuando expresan unicidad), «formalmente» de relleno.
- Muletillas de marco al inicio de párrafo (ver SKILL.md).

## 5. IDs canónicos (no crear sinónimos)
| Concepto | ID canónico | IDs a sustituir |
| :--- | :--- | :--- |
| Criterio ALA | `teorema-congruencia-ala` | `criterio-ala` |
| Criterio LAL (teorema completo) | `teorema-congruencia-lal` | `teorema-congruencia-sas`, `criterio-lal` |
| Criterio LLL | `teorema-congruencia-lll` | `criterio-lll` |
| Criterio LAA | `teorema-congruencia-laa` | `criterio-laa` |
| Ángulos alternos internos (teorema) | `teorema-angulos-alternos-internos` | — (el concepto «ángulos alternos internos» es `angulos-alternos-internos`, definición) |
| Geometría hiperbólica / euclidiana | `sistema-hiperbolico` / `sistema-euclidiano` | `geometria-hiperbolica`, `geometria-euclidiana` |
| Ángulo exterior | `teorema-angulo-exterior` | — |
| Equivalencia del área | `teoria-medida-area` | — |
| Propiedad reflexiva de una relación | `relacion-reflexiva` | `reflexividad` |
| Propiedad simétrica de una relación | `relacion-simetrica` | — (`simetria` es la simetría **geométrica** de una figura: isometría que la deja invariante) |
| Propiedad transitiva de una relación | `relacion-transitiva` | `transitividad` |
| Base de un espacio vectorial | `base-espacio-vectorial` | — (`base` es el lado de un triángulo o polígono) |

Antes de inventar un ID, comprueba con `rank-missing-ids.mjs --contexts <id>` si ya se usa y con qué sentido. Un mismo ID nunca nombra dos conceptos: si una palabra tiene dos sentidos (simetría de una relación / de una figura; base de un triángulo / de un espacio vectorial), cada sentido lleva su propio ID. `lint-node.mjs` lee esta tabla y rechaza los IDs de la tercera columna.

`PropiedadItem id` no puede coincidir con el ID de **otro** nodo distinto de lo que la propiedad enuncia; si la propiedad es un resultado con nodo propio, el id es ese nodo; si no, un id nuevo descriptivo.

## 6. Cadena de áreas (sin ciclos)
`teoria-medida-area` (definición: función área sobre regiones poligonales; positiva, invariante por congruencia, aditiva para dos piezas de interiores disjuntos, normalizada por un cuadrado unidad; la existencia y unicidad es un teorema de Hilbert, cap. IV, enlace `teorema-existencia-area` sin dependencia)
→ `teorema-area-aditividad` (aditividad finita para $n$ piezas; prueba por inducción)
→ `teorema-area-rectangulo` (entero → racional → real con Arquímedes y monotonía)
→ `teorema-area-triangulo` (pie de la altura; casos agudo/obtuso)
→ `teorema-tales` (Euclides VI.2 por áreas; nota: Hilbert la funda sin continuidad, cap. III)
→ `semejanza`, `teorema-pitagoras`.

## 7. Enlaces
Todo término matemático con significado propio lleva `<ConceptLink>` la primera vez que aparece en cada sección (enunciado, prosa, `<Definicion>`, cada `<PropiedadItem>`, cada `<ProofStep>`), exista o no la página. Los resultados citados en demostraciones (lemas, teoremas, axiomas) siempre se enlazan con `isDependency={true}`.
