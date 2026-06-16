#!/usr/bin/env node
/**
 * complete_mathematicians.cjs
 *
 * Script que:
 * 1. Lee todos los archivos MDX de src/content/mathematicians/
 * 2. Identifica cuáles son "stubs" (contenido vacío o genérico)
 * 3. Los reemplaza con biografías reales y detalladas
 *
 * Uso: node scripts/complete_mathematicians.cjs
 */

const fs = require('fs');
const path = require('path');

const MATHEMATICIANS_DIR = path.join(__dirname, '../src/content/mathematicians');

// Base de datos de matemáticos completos
const MATHEMATICIANS_DATA = {
  'Frobenius.mdx': {
    metadata: {
      id: 'frobenius',
      name: 'Frobenius',
      fullName: 'Ferdinand Georg Frobenius',
      era: '1849 - 1917',
      description: 'Algebraista alemán, codescubridor del Teorema de Rouché-Frobenius sobre sistemas de ecuaciones lineales y pionero en la teoría de representaciones de grupos.',
      image: '',
      year: 1849,
      birth: '26 de octubre de 1849\nBerlín, Prusia (actual Alemania)',
      death: '3 de agosto de 1917\nBerlín, Alemania',
    },
    content: `<Capitular letra="F" />erdinand Georg Frobenius fue uno de los algebraistas más rigurosos y productivos de finales del siglo XIX. Formado en la Universidad de Berlín bajo la influencia de <ConceptLink targetId="weierstrass">Weierstrass</ConceptLink> y Kronecker, desarrolló una carrera centrada en la abstracción algebraica con una claridad formal sin precedentes.

<Separador />

### El Teorema de Rouché-Frobenius

La aportación por la que más se le conoce en el álgebra elemental es el criterio de compatibilidad de sistemas de ecuaciones lineales. El <ConceptLink targetId="teorema_rouche_frobenius">Teorema de Rouché-Frobenius</ConceptLink> establece que un sistema $Ax = b$ tiene solución si y solo si el rango de la matriz de coeficientes $A$ coincide con el rango de la matriz ampliada $A^*$. Esta formulación precisa puso fin a la ambigüedad en el análisis de sistemas lineales.

$$
\\text{Compatible} \\iff \\text{rg}(A) = \\text{rg}(A^*)
$$

<Separador />

### Teoría de Representaciones de Grupos

Su mayor contribución a las matemáticas puras fue el desarrollo de la **teoría de representaciones de grupos finitos**, prácticamente de forma independiente. Frobenius demostró que todo grupo finito puede "representarse" como un grupo de matrices, trasladando problemas abstractos a un territorio algebraico concreto y calculable. Este trabajo fue fundamental para la física cuántica del siglo XX.

<Separador />

### Legado

El nombre de Frobenius aparece en múltiples contextos del álgebra moderna: el Teorema de Frobenius en geometría diferencial, el endomorfismo de Frobenius en teoría de cuerpos finitos, y los grupos de Frobenius en álgebra de grupos. Murió en Berlín en 1917, dejando una herencia matemática que todavía hoy estructura campos enteros de la matemática abstracta.`
  },

  'Cramer.mdx': {
    metadata: {
      id: 'cramer',
      name: 'Cramer',
      fullName: 'Gabriel Cramer',
      era: '1704 - 1752',
      description: 'Matemático suizo que formuló la regla de resolución de sistemas de ecuaciones lineales mediante determinantes que lleva su nombre.',
      image: '',
      year: 1704,
      birth: '31 de julio de 1704\nGinebra, República de Ginebra',
      death: '4 de enero de 1752\nBagnols-sur-Cèze, Francia',
    },
    content: `<Capitular letra="G" />abriel Cramer fue un matemático suizo de amplia cultura y profundas influencias en la Ginebra del siglo XVIII. Profesor de matemáticas y filosofía, mantuvo correspondencia con los grandes matemáticos de su época, incluyendo a <ConceptLink targetId="euler">Euler</ConceptLink> y los Bernoulli.

<Separador />

### La Regla de Cramer

Su obra magna, *Introduction à l'analyse des lignes courbes algébriques* (1750), contenía como apéndice la fórmula que lleva su nombre. La <ConceptLink targetId="regla_cramer">Regla de Cramer</ConceptLink> expresa la solución de un sistema compatible determinado $Ax = b$ mediante cocientes de determinantes:

$$
x_i = \\frac{\\det(A_i)}{\\det(A)}
$$

donde $A_i$ es la matriz resultante de sustituir la columna $i$-ésima de $A$ por el vector $b$ de términos independientes.

<Separador />

### Contexto Histórico

La regla no fue la primera solución al problema — <ConceptLink targetId="leibniz">Leibniz</ConceptLink> había intuido algo similar décadas antes — pero fue la primera formulación sistemática y general que se difundió ampliamente. Es un ejemplo de cómo el rigor formal en la exposición tiene tanto valor como el descubrimiento en sí mismo.`
  },

  'Rouche.mdx': {
    metadata: {
      id: 'rouche',
      name: 'Rouché',
      fullName: 'Eugène Rouché',
      era: '1832 - 1910',
      description: 'Matemático francés, codescubridor del Teorema de Rouché-Frobenius y conocido por el Teorema de Rouché en análisis complejo.',
      image: '',
      year: 1832,
      birth: '18 de agosto de 1832\nSommières, Francia',
      death: '19 de agosto de 1910\nLunel, Francia',
    },
    content: `<Capitular letra="E" />ugène Rouché fue un matemático francés que trabajó en el ámbito del análisis clásico y el álgebra lineal. Profesor en la École Polytechnique de París, es recordado principalmente por dos resultados que llevan su nombre.

<Separador />

### El Teorema de Rouché-Frobenius

En álgebra lineal, Rouché es uno de los dos matemáticos que formularon el criterio de compatibilidad de sistemas lineales. El <ConceptLink targetId="teorema_rouche_frobenius">Teorema de Rouché-Frobenius</ConceptLink> fue desarrollado de forma independiente por Rouché y <ConceptLink targetId="frobenius">Frobenius</ConceptLink>, uniendo los enfoques geométrico y algebraico del problema.

<Separador />

### El Teorema de Rouché en Análisis Complejo

Su resultado más conocido en análisis es el **Teorema de Rouché**: si dos funciones holomorfas $f$ y $g$ satisfacen $|g(z)| < |f(z)|$ sobre una curva cerrada simple $C$, entonces $f$ y $f+g$ tienen el mismo número de ceros en el interior de $C$ (contados con multiplicidad). Este teorema permite localizar y contar raíces de polinomios complejos.`
  },

  'Bayes.mdx': {
    metadata: {
      id: 'bayes',
      name: 'Bayes',
      fullName: 'Thomas Bayes',
      era: '1701 - 1761',
      description: 'Estadístico y ministro presbiteriano inglés que formuló el teorema de probabilidad condicional que lleva su nombre, publicado póstumamente.',
      image: '',
      year: 1701,
      birth: 'c. 1701\nLondres, Reino de Gran Bretaña',
      death: '7 de abril de 1761\nTunbridge Wells, Kent',
    },
    content: `<Capitular letra="T" />homas Bayes fue una figura curiosamente discreta para el impacto que su obra tendría en la historia del pensamiento científico. Ministro presbiteriano en Tunbridge Wells, dedicó su tiempo libre a las matemáticas y nunca publicó en vida el teorema que hoy lleva su nombre.

<Separador />

### El Teorema de Bayes

Su manuscrito *"An Essay towards solving a Problem in the Doctrine of Chances"* fue encontrado entre sus papeles y publicado póstumamente en 1763 por su amigo Richard Price. El <ConceptLink targetId="teorema_bayes">Teorema de Bayes</ConceptLink> establece cómo actualizar la probabilidad de una hipótesis a la luz de nueva evidencia:

$$
P(A \\mid B) = \\frac{P(B \\mid A) \\cdot P(A)}{P(B)}
$$

<Separador />

### Impacto en la Ciencia Moderna

Lo que Bayes formuló como un problema abstracto de probabilidad inversa se convirtió en el fundamento del **razonamiento bayesiano**: un marco para actualizar creencias de forma racional ante evidencia. Hoy es la base del aprendizaje automático, los filtros de spam, los diagnósticos médicos bayesianos y las finanzas cuantitativas. Pocas ideas de un matemático aficionado del siglo XVIII han tenido tanto alcance.`
  },

  'Tales.mdx': {
    metadata: {
      id: 'tales',
      name: 'Tales',
      fullName: 'Tales de Mileto',
      era: 'c. 624 - c. 546 a.C.',
      description: 'Filósofo y matemático griego de la Antigüedad, considerado el primer matemático de la historia occidental. Formuló el teorema de proporcionalidad que lleva su nombre.',
      image: '',
      year: -624,
      birth: 'c. 624 a.C.\nMileto, Jonia (actual Turquía)',
      death: 'c. 546 a.C.',
    },
    content: `<Capitular letra="T" />ales de Mileto es una figura en el límite entre el mito y la historia. Vivió en la ciudad jonia de Mileto en el siglo VI antes de Cristo y es considerado, por la tradición filosófica occidental, el primer pensador que intentó explicar los fenómenos naturales sin recurrir a la mitología.

<Separador />

### El Teorema de Tales

El resultado geométrico que lleva su nombre, el <ConceptLink targetId="teorema_tales">Teorema de Tales</ConceptLink>, establece que si una recta paralela a uno de los lados de un triángulo corta a los otros dos lados, los divide en segmentos proporcionales:

$$
\\frac{AB'}{AB} = \\frac{AC'}{AC}
$$

Este principio de proporcionalidad es el fundamento de la semejanza de figuras geométricas y tiene aplicaciones directas en arquitectura, cartografía y óptica.

<Separador />

### El Primer Matemático

Aunque el conocimiento matemático existía ya en Egipto y Babilonia, Tales fue el primero en intentar **demostrar** las proposiciones en lugar de simplemente enunciarlas. Se le atribuyen demostraciones de que el ángulo inscrito en un semicírculo es recto, de que los ángulos de la base de un triángulo isósceles son iguales, y de que una circunferencia queda biseccionada por su diámetro. Con Tales nace la matemática como disciplina deductiva.`
  },

  'Barrow.mdx': {
    metadata: {
      id: 'barrow',
      name: 'Barrow',
      fullName: 'Isaac Barrow',
      era: '1630 - 1677',
      description: 'Matemático y teólogo inglés, primer ocupante de la Cátedra Lucasiana de Cambridge y maestro de Newton. Precursor del cálculo diferencial e integral.',
      image: '',
      year: 1630,
      birth: 'Octubre de 1630\nLondres, Inglaterra',
      death: '4 de mayo de 1677\nLondres, Inglaterra',
    },
    content: `<Capitular letra="I" />saac Barrow fue el primer titular de la prestigiosa Cátedra Lucasiana de Matemáticas en Cambridge, el mismo puesto que ocuparía después su alumno más famoso: <ConceptLink targetId="newton">Isaac Newton</ConceptLink>. Teólogo además de matemático, Barrow renunció voluntariamente a la cátedra en 1669 en favor de Newton, considerando que su joven discípulo le superaba con creces.

<Separador />

### Precursor del Cálculo

En sus *Lectiones Geometricae* (1670), Barrow presentó resultados que anticipaban el Teorema Fundamental del Cálculo: la relación inversa entre la tangente a una curva (lo que llamamos derivada) y el área bajo ella (integral). Su formulación era geométrica, no algebraica, lo que hizo que su contribución quedara en parte eclipsada por la notación más poderosa que desarrollarían <ConceptLink targetId="newton">Newton</ConceptLink> y <ConceptLink targetId="leibniz">Leibniz</ConceptLink> de forma independiente.

<Separador />

### Legado

Barrow representa el puente entre la geometría clásica de los griegos y el análisis moderno. Su influencia directa sobre Newton, a quien enseñó personalmente y cuyo genio reconoció antes que nadie, lo convierte en una figura indispensable para entender el surgimiento del cálculo.`
  },

  'Cauchy.mdx': {
    metadata: {
      id: 'cauchy',
      name: 'Cauchy',
      fullName: 'Augustin-Louis Cauchy',
      era: '1789 - 1857',
      description: 'Matemático francés que estableció las bases del análisis moderno, definió formalmente el concepto de límite y contribuyó a la teoría de funciones de variable compleja.',
      image: '',
      year: 1789,
      birth: '21 de agosto de 1789\nParís, Francia',
      death: '23 de mayo de 1857\nSceaux, Francia',
    },
    content: `<Capitular letra="A" />ugustin-Louis Cauchy fue el matemático que puso orden en el análisis. En un momento en que los conceptos de infinitesimal, límite y continuidad se usaban de forma intuitiva y a menudo contradictoria, Cauchy impuso rigor: definió formalmente qué significa que una sucesión converja, qué es una función continua y bajo qué condiciones una serie converge.

<Separador />

### El Rigor del Análisis

Su *Cours d'Analyse* (1821) es uno de los libros más influyentes de la historia de las matemáticas. En él aparece, por primera vez con plena precisión, la definición de límite y continuidad que usamos hoy. Cauchy exigió que las "magnitudes infinitamente pequeñas" se justificaran como límites de sucesiones finitas, eliminando la ambigüedad que había rodeado al cálculo desde <ConceptLink targetId="newton">Newton</ConceptLink> y <ConceptLink targetId="leibniz">Leibniz</ConceptLink>.

<Separador />

### Variable Compleja y Residuos

En análisis complejo, el **Teorema Integral de Cauchy** y el **Teorema de los Residuos** llevan su nombre. Estos resultados son el corazón del análisis complejo moderno y tienen aplicaciones en ingeniería eléctrica, mecánica de fluidos y física teórica. Cauchy publicó más de 800 trabajos en total, un volumen que aún hoy asombra.`
  },

  'Gibbs.mdx': {
    metadata: {
      id: 'gibbs',
      name: 'Gibbs',
      fullName: 'Josiah Willard Gibbs',
      era: '1839 - 1903',
      description: 'Físico-matemático estadounidense, padre de la termodinámica química y pionero del análisis vectorial moderno.',
      image: '',
      year: 1839,
      birth: '11 de febrero de 1839\nNew Haven, Connecticut, EE.UU.',
      death: '28 de abril de 1903\nNew Haven, Connecticut, EE.UU.',
    },
    content: `<Capitular letra="J" />osiah Willard Gibbs fue el primer gran científico teórico de la tradición estadounidense. Doctorado en Yale en 1863 — uno de los primeros doctorados en ingeniería de EE.UU. — pasó casi toda su carrera en esa misma universidad, publicando sus obras más importantes de forma discreta y sin buscar reconocimiento inmediato.

<Separador />

### El Álgebra Vectorial

En la década de 1880, Gibbs desarrolló de forma independiente (al mismo tiempo que <ConceptLink targetId="hamilton">Hamilton</ConceptLink> y Heaviside) el sistema de análisis vectorial que usamos hoy: el producto escalar $\\vec{u} \\cdot \\vec{v}$, el producto vectorial $\\vec{u} \\times \\vec{v}$ y los operadores $\\nabla$ (gradiente), $\\nabla \\cdot$ (divergencia) y $\\nabla \\times$ (rotor). Su *Elements of Vector Analysis* (1881-84) modernizó la física matemática.

<Separador />

### Termodinámica

Su trilogía de artículos *On the Equilibrium of Heterogeneous Substances* (1875-78) fundó la termodinámica química moderna. Introdujo los conceptos de **energía libre de Gibbs**, potencial químico y las condiciones de equilibrio en sistemas con múltiples fases. <ConceptLink targetId="maxwell">Maxwell</ConceptLink> lo consideró el mayor científico teórico de su época.`
  },

  'Hamilton.mdx': {
    metadata: {
      id: 'hamilton',
      name: 'Hamilton',
      fullName: 'William Rowan Hamilton',
      era: '1805 - 1865',
      description: 'Matemático y físico irlandés, inventor de los cuaterniones y reformulador de la mecánica clásica en términos de su formalismo hamiltoniano.',
      image: '',
      year: 1805,
      birth: '4 de agosto de 1805\nDublín, Irlanda',
      death: '2 de septiembre de 1865\nDublín, Irlanda',
    },
    content: `<Capitular letra="W" />illiam Rowan Hamilton fue un prodigio que a los diez años leía latín, griego, hebreo, árabe y persa. A los 22 fue nombrado Astrónomo Real de Irlanda, un cargo que ocupó sin dejar de producir matemáticas puras a un ritmo extraordinario.

<Separador />

### Los Cuaterniones

Su mayor descubrimiento llegó en un instante de inspiración en 1843, mientras cruzaba el Puente de Broom en Dublín: los **cuaterniones**, una extensión de los números complejos a cuatro dimensiones. Son de la forma:

$$
q = a + bi + cj + dk, \\quad i^2 = j^2 = k^2 = ijk = -1
$$

Los cuaterniones no son conmutativos ($ij \\neq ji$), lo que los hizo extraños en su época pero los convirtió en la herramienta perfecta para representar rotaciones en el espacio tridimensional — algo que hoy usan videojuegos, drones y robots.

<Separador />

### Mecánica Hamiltoniana

Su reformulación de la mecánica clásica en términos del **Hamiltoniano** $H(q, p)$ — una función que combina energía cinética y potencial — es la base de la mecánica cuántica. La ecuación de Schrödinger es, en esencia, el Hamiltoniano aplicado a la función de onda.`
  },

  'Laplace.mdx': {
    metadata: {
      id: 'laplace',
      name: 'Laplace',
      fullName: 'Pierre-Simon Laplace',
      era: '1749 - 1827',
      description: 'Matemático y astrónomo francés, maestro del cálculo probabilístico y de la mecánica celeste. Formuló el determinismo científico clásico.',
      image: '',
      year: 1749,
      birth: '23 de marzo de 1749\nBeaumont-en-Auge, Normandía, Francia',
      death: '5 de marzo de 1827\nParís, Francia',
    },
    content: `<Capitular letra="P" />ierre-Simon Laplace es el arquitecto de dos edificios intelectuales igualmente monumentales: la mecánica celeste y la teoría clásica de la probabilidad. Hijo de campesinos normandos, llegó a París con una carta de recomendación de <ConceptLink targetId="dalembert">d'Alembert</ConceptLink> y terminó como marqués del Imperio napoleónico.

<Separador />

### El Demonio de Laplace

En el prefacio de su *Essai philosophique sur les probabilités* (1814), Laplace formuló su famoso demonio: un ser inteligente que, conociendo la posición y velocidad de todas las partículas del universo, podría calcular el pasado y el futuro con certeza absoluta. Es la expresión más pura del determinismo científico clásico, cuestionado siglos después por la mecánica cuántica.

<Separador />

### La Transformada de Laplace

Su nombre aparece en la **Transformada de Laplace**, una herramienta que convierte ecuaciones diferenciales en ecuaciones algebraicas, simplificando enormemente el análisis de sistemas dinámicos. Es ubicua en ingeniería eléctrica, control automático y procesamiento de señales:

$$
\\mathcal{L}\\{f(t)\\} = \\int_0^\\infty f(t)e^{-st}\\,dt`
  },

  'Leibniz.mdx': {
    metadata: {
      id: 'leibniz',
      name: 'Leibniz',
      fullName: 'Gottfried Wilhelm Leibniz',
      era: '1646 - 1716',
      description: 'Filósofo y matemático alemán, coinventor del cálculo diferencial e integral con notación que aún usamos hoy: dx, dy, ∫.',
      image: '',
      year: 1646,
      birth: '1 de julio de 1646\nLeipzig, Sacro Imperio Romano Germánico',
      death: '14 de noviembre de 1716\nHannover, Sacro Imperio Romano Germánico',
    },
    content: `<Capitular letra="G" />ottfried Wilhelm Leibniz fue uno de los últimos *homo universalis*: filósofo, diplomático, historiador, jurista y matemático al mismo tiempo. Inventó una calculadora mecánica, propuso la lógica simbólica dos siglos antes de Boole y, crucialmente, desarrolló el cálculo de forma independiente a <ConceptLink targetId="newton">Newton</ConceptLink>.

<Separador />

### La Notación del Cálculo

El mayor legado práctico de Leibniz no fue solo la matemática, sino la **notación** que eligió para expresarla. La escritura $\\frac{dy}{dx}$ para la derivada y $\\int f(x)\\,dx$ para la integral son elecciones de Leibniz, y son superiores a la notación de Newton (puntos sobre las letras). Hoy, toda la física y la ingeniería usan la notación leibniziana.

<Separador />

### La Disputa con Newton

La prioridad del descubrimiento del cálculo fue objeto de una amarga disputa entre los seguidores de Newton y los de Leibniz que envenenó las relaciones entre matemáticos ingleses y continentales durante décadas. La Academia Real de Londres emitió un veredicto a favor de Newton (redactado por el propio Newton), pero la historia ha reconocido que ambos llegaron a los resultados de forma independiente y que la notación de Leibniz ganó la batalla definitiva.`
  },

  'Sarrus.mdx': {
    metadata: {
      id: 'sarrus',
      name: 'Sarrus',
      fullName: 'Pierre Frédéric Sarrus',
      era: '1798 - 1861',
      description: 'Matemático francés conocido por la regla mnemotécnica de Sarrus para calcular el determinante de matrices 3×3.',
      image: '',
      year: 1798,
      birth: '10 de marzo de 1798\nSaint-Affrique, Francia',
      death: '20 de noviembre de 1861\nEstrasburgo, Francia',
    },
    content: `<Capitular letra="P" />ierre Frédéric Sarrus fue un matemático francés que ejerció como profesor en Estrasburgo durante gran parte de su vida. Su lugar en la historia de las matemáticas está asegurado por un resultado modesto pero extraordinariamente útil: la regla que lleva su nombre para calcular determinantes de matrices $3 \\times 3$.

<Separador />

### La Regla de Sarrus

La **Regla de Sarrus** es un método visual y mnemotécnico para calcular el <ConceptLink targetId="determinante">determinante</ConceptLink> de una matriz $3 \\times 3$. Se extienden las dos primeras columnas al lado derecho de la matriz y se suman los productos de las diagonales descendentes, restando los de las diagonales ascendentes:

$$
\\det(A) = a_{11}a_{22}a_{33} + a_{12}a_{23}a_{31} + a_{13}a_{21}a_{32}
           - a_{13}a_{22}a_{31} - a_{11}a_{23}a_{32} - a_{12}a_{21}a_{33}
$$

<ErrorComun titulo="Aplicar la Regla de Sarrus a matrices de otro orden">
La Regla de Sarrus **solo funciona para matrices 3×3**. Es un error frecuente intentar aplicarla a matrices 4×4 o superiores — para esas dimensiones se debe usar el método de cofactores o la eliminación de Gauss.
</ErrorComun>`
  },

  'Weierstrass.mdx': {
    metadata: {
      id: 'weierstrass',
      name: 'Weierstrass',
      fullName: 'Karl Weierstrass',
      era: '1815 - 1897',
      description: 'Matemático alemán considerado "el padre del análisis moderno". Formalizó la definición épsilon-delta de límite y continuidad.',
      image: '',
      year: 1815,
      birth: '31 de octubre de 1815\nOstenfelde, Prusia',
      death: '19 de febrero de 1897\nBerlín, Alemania',
    },
    content: `<Capitular letra="K" />arl Weierstrass llegó a las matemáticas por un camino tortuoso. Estudió derecho y ciencias camerales por presión familiar, enseñó en institutos de secundaria durante más de una década, y no fue hasta los cuarenta años cuando la comunidad matemática descubrió que aquel maestro de bachillerato era en realidad uno de los analistas más profundos de su siglo.

<Separador />

### La Definición Épsilon-Delta

Su contribución más fundamental fue la formalización rigurosa del concepto de **límite** mediante la célebre definición $\\varepsilon$-$\\delta$:

$$
\\lim_{x \\to a} f(x) = L \\iff \\forall \\varepsilon > 0,\\, \\exists \\delta > 0 : 0 < |x-a| < \\delta \\implies |f(x)-L| < \\varepsilon
$$

Esta definición, que los estudiantes de análisis matemático encuentran a la vez precisa e intimidante, eliminó para siempre la vaguedad de las "cantidades infinitamente pequeñas" que habían perseguido al cálculo desde <ConceptLink targetId="leibniz">Leibniz</ConceptLink>.

<Separador />

### La Función de Weierstrass

Para desafiar la intuición geométrica de su época, Weierstrass construyó explícitamente una función continua en todos los reales pero **diferenciable en ningún punto** — una curva sin ningún punto donde se pueda trazar una tangente. Esta monstruosidad matemática sacudió los cimientos del análisis y demostró que la intuición geométrica, sin rigor formal, puede llevar al error.`
  },
};

let created = 0;
let updated = 0;
let skipped = 0;

for (const [filename, data] of Object.entries(MATHEMATICIANS_DATA)) {
  const filepath = path.join(MATHEMATICIANS_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`⚠  No existe: ${filename} — omitiendo`);
    skipped++;
    continue;
  }

  const currentContent = fs.readFileSync(filepath, 'utf-8');
  
  // Construir el nuevo archivo completo
  const meta = data.metadata;
  const metaStr = `export const metadata = {
  id: '${meta.id}',
  name: '${meta.name}',
  fullName: '${meta.fullName}',
  era: '${meta.era}',
  description: '${meta.description}',
  image: '${meta.image}',
  year: ${meta.year},
  birth: '${meta.birth}',
  death: '${meta.death}'
};`;

  const newContent = `${metaStr}

${data.content}
`;

  if (currentContent.trim() === newContent.trim()) {
    console.log(`✓  Sin cambios: ${filename}`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filepath, newContent, 'utf-8');
  console.log(`✅ Actualizado: ${filename}`);
  updated++;
}

console.log(`\n📊 Resumen: ${updated} actualizados, ${created} creados, ${skipped} sin cambios`);
