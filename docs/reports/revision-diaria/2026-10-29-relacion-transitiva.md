<!-- 2026-10-29 · opus/high · $1.65 · 36 turnos · errores → ok · 2 rondas, converge · corregido 505eb6a7 · propuestas a79c70b1 -->

<!-- ronda 1 · opus/high · $0.95 · 29 turnos · corregido 505eb6a7 · propuestas a79c70b1 -->

## relacion-transitiva — rigor ✗ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✓ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: «no es autoevidente ni deducible de la reflexividad: debe ser postulada expresamente en el Axioma III.2» → «no se postula en esta forma: el Axioma III.2 postula que dos segmentos congruentes con un tercero son congruentes entre sí, y la transitividad se deduce como teorema de este axioma y de la reflexividad del Axioma III.1» (en: «is not postulated in this form: Axiom III.2 postulates…»; eu: «ez da forma horretan postulatzen: III.2 axiomak postulatzen du…»). La frase anterior era falsa. III.2 dice $\overline{AB}\cong\overline{CD}\land\overline{AB}\cong\overline{EF}\implies\overline{CD}\cong\overline{EF}$, y la propia página `axioma-congruencia-2` explica que la simetría y la transitividad se deducen de III.1 y III.2. La etiqueta de la viñeta pasa de «Postulación en congruencia» a «Congruencia de segmentos». También se quita la muletilla de marco «En la fundamentación sintética».
- [rigor] es/en/eu: `<ConceptLink targetId="relacion-binaria">` en `<Definicion>` → `isDependency={true}`. La definición no se puede formular sin relación binaria; las páginas hermanas `relacion-simetrica` y `relacion-reflexiva` ya la marcan como dependencia.
- [simpleza] es: «### Rol fundamental en la congruencia y el paralelismo» + «La transitividad actúa como piedra angular en las deducciones geométricas fundamentales:» → «### Transitividad en la congruencia y el paralelismo», sin frase introductoria. Lo mismo en en («Fundamental role…» / «cornerstone») y eu («Funtsezko eginkizuna…» / «oinarrizko harria»). Es relleno valorativo, y los WARN de check-style lo confirman.
- [simpleza] es/en/eu: «teorema capital» / «pivotal theorem» / «teorema nagusi bat» → «teorema» / «theorem» / «teorema bat». También es relleno valorativo.
- [paridad/eu] eu: «Playfairren paraleloen postulutik» → «Playfairren paraleloen postulatutik». «postulu» no existe; Elhuyar da «postulado» → *postulatu* (https://hiztegiak.elhuyar.eus/es/postulado).
- [enlaces] es/en/eu: primeras menciones sin enlace de «segmentos», «plano», «rectas», «reflexividad» y «Playfair» → `segmento`, `plano`, `recta`, `relacion-reflexiva`, `playfair`. `playfair` ya se usa en el corpus. Se añade también el enlace a `axioma-congruencia-1`, que la nueva frase cita.

### Propuestas aplicadas — revisar
- [simpleza] es/en/eu: «si el vínculo relacional se propaga necesariamente a través de elementos intermedios encadenados» → «si, siempre que un elemento está relacionado con un segundo y este con un tercero, el primero está relacionado con el tercero». La primera frase era una metáfora con un intensificador prohibido («necesariamente»); ahora define, como en las páginas hermanas. Se enlaza además «relación binaria» en esta primera mención, sin dependencia.
- [simpleza] es/en/eu: «Constituye la propiedad formal que permite transferir igualdades, equivalencias y ordenaciones, asegurando que las comparaciones indirectas conserven la misma validez lógica que las directas.» → «Es una de las tres condiciones que definen una relación de equivalencia, junto con la reflexividad y la simetría, y una de las que definen un orden parcial, junto con la reflexividad y la antisimetría.» El párrafo anterior era vago, y «validez lógica» era engañoso. El nuevo copia la forma de `relacion-reflexiva` y `relacion-simetrica`. Alternativa descartada: suprimir el párrafo sin más.
- [enlaces] es/en/eu: «composición relacional» → `<ConceptLink targetId="composicion-relaciones">`. Es un ID canónico nuevo; el `composicion-funciones` que sugiere check-links tiene otro sentido.
- [simpleza/enlaces] es: «**Estructuras de orden:** En los conjuntos ordenados, la transitividad garantiza la coherencia de las cadenas de desigualdades» → «**Relaciones de orden:** Toda relación de <ConceptLink targetId="orden">orden</ConceptLink> es transitiva por definición, lo que permite encadenar desigualdades». En en: «Order relations: Every order relation is transitive by definition, which allows inequalities to be chained». En eu: «Ordena-erlazioak: Ordena-erlazio oro iragankorra da definizioz, eta horri esker desberdintzak kateatu daitezke». Se usa `orden` para el orden estricto $<$, como en `orden-angulos`.

### Pendiente para la autora
- [historia] es/en/eu: fuentes «Naive Set Theory», Halmos, «Capítulo 7» y Suppes, «Capítulo 3». No he podido comprobar los capítulos desde el repositorio.
- [estructura] El título de la sección («Transitividad en la congruencia y el paralelismo») no cubre la tercera viñeta, la de las relaciones de orden. El título original tenía el mismo desajuste. Habría que ampliarlo (por ejemplo, «Ejemplos») o sacar esa viñeta de la sección; lo dejo a tu criterio.

### Avisos de los scripts
- check-style «fundamental», «piedra angular», «fundamentales» (es), «fundamental», «cornerstone» (en), «funtsezko» (eu): corregido.
- check-links «reflexividad»/«reflexivity» (es/en): corregido, enlazado a `relacion-reflexiva`.
- check-links «segmentos»/«segment»/«zuzenkien», «plano»/«plane», «lines»/«zuzenek»: corregido.
- check-links «composición»/«composition»/«konposizioa» (es/en/eu): corregido en la primera mención con `composicion-relaciones`. La segunda mención está en el mismo párrafo y no se enlaza. `composicion-funciones` se descarta porque tiene otro sentido.
- check-links «estructuras»/«structures» (es/en): desaparece con la nueva viñeta. `estructura-geometrica` tampoco era el sentido correcto.
- check-links «directa», «lógica» (es) y «koherentzia», «oinarrizko», «tarte» (eu): desaparecen al reescribir los párrafos; además no tenían sentido técnico.
- check-links «entre» (es) y «artean» (eu): descartado. Es «entre sí» / «elkarren artean», no intermediación.

### Diagrama
No necesita. Probé a imaginar un diagrama de flechas sobre un conjunto finito, al estilo de `FuncionSagital`, en el que el lector añade o quita pares y el panel marca qué terna $(x,y,z)$ rompe la transitividad. Enseñaría algo, pero tendría más sentido como diagrama compartido de `relacion-equivalencia`, que ya reúne las tres propiedades; las páginas hermanas `relacion-reflexiva` y `relacion-simetrica` tampoco tienen diagrama propio. Si la autora lo quiere, lo propondría allí.

### Resumen
He corregido la afirmación falsa de que el Axioma III.2 postula la transitividad (se deduce de III.1 y III.2). También he marcado `relacion-binaria` como dependencia, quitado el relleno valorativo y «postulutik», y añadido los enlaces que faltaban. Como propuestas, he reescrito la primera frase y el segundo párrafo siguiendo las páginas hermanas y enlazado `composicion-relaciones` y `orden`. Quedan pendientes los locators de las fuentes y el título de la sección.

══ TODO OK · 1 nodo(s): relacion-transitiva
VEREDICTO: errores

---

# Ronda 2: verificación

<!-- ronda 2 · opus/high · $0.71 · 7 turnos · sin cambios -->

## relacion-transitiva — rigor ✓ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad ✓ · diagrama no necesita

En esta ronda no he encontrado errores y no he cambiado nada. No hay ningún commit. La validación pasa sin errores.

### Correcciones
Nada.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [fuentes] es/en/eu: Halmos, *Naive Set Theory*, «Capítulo 7», y Suppes, *Axiomatic Set Theory*, «Capítulo 3». La ronda 1 ya lo dejó pendiente. Desde el repositorio no se pueden comprobar los capítulos.
- [estructura] El título «Transitividad en la congruencia y el paralelismo» no cubre la tercera viñeta, «Relaciones de orden». La ronda 1 también lo dejó pendiente, y no lo cambio porque es cuestión de criterio.
- [diagrama] Un diagrama de flechas sobre un conjunto finito podría servir a la vez a `relacion-reflexiva`, `relacion-simetrica`, `relacion-transitiva` y `relacion-equivalencia`. En esta página, el panel marcaría la flecha $x \to z$ que falta en cada terna. Si lo quieres, conviene hacerlo como diagrama compartido desde `relacion-equivalencia` y no crearlo solo aquí.

### Comprobación de los cambios de la ronda 1
Están aplicados y son correctos en los tres idiomas:
- **Axioma III.2 y transitividad.** La frase nueva es correcta: el Axioma III.2 da la transitividad a partir de la reflexividad del Axioma III.1. Coincide con lo que dice `axioma-congruencia-1` (línea 37: «todo segmento es congruente consigo mismo») y con `axioma-congruencia-2` (línea 28).
- **`isDependency` en `relacion-binaria`.** Está en los tres idiomas.
- **Términos y enlaces.** «postulatutik» está corregido en eu. `playfair` es el mismo ID que usan `axioma-paralelas-euclides` y `sistema-euclidiano` para el matemático. En eu, «IV. axiomatik» sigue la forma de los otros 21 archivos en euskera.
- **Primera frase y segundo párrafo reescritos.** Son correctos. Las condiciones de la relación de equivalencia y del orden parcial están bien enumeradas.

### Revisión desde cero
- **Rigor.** La fórmula de la definición y $R \circ R \subseteq R$ son equivalentes. La transitividad del paralelismo es correcta tal como se enuncia: es un enunciado del plano, con paralelismo reflexivo, y se obtiene de Playfair (si $\ell$ y $n$ se cortan en $P$, ambas son paralelas a $m$ por $P$, luego coinciden). La viñeta del orden es correcta.
- **Euskera.** La gramática es correcta, y los términos *iragankor*, *erreflexibotasun*, *baliokidetasun-erlazio*, *desberdintza*, *zuzenki* y *postulatu* corresponden a los de Elhuyar y del glosario. Que eu diga «plano euklidearreko paralelotasunari» donde es dice «paralelismo euclídeo» no cambia el sentido.

### Avisos de los scripts
- check-links «composición» (es), «composition» (en) y «konposizioa» (eu): descartado. Es la segunda mención dentro de la misma `<Definicion>`, y la primera ya enlaza a `composicion-relaciones`. `composicion-funciones` significa otra cosa.
- check-links «entre» (es, 2×) y «artean» (eu, 2×): descartado. Aparecen en «entre sí» y «elkarren artean», que no son intermediación (`estar-entre`).

### Diagrama
No necesita diagrama propio. La manipulación que tendría sentido sería añadir y quitar flechas sobre un conjunto finito y ver qué terna rompe la transitividad. Eso enseña más en un diagrama compartido por las cuatro páginas de relaciones que en uno aislado aquí. La ronda 1 llegó a la misma conclusión; la idea queda en «Pendiente para la autora».

### Resumen
He revisado la página de nuevo y he comprobado las correcciones de la ronda 1: no hay errores ni mejoras claras. Siguen pendientes los capítulos de las fuentes y el título de la sección.

══ TODO OK · 1 nodo(s): relacion-transitiva
VEREDICTO: ok
