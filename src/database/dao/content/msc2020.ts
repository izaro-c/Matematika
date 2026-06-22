import type { BaseContent } from '@/database/dao/content/types';

/**
 * Mapeo de tags existentes en los archivos MDX a códigos MSC2020.
 */
export const tagToMSC: Record<string, string> = {
  "geometría": "51",
  "geometria": "51",
  "geometría de incidencia": "51A",
  "incidencia": "51A",
  "geometría absoluta": "51M",
  "geometria absoluta": "51M",
  "geometria-absoluta": "51M",
  "geometría euclidiana": "51M",
  "geometria euclidiana": "51M",
  "geometria-euclidiana": "51M",
  "geometría hiperbólica": "51M",
  "geometria hiperbolica": "51M",
  "geometria-hiperbolica": "51M",
  "geometría analítica": "51P",
  "geometria analitica": "51P",
  "geometría afín": "51A",
  "congruencia": "51M",
  "continuidad": "51M",
  "orden": "51",
  "paralelas": "51M",
  "primitivo": "51",
  "espacio": "51",
  "unidimensional": "51",
  "bidimensional": "51",
  "medida": "51M",
  "triangulos": "51M",
  "pasch": "51",
  "fundamentos": "03",
  "neutral": "51M",
  "absoluta": "51M",
  "euclidiana": "51M",
  "clasica": "51M",
  "hiperbolica": "51M",
  "no-euclidiana": "51M",
  "lógica": "03",
  "logica": "03",
  "sistemas formales": "03",
  "filosofía de las matemáticas": "00A",
  "filosofia de las matematicas": "00A",
  "álgebra": "15",
  "algebra": "15",
  "álgebra lineal": "15A",
  "algebra lineal": "15A",
  "análisis": "26",
  "analisis": "26",
  "cálculo": "26",
  "calculo": "26",
  "probabilidad": "60",
  "estadística": "62",
  "estadistica": "62",
};

export const mscNames: Record<string, string> = {
  "00": "Temas generales y globales; colecciones",
  "00A": "Generalidades, recreación, divulgación y filosofía de la matemática",
  "00B": "Actas de congresos y colecciones de artículos",
  "01": "Historia y biografía",
  "01A": "Historia de las matemáticas y biografías de matemáticos",
  "97": "Educación matemática",
  "97B": "Política educativa y sistemas educacionales",
  "97C": "Psicología de la educación matemática",
  "97G": "Geometría (educación)",
  "97H": "Álgebra (educación)",
  "97I": "Análisis (educación)",
  "03": "Lógica matemática y fundamentos",
  "03A": "Aspectos filosóficos y fundacionales",
  "03B": "Lógica general (proposicional, primer orden, modal)",
  "03C": "Teoría de modelos",
  "03D": "Teoría de la computabilidad y recursión",
  "03E": "Teoría de conjuntos (cardinales, ordinales, axioma de elección)",
  "03F": "Teoría de la demostración y matemática constructiva",
  "03G": "Lógica algebraica (álgebras de Boole)",
  "08": "Sistemas algebraicos generales",
  "08A": "Estructuras algebraicas y homomorfismos",
  "08B": "Variedades de álgebras",
  "08C": "Clases de álgebras",
  "11": "Teoría de números",
  "11A": "Teoría de números elemental",
  "11D": "Ecuaciones diofánticas",
  "11F": "Formas modulares y automorfas",
  "11R": "Teoría de números algebraica",
  "11Y": "Teoría de números computacional",
  "12": "Teoría de cuerpos y polinomios",
  "12F": "Extensiones de cuerpos y Teoría de Galois",
  "12H": "Álgebra diferencial",
  "13": "Álgebra conmutativa",
  "13B": "Extensiones de anillos",
  "13F": "Anillos aritméticos y de factorización única",
  "14": "Geometría algebraica",
  "14H": "Curvas algebraicas",
  "14J": "Superficies y variedades de dimensión superior",
  "14K": "Variedades abelianas",
  "15": "Álgebra lineal y multilineal; teoría de matrices",
  "15A": "Espacios vectoriales y transformaciones lineales básicas",
  "15B": "Matrices especiales (ortogonales, simétricas, booleanas)",
  "geometria-algebraica": "Geometría Algebraica",
  "algebra-abstracta": "Álgebra Abstracta (Anillos y Cuerpos)",
  "teoria-de-grupos-y-categorias": "Teoría de Grupos y Categorías",
  "18": "Teoría de categorías; álgebra homológica",
  "18A": "Teoría de categorías general",
  "18B": "Categorías especiales (topos)",
  "18G": "Álgebra homológica",
  "20": "Teoría de grupos y generalizaciones",
  "20D": "Grupos finitos abstractos",
  "20F": "Grupos infinitos especiales (presentaciones)",
  "20M": "Semigrupos",
  "analisis-real-y-funciones": "Análisis Real y Funciones",
  "analisis-complejo": "Análisis Complejo",
  "ecuaciones-diferenciales": "Ecuaciones Diferenciales",
  "analisis-funcional-y-armonico": "Análisis Funcional y Armónico",
  "26": "Funciones reales",
  "26A": "Funciones de una variable",
  "26B": "Funciones de varias variables",
  "30": "Funciones de una variable compleja",
  "30C": "Teoría geométrica de funciones",
  "30D": "Funciones analíticas y meromorfas",
  "34": "Ecuaciones diferenciales ordinarias",
  "34A": "Teoría general (existencia, unicidad)",
  "34C": "Teoría cualitativa",
  "34D": "Teoría de estabilidad",
  "46": "Análisis funcional",
  "46B": "Espacios de Banach",
  "46C": "Espacios de Hilbert",
  "46L": "Álgebras de operadores (Álgebras C*)",
  "geometria-clasica-y-diferencial": "Geometría Clásica y Diferencial",
  "topologia-general-y-algebraica": "Topología General y Algebraica",
  "51": "Geometría",
  "51A": "Geometría de incidencia lineal",
  "51M": "Geometría euclidiana y absoluta real",
  "51P": "Geometría y física",
  "53": "Geometría diferencial",
  "53A": "Geometría diferencial clásica",
  "53C": "Geometría global (variedades de Riemann)",
  "53D": "Geometría simpléctica y de contacto",
  "54": "Topología general",
  "54D": "Propiedades de recubrimiento y separación (compacidad)",
  "54E": "Espacios con estructuras más ricas (espacios métricos)",
  "54F": "Espacios topológicos especiales (curvas, dimensión)",
  "55": "Topología algebraica",
  "55M": "Topología algebraica clásica",
  "55N": "Homología y cohomología",
  "55Q": "Teoría de homotopía",
  "05": "Combinatoria",
  "05A": "Combinatoria enumerativa",
  "05B": "Diseños y configuraciones",
  "05C": "Teoría de grafos",
  "68": "Ciencias de la computación",
  "68Q": "Teoría de la computación (Algoritmos, Complejidad P/NP)",
  "68R": "Informática discreta (Grafos en computación)",
  "68T": "Inteligencia artificial",
  "68W": "Algoritmos computacionales especializados",
  "optimizacion-y-teoria-de-juegos": "Optimización y Teoría de Juegos",
  "fisica-matematica-y-biologia": "Física Matemática y Biología",
  "49": "Cálculo de variaciones y control óptimo; optimización",
  "49J": "Existencia de soluciones",
  "49K": "Condiciones de optimalidad",
  "49L": "Ecuaciones de Hamilton-Jacobi",
  "60": "Teoría de la probabilidad y procesos estocásticos",
  "60B": "Probabilidad en estructuras algebraicas y topológicas",
  "60C": "Probabilidad combinatoria",
  "60E": "Distribuciones, funciones características",
  "60F": "Teoremas límite (Ley de los grandes números, Teorema central del límite)",
  "60G": "Procesos estocásticos",
  "60H": "Análisis estocástico (Integrales de Itô)",
  "60J": "Cadenas de Markov, procesos de salto",
  "62": "Estadística",
  "62C": "Teoría de decisión estadística",
  "62D": "Muestreo, encuestas",
  "62F": "Inferencia paramétrica (Estimación de máxima verosimilitud)",
  "62G": "Inferencia no paramétrica",
  "62H": "Análisis multivariante",
  "62J": "Modelos lineales (Regresión, ANOVA)",
  "62M": "Inferencia en procesos estocásticos",
  "62P": "Aplicaciones estadísticas (Biometría, Econometría)",
  "65": "Análisis numérico",
  "65D": "Aproximación numérica (Interpolación, Cuadratura)",
  "65F": "Álgebra lineal numérica",
  "65H": "Sistemas de ecuaciones no lineales",
  "65L": "Ecuaciones diferenciales ordinarias numéricas",
  "65M": "Ecuaciones en derivadas parciales numéricas (Elementos finitos)",
  "70": "Mecánica de partículas y sistemas",
  "70E": "Dinámica de cuerpos rígidos",
  "70F": "Dinámica de sistemas de partículas (Problema de los N cuerpos)",
  "70H": "Mecánica hamiltoniana y lagrangiana",
  "74": "Mecánica de sólidos deformables",
  "74B": "Elasticidad lineal",
  "74F": "Acoplamiento de campos mecánicos con térmicos/electromagnéticos",
  "76": "Mecánica de fluidos",
  "76B": "Fluidos incompresibles no viscosos",
  "76D": "Fluidos incompresibles viscosos (Ecuaciones de Navier-Stokes)",
  "78": "Óptica, teoría electromagnética",
  "78A": "Óptica clásica y electromagnetismo (Ecuaciones de Maxwell)",
  "80": "Termodinámica clásica, transferencia de calor",
  "80A": "Termodinámica y transferencia de calor",
  "81": "Teoría cuántica",
  "81P": "Fundamentos, teoría cuántica de la información y entrelazamiento",
  "81Q": "Mecánica cuántica general",
  "81T": "Teoría cuántica de campos",
  "82": "Mecánica estadística, estructura de la materia",
  "82B": "Mecánica estadística de equilibrio",
  "82C": "Mecánica estadística dependiente del tiempo",
  "83": "Relatividad y teoría gravitacional",
  "83C": "Relatividad general",
  "83E": "Teorías unificadas y gravedad cuántica (Teoría de cuerdas)",
  "85": "Astronomía y astrofísica",
  "85A": "Modelos matemáticos en astronomía",
  "86": "Geofísica",
  "86A": "Modelos matemáticos en geofísica (Sismología, meteorología)",
  "90": "Investigación operativa, programación matemática",
  "90B": "Investigación operativa (Inventario, logística, teoría de colas)",
  "90C": "Programación matemática (Lineal, entera, convexa)",
  "91": "Teoría de juegos, economía, ciencias sociales y del comportamiento",
  "91A": "Teoría de juegos (Juegos cooperativos y no cooperativos)",
  "91B": "Economía matemática (Finanzas, teoría del equilibrio)",
  "92": "Biología y otras ciencias naturales",
  "92B": "Biología matemática en general",
  "92C": "Biomecánica y fisiología",
  "92D": "Genética y dinámica de poblaciones",
  "metadatos-y-divulgacion": "Ciencia y Técnica",
  "fundamentos-y-logica": "Fundamentos y Lógica",
  "algebra-y-teoria-de-numeros": "Álgebra y Teoría de Números",
  "analisis-matematico": "Análisis Matemático",
  "geometria-y-topologia": "Geometría y Topología",
  "matematica-discreta-y-computacional": "Matemática Discreta y Computacional",
  "probabilidad-estadistica-y-aplicaciones": "Probabilidad, Estadística y Aplicaciones",
};

export const mscHierarchy: Record<string, string[]> = {
  "00": ["00A", "00B"],
  "01": ["01A"],
  "97": ["97B", "97C", "97G", "97H", "97I"],
  "03": ["03A", "03B", "03C", "03D", "03E", "03F", "03G"],
  "08": ["08A", "08B", "08C"],
  "geometria-algebraica": ["14"],
  "algebra-abstracta": ["12", "13"],
  "teoria-de-grupos-y-categorias": ["18", "20"],
  "11": ["11A", "11D", "11F", "11R", "11Y"],
  "12": ["12F", "12H"],
  "13": ["13B", "13F"],
  "14": ["14H", "14J", "14K"],
  "15": ["15A", "15B"],
  "18": ["18A", "18B", "18G"],
  "20": ["20D", "20F", "20M"],
  "analisis-real-y-funciones": ["26"],
  "analisis-complejo": ["30"],
  "ecuaciones-diferenciales": ["34"],
  "analisis-funcional-y-armonico": ["46"],
  "26": ["26A", "26B"],
  "30": ["30C", "30D"],
  "34": ["34A", "34C", "34D"],
  "46": ["46B", "46C", "46L"],
  "geometria-clasica-y-diferencial": ["51", "53"],
  "topologia-general-y-algebraica": ["54", "55"],
  "51": ["51A", "51M", "51P"],
  "53": ["53A", "53C", "53D"],
  "54": ["54D", "54E", "54F"],
  "55": ["55M", "55N", "55Q"],
  "05": ["05A", "05B", "05C"],
  "68": ["68Q", "68R", "68T", "68W"],
  "optimizacion-y-teoria-de-juegos": ["49", "90", "91"],
  "fisica-matematica-y-biologia": ["70", "74", "76", "78", "80", "81", "82", "83", "85", "86", "92"],
  "49": ["49J", "49K", "49L"],
  "60": ["60B", "60C", "60E", "60F", "60G", "60H", "60J"],
  "62": ["62C", "62D", "62F", "62G", "62H", "62J", "62M", "62P"],
  "65": ["65D", "65F", "65H", "65L", "65M"],
  "70": ["70E", "70F", "70H"],
  "74": ["74B", "74F"],
  "76": ["76B", "76D"],
  "78": ["78A"],
  "80": ["80A"],
  "81": ["81P", "81Q", "81T"],
  "82": ["82B", "82C"],
  "83": ["83C", "83E"],
  "85": ["85A"],
  "86": ["86A"],
  "90": ["90B", "90C"],
  "91": ["91A", "91B"],
  "92": ["92B", "92C", "92D"],
  "metadatos-y-divulgacion": ["00", "01", "97"],
  "fundamentos-y-logica": ["03", "08"],
  "algebra-y-teoria-de-numeros": ["11", "15", "geometria-algebraica", "algebra-abstracta", "teoria-de-grupos-y-categorias"],
  "analisis-matematico": ["analisis-real-y-funciones", "analisis-complejo", "ecuaciones-diferenciales", "analisis-funcional-y-armonico"],
  "geometria-y-topologia": ["geometria-clasica-y-diferencial", "topologia-general-y-algebraica"],
  "matematica-discreta-y-computacional": ["05", "68"],
  "probabilidad-estadistica-y-aplicaciones": ["optimizacion-y-teoria-de-juegos", "fisica-matematica-y-biologia", "60", "62", "65"],
};

export const mscParent: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const [parent, children] of Object.entries(mscHierarchy)) {
    for (const child of children) {
      map[child] = parent;
    }
  }
  return map;
})();

export const codeInheritance: Record<string, string[]> = mscHierarchy;

export function resolveBranchCode(input: string): string {
  const trimmed = input.trim();
  if (mscNames[trimmed]) return trimmed;
  const upper = trimmed.toUpperCase();
  if (mscNames[upper]) return upper;
  const mapped = tagToMSC[trimmed.toLowerCase()] || tagToMSC[trimmed];
  if (mapped) return mapped;
  const slugMapped = tagToMSC[trimmed.replace(/-/g, ' ')];
  if (slugMapped) return slugMapped;
  return trimmed;
}

export function getChildCodes(parentCode: string): string[] {
  return codeInheritance[parentCode] || [];
}

export function getAllDescendantCodes(code: string): string[] {
  const children = getChildCodes(code);
  const descendants = [...children];
  for (const child of children) {
    const grand = getAllDescendantCodes(child);
    descendants.push(...grand);
  }
  return descendants;
}

export interface BranchTaxonomy {
  id: string;
  slug: string;
  name: string;
  subBranches: { name: string; slug: string }[];
  directItems: { type: string; item: BaseContent & { tags?: string[] }; subBranchSlug?: string }[];
  breadcrumbs: { name: string; slug: string }[];
}

function buildBreadcrumbs(branchCode: string): BranchTaxonomy['breadcrumbs'] {
  const breadcrumbs: BranchTaxonomy['breadcrumbs'] = [];
  const chain: string[] = [];
  const seen = new Set<string>();
  let cur: string | undefined = branchCode;
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    chain.unshift(cur);
    cur = mscParent[cur];
  }
  for (let i = 0; i < chain.length - 1; i++) {
    breadcrumbs.push({ name: mscNames[chain[i]] || chain[i], slug: chain[i] });
  }
  return breadcrumbs;
}

function classifyItem(
  item: BaseContent & { tags?: string[] },
  branchCode: string,
  childCodes: string[],
  allDescendantCodes: string[],
): { type: string; item: BaseContent & { tags?: string[] }; subBranchSlug?: string } | null {
  if (!item.tags || item.tags.length === 0) return null;
  const tagCodes = item.tags.map(t => tagToMSC[t]).filter((c): c is string => !!c);
  if (tagCodes.length === 0) return null;

  const directMatch = tagCodes.includes(branchCode);
  const inheritedChildCode = directMatch ? undefined
    : allDescendantCodes.find(c => tagCodes.includes(c));

  if (!directMatch && !inheritedChildCode) return null;

  let subBranchSlug: string | undefined;
  if (directMatch) {
    subBranchSlug = childCodes.find(c => tagCodes.includes(c));
  } else if (inheritedChildCode) {
    subBranchSlug = inheritedChildCode;
  }

  return { type: 'classified', item, subBranchSlug };
}

export function buildBranchTaxonomy(
  branchId: string,
  items: { type: string; item: BaseContent & { tags?: string[] } }[],
): BranchTaxonomy {
  const branchCode = resolveBranchCode(branchId);
  const branchName = mscNames[branchCode] || branchId;
  const childCodes = getChildCodes(branchCode);
  const allDescendantCodes = getAllDescendantCodes(branchCode);

  const directItems: BranchTaxonomy['directItems'] = [];
  for (const { type, item } of items) {
    const classified = classifyItem(item, branchCode, childCodes, allDescendantCodes);
    if (classified) directItems.push({ type, item: classified.item, subBranchSlug: classified.subBranchSlug });
  }

  const breadcrumbs = buildBreadcrumbs(branchCode);
  const subBranches = childCodes
    .map(code => ({ name: mscNames[code] || code, slug: code }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    id: branchCode,
    slug: branchCode.toLowerCase(),
    name: branchName,
    subBranches,
    directItems,
    breadcrumbs,
  };
}

export function getItemsByBranch(
  branch: string,
  items: { type: string; item: BaseContent & { tags?: string[] } }[],
): { type: string; item: BaseContent & { tags?: string[] } }[] {
  const branchCode = resolveBranchCode(branch);
  const allDescendantCodes = getAllDescendantCodes(branchCode);
  const results: { type: string; item: BaseContent & { tags?: string[] } }[] = [];

  for (const { type, item } of items) {
    if (!item.tags) continue;
    const tagCodes = item.tags
      .map(t => tagToMSC[t])
      .filter((c): c is string => !!c);
    if (tagCodes.includes(branchCode) || allDescendantCodes.some(c => tagCodes.includes(c))) {
      results.push({ type, item });
    }
  }
  return results;
}
