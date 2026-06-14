import { create } from 'zustand';

export type GlossaryCategory = 'Conceptos Fundamentales' | 'Lógica' | 'Álgebra' | 'Análisis' | 'Geometría' | 'Teoría de Conjuntos';

export interface GlossaryEntry {
  title: string;
  definition: string;
  equation?: string;
  category: GlossaryCategory;
}

export interface GlossaryState {
  activeTerm: string | null;
  activeFormulaTerms: string[] | null;
  displayMode: 'sidebar' | 'modal';
  openTerm: (termId: string) => void;
  openFormulaTerms: (termIds: string[]) => void;
  closeTerm: () => void;
  toggleDisplayMode: () => void;
}

// Nuestra base de datos de términos de la Enciclopedia
export const dictionary: Record<string, GlossaryEntry> = {
  // CONCEPTOS FUNDAMENTALES
  axioma: {
    title: "Axioma",
    definition: "Una proposición tan clara y evidente que se admite sin demostración. Es el ladrillo fundamental sobre el que se construye cualquier teoría matemática.",
    category: "Conceptos Fundamentales"
  },
  lema: {
    title: "Lema",
    definition: "Un teorema menor o secundario cuya demostración es un paso previo necesario para demostrar un teorema principal.",
    category: "Conceptos Fundamentales"
  },
  qed: {
    title: "Quod Erat Demonstrandum ( ∎ )",
    definition: "Marca el final de una demostración matemática. Proviene del latín 'lo que se quería demostrar'.",
    equation: "\\blacksquare",
    category: "Conceptos Fundamentales"
  },
  
  // LÓGICA
  implies: {
    title: "Implicación ( ⟹ )",
    definition: "Conector lógico que establece una condición de suficiencia: 'Si ocurre lo primero, entonces inevitablemente ocurre lo segundo'.",
    equation: "P \\implies Q",
    category: "Lógica"
  },
  equiv: {
    title: "Equivalencia ( ⟺ )",
    definition: "Indica que dos proposiciones son lógicamente equivalentes: ambas son verdaderas a la vez, o ambas son falsas a la vez.",
    equation: "P \\iff Q",
    category: "Lógica"
  },
  forall: {
    title: "Cuantificador Universal ( ∀ )",
    definition: "Se lee 'Para todo'. Indica que una propiedad o afirmación se cumple para absolutamente todos los elementos de un conjunto dado.",
    equation: "\\forall x \\in A, \\ P(x)",
    category: "Lógica"
  },
  exists: {
    title: "Cuantificador Existencial ( ∃ )",
    definition: "Se lee 'Existe al menos un'. Afirma que dentro de un conjunto hay, como mínimo, un elemento que cumple una propiedad determinada.",
    equation: "\\exists x \\in A : P(x)",
    category: "Lógica"
  },
  not: {
    title: "Negación Lógica ( ¬ )",
    definition: "Invierte el valor de verdad de una proposición. Si P es verdadera, ¬P es falsa, y viceversa.",
    equation: "P \\iff \\neg(\\neg P)",
    category: "Lógica"
  },
  and: {
    title: "Conjunción Lógica ( ∧ )",
    definition: "Operador lógico 'Y'. La proposición completa es verdadera solo si ambas sub-proposiciones son verdaderas.",
    equation: "P \\land Q",
    category: "Lógica"
  },
  or: {
    title: "Disyunción Lógica ( ∨ )",
    definition: "Operador lógico 'O'. La proposición completa es verdadera si al menos una de las sub-proposiciones es verdadera.",
    equation: "P \\lor Q",
    category: "Lógica"
  },
  contrapositiva: {
    title: "Contrapositiva",
    definition: "Dada una implicación lógia (P implica Q), su contrapositiva es (No Q implica No P). Ambas proposiciones son lógicamente equivalentes.",
    equation: "(P \\implies Q) \\iff (\\neg Q \\implies \\neg P)",
    category: "Lógica"
  },

  // ÁLGEBRA
  equals: {
    title: "Igualdad ( = )",
    definition: "Indica que dos expresiones matemáticas representan el mismo valor o entidad.",
    equation: "a = b",
    category: "Álgebra"
  },
  neq: {
    title: "Desigualdad ( ≠ )",
    definition: "Indica que dos expresiones matemáticas NO representan el mismo valor.",
    equation: "a \\neq b",
    category: "Álgebra"
  },
  less_than: {
    title: "Menor que ( < )",
    definition: "Establece una relación de orden estricto, indicando que el primer valor es inferior al segundo.",
    equation: "a < b",
    category: "Álgebra"
  },
  greater_than: {
    title: "Mayor que ( > )",
    definition: "Establece una relación de orden estricto, indicando que el primer valor es superior al segundo.",
    equation: "a > b",
    category: "Álgebra"
  },
  leq: {
    title: "Menor o igual que ( ≤ )",
    definition: "Relación de orden no estricto. El primer valor es inferior o exactamente igual al segundo.",
    equation: "a \\leq b",
    category: "Álgebra"
  },
  geq: {
    title: "Mayor o igual que ( ≥ )",
    definition: "Relación de orden no estricto. El primer valor es superior o exactamente igual al segundo.",
    equation: "a \\geq b",
    category: "Álgebra"
  },
  sum: {
    title: "Sumatoria ( ∑ )",
    definition: "Notación que compacta la suma de múltiples términos. La parte inferior indica la variable índice y su valor inicial (ej. i=1), la parte superior es el valor final, y lo que sigue es la expresión general que se suma en cada paso.",
    equation: "\\sum_{i=1}^n i = \\frac{n(n+1)}{2}",
    category: "Álgebra"
  },
  sqrt: {
    title: "Raíz Cuadrada ( √ )",
    definition: "Operación de encontrar un número que, multiplicado por sí mismo, resulta en el valor original.",
    equation: "\\sqrt{x^2} = |x|",
    category: "Álgebra"
  },
  approx: {
    title: "Aproximadamente igual ( ≈ )",
    definition: "Indica que dos valores son extremadamente cercanos pero no exactamente iguales. Se usa habitualmente al redondear números irracionales o en estimaciones.",
    equation: "\\pi \\approx 3.14159",
    category: "Álgebra"
  },
  par: {
    title: "Número Par",
    definition: "Un número entero que es múltiplo de 2.",
    equation: "n = 2k, \\quad k \\in \\mathbb{Z}",
    category: "Álgebra"
  },
  plus: {
    title: "Suma ( + )",
    definition: "Operación aritmética que combina cantidades o magnitudes en una sola.",
    equation: "a + b = c",
    category: "Álgebra"
  },
  minus: {
    title: "Resta ( - )",
    definition: "Operación aritmética que representa la eliminación de objetos de una colección o la diferencia entre dos magnitudes.",
    equation: "a - b = c",
    category: "Álgebra"
  },
  times: {
    title: "Multiplicación ( ×, · )",
    definition: "Suma repetida de un mismo número. En álgebra, se denota a menudo con un punto, yuxtaposición o el aspa.",
    equation: "a \\cdot b = ab",
    category: "Álgebra"
  },
  divide: {
    title: "División ( ÷, / )",
    definition: "Repartición de una cantidad en partes iguales. Operación inversa a la multiplicación.",
    equation: "\\frac{a}{b} = a \\div b",
    category: "Álgebra"
  },
  pm: {
    title: "Más/Menos ( ± )",
    definition: "Indica que una cantidad puede tomar el valor positivo o negativo, denotando dos posibles soluciones o un margen de error.",
    equation: "x = \\pm 2",
    category: "Álgebra"
  },
  
  // ANÁLISIS
  integral: {
    title: "Integral ( ∫ )",
    definition: "Representa el área neta bajo una curva. El límite inferior (abajo) indica dónde empieza el área, el superior (arriba) dónde termina. La 'dx' indica la variable sobre la que se está integrando (sumando áreas infinitesimales).",
    equation: "\\int_a^b f(x) dx",
    category: "Análisis"
  },
  limit: {
    title: "Límite ( lim )",
    definition: "Evalúa el comportamiento de una función a medida que su variable se acerca a un punto específico. La notación 'x → c' debajo indica hacia dónde se aproxima la variable.",
    equation: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1",
    category: "Análisis"
  },
  infinity: {
    title: "Infinito ( ∞ )",
    definition: "Concepto que describe algo sin límite o sin fin. No es un número real, sino una abstracción del crecimiento ilimitado.",
    equation: "\\lim_{x \\to \\infty} \\frac{1}{x} = 0",
    category: "Análisis"
  },
  euler: {
    title: "Número de Euler ( e )",
    definition: "Base de los logaritmos naturales. Es el límite matemático del interés compuesto continuo. Trasciende como e ≈ 2.718.",
    equation: "e = \\lim_{n \\to \\infty} (1 + \\frac{1}{n})^n",
    category: "Análisis"
  },
  imaginary: {
    title: "Unidad Imaginaria ( i )",
    definition: "Número que al elevarse al cuadrado resulta en -1. Permite la resolución de ecuaciones cuadráticas sin solución real.",
    equation: "i^2 = -1",
    category: "Análisis"
  },
  composition: {
    title: "Composición de Funciones ( ∘ )",
    definition: "Aplicar el resultado de una función como entrada de otra función.",
    equation: "(f \\circ g)(x) = f(g(x))",
    category: "Análisis"
  },

  // GEOMETRÍA
  hipotenusa: {
    title: "Hipotenusa",
    definition: "El lado de mayor longitud de un triángulo rectángulo, y el lado opuesto al ángulo recto.",
    equation: "c = \\sqrt{a^2 + b^2}",
    category: "Geometría"
  },
  pi: {
    title: "Número Pi ( π )",
    definition: "La relación constante entre la longitud de una circunferencia y su diámetro. Es un número irracional trascendente.",
    equation: "\\pi \\approx 3.14159...",
    category: "Geometría"
  },

  // TEORÍA DE CONJUNTOS
  in: {
    title: "Pertenencia ( ∈ )",
    definition: "Relaciona un elemento con un conjunto, indicando que el elemento forma parte de esa colección.",
    equation: "x \\in \\mathbb{R}",
    category: "Teoría de Conjuntos"
  },
  notin: {
    title: "No pertenencia ( ∉ )",
    definition: "Indica explícitamente que un elemento no forma parte de un conjunto determinado.",
    equation: "x \\notin \\mathbb{Q}",
    category: "Teoría de Conjuntos"
  },
  subset: {
    title: "Subconjunto ( ⊂ )",
    definition: "Indica que todos los elementos de un conjunto están completamente contenidos dentro de otro conjunto.",
    equation: "A \\subset B",
    category: "Teoría de Conjuntos"
  },
  union: {
    title: "Unión de Conjuntos ( ∪ )",
    definition: "Operación que combina los elementos de dos conjuntos en un nuevo conjunto que contiene todo lo de ambos.",
    equation: "A \\cup B",
    category: "Teoría de Conjuntos"
  },
  intersection: {
    title: "Intersección de Conjuntos ( ∩ )",
    definition: "Operación que crea un nuevo conjunto que contiene única y exclusivamente los elementos que comparten ambos conjuntos.",
    equation: "A \\cap B",
    category: "Teoría de Conjuntos"
  },
  emptyset: {
    title: "Conjunto Vacío ( ∅ )",
    definition: "El conjunto único que no contiene ningún elemento.",
    equation: "A \\cap \\emptyset = \\emptyset",
    category: "Teoría de Conjuntos"
  },
  real_numbers: {
    title: "Números Reales ( ℝ )",
    definition: "El conjunto de todos los números racionales (como 1/2) e irracionales (como π).",
    equation: "x \\in \\mathbb{R}",
    category: "Teoría de Conjuntos"
  },
  natural_numbers: {
    title: "Números Naturales ( ℕ )",
    definition: "El conjunto de números que usamos para contar objetos, a partir de cero o de uno.",
    equation: "1, 2, 3... \\in \\mathbb{N}",
    category: "Teoría de Conjuntos"
  },
  integers: {
    title: "Números Enteros ( ℤ )",
    definition: "El conjunto que incluye a los naturales, el cero, y los números negativos sin parte fraccionaria.",
    equation: "\\mathbb{Z} = \\{..., -1, 0, 1, ...\\}",
    category: "Teoría de Conjuntos"
  },
  rational_numbers: {
    title: "Números Racionales ( ℚ )",
    definition: "El conjunto de números que pueden expresarse como el cociente exacto de dos enteros.",
    equation: "q = \\frac{a}{b}, \\quad b \\neq 0",
    category: "Teoría de Conjuntos"
  },
  complex_numbers: {
    title: "Números Complejos ( ℂ )",
    definition: "El conjunto de números que se construyen con una parte real y una imaginaria.",
    equation: "z = a + bi \\in \\mathbb{C}",
    category: "Teoría de Conjuntos"
  },
  setminus: {
    title: "Diferencia de Conjuntos ( ∖ )",
    definition: "Conjunto de elementos que pertenecen al primero pero no al segundo (A menos B).",
    equation: "A \\setminus B",
    category: "Teoría de Conjuntos"
  },
  set_brackets: {
    title: "Llaves de Conjunto ( { } )",
    definition: "Delimitadores utilizados para enumerar explícitamente los elementos que componen un conjunto.",
    equation: "A = \\{ 1, 2, 3 \\}",
    category: "Teoría de Conjuntos"
  }
};

// Mapeo desde comandos de LaTeX hacia nuestro Glosario
export const texSymbolMap: Record<string, string> = {
  // Lógica
  '\\implies': 'implies',
  '\\Rightarrow': 'implies',
  '\\iff': 'equiv',
  '\\Leftrightarrow': 'equiv',
  '\\forall': 'forall',
  '\\exists': 'exists',
  '\\neg': 'not',
  '\\sim': 'not',
  '\\lor': 'or',
  '\\land': 'and',
  
  // Álgebra
  '=': 'equals',
  '\\neq': 'neq',
  '<': 'less_than',
  '>': 'greater_than',
  '\\leq': 'leq',
  '\\geq': 'geq',
  '\\sum': 'sum',
  '\\sqrt': 'sqrt',
  '\\approx': 'approx',
  '+': 'plus',
  '-': 'minus',
  '\\times': 'times',
  '\\cdot': 'times',
  '\\div': 'divide',
  '\\pm': 'pm',
  
  // Análisis
  '\\int': 'integral',
  '\\infty': 'infinity',
  '\\lim': 'limit',
  '\\circ': 'composition',
  
  // Geometría
  '\\pi': 'pi',
  
  // Conjuntos
  '\\in': 'in',
  '\\notin': 'notin',
  '\\subset': 'subset',
  '\\subseteq': 'subset',
  '\\supset': 'subset',
  '\\supseteq': 'subset',
  '\\cup': 'union',
  '\\cap': 'intersection',
  '\\emptyset': 'emptyset',
  '\\mathbb{R}': 'real_numbers',
  '\\mathbb{N}': 'natural_numbers',
  '\\mathbb{Z}': 'integers',
  '\\mathbb{Q}': 'rational_numbers',
  '\\mathbb{C}': 'complex_numbers',
  '\\setminus': 'setminus',
  '\\{': 'set_brackets',
  '\\}': 'set_brackets',
  
  // Varios
  '\\blacksquare': 'qed',
  '\\text{Q.E.D.}': 'qed'
};

export const useGlossaryStore = create<GlossaryState>((set) => ({
  activeTerm: null,
  activeFormulaTerms: null,
  displayMode: 'sidebar',
  openTerm: (termId) => set({ activeTerm: termId, activeFormulaTerms: null }),
  openFormulaTerms: (termIds) => set({ activeFormulaTerms: termIds, activeTerm: null }),
  closeTerm: () => set({ activeTerm: null, activeFormulaTerms: null }),
  toggleDisplayMode: () => set((state) => ({ displayMode: state.displayMode === 'sidebar' ? 'modal' : 'sidebar' }))
}));
