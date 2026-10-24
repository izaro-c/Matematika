<!-- 2026-10-24 · opus/high · $2.56 · 63 turnos · corregido 6d493efc · propuestas b6c93f17 -->

## cociente-incremental — rigor ✗ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad △ · diagrama falta

### Correcciones
- [rigor] es/en/eu: «A medida que el incremento $h$ se aproxima a cero, dicha recta secante tiende a la recta tangente a la curva.» → «Si $f$ es <ConceptLink targetId="funcion-derivable">derivable</ConceptLink> en $x$, cuando $h$ tiende a cero esas rectas secantes tienden a la recta tangente a la gráfica en $(x, f(x))$.» — Tal como estaba, la frase es falsa en general. Con $x \mapsto \lvert x \rvert$ en $0$, las secantes no tienen límite y no hay tangente. En eu también desaparece el doble «-rekiko» de «kurbarekiko zuzen ukitzailearekiko joera du».
- [enlaces] es/en/eu: `<ConceptLink targetId="secante">recta secante</ConceptLink>` → `targetId="recta-secante-grafica"` — `secante` es la relación sintética entre dos rectas coplanares que se cortan en un punto. Las 32 menciones que tiene el corpus además de esta la usan en ese sentido. Aquí se trata de la recta que pasa por dos puntos de una gráfica. Quité el enlace de la segunda mención dentro del mismo párrafo.
- [enlaces] es/en/eu: «de la <ConceptLink targetId="recta">recta</ConceptLink> real» → «de la <ConceptLink targetId="numero-real">recta real</ConceptLink>» — `recta` es el primitivo de Hilbert, y la recta real es ℝ.
- [enlaces] es/en/eu: «Fijado un <ConceptLink targetId="punto">punto</ConceptLink> base $x \in I$» y «en el <ConceptLink targetId="punto">punto</ConceptLink> $x$» → sin enlace — Ese «punto» es un número real, no un elemento de $\mathcal{P}$. Mantengo el enlace a `punto` para $(x, f(x))$, que son puntos del plano cartesiano.
- [enlaces] es/en/eu: «función real» → «función <ConceptLink targetId="numero-real">real</ConceptLink>» — Era un WARN confirmado. Sigue el mismo criterio que `derivada`.
- [paridad] eu: «Oinarrizko $x \in I$ puntu bat» → «$x \in I$ oinarri-puntu bat» — «oinarrizko» significa «básico, elemental», no «base».
- [paridad] en (description): «between the variation of the dependent variable and the independent variable» → «… and that of the independent variable» — La frase en inglés no tenía sentido gramatical y no decía lo mismo que «y la de la variable independiente».

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «cuantifica la tasa de variación promedio que experimenta una función real por unidad de cambio en su variable independiente a lo largo de un intervalo. Constituye el núcleo analítico y geométrico previo al cálculo de variaciones instantáneas, sirviendo de puente deductivo hacia la derivada a través de la operación de límite.» → «de una función real entre dos puntos de un intervalo es el cociente entre la variación de la función y la de su variable independiente: mide cuánto cambia la función, en promedio, por cada unidad de cambio de la variable.»
  - «tasa… por unidad de cambio» era redundante.
  - La segunda frase solo valoraba.
  - En en, «calculus of instantaneous variations» se confunde con el cálculo de variaciones, que es otra disciplina.
  - El vínculo con la derivada ya lo da la propiedad «Fundamento de la derivada», que conserva los enlaces a `derivada` y `limite`.
  - Alternativa descartada: conservar una frase corta que remitiera a la derivada en la entrada.
- [diagrama] Nuevo `content/diagrams/Definiciones/CocienteIncremental.tsx`, importado en los tres MDX con `hasSimulation: true`. Añadí `<VisualBind>` para $\Delta y$ (`segDy`, pavo), $\Delta x = h$ (`segDx`, ocre), $(x, f(x))$ (`pP`, carbon) y $(x + h, f(x + h))$ (`pQ`, terracota).
- [paridad] eu: «$\mathbb{R}$ eremuan existitzen bada» → «$\mathbb{R}$ multzoan existitzen bada» — En matemáticas «eremu» es ambiguo (dominio, cuerpo), y el glosario lo desaconseja. No es un error en sentido estricto, por eso va en este nivel.

### Pendiente para la autora
- [fuentes] es/en/eu: «locator: "Capítulo 9"» (Spivak, *Calculus*) y «locator: "Capítulo 5"» (Rudin, *Principles*) — Coinciden con los capítulos de derivadas que yo conozco (Spivak cap. 9 «Derivatives», Rudin cap. 5 «Differentiation»), pero no los puedo comprobar con el repositorio. La numeración de Spivak cambia según la edición.

### Avisos de los scripts
- check-links «entre» / «between» / «artean» (es/en/eu) — descartado: «cociente de $f$ entre $x$ y $x + h$» y «entre dos puntos» no expresan la relación de intermediación $A * B * C$.
- check-links «real» (es/en), «erreal» (eu) — corregido: enlace a `numero-real`.
- check-links «oinarrizko» (eu) — corregido: era un error de vocabulario y ahora pone «oinarri-puntu».
- check-links «rectas secantes» / «secant lines» / «zuzen ebakitzaile» (aparecen tras los cambios) — descartado: la primera mención del párrafo ya enlaza a `recta-secante-grafica`, y la sugerencia `secante` tiene otro sentido.
- check-links «multzoan» (eu, aparece tras los cambios) — descartado: designa ℝ como conjunto de llegada, no el concepto de conjunto.

### Diagrama
La página lo necesitaba: mover $x$ y $x + h$ enseña tres cosas que el texto solo afirma.
- **Signo de $h$:** el cociente es la pendiente de la secante, con $\Delta x$ y $\Delta y$ como catetos, y vale lo mismo si $h$ es negativo.
- **$h \neq 0$:** si los dos puntos coinciden, la secante desaparece y un panel avisa de que el cociente no está definido. Es la hipótesis de la definición.
- **Límite:** al acercar $x + h$ a $x$, la secante (terracota) se acerca a la tangente discontinua (musgo), y el valor de $\Delta y / \Delta x$ se acerca al de $f'(x)$ del panel. Es la propiedad que he corregido.

Cómo está construido:
- La función fija es $f(x) = 0{,}05x^3 - 0{,}6x + 0{,}3$, con pendientes de los dos signos. $x$ y $x + h$ se arrastran por el eje.
- $P$ y $Q$ son puntos de la gráfica calculados por expresión. Sin pasos, porque es una definición.
- Usa la paleta oficial y las traducciones eu/en están completas. `verify-diagram` da `visual-exact`.
- No he podido mirar el aspecto en escritorio, tableta ni móvil. Conviene comprobar que el panel de arriba a la izquierda no tapa la curva en móvil.

### Resumen
He corregido la afirmación sobre secante y tangente, a la que le faltaba la hipótesis de derivabilidad, y tres enlaces que apuntaban a conceptos de Hilbert con otro sentido (`secante`, `recta`, `punto`). He creado el diagrama interactivo de la secante con sus VisualBind y he simplificado el párrafo inicial. Queda pendiente confirmar los locators de Spivak y Rudin.

══ TODO OK · 1 nodo(s): cociente-incremental
VEREDICTO: errores
