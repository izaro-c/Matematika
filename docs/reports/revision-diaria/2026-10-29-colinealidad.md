<!-- 2026-10-29 · opus/high · $1.39 · 40 turnos · errores → ok · 2 rondas, converge · corregido d98b6685 · corregido ed58f50a -->

<!-- ronda 1 · opus/high · $0.9 · 31 turnos · corregido d98b6685 · corregido ed58f50a -->

## colinealidad — rigor ✗ · simpleza △ · modularidad ✓ · enlaces △ · paridad ✓ · diagrama ✓

### Correcciones
- [rigor] es/en/eu: `\operatorname{col}` → `\operatorname{Col}` en las 5 fórmulas, incluidas las de `PropiedadItem` — convenciones-proyecto.md §3 fija «Colinealidad: $\operatorname{Col}(A,B,C)$». Esta era la única página del corpus con `col`; hay 12 con `Col`.
- [rigor] es: «la existencia de ternas no colineales postula que el plano no degenera en una recta (Axioma I.3), permite determinar planos en el espacio (Axioma I.4) y constituye la condición indispensable…» → «El Axioma I.3 postula que existen ternas no colineales, de modo que ninguna recta incide con todos los puntos; por el Axioma I.4, por cada terna no colineal pasa un plano del espacio, y la no colinealidad constituye la condición indispensable…». Los cambios en en y eu son equivalentes («Axiom I.3 postulates that non-collinear triples exist, so that no line is incident with all points; by Axiom I.4, through every non-collinear triple there passes a plane in space…»; «I.3 axiomak puntu ez-kolinealen hirukoteak existitzen direla postulatzen du, eta, beraz, ez dago puntu guztiekin intziditzen duen zuzenik; I.4 axiomaren arabera, hirukote ez-kolineal bakoitzetik plano bat igarotzen da espazioan…»). Razones: lo que postula es el axioma, no la existencia de las ternas. El Axioma I.3 del proyecto («Existen al menos tres puntos que no inciden con una misma recta») habla del conjunto de puntos, no del plano. «Determinar» supone unicidad, y la unicidad viene de I.5, no de I.4. Los mismos enlaces siguen en la frase, en otro orden.
- [rigor] es: «son colineales respecto a la recta ℓ si y solo si los tres inciden en ella» → «son colineales si y solo si existe una recta en la que inciden los tres (en la figura, la recta ℓ)». En en: «are collinear with respect to the line ℓ if and only if all three are incident with it» → «…if and only if there exists a line with which all three are incident (in the figure, the line ℓ)». En eu: «hiru puntu kolinealak dira ℓ zuzenarekiko baldin eta soilik baldin hirurak harekin intziditzen badira» → «puntuak kolinealak dira baldin eta soilik baldin hirurekin intziditzen duen zuzen bat existitzen bada (irudian, ℓ zuzena)». Razón: en la prosa ℓ era una recta fija, mientras que en la fórmula está cuantificada con $\exists\ell$. Se mantiene el `<VisualBind>`.
- [rigor] es «Recíprocamente» → «En cambio»; en «Conversely» → «By contrast»; eu «Alderantziz» → «Aitzitik». La frase define la negación de la colinealidad, no un recíproco.
- [rigor] es: «, impidiendo que la estructura colapse en una sola dimensión» → eliminado. En en: «, preventing the geometric structure from collapsing into a single dimension» → eliminado. En eu: «, egitura dimentsio bakarrera kolapsatzea eragotziz» → eliminado. Razón: la propiedad es un condicional y no impide nada; lo que excluye que todos los puntos estén en una recta es I.3. Además, «dimensión» no está definida en el marco sintético. Con esto desaparecen los WARN de «estructura» y «dimensión».
- [rigor] es «exige que los puntos pertenezcan a una misma recta» → «exige que los puntos incidan en una misma recta»; en «belong to the same straight line» → «be incident with the same line»; eu «zuzen berekoak izatea» → «zuzen berarekin intziditzea». Un punto no pertenece a una recta: hay que usar la incidencia (Golden Rule 6, convenciones §3).
- [enlaces] es/en/eu, propiedad `determinacion-plano-no-colinealidad`: «espacio» / «space» / «espazioan» quedan enlazados a `<ConceptLink targetId="espacio">`. Las convenciones (§7) piden enlazar la primera mención dentro de cada `PropiedadItem`.
- [simpleza] es/en/eu: la frase nueva del segundo párrafo pasaba de 50 palabras (59 en es, según check-style). La he dividido tras «tres o más puntos» (en es y en: «:» → «.»; en eu: «garrantzia berezia:» → «garrantzia berezia.»).

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [fuentes] es/en/eu, metadatos: `locator: "Capítulo I, §1 y §3"` — Los Axiomas I, que usan la noción de puntos «sobre una recta», están en el §2 según la tabla de convenciones. El §2 parece más adecuado que el §1, pero no puedo comprobarlo con el texto de Hilbert.
- [fuentes] es/en/eu, metadatos: Euclides, «Libro I, Definición 4» — Es la definición de línea recta, no de colinealidad. No puedo confirmar si la cita es intencionada.
- [rigor] Propiedad `colinealidad-orden-lineal`: la segunda cláusula («si un punto está entre otros dos, los tres son necesariamente colineales») repite la primera. Podría quedar en una sola frase: «por el Axioma II.1, si un punto está entre otros dos, los tres son puntos distintos de una misma recta». No la he cambiado porque no es un error.

### Avisos de los scripts
- check-links «estructura» / «geometric structure» / «egitura» (es/en/eu) — corregido: la cláusula se ha eliminado.
- check-links «dimensión» / «dimension» / «dimentsio» (es/en/eu) — corregido: la cláusula se ha eliminado.
- check-links «axiomen» (eu) — descartado: los enlaces ya están en «I.4» e «I.5», igual que en es y en, y «axioma» es un metaconcepto.
- check-style «ezinbesteko» (eu) — descartado: traduce «condición indispensable», que expresa necesidad y no valoración, igual que en es.
- check-style, frases de 59 y 53 palabras (es/en) — corregido: aparecieron con mi corrección y la frase se ha dividido.

### Diagrama
Es correcto y coherente con el texto:
- A y B son libres y la recta ℓ pasa por ambos. C está restringido a ℓ (`on-support`), así que siempre es colineal. D es libre.
- Los cinco `<VisualBind>` coinciden en id y color con el diagrama. Usa colores de la paleta oficial y tiene completas las traducciones a en y eu.

Hay dos configuraciones límite:
- Si se arrastra A sobre B, la recta deja de estar definida.
- D puede caer exactamente sobre ℓ.

Las dos son casos de medida nula y la nota pide mover D «fuera» de la recta, así que no lo considero un error.

### Resumen
He corregido la notación ($\operatorname{Col}$), la atribución de I.3 e I.4, la variable ℓ ligada en la prosa, el falso «recíprocamente», una cláusula sin justificar sobre el «colapso dimensional», la incidencia en lugar de la pertenencia y un enlace que faltaba a «espacio». Quedan para la autora los locators de Hilbert y de Euclides.

══ TODO OK · 1 nodo(s): colinealidad
VEREDICTO: errores

---

# Ronda 2: verificación

<!-- ronda 2 · opus/high · $0.49 · 9 turnos · sin cambios -->

## colinealidad — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad ✓ · diagrama ✓

He revisado la página entera y no he cambiado nada. No hay ningún commit en esta ronda.

### Correcciones
Nada.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- Los dos puntos de la ronda 1 siguen abiertos y no he podido resolverlos desde el repositorio:
  - [fuentes] es/en/eu, metadatos: `locator: "Capítulo I, §1 y §3"`. Por la tabla de convenciones, quizá debería ser §2 en lugar de §1.
  - [fuentes] es/en/eu, metadatos: Euclides, «Libro I, Definición 4». Esa es la definición de línea recta, no de colinealidad, y no sé si la cita es intencionada.
- [paridad, menor] eu: «Kontzeptu horrek hiru puntu edo gehiagoren kasuan hartzen du garrantzia berezia» dice «importancia especial», mientras que es dice «relevancia deductiva». El sentido es el mismo, así que no lo he cambiado. Si quieres una traducción más fiel, podría ser «garrantzi deduktiboa».

### Avisos de los scripts
- check-links «axiomen» (eu): descartado. El enlace ya está en «I.4» e «I.5», como en es y en. Además, «axioma» es un metaconcepto y aquí no lleva enlace propio.
- check-style «ezinbesteko» (eu): descartado. Traduce «condición indispensable», que dice que la condición es necesaria, no que sea valiosa.

### Diagrama
El diagrama está bien y coincide con el texto:
- **Construcción:**
  - A y B se mueven libremente y ℓ pasa por los dos.
  - C solo puede moverse sobre ℓ, así que siempre es colineal con A y B.
  - D se mueve libremente.
- **Enlaces con el texto:** los cinco `<VisualBind>` coinciden en id y color con el diagrama.
- **Etiqueta de la recta:** la etiqueta «Recta l» de `lineL` no se dibuja (no tiene `labelVisible`), así que no choca con la ℓ del texto.
- **Nota de exploración:** el coloreado de etiquetas distingue mayúsculas de minúsculas, así que la «a» de «a lo largo» no se colorea como el punto A.

Los dos casos límite que ya señaló la ronda 1 (A sobre B, D exactamente sobre ℓ) solo se dan en posiciones exactas, y la nota pide mover D «fuera» de la recta, así que no los cuento como error.

### Comprobación de la ronda 1
Todos sus cambios están en los tres idiomas y no han estropeado las frases:
- se escribe $\operatorname{Col}$ en las 5 fórmulas;
- la frase de I.3 e I.4 está reescrita;
- la recta ℓ ya no queda fijada en la prosa: «existe una recta… (en la figura, la recta ℓ)»;
- «Recíprocamente» se ha cambiado por «En cambio»;
- la cláusula del «colapso» se ha eliminado;
- «pertenezcan» se ha cambiado por «incidan»;
- «espacio» está enlazado en la propiedad;
- la frase larga está dividida.

### Otras comprobaciones
- **«Única» del Axioma I.1:** el texto dice que dos puntos distintos determinan «una única recta» por el Axioma I.1. En Hilbert la unicidad está en I.2, pero el Axioma I.1 del proyecto ya dice «existe exactamente una recta», así que la atribución es correcta.
- **Planos en la estructura:** la definición escribe la estructura como $(\mathcal{P}, \mathcal{L}, \mathbf{I})$, sin $\Pi$. Es la misma notación que usa el resto del corpus para la parte plana de la incidencia (`signatura`, `estructura-geometrica`), y la definición no necesita planos.

### Resumen
Ronda de verificación sin cambios. Las correcciones de la ronda 1 están aplicadas en es, en y eu. Para ti quedan los dos locators de las fuentes (Hilbert y Euclides) y un matiz opcional en la traducción a euskera.

No he podido volver a ejecutar validate-nodes porque esta sesión no me deja usar la terminal. Como no he cambiado nada, la línea de abajo es la del paquete que recibí, no de una ejecución mía:

══ TODO OK · 1 nodo(s): colinealidad
VEREDICTO: ok
