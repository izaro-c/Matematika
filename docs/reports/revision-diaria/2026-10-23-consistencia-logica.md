<!-- 2026-10-23 · opus/high · $1.11 · 48 turnos · corregido 20020c7f · propuestas 439b14e7 -->

## consistencia-logica — rigor ✗ · simpleza △ · modularidad △ · enlaces ✗ · paridad △ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: «ninguna teoría formal suficientemente expresiva es capaz de demostrar su propia consistencia interna mediante sus métodos deductivos propios» → «ninguna teoría formal consistente, recursivamente axiomatizable y que contenga la aritmética elemental puede demostrar su propia consistencia» — Tal como estaba, el enunciado es falso. Una teoría inconsistente demuestra cualquier fórmula, también la que afirma su propia consistencia. Y si la teoría no es recursivamente axiomatizable, el segundo teorema de incompletitud no se aplica.
- [rigor] es/en/eu: «Por este motivo, la metamatemática recurre a la **consistencia relativa**:» → «Las pruebas de consistencia son, en general, relativas (**consistencia relativa**): se construye un modelo de una teoría dentro de otra, y la primera es consistente si lo es la segunda.» — El «por este motivo» atribuía la prueba de Hilbert (1899) a un teorema de 1931. Además, el segundo teorema de incompletitud no se aplica a la geometría elemental de primer orden, porque no contiene la aritmética.
- [notación] es/en/eu: «$\mathcal{L}$» (dos veces) → «$\mathcal{L}_\sigma$» — convenciones §3: «Lenguaje/signatura: $\sigma$ o $\mathcal{L}_\sigma$; nunca $\mathcal{L}$ a secas».
- [enlaces] es/en/eu: «lenguaje formal» → `<ConceptLink targetId="lenguaje-formal">`; «la teoría de los números reales» → `<ConceptLink targetId="sistema-cuerpo-real">` — avisos confirmados de check-links. El ID es el canónico de convenciones §1, no `numero-real`, porque el texto habla de la teoría y no del número.
- [enlaces] es/en/eu: «Gödel», «Bolyai», «Lobachevski» sin enlace → `godel`, `bolyai`, `lobachevski` — Pilar 2: los matemáticos citados por nombre llevan enlace, y los tres IDs ya existen en el catálogo.
- [paridad/eu] eu: «$\varphi$ formula bakar batean ere ezin bada formalki eratorri $\varphi$ eta haren $\neg \varphi$ ezezkoa aldi berean» → «ez badago $\varphi$ formularik non $\varphi$ eta haren $\neg \varphi$ ezeztapena biak formalki erator daitezkeen» — El inesivo «formula bakar batean» no expresa la cuantificación. Para la negación lógica el término es «ezeztapena»; «ezezkoa» significa 'negativo'. El mismo cambio se ha hecho en `description`.
- [eu] eu: «geometria euklidearraren koherentzia erlatiboa ezarri zuen bere oinarrizko terminoak» → «haren oinarrizko terminoak»; «bere <ConceptLink …>teoremei</ConceptLink>» → «haren» — «bere» es reflexivo del sujeto (Hilbert, la inconsistencia), y aquí el referente es la geometría o la teoría.
- [eu] eu: «Henri Poincaré-k» → «Henri Poincarék»; «Poincareren diskoaren» → «Poincaréren diskoaren» — Grafía unificada: los nombres propios terminados en vocal pronunciada se declinan sin guion.

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «es la propiedad metateórica de una teoría formal o sistema deductivo que garantiza la ausencia de contradicciones internas» → «es la propiedad de una <ConceptLink targetId="teoria-formal">teoría formal</ConceptLink> de la que no se pueden deducir a la vez una fórmula y su negación» — La versión anterior era circular: una propiedad no «garantiza» lo que la propia propiedad es. La nueva primera frase define directamente.
- [simpleza] es/en/eu: «En consecuencia, la inconsistencia colapsa todo el edificio deductivo, despojando a sus teoremas de valor discriminatorio o epistémico.» → «Sus teoremas dejan entonces de distinguir unas fórmulas de otras.» — Quito retórica y digo lo mismo de forma literal. También «En los sistemas deductivos clásicos, si una teoría fuera contradictoria, … permitiría demostrar deductivamente» → «En la lógica clásica, una teoría inconsistente demuestra cualquier fórmula de su lenguaje».
- [enlaces] es/en/eu: IDs canónicos nuevos para conceptos sin enlace: «principio de explosión» → `principio-explosion`, «teorema de completitud» → `teorema-completitud-godel`, «segundo teorema de incompletitud» → `teorema-incompletitud-godel`. Alternativa descartada: un ID separado `segundo-teorema-incompletitud-godel`. Uno solo cubre los dos teoremas.
- [modularidad] es/en/eu: «**consistencia relativa**» en negrita → `<ConceptLink targetId="consistencia-relativa">` — La negrita presentaba un segundo concepto. Dejo el enlace y una cláusula que explica cómo se prueba, sin definirlo. Alternativa descartada: extraer ya el nodo `consistencia-relativa`. Lo dejo como página futura.
- [simpleza] es/en/eu: «ambas nociones coinciden plenamente» → «ambas nociones coinciden» (intensificador vacío); «quienes la demostraron … demostrando que la consistencia hiperbólica se reduce a la euclidiana» → «quienes la probaron …; así, la consistencia hiperbólica se reduce a la euclidiana» (repetición).

### Pendiente para la autora
- [historia] es: «estableció la consistencia relativa de la geometría euclidiana interpretando sus términos primitivos en el modelo cartesiano $\mathbb{R}^3$» — En el cap. II (§9), Hilbert construye el modelo sobre el cuerpo numerable Ω de números algebraicos, y me parece que lo hace con pares de coordenadas, es decir, en el plano. ℝ hace falta solo para incluir la completitud (V.2). No puedo comprobar desde el repositorio si la 7.ª edición plantea el modelo en el plano o en el espacio. Conviene revisar la frase.
- [fuentes] es/en/eu: la fuente secundaria de Gödel es el artículo de incompletitud (*Monatshefte* 38, 1931). El teorema de completitud, que se usa en la `<Definicion>`, es de «Die Vollständigkeit der Axiome des logischen Funktionenkalküls» (*Monatshefte* 37, 1930). No he añadido esta fuente porque no puedo comprobar la referencia.
- [historia] es: «Eugenio Beltrami (1868) … mediante modelos analíticos en el plano euclídeo» — El *Saggio* de 1868 usa superficies de curvatura constante, como la pseudoesfera, y no solo modelos planos. Klein y Poincaré van sin fecha. Sin verificar.
- [eu] «(edo betegarria)» para «satisfacible»: el glosario reserva «betegarria» para «suplementario». En este contexto no hay ambigüedad, pero conviene fijar el término lógico en el glosario.

### Avisos de los scripts
- check-links «lenguaje formal» (es), «formal language» (en) — corregido (`lenguaje-formal`).
- check-links «números reales» (es), «real numbers» (en), «zenbaki errealen» (eu) — corregido con `sistema-cuerpo-real` en lugar del `numero-real` que sugería el script, porque la frase habla de la teoría (convenciones §1).

### Diagrama
No necesita. Es un concepto metamatemático: no hay ninguna configuración geométrica que manipular, y los modelos que cita (cartesiano, disco de Poincaré) tienen su propio nodo.

### Resumen
He corregido el enunciado del segundo teorema de incompletitud (le faltaban hipótesis) y he quitado su falso nexo causal con la consistencia relativa. También he aplicado la notación $\mathcal{L}_\sigma$, he añadido los enlaces que faltaban y he arreglado la gramática del euskara. En nivel 2 he simplificado la apertura y he propuesto IDs nuevos (`principio-explosion`, `teorema-completitud-godel`, `teorema-incompletitud-godel`, `consistencia-relativa`). Queda para la autora comprobar en los *Grundlagen* el modelo de Hilbert (¿Ω o ℝ? ¿plano o espacio?) y la fuente del teorema de completitud.

══ TODO OK · 1 nodo(s): consistencia-logica
VEREDICTO: errores
