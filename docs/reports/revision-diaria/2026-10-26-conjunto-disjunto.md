<!-- 2026-10-26 · opus/high · $2.4 · 52 turnos · corregido 3a8a9bae · propuestas f042426f -->

## conjunto-disjunto — rigor ✗ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✓ · diagrama falta

### Correcciones
- [rigor] es: «si cualesquiera dos conjuntos distintos de la familia tienen intersección vacía» → «si cualesquiera dos miembros con índices distintos tienen intersección vacía». La fórmula dice $i \neq j$, es decir, índices distintos, y la prosa decía «conjuntos distintos», que no es lo mismo. Contraejemplo: con $A_1 = A_2 = \{1\}$ la prosa da la familia por disjunta y la fórmula no. Mismo cambio en en: «any two distinct sets in the family» → «any two members with distinct indices». Y en eu: «familiako edozein bi multzo desberdinek» → «indize desberdineko edozein bi kidek».
- [rigor] es: «Si la familia tiene al menos dos miembros ($\lvert I \rvert \ge 2$)» → «Si el conjunto de índices tiene al menos dos elementos ($\lvert I \rvert \ge 2$)». $\lvert I \rvert$ cuenta índices, no miembros distintos. Mismo cambio en en: «If the family has at least two members» → «If the index set has at least two elements». Y en eu: «Familiak gutxienez bi kide baditu» → «Indize-multzoak gutxienez bi elementu baditu».
- [enlaces] es/en/eu: `<ConceptLink targetId="conjunto-vacio">` → `<ConceptLink targetId="conjunto-vacio" isDependency={true}>`. La definición es literalmente $A \cap B = \emptyset$. El conjunto vacío es tan constitutivo como `interseccion`, que ya era dependencia (Pilar 3, Golden Rule 4).
- [simpleza] es: «Familia de Conjuntos Mutuamente Disjuntos (Disjuntos dos a dos)» → «Familia de conjuntos mutuamente disjuntos (disjuntos dos a dos)». En eu: «Binaka Disjuntuak diren Multzoen Familia (…)» → «Binaka disjuntuak diren multzoen familia (…)». Ni el castellano ni el euskera ponen mayúscula en cada palabra de un título, y el resto del corpus usa mayúscula solo en la primera palabra. En en se mantiene, porque allí sí se usan mayúsculas de título.

### Propuestas aplicadas — revisar
- [diagrama] Nuevo `content/diagrams/Definiciones/ConjuntosDisjuntos.tsx`, importado en los tres MDX con `hasSimulation: true`. Muestra tres conjuntos $A_1, A_2, A_3$ como círculos de Venn y tres elementos $1, 2, 3$ que se arrastran entre las siete regiones o se sacan fuera (`on-points`).
  - Empieza con el contraejemplo del texto.
  - Un panel indica uno de tres estados: disjuntos dos a dos (musgo), «se cortan dos a dos, pero $\bigcap A_i = \emptyset$» o «$\bigcap A_i \neq \emptyset$» (granada).
  - Un anillo granada marca cada elemento que está en dos o más conjuntos.
- [diagrama] es/en/eu: «$A_1 = \{1, 2\}$, $A_2 = \{2, 3\}$ y $A_3 = \{1, 3\}$» → cada igualdad dentro de `<VisualBind>`: `conjuntoA1` terracota, `conjuntoA2` pavo, `conjuntoA3` ocre.
- [enlaces] es: «una familia de conjuntos indexada por un conjunto $I$» → «una `<ConceptLink targetId="familia-indexada" isDependency={true}>`familia de conjuntos indexada`</ConceptLink>` por un conjunto $I$». Es igual en en/eu. Es un ID canónico nuevo: la definición no se puede formular sin el concepto. Alternativa descartada: dejar el enlace sin `isDependency`.
- [enlaces] es/en/eu: `id="fundamento-geometrico-sorts"` → `id="particion-dominios-geometricos"`. Los IDs van en kebab-case castellano o neutro, y «sorts» es inglés. Ningún otro archivo lo referenciaba.
- [paridad] eu: «Diskurtsoaren unibertsoaren partizioa domeinutan» → «Diskurtso-unibertsoaren partizioa domeinutan». Así coincide con el término del cuerpo, «diskurtso-unibertsoaren».

### Pendiente para la autora
- [fuente] es/en/eu: `locator: "Capítulo 4"` de *Naive Set Theory* (Halmos). Parece plausible (el capítulo de uniones e intersecciones), pero no puedo comprobarlo desde el repositorio.
- [diagrama] Verifiqué las expresiones de pertenencia calculando a mano la distancia de cada posición candidata a cada círculo: todas quedan a ≥0,2 dentro o fuera. Como no tenía permiso para ejecutarlas, conviene comprobarlo en el navegador, igual que la composición de la lámina en escritorio, tableta y móvil.

### Avisos de los scripts
- check-links «artean» (eu, 2×) — descartado: en «haien artean» y «elkarren artean» significa «entre ellos» o «mutuamente», no la relación de intermediación `estar-entre`.

### Diagrama
La página no tenía diagrama y lo necesita. La propiedad central, que ser disjunta dos a dos implica intersección global vacía pero no al revés, es justo una condición que el lector puede romper. Moviendo los elementos ve que se pueden cortar dos a dos con intersección global vacía, y que no hay forma de tener intersección global no vacía sin que se corten dos a dos. Eso último es la propiedad, y por eso basta con tres estados.

`verify-diagram` da `visual-exact`, destinos únicos y traducciones eu/en completas. No tiene pasos: es una simulación libre, como `FuncionSagital`. El enlace `logica` para «lógica multitipo» lo dejo como está, porque la página `logica` tiene una sección propia sobre lógica multitipo.

### Resumen
Ajusto la prosa de la definición y de la propiedad a la fórmula (índices distintos, no conjuntos distintos), marco `conjunto-vacio` como dependencia y corrijo las mayúsculas de los títulos. Como propuesta añado el diagrama interactivo `ConjuntosDisjuntos`, la dependencia `familia-indexada` y un ID de propiedad en castellano. Queda comprobar el locator de Halmos y ver el diagrama en el navegador.

══ TODO OK · 1 nodo(s): conjunto-disjunto
VEREDICTO: errores
