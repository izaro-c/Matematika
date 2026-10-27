<!-- 2026-10-27 · opus/high · $4.51 · 58 turnos · corregido 5739ff11 · propuestas b390dbc0 -->

## asociatividad — rigor △ · simpleza △ · modularidad △ · enlaces ✗ · paridad △ · diagrama falta

### Correcciones
- [simpleza] es/en/eu: «es una propiedad algebraica fundamental que puede poseer» → «es una propiedad algebraica que puede poseer» (en «a fundamental algebraic property» → «an algebraic property»; eu «oinarrizko propietate aljebraiko» → «propietate aljebraiko») — check-style: es un adjetivo de relleno valorativo.
- [rigor] es/en/eu: «La presencia o ausencia de asociatividad determina las clases esenciales de estructuras algebraicas» → «Muchas operaciones habituales son asociativas y otras no; la asociatividad forma parte de la definición de varias estructuras algebraicas» — la frase exageraba (los anillos o las álgebras de Lie no se clasifican así) y llevaba el relleno «esenciales» / «funtsezko».
- [rigor] es/en/eu: «composición de funciones sobre cualquier conjunto» → «composición de funciones de un conjunto en sí mismo» — la composición solo es una operación binaria sobre un conjunto si las funciones van de ese conjunto en sí mismo.
- [rigor] es/en/eu: «independiente del orden en que se apliquen los paréntesis de evaluación» → «toma el mismo valor con cualquier colocación de los paréntesis que conserve el orden de los factores» — la palabra «orden» confundía la asociatividad con la conmutatividad. En eu, «ordenarekiko independentea» pasa a «parentesiak nola kokatzen diren gorabehera, faktoreen ordena aldatzen ez bada».
- [rigor] es/en/eu: «En cualquier estructura asociativa con elemento neutro $e$ … ambos coinciden necesariamente» → «Si $*$ es asociativa y tiene elemento neutro $e$ … ambos coinciden. En particular, el inverso de $a$, si existe, es único.» — el título prometía unicidad y el texto no llegaba a concluirla. Además, «estructura asociativa» no estaba definido y «necesariamente» / «nahitaez» es un intensificador prohibido.
- [enlaces] es/en/eu: «La suma y el producto», «la división» sin enlace → `<ConceptLink targetId="adicion">`, `<ConceptLink targetId="multiplicacion">`, `<ConceptLink targetId="division">` — Pilar 2; son IDs que ya se usan en `grupo`, `cuerpo` y `numero-racional`.
- [enlaces] es/en/eu: en cada `<PropiedadItem>` se enlaza la primera mención de «operación binaria», «elemento neutro» e «inverso» — convenciones §7.
- [paridad] en: `locator: "Capítulo I, §1"`, `"Capítulo 1"` → `"Chapter I, §1"`, `"Chapter 1"`; eu → `"I. kapitulua, §1"`, `"1. kapitulua"` — así se localizan los locators en el resto del corpus (`grupo`).
- [paridad] eu: description «eragigaien elkartze-ordenak» → «eragigaien elkarketak» — `es` dice «agrupamiento», no «orden».

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «en virtud de la cual la evaluación sucesiva de tres o más operandos resulta invariante frente a la disposición de los paréntesis de agrupamiento. Constituye la condición indispensable para prescindir de paréntesis…» → «según la cual, al operar tres elementos en un orden dado, el resultado no depende de cómo se agrupen. Gracias a ella, en el álgebra abstracta los productos de varios factores se escriben sin paréntesis.» — la versión anterior era jerga. Además, el caso de «tres o más» es el teorema de asociatividad generalizada, no la definición. Con este cambio desaparece también «ezinbesteko».
- [modularidad] es/en/eu: «Un par $(S, *)$ … constituye un semigrupo» sale del `<Definicion>` y pasa a la viñeta de jerarquía: «Un conjunto con una operación binaria asociativa es un semigrupo; un semigrupo con elemento neutro, un monoide; y un monoide en el que cada elemento admite inverso, un grupo». Así el bloque formal solo define la asociatividad. Alternativa descartada: crear el nodo `semigrupo` en esta revisión.
- [enlaces] es/en/eu: «la multiplicación de matrices», «La resta», «el producto vectorial» → IDs canónicos nuevos `multiplicacion-matrices`, `sustraccion` y `producto-vectorial`. No había ningún uso previo en el corpus.
- [simpleza] es/en/eu: «análogamente, la división … o el producto vectorial … carecen de asociatividad» → «tampoco lo son la división … ni el producto vectorial …».
- [diagrama] nuevo `content/diagrams/Definiciones/AsociatividadTabla.tsx`, importado en los tres MDX con `hasSimulation: true`. Va acompañado de un párrafo con `<VisualBind element="agrupacionIzquierda" color="mora">$(a * b) * c$</VisualBind>` y `<VisualBind element="agrupacionDerecha" color="pavo">$a * (b * c)$</VisualBind>`. El párrafo incluye un contraejemplo comprobado a mano: si $0 * 1 = 2$, entonces $(1 * 0) * 1 = 1$ y $1 * (0 * 1) = 2$.

### Pendiente para la autora
- [fuentes] es/en/eu: `{ title: "A Survey of Modern Algebra", … locator: "Capítulo 1" }` y `{ title: "Algebra", author: "Serge Lang", locator: "Capítulo I, §1" }`. Desde el repositorio no puedo comprobar que esos capítulos traten la asociatividad. Lang I §1 («Monoids») es plausible; el capítulo 1 de Birkhoff–Mac Lane no lo he verificado.
- [diagrama] El renderizado no está revisado a ojo, porque no puedo abrir la página. Conviene mirar dos cosas: si las etiquetas `lecturaIzquierda` / `lecturaDerecha` (ancladas en x = 2,4) quedan centradas, y si los círculos mora y pavo se distinguen cuando caen en la misma casilla.

### Avisos de los scripts
- check-links «multiplicación» / «multiplication» / «biderketa» (es/en/eu): corregido (enlace a `multiplicacion`; la multiplicación de matrices enlaza a `multiplicacion-matrices`).
- check-links «addition» / «batuketa» (en/eu): corregido (enlace a `adicion`).
- check-links «estructura» / «structure» / «egitura» (es/en/eu): descartado. Se usa en sentido algebraico, no como `estructura-geometrica`. La primera mención ya enlaza a `estructura-algebraica` y la que queda en eu es el título de la sección.
- check-links «right» (en): descartado. Es «right inverse», no un ángulo recto.
- check-links «ordenarekiko», «oinarrizko» (eu): resueltos al reescribir esas frases.
- check-links «espazioan» (eu): descartado. Se refiere a $\mathbb{R}^3$ como lugar del producto vectorial, no a `espacio` geométrico.
- check-links «laukia» (eu, aparece después de los cambios): descartado. Significa «casilla de la tabla», el mismo uso que en `OperacionBinariaTabla`, y no `cuadrilatero`.
- check-style «fundamental», «esenciales» (es), «fundamental» (en), «ezinbesteko», «funtsezko» (eu): corregidos. Los tres primeros y «funtsezko» en el nivel 1; «ezinbesteko» al simplificar el primer párrafo en el nivel 2.

### Diagrama
La página lo necesitaba. La asociatividad es una condición sobre todas las ternas de una tabla y, a diferencia de la conmutatividad, no se ve como una simetría. Manipular la tabla enseña dónde y por qué falla. Para no crear un diagrama paralelo, el nuevo diagrama extiende el de `operacion-binaria`:
- **Tabla:** es una tabla 3×3 de $S=\{0,1,2\}$ con casillas que cambian de valor al pulsarlas. Empieza con $\max$, que es asociativa.
- **Terna:** tres tiradores `on-points` fijan $a$, $b$ y $c$.
- **Casillas leídas:** dos círculos mora marcan las casillas de $a*b$ y de $(a*b)*c$; dos círculos pavo, las de $b*c$ y de $a*(b*c)$.
- **Lectura:** dos rótulos muestran el cálculo de las dos agrupaciones.
- **Estado:** un panel comprueba las 27 ternas e indica si la operación es asociativa (musgo) o no (granada).

La terna inicial es $(1,0,1)$, así que basta pulsar una vez la casilla $0*1$ para ver el contraejemplo del texto. `verify-diagram` da visual-exact, con destinos únicos y traducciones eu/en completas.

### Resumen
He corregido imprecisiones (la composición, la colocación de los paréntesis, la unicidad del inverso), el relleno y los enlaces que faltaban. Como propuesta he simplificado la entrada y he añadido el diagrama de tabla editable que comprueba la asociatividad. Quedan por verificar los locators de las fuentes y el aspecto visual del diagrama.

══ TODO OK · 1 nodo(s): asociatividad
VEREDICTO: errores
