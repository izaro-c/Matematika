<!-- 2026-10-25 · opus/high · $1.54 · 39 turnos · corregido 8918d7fe · propuestas fd2b95a2 -->

## geometria-hilbertiana — rigor ✗ · simpleza △ · modularidad ✗ · enlaces ✗ · paridad ✗ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: «se modela mediante una estructura matemática de lógica multitipo cuya signatura reúne tres dominios disjuntos dos a dos y cinco relaciones primitivas irreducibles:» → «se modela mediante una estructura matemática de lógica multitipo que satisface el conjunto $\mathcal{T}_{\text{Hil}}$ de los 20 axiomas descritos abajo. La estructura consta de tres dominios disjuntos dos a dos y cinco relaciones primitivas, que interpretan los símbolos de su signatura:» — Tres fallos:
  - Una estructura cualquiera con esta signatura, por ejemplo con todas las relaciones vacías, cumplía la definición sin ser una geometría hilbertiana. Ahora la estructura debe satisfacer los axiomas.
  - Sobraba «irreducibles». $\cong_{\angle}$ se puede definir con $\mathbf{B}$ y $\cong_{\text{seg}}$: $\angle ABC \cong \angle DEF$ si y solo si existen $D'$ en $\overrightarrow{ED}$ y $F'$ en $\overrightarrow{EF}$ con $\overline{ED'} \cong \overline{BA}$, $\overline{EF'} \cong \overline{BC}$ y $\overline{D'F'} \cong \overline{AC}$. Es verdad por LLL en un sentido y por LAL en el otro.
  - Una signatura tiene símbolos, no dominios. La frase nueva lo separa.
  - Además, la fórmula de la propiedad usaba $\mathcal{T}_{\text{Hil}}$ sin haberlo definido; ahora queda definido aquí.
- [rigor] es/en/eu: «entre pares de semirrectas de origen común» → «entre pares de semirrectas no colineales de origen común» — dos semirrectas opuestas tienen origen común y no forman ángulo. Faltaba la condición que sí tienen las ternas.
- [rigor] es/en/eu: «Hilbert prueba la consistencia del sistema y» → «Hilbert prueba la consistencia del sistema relativa a la aritmética y» — Hilbert prueba la consistencia relativa con un modelo aritmético (convenciones §1).
- [enlaces] es/en/eu: «mediante <ConceptLink targetId="teoria-modelos">modelos</ConceptLink>» → `targetId="modelo"` — la palabra se usa en el sentido de «modelo». Es el ID que ya usan `axioma` y `estructura-geometrica`.
- [enlaces] es/en/eu: «sistema axiomático formal» → `<ConceptLink targetId="sistema-axiomatico">` — aviso de check-links confirmado.
- [enlaces] es/en/eu: «son las relaciones binarias de incidencia» → `<ConceptLink targetId="relacion-binaria">relaciones binarias</ConceptLink>` — aviso confirmado. En `en` y `eu` se ha reordenado la frase para poder enlazar el término.
- [enlaces] es/en/eu: «señalado por E. H. Moore en 1902» → `<ConceptLink targetId="moore">E. H. Moore</ConceptLink>` — la rúbrica pide enlazar a los matemáticos citados. El ID ya existe con este sentido en `hilbert.mdx`.
- [enlaces] es/en/eu: «caracteriza los objetos primitivos» → `<ConceptLink targetId="concepto-primitivo">objetos primitivos</ConceptLink>` — es la primera mención en la prosa (convenciones §7).
- [modularidad] es/en/eu: se ha borrado la propiedad «Distinción categorial de la congruencia». Su fórmula `\cong_{\text{seg}} \subseteq \mathcal{P}^2 \times \mathcal{P}^2, \quad \cong_{\angle} \subseteq \mathcal{P}^6` repetía literalmente dos viñetas de la `<Definicion>` (Golden Rule 17). Además enlazaba «congruencia de segmentos» a `segmento` y «congruencia de ángulos» a `angulo`, que tienen otro sentido.
- [paridad/euskara] eu: «segmentuen (puntu-pareen) kongruentzia-erlazioa» → «zuzenkien (puntu-pareen) kongruentzia-erlazioa» — el glosario fija «zuzenkia» para «segmento».
- [euskara] eu: «ordena eta bitartekotasun hirutarreko oinarrizko erlazioa den» → «ordenako eta bitartekotasuneko erlazio hirutarra den» — «hirutarreko» calificaba a «bitartekotasun», no a la relación. Sobraba además el «oinarrizko» que no está en `es`.
- [euskara] eu: «zeinaren signaturak … osatuta dagoen» → frase nueva (ver la primera corrección) — «signaturak» iba en ergativo con un verbo intransitivo.
- [paridad] eu: «planoerdiak definituz» → «planoerdiak definitzea ahalbidetuz» — `es` dice «permitiendo definir». «definituz» atribuía la definición a los propios axiomas.

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «Es el modelo del método axiomático moderno» → «Aplica el método axiomático moderno» (en «It applies…», eu «…modernoa aplikatzen du»). La página usa «modelo» en sentido técnico más abajo, y la frase original era además valorativa. Alternativa descartada: «Es un ejemplo clásico del método axiomático», que conserva el matiz histórico pero sigue valorando.
- [enlaces] es/en/eu: «la geometría ordenada» → `<ConceptLink targetId="geometria-ordenada">`. Es un ID canónico nuevo para el subsistema de los grupos I–II, y su página todavía no existe.
- [historia] es/en/eu: fuente añadida para «señalado por E. H. Moore en 1902»: E. H. Moore, «On the projective axioms of geometry», *Trans. Amer. Math. Soc.* 3 (1902), 142–158. `hilbert.mdx` repite el dato, pero ningún nodo `matematico` tiene `sources` y lo he dejado igual.
- [dependencias] es/en/eu: `isDependency={true}` en `punto`, `recta`, `plano`, `incidencia`, `estar-entre` y `congruencia`, dentro de la `<Definicion>`. El nodo es `definicion` y, según la tabla de tipos, depende de los conceptos sobre los que se formula. No es un concepto del nivel meta como `sistema-axiomatico`. `signatura`, `dominio` y `conjunto-disjunto` siguen sin dependencia porque sí son del nivel meta.

### Pendiente para la autora
Nada. Las dos cuestiones (la fuente de Moore y las dependencias) se han resuelto y están en «Propuestas aplicadas».

### Avisos de los scripts
- check-links «relaciones binarias» (es) — corregido.
- check-links «sistema axiomático» / «axiomatic system» / «sistema axiomatiko» (es/en/eu) — corregido.
- check-links «grupos» / «groups» / «taldeak» (es/en/eu) — descartado: son grupos de axiomas, no grupos algebraicos.
- check-links «alde» (eu) — descartado: forma parte de la locución «alde batera utzi» («dejar de lado»), no es «lado».
- check-links «multzoa» (eu, aparece tras los cambios) — descartado: «conjunto de axiomas» es lenguaje del nivel meta, y el `es` equivalente tampoco lo enlaza ni recibe aviso.

### Diagrama
No necesita. Probé a imaginar dos manipulaciones:
- **Activar y desactivar grupos de axiomas** para ver qué subsistema queda (incidencia, ordenada, absoluta, euclidiana, hiperbólica). Eso ya lo muestra el grafo axiomático de la aplicación y los nodos `sistema-*`.
- **Mostrar los modelos de independencia.** Cada uno es un modelo con página propia.

Nada en una página sobre la signatura y la organización del sistema enseña algo al manipularse que el texto solo afirme.

### Resumen
- **Correcciones:** la definición exige ahora que la estructura satisfaga $\mathcal{T}_{\text{Hil}}$. Se han quitado «irreducibles» y la propiedad que duplicaba la definición, y se han precisado las semirrectas del ángulo y la consistencia relativa. Hay enlaces nuevos a `sistema-axiomatico`, `relacion-binaria`, `moore`, `modelo` y `concepto-primitivo`, y arreglos de terminología y gramática en euskara.
- **Propuestas:** el cambio de «Es el modelo», el enlace `geometria-ordenada`, la fuente de Moore 1902 y las seis dependencias de la definición.
- **Pendiente:** nada.

══ TODO OK · 1 nodo(s): geometria-hilbertiana
VEREDICTO: errores
