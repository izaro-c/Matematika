<!-- 2026-10-24 · opus/high · $1.24 · 40 turnos · corregido 04deb78c · propuestas c961e55a -->

## estar-entre — rigor ✗ · simpleza △ · modularidad ✓ · enlaces △ · paridad ✓ · diagrama ✗

### Correcciones
- [rigor] es: «cuya interpretación es un subconjunto $\mathbf{B} \subseteq \mathcal{P} \times \mathcal{P} \times \mathcal{P}$ del <ConceptLink targetId="dominio">dominio primitivo</ConceptLink> de puntos $\mathcal{P}$» → «cuya interpretación es un <ConceptLink targetId="subconjunto">subconjunto</ConceptLink> $\mathbf{B} \subseteq \mathcal{P} \times \mathcal{P} \times \mathcal{P}$, donde $\mathcal{P}$ es el <ConceptLink targetId="dominio">dominio primitivo</ConceptLink> de puntos» — $\mathbf{B}$ es un subconjunto de $\mathcal{P}^3$, no de $\mathcal{P}$. Mismo cambio en en («a subset … of the primitive domain» → «…, where $\mathcal{P}$ is the primitive domain of points») y en eu («puntuen $\mathcal{P}$ oinarrizko domeinuaren azpimultzo bat da» → «azpimultzo bat da, …, non $\mathcal{P}$ puntuen oinarrizko domeinua den»).
- [rigor] es/en/eu: «Para cualquier terna de puntos $A$, $B$ y $C$ de una misma recta $\ell$, la relación se denota» → «Para cualquier terna de puntos $A$, $B$ y $C$, la relación se denota». El `<VisualBind element="lineAC">$\ell$</VisualBind>` pasa a «colineales por incidencia con una misma recta $\ell$». El texto exigía la colinealidad al introducir la notación y, dos frases después, decía «La definición no impone por sí misma ninguna condición sobre la terna»: la colinealidad la da el Axioma II.1, no la definición. En eu: «$\ell$ zuzen bereko edozein … hirukoterako» → «$A$, $B$ eta $C$ puntuen edozein hirukoterako», y «$\ell$ zuzen berarekin intziditzen dutelako».
- [enlaces] es/en/eu: «subconjunto» / «subset» / «azpimultzo» sin enlace → `<ConceptLink targetId="subconjunto">`. Es un enlace de contexto, sin dependencia, al ID que ya se usa en `conjunto.mdx`. El script proponía `conjunto`, pero el sentido aquí es el de subconjunto.
- [diagrama] es/en/eu: `<VisualBind element="pA" color="ocre">`, `pB color="terracota"`, `pC color="ocre"` → `pA`/`pC` `musgo` y `pB` `ocre`. Los colores del texto no coincidían con los del diagrama (A y C `musgo`, B `ocre`). Se cambia el MDX porque es lo menos invasivo; la otra opción era recolorear el diagrama.
- [diagrama] EstarEntre.tsx: `"label": "Recta r"`, `"Recta soporte r"`, `"Supporting line r"`, `"r euskarri-zuzena"` → `ℓ` en todos (`"ℓ zuzen euskarria"` en eu). El texto llama ℓ a la recta, la convención de notación usa ℓ, m, n, y el glosario fija `zuzen euskarria`.
- [diagrama] EstarEntre.tsx, paso `step-orden`: «El punto B se sitúa en el interior del segmento delimitado por A y C.» → «El punto $B$ está entre $A$ y $C$; los tres son puntos distintos de la recta $\ell$.» (en: «Point B lies strictly within the segment bounded by A and C.» → «Point $B$ lies between $A$ and $C$; the three are distinct points of line $\ell$.»; eu: «…segmentuaren barnean kokatzen da» → «$B$ puntua $A$ eta $C$ puntuen artean dago; hirurak $\ell$ zuzeneko puntu desberdinak dira.»). La versión anterior explicaba la intermediación por el segmento, que se define a partir de ella: era circular. Las etiquetas pasan a KaTeX (`$A * B * C$`).
- [diagrama] EstarEntre.tsx, nota: «o desliza B a lo largo de ella» → «Arrastra $A$ y $C$ para mover la recta; desliza $B$ entre ellos.» (también en en y eu). B solo se mueve sobre `segAC`, no sobre toda la recta.
- [paridad] EstarEntre.tsx, eu: «Tartean egon (bitartekotasuna)» → «Artean egotea (bitartekotasuna)»; «AB segmentua», «BC segmentua», «AC segmentu osoa» → «AB zuzenkia», «BC zuzenkia», «AC zuzenki osoa»; «B tarteko puntua» → «B bitarteko puntua». El glosario prohíbe «tartean egon» y «segmentu».

### Propuestas aplicadas — revisar
- [simpleza] es: «, de modo que la intermediación es la base de toda la teoría de la separación en rectas y planos.» + `<Nota>`«Esta relación primitiva es el fundamento para definir el segmento, la semirrecta, el semiplano y la separación de la recta por uno de sus puntos.» → «. Con la intermediación se definen el segmento, la semirrecta y el semiplano, y se formula la separación de una recta por uno de sus puntos y de un plano por una de sus rectas.» (se mantienen los mismos enlaces y se quita la `<Nota>`). Lo mismo en en y eu (eu: «Bitartekotasunaren bidez definitzen dira zuzenkia, zuzenerdia eta planoerdia, eta zuzen bat bere puntu batek eta plano bat bere zuzen batek banatzea ere haren bidez formulatzen da.»). La nota repetía el segundo párrafo (Golden Rule 2), y además desaparecen «toda la teoría» y un «de modo que» que no expresaba una consecuencia real. La alternativa descartada era dejar la nota y quitar la frase del párrafo.
- [diagrama] EstarEntre.tsx: se eliminan `pD` («Punto exterior D») y `segCD`, con sus estados de paso y sus `ariaLabels`. Estaban ocultos, ningún paso ni ningún `VisualBind` los usaba, y su etiqueta accesible anunciaba un punto que no se ve.

### Pendiente para la autora
- [diagrama] EstarEntre.tsx: B se mueve sobre el segmento cerrado `segAC`, así que puede coincidir con A o con C. Y como A y C son libres, se puede arrastrar uno encima del otro. Las dos configuraciones las excluye el Axioma II.1. La spec v3 no ofrece, según el esquema, ninguna forma de restringir a un soporte abierto. Una solución sería definir B por expresión con un parámetro en $(\varepsilon, 1-\varepsilon)$; no la aplico porque cambia la interacción y la edición visual.

### Avisos de los scripts
- check-links «subconjunto» (es) — corregido con `targetId="subconjunto"`, no con `conjunto`
- check-links «subset» (en) — corregido igual
- check-links «azpimultzo» (eu) — corregido igual

### Diagrama
Hace falta: la intermediación es una configuración de orden sobre una recta, y al arrastrar se ve que B sigue entre A y C. Después de los cambios, la construcción coincide con el texto (recta ℓ que pasa por A y C, B restringido entre ellos), los colores de `VisualBind` cuadran con los del diagrama, ya no quedan objetos sin uso y las traducciones están completas y con la terminología del glosario. Sigue abierto lo que queda en «Pendiente»: los casos límite en que B coincide con un extremo o A con C.

### Resumen
He corregido tres cosas. La interpretación de $\mathbf{B}$ ahora es un subconjunto de $\mathcal{P}^3$. La notación ya no presupone la colinealidad, que da II.1. Y he alineado colores, notación (ℓ) y terminología eu entre el MDX y el diagrama, que además ya no define la intermediación por el segmento. Propongo integrar la Nota en el segundo párrafo y quitar los objetos sin uso del diagrama. Queda pendiente impedir en el diagrama que B coincida con A o con C.

══ TODO OK · 1 nodo(s): estar-entre
VEREDICTO: errores
