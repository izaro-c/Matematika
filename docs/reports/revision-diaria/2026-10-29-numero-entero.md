<!-- 2026-10-29 · opus/high · $5.53 · 118 turnos · errores → errores · 4 rondas, sin converger tras 4 rondas · corregido · propuestas · corregido r2 · corregido r3 · corregido r4 → commit d53905d4 en main -->

<!-- ronda 1 · opus/high · $3.03 · 73 turnos · corregido · propuestas -->

## numero-entero — rigor ✗ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✗ · diagrama falta

### Correcciones
- [rigor] es: «resolviendo la imposibilidad intrínseca de restar libremente cantidades menores de cantidades mayores en $\mathbb{N}$» → «… restar libremente cantidades mayores de cantidades menores en $\mathbb{N}$». La frase decía lo contrario de lo correcto: en ℕ sí se puede calcular 5 − 3; lo que no se puede es 3 − 5. `en` y `eu` ya lo decían bien.
- [rigor] es/en/eu: «formado por los números naturales, sus correspondientes inversos aditivos o números negativos y el cero» → «formado por los números naturales y por los inversos aditivos de los naturales no nulos, o números negativos». La dependencia `numero-natural` incluye el 0 en ℕ, así que no tiene sentido contarlo aparte. Además, el inverso de 0 no es negativo. En `en`: «the natural numbers and the additive inverses of the nonzero natural numbers, or negative numbers». En `eu`: «zenbaki arruntek eta zero ez diren zenbaki arrunten batuketarekiko alderantzizkoek, edo zenbaki negatiboek».
- [paridad] eu: «haien batuketarekiko alderantzizko negatiboek edo zenbaki negatiboek» → como en el punto anterior. «Alderantzizko negatiboek» era redundante y no corresponde a «inversos aditivos».
- [paridad] eu: «alderanzgarritasun osoa» → «alderantzizgarritasun osoa». El glosario marca *alderanzgarri* como incorrecto y fija *alderantzizgarri*.
- [paridad] eu: «eraztun trukatzaile» (description) y «osotasun-eremu trukatzaile» → «trukakor». Elhuyar da para conmutativo (Mat.) «trukakor, kommutatibo»: https://hiztegiak.elhuyar.eus/es/conmutativo
- [paridad] eu: «bi zenbaki arrunt bikote haien batura gurutzatua» → «zenbaki arrunten bi bikote haien batura gurutzatua». La forma anterior era agramatical.
- [paridad] en/eu: el locator de Lang, «Capítulo I, §1», estaba sin traducir. Ahora es «Chapter I, §1» en `en` y «I. kapitulua, §1» en `eu`, como en `grupo` y `cuerpo`.
- [modularidad] es/en/eu: los `PropiedadItem id` «grupo-abeliano-aditivo», «dominio-integridad» y «orden-total-discreto» → «enteros-grupo-ciclico», «enteros-dominio-integridad» y «enteros-orden-discreto». Los ids antiguos coincidían con nodos de concepto (`dominio-integridad` se enlaza en la misma propiedad), pero las propiedades enuncian otra cosa: que ℤ *es* un dominio de integridad. Esto lo prohíbe convenciones §5.
- [enlaces] es/en/eu: «conjunto cociente» no tenía enlace → `<ConceptLink targetId="conjunto-cociente" isDependency={true}>`. La definición *es* un conjunto cociente: no se puede formular sin él (dag §3).
- [enlaces] es/en/eu: «multiplicación» → `multiplicacion`, «conmutativo» → `conmutatividad` y «cíclico» → `grupo-ciclico`, en su primera mención (Pilar 2). Son los mismos IDs que ya usa el corpus.

### Propuestas aplicadas — revisar
- [rigor] es/en/eu, dentro de `<Definicion>`, después de «formaliza la diferencia $a - b$.»: se añade «Cada natural $n$ se identifica con $[(n, 0)]$ y su opuesto con $[(0, n)]$; toda clase es de una de estas dos formas, pues $(a, b) \sim (a - b, 0)$ si $a \geq b$ y $(a, b) \sim (0, b - a)$ si $a < b$.» Sin esta frase, el primer párrafo («formado por los naturales y los negativos») no tenía respaldo en la construcción. La alternativa era dejarlo para un nodo `inmersion-naturales-enteros`; la descarté porque basta una frase.
- [rigor] es/en/eu, propiedad del orden: «posee una relación de orden total compatible con…» → «posee una relación de orden total, $[(a, b)] \leq [(c, d)] \iff a + d \leq b + c$, compatible con…». Así la propiedad queda atada a la construcción.
- [diagrama] Nuevo archivo `content/diagrams/Definiciones/NumeroEnteroPares.tsx`. Es una figura estática con los pares $(a,b)$, $a \le 5$, $b \le 2$, donde cada clase es una diagonal rotulada con su entero:
  - la clase 0 va en `mora` y sus objetos forman el grupo `clase0`;
  - la clase 2 va en `terracota` (grupo `clase2`);
  - la clase −2 va en `pavo` (grupo `claseMenos2`);
  - el grupo `malla` contiene todos los pares (ℕ×ℕ).
  - Las diagonales siguen un poco más allá de la cuadrícula para indicar que cada clase es infinita, y empiezan en el borde, donde de verdad empiezan.
- [diagrama] MDX en los tres idiomas: `hasSimulation: true`, el import y `export const Simulation`. Se añaden `<VisualBind>` en $\mathbb{N} \times \mathbb{N}$ (`malla`, carbon) y en $0 = [(0, 0)]$ (`clase0`, mora). Tras la definición va una frase nueva: «En la figura, cada clase es una diagonal de pares: $[(2, 0)] = \{(2, 0), (3, 1), (4, 2), \dots\}$ es el entero $2$, y $[(0, 2)]$ es su opuesto, $-2$.»

### Pendiente para la autora
- [historia] es/en/eu, fuente primaria: «Stetigkeit und irrationale Zahlen», Richard Dedekind, 1872. Hasta donde sé, esa obra construye los reales mediante cortaduras y da por hechos los racionales; no construye ℤ con pares. No puedo comprobar desde el repositorio qué fuente primaria corresponde, y el mismo problema está en `numero-racional`. No lo he tocado.
- [historia] Lang, *Algebra*, «Capítulo I, §1»: no puedo verificar que la construcción de Grothendieck esté en ese parágrafo.
- [terminología] eu: «osotasun-eremu» (dominio de integridad) y «ordena osoa» (orden total) no aparecen en Elhuyar. Consulté «integridad» y «orden total» y ninguna da la locución matemática. Lo he dejado como estaba.
- [simpleza] es/en/eu: el texto sigue teniendo jerga y adjetivos valorativos: «sistema numérico algebraico discreto», «imposibilidad intrínseca», «invertibilidad completa». También es redundante «dominio de integridad conmutativo unitario», porque un dominio de integridad ya es conmutativo y unitario. Lo dejé así para no reescribir sin una norma clara que lo exija. Puede valer la pena aligerarlo.

### Avisos de los scripts
- check-links «multiplicación» / «multiplication» / «biderketarekin» (es/en/eu): corregido.
- check-links «commutative» (en): corregido (`conmutatividad`, en los tres idiomas).
- check-links «estructura» / «structure» / «egitura» (es/en/eu): descartado. Aquí es el uso genérico de «la estructura $(\mathbb{Z},+)$», no `estructura-geometrica`.
- check-links «multzoak» (eu): descartado. Es «el conjunto ℤ» en sentido genérico, y `es` tampoco lo enlaza.
- check-links «zuzen» (eu): descartado. Viene de «zuzenean» («directamente»), no de «recta».
- check-links «diagonal» (es/en/eu, nuevo): descartado. Es la diagonal de la cuadrícula de la figura, no la diagonal de un polígono (`diagonal`).

### Diagrama
La página no tenía diagrama y lo necesitaba: el conjunto cociente tiene una imagen canónica (rúbrica §6, «una partición»). En la cuadrícula ℕ×ℕ, cada número entero es una diagonal: los pares con la misma diferencia $a-b$. Con eso se ve de una vez por qué $(a,b)\sim(c,d) \iff a+d=b+c$, por qué cada clase empieza en un borde, que es $[(n,0)]$ o $[(0,n)]$, y qué es el 0. He elegido una figura estática porque mirar basta; arrastrar no enseñaría nada más.

`verify-diagram` da `visual-exact` y las traducciones están completas. No he podido revisar el encuadre en móvil desde aquí, así que conviene comprobarlo.

### Resumen
Se corrigen el sentido de la resta imposible en ℕ (`es`), el cero contado aparte de los naturales, varios errores de terminología y gramática en `eu`, los ids de propiedad que coincidían con nodos, los locators y los enlaces que faltaban. Además, como propuesta, se añaden la inmersión ℕ→ℤ, la fórmula del orden y una figura estática de las clases como diagonales de ℕ×ℕ. Quedan para la autora la fuente primaria de Dedekind y el aligeramiento del estilo.

══ TODO OK · 1 nodo(s): numero-entero
VEREDICTO: errores

---

# Ronda 2: verificación

<!-- ronda 2 · opus/high · $1.06 · 14 turnos · corregido r2 -->

## numero-entero — rigor ✗ · simpleza △ · modularidad ✓ · enlaces ✓ · paridad ✗ · diagrama ✓

### Correcciones
- [rigor] es/en/eu: «<ConceptLink targetId="producto-cartesiano">producto cartesiano</ConceptLink>» (en: «Cartesian product», eu: «biderkadura kartesiarra») → `<ConceptLink targetId="producto-cartesiano" isDependency={true}>`. ℤ se define como el cociente de $\mathbb{N} \times \mathbb{N}$, así que la definición no se puede formular sin el producto cartesiano. Es una dependencia constitutiva, como ya lo es en `operacion-binaria` (rúbrica §1, «Dependencias completas»).
- [paridad] eu: «Talde abeldar gehigarria» → «Talde abeldar batukorra», y «ekuazio lineal aditibo orok» → «ekuazio lineal batukor orok». Elhuyar traduce *aditivo* en matemáticas como **batukor** (https://hiztegiak.elhuyar.eus/es/aditivo). *Gehigarri* es «adicional/aditivo alimentario», así que «talde gehigarria» significaba «grupo adicional». Además, el corpus ya usa *batukor* («idazkera batukorrean» en `elemento-inverso`, «batukortasuna» en `teoria-medida-area`).

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [historia] es/en/eu, fuente primaria «Stetigkeit und irrationale Zahlen», Richard Dedekind, 1872: la ronda 1 ya lo dejó pendiente y sigue sin resolver. Esa obra construye los reales con cortaduras y no construye ℤ con pares. Tampoco puedo confirmar desde el repositorio el locator de Lang «Capítulo I, §1».
- [terminología] eu: «osotasun-eremu» (dominio de integridad) y «ordena osoaren erlazioa» (orden total) siguen sin comprobar en Elhuyar. Los dejo como están, igual que la ronda 1.
- [simpleza] es/en/eu: el estilo sigue igual de cargado que señaló la ronda 1: «sistema numérico algebraico discreto», «imposibilidad intrínseca», «invertibilidad completa» y la redundancia de «dominio de integridad conmutativo unitario». No es un error, así que no lo cambio en una ronda de verificación.
- [enlaces] `numero-racional` y `numero-complejo` también enlazan `producto-cartesiano` sin `isDependency`, aunque se construyen igual, como cocientes o pares. No los toco porque quedan fuera de esta página.

### Avisos de los scripts
- check-links «estructura» / «structure» / «egitura» (es/en/eu): descartado. Es el uso genérico de «la estructura $(\mathbb{Z},+)$», no `estructura-geometrica`.
- check-links «diagonal» (es/en/eu): descartado. Se refiere a la diagonal de la cuadrícula de la figura, no a la diagonal de un polígono.
- check-links «multzoak» (eu): descartado. Es «el conjunto ℤ» en sentido genérico, y `es` tampoco lo enlaza.
- check-links «zuzen» (eu): descartado. Viene de «zuzenean» («directamente»), no de «recta».

### Diagrama
He comprobado la construcción de `NumeroEnteroPares.tsx`:
- **Posiciones:** el par $(a,b)$ se dibuja en $(-2.7+a,\,-1+b)$.
- **Diagonales:** cada una, de −2 a 5, tiene pendiente 1, pasa exactamente por los pares con la misma $a-b$ y empieza en el borde, en $(n,0)$ o en $(0,n)$.
- **Rótulos:** cada diagonal termina en el rótulo de su entero.
- **Colores:** coinciden con los `<VisualBind>` de los tres idiomas: `malla` carbon, `clase0` mora, `clase2` terracota, `claseMenos2` pavo.
- **Marcas:** las marcas de los ejes son puntos de tamaño 0.
- **Interacción:** no hay puntos móviles, así que la nota no colorea nada por error.
- **Traducciones:** las traducciones eu/en son fieles.

No he encontrado errores. Queda pendiente, como dijo la ronda 1, comprobar el encuadre en móvil.

### Resumen
He corregido el término «batukor» en `eu`, que sustituye a «gehigarria»/«aditibo», y he marcado `producto-cartesiano` como dependencia en los tres idiomas. Siguen pendientes para la autora la fuente primaria de Dedekind, dos términos en euskera sin comprobar y el aligeramiento del estilo.

══ TODO OK · 1 nodo(s): numero-entero
VEREDICTO: errores

---

# Ronda 3: verificación

<!-- ronda 3 · opus/high · $0.71 · 15 turnos · corregido r3 -->

## numero-entero — rigor ✓ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✓ · diagrama ✓

### Correcciones
- [enlaces] es/en/eu: el primer párrafo nombra los números naturales sin enlace, y el enlace con dependencia estaba en el segundo párrafo. Se mueve a la primera mención, como pide el Pilar 2 y la rúbrica §4 («primera mención»).
  - es: «formado por los números naturales y por» → «formado por los <ConceptLink targetId="numero-natural" isDependency={true}>números naturales</ConceptLink> y por». En el segundo párrafo queda «de los números naturales» sin enlace.
  - en: «consisting of the natural numbers and» → «consisting of the <ConceptLink targetId="numero-natural" isDependency={true}>natural numbers</ConceptLink> and». En el segundo párrafo queda «of natural numbers» sin enlace.
  - eu: «enbaki **osoak** zenbaki arruntek eta» → «enbaki **osoak** <ConceptLink targetId="numero-natural" isDependency={true}>zenbaki arruntek</ConceptLink> eta». En el segundo párrafo queda «zenbaki arrunten» sin enlace.
- [enlaces] es/en/eu: en la propiedad del orden faltaba el enlace de «adición». Convenciones §7 exige enlazar en la primera mención dentro de cada `<PropiedadItem>`, y en esa misma frase «multiplicación» ya estaba enlazada.
  - es: «compatible con la adición y la» → «compatible con la <ConceptLink targetId="adicion">adición</ConceptLink> y la».
  - en: «compatible with addition and» → «compatible with <ConceptLink targetId="adicion">addition</ConceptLink> and».
  - eu: «multzoak batuketarekin eta» → «multzoak <ConceptLink targetId="adicion">batuketa</ConceptLink>rekin eta».

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [historia] es/en/eu: la fuente primaria «Stetigkeit und irrationale Zahlen», Richard Dedekind, 1872, sigue pendiente desde las rondas 1 y 2. Esa obra construye los reales con cortaduras y no construye ℤ con pares de naturales. Tampoco se puede comprobar desde el repositorio el locator de Lang «Capítulo I, §1».
- [rigor, matiz] es/en/eu: «grupo de Grothendieck del semianillo de los números naturales». En sentido estricto, el grupo de Grothendieck es el del monoide aditivo $(\mathbb{N},+)$, y lo que corresponde al semianillo es el anillo de Grothendieck. Es un abuso de lenguaje habitual, no un error, así que no lo he tocado. Si se quiere precisar, podría decir «del monoide aditivo de los números naturales».
- [terminología] eu: «osotasun-eremu», «ideal nagusien eremua» y «ordena osoaren erlazioa» siguen sin respaldo en Elhuyar, como anotaron las rondas anteriores.
- [simpleza] es/en/eu: el estilo sigue cargado, como ya señalaron las rondas 1 y 2: «sistema numérico algebraico discreto», «imposibilidad intrínseca», «invertibilidad completa». A eso se suma la redundancia de «dominio de integridad conmutativo unitario». No es un error, así que no lo cambio en una ronda de verificación.

### Avisos de los scripts
- check-links «estructura» / «structure» / «egitura» (es/en/eu): descartado. Es el uso genérico de «la estructura $(\mathbb{Z},+)$», no `estructura-geometrica`.
- check-links «diagonal» (es/en/eu): descartado. Es la diagonal de la cuadrícula de la figura, no la diagonal de un polígono.
- check-links «multzoak» (eu): descartado. Es «el conjunto ℤ» en sentido genérico, y `es` tampoco lo enlaza.
- check-links «zuzen» (eu): descartado. Viene de «zuzenean» («directamente»), no de «recta».

### Diagrama
He vuelto a comprobar `NumeroEnteroPares.tsx` desde cero y no he encontrado errores.
- **Construcción:** cada par $(a,b)$ está en $(-2.7+a,\,-1+b)$. Cada diagonal, de −2 a 5, tiene pendiente 1, pasa exactamente por los pares con la misma $a-b$ y empieza en $(n,0)$ o en $(0,n)$.
- **Rótulos:** son puntos de tamaño 0.
- **Colores:** los grupos `malla` (carbon), `clase0` (mora), `clase2` (terracota) y `claseMenos2` (pavo) coinciden con los `<VisualBind>` de los tres idiomas.
- **Nota:** no hay puntos móviles, así que la nota no colorea nada por error.
- **Pendiente:** queda por comprobar a mano el encuadre en móvil.

### Resumen
He movido el enlace con dependencia de `numero-natural` a su primera mención y he enlazado «adición» en la propiedad del orden, en los tres idiomas. Siguen pendientes la fuente primaria, tres términos en euskera sin respaldo en Elhuyar y el aligeramiento del estilo.

══ TODO OK · 1 nodo(s): numero-entero
VEREDICTO: errores

---

# Ronda 4: verificación

<!-- ronda 4 · opus/high · $0.74 · 16 turnos · corregido r4 -->

## numero-entero — rigor ✓ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✓ · diagrama ✓

### Correcciones
- [enlaces] es/en/eu: dentro de `<Definicion>`, la primera mención de los naturales no tenía enlace. Convenciones §7 pide enlazar la primera mención en cada sección, y `<Definicion>` cuenta como sección aparte. El enlace va sin `isDependency` porque esa dependencia ya está declarada en el primer párrafo.
  - es: «identifica dos pares de naturales cuando» → «identifica dos pares de <ConceptLink targetId="numero-natural">naturales</ConceptLink> cuando»
  - en: «identifying two pairs of natural numbers whenever» → «identifying two pairs of <ConceptLink targetId="numero-natural">natural numbers</ConceptLink> whenever»
  - eu: «gisa definitzen da, zenbaki arrunten bi bikote» → «gisa definitzen da, <ConceptLink targetId="numero-natural">zenbaki arrunten</ConceptLink> bi bikote»
- [enlaces] es/en/eu: en `<Definicion>`, la palabra «abeliano» no tenía enlace. Se aplica la misma norma (§7). En `<SeccionPropiedades>` el término ya enlaza a `grupo-abeliano`, pero aquí faltaba.
  - es: «grupo</ConceptLink> abeliano con» → «grupo</ConceptLink> <ConceptLink targetId="grupo-abeliano">abeliano</ConceptLink> con»
  - en: «is an abelian <ConceptLink targetId="grupo"…» → «is an <ConceptLink targetId="grupo-abeliano">abelian</ConceptLink> <ConceptLink targetId="grupo"…»
  - eu: «talde</ConceptLink> abeldar bat da» → «talde</ConceptLink> <ConceptLink targetId="grupo-abeliano">abeldar</ConceptLink> bat da»

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [historia] es/en/eu: la fuente primaria «Stetigkeit und irrationale Zahlen», de Richard Dedekind (1872), construye los reales con cortaduras. No construye ℤ con pares de naturales, así que no parece la fuente primaria de esta página. Tampoco se puede comprobar desde el repositorio el locator de Lang «Capítulo I, §1». Está pendiente desde la ronda 1.
- [terminología] eu: la ZTH confirma «osotasun-eremu» como término matemático: «Unitate elementua duen eta zeroaren zatitzailerik ez duen eraztun trukakorra… Zenbaki osoen eraztuna (Z, +, ·) adibide bat da» (https://zthiztegia.elhuyar.eus/terminoa/eu/osotasun-eremu). Con eso se cierra la duda que dejaron abierta las rondas anteriores. En cambio, «ideal nagusien eremua» y «ordena osoa» no aparecen ni en Elhuyar ni en la ZTH (https://zthiztegia.elhuyar.eus/terminoa/eu/ordena%20osoa), así que se dejan como están.
- [rigor, matiz] es/en/eu: «grupo de Grothendieck del semianillo de los números naturales». En sentido estricto, el grupo de Grothendieck se construye sobre el monoide aditivo $(\mathbb{N},+)$. Es un abuso de lenguaje habitual, no un error, como ya anotó la ronda 3.
- [simpleza] es/en/eu: el estilo sigue cargado: «sistema numérico algebraico discreto», «imposibilidad intrínseca», «invertibilidad completa». Además, «dominio de integridad conmutativo unitario» es redundante, porque un dominio de integridad ya es conmutativo y unitario. No es un error, así que no lo cambio en una ronda de verificación.

### Avisos de los scripts
- check-links «estructura» / «structure» / «egitura» (es/en/eu): descartado. Es el uso genérico de «la estructura $(\mathbb{Z},+)$», no `estructura-geometrica`.
- check-links «diagonal» (es/en/eu): descartado. Se refiere a una diagonal de la cuadrícula de la figura, no a la diagonal de un polígono.
- check-links «multzoak» (eu): descartado. Es «el conjunto ℤ» en sentido genérico, y `es` tampoco lo enlaza.
- check-links «zuzen» (eu): descartado. Viene de «zuzenean» («directamente»), no de «recta».

### Diagrama
He revisado `NumeroEnteroPares.tsx` desde cero.
- **Construcción:** cada par $(a,b)$ está en $(-2.7+a,\,-1+b)$. Cada diagonal, de −2 a 5, tiene pendiente 1, empieza en $(n,0)$ o en $(0,n)$ y pasa exactamente por los pares con la misma diferencia $a-b$. Por ejemplo, la de 3 pasa por (4,1) y (5,2), y la de −1 por (1,2).
- **Rótulos:** cada diagonal acaba en el rótulo de su entero.
- **Colores:** los grupos `malla` (carbon), `clase0` (mora), `clase2` (terracota) y `claseMenos2` (pavo) coinciden con los `<VisualBind>` de los tres idiomas.
- **Fórmulas:** las de suma, producto y orden son correctas: $(a-b)(c-d)=(ac+bd)-(ad+bc)$, y $a-b\le c-d \iff a+d\le b+c$.

No he encontrado errores. Sigue pendiente comprobar a mano cómo se ve el encuadre en móvil.

### Resumen
He enlazado «naturales» (`numero-natural`) y «abeliano» (`grupo-abeliano`) en su primera mención dentro de `<Definicion>`, en los tres idiomas. La ZTH confirma «osotasun-eremu». Siguen pendientes la fuente primaria de Dedekind, dos términos en euskera que no aparecen en Elhuyar ni en la ZTH, y aligerar el estilo.

══ TODO OK · 1 nodo(s): numero-entero
VEREDICTO: errores
