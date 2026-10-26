<!-- 2026-10-25 · opus/high · $0.68 · 30 turnos · corregido 6f6eff06 · propuestas 4b282eea -->

## geometria-sintetica — rigor △ · simpleza ✓ · modularidad ✓ · enlaces ✗ · paridad ✗ · diagrama no necesita

### Correcciones
- [enlaces] es/en/eu: «en los *Elementos*» / «in the *Elements*» / «*Elementuak* lanean» → `<ConceptLink targetId="elementos-euclides">*Elementos*</ConceptLink>` (y lo mismo en en y eu). Es el ID que ya usa todo el corpus (`euclides`, `sistema-axiomatico` y más de 25 nodos) y era un WARN real de check-links.
- [enlaces] es/en/eu: `targetId="perspectiva"` sobre «perspectividad» / «perspectivity» / «perspektibitatea» → `targetId="perspectividad"`. Una perspectiva (la técnica de proyección) y una perspectividad (la aplicación proyectiva con centro) son conceptos distintos. `perspectiva` solo aparecía en esta página.
- [simpleza] es: «por <Moritz Pasch>, <Giuseppe Peano> y culminada por» → «por <Moritz Pasch> y <Giuseppe Peano>, y culminada por». Como estaba, la coma convertía «y culminada» en el último elemento de la enumeración de autores.
- [paridad] eu: «(<puntuak>, <zuzenak> eta <planoak>)» → «(adibidez, <puntuak>, <zuzenak> eta <planoak>)». En `es` dice «como puntos, rectas y planos», que es una lista de ejemplos. Sin «adibidez», la versión en eu los presentaba como todos los primitivos, y en Hilbert también lo son las relaciones.
- [paridad] en: «Initiated at the end of the 19th century» → «Developed at the end of the 19th century». En `es` dice «Desarrollada».
- [paridad] eu metadata: `locator: "I. Liburukia"` → `locator: "I. liburua"`. En `es` dice «Libro I», y *liburuki* es «tomo». El corpus usa mayoritariamente «I. liburua» (teorema-pitagoras, teorema-tales, etc.).

### Propuestas aplicadas — revisar
- [rigor] es/en/eu: «se contrapone conceptualmente a la <geometría analítica> de <René Descartes> y <Pierre de Fermat>, donde los puntos se identifican con elementos de $\mathbb{R}^n$» → «se contrapone a la <geometría analítica>, iniciada por <René Descartes> y <Pierre de Fermat>, en la que los puntos se identifican con elementos de $\mathbb{R}^n$». Así no se atribuye a Descartes y Fermat la identificación con $\mathbb{R}^n$, que es moderna. También se quita «conceptualmente», que no añadía nada. En eu: «… kontrajartzen zaio. <René Descartesek> eta <Pierre de Fermatek> abiarazitako geometria horretan, puntuak …», que además sustituye el «izan ere» causal. Descarté como alternativa mantener la atribución y quitar $\mathbb{R}^n$: así se perdía la fórmula, que es lo que caracteriza el método analítico.
- [rigor] es/en/eu: «a partir de un sistema axiomático formal» → «a partir de un sistema axiomático». Con «formal», el criterio 1 contradecía la propia sección histórica: incluye a Euclides y a la escuela proyectiva y luego atribuye a Hilbert la eliminación de la intuición. Ni Euclides ni Poncelet tenían un sistema formal.
- [rigor] es/en/eu: «Fundada por Euclides» / «Founded by» / «sortua» → «Sistematizada por» / «Systematized by» / «sistematizatua». Los *Elementos* recogen y ordenan geometría griega anterior (Eudoxo, Teeteto).
- [historia] es/en/eu: «Desarrollada por Poncelet, Steiner y von Staudt, mostró que conceptos como la razón doble y la perspectividad pueden fundarse sin referencia métrica» → «Iniciada por Poncelet, que estudió las propiedades de las figuras que se conservan por proyección central (perspectividad) y sección, y desarrollada por Steiner y von Staudt. Von Staudt la fundó sin referencia métrica: sustituyó la definición de la razón doble mediante distancias por construcciones de incidencia.» Es la atribución que ya dan `poncelet` y `staudt`. Además, la perspectividad se define por incidencia y nunca tuvo base métrica, así que no tenía sentido decir que se refundó sin ella. Se enlazan `distancia` e `incidencia`.
- [historia] es/en/eu metadata: la fuente de Poncelet pasa de `role: "secondary"` a `"primary"` (es una obra original), y se añade `Grundlagen der Geometrie`, Cap. I, porque la página atribuye a Hilbert la refundación axiomática.

### Pendiente para la autora
- [historia] es/en/eu metadata: `{ title: "Traité des propriétés projectives des figures", author: "Jean-Victor Poncelet", locator: "Introducción" }`. Comprobar que la Introducción es el pasaje que defiende la geometría pura frente al análisis.

### Avisos de los scripts
- check-links «*Elementos*» / «*Elements*» / «*Elementuak*» (es/en/eu): corregido.
- check-links «independence» (en): descartado. Es «Coordinate independence», no la independencia lógica de axiomas.
- check-links «independentzia» (eu): descartado por la misma razón («Koordenatuekiko independentzia»).
- check-links «alde» (eu): descartado. Es parte de la locución «aldez aurretik» («de antemano»), no «lado».

### Diagrama
No necesita. Probé a imaginar una figura doble: una construcción con regla y compás (por ejemplo, el punto medio) junto a su cálculo en coordenadas, donde el lector movería los puntos. Lo que enseñaría es esa construcción concreta, no la noción de método sintético. Como este concepto metodológico no tiene ninguna condición que el lector pueda romper una a una, la figura solo repetiría la prosa.

### Resumen
He corregido dos enlaces (`elementos-euclides` y `perspectividad`), la coordinación de la lista en es, la paridad en eu («adibidez», «I. liburua») y en en («Developed»). Como propuestas, quito el anacronismo de Descartes/Fermat con $\mathbb{R}^n$, el «formal» que contradecía la historia y «Fundada». También reparto la historia proyectiva entre Poncelet y von Staudt, y añado a Hilbert como fuente. Queda para la autora comprobar el locator de la fuente de Poncelet.

══ TODO OK · 1 nodo(s): geometria-sintetica
VEREDICTO: errores
