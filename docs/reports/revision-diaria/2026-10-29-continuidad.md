<!-- 2026-10-29 · opus/high · $1.89 · 48 turnos · errores → errores · 1 rondas, converge · sin cambios -->

<!-- ronda 1 · opus/high · $1.89 · 48 turnos · sin cambios -->

## continuidad — rigor ✗ · simpleza △ · modularidad △ · enlaces ✗ · paridad ✓ · diagrama no necesita

**Nada de esta revisión está guardado en un commit.** Las correcciones de nivel 1 están hechas en los tres MDX y pasan `validate-nodes`, pero siguen sin guardar en el worktree. `validate-nodes` regenera `src/data/graph/graph_structure.json` cuando cambian las dependencias, y `checkpoint.sh` no guarda mientras haya cambios fuera de `content/`. No tengo permiso para restaurar ese archivo: me denegaron `git checkout`, `git restore` y Edit sobre él. Tampoco ejecuté `checkpoint.sh discard`, porque borraría también las correcciones. Por eso no apliqué el nivel 2; lo dejo descrito en «Pendiente para la autora».

### Correcciones
*(hechas en los tres MDX, sin guardar)*

- [rigor] es/en/eu, `<Definicion>`: «Sea $L$ un continuo lineal dotado de un orden denso. Si $L$ se divide… entonces el principio de continuidad estipula que existe un único elemento $p \in L$…» → «Un conjunto $L$ con un orden total es **continuo** si, cada vez que $L$ se divide en dos clases no vacías y disjuntas… existe un único elemento $p \in L$ que produce dicha partición». Hay cuatro fallos:
  - La definición era circular: presuponía «continuo lineal», que es lo que se define.
  - Definía un «principio» y no el concepto del nodo.
  - A la fórmula le faltaban el cuantificador $\forall \Sigma_1, \Sigma_2 \subseteq L$, la no vacuidad y la conclusión.
  - La fórmula nueva termina en $\exists!\, p \in L\ \forall x \in \Sigma_1\, \forall y \in \Sigma_2\ (x \le p \le y)$. La hipótesis «denso» sobraba: la unicidad ya excluye los saltos, y así se dice en una frase nueva tras la fórmula.
- [rigor/enlaces] es/en/eu: `<ConceptLink targetId="orden-total">orden denso</ConceptLink>` → `<ConceptLink targetId="orden-total" isDependency={true}>orden total</ConceptLink>`. El texto del enlace no correspondía al ID, y el orden total es el único antecedente constitutivo de la definición.
- [rigor] es/en/eu: quito `isDependency` de `recta`, `funcion` y `espacio`. Ninguno es necesario para formular la definición; con `recta`, además, `numero-real` (que depende de este nodo) acabaría colgando de la geometría.
- [enlaces] es/en/eu: «los <ConceptLink targetId="espacio">espacios</ConceptLink> topológicos» → `<ConceptLink targetId="espacio-topologico">espacios topológicos</ConceptLink>`. `espacio` es el espacio geométrico de Hilbert, otro sentido.
- [rigor] es/en/eu: «o la convergencia de sucesiones de Cauchy» → «o, junto con la <ConceptLink targetId="axioma-arquimedes">propiedad arquimediana</ConceptLink>, la convergencia de las sucesiones de Cauchy». Sin la propiedad arquimediana, la convergencia de Cauchy no equivale a la completitud. Se sigue el uso de `completitud-reales`.
- [rigor] es/en/eu: «En geometrías sin axiomas de continuidad (como el plano racional $\mathbb{Q}^2$), una recta secante puede atravesar el interior de un círculo… La continuidad postula la existencia formal de dichos puntos de contacto, cerrando la brecha…» → «En el plano racional $\mathbb{Q}^2$, cuyas rectas tienen lagunas como las de $\mathbb{Q}$, la recta $y = 0$ pasa por el centro de la circunferencia $x^2 + y^2 = 2$ sin compartir ningún punto con ella, porque $\sqrt{2}$ no es racional. Los axiomas V.1 y V.2 garantizan que toda recta que pasa por un punto interior de una circunferencia la corta.» Errores corregidos:
  - $\mathbb{Q}^2$ no es una «geometría sin continuidad» que cumpla lo demás: falla el Axioma III.1 y sí cumple V.1.
  - Una «secante» que no corta es una contradicción.
  - «Puntos de contacto» sugiere tangencia.
  - La continuidad es una propiedad, no un postulado.

  Desaparecen los enlaces `secante` y `logica`, igual en los tres idiomas.
- [estilo] es/en/eu: la frase de 51 palabras «Por su parte, en el análisis… Cauchy» se divide en dos: «…completitud de los números reales. Esta se expresa a través de…». En eu, la segunda frase lleva el verbo principal «…bidez adierazten da».

### Propuestas aplicadas — revisar
Nada. No apliqué ninguna porque no se podían guardar; están en el apartado siguiente.

### Pendiente para la autora
- **Bloqueo de `checkpoint.sh`**: cada vez que cambia un `isDependency`, `validate-nodes` reescribe `src/data/graph/graph_structure.json`, y entonces `checkpoint.sh` no guarda. Hay que restaurar ese archivo con `git restore src/data/graph/graph_structure.json` y luego ejecutar `checkpoint.sh continuidad correcciones "…"`. Otra opción es que `checkpoint.sh` excluya ese archivo generado.
- [modularidad, propuesta no aplicada] es/en/eu: la apertura «tanto en la recta geométrica como en las funciones y los espacios topológicos» mezla tres conceptos, pero la página solo trata la continuidad del orden. Propuesta: «La **continuidad** de un conjunto totalmente ordenado es la ausencia de saltos y lagunas en su orden… La continuidad de una función es otro concepto: <ConceptLink targetId="funcion-continua">función continua</ConceptLink>», y cambiar la `description` en el mismo sentido. La alternativa es mantener una página paraguas. Si se reenfoca, `limite.mdx` enlaza `continuidad` en el sentido de función y habría que cambiarlo a `funcion-continua`.
- [simpleza, propuesta no aplicada] es/en/eu: quitar el segundo párrafo, «En la matemática, la continuidad se manifiesta bajo dos perspectivas complementarias…». Anuncia el marco y repite lo que dicen los dos párrafos siguientes.
- [euskara] «gorenenaren printzipioaren»: Elhuyar no recoge «supremo» con la marca (Mat.) (https://hiztegiak.elhuyar.eus/es/supremo). La forma coincide con la de `axioma-supremo` («Gorenenaren axioma»), así que la dejo. Conviene fijar el término en el glosario.
- [euskara] el texto ya no dice «ordena trinko», porque desaparece la hipótesis de densidad. Para el glosario: Elhuyar da «dentso» como primera acepción de «denso» y «trinko» solo en sentido figurado (https://hiztegiak.elhuyar.eus/es/denso), y la ZTH solo recoge «dentso» en física. `numero-racional` usa «trinko».
- [euskara] «osotasun» (completitud) no está en Elhuyar (https://hiztegiak.elhuyar.eus/es/completitud). La página es coherente con `axioma-completitud` y por eso no lo cambio.

### Avisos de los scripts
- check-links «entre» (es) / «between» (en) — descartado: es «la intersección entre rectas y curvas», no intermediación.
- check-links «grupo» (es) / «group» (en) — descartado: es el grupo V de axiomas, no un grupo algebraico.
- check-links «egitura» (eu) — descartado: forma parte del verbo «egituratzen».
- check-links «alde» (eu) — descartado: es la locución «Bere aldetik».
- check-links «ordenaren» (eu) — descartado: es el orden total, ya enlazado a `orden-total` en esa misma `<Definicion>`; no es intermediación.
- check-links «axiomek» (eu) — descartado: es un metaconcepto, y los axiomas V.1 y V.2 ya están enlazados.
- check-style frase de 51 palabras (es), aparecida tras el primer cambio — corregido.

### Diagrama
No necesita. Pensé en dos manipulaciones:
- un corte arrastrable sobre una recta;
- una recta que se mueve a través de una circunferencia.

En una figura dibujada el corte siempre parece tener su punto y la recta siempre parece cortar, así que el diagrama no puede mostrar lo que la continuidad excluye (la laguna de $\sqrt{2}$ en $\mathbb{Q}$). La recta de Dedekind ya tiene su diagrama en `axioma-completitud` (`AxiomaDedekind`).

### Resumen
Correcciones de nivel 1 hechas en los tres MDX, pero sin guardar: `checkpoint.sh` no admite el `graph_structure.json` regenerado y no tengo permiso para restaurarlo. Las corrigen la definición (circular e incompleta), las dependencias, el enlace `espacio`, la condición arquimediana para Cauchy y el ejemplo de $\mathbb{Q}^2$. Las propuestas de reenfocar la apertura y quitar el segundo párrafo quedan para la autora.

══ TODO OK · 1 nodo(s): continuidad
VEREDICTO: errores

### Aviso del script

```text
El agente dejó cambios sin guardar con checkpoint.sh; se han descartado:
 M content/mdx/en/definitions/continuidad.mdx
 M content/mdx/es/definitions/continuidad.mdx
 M content/mdx/eu/definitions/continuidad.mdx
 M src/data/graph/graph_structure.json
```
