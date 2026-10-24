<!-- 2026-10-23 · opus/high · $1.05 · 27 turnos · corregido 193003e8 · propuestas 00c30771 -->

## dimension — rigor ✗ · simpleza △ · modularidad △ · enlaces △ · paridad △ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: «dos planos distintos que comparten un punto comparten una recta» → «dos planos distintos que comparten un punto comparten al menos otro» (en: «share at least one more»; eu: «gutxienez beste bat partekatzen dute»). El texto antiguo no enunciaba bien el Axioma I.7. Según su propio nodo, I.7 solo garantiza un segundo punto común. Que los dos planos compartan una recta es el `teorema-interseccion-planos`, que también necesita I.1, I.5 e I.6. Para descartar $\dim \ge 4$ basta el segundo punto común, porque en dimensión 4 dos planos pueden cortarse en un solo punto.
- [enlaces] es/en/eu: «los axiomas de incidencia de David Hilbert» → «los <ConceptLink targetId="sistema-incidencia">axiomas de incidencia</ConceptLink> de David Hilbert». Pilar 2: la primera mención de un concepto lleva enlace. Va sin `isDependency` porque `dimension` es un concepto nominal o meta. Este cambio resuelve el WARN de `es` y el de `en`.
- [rigor] es/en/eu: «\dim_{\mathbb{K}}(V) = |B|» → «\dim_{\mathbb{K}}(V) = \lvert B \rvert». Lo exige katex-notation §2 para la cardinalidad: `\lvert S \rvert`, no `|S|` sin balancear.
- [modularidad] es/en/eu: «región poligonal (polígono junto con su interior)» → «región poligonal». Golden Rule 12: un concepto externo se enlaza y no se define en la página. En `eu` reordené la frase: «eskualde poligonala (poligonoa eta haren barnealdea), zeinari azalera esleitzen zaion» → «azalera esleitzen zaion eskualde poligonala».
- [paridad] es: «(Axioma I.3 impone» → «(el Axioma I.3 impone». Al sujeto le faltaba el artículo, y la otra mitad de la frase ya decía «y el Axioma I.8».
- [paridad] eu: «…dimentsio induktiboaren bidez definitzen da, Witold Hurewiczek eta Henry Wallmanek sistematizatua.» → «…definitzen da; biak Witold Hurewiczek eta Henry Wallmanek sistematizatu zituzten.» En singular, el participio se refería a «la dimensión». En `es` («sistematizadas») lo sistematizado son las dos dimensiones, la de recubrimiento y la inductiva.

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «Las cotas inferiores vienen de axiomas existenciales (el Axioma I.3 impone … coplanares); la cota superior, del Axioma I.7: …» → «Las cotas inferiores vienen de axiomas existenciales: el Axioma I.3 impone … coplanares. La cota superior viene del Axioma I.7: …». La frase tenía 51 palabras y check-style daba aviso tras la corrección; ahora son dos frases, una por tipo de cota. En `eu` además «I.7 axiomatik» pasa a «I.7 Axiomatik dator», con la misma mayúscula que «I.3 Axiomak» e «I.8 Axiomak». La otra opción era dejar la frase y descartar el aviso.
- [simpleza] es/en/eu: «El punto elemental (carente de extensión).» → «El punto.» (en: «The point.»; eu: «Puntua.»). El segundo párrafo ya dice que «el punto carece de extensión», y el adjetivo «elemental» no aporta nada. La otra opción era quitar del segundo párrafo las dimensiones entre paréntesis. La descarté porque ese párrafo explica la intuición de los grados de libertad, y la jerarquía no lo hace.

### Pendiente para la autora
Nada.

### Avisos de los scripts
- check-links «incidencia» (es): corregido, ahora enlaza a `sistema-incidencia`.
- check-links «incidence axioms» (en): corregido, ahora enlaza a `sistema-incidencia`.
- check-links «traza» (es) y «trace» (en): descartados. La página habla de la traza de un triángulo o polígono, que el nodo `triangulo` define como la unión de sus lados. El nodo `traza` solo cubre $\operatorname{tr}$ sobre rectas y planos (Golden Rule 7), así que enlazarlo cambiaría el sentido.
- check-links «oinarrizko» (eu, quedaba 1 de 2): descartado. «Oinarrizko geometria» significa «geometría elemental», no concepto primitivo. La otra aparición («Oinarrizko puntua») desapareció con la propuesta de la jerarquía.
- check-style, frase de 51 palabras (es): apareció tras la corrección del artículo y quedó resuelto en las propuestas, al dividir la frase.

### Diagrama
No le hace falta. Es una definición nominal que presenta cómo se formaliza la dimensión en varias teorías: geometría sintética, álgebra lineal y topología. No hay ninguna configuración que el lector tenga que imaginar, ni nada que enseñe al mover puntos. El papel dimensional de I.7 e I.8 ya tiene diagrama en sus propios nodos (I.7 tiene `Incidence7`).

### Resumen
Corregí lo que la página decía del Axioma I.7, que garantiza un segundo punto común y no una recta. También enlacé «axiomas de incidencia», ajusté la notación de cardinal, quité la definición inline de región poligonal y arreglé un artículo en `es` y la concordancia en `eu`. En las propuestas dividí la frase de las cotas y quité una repetición en la jerarquía. No queda nada pendiente.

══ TODO OK · 1 nodo(s): dimension
VEREDICTO: errores
