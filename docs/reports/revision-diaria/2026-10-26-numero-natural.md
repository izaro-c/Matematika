<!-- 2026-10-26 · opus/high · $3.74 · 71 turnos · corregido 566112cc · propuestas c55b938a · propuestas 7473941b -->

## numero-natural — rigor ✗ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✗ · diagrama falta

### Correcciones
- [rigor] es/en/eu: «$$(0 \in K \land \forall n \in K \ (S(n) \in K)) \implies K = \mathbb{N}$$» → «$$\forall K \subseteq \mathbb{N} \ \big( (0 \in K \land \forall n \in K \ (S(n) \in K)) \implies K = \mathbb{N} \big)$$». En la prosa, «si un subconjunto $K \subseteq \mathbb{N}$ satisface que…» → «para todo subconjunto $K \subseteq \mathbb{N}$, si…». — En la fórmula faltaba el cuantificador sobre $K$. Sin él, el axioma de inducción afirma algo sobre una $K$ libre y no sobre todos los subconjuntos.
- [enlaces] es/en/eu: «un subconjunto $K \subseteq \mathbb{N}$» sin enlace → `<ConceptLink targetId="subconjunto" isDependency={true}>`. Además lleva enlace sin dependencia en el primer «subconjunto» del principio del buen orden. — Pilar 2. El axioma 3 no se puede formular sin la noción de subconjunto, así que es una dependencia constitutiva (dag-and-hyperlinks §3). Alternativa: dejarlo sin `isDependency` y considerar que basta `conjunto`.
- [enlaces] es/en/eu: «como una estructura caracterizada…» y «la estructura $(\mathbb{N}, +, \cdot)$» sin enlace → `<ConceptLink targetId="estructura-geometrica">`. — El catálogo canónico asigna «estructura matemática» a `estructura-geometrica`, y su definición es la interpretación general de una signatura. Aquí la terna $(\mathbb{N}, 0, S)$ es exactamente eso.
- [paridad] eu: «Giuseppe Peano</ConceptLink>-k … Richard Dedekind</ConceptLink>-ek» → «…Peano</ConceptLink>k … Dedekind</ConceptLink>ek». — Los nombres propios se declinan sin guion, igual que en el resto de la página («aritmetika</ConceptLink>ren»).
- [paridad] eu: «Semieraztun trukatzailearen egitura» / «semieraztun trukatzaile unitarioa» → «Semieraztun trukakorraren egitura» / «semieraztun trukakor unitarioa». — En Elhuyar (Mat.), «conmutativo» es *trukakor*. *Trukatzaile* significa «conmutador».

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «una función inyectiva $S$ … tales que: … 2. La función sucesor es inyectiva» → «una función $S$ … 2. La función sucesor es <ConceptLink targetId="inyectividad">inyectiva</ConceptLink>». — La inyectividad se exigía dos veces. El enlace pasa al axioma 2 y se mantiene.
- [rigor] es/en/eu: «respecto de la relación de orden estándar, garantizando que…» → «respecto del orden definido por $m \le n \iff \exists k \in \mathbb{N} \ (m + k = n)$; por tanto…». La propiedad del semianillo pasa a ir antes. — El orden $\le$ no estaba definido en ninguna parte de la página, y definirlo mediante la suma exige presentar antes la adición. Alternativa descartada: definir $\le$ con iteraciones de $S$, que obliga a hablar de finitud.
- [rigor] es/en/eu: «define la menor escala de infinitud transfinita, denominada cardinalidad numerable» → «Su cardinalidad, denotada por $\aleph_0 = |\mathbb{N}|$, se llama cardinalidad numerable y, con el <ConceptLink targetId="axioma-eleccion">axioma de elección</ConceptLink>, es la menor cardinalidad infinita». — En ZF sin elección (basta la elección numerable) puede haber conjuntos infinitos Dedekind-finitos que no son comparables con $\aleph_0$. «Define» además no tenía un sentido preciso. Propongo `axioma-eleccion` como nuevo ID canónico; no se usaba antes.
- [simpleza] es/en/eu: «y ordenar secuencialmente sus términos» → «y ordenarlos en sucesión» (en: «arranging them in sequence»; eu: «haiek segidan ordenatzeko»). — Un conjunto tiene elementos, no «términos».
- [diagrama] `content/diagrams/Definiciones/PeanoSucesor.tsx` (nuevo), importado en los tres MDX con `hasSimulation: true` y `<VisualBind>` en $\mathbb{N}$ (`conjuntoN`, carbon), $0 \in \mathbb{N}$ (`e0`, mora) y $S$ (`flechas`, terracota). — Ver «Diagrama». Las propuestas están en dos commits: primero las de texto (c55b938a) y después el diagrama (7473941b), para que el diagrama se pueda rechazar por separado.

### Pendiente para la autora
- [terminología] eu: «baturarako baliogabetze-propietatearekin hornitua» — no puedo confirmar desde el repositorio que *baliogabetze* sea el término para la propiedad cancelativa. *Baliogabetu* tiene más bien un sentido jurídico; quizá sea *sinplifikazio-propietatea*. Hay que consultarlo en Elhuyar.
- [diagrama] No he podido ver el diagrama renderizado. Queda por comprobar en escritorio, tableta y móvil que no se solapen el codo de la flecha de retorno, el panel superior ni la región $K$.

### Avisos de los scripts
- check-links «estructura» (es) / «structure» (en) / «egitura» (eu) — corregido: está enlazado a `estructura-geometrica`, el ID canónico de «estructura matemática».
- check-links «elementuak» (eu) — descartado: son los elementos de un conjunto finito, no los *Elementos* de Euclides.

### Diagrama
Hacía falta un diagrama: la definición son tres condiciones que el lector puede romper una a una, el mismo caso que función o inyectividad en la rúbrica. El diagrama nuevo, de flechas, funciona así:
- **Situación inicial:** muestra la cadena 0→1→2→3→4→⋯ dentro de la placa $\mathbb{N}$.
- **La flecha que sale de 3:** su punta se arrastra entre tres posiciones (`on-points`).
  - Hacia 4: se cumplen los tres axiomas.
  - Hacia 0: desaparecen 4 y ⋯, el conjunto queda {0, 1, 2, 3}, aparece un anillo en 0 y el panel dice «Falla el axioma 1: S(3) = 0». La flecha vuelve por debajo de la cadena gracias a un punto intermedio calculado.
  - Hacia 1: aparece un anillo en 1 y el panel dice «Falla el axioma 2: S(0) = S(3)».
- **El botón:** añade un ciclo a→b→a fuera de la cadena y sombrea la región $K$ de lo que se alcanza desde 0, con el mensaje «Falla el axioma 3: K ≠ ℕ».

He comprobado a mano que cada mensaje es exacto. Con la flecha desviada, el conjunto finito {0, 1, 2, 3} sí cumple la inducción, así que cada manipulación rompe solo el axioma que nombra. Con a y b añadidos, falla también el 3.

Está en los tres idiomas y es `visual-exact`; `verify-diagram` da OK. Empecé con un generador por script, pero no pude ejecutarlo en este entorno: lo descarté y escribí el spec a mano.

### Resumen
Correcciones: cuantificador ∀K en el axioma de inducción, enlaces a `subconjunto` (dependencia) y `estructura-geometrica`, y en euskara declinación sin guion y «trukakor». Propuestas: inyectividad sin duplicar, $\le$ definido mediante la suma, el matiz de elección en $\aleph_0$, la primera frase más simple y el diagrama nuevo `PeanoSucesor`. Quedan por revisar el término *baliogabetze* y la composición del diagrama en móvil.

══ TODO OK · 1 nodo(s): numero-natural
VEREDICTO: errores
