<!-- 2026-10-26 · opus/high · $0.8 · 18 turnos · corregido b44a97dc -->

## incidencia — rigor △ · simpleza ✓ · modularidad ✓ · enlaces △ · paridad △ · diagrama no necesita

### Correcciones
- [rigor] es/en/eu: «fijan la configuración básica del espacio y permiten definir cuándo varios puntos son colineales» → «fijan la configuración básica del espacio. Con la incidencia se define cuándo varios puntos son colineales» (en: «Incidence is used to define when several points are…»; eu: «Intzidentziaren bidez definitzen da hainbat puntu noiz diren…»). Razón: las definiciones de colinealidad y coplanaridad solo necesitan la relación $\mathbf{I}$, no los axiomas. Los axiomas restringen la relación, pero no hacen falta para formular esas definiciones.
- [rigor] es/en/eu: «**Independencia de nociones métricas:**» → «**Independencia del orden y de la métrica:**» (en: «Independence from order and metric:»; eu: «Ordenarekiko eta metrikarekiko independentzia:»). Razón: la lista incluye el orden (`estar-entre`), que es una relación primitiva no métrica. El título lo clasificaba mal.
- [enlaces] es/en/eu: «los axiomas del sistema de incidencia» → «los <ConceptLink targetId="axioma">axiomas</ConceptLink> del…». Razón: primera mención de un concepto (Pilar 2). Es un meta-concepto, así que va sin `isDependency`, como en los otros 25 usos del corpus. Corrige el WARN de eu «axiomek».
- [paridad/euskara] eu: «bere portaera … axiomek zehazten dute» → «haren portaera … axiomek zehazten dute». Razón: el antecedente («intzidentzia») no es el sujeto de esa cláusula, cuyo sujeto es «axiomek». El reflexivo *bere* resulta ambiguo e incorrecto según la norma; lo que corresponde es *haren*.

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
Nada.

### Avisos de los scripts
- check-links «derivada» (es): descartado. Es «noción derivada», en el sentido de concepto no primitivo, no la derivada del cálculo.
- check-links «independence» (en): descartado. Se refiere a que la incidencia no depende del orden ni de la métrica, no a la independencia lógica de axiomas.
- check-links «independentzia» (eu): descartado, por la misma razón que en `en`.
- check-links «axiomek» (eu, 2×): corregido en la primera mención, con enlace a `axioma` en los tres idiomas. La segunda («I.1 … I.8 axiomek») va justo detrás de los enlaces a cada axioma y no necesita otro.

### Diagrama
No necesita. Imaginé dos manipulaciones:
- **Arrastrar un punto sobre una recta o fuera de ella**, con un panel que muestre $P\,\mathbf{I}\,\ell$ verdadero o falso. Solo repite la lectura intuitiva de la definición.
- **Un diagrama de flechas entre $\mathcal{P}$ y $\mathcal{L}$** que represente $\mathbf{I}_{\mathcal{P}\mathcal{L}}$ como conjunto de pares. Aquí no hay ninguna condición que el lector pueda romper, porque cualquier subconjunto de $\mathcal{P}\times\mathcal{L}$ es una relación de incidencia válida.

Lo único con contenido manipulable sería el criterio para que una recta esté en un plano. Eso es el Axioma I.6, y ese ejemplo corresponde a su página. La colinealidad ya tiene diagrama propio.

### Resumen
En los tres idiomas: se enlaza «axiomas» a `axioma`, la definición de colinealidad y coplanaridad se atribuye a la incidencia y no a los axiomas, y el título ya no presenta el orden como noción métrica. En euskara, «bere» pasa a «haren». No queda nada pendiente.

══ TODO OK · 1 nodo(s): incidencia
VEREDICTO: mejoras
