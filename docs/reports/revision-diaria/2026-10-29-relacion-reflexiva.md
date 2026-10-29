<!-- 2026-10-29 · opus/high · $2.41 · 72 turnos · errores → ok · 4 rondas, converge · corregido 5ce35865 · propuestas 8a9eb910 · corregido 6767142c · propuestas 87332cca · corregido 859a00e4 -->

<!-- ronda 1 · opus/high · $1.02 · 37 turnos · corregido 5ce35865 · propuestas 8a9eb910 -->

## relacion-reflexiva — rigor ✗ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✓ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: «<ConceptLink targetId="relacion-binaria">relación binaria</ConceptLink>» → «<ConceptLink targetId="relacion-binaria" isDependency={true}>relación binaria</ConceptLink>». La reflexividad es una propiedad de las relaciones binarias y no puede enunciarse sin ellas (dag-and-hyperlinks §3). Faltaba esta dependencia. No crea ciclo, porque `relacion-binaria` aún no existe.
- [rigor] es: «En la geometría moderna, toda recta se considera paralela a sí misma por identidad ($\ell \parallel \ell$), lo que permite que el paralelismo en el plano euclídeo satisfaga la reflexividad exigida a toda relación de equivalencia.» → «Toda recta es paralela a sí misma por definición ($\ell \parallel \ell$), sin recurrir al axioma de las paralelas. Así el paralelismo cumple la reflexividad exigida a toda relación de equivalencia; en la geometría euclidiana, donde ese axioma aporta además la transitividad, es una de ellas.» El texto anterior ataba la reflexividad al plano euclídeo. Pero vale por la definición de `paralelas` y sin el Axioma IV, como dice la propia página `paralelas`: «Ambas propiedades valen sin el axioma de las paralelas». Lo que exige el Axioma IV es la transitividad. Mismo cambio en en («Every line is parallel to itself by definition… in Euclidean geometry, where that axiom also provides transitivity, it is one.») y en eu («Zuzen oro bere buruarekiko paraleloa da definizioz… geometria euklidearrean, axioma horrek iragankortasuna ere ematen baitu, baliokidetasun-erlazio bat da.»).
- [simpleza] es/en/eu: «requisito previo indispensable» / «indispensable prerequisite» / «ezinbesteko aldez aurreko baldintza» → sin el adjetivo. También «propiedad indispensable» / «indispensable property» / «ezinbesteko propietate» → «propiedad» / «property» / «propietate». Es el aviso de check-style confirmado: son adjetivos que valoran.
- [enlaces] es/en/eu: se enlaza la primera mención de «geometría hilbertiana» / «Hilbertian geometry» / «Geometria hilbertiarraren» con `geometria-hilbertiana`. En eu, «Hilberten geometriaren» pasa a «Geometria hilbertiarraren», como el título del nodo en eu.
- [enlaces] es/en/eu: se enlazan «segmento», «ángulo», «recta», «axioma de las paralelas» y «geometría euclidiana» con `segmento`, `angulo`, `recta`, `axioma-paralelas-euclides` y `sistema-euclidiano`. Lo exige el Pilar 2, y son avisos de check-links confirmados.

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «Constituye una de las condiciones elementales más recurrentes en la formalización de estructuras matemáticas, actuando como requisito previo para la noción de equivalencia y para las relaciones de orden parcial o total.» → «Es una de las tres condiciones que definen una relación de equivalencia, junto con la simetría y la transitividad, y una de las que definen un orden parcial, junto con la antisimetría y la transitividad.»
  - El párrafo valoraba («más recurrentes») y era impreciso: los órdenes estrictos son irreflexivos.
  - El nuevo dice qué papel cumple la propiedad y enlaza `relacion-equivalencia`, `relacion-simetrica`, `relacion-transitiva`, `orden-parcial` y `relacion-antisimetrica`, sin dependencia. Los dos últimos IDs ya se usan en `subconjunto`.
  - Alternativa descartada: añadir una frase sobre los órdenes estrictos irreflexivos, que habría pedido un ID nuevo (`relacion-irreflexiva`).
- [simpleza] es: «está emparentado o relacionado consigo mismo» → «está relacionado consigo mismo». Así coincide con en y eu, que ya decían solo «related» y «erlazioa badu».
- [rigor] es/en/eu: «todo ángulo propio» / «every proper angle» / «angelu propio oro» → «todo ángulo» / «every angle» / «angelu oro». Según convenciones-proyecto §3, todo ángulo es propio, y «propio» sugería que hay ángulos que no lo son. El nodo `axioma-congruencia-4` dice «todo ángulo».
- [enlaces] es/en/eu: se enlaza «transitividad» / «transitivity» / «iragankortasuna» con `relacion-transitiva` en el punto del paralelismo (convenciones §7: primera mención en cada sección).

### Pendiente para la autora
- [historia] es/en/eu: según la página `axioma-congruencia-1` del proyecto, la reflexividad de los segmentos forma parte del Axioma III.1, y esta página la sigue. En algunas ediciones de los *Grundlagen*, la reflexividad de los segmentos se deduce de III.1 y III.2 en lugar de postularse. No puedo comprobar desde el repositorio qué dice exactamente la 7.ª edición. Lo dejo coherente con `axioma-congruencia-1`.

### Avisos de los scripts
- check-style «ezinbesteko» (eu) — corregido. También se quitó el «indispensable» equivalente en es y en.
- check-links «geometría hilbertiana» (es) / «hilbertian geometry» (en) / «hilberten» (eu) — corregido con `geometria-hilbertiana`, no con `hilbert`.
- check-links «segmentos», «ángulos», «rectas» (es/en/eu) — corregidos en la primera mención en prosa.
- check-links «plano» (es/eu) / «euclidean plane» (en) — corregido: la frase se reescribió como «geometría euclidiana», enlazada con `sistema-euclidiano`.
- check-links «total order» (en) / «osoko» (eu → `numero-entero`) — resueltos: la frase desapareció al reescribir el segundo párrafo. Además, «osoko» significaba «total», no «entero».
- check-links «estructuras matemáticas» / «mathematical structure» / «egitura matematiko» → `estructura-geometrica` — resueltos: la frase desapareció. Además, el ID sugerido tenía otro sentido (estructura geométrica).
- check-links «oinarrizko» → `concepto-primitivo` (eu) — resuelto: la frase desapareció. Además, significaba «elemental», no «primitivo».
- check-links «alde» → `lado` (eu) — resuelto: la frase desapareció. Además, era parte de «aldez aurreko» («previo»).
- check-links «diagonal» (es/en/eu) — descartado: aquí es la diagonal $\Delta_A$ de $A\times A$, no la de un polígono.

### Diagrama
No necesita. Probé a imaginar un diagrama de flechas sobre un conjunto finito en el que el lector activa y desactiva el lazo de cada elemento, y un panel indica qué par $(x,x)$ falta. Pero la reflexividad es una sola condición que se comprueba elemento a elemento, sin interacción entre elementos. El diagrama solo repetiría $\Delta_A \subseteq R$. El lugar natural para ese diagrama es `relacion-equivalencia`, donde se pueden romper una a una tres condiciones que interactúan (reflexividad, simetría y transitividad). Ese nodo tampoco tiene diagrama todavía.

### Resumen
He corregido la página en dos commits:
- **Correcciones:** dependencia de `relacion-binaria`, el punto del paralelismo (su reflexividad vale sin el Axioma IV), los adjetivos valorativos y los enlaces que faltaban.
- **Propuestas:** el segundo párrafo, reescrito para explicar el papel de la reflexividad en la equivalencia y el orden parcial, y dos retoques menores.

Queda pendiente confirmar si en la 7.ª edición de Hilbert la reflexividad de los segmentos se postula en III.1 o se deduce de III.1 y III.2.

══ TODO OK · 1 nodo(s): relacion-reflexiva
VEREDICTO: errores

---

# Ronda 2: verificación

<!-- ronda 2 · opus/high · $0.57 · 18 turnos · corregido 6767142c · propuestas 87332cca -->

## relacion-reflexiva — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✗ · paridad ✓ · diagrama no necesita

He añadido dos enlaces que faltaban en la definición formal; el resto de la página está bien. Hay dos commits: correcciones `6767142c` y propuestas `87332cca`.

### Correcciones
- [enlaces] es/en/eu: «la reflexividad equivale a la inclusión:» → «la reflexividad equivale a la <ConceptLink targetId="subconjunto">inclusión</ConceptLink>:»
  - en: «the inclusion» → «the <ConceptLink targetId="subconjunto">inclusion</ConceptLink>»
  - eu: «inklusio honen baliokidea» → «<ConceptLink targetId="subconjunto">inklusio</ConceptLink> honen baliokidea»
  - Razón: la inclusión es un concepto matemático y la página `subconjunto` ya existe, así que debe ir enlazada (Pilar 2 y convenciones §7).
  - No lleva `isDependency`: la inclusión $\Delta_A \subseteq R$ es una forma equivalente de decir lo mismo, no la definición. Tampoco crea ciclo, porque `subconjunto` enlaza a esta página sin dependencia.

### Propuestas aplicadas — revisar
- [enlaces] es/en/eu: «a la diagonal o relación identidad sobre $A$» → «a la diagonal o <ConceptLink targetId="relacion-identidad">relación identidad</ConceptLink> sobre $A$»
  - en: «identity relation» → «<ConceptLink targetId="relacion-identidad">identity relation</ConceptLink>»
  - eu: «identitate-erlazioa» → «<ConceptLink targetId="relacion-identidad">identitate-erlazioa</ConceptLink>»
  - Razón: es un concepto con nombre propio y no tenía enlace (Pilar 2). El ID es nuevo; antes no se usaba en el corpus. No es `diagonal`, que es la diagonal de un polígono.
  - Alternativa descartada: enlazar «diagonal» con un ID propio como `diagonal-producto`. Habría dos IDs para un mismo objeto, y «relación identidad» es el nombre habitual.

### Pendiente para la autora
- [historia] Sigue abierto lo que dejó la ronda 1: qué dice la 7.ª edición de los *Grundlagen* sobre la reflexividad de los segmentos, es decir, si se postula en el Axioma III.1 o se deduce de III.1 y III.2. La página sigue coherente con `axioma-congruencia-1`.

### Avisos de los scripts
- check-links «diagonal» (es/en/eu) — descartado: aquí es la diagonal $\Delta_A$ de $A\times A$, no la de un polígono, que es lo que nombra `diagonal`. El concepto queda enlazado con `relacion-identidad`, a través de su otro nombre en la misma frase.

### Diagrama
No necesita. Pensé en un diagrama de flechas sobre un conjunto finito donde el lector pone y quita el lazo de cada elemento. Solo repetiría $\Delta_A \subseteq R$: es una sola condición que se mira elemento a elemento, y ningún elemento influye en otro. Donde ese diagrama enseñaría algo es en `relacion-equivalencia`, porque allí se pueden romper una a una tres condiciones que se afectan entre sí.

### Resumen
He enlazado «inclusión» con `subconjunto` (corrección) y «relación identidad» con el nuevo ID `relacion-identidad` (propuesta), en los tres idiomas. Los cambios de la ronda 1 están aplicados y son correctos en es, en y eu. Solo queda pendiente la cita de Hilbert sobre el Axioma III.1.

══ TODO OK · 1 nodo(s): relacion-reflexiva
VEREDICTO: errores

---

# Ronda 3: verificación

<!-- ronda 3 · opus/high · $0.5 · 13 turnos · corregido 859a00e4 -->

## relacion-reflexiva — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✗ · paridad ✓ · diagrama no necesita

### Correcciones
- [enlaces] es: «<Capitular letra="U" />na relación binaria homogénea es **reflexiva** si todo elemento del conjunto sobre el que actúa…» → «<Capitular letra="U" />na <ConceptLink targetId="relacion-binaria">relación binaria</ConceptLink> homogénea es **reflexiva** si todo elemento del <ConceptLink targetId="conjunto">conjunto</ConceptLink> sobre el que actúa…»
  - en: «A homogeneous binary relation … of the set upon which» → «A homogeneous <ConceptLink targetId="relacion-binaria">binary relation</ConceptLink> … of the <ConceptLink targetId="conjunto">set</ConceptLink> upon which»
  - eu: «<Capitular letra="E" />rlazio bitar homogeneo bat … dagoen multzoko elementu» → «<Capitular letra="E" /><ConceptLink targetId="relacion-binaria">rlazio bitar</ConceptLink> homogeneo bat … dagoen <ConceptLink targetId="conjunto">multzoko</ConceptLink> elementu». Sigue el patrón de enlace que separa la letra capitular, ya usado en `axioma-completitud` y `dominio` en eu.
  - Razón: la página nombra estos conceptos por primera vez en el párrafo inicial y ahí no tenían enlace. Hasta ahora solo estaban enlazados dentro de `<Definicion>` (Pilar 2; convenciones §7: primera mención en cada sección). Los nuevos enlaces van sin `isDependency`, porque las dependencias ya se declaran en `<Definicion>` y no hace falta repetirlas.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [historia] Sigue abierto lo que señaló la ronda 1. La página afirma: «El <ConceptLink targetId="axioma-congruencia-1">Axioma III.1</ConceptLink> estipula que todo segmento es congruente consigo mismo». Coincide con lo que dice `axioma-congruencia-1`: «Asimismo, todo segmento es congruente consigo mismo». Pero no he podido comprobar en el repositorio si en la 7.ª edición de los *Grundlagen* esto se postula en III.1 o se deduce de III.1 y III.2. En cambio, que III.4 incluye la reflexividad de los ángulos sí cuadra con la formulación habitual de esa edición.

### Avisos de los scripts
- check-links «diagonal» (es/en/eu): descartado. Aquí «diagonal» es la diagonal $\Delta_A$ de $A\times A$, que ya está enlazada por su otro nombre en la misma frase (`relacion-identidad`). El ID `diagonal` corresponde a la diagonal de un polígono.

### Diagrama
No lo necesita. Imaginé un diagrama de flechas sobre un conjunto finito en el que el lector pone y quita el lazo $(x,x)$ de cada elemento. La reflexividad se comprueba elemento a elemento, sin que unos elementos influyan en otros, así que el diagrama solo repetiría $\Delta_A \subseteq R$. Donde sí enseñaría algo es en `relacion-equivalencia`: allí el lector podría romper una a una tres condiciones que se afectan entre sí.

### Resumen
He enlazado la primera mención de «relación binaria» y «conjunto» en el párrafo inicial, en los tres idiomas (commit 859a00e4). Las correcciones de las rondas 1 y 2 están aplicadas y son correctas en es, en y eu. Solo queda pendiente la cita de Hilbert sobre el Axioma III.1.

══ TODO OK · 1 nodo(s): relacion-reflexiva
VEREDICTO: errores

---

# Ronda 4: verificación

<!-- ronda 4 · opus/high · $0.32 · 4 turnos · sin cambios -->

## relacion-reflexiva — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad ✓ · diagrama no necesita

### Correcciones
Nada.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [historia] es/en/eu: «El <ConceptLink targetId="axioma-congruencia-1">Axioma III.1</ConceptLink> estipula que todo segmento es congruente consigo mismo». Sigue abierto desde la ronda 1. La frase coincide con el nodo `axioma-congruencia-1` del proyecto. Pero creo recordar, sin poder comprobarlo, que en la 7.ª edición de los *Grundlagen* la reflexividad de los segmentos no se postula: se deduce de III.1 y III.2. En la 1.ª edición sí formaba parte del axioma. Si es así, habría que corregir esta frase y también `axioma-congruencia-1`. La introducción de la sección («se postula o deduce») ya admite las dos lecturas. Lo de los ángulos en III.4 («Jeder Winkel ist sich selbst kongruent») sí coincide con esa edición.

### Avisos de los scripts
- check-links «diagonal» (es/en/eu): lo descarto. Aquí «diagonal» es $\Delta_A$, la diagonal de $A\times A$, y la misma frase la enlaza con su otro nombre, `relacion-identidad`. El ID `diagonal` es la diagonal de un polígono.

### Diagrama
No lo necesita, y coincido con las rondas anteriores. Imaginé un diagrama de flechas sobre un conjunto finito en el que el lector pone y quita el lazo $(x,x)$ de cada elemento. No enseñaría nada nuevo: la reflexividad es una sola condición que se comprueba elemento a elemento, sin que unos elementos influyan en otros, así que la figura solo repetiría $\Delta_A \subseteq R$. Ese diagrama sí enseñaría algo en `relacion-equivalencia`, donde el lector podría romper una a una tres condiciones que se afectan entre sí.

### Resumen
He revisado la página entera desde cero y no he cambiado nada. Los cambios de las rondas 1 a 3 están en es, en y eu y son correctos. Los términos en euskera están bien:
- «erreflexibo» lo confirman Elhuyar y la ZTH: https://zthiztegia.elhuyar.eus/terminoa/eu/erreflexibo
- «iragankor» lo da Elhuyar con la marca (Mat.): https://hiztegiak.elhuyar.eus/es/transitivo

Solo queda pendiente la cita de Hilbert sobre el Axioma III.1.

══ TODO OK · 1 nodo(s): relacion-reflexiva
VEREDICTO: ok
