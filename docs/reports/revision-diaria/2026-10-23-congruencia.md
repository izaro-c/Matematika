<!-- 2026-10-23 · opus/high · $0.73 · 11 turnos · propuestas 77c46375 -->

## congruencia — rigor ✓ · simpleza △ · modularidad △ · enlaces ✓ · paridad ✓ · diagrama no necesita

### Correcciones
Nada.

### Propuestas aplicadas — revisar
- [modularidad] es/en/eu: «denotada $\angle AOB \cong \angle A'O'B'$; cada ángulo está formado por dos semirrectas no colineales de origen común, contenidas en un plano $\pi \in \Pi$, aunque los dos ángulos comparados pueden estar en planos distintos.» → «denotada $\angle AOB \cong \angle A'O'B'$; los dos ángulos comparados pueden estar en planos distintos.»
  - **Razón:** la frase definía inline qué es un ángulo, que es un concepto externo (Golden Rule 12). El `<ConceptLink targetId="angulo">` ya remite a esa definición. Además, el $\pi$ que se nombraba no se usaba en ningún otro sitio.
  - **Se mantiene** lo propio de esta página: la relación puede comparar ángulos de planos distintos.
  - **Enlaces retirados en los tres idiomas:** `semirrecta` y `colinealidad`.
  - **Alternativa descartada:** dejar la frase como aclaración del dominio de $\cong_{\angle}$.
- [modularidad] es/en/eu: «Para triángulos, $\triangle ABC \cong \triangle A'B'C'$ significa siempre la congruencia respecto a la correspondencia ordenada $A \mapsto A'$, $B \mapsto B'$, $C \mapsto C'$:» más la fórmula desplegada de seis congruencias → «Para triángulos, esta extensión es la congruencia de triángulos.»
  - **Razón:** la frase y la fórmula repetían casi literalmente el enunciado formal de `congruencia-triangulos`, que ya incluye la correspondencia ordenada.
  - **Se mantiene** la primera frase de la nota, que es lo que esta página aporta: la noción se extiende de segmentos y ángulos a figuras compuestas.
  - **Alternativa descartada:** suprimir la `<Nota>` entera.

### Pendiente para la autora
Nada.

### Avisos de los scripts
- check-links «entre» (es), «between» (en), «artean» (eu): descartados. Aparecen en «biyección entre sus vértices» y sus traducciones, donde no significan intermediación.
- check-links «grupo» (es), «group» (en): descartados. Se refieren al «tercer grupo de axiomas», no a la estructura algebraica.

### Diagrama
No necesita. La congruencia es una relación primitiva: no tiene construcción que la figura pueda mostrar. Cualquier dibujo de dos segmentos o ángulos «iguales» enseñaría una idea métrica que la página quiere evitar. Las configuraciones que sí conviene manipular (transporte de segmentos y de ángulos, LAL) son de los axiomas III.1–III.5 y de `congruencia-triangulos`, que ya tiene diagrama.

### Resumen
No había errores. En nivel 2 se ha quitado la definición inline de ángulo y la fórmula de la nota, que repetía la de `congruencia-triangulos`; ahora ambas se remiten a sus `ConceptLink`. Queda la página sin diagrama, que no lo necesita.

══ TODO OK · 1 nodo(s): congruencia
VEREDICTO: mejoras
