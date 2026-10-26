<!-- 2026-10-26 · opus/high · $1.52 · 48 turnos · corregido 5d2f7d2e · propuestas 071a5759 -->

## operacion-binaria — rigor ✗ · simpleza △ · modularidad △ · enlaces ✗ · paridad ✗ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: «formaliza la clausura o cierre algebraico» / «formalizes the closure property or algebraic closure» / «itxitura-propietatea edo itxidura aljebraikoa formalizatzen du» → «expresa la propiedad de clausura» / «expresses the closure property» / «itxitura-propietatea adierazten du». La clausura algebraica es otra cosa: es la extensión algebraicamente cerrada de un cuerpo. Llamar así a la clausura de una operación es falso.
- [rigor] es/en/eu: quitada la `<PropiedadItem id="unicidad-resultado-operacion">` «si $a = a'$ y $b = b'$, entonces $a * b = a' * b'$». Es la sustitución de iguales, que vale para cualquier función, y la unicidad ya figura en la definición. Es una propiedad de relleno (Golden Rule 17).
- [rigor] es/en/eu: «es una función $$…$$» → «es una función del <ConceptLink targetId="producto-cartesiano" isDependency={true}>producto cartesiano</ConceptLink> $S \times S$ en $S$ $$…$$». El dominio $S \times S$ es parte de la definición y faltaba esa dependencia (Pilar 3). En eu, la oración de la `<Definicion>` se ha reordenado para meter el producto («…$S \times S$ biderkadura kartesiarretik $S$ multzora doan funtzio bat da»).
- [enlaces] es/en/eu: la primera mención de «par ordenado» / «ordered pair» / «bikote ordenatu» no tenía enlace → `<ConceptLink targetId="par-ordenado">`, sin dependencia: la dependencia constitutiva ya la lleva `producto-cartesiano` (Pilar 2).
- [enlaces] es/en/eu: «codominio» / «codomain» / «kodomeinutzat» sin enlace → `<ConceptLink targetId="codominio">`. Es el `WARN` de los scripts y queda confirmado.
- [simpleza] es/en: «### Propiedades estructurales fundamentales» / «### Fundamental structural properties» → «### Propiedades de una operación binaria» / «### Properties of a binary operation». Es el `WARN` de relleno valorativo. En eu, «Oinarrizko egitura-propietateak» → «Eragiketa bitar baten propietateak», por paridad.
- [paridad] eu: «Emaitza $S$ multzoari berari egoteak» → «Emaitza $S$ multzoan bertan egoteak». *Egon* rige inesivo y no dativo, así que la frase original no era gramatical.

### Propuestas aplicadas — revisar
- [simpleza/enlaces] es/en/eu: «Constituye el bloque de construcción primordial del álgebra abstracta, permitiendo articular estructuras como los semigrupos, …» → «Las <ConceptLink targetId="estructura-algebraica">estructuras algebraicas</ConceptLink> del álgebra abstracta, como los semigrupos, los monoides, los grupos y los cuerpos, se definen como conjuntos dotados de una o varias operaciones binarias.» Quita el adjetivo valorativo «primordial» y enlaza «estructuras» con el ID que ya usan `asociatividad`, `grupo` y `cuerpo`. En eu: «Aljebra abstraktuko egitura aljebraikoak, hala nola …, eragiketa bitar bat edo gehiago dituzten multzo gisa definitzen dira.»
- [simpleza] es/en/eu: «La pertenencia del resultado al propio conjunto $S$ expresa la propiedad de clausura: $$…$$ Bajo esta formulación funcional, la clausura queda intrínsecamente asegurada al fijar $S$ como el codominio de la aplicación.» → «Como el codominio de la función es el propio $S$, la operación es cerrada en $S$: $$…$$». Las dos frases decían lo mismo, y «intrínsecamente» era un intensificador vacío.
- [modularidad] es/en/eu: la lista de cuatro viñetas definía con fórmula la asociatividad, la conmutatividad, el elemento neutro y el elemento inverso («El agrupamiento no altera el resultado: $\forall a, b, c \in S, \ (a * b) * c = a * (b * c)$», etc.). Se sustituye por «Una operación binaria $*$ sobre $S$ puede ser asociativa o conmutativa, y puede tener elemento neutro y elementos inversos respecto de ese neutro. Según cuáles cumpla, el par $(S, *)$ es un semigrupo (asociativa), un monoide (asociativa y con neutro) o un grupo (asociativa, con neutro y con inverso para cada elemento).» Esos conceptos tienen su propio nodo y la regla 12 prohíbe definirlos aquí. Alternativa descartada: mantener la lista como resumen rápido, que duplica a `asociatividad`, `elemento-neutro` y `elemento-inverso`.
- [rigor/modularidad] es/en/eu: «Un subconjunto no vacío $T \subseteq S$ es estable o cerrado bajo $*$ si y solo si la restricción de la operación a $T \times T$ toma valores en $T$, definiendo…» → «Si un subconjunto no vacío $T \subseteq S$ es <ConceptLink targetId="subconjunto-estable">estable</ConceptLink> bajo $*$ ($a * b \in T$ para todo $a, b \in T$), la restricción de $*$ a $T \times T$ es una operación binaria $*\|_T\colon T \times T \longrightarrow T$ sobre $T$, la operación inducida.» El «si y solo si» original era la propia definición de subconjunto estable disfrazada de propiedad. El título pasa a ser «Operación inducida en un subconjunto estable». `subconjunto-estable` es un ID canónico nuevo que no estaba en uso; se mantiene el id `clausura-inducida`.

### Pendiente para la autora
- [fuentes] es/en/eu: `{ title: "A Survey of Modern Algebra", …, locator: "Capítulo 1" }`. No he podido confirmar desde el repositorio que el capítulo 1 de Birkhoff–Mac Lane trate las leyes de composición. Ese capítulo se dedica a los enteros, y las operaciones binarias en general podrían estar en otro capítulo. El mismo locator aparece en `asociatividad`, `elemento-neutro` y `elemento-inverso`.
- [fuentes] en/eu: el locator «Capítulo I, §1» está en castellano en los tres idiomas, mientras que `grupo` (eu) usa «I. kapitulua, §2». No lo he unificado porque no conozco la convención que prefieres.

### Avisos de los scripts
- check-links «estructuras»/«structures»/«egitura» → `estructura-geometrica` (es/en/eu): descartado por ser el sentido equivocado. Ahora se enlaza a `estructura-algebraica` (en las propuestas).
- check-links «composición»/«composition» → `composicion-funciones` (es/en): descartado. Es «ley de composición interna», un sinónimo del propio concepto y no la composición de funciones.
- check-links «codominio»/«codomain» → `codominio` (es/en): corregido.
- check-links «oinarrizko» → `concepto-primitivo` (eu): descartado. Aquí significa «básico» y no «primitivo»; una aparición ya ha desaparecido con las propuestas.
- check-style «fundamentales» (es) / «fundamental» (en): corregido.

### Diagrama
No necesita, aunque es una decisión discutible. Probé a imaginar dos manipulaciones:
1. **Un diagrama sagital de $S \times S$ en $S$ con $S = \{a, b\}$:** cuatro pares con flechas arrastrables y un elemento $c \notin S$ fuera del círculo. Romper la totalidad y la unicidad repite lo que ya enseña `FuncionSagital.tsx`. La única condición nueva es la clausura, y la definición la hace imposible de romper, porque el codominio es $S$. Llevar una flecha a $c$ solo enseña que una función $S \times S \to U$ con $U \supsetneq S$ no es una operación sobre $S$, y eso se ve en una frase.
2. **Una tabla de Cayley editable:** aquí la manipulación sí enseña algo (conmutatividad como tabla simétrica, neutro como fila que copia la cabecera, comprobación de la asociatividad). Pero lo que enseña son las propiedades, y esas viven en `conmutatividad`, `elemento-neutro` y `grupo`.

Recomiendo esa tabla para uno de esos nodos. Si prefieres el sagital del punto 1 en esta página, bastaría con adaptar `FuncionSagital.tsx`.

### Resumen
He quitado el término erróneo «cierre algebraico» y la propiedad tautológica de unicidad. También he añadido la dependencia `producto-cartesiano` y los enlaces a `par-ordenado` y `codominio`, y he corregido la gramática en eu. En las propuestas, las propiedades de la operación quedan enlazadas en vez de definidas aquí, la clausura se dice en una sola frase y la operación inducida en un subconjunto estable pasa a ser una implicación. Queda por verificar el locator de Birkhoff–Mac Lane.

══ TODO OK · 1 nodo(s): operacion-binaria
VEREDICTO: errores
