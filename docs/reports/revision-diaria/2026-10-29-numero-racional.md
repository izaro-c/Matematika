<!-- 2026-10-29 · opus/high · $5.63 · 92 turnos · errores → errores · 3 rondas, ronda 3 incompleta (success): descartada; se conservan las anteriores · corregido · propuestas · corregido r2 → commit 5fe28818 en main -->

<!-- ronda 1 · opus/high · $3.99 · 80 turnos · corregido · propuestas -->

## numero-racional — rigor ✗ · simpleza △ · modularidad ✓ · enlaces ✗ · paridad ✗ · diagrama falta

### Correcciones
- [rigor] es/en/eu: «formado por todos los cocientes expresables entre dos números enteros» → «formado por todos los cocientes de dos números enteros con divisor no nulo». En en: «quotients of two integers with non-zero divisor». En eu: «bi zenbaki osoren arteko zatidura guztiek (zatitzailea zero ez dutenek)». Razón: faltaba la condición de que el divisor no sea nulo.
- [rigor] es/en/eu: después de las fórmulas de suma y producto se añade «Las dos fórmulas no dependen de los representantes elegidos, y $b \cdot d \neq 0$ porque $b \neq 0$ y $d \neq 0$ en el dominio de integridad $\mathbb{Z}$.» Razón: las operaciones se definían sobre clases a través de representantes sin decir que el resultado no depende de ellos, y sin justificar que el denominador $b \cdot d$ es distinto de cero.
- [rigor] es/en/eu: «está contenido como subcuerpo primo en cualquier otro cuerpo de característica cero» → «todo cuerpo de característica cero tiene un subcuerpo primo isomorfo a $\mathbb{Q}$». Razón: leída al pie de la letra, la frase original es falsa. Un cuerpo de característica cero contiene una copia isomorfa de $\mathbb{Q}$, no el propio $\mathbb{Q}$.
- [enlaces] es/en/eu: «principio de Arquímedes» apuntaba a `axioma-arquimedes`, que es el Axioma V.1 de Hilbert sobre segmentos. Ahora apunta a `propiedad-arquimediana`, un ID nuevo para la propiedad de un cuerpo ordenado. Razón: el enlace llevaba a un `targetId` con otro sentido. Alternativa posible: `cuerpo-arquimediano`.
- [enlaces/rigor] es/en/eu: «el conjunto cociente del <ConceptLink targetId="producto-cartesiano">» → `conjunto-cociente` y `producto-cartesiano`, los dos con `isDependency={true}`. Razón: corrige el WARN de check-links. Además, la definición no se puede formular sin estos dos conceptos, igual que en el nodo hermano `numero-entero`.
- [enlaces] es/en/eu: se añade enlace a «propiedad del supremo» (`axioma-supremo`, el ID que ya usa el corpus), a «acotados superiormente» (`cota-superior`), a «conmutativo» (`conmutatividad`, el WARN de en) y a «isomorfo» (`isomorfismo`). En en, «the property of the supremum» pasa a «least-upper-bound property». Razón: Pilar 2.
- [paridad/eu] eu: «zero ezaugarriko», «zero ezaugarria» → «zero karakteristikako», «zero karakteristika». Lo respaldan Elhuyar (https://hiztegiak.elhuyar.eus/es/caracter%C3%ADstica, acepción (Mat.) «karakteristika») y la ZTH (https://zthiztegia.elhuyar.eus/terminoa/eu/karakteristika).
- [paridad/eu] eu: «gorputz trukatzaile» → «gorputz trukakor». Lo respaldan Elhuyar (https://hiztegiak.elhuyar.eus/es/conmutativo, acepción (Mat.) «trukakor») y el uso «eraztun trukakorra» en la ZTH (https://zthiztegia.elhuyar.eus/terminoa/eu/osotasun-eremu).
- [paridad] en/eu metadata: `locator: "Capítulo 1"` (Rudin) → «Chapter 1» en en y «1. kapitulua» en eu. Razón: el locator estaba sin traducir; sigue la convención de `numero-entero`.

### Propuestas aplicadas — revisar
- [diagrama] Nuevo `content/diagrams/Definiciones/NumeroRacionalPares.tsx`, importado en los tres MDX y con `hasSimulation: true`. Al final de la Definicion se añade un párrafo en los tres idiomas: «En la figura, el par $(a, b)$ ocupa la columna $b$ y la fila $a$. La igualdad $a \cdot d = b \cdot c$ dice que $(b, a)$ y $(d, c)$ están alineados con el origen, así que cada clase reúne los pares de una misma recta por el origen: …». Lleva `<VisualBind>` de `pares` (carbon), `claseUnMedio` (terracota), `claseMenosUno` (pavo), `claseCero` (mora) y `excluidos` (granada).
- [rigor/simpleza] es/en/eu: al final de la Definicion se añade «Como $(a, b) \sim (-a, -b)$, toda clase tiene un representante con $b > 0$; para $b, d > 0$ se define $\frac{a}{b} < \frac{c}{d} \iff a \cdot d < b \cdot c$, y con este orden $\mathbb{Q}$ es un cuerpo ordenado.» Razón: la página afirma que $\mathbb{Q}$ es un cuerpo ordenado y usa su «orden usual» en las propiedades, pero nunca lo definía. Alternativa descartada: quitar «ordenado» de la primera frase.
- [simpleza] es/en/eu: «dados dos números racionales positivos cualesquiera $x, y \in \mathbb{Q}$ con $x > 0$, existe siempre» → «para todo $x, y \in \mathbb{Q}$ con $x > 0$ existe». Razón: «positivos» y «con $x > 0$» se repetían, y la propiedad arquimediana no exige que $y$ sea positivo.
- [simpleza] es/en/eu: «denso en sí mismo» / «dense in itself» / «bere baitan trinkoa» → «denso» / «dense» / «trinkoa». Razón: en topología, «dense-in-itself» significa «sin puntos aislados», que es otra noción. Aquí se habla de un orden denso.

### Pendiente para la autora
- [historia] es: «(del italiano *quoziente*)». La etimología de $\mathbb{Q}$ (se suele atribuir a Peano) no se puede comprobar desde el repositorio.
- [historia] es: «como demostró históricamente el descubrimiento pitagórico de magnitudes inconmensurables como $\sqrt{2}$». La atribución pitagórica está sin verificar. Además, llamar «magnitud» a $\sqrt{2}$ es algo anacrónico: la magnitud sería la diagonal del cuadrado de lado unidad.
- [fuentes] metadata: Dedekind con `locator: "1872"`. Es un año, no un locator, y no puedo comprobar qué sección del ensayo corresponde (probablemente §1–§3, sobre los racionales).
- [euskara] eu: «neurkidetasun» / «neurkideezinen» (conmensurabilidad / inconmensurable). Ni Elhuyar ni la ZTH tienen «neurkide», y Elhuyar no da acepción matemática de «conmensurable» (solo «neurgarri», en sentido general). Lo he dejado como estaba. Para la wiki: https://hiztegiak.elhuyar.eus/es/conmensurable y https://zthiztegia.elhuyar.eus/terminoa/eu/neurkide.
- [euskara] El nodo `numero-real` (eu, líneas 7 y 22) también usa «trukatzaile». Queda fuera de esta página.
- [diagrama] Comprueba el encuadre en móvil. La figura tiene una proporción de unos 1,9:1; no he podido revisarla en pantalla.

### Avisos de los scripts
- check-links «conjunto cociente» / «quotient set» (es, en): corregido.
- check-links «commutative» (en): corregido, ahora con enlace a `conmutatividad` en los tres idiomas.
- check-links «estructura» / «structure» / «egitura» (es, en, eu): descartado. Es «la estructura $(\mathbb{Q}, +, \cdot)$» en sentido genérico, no `estructura-geometrica`.
- check-links «entre» / «between» (es, en): descartado. Se refiere a la división, no a la intermediación geométrica `estar-entre`.
- check-links «jatorri» (eu, nuevo): descartado. Es el origen de la retícula; en es y en, «origen» y «origin» tampoco llevan enlace.
- check-style «zutabe» (eu, nuevo): descartado. Significa literalmente la columna $b$ de la figura, no es un adjetivo de relleno.

### Diagrama
La página lo necesitaba: $\mathbb{Q}$ tiene una imagen canónica que hace visible la construcción. He creado una figura estática del mismo estilo que `NumeroEnteroPares`:
- **Retícula:** los pares $(a, b) \in \mathbb{Z} \times (\mathbb{Z} \setminus \{0\})$, con $b$ en horizontal y $a$ en vertical.
- **Clases:** cada clase es el conjunto de pares de una recta por el origen, y la pendiente de esa recta es el racional $a/b$. Se ven en color $\tfrac12$ (terracota), $-1$ (pavo) y $0$ (mora).
- **Columna excluida:** la columna $b = 0$ aparece discontinua en granada y queda vacía.

Ver por qué $(1,2) \sim (2,4) \sim (-1,-2)$ y por qué ningún denominador es nulo es justo lo que la fórmula de la Definicion solo enuncia. `verify-diagram` da `visual-exact`, con destinos únicos y traducciones eu/en completas.

### Resumen
He corregido el divisor no nulo, la buena definición de las operaciones y la afirmación falsa sobre el subcuerpo primo. También he cambiado el enlace al axioma geométrico V.1 por `propiedad-arquimediana` y he añadido las dependencias y enlaces que faltaban. En eu he puesto «karakteristika» y «trukakor» (Elhuyar/ZTH), y he traducido los locators. Como propuestas, he añadido la figura de las clases como rectas por el origen y la definición del orden. Quedan para la autora la etimología de $\mathbb{Q}$, la atribución pitagórica, el locator de Dedekind y el término «neurkide».

══ TODO OK · 1 nodo(s): numero-racional
VEREDICTO: errores

---

# Ronda 2: verificación

<!-- ronda 2 · opus/high · $0.82 · 12 turnos · corregido r2 -->

## numero-racional — rigor ✗ · simpleza ✓ · modularidad ✓ · enlaces ✓ · paridad ✗ · diagrama ✓

### Correcciones
- [rigor] es/en/eu: «para $b, d > 0$ se define $\frac{a}{b} < \frac{c}{d} \iff a \cdot d < b \cdot c$, y con este orden $\mathbb{Q}$ es un cuerpo ordenado» → «para $b, d > 0$ se define $\frac{a}{b} < \frac{c}{d} \iff a \cdot d < b \cdot c$, y esta definición tampoco depende de los representantes elegidos. Con este orden, $\mathbb{Q}$ es un cuerpo ordenado». En en: «and this definition is likewise independent of the chosen representatives. With this order, …». En eu: «eta definizio hori ere ez da aukeratutako ordezkarien menpekoa. Ordena horrekin, …». Razón: el orden se define sobre clases usando representantes, igual que las operaciones. La ronda 1 justificó la independencia de los representantes en las operaciones pero no en el orden, y el razonamiento hace falta igual. Por ejemplo, $(1,2)$ y $(2,4)$ tienen los dos denominador positivo y deben dar la misma comparación.
- [paridad/eu] eu: «$\mathbb{Q}$-ren isomorfoa den azpigorputz lehen bat» → «$\mathbb{Q}$-rekin isomorfoa den azpigorputz lehen bat». Razón: Elhuyar recoge *isomorfo* como adjetivo (izond., https://hiztegiak.elhuyar.eus/eu/isomorfo). Como adjetivo de relación lleva sociativo, no genitivo: el genitivo lo vuelve sustantivo («el isomorfo de $\mathbb{Q}$»). El corpus ya usa el sociativo: «$\mathbb{R}^3$ espazioarekin isomorfoak» (`sistema-euclidiano`) y «espazio kartesiarrarekin isomorfoa» (`isomorfismo`).

### Propuestas aplicadas — revisar
Nada.

### Pendiente para la autora
- [estilo] es: «la relación de equivalencia que identifica dos fracciones cuando su producto cruzado coincide». Los elementos de $\mathbb{Z} \times (\mathbb{Z} \setminus \{0\})$ son pares; solo pasan a ser fracciones al tomar la clase. Además, en es «su producto cruzado coincide» va en singular, mientras en dice «their cross products coincide». Una opción sería «que identifica dos pares cuando sus productos cruzados coinciden». No lo he cambiado porque se entiende y es cuestión de gusto.
- Los puntos que dejó pendientes la ronda 1 siguen abiertos: la etimología de $\mathbb{Q}$ (*quoziente*), la atribución pitagórica de $\sqrt{2}$, el locator «1872» de Dedekind, el término «neurkide» en eu, «trukatzaile» en `numero-real` (eu) y el encuadre del diagrama en móvil.

### Avisos de los scripts
- check-links «estructura» / «structure» / «egitura» (es, en, eu): descartado. Es «la estructura $(\mathbb{Q}, +, \cdot)$» en sentido algebraico genérico, no `estructura-geometrica`.
- check-links «entre» / «between» (es, en): descartado. Aparece en «la división exacta entre cantidades», que no es la intermediación `estar-entre`.
- check-links «jatorri» (eu): descartado. Es el origen de la retícula de la figura, no `punto`; en es y en, «origen» y «origin» tampoco llevan enlace.
- check-style «zutabe» (eu): descartado. Es la columna $b$ de la figura, no un adjetivo valorativo.

### Diagrama
He revisado `NumeroRacionalPares.tsx`. El par $(a,b)$ se dibuja en $x=b$, $y=a$, y los puntos de cada clase están bien colocados:
- **$\tfrac12$:** $(1,2)$, $(2,4)$, $(-1,-2)$ y $(-2,-4)$, sobre una recta de pendiente $1/2$.
- **$-1$:** $(\pm1,\mp1)$ y $(\pm2,\mp2)$, sobre una recta de pendiente $-1$.
- **$0$:** los pares $(0,b)$, sobre el eje horizontal.
- **$b=0$:** la columna está discontinua y vacía.

Los extremos auxiliares tienen `size: 0` y `labelVisible: false`, así que en la figura no se ven etiquetas como «Extremo …». Los `<VisualBind>` (`pares` carbon, `claseUnMedio` terracota, `claseMenosUno` pavo, `claseCero` mora, `excluidos` granada) coinciden en id y color con los grupos del diagrama en los tres idiomas. Las traducciones eu/en están completas y el estado es `visual-exact`. La figura es estática, que es lo adecuado: enseña mirando por qué la relación de equivalencia agrupa los pares en rectas por el origen.

### Resumen
He añadido que la definición del orden de $\mathbb{Q}$ no depende de los representantes y he corregido en eu el régimen de *isomorfo* («$\mathbb{Q}$-rekin isomorfoa»). Siguen pendientes para la autora los datos históricos, el término «neurkide» y una mejora opcional de redacción en la frase de la relación de equivalencia.

══ TODO OK · 1 nodo(s): numero-racional
VEREDICTO: errores
