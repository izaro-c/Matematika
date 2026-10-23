<!-- 2026-10-23 · opus/high · $0.23 · 5 turnos · corregido cde8661a -->

## concepto-primitivo — rigor △ · simpleza △ · modularidad ✓ · enlaces △ · paridad ✗ · diagrama no necesita

### Cambios aplicados
- [paridad] eu: «<ConceptLink targetId="segmento">segmentuena</ConceptLink>» → «<ConceptLink targetId="segmento">zuzenkiena</ConceptLink>». Motivo: el glosario fija `zuzenkia` para «segmento» y marca *segmentu* como término desaconsejado.

### Pendiente para la autora
La página está aprobada, así que estas mejoras △ quedan como propuestas sin aplicar:

- [rigor] es/en/eu: «la <ConceptLink targetId="estar-entre">intermediación</ConceptLink> (orden lineal)». La intermediación es una relación ternaria, no un orden lineal: los órdenes lineales de cada recta se derivan de ella con los axiomas II. Propuesta: «(orden de los puntos sobre una recta)», o quitar el paréntesis.
- [rigor] es: «—un tipo de objeto o una relación—». Choca con el `<Definicion>`, que también admite «símbolos de relación u operación». Propuesta: «—un tipo de objeto, una relación o una operación—», con el mismo cambio en en/eu.
- [enlaces] es: «En un lenguaje formal». Es un concepto sin enlace. Propuesta: `<ConceptLink targetId="lenguaje-formal">`, igual en los tres idiomas. Es un meta-concepto, así que va sin `isDependency`.
- [enlaces] es: «los sistemas axiomáticos eligen». Esta es la primera mención y no lleva enlace; el enlace a `sistema-axiomatico` aparece después, en «sistema formal». Propuesta: poner el enlace en la primera mención.
- [paridad] en: «of the adopted <ConceptLink targetId="sistema-axiomatico">formal system</ConceptLink>». La palabra «adopted» no está en es («del sistema formal»). Propuesta: quitarla.
- [simpleza] es: `description` «Noción matemática fundamental…». Según la rúbrica, sobra el adjetivo que valora. Propuesta: «Noción de partida de una teoría formal, no definida a partir de otras, cuyo comportamiento fijan los axiomas.» El cambio se llevaría también a en y eu.

### Avisos de los scripts
- check-links «orden lineal» → `orden` (es): descartado. Es una glosa del paréntesis, no una mención del concepto de orden; además, la glosa misma está en «Pendiente».
- check-links «function» → `funcion` (en): descartado. Se refiere a «function symbols» de la signatura; en es dice «operación» sin enlace, y la paridad pide el mismo conjunto de enlaces en los tres idiomas.
- check-links «circle» → `circunferencia` (en): descartado. «fall into a circle» significa razonamiento circular, no la figura.
- check-links «multzoa» → `conjunto` (eu): descartado. Es un uso genérico sin papel constitutivo, y es («la totalidad», «el conjunto de todos los puntos») tampoco lo enlaza.
- check-links «alde» → `lado` (eu): descartado. Sale de «aldez aurreko» («previa»), no de «lado».

### Diagrama
No necesita diagrama. Es un concepto metamatemático (términos no definidos de una signatura), y el criterio excluye expresamente «concepto primitivo». Los objetos primitivos que nombra (punto, recta, plano, incidencia) se ilustran en sus propios nodos.

### Resumen
Cambio aplicado: en eu, «segmentuena» pasa a «zuzenkiena», según el glosario. Quedan como propuestas, al estar la página aprobada:
- la glosa «orden lineal» de la intermediación;
- incluir las operaciones en la primera frase;
- el enlace a `lenguaje-formal`;
- quitar «adopted» en en;
- quitar el adjetivo «fundamental» de la descripción.

══ TODO OK · 1 nodo(s): concepto-primitivo
VEREDICTO: errores
