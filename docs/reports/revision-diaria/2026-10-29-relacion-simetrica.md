<!-- 2026-10-29 · opus/high · $1.69 · 44 turnos · errores → ok · 3 rondas, converge · corregido d3984b33 · propuestas 6a9b82b0 · corregido 1d81ff6a -->

<!-- ronda 1 · opus/high · $1.06 · 33 turnos · corregido d3984b33 · propuestas 6a9b82b0 -->

## relacion-simetrica — rigor ✗ · simpleza △ · modularidad ✗ · enlaces ✗ · paridad ✓ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: «es simétrica ($\ell \parallel m \implies m \parallel \ell$) por la conmutatividad intrínseca de la disyunción y del corte conjuntista, rasgo definitorio de toda relación de equivalencia» → «es simétrica (…) porque su definición no cambia al intercambiar $\ell$ y $m$: la igualdad $\ell = m$ y la condición $\operatorname{tr}(\ell) \cap \operatorname{tr}(m) = \emptyset$ no dependen del orden de las rectas. En la geometría euclidiana también es transitiva; como además es reflexiva, es una relación de equivalencia.» — La justificación anterior no era correcta. Al intercambiar las rectas, la disyunción no cambia de orden. Lo que se usa es la simetría de la igualdad y la conmutatividad de la intersección. Además, la frase daba a entender que el paralelismo es de equivalencia en cualquier geometría, y en geometría absoluta no es transitivo. La nueva redacción sigue el criterio de `relacion-reflexiva`.
- [rigor] es/en/eu: `<ConceptLink targetId="relacion-binaria">` dentro de `<Definicion>` → `isDependency={true}`. Sin relación binaria la definición no se puede formular (dag-and-hyperlinks §3), y así queda igual que en `relacion-reflexiva`.
- [modularidad] es: «(que denota una isometría o transformación que deja invariable un subconjunto de puntos): aquí se trata estrictamente de la reversibilidad de una relación formal» → «: aquí la simetría es una propiedad de una relación, no de una figura». Lo mismo en en y eu. La página definía `simetria` dentro del texto (Golden Rule 12), y «estrictamente» es un intensificador prohibido (convenciones §4). En eu desaparece también «alderanzgarritasunaz», que estaba mal escrito: el glosario da *alderantzizgarri*.
- [rigor/estilo] es: «En el Axioma II.1 del orden lineal, se postula que la relación de estar entre puntos … entonces necesariamente $C * B * A$» → «El Axioma II.1 postula que la relación de intermediación entre puntos es simétrica respecto a sus extremos: si $A * B * C$, entonces $C * B * A$». Lo mismo en en y eu (se quita «ezinbestean»). El II.1 es un axioma del grupo de orden, no «del orden lineal», y «necesariamente» es relleno (§4).
- [estilo] es/en/eu: «teorema riguroso» / «rigorous theorem» / «teorema zorrotz» → «teorema» / «theorem» / «teorema». Era un adjetivo valorativo; corresponde al WARN de check-style.
- [enlaces] es/en/eu: se han añadido enlaces en la primera mención de cada sección: `relacion-binaria` en el primer párrafo; en la sección de geometría, `estar-entre`, `punto`, `segmento`, `relacion-reflexiva`, `relacion-transitiva`, `recta`, `coplanaridad` y `sistema-euclidiano` (Pilar 2, convenciones §7).

### Propuestas aplicadas — revisar
- [simpleza] es: «si el vínculo que une a dos elementos cualesquiera es recíproco y no depende del orden en que se enuncien sus términos» → «si, siempre que un elemento está relacionado con otro, el segundo también está relacionado con el primero». Lo mismo en en y eu. Ahora la primera frase define directamente, igual que la `description` y que `relacion-reflexiva`. «Dos elementos cualesquiera» podía leerse como que todos los pares están relacionados.
- [simpleza] es/en/eu: el segundo párrafo empieza ahora con «Es una de las tres condiciones que definen una relación de equivalencia, junto con la reflexividad y la transitividad.», como en `relacion-reflexiva`. La alternativa era dejar solo la aclaración sobre la simetría geométrica.
- [simpleza] es: «La simetría relacional interviene de forma determinante en los diversos estratos deductivos:» → «Tres relaciones de la geometría son simétricas:». Lo mismo en en y eu. La frase anterior era relleno valorativo.
- [rigor] es/en/eu: después de «…con la transitividad del Axioma III.2» se añade «: de $\overline{AB} \cong \overline{CD}$ y $\overline{AB} \cong \overline{AB}$, el Axioma III.2 da $\overline{CD} \cong \overline{AB}$». Así se ve el paso de la deducción; antes solo se decía que existía.
- [enlaces] es/en/eu: «relación inversa» / «inverse» / «alderantzizko» → `<ConceptLink targetId="relacion-inversa">`. Es un ID canónico nuevo, todavía sin página. Sustituye a la sugerencia `elemento-inverso` de check-links, que tiene otro sentido.

### Pendiente para la autora
- [historia] es/en/eu: las fuentes «Naive Set Theory, Capítulo 7» y «Axiomatic Set Theory, Capítulo 3» no se pueden comprobar desde el repositorio. Las he dejado como estaban, igual que en `relacion-reflexiva`.
- [eu] «transposatutako erlazioa»: Elhuyar no tiene entrada para «transpuesto» (https://hiztegiak.elhuyar.eus/es/transpuesto). El glosario solo fija *transposizioa*. Lo he dejado como estaba.

### Avisos de los scripts
- check-links «intermediación/betweenness/bitartekotasunaren» (es/en/eu) — corregido (`estar-entre`)
- check-links «reflexividad», «transitividad» y sus equivalentes (es/en/eu) — corregido
- check-links «segmentos», «puntos», «rectas», «coplanares» y sus equivalentes (es/en/eu) — corregido
- check-links «conmutatividad/commutativity» (es/en) — descartado: la palabra desaparece al corregir la justificación
- check-links «orden lineal/linear order/ordena linealaren» (es/en/eu) — descartado: se ha quitado la expresión, que era imprecisa
- check-links «lógica» (es) — descartado: desaparece al quitar «propiedad lógica abstracta»
- check-links «inverse» → `elemento-inverso` (en) — descartado por tener otro sentido; enlazado a `relacion-inversa` en el nivel 2
- check-style «riguroso/rigorous/zorrotz» (es/en/eu) — corregido

### Diagrama
No lo necesita. Imaginé un diagrama de flechas sobre un conjunto finito en el que el lector añade o quita flechas y ve si cada una tiene su recíproca. Enseñaría lo mismo que el diagrama de `relacion-equivalencia`, que es donde la simetría se combina con las otras dos condiciones. Un diagrama aparte por cada propiedad repetiría la definición. La alternativa sería un diagrama común para reflexiva, simétrica y transitiva, pero corresponde decidirlo en `relacion-equivalencia`.

### Resumen
Se ha corregido la justificación de la simetría del paralelismo y se ha quitado la afirmación de que es una relación de equivalencia en cualquier geometría. También he marcado `relacion-binaria` como dependencia, he quitado la definición de simetría geométrica escrita dentro del texto y el relleno, y he enlazado los conceptos que no tenían enlace. Como propuestas quedan la primera frase con la definición directa, el párrafo sobre la relación de equivalencia, el enlace a `relacion-inversa` y la deducción explícita en la congruencia.

══ TODO OK · 1 nodo(s): relacion-simetrica
VEREDICTO: errores

---

# Ronda 2: verificación

<!-- ronda 2 · opus/high · $0.38 · 8 turnos · corregido 1d81ff6a -->

## relacion-simetrica — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad ✗ · diagrama no necesita

### Correcciones
- [paridad/eu] eu: «### Presentzia geometriaren axiometan eta teoretan» → «### Presentzia geometriaren axiometan eta teoremetan». La forma estaba mal declinada. El inesivo plural de *teorema* es *teoremetan*, igual que *axioma* → *axiometan*. *Teoretan* no corresponde a ningún lema: el de *teoria* sería *teorietan*. El corpus ya usa «teoremetan» en `eu/axioms/axioma-paralelas-euclides.mdx`.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [eu] eu: «$R^{-1} = \{(y, x) \mid (x, y) \in R\}$ $R$-ren alderantzizko edo transposatutako erlazioa adieraziz». Se entiende, pero la estructura sale del castellano «denotando por $R^{-1}$ a…». Una alternativa más natural sería «$R^{-1}$-en bidez … adieraziz». No es un error, así que lo he dejado como estaba. Sigue abierta la duda de la ronda 1 sobre «transposatutako», que Elhuyar no recoge.
- [rigor, matiz] es/en/eu: «Tres relaciones de la geometría son simétricas» incluye la intermediación, que es una relación ternaria, mientras que la definición de la página es para relaciones binarias. La frase sobre la intermediación ya dice «simétrica respecto a sus extremos», y eso basta para no engañar al lector. No lo he cambiado. Si se prefiere más precisión, se puede añadir «en un sentido extendido».
- [historia] Siguen sin comprobar las fuentes de Halmos (cap. 7) y de Suppes (cap. 3), igual que en la ronda 1.

### Avisos de los scripts
Nada. Ni la validación inicial ni la final dieron ningún WARN.

### Diagrama
No lo necesita. Estoy de acuerdo con la ronda 1. La única manipulación útil sería añadir o quitar flechas en un conjunto finito y ver si cada una tiene su recíproca. Eso encaja mejor en un diagrama común de `relacion-equivalencia`, que combinaría reflexividad, simetría y transitividad. Un diagrama propio aquí solo repetiría la definición.

### Resumen
Comprobé los cambios de la ronda 1 en los tres idiomas y son correctos. En particular, he contrastado la deducción de la simetría de la congruencia con los enunciados de los nodos del repositorio: III.1 incluye la reflexividad y III.2 se formula como $(\overline{AB}\cong\overline{CD}\land\overline{AB}\cong\overline{EF})\implies\overline{CD}\cong\overline{EF}$. El único cambio de esta ronda es la corrección del inesivo plural en el encabezado `eu`, guardada en 1d81ff6a.

══ TODO OK · 1 nodo(s): relacion-simetrica
VEREDICTO: errores

---

# Ronda 3: verificación

<!-- ronda 3 · opus/high · $0.25 · 3 turnos · sin cambios -->

## relacion-simetrica — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad ✓ · diagrama no necesita

### Correcciones
Nada.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
Siguen abiertas las cuestiones de las rondas 1 y 2. No hay ninguna nueva:
- [historia] es/en/eu: no puedo comprobar desde el repositorio las fuentes «Naive Set Theory, Capítulo 7» (Halmos) y «Axiomatic Set Theory, Capítulo 3» (Suppes).
- [eu] eu: «$R$-ren alderantzizko edo transposatutako erlazioa adieraziz». Elhuyar no recoge «transpuesto», y la construcción sigue de cerca al castellano. No es un error, así que no lo he cambiado.
- [rigor, matiz] es/en/eu: «Tres relaciones de la geometría son simétricas» cuenta también la intermediación, que es ternaria. El texto ya precisa «simétrica respecto a sus extremos», así que no lo he cambiado.

### Avisos de los scripts
Nada. La validación no da ningún `WARN` ni `ERROR`.

### Diagrama
No lo necesita. Estoy de acuerdo con las rondas 1 y 2. La única manipulación útil sería añadir o quitar flechas en un conjunto finito y ver si cada flecha tiene su recíproca. Eso encaja en un diagrama común de `relacion-equivalencia`, que reúna reflexividad, simetría y transitividad. Un diagrama propio en esta página solo repetiría la definición.

### Resumen
He revisado la página entera desde cero y he comprobado que los cambios de las rondas 1 y 2 están en los tres idiomas. No he encontrado nada que cambiar.

- **Reflexividad en III.1:** la deducción de la simetría de la congruencia se apoya en ella, y `axioma-congruencia-1` sí la incluye: $\overline{AB} \cong \overline{AB}$ cuando $A \neq B$.
- **Paralelismo:** la justificación de su simetría es correcta. También es correcto restringir la transitividad a la geometría euclidiana.
- **Euskera:** la gramática del texto `eu` está bien (*ez … baizik eta*, *teoremetan*). La terminología coincide con la de los nodos hermanos (*erreflexibotasun*, *iragankortasun*, *baliokidetasun-erlazio*).

No he guardado ningún commit.

══ TODO OK · 1 nodo(s): relacion-simetrica
VEREDICTO: ok
