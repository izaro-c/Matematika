<!-- 2026-10-28 · opus/high · $1.34 · 36 turnos · errores → ok · 3 rondas, converge · corregido f6b5f3e8 · propuestas 4cd3e53f · corregido 8d8fe98b -->

<!-- ronda 1 · opus/high · $0.72 · 25 turnos · corregido f6b5f3e8 · propuestas 4cd3e53f -->

## elemento-inverso — rigor ✗ · simpleza △ · modularidad ✓ · enlaces △ · paridad ✗ · diagrama no necesita

### Correcciones
- [rigor] es: «Si únicamente se verifica $a * a_R = e$, entonces $a_R \in S$ es un inverso por la derecha de $a$; si se cumple $a_L * a = e$, entonces $a_L \in S$ es un inverso por la izquierda de $a$.» → «Si $a * a_R = e$, se dice que $a_R \in S$ es un inverso por la derecha de $a$; si $a_L * a = e$, se dice que $a_L \in S$ es un inverso por la izquierda de $a$.» Con «únicamente», un inverso bilateral no sería inverso por la derecha. Pero la prueba de unicidad usa justo eso: toma un inverso bilateral como inverso por la derecha ($b$) y otro como inverso por la izquierda ($c$). Además, una definición se formula con «se dice que». en: «If only $a * a_R = e$ holds, then $a_R \in S$ is a right inverse…» → «If $a * a_R = e$, then $a_R \in S$ is said to be a right inverse…». eu: «Baldin eta $a * a_R = e$ soilik egiaztatzen bada, … eskuin-alderantzizkoa da; aldiz, …» → «$a * a_R = e$ bada, $a_R \in S$ elementua $a$-ren eskuin-alderantzizkoa dela esaten da; $a_L * a = e$ bada, berriz, … ezker-alderantzizkoa dela esaten da.»
- [rigor] es: «La existencia generalizada de inversos» → «La existencia de inverso para todo elemento». «Generalizada» no fija el cuantificador. Esto llegó a `en` como «widespread», que no significa «para todo». en: «The widespread existence of inverses» → «The existence of an inverse for every element». eu: «Alderantzizkoen existentzia orokortua da … axioma nagusia» → «Elementu orok alderantzizkoa izatea da … axioma». Quité «nagusia» porque es un adjetivo valorativo. Esta frase se volvió a reescribir en el nivel 2.
- [rigor] es/en/eu: «Unicidad e involución» / «Uniqueness and involution» / «Bakartasuna eta inboluzioa» → «Unicidad» / «Uniqueness» / «Bakartasuna». La sección no enuncia ninguna involución, así que el título prometía algo que no está. No la añadí: $(a^{-1})^{-1} = a$ se sigue de que la definición es simétrica, y sería una propiedad trivial (Golden Rule 17).
- [enlaces] es/en/eu: «estructura algebraica» / «algebraic structure» / «gitura aljebraiko» → `<ConceptLink targetId="estructura-algebraica">`. Era un WARN confirmado. El ID ya se usa con este sentido en `grupo`, `cuerpo`, `asociatividad`, `operacion-binaria`, `elemento-neutro` y `numero-natural`. En eu el enlace va tras la `<Capitular>`, como ya se hace en `signatura`.
- [paridad/gramática eu] eu: «<eragiketa bitar> baten bidez <elementu neutro> batez hornitua harekin eragitean» → «<elementu neutro> batez hornitutako <eragiketa bitar> baten bidez harekin eragitean». El participio «hornitua» quedaba suelto en absolutivo después del complemento. Con «hornitutako» delante del sustantivo, modifica a la operación. Además, «alderantzikagarritasuna» estaba mal escrito (glosario: *alderantzizgarri*); la palabra desapareció luego con el cambio del nivel 2.
- [paridad eu] eu: «Alderantzizko elementuaren bakartasuna elkarkortasunean» → «Alderantzizko elementuaren bakartasuna, eragiketa elkarkorra denean». «Elkarkortasunean» significa «en la asociatividad», no «bajo asociatividad». El término *elkarkor* está confirmado como (Mat.) asociativo en https://hiztegiak.elhuyar.eus/eu/elkarkor y https://zthiztegia.elhuyar.eus/terminoa/eu/elkarkor.

### Propuestas aplicadas — revisar
- [simpleza] es: «La existencia de inverso para todo elemento constituye el axioma distintivo que diferencia a los grupos de los monoides y fundamenta la reversibilidad de transformaciones en el álgebra abstracta.» → «Un monoide en el que todo elemento tiene inverso es un grupo: la existencia de inversos es el axioma que distingue a los grupos entre los monoides.» en: «A monoid in which every element has an inverse is a group: the existence of inverses is the axiom that singles out groups among monoids.» eu: «Elementu orok alderantzizkoa duen monoidea taldea da: alderantzizkoen existentzia da monoideen artean taldeak bereizten dituen axioma.» Motivo: «fundamenta la reversibilidad de transformaciones» no dice nada que se pueda comprobar, y «distintivo» sobra. Con el cambio se pierde el enlace contextual a `algebra-abstracta`, que no era dependencia. Alternativa descartada: conservar la idea con un ejemplo concreto, que en un monoide $a * x = b$ se resuelve como $x = a^{-1} * b$. Exigía añadir fórmulas y una hipótesis de asociatividad en el párrafo de entrada.

### Pendiente para la autora
- [fuentes] es/en/eu: `locator: "Capítulo I, §1"` (Lang, *Algebra*). No puedo comprobar si Lang define el inverso en §1 (monoides) o en §2 (grupos). Tampoco el locator «Capítulo 1» de Birkhoff–Mac Lane.
- [fuentes] en/eu: los locators están en castellano («Capítulo»). No los toqué porque no sé si el proyecto quiere los metadatos de fuentes idénticos en los tres idiomas.
- [rigor] es/en/eu: la fórmula de la propiedad, `a * b = e \land c * a = e \implies b = c`, no incluye la hipótesis de asociatividad; solo la llevan el título y la prosa. No es falsa en su contexto, pero se puede leer suelta. Para meter la hipótesis en la fórmula haría falta texto en cada idioma, lo que rompería la identidad de fórmulas entre idiomas, así que lo dejo a tu criterio.
- [paridad] es: «elemento simetrizable o invertible» frente a en «invertible element» y eu «elementu alderantzizgarria». Solo `es` da el sinónimo «simetrizable». No es un error.

### Avisos de los scripts
- check-links «estructura algebraica» (es), «algebraic structure» (en) — corregidos.
- check-links «symmetric» (en), «simetrikoa» (eu) — descartados: se refieren a «elemento simétrico», sinónimo de inverso, no a la propiedad simétrica de una relación.
- check-links «right» (en, 2×) — descartado: es «right inverse», nada que ver con el ángulo recto.
- check-links «alde» (eu, 4×) — descartado: es «alde biko» (bilateral), no el lado de un polígono.
- check-links «entre» (es) y «artean» (eu) — aparecieron con la propuesta, en «distingue a los grupos entre los monoides» / «monoideen artean». Descartados: es una preposición, no la intermediación $A * B * C$.

### Diagrama
No necesita. Imaginé una tabla de Cayley de una operación finita: el lector elige $a$ y se resaltan las casillas de su fila y su columna donde sale $e$, de modo que se ven sus inversos por la derecha y por la izquierda. Lo único que enseñaría es que, sin asociatividad, ambos pueden ser distintos o no ser únicos. Para eso basta una tabla fija con un contraejemplo; arrastrar o seleccionar no añade nada que la definición y la prueba de unicidad no digan ya. Tampoco hay condiciones que romper una a una, como en `FuncionSagital`.

### Resumen
Corregí la definición de inverso lateral (sin «únicamente»), el cuantificador de la frase sobre grupos, el título de propiedades que anunciaba una involución inexistente, el enlace a `estructura-algebraica` y la gramática eu de la primera frase y del título de la propiedad. En el nivel 2 simplifiqué la frase sobre monoides y grupos. Quedan pendientes los locators de las fuentes y la hipótesis de asociatividad en la fórmula.

══ TODO OK · 1 nodo(s): elemento-inverso
VEREDICTO: errores

---

# Ronda 2: verificación

<!-- ronda 2 · opus/high · $0.31 · 6 turnos · corregido 8d8fe98b -->

## elemento-inverso — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad ✗ · diagrama no necesita

### Correcciones
- [paridad/gramática eu] eu: «Baldin eta <ConceptLink targetId="operacion-binaria">eragiketa bitarrak</ConceptLink> $*$ <ConceptLink targetId="asociatividad">elkarkortasun-propietatea</ConceptLink> betetzen badu» → «Baldin eta $*$ <ConceptLink targetId="operacion-binaria">eragiketa bitarrak</ConceptLink> <ConceptLink targetId="asociatividad">elkarkortasun-propietatea</ConceptLink> betetzen badu». En euskera el símbolo va delante del sustantivo que nombra, y la página ya lo hace así en todos los demás casos («$a_R \in S$ elementua», «$c \in S$ elementua»). Detrás del ergativo «eragiketa bitarrak», $*$ quedaba suelto y sin caso. Los enlaces y las fórmulas no cambian.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- Siguen abiertos los pendientes de la ronda 1. No los he tocado:
  - los locators de Lang y de Birkhoff–Mac Lane, y que en `en`/`eu` estén escritos en castellano;
  - la fórmula de la propiedad no incluye la hipótesis de asociatividad;
  - el sinónimo «simetrizable», que solo aparece en `es`.
- [terminología eu] eu: «idazkera biderkakorrean» / «idazkera batukorrean». Elhuyar no tiene entrada para «multiplicativo» (https://hiztegiak.elhuyar.eus/es/multiplicativo), así que no he podido confirmar si lo correcto es *biderkakor* o *biderkatzaile*. Lo dejo como está.

### Avisos de los scripts
- check-links «symmetric» (en) y «simetrikoa» (eu): descartados. Es «elemento simétrico», sinónimo de inverso, no la propiedad simétrica de una relación.
- check-links «right» (en, 2×): descartado. Es «right inverse», no un ángulo recto.
- check-links «alde» (eu, 4×): descartado. Forma parte de «alde biko» (bilateral, que Elhuyar recoge en https://hiztegiak.elhuyar.eus/es/bilateral), no es el lado de un polígono.
- check-links «entre» (es) y «artean» (eu): descartados. Son la preposición de «entre los monoides» / «monoideen artean», no la relación de intermediación $A * B * C$.

### Diagrama
No necesita, y coincido con la ronda 1. Me imaginé una tabla de Cayley donde el lector elige un elemento y se marcan sus inversos por la derecha y por la izquierda. Solo enseñaría un contraejemplo fijo para el caso sin asociatividad, y una tabla estática basta para eso. La definición no tiene condiciones que el lector pueda romper una a una.

### Resumen
He comprobado que los cambios de la ronda 1 están aplicados en los tres idiomas y son correctos. Solo he corregido en euskera el orden de $*$ en la propiedad de unicidad. Quedan los pendientes de fuentes y terminología.

══ TODO OK · 1 nodo(s): elemento-inverso
VEREDICTO: errores

---

# Ronda 3: verificación

<!-- ronda 3 · opus/high · $0.3 · 5 turnos · sin cambios -->

## elemento-inverso — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad ✓ · diagrama no necesita

He revisado la página entera de nuevo y comprobado los cambios de las rondas 1 y 2. No he encontrado nada que corregir, así que no he cambiado nada.

### Correcciones
Nada.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- **Sin cambios de las rondas 1 y 2:**
  - Fuentes: no se pueden comprobar los locators de Lang («Capítulo I, §1») ni de Birkhoff–Mac Lane («Capítulo 1»). Además, en `en` y `eu` están escritos en castellano.
  - Rigor: la fórmula de la propiedad no incluye la hipótesis de asociatividad.
  - Paridad: el sinónimo «simetrizable» solo aparece en `es`.
- **Terminología en eu, «idazkera biderkakorrean»:** sigue sin confirmar. «biderkakor» no tiene entrada en Elhuyar (https://hiztegiak.elhuyar.eus/eu/biderkakor) ni en la ZTH (https://zthiztegia.elhuyar.eus/terminoa/eu/biderkakor).
- **Terminología en eu, confirmada:** «batukor» sí está confirmado como (Mat.) para «aditivo» (https://hiztegiak.elhuyar.eus/es/aditivo). «elementu simetrikoa» también lo está (https://hiztegiak.elhuyar.eus/es/sim%C3%A9trico).
- **Estilo en eu, sin cambiar:** Elhuyar da el ejemplo «eskuinetik simetrikoa den elementua» para «elemento simétrico por la derecha». La página usa «eskuin-alderantzizkoa» / «ezker-alderantzizkoa». No es un error, así que no lo he tocado; si quieres unificar con Elhuyar, es decisión tuya.

### Avisos de los scripts
- check-links «entre» (es) y «artean» (eu): descartados. Son la preposición de «entre los monoides» / «monoideen artean», no la intermediación $A * B * C$.
- check-links «symmetric» (en) y «simetrikoa» (eu): descartados. Es «elemento simétrico», sinónimo de inverso, no la propiedad simétrica de una relación.
- check-links «right» (en, 2×): descartado. Es «right inverse», no un ángulo recto.
- check-links «alde» (eu, 4×): descartado. Forma parte de «alde biko» (bilateral), no es el lado de un polígono.

### Diagrama
No necesita, como dijeron las rondas 1 y 2. Imaginé una tabla de Cayley donde el lector elige un elemento y se marcan sus inversos por la derecha y por la izquierda. Solo enseñaría un contraejemplo para el caso sin asociatividad, y para eso basta una tabla fija. La definición no tiene condiciones que el lector pueda romper una a una, como en `FuncionSagital`.

### Resumen
Ronda de verificación sin cambios. Los cambios de las rondas 1 y 2 están aplicados en los tres idiomas y son correctos. Solo quedan los pendientes de fuentes y de terminología en eu.

══ TODO OK · 1 nodo(s): elemento-inverso
VEREDICTO: ok
