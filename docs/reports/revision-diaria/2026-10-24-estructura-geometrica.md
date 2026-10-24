<!-- 2026-10-24 · opus/high · $1.1 · 52 turnos · corregido 51399a49 · propuestas 102c570f -->

## estructura-geometrica — rigor ✗ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad △ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu `description`: «Especificación formal compuesta por dominios de objetos y relaciones primitivas que satisfacen un sistema axiomático.» → «Interpretación de una signatura formal: dominios no vacíos de objetos con las funciones y relaciones que interpretan sus símbolos.». La `<Definicion>` no pide que se cumpla ningún axioma, y otros nodos (`axioma`, `isomorfismo`, `logica`) usan este ID para «estructura matemática» en general. La descripción antigua definía en realidad un modelo. Además, eran «las relaciones» las que «satisfacen» los axiomas, cuando quien los satisface es la estructura.
- [rigor] es: «Una **estructura matemática** $\mathcal{S}$ (o modelo) está» → «… $\mathcal{S}$ (un <ConceptLink targetId="modelo">modelo</ConceptLink> de una teoría si satisface sus axiomas) está». Igual en en («a model of a theory if it satisfies its axioms») y en eu («teoria baten eredua, haren axiomak betetzen baditu»). «(o modelo)» trataba estructura y modelo como lo mismo. El ID `modelo` ya se usa en `axioma.mdx` con este sentido.
- [rigor] es: «$\mathcal{S}_{\text{inc}} = (\dots)$, signatura de la parte plana» → «…, con la signatura de la parte plana». Igual en en («with the signature of …») y en eu («… zati lauaren signaturarekin; signatura hori … partekatzen dute»). Una estructura no es una signatura; la página misma distingue las dos cosas en su primera frase.
- [rigor] es/en/eu `sources`: «Capítulo I» / «Chapter I» / «I. Kapitulua» → «Capítulo I, §1» / «Chapter I, §1» / «I. kapitulua, §1». Para elementos y conceptos primitivos, convenciones-proyecto.md §2 manda usar `Capítulo I, §1`. El formato eu sigue el del resto del corpus.
- [paridad] eu: «Teoria erlazional hutsatan» → «Teoria erlazional hutsetan». El inesivo plural de *huts* es *hutsetan*.
- [paridad] eu: «<ConceptLink targetId="segmento">Segmentuen</ConceptLink>» → «Zuzenkien». Según el glosario, segmento se dice `zuzenkia`; *segmentu* está desaconsejado.
- [paridad] eu: «distantzia-funtzioak kongruentzia eta ordena ordezkatzen» → «zenbakizko distantzia-funtzioak kongruentzia eta ordena sintetikoak ordezkatzen». Faltaban los matices «numérica» y «sintéticas» que tienen es y en.

### Propuestas aplicadas — revisar
- [rigor] es/en/eu: «$\mathcal{S}_{\text{met}} = (\mathcal{P}, d)$» → «$\mathcal{S}_{\text{met}} = (\mathcal{P}, \mathbb{R}, d)$». Según la definición de la página, toda función va a un dominio, y $d \colon \mathcal{P} \times \mathcal{P} \longrightarrow \mathbb{R}$ no encajaba sin $\mathbb{R}$ como segundo dominio. El espacio vectorial ya hace lo mismo con $\mathbb{K}$. Alternativa descartada: dejar la notación habitual $(\mathcal{P}, d)$ y añadir una frase que avise de que no es una estructura de primer orden en sentido estricto.

### Pendiente para la autora
Nada.

### Avisos de los scripts
- check-links «elementuak» (eu) → `elementos-euclides`: descartado. En «haien elementuak lotzen dituen» la palabra se refiere a los elementos de los dominios, no a los *Elementos* de Euclides.

### Diagrama
No necesita. Es un concepto metamatemático (estructura, signatura, dominio), y el criterio los excluye: no hay ninguna configuración geométrica que manipular.

### Resumen
Ahora la descripción y la definición coinciden: una estructura no tiene que satisfacer ningún axioma, y la página ya no la confunde con un modelo ni con una signatura. También se han corregido el locator de Hilbert (§1) y el euskara (hutsetan, zuzenkia, paridad del espacio métrico). Como propuesta, el espacio métrico se escribe $(\mathcal{P}, \mathbb{R}, d)$. Las dos tandas están guardadas: correcciones en `51399a49` y propuestas en `102c570f`.

══ TODO OK · 1 nodo(s): estructura-geometrica
VEREDICTO: errores
