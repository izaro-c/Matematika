<!-- 2026-10-28 · opus/high · $5.32 · 71 turnos · errores → ok · 4 rondas, converge · corregido b5b62d19 · propuestas 08d319b4 · corregido be68a662 · corregido f033ee50 -->

<!-- ronda 1 · opus/high · $3.16 · 46 turnos · corregido b5b62d19 · propuestas 08d319b4 -->

## elemento-neutro — rigor ✗ · simpleza △ · modularidad ✓ · enlaces △ · paridad △ · diagrama falta

### Correcciones
- [rigor] es/en/eu: «Si únicamente satisface $e_L * a = a$ para todo $a \in S$, se denomina elemento neutro por la izquierda; si satisface $a * e_R = a$ […]» → «Un elemento $e_L \in S$ que satisface $e_L * a = a$ para todo $a \in S$ se denomina elemento neutro por la izquierda; un elemento $e_R \in S$ que satisface $a * e_R = a$ para todo $a \in S$, elemento neutro por la derecha. Así, un elemento es neutro bilateral si y solo si es neutro por la izquierda y por la derecha.» — Con «únicamente», un neutro bilateral no sería neutro por la izquierda. Pero la prueba de unicidad usa justo eso («por ser $e_1$ neutro por la izquierda»). Además, $e_L$ aparecía sin introducirlo. En eu se arregla igual: «Baldin eta $e_L * a = a$ soilik betetzen badu» → «$e_L \in S$ elementu batek $e_L * a = a$ betetzen badu $a \in S$ guztietarako, ezker-neutroa deritzo; […] Beraz, elementu bat alde biko neutroa da baldin eta soilik baldin ezker-neutroa eta eskuin-neutroa bada.»
- [rigor] es/en/eu: «impidiendo la coexistencia de múltiples neutros unilaterales de distinto lado a menos que no exista neutro bilateral» → «El mismo cálculo prueba que, si $*$ tiene un neutro por la izquierda $e_L$ y un neutro por la derecha $e_R$, entonces $e_L = e_L * e_R = e_R$, y ese elemento es neutro bilateral. En cambio, puede haber varios neutros de un mismo lado: si $a * b = b$ para todo $a, b \in S$, todo elemento de $S$ es neutro por la izquierda y, si $S$ tiene más de un elemento, ninguno es neutro por la derecha.» — La salvedad «a menos que no exista neutro bilateral» no tiene sentido: si hay un neutro por cada lado, siempre hay neutro bilateral. Lo que sí es cierto es que puede haber varios neutros del mismo lado, y el ejemplo lo muestra: con $a*e = e \neq a$, ningún elemento es neutro por la derecha. De paso se quita «necesariamente», que es un intensificador prohibido (§4).
- [rigor] es/en/eu: «el elemento neutro bilateral es único» → «hay a lo sumo un elemento neutro bilateral» (en: «there is at most one two-sided identity element»; eu: «alde biko elementu neutro bat gehienez dago»). La prueba demuestra que hay a lo sumo uno, no que exista.
- [rigor] es/en/eu: «deja inalterado a cualquier otro elemento» → «deja inalterado a todo elemento». «Otro» dejaba fuera al propio $e$, que la definición formal sí incluye.
- [simpleza] es/en/eu: «Constituye el pilar de partida para caracterizar estructuras algebraicas centrales como los monoides, los grupos y los anillos.» → «Su existencia forma parte de la definición de monoide, de grupo y de anillo.» Así se resuelven los WARN de check-style («pilar»; «cornerstone», «fundamental»; eu «Oinarrizko abiaburua…»). La frase sigue siendo cierta para los anillos en cualquier convención, porque el neutro aditivo siempre se exige.
- [enlaces] es/en/eu: «Cuando una estructura algebraica posee» sin enlace → `<ConceptLink targetId="estructura-algebraica">`. Es el ID que ya usan `asociatividad` y `numero-natural`, y resuelve el WARN «estructuras algebraicas».
- [terminología] eu: «(edo identitate-elementua)» → «(edo unitate-elementua)». La ZTH da «elementu neutro», sinónimo «unitate elementu», con «elemento identidad» entre sus equivalentes en castellano: https://zthiztegia.elhuyar.eus/terminoa/eu/elementu%20neutro
- [paridad] eu: «elementu nabarmen bat» → «elementu berezi bat». «Nabarmen» significa «notable, llamativo», no «distinguido»: Elhuyar no lo da para «distinguido» (https://hiztegiak.elhuyar.eus/es/distinguido). «Berezi» es lo que ya usa la `description` del nodo. Resuelve el WARN «nabarmen».
- [paridad] en/eu metadata: `locator: "Capítulo I, §1"` / `"Capítulo 1"` → en «Chapter I, §1» / «Chapter 1»; eu «I. kapitulua, §1» / «1. kapitulua». Ahora coinciden con las mismas fuentes en `operacion-binaria`.

### Propuestas aplicadas — revisar
- [diagrama] Nuevo `content/diagrams/Definiciones/ElementoNeutroTabla.tsx`. Es una tabla de Cayley 3×3 sobre $S=\{0,1,2\}$ con casillas pulsables que recorren $0,1,2$, de modo que $*$ siempre es operación binaria.
  - La fila de $e$ se sombrea en `pavo` cuando repite la cabecera ($e * a = a$, neutro por la izquierda). La columna de $e$ se sombrea en `mora` cuando la repite ($a * e = a$, neutro por la derecha).
  - Junto a cada fila, una etiqueta dice si el elemento es neutro por la izquierda, por la derecha, bilateral o ninguno. Un panel superior dice cuál es el neutro o que no hay ninguno; los paneles se excluyen entre sí gracias a la unicidad.
  - La tabla inicial es $a * b = b$, el ejemplo del texto: los tres elementos son neutros por la izquierda y ninguno por la derecha.
  - En los tres MDX: import, `hasSimulation: true`, y `<VisualBind element="filasNeutras" color="pavo">$e_L * a = a$</VisualBind>` y `<VisualBind element="columnasNeutras" color="mora">$a * e_R = a$</VisualBind>`.
  - Alternativa descartada: ampliar `OperacionBinariaTabla`. Esa tabla admite el valor 3 (fuera de $S$) y tiene asas de fila y columna que aquí no aportan nada.

### Pendiente para la autora
- [historia] es/en/eu metadata: `{ title: "A Survey of Modern Algebra", author: "Garrett Birkhoff, Saunders Mac Lane", locator: "Capítulo 1" }`. Desde el repositorio no puedo confirmar que el capítulo 1 (de los enteros) sea el locator adecuado para la definición general de elemento neutro. Lang, *Algebra*, cap. I §1 (Monoids) sí corresponde.
- [diagrama] No he podido ejecutar `check-diagrams-support.ts` ni ver el diagrama en el navegador, porque el entorno no permitía esos comandos. Conviene revisar en escritorio y en móvil que las etiquetas de estado a la derecha de la tabla («2: neutro por la izquierda», 26 caracteres) caben sin cortarse.

### Avisos de los scripts
- check-style «pilar» (es), «cornerstone», «fundamental» (en), «nabarmen» (eu) — corregido.
- check-links «estructuras algebraicas» / «algebraic structures» — corregido.
- check-links «estructura» / «structure» / «egitura» → `estructura-geometrica` — descartado: aparece en «estructura algebraica» (ya enlazada) y en «estructura con identidad», no con el sentido geométrico.
- check-links «lado» / «side» / «sides» / «aldeetako» / «alde» → `lado` — descartado: se trata de «neutro de un mismo lado» y «alde biko» (bilateral), no del lado de un polígono.
- check-links «right» → `angulo-recto` (en) — descartado: es «right identity».
- check-links «oinarrizko» → `concepto-primitivo` (eu) — descartado, y la frase ya no existe.

### Diagrama
Faltaba y la página lo necesita según la rúbrica. Es una definición con condiciones que el lector puede romper una a una (neutro por la izquierda, por la derecha, bilateral). En una tabla de Cayley esas condiciones se ven directamente: la fila o la columna del elemento repite la cabecera. Al cambiar casillas, el lector ve cómo se gana o se pierde cada lado y comprueba que nunca hay dos neutros bilaterales. El diagrama se ha creado en el nivel 2 y `verify-diagram` da visual-exact, destinos únicos y traducciones eu/en completas.

### Resumen
He corregido la definición de neutro por un lado, el «a lo sumo uno» de la unicidad y la frase falsa sobre neutros de distinto lado, y he quitado el relleno valorativo. También he enlazado `estructura-algebraica`, he cambiado el término eu a «unitate-elementua» según la ZTH y he traducido los locators de en y eu. Como propuesta, he creado el diagrama de tabla de Cayley `ElementoNeutroTabla`. Quedan pendientes el locator de Birkhoff–Mac Lane y una revisión visual del diagrama en móvil.

══ TODO OK · 1 nodo(s): elemento-neutro
VEREDICTO: errores

---

# Ronda 2: verificación

<!-- ronda 2 · opus/high · $1.02 · 12 turnos · corregido be68a662 -->

## elemento-neutro — rigor △ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad △ · diagrama ✓

### Correcciones
- [rigor/paridad] es metadata `description`: «al operarse con cualquier otro elemento mediante una operación binaria, lo deja invariante» → «al operarse con cualquier elemento mediante una operación binaria, lo deja invariante». La ronda 1 corrigió este mismo «otro» en el cuerpo, pero no en la descripción. Con «otro», la condición no incluye el caso $e * e = e$ y es más débil que la definición formal. La descripción en `en` («leaves every element unchanged») ya estaba bien, así que también había un problema de paridad.
- [rigor/paridad] eu metadata `description`: «eragiketa bitar baten bidez beste edozein elementurekin eragitean» → «eragiketa bitar baten bidez edozein elementurekin eragitean». Es la misma corrección en euskera.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [historia] es/en/eu metadata: `{ title: "A Survey of Modern Algebra", author: "Garrett Birkhoff, Saunders Mac Lane", locator: "Capítulo 1" }`. Sigue pendiente desde la ronda 1. Desde el repositorio no puedo confirmar que ese capítulo sea el locator correcto para la definición general de elemento neutro.
- [terminología] eu: «identitatedun egitura dela esaten da». Desde la ronda 1 el sinónimo del cuerpo es «unitate-elementua», según la ZTH (https://zthiztegia.elhuyar.eus/terminoa/eu/elementu%20neutro), así que quizá «unitatedun egitura» sería más coherente. Ni Elhuyar ni la ZTH recogen ninguna de las dos locuciones, por lo que no lo he cambiado.
- [diagrama] Sigue pendiente la revisión visual en escritorio y en móvil: hay que comprobar que caben las etiquetas de estado a la derecha de la tabla, como «2: neutro por la izquierda». Yo tampoco he podido abrir el diagrama en el navegador.

### Avisos de los scripts
- check-links «estructura» / «structure» / «egitura» → `estructura-geometrica`: descartado. Las palabras aparecen en «estructura algebraica», que ya está enlazada, y en «estructura con identidad», no en sentido geométrico.
- check-links «lado» / «side» → `lado` (es/en): descartado. Se refiere a «neutros de un mismo lado», no al lado de un polígono.
- check-links «right» → `angulo-recto` (en): descartado. Aparece en «right identity».
- check-links «alde» → `lado` (eu): descartado. Aparece en «alde biko» (bilateral, respaldado por Elhuyar: https://hiztegiak.elhuyar.eus/es/bilateral) y en «alde bereko».

### Diagrama
He comprobado `ElementoNeutroTabla`:
- **Fórmulas:** `neutroK.x` exige que la fila $K$ repita la cabecera ($K * a = a$, neutro por la izquierda) y `neutroK.y` que la repita la columna $K$ ($a * K = a$, neutro por la derecha). Cuadran con la definición.
- **Etiquetas de estado:** hay cuatro por elemento (izquierda, derecha, bilateral, ninguno) y nunca se ven dos a la vez.
- **Paneles:** se excluyen entre sí, porque el neutro bilateral es único.
- **Tabla inicial:** es $a * b = b$, el ejemplo del texto. Con ella los tres elementos son neutros por la izquierda y ninguno por la derecha.
- **Resaltados:** las franjas cubren justo la fila o columna de cada elemento.
- **Enlaces con el texto:** los `VisualBind` `filasNeutras` (pavo) y `columnasNeutras` (mora) coinciden con los grupos del diagrama en los tres idiomas.
- **Etiquetas con fórmula sin KaTeX:** las de los polígonos (por ejemplo «Fila de 0: 0 * a = a») tienen `labelVisible: false`, así que no se ven en pantalla.
- **Traducciones:** eu y en están completas y son fieles.

### Resumen
He quitado «otro» de la descripción en es y eu, que se le había escapado a la ronda 1. El resto de cambios de la ronda 1 están bien aplicados en los tres idiomas. Quedan pendientes el locator de Birkhoff–Mac Lane, «identitatedun» frente a «unitatedun» y la revisión visual del diagrama en móvil.

══ TODO OK · 1 nodo(s): elemento-neutro
VEREDICTO: mejoras

---

# Ronda 3: verificación

<!-- ronda 3 · opus/high · $0.62 · 9 turnos · corregido f033ee50 -->

## elemento-neutro — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad △ · diagrama ✓

### Correcciones
- [paridad] eu: «<Capitular letra="E" />lementu neutroa (edo unitate-elementua)» → «<Capitular letra="E" />\*\*lementu neutroa\*\* (edo unitate-elementua)». En `es` («Un **elemento neutro**») y en `en` («An **identity element**») el término definido va en negrita, pero en `eu` no. Su página hermana `operacion-binaria` en `eu` usa la misma forma con capitular: «<Capitular letra="E" />\*\*ragiketa bitar\*\*».

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [historia] es/en/eu metadata: `{ title: "A Survey of Modern Algebra", author: "Garrett Birkhoff, Saunders Mac Lane", locator: "Capítulo 1" }`. Sigue pendiente desde la ronda 1: no puedo comprobar desde el repositorio que ese capítulo sea el sitio correcto para la definición general de elemento neutro.
- [terminología] eu: «identitatedun egitura dela esaten da». Sigue pendiente desde la ronda 2: con «unitate-elementua» quizá encajaría mejor «unitatedun egitura», pero ninguna fuente recoge ninguna de las dos expresiones.
- [terminología] eu: «ezker-neutroa» / «eskuin-neutroa». La ZTH define solo el neutro bilateral y no da términos para el neutro por un solo lado (https://zthiztegia.elhuyar.eus/terminoa/eu/elementu%20neutro). Como no hay fuente que lo respalde, lo dejo como está. No he podido usar `euskara.mjs` para buscar en Elhuyar porque en esta sesión no se me permitía ejecutar comandos de shell, salvo `checkpoint.sh`.
- [diagrama] Sigue pendiente revisarlo a ojo en escritorio y en móvil: hay que ver si caben las etiquetas de estado a la derecha de la tabla, por ejemplo «2: neutro por la izquierda».

### Avisos de los scripts
- check-links «estructura» / «structure» / «egitura» → `estructura-geometrica`: descartado. Las palabras aparecen en «estructura algebraica», que ya está enlazada, y en «estructura con identidad», no en sentido geométrico.
- check-links «lado» / «side» → `lado` (es/en): descartado. Se refiere a los «neutros de un mismo lado», no al lado de un polígono.
- check-links «right» → `angulo-recto` (en): descartado. Aparece en «right identity».
- check-links «alde» → `lado` (eu): descartado. Aparece en «alde biko» (bilateral) y «alde bereko».

### Diagrama
He vuelto a comprobar `ElementoNeutroTabla` desde cero, y está bien:
- **Fórmulas:** `neutroK.x` comprueba que la fila de $K$ repite la cabecera, es decir, $K * a = a$ para todo $a$ (neutro por la izquierda). `neutroK.y` comprueba lo mismo en la columna de $K$, $a * K = a$ (neutro por la derecha).
- **Etiquetas de estado:** hay cuatro por elemento (izquierda, derecha, bilateral, ninguno) y nunca se ven dos a la vez.
- **Paneles:** se excluyen entre sí, porque el neutro bilateral es único.
- **Tabla inicial:** es $a * b = b$, el ejemplo del texto.
- **Casillas:** cada una solo puede valer $0$, $1$ o $2$, así que $*$ siempre es una operación binaria sobre $S$.
- **Enlaces con el texto:** los `VisualBind` `filasNeutras` (pavo) y `columnasNeutras` (mora) coinciden con los grupos del diagrama en los tres idiomas.
- **Traducciones:** las de `eu` y `en` están completas y son fieles.

### Resumen
He puesto en negrita el término definido tras la capitular en `eu`, igual que en `es` y `en`. Las matemáticas y los cambios de las rondas 1 y 2 están bien en los tres idiomas. Quedan pendientes para la autora el locator de Birkhoff–Mac Lane, la terminología en euskera sin fuente y la revisión visual del diagrama en móvil.

══ TODO OK · 1 nodo(s): elemento-neutro
VEREDICTO: mejoras

---

# Ronda 4: verificación

<!-- ronda 4 · opus/high · $0.52 · 4 turnos · sin cambios -->

## elemento-neutro — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad ✓ · diagrama ✓

### Correcciones
Nada.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [historia] es/en/eu metadata: `{ title: "A Survey of Modern Algebra", author: "Garrett Birkhoff, Saunders Mac Lane", locator: "Capítulo 1" }`. Viene de la ronda 1 y sigue sin resolver: no puedo comprobar desde el repositorio que ese capítulo sea el sitio correcto para la definición general.
- [terminología] eu: hay dos expresiones que ninguna fuente recoge, así que no las he cambiado:
  - «identitatedun egitura dela esaten da»: «unitatedun egitura» quizá encajaría mejor con el sinónimo «unitate-elementua», como se señaló en la ronda 2.
  - «ezker-neutroa» / «eskuin-neutroa»: la ZTH solo recoge el neutro bilateral, como se señaló en la ronda 3.
- [diagrama] Falta comprobar a ojo en escritorio y en móvil que las etiquetas de estado a la derecha de la tabla, como «2: neutro por la izquierda», caben sin cortarse. Tampoco he podido abrir el diagrama en el navegador.
- [diagrama] `ElementoNeutroTabla.tsx`: los rótulos de los grupos (`"Filas que repiten la cabecera"`, `"Columnas que repiten la cabecera"`) no tienen traducción en `en` ni en `eu`; sus `ariaLabels` sí la tienen. `verify-diagram` da las traducciones por completas, y no he comprobado si esos rótulos llegan a mostrarse en pantalla, así que no lo cambio. Si se muestran en algún panel del editor o del visor, conviene traducirlos.

### Avisos de los scripts
- check-links «estructura» / «structure» / «egitura» → `estructura-geometrica`: descartado. Las palabras aparecen en «estructura algebraica», que ya está enlazada, y en «estructura con identidad», no en sentido geométrico.
- check-links «lado» / «side» → `lado` (es/en): descartado. Se refiere a los «neutros de un mismo lado», no al lado de un polígono.
- check-links «right» → `angulo-recto` (en): descartado. Aparece en «right identity».
- check-links «alde» → `lado` (eu): descartado. Aparece en «alde biko» (bilateral) y en «alde bereko».

### Diagrama
He revisado `ElementoNeutroTabla` desde cero y está bien:
- **Fórmulas:** `neutroK.x` comprueba que la fila de $K$ repite la cabecera, es decir, $K * a = a$ (neutro por la izquierda). `neutroK.y` comprueba lo mismo en la columna de $K$, $a * K = a$ (neutro por la derecha). Lo he comprobado para $K = 0, 1, 2$.
- **Franjas resaltadas:** cubren la fila o la columna de cada elemento, incluida su casilla de cabecera.
- **Etiquetas con fórmula sin KaTeX:** las de los polígonos tienen `labelVisible: false`, así que no se ven.
- **Tabla inicial:** es $a * b = b$. Con ella los tres elementos son neutros por la izquierda y ninguno por la derecha, como dice el ejemplo del texto.
- **Paneles de estado:** se excluyen entre sí, porque el neutro bilateral es único.
- **Enlaces con el texto:** `filasNeutras` (pavo) y `columnasNeutras` (mora) coinciden con los `VisualBind` en los tres idiomas.

### Resumen
No he cambiado nada en esta ronda. La definición, la prueba de unicidad, el contraejemplo de varios neutros del mismo lado y la paridad están bien en los tres idiomas, y los cambios de las rondas 1 a 3 están aplicados correctamente. Lo único que queda son decisiones que dependen de fuentes o de una revisión visual, y están en «Pendiente para la autora».

══ TODO OK · 1 nodo(s): elemento-neutro
VEREDICTO: ok
