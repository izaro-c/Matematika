<!-- 2026-10-29 · opus/high · $3.39 · 79 turnos · errores → mejoras · 2 rondas, converge · corregido 53660230 · propuestas 23d51600 -->

<!-- ronda 1 · opus/high · $3.01 · 75 turnos · corregido 53660230 · propuestas 23d51600 -->

## relacion-equivalencia — rigor ✗ · simpleza △ · modularidad △ · enlaces ✗ · paridad ✗ · diagrama falta

### Correcciones
- [rigor] es/en/eu: `<ConceptLink targetId="relacion-binaria">relación binaria</ConceptLink>` (en la `<Definicion>`) → `… isDependency={true}` — una relación de equivalencia se define como una relación binaria con tres condiciones, así que esa dependencia es constitutiva. Los tres nodos hermanos (`relacion-transitiva` y los demás) ya la marcan.
- [rigor] es: «cada clase de equivalencia representa la longitud intrínseca del segmento o la apertura del ángulo» → «cada clase de equivalencia reúne los segmentos, o los ángulos, congruentes con uno dado» (y lo mismo en en/eu: «represents the intrinsic length…», «berezko luzera edo angeluaren irekidura adierazten du»). Motivo: frontera epistémica (convenciones §3–4); «longitud» solo existe con los axiomas V, y «apertura» no es un término sintético.
- [rigor] es/en/eu: «y sobre ángulos es una relación de equivalencia» no daba ninguna justificación para los ángulos → añadido «(por el `<ConceptLink targetId="teorema-congruencia-angulos-equivalencia">`teorema de equivalencia de la congruencia angular`</ConceptLink>`)». El Axioma III.4 no da la simetría ni la transitividad; las da ese teorema.
- [rigor] es/en/eu: «el paralelismo $\parallel$ es una relación de equivalencia sobre el conjunto de rectas» → «… de `<ConceptLink recta>`rectas`</ConceptLink>`, cuya transitividad se deduce del `<ConceptLink axioma-paralelas-euclides>`Axioma IV`</ConceptLink>`». Sin ese axioma el paralelismo no es transitivo (en geometría hiperbólica falla).
- [enlaces] es/en/eu: «plano euclídeo» / «Euclidean plane» / «Plano euklidearrean» → `sistema-euclidiano`; primeras menciones de «segmentos» y «ángulos» → `segmento`, `angulo` (Pilar 2; los avisos de check-links eran correctos).
- [paridad] en: «**Sheaves of parallels:**» → «**Pencils of parallels:**». *Sheaf* es un término de topología; «haz de rectas» es *pencil*, como ya dice la misma frase («a parallel pencil of lines»).

### Propuestas aplicadas — revisar
- [simpleza] es: «es una relación binaria homogénea que formaliza el concepto abstracto de indistinguibilidad o igualdad bajo un determinado criterio, reuniendo de manera simultánea la reflexividad, la simetría y la transitividad.» → «es una `<relacion-binaria>`relación binaria`</>` sobre un conjunto que es `<relacion-reflexiva>`reflexiva`</>`, `<relacion-simetrica>`simétrica`</>` y `<relacion-transitiva>`transitiva`</>`. Formaliza la igualdad bajo un criterio: dos elementos relacionados son indistinguibles para ese criterio.» (en/eu equivalentes). Motivo: la frase era larga, y esos términos no tenían enlace en la prosa (§7).
- [simpleza] es: «Permite abstraer características particulares de los objetos para agruparlos en clases homogéneas, convirtiendo la igualdad estricta en una noción modular de clasificación matemática.» → «Agrupa los elementos en clases de elementos equivalentes entre sí, y cada clase puede tratarse como un objeto nuevo: así se construyen los `<numero-entero>`números enteros`</>` a partir de pares de `<numero-natural>`números naturales`</>` y los `<numero-racional>`números racionales`</>` a partir de pares de enteros.» Motivo: «noción modular» no significa nada concreto. El párrafo nuevo enlaza la página con los dos nodos que dependen de ella.
- [rigor] es/en/eu: «satisface las tres propiedades axiomáticas» → «cumple estas tres condiciones». No son axiomas, son las condiciones de la definición.
- [simpleza] es/en/eu: «El vínculo es bidireccional y recíproco» y «El vínculo se transmite a través de elementos intermedios» → glosas literales de las fórmulas, con la misma redacción que en `relacion-simetrica` y `relacion-transitiva`.
- [rigor] es/en/eu: «el cual produce una partición perfecta de $A$ en subconjuntos no vacíos y mutuamente disjuntos dos a dos que recubren $A$» → «es una partición de $A$. Por la reflexividad, $x \in [x]_\sim$, así que ninguna clase es vacía y entre todas recubren $A$. Por la simetría y la transitividad, dos clases con un elemento común coinciden, así que dos clases distintas son disjuntas.» Motivo: la afirmación no tenía justificación, y «perfecta» es un adjetivo valorativo.
- [enlaces] es/en/eu: «**clase de equivalencia**» y «**conjunto cociente**» (definidos en negrita sin enlace) → envueltos en `<ConceptLink targetId="clase-equivalencia">` y `<ConceptLink targetId="conjunto-cociente">`. «subconjunto» → `subconjunto`; «dirección» → `direccion`, un ID nuevo propuesto. Alternativa descartada: dejar «dirección» sin enlace, porque la frase la define como clase.
- [simpleza] es/en/eu: «### Aplicaciones nucleares en geometría» y su frase de entrada «En la construcción de las teorías geométricas, las relaciones de equivalencia organizan la estructura del espacio:» → «### Ejemplos en geometría», sin frase de entrada; «**Estructura de la congruencia:**» → «**Congruencia:**». Motivo: «nucleares» es un adjetivo valorativo, y la frase de entrada no decía nada.

### Pendiente para la autora
- [modularidad] es/en/eu: la clase de equivalencia sigue definida en la propia página («su **clase de equivalencia** es el subconjunto $[x]_\sim = …$»), en contra de la Golden Rule 12. Escribí el nodo `clase-equivalencia` en los tres idiomas: definición más un `PropiedadItem` «Dos clases que se cortan coinciden» con la prueba de que forman una partición. No pude guardarlo: al validar un nodo nuevo, `validate-graph` reescribe `src/data/graph/graph_structure.json`, `checkpoint.sh` rechaza cambios fuera de `content/`, y no tengo permiso para restaurar ese archivo. Lo descarté. Hay que crear el nodo en una sesión que pueda regenerar el grafo; once enlaces del corpus ya apuntan a él.
- [euskara] eu: «partizio». Elhuyar solo da *partizio* con la marca (Inform.) (https://hiztegiak.elhuyar.eus/es/partici%C3%B3n). El artículo de eu.wikipedia se titula «Partiketa (matematika)» (https://eu.wikipedia.org/wiki/Partiketa_(matematika)), pero el de «Baliokidetasun-erlazio» usa «partizio». La ZTH no tiene entrada. Lo dejo como estaba y conviene fijarlo en el glosario. «baliokidetasun-klase» y «zatidura-multzo» están confirmados por la ZTH (https://zthiztegia.elhuyar.eus/terminoa/eu/baliokidetasun-klase, https://zthiztegia.elhuyar.eus/terminoa/eu/zatidura-multzo), y «berdintza» es la acepción (Mat.) de «igualdad» en Elhuyar.
- [diagrama] Falta el diagrama; los detalles están en la sección «Diagrama».

### Avisos de los scripts
- check-links «clases de equivalencia» (es/en/eu) — corregido (`clase-equivalencia`).
- check-links «segmentos», «ángulos», «rectas» (es/en/eu) — corregido.
- check-links «euclidean plane» / «plano euklidearrean» — corregido (`sistema-euclidiano`).
- check-links «longitud» / «length» / «luzera» — corregido: la frase se ha reescrito sin esa noción métrica.
- check-links «estructura» / «structure» / «egitura», «espacio» / «space» / «espazioaren» — corregido: las frases vagas que los contenían se han quitado.
- check-links «azpimultzoa» (eu) — corregido (`subconjunto`, en los tres idiomas).
- check-links «plano» / «plane» / «planoan» (en «dirección en el plano», el único aviso que queda) — descartado: es la segunda mención; la primera, «plano euclídeo», ya está enlazada.
- check-links «group» (en) — descartado: es el verbo *to group*.
- check-links «tarte» (eu, original) — descartado: «tarteko elementuak» significa «elementos intermedios», no intervalo, y además la frase ha desaparecido.
- check-links «entre» (es), «artean» (eu) — descartado: «entre todas recubren», «elkarren artean» no expresan intermediación.
- check-links «elementuak» (eu) — descartado: son los elementos de un conjunto, no los *Elementos* de Euclides.
- validate-references: `relacion-binaria`, `particion`, `clase-equivalencia`, `conjunto-cociente` y `direccion` todavía no tienen página — es lo esperado para enlaces a páginas futuras (Pilar 2).

### Diagrama
El criterio dice que la página lo necesita: «relaciones de equivalencia sobre conjuntos finitos» es uno de los casos que la rúbrica cita expresamente. La manipulación útil sería esta. Un conjunto de 3 o 4 elementos con su matriz de relación como casillas pulsables (botones `cycle` 0/1, como en `OperacionBinariaTabla.tsx`) y el grafo de flechas al lado. Un panel de una línea diría qué condición falla y un anillo `granada` marcaría dónde: un bucle que falta, una flecha sin su recíproca, o un par $x \sim y$, $y \sim z$ sin $x \sim z$. Cuando las tres se cumplen, se colorearían las clases.

No lo he creado. Haría falta escribir a mano más de 150 objetos en JSON estricto, con las comprobaciones de transitividad repartidas en puntos ocultos. SKILL.md §5F dice que estos diagramas se producen con un generador, y ese generador no está en el repositorio. Además, §5F pide comprobar la figura en escritorio, tableta y móvil, y desde esta sesión no puedo hacerlo. La revisión de `isomorfismo` (26-10) lo dejó pendiente por la misma razón.

### Resumen
He corregido la dependencia de `relacion-binaria` que faltaba, he quitado la longitud y la apertura (nociones métricas) de los ejemplos de congruencia, he justificado los ejemplos de ángulos y paralelas, y he arreglado «Sheaves» en en. Como propuestas, he simplificado la apertura, justificado que el cociente es una partición y enlazado `clase-equivalencia` y `conjunto-cociente`. Quedan pendientes el nodo `clase-equivalencia` (bloqueado por `graph_structure.json`), el diagrama de la matriz de relación y decidir entre «partizio» y «partiketa».

══ TODO OK · 1 nodo(s): relacion-equivalencia
VEREDICTO: errores

---

# Ronda 2: verificación

<!-- ronda 2 · opus/high · $0.38 · 4 turnos · sin cambios -->

## relacion-equivalencia — rigor ✓ · simpleza ✓ · modularidad △ · enlaces ✓ · paridad ✓ · diagrama falta

### Correcciones
Nada.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [modularidad] es/en/eu: «su **clase de equivalencia** es el subconjunto $[x]_\sim = \{y \in A \mid x \sim y\}$». Sigue siendo una definición inline, en contra de la Golden Rule 12. Lo dejo sin tocar por lo que explicó la ronda 1: crear el nodo `clase-equivalencia` hace que se regenere `src/data/graph/graph_structure.json`, un archivo fuera de `content/`. Esta ronda no puede guardar ese cambio. Hay que crear el nodo en una sesión que pueda regenerar el grafo.
- [euskara] eu: «partizio». Sigue sin decidir entre «partizio» y «partiketa», como anotó la ronda 1. En el corpus `eu`, «partizio» y sus formas declinadas aparecen 16 veces y «partiketa» ninguna, así que mantenerlo es coherente con el resto. Conviene fijar el término en el glosario.
- [fuentes] es/en/eu: `{ title: "A Survey of Modern Algebra", …, locator: "Capítulo 1" }`. Desde el repositorio no puedo comprobar que las relaciones de equivalencia se traten en el capítulo 1 de Birkhoff y Mac Lane. El capítulo 1 es el de los enteros, y puede que el tratamiento general esté en otro capítulo. La cita de Halmos (§7, «Relations») sí cuadra con lo que dice la página.

### Avisos de los scripts
- check-links «plano» (es), «plane» (en), «planoan» (eu): descartados. En «dirección en el plano» se habla del plano euclídeo de la misma frase, que ya está enlazado como `sistema-euclidiano`.
- check-links «entre» ×2 (es): descartados. Aparecen en «equivalentes entre sí» y «entre todas recubren», que no expresan intermediación.
- check-links «artean» (eu): descartado. En «elkarren artean» significa «entre sí», no intermediación.
- check-links «group» (en): descartado. Es el verbo *to group* («It groups the elements»).
- check-links «elementuak» (eu): descartado. Son los elementos de un conjunto, no los *Elementos* de Euclides.
- validate-references: `relacion-binaria`, `clase-equivalencia`, `conjunto-cociente`, `particion` y `direccion` todavía no tienen página. Son enlaces a páginas futuras, como prevé el Pilar 2.

### Diagrama
Según la rúbrica, la página debería tener diagrama: «relaciones de equivalencia sobre conjuntos finitos» es uno de los casos que cita expresamente. La propuesta de la ronda 1 sigue siendo válida. Sería una matriz de relación de 3 o 4 elementos con casillas que se activan y desactivan. Al lado iría el grafo de flechas, con un panel que diga qué condición falla y dónde. Cuando se cumplan las tres, las clases aparecerían coloreadas.

No lo he creado. Los diagramas de tabla de esta carpeta son specs generadas de miles de líneas (`OperacionBinariaTabla.tsx` tiene 3705 y `FuncionSagital.tsx` 2232), y el generador que exige SKILL.md §5F no está en el repositorio. Además, desde aquí no puedo comprobar cómo se ve en tableta ni en móvil. Escribir el diagrama a mano no sería una propuesta clara para una ronda de verificación.

### Resumen
He revisado la página desde cero sin encontrar errores. Los cambios de la ronda 1 están aplicados en los tres idiomas y son correctos. Comprobé tres puntos concretos:
- La reflexividad de la congruencia de segmentos se deduce de los Axiomas III.1 y III.2.
- La transitividad del paralelismo en el plano se deduce del Axioma IV.
- En `eu`, «IV. axioma» se escribe igual que en `paralelas`.

Quedan tres cosas para la autora: el nodo `clase-equivalencia`, el diagrama de la matriz de relación y el locator de Birkhoff y Mac Lane.

══ TODO OK · 1 nodo(s): relacion-equivalencia
VEREDICTO: mejoras
