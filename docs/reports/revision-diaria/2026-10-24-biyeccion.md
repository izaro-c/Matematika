<!-- 2026-10-24 · opus/high · $1.26 · 43 turnos · corregido 9401d86d · propuestas a5f1020e -->

## biyeccion — rigor △ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✗ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: `<ConceptLink targetId="inyectividad">` y `<ConceptLink targetId="sobreyectividad">` sin `isDependency` → ahora llevan `isDependency={true}`. La definición se formula como «inyectiva y sobreyectiva», así que esos dos conceptos son antecedentes constitutivos. Que las páginas aún no existan no es motivo para omitir la dependencia (Pilar 2, Golden Rule 4).
- [enlaces] es/en/eu: el enlace `congruencia` sobre «la congruencia de figuras compuestas (como triángulos o polígonos)» tenía otro sentido. → «la `<ConceptLink targetId="congruencia-triangulos">`congruencia de dos triángulos (y, en general, de dos polígonos) se define a través de una correspondencia biyectiva entre sus vértices que preserva la `<ConceptLink targetId="congruencia">`congruencia de los lados y de los ángulos homólogos». `congruencia` es la relación primitiva entre segmentos y entre ángulos, no la congruencia de figuras. Además, «vértices homólogos» era circular, porque la propia correspondencia es la que define qué vértices son homólogos.
- [enlaces] es/en/eu: «imagen» / «image» / «irudi» → `<ConceptLink targetId="imagen">`, y «función inversa» dentro de `<Definicion>` → `<ConceptLink targetId="funcion-inversa">`. Los dos IDs ya se usan en `funcion` con el mismo sentido (convenciones §7).
- [paridad] en: «there exists a unique inverse function» → «there exists an inverse function». eu: «alderantzizko funtzio bakarra existitzen bada» → «alderantzizko funtzio bat existitzen bada». El texto `es` dice «existe una función inversa»: la unicidad es una consecuencia y no forma parte de la caracterización.
- [rigor] es/en/eu: «($|A| = |B|$)» → «($\lvert A \rvert = \lvert B \rvert$)». Para el cardinal, la tabla de notación pide `\lvert … \rvert` y desaconseja `|S|`.
- [paridad] eu: «Kodomeinuko elementu orori domeinuko gutxienez elementu bat dagokio irudi gisa» → «Kodomeinuko elementu oro domeinuko gutxienez elementu baten irudia da». La frase original convertía en imagen al elemento del dominio.
- [paridad] eu: «Isomorfismo formal bat egituren arteko bijekzio bat besterik ez da, … kontserbatzen dituena» → «… bijekzio bat da, … ere kontserbatzen dituena». «besterik ez da» («no es más que») añadía un matiz reductor que `es` no tiene, y faltaba el «además».
- [paridad] eu: «dagozkien erpin, alde eta angeluen kongruentzia kontserbatuz» → «alde eta angelu homologoen kongruentzia kontserbatzen duena». Decía que se conserva la congruencia de los vértices, y entre puntos no hay congruencia definida.
- [paridad] eu: «kodomeinoaren» → «kodomeinuaren» (errata).

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «Al combinar la preservación de distinciones con la cobertura exhaustiva del codominio, una biyección establece un emparejamiento uno a uno entre ambos conjuntos que garantiza la existencia de una función inversa bien definida.» → «La biyección empareja así uno a uno los elementos de ambos conjuntos, y el emparejamiento puede recorrerse en sentido contrario: asignar a cada elemento del codominio el único elemento del dominio del que es imagen define la `<ConceptLink targetId="funcion-inversa">`función inversa.» «Preservación de distinciones» era una paráfrasis opaca de la inyectividad. El párrafo nuevo explica por qué existe la inversa en lugar de afirmarlo sin más. La alternativa descartada era borrar el párrafo, ya que `<Definicion>` también menciona la inversa.
- [simpleza] es/en/eu: «Trascendencia estructural y aplicaciones geométricas» / «Las biyecciones desempeñan un papel vertebrador en múltiples ramas de la matemática:» → «Usos de las biyecciones» / «Tres nociones de ramas distintas se formulan mediante biyecciones:». «Trascendencia» y «vertebrador» valoran en vez de informar.
- [simpleza] es/en/eu: «isomorfismo formal» → «isomorfismo», porque «formal» es relleno (convenciones §4). Y «Transformaciones y congruencia:» → «Congruencia de figuras:», porque el apartado no habla de transformaciones.

### Pendiente para la autora
- [fuentes] es/en/eu, metadata: `{ title: "Algebra", author: "Serge Lang", locator: "Capítulo I, §1" }`. Según recuerdo, el cap. I, §1 de Lang trata de monoides, y la terminología de aplicaciones (inyectiva, sobreyectiva, biyectiva) está en los preliminares lógicos. Desde el repositorio no puedo comprobarlo. Halmos, *Naive Set Theory*, «Capítulo 8» (Functions) parece plausible, pero tampoco está verificado. Las dos fuentes se copiaron tal cual de `funcion`.

### Avisos de los scripts
- check-links «entre» / «between» / «artean» → `estar-entre`: descartado. Aquí significan «entre dos conjuntos» y no la intermediación geométrica.
- check-links «inverse» → `elemento-inverso`: descartado por tener otro sentido (inverso de una operación). Corregido con `funcion-inversa`, que es el sentido de esta página.
- check-links «domain» / «domeinu» → `dominio`: descartado. `dominio` es el dominio primitivo de una estructura, y la primera mención ya enlaza `dominio-funcion`.
- check-links «elementuak» → `elementos-euclides` (aparece con la propuesta): descartado. Es «elementos» de un conjunto, no la obra de Euclides.
- check-links «noranzko» → `sentido` (aparece con la propuesta): descartado. Es un uso coloquial («en sentido contrario»), no la orientación geométrica.

### Diagrama
No necesita. Es un concepto de teoría de conjuntos sin configuración geométrica. Un diagrama sagital no enseñaría nada que la definición no diga, y el sistema de diagramas del proyecto es geométrico.

### Resumen
Inyectividad y sobreyectividad pasan a ser dependencias. Se enlazan imagen, función inversa y congruencia de triángulos, se corrige la paridad de la inversa y la notación del cardinal, y se arreglan cuatro frases del euskera. Como propuesta, se simplifican el segundo párrafo y la sección de usos. Queda verificar los locators de Halmos y Lang.

══ TODO OK · 1 nodo(s): biyeccion
VEREDICTO: errores
