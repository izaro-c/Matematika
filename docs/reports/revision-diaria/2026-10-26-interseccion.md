<!-- 2026-10-26 · opus/high · $1.18 · 37 turnos · corregido 273482d8 · propuestas 2d50f20c -->

## interseccion — rigor ✗ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✗ · diagrama △

### Correcciones
- [rigor] es/en/eu: «Constituye la base formal para definir regiones geométricas compuestas, restricciones de <ConceptLink targetId="dominio">dominio</ConceptLink> e <ConceptLink targetId="incidencia">incidencias</ConceptLink> entre figuras.» → «Permite definir regiones geométricas compuestas y describir los puntos comunes a dos figuras.» — La incidencia es una relación primitiva, así que la intersección no la define. Además, `dominio` es el dominio de una estructura, que no es el sentido de «restricción de dominio».
- [rigor] es/en/eu: «El interior de un ángulo se define formalmente como la intersección de dos semiplanos abiertos determinados por sus rectas soporte.» → «El interior de un ángulo es la intersección de dos semiplanos abiertos: para cada lado, el limitado por su recta soporte que contiene al otro lado.» — Dos rectas determinan cuatro semiplanos abiertos, así que la frase original no decía cuáles. Se quita también «formalmente», que es relleno prohibido (§4).
- [rigor] es/en/eu: «La región interior de un triángulo o polígono convexo surge de la intersección finita de los semiplanos asociados a sus lados.» → «El interior de un triángulo es la intersección de tres semiplanos abiertos: para cada lado, el limitado por su recta soporte que contiene al vértice opuesto. El de un polígono convexo se obtiene igual, con un semiplano por lado.» — «Asociados» no decía de qué lado de cada recta está el semiplano.
- [rigor] es/en/eu: «- Asimismo, la posición relativa de dos rectas coplanares se caracteriza por su corte puntual: … con punto común $P \in \operatorname{tr}(\ell_1) \cap \operatorname{tr}(\ell_2)$, frente a rectas paralelas disjuntas …» → párrafo propio: «La intersección distingue también las posiciones de dos rectas coplanares distintas: dos rectas secantes $\ell_1$ y $\ell_2$ tienen un único punto común, $\operatorname{tr}(\ell_1) \cap \operatorname{tr}(\ell_2) = \{P\}$, y dos rectas paralelas distintas no tienen ninguno: …». Hay tres problemas:
  - $P \in \operatorname{tr}\cap\operatorname{tr}$ también se cumple cuando las rectas coinciden. Según el nodo `secante`, el punto común es único.
  - El paralelismo es reflexivo, así que hay que decir «distintas».
  - Este punto estaba en la lista de «preserva la convexidad», pero no habla de convexidad.
  
  Lo pongo en el nivel 1 porque la colocación hacía una afirmación falsa.
- [enlaces] es/en/eu: «interior» (ángulo y triángulo) y «vértice» no tenían enlace → `interior-angulo`, `interior-triangulo`, `vertice` (IDs que ya usa el corpus) — Pilar 2.
- [paridad] en: «<Capitular letra="I" />ntersection **is** an operation» → «<Capitular letra="I" />**ntersection** is an operation» — La negrita iba sobre «is» en lugar de sobre el término, como en `es` y `eu`.
- [paridad] en: «carrier lines» → «supporting lines» — Es la traducción que usa el corpus para `recta-soporte`.
- [paridad] eu: «konmutatibotasunaren», «elkartzearen» → «trukakortasunaren», «elkarkortasunaren» — Son los términos que usa el corpus (`grupo`, `operacion-binaria`, `elemento-inverso`) y la forma de Elhuyar. «Elkartze» significa «asociación» como acción, no la propiedad.
- [paridad] eu: «…eta zuzen paralelo disjuntuak $\ldots = \emptyset$ bada.» → «…eta bi zuzen paralelo desberdinek ez dute bat ere: $\ldots = \emptyset$.» — La frase original no tenía verbo principal y no se podía leer.
- [diagrama] Interseccion.tsx: en `note` y en el `ariaLabel` de `pP` (es/en/eu), «P = ℓ₁ ∩ ℓ₂» → «{P} = tr(ℓ₁) ∩ tr(ℓ₂)» — El forma `X ∩ ℓ` está prohibida (§3), y un punto no es igual a un conjunto.

### Propuestas aplicadas — revisar
- [enlaces] es/en/eu: «se corresponde directamente con el conectivo de conjunción lógica ($\land$)» → «se corresponde con el conectivo de <ConceptLink targetId="conjuncion">conjunción</ConceptLink> ($\land$)» — Es un ID canónico nuevo. La alternativa descartada era `conjuncion-logica`. También se quita «directamente».
- [enlaces] es/en/eu: «idempotencia ($A \cap A = A$)» → con <ConceptLink targetId="idempotencia"> — Es un ID canónico nuevo.

### Pendiente para la autora
- [fuentes] es/en/eu: «Naive Set Theory … locator: "Capítulo 4"» y «Théorie des ensembles … "Capítulo II, §1"» — No puedo comprobar desde el repositorio que esas secciones correspondan a la intersección.

### Avisos de los scripts
- check-links «entre»/«between» (es/en), las dos menciones originales — descartado: en «operación entre conjuntos» y «between sets», la palabra no tiene el sentido de intermediación. La otra mención («incidencias entre figuras») desapareció con la corrección.
- check-links «vértice»/«vertex»/«erpina» (aparecieron con el texto nuevo) — corregido: se ha enlazado a `vertice`.

### Diagrama
La construcción coincide con el texto. Hay dos rectas, cada una definida por dos puntos libres, y P es la intersección de `lineL1` y `lineL2`. Los `VisualBind` (`lineL1` terracota, `lineL2` pavo, `pInter` mora) coinciden con el diagrama.

Tiene dos límites, de los que no me he ocupado:
- **No se puede ver el caso vacío.** Con puntos libres, el paralelismo exacto no se consigue arrastrando, así que nunca aparece $\operatorname{tr}\cap\operatorname{tr}=\emptyset$, que el texto contrasta.
- **Ilustra un caso marginal de la página.** El ejemplo central de una intersección es el interior de un ángulo como intersección de dos semiplanos.

Una mejora futura sería sombrear los dos semiplanos y su intersección, o poner un control que fuerce el caso paralelo. No lo he aplicado porque cambia el diagrama entero.

### Resumen
Corrige la afirmación falsa sobre la incidencia, el enlace a `dominio` con otro sentido, la imprecisión de los semiplanos en los interiores y el caso de las rectas secantes y paralelas. También corrige la negrita del capitular en `en`, la terminología en `eu` y la notación del diagrama. Propone los enlaces `conjuncion` e `idempotencia`. Quedan pendientes los locators de las fuentes y un diagrama mejor.

══ TODO OK · 1 nodo(s): interseccion
VEREDICTO: errores
