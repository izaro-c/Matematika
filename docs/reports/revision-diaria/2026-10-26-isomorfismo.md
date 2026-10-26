<!-- 2026-10-26 · opus/high · $1.61 · 45 turnos · corregido 318f3b6c · propuestas 6baf1d17 -->

## isomorfismo — rigor ✗ · simpleza △ · modularidad △ · enlaces △ · paridad ✗ · diagrama falta

### Correcciones
- [rigor] es/en/eu: «es un **isomorfismo** de $\mathcal{M}$ en $\mathcal{N}$ (notado $\mathcal{M} \cong \mathcal{N}$)» → «es un **isomorfismo** de $\mathcal{M}$ en $\mathcal{N}$ si satisface:» y, al final del `<Definicion>`, «Las estructuras son *isomorfas*, $\mathcal{M} \cong \mathcal{N}$, si existe un isomorfismo de $\mathcal{M}$ en $\mathcal{N}$.» — $\cong$ indica que dos estructuras son isomorfas. No es una notación para la función $f$.
- [rigor] es/en/eu: la definición solo daba un dominio $M$ por estructura. Se añade: «Si $\sigma$ tiene varios tipos, como la signatura de la geometría con puntos, rectas y planos, cada estructura tiene un dominio por tipo y $f$ es una familia de biyecciones, una por tipo; en las condiciones anteriores, cada $a_i$ se transforma con la biyección de su tipo.» — `estructura-geometrica` define estructuras con varios dominios, y los dos ejemplos de la página (Hilbert y Fano) tienen varios tipos. Con la definición de un solo tipo, esos ejemplos no quedaban cubiertos.
- [rigor] es/en/eu: «como ocurre con las transformaciones de incidencia autoduales en el plano de Fano» → «En el plano de Fano, por ejemplo, los automorfismos son las colineaciones, que permutan los puntos y las rectas conservando la incidencia, y forman un grupo de 168 elementos.» — Una dualidad intercambia puntos y rectas. Por eso es un isomorfismo con la estructura dual y no un automorfismo. «Autodual» describe el plano, no sus automorfismos. Se quita el enlace a `dualidad` y se añade `colineacion`. Sobre el 168: el grupo de automorfismos es $\mathrm{GL}(3,2)$, de orden $7\cdot6\cdot4=168$.
- [rigor] es/en/eu: «Un isomorfismo de una estructura en sí misma ($\mathcal{M} \cong \mathcal{M}$)» → «Un isomorfismo de $\mathcal{M}$ en $\mathcal{M}$» — $\mathcal{M}\cong\mathcal{M}$ se cumple siempre y no designa ninguna función.
- [rigor] es/en/eu: «forma un grupo que captura…» → «forma un grupo con la composición, que captura…» — Un grupo necesita una operación. Se enlaza `composicion-funciones`, que es el ID que ya usa el corpus.
- [rigor] es/en/eu: «el sistema euclidiano tridimensional completo con axiomas de continuidad» → «el sistema euclidiano, que es tridimensional e incluye los axiomas de continuidad,» — Según convenciones §1, `sistema-euclidiano` ya contiene el grupo V. La versión anterior hacía pensar que se le añadían esos axiomas, y «completo» podía confundirse con el axioma de completitud.
- [enlaces] es/en/eu: «*automorfismo*» → `<ConceptLink targetId="automorfismo">automorfismo</ConceptLink>` — Pilar 2. La página destino todavía no existe.
- [paridad] eu: «bat-bateko korrespondentzia» → «bana-banako korrespondentzia» — «bat-bateko» significa «repentino». «Biunívoco» se traduce por «bana-banako».

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «Dos estructuras isomorfas son indistinguibles desde la perspectiva de las propiedades expresables en el lenguaje formal de la lógica: cualquier enunciado verdadero en una de ellas es necesariamente verdadero en la otra, variando únicamente la naturaleza empírica o la nomenclatura de sus elementos base.» → «Dos estructuras isomorfas satisfacen los mismos enunciados de la lógica escritos con su signatura: solo se distinguen por la naturaleza de sus elementos, de la que ningún símbolo de la signatura habla.» — Se quitan «necesariamente» (convenciones §4) y «empírica», que no tiene sentido para elementos de una estructura. Así también se va el aviso «lenguaje formal».
- [simpleza] es/en/eu: «se preservan íntegramente» → «se preservan» (en: «completely preserved» → «preserved»; eu: «osotasunean» suprimido) — intensificador vacío.
- [simpleza] es/en/eu: «En la teoría de modelos, la existencia de isomorfismos fundamenta nociones estructurales clave:» → «Dos nociones de la teoría de modelos se definen mediante isomorfismos:» — Fuera el adjetivo valorativo y la muletilla de marco al inicio del párrafo.
- [enlaces] es/en/eu: «puntos, rectas y planos», dentro de la frase nueva sobre signaturas con varios tipos, enlazados a `punto`, `recta` y `plano` — primera mención (Pilar 2).
- [modularidad] La página define *automorfismo* en una línea. La he dejado así, con enlace a `automorfismo`, porque es un caso particular del concepto de esta página. La alternativa descartada era extraerlo a su propio nodo. La categoricidad se trata igual: se nombra, se enlaza a `categoricidad` y se dice cómo depende del isomorfismo.

### Pendiente para la autora
- [terminología] eu: «Edozein $n$-ar $R \in \sigma$ erlazio-ikurretarako» y «$k$-ar» — no he podido comprobar en Elhuyar la forma de «n-ario» («n-ar», «n-tar»…).

### Avisos de los scripts
- check-links «lenguaje formal» / «formal language» (es, en) — corregido: el párrafo reescrito ya no contiene esa expresión.
- check-links «simetría» (es) → `relacion-simetrica` — descartado: es la segunda mención («las simetrías internas»), la primera ya enlaza a `simetria`, y el sentido es estructural, no la propiedad de una relación.
- check-links «entre» (es), «between» (en), «artean» (eu) → `estar-entre` — descartado: aparece en «biyección entre dos estructuras», no es intermediación.
- check-links «puntos/rectas/planos» (es/en/eu), que apareció tras las correcciones — corregido en las propuestas con sus `ConceptLink`.

### Diagrama
Falta, y no lo he creado en esta ejecución. Encaja en el criterio de «definiciones con condiciones que el lector puede romper una a una». La idea sería tomar dos estructuras de 3 elementos con una relación binaria dibujada como flechas fijas dentro de cada conjunto, más una biyección con puntas arrastrables `on-points`, como en `BiyeccionSagital.tsx`. Un panel diría si la correspondencia no es biyección, si es biyección pero no conserva $R$ o si es isomorfismo, con un anillo `granada` en el par donde falla el «⇔». Manipularlo enseña lo que el texto solo afirma: una biyección no basta, y la condición puede fallar en los dos sentidos del ⇔.

No lo he creado por dos razones. El modelo tiene 83 objetos y SKILL.md §5F dice que se produce con un generador, pero ese generador no está en el repositorio, así que habría que escribir a mano más de 100 objetos de JSON estricto con condiciones de hasta 512 caracteres. Además, §5F pide comprobar el diagrama en escritorio, tableta y móvil, y desde aquí no puedo hacerlo. Lo dejo para una ejecución con el generador disponible.

### Resumen
He corregido la notación $\cong$, he extendido la definición a signaturas con varios tipos, he corregido el ejemplo de Fano (los automorfismos son las colineaciones, un grupo de 168 elementos), he añadido la composición como operación del grupo y he arreglado «bat-bateko» en eu. Como propuestas, he simplificado el segundo párrafo y la introducción de la sección. Quedan pendientes el diagrama de la biyección que conserva la relación y comprobar «n-ar» en euskera.

══ TODO OK · 1 nodo(s): isomorfismo
VEREDICTO: errores
