export const DIFF_COLORS: Record<string, string> = {
  básico: 'var(--theme-musgo)',
  basico: 'var(--theme-musgo)',
  elemental: 'var(--theme-musgo)',
  intermedio: 'var(--theme-ocre)',
  avanzado: 'var(--theme-granada)',
  experto: 'var(--theme-granada)',
};

export const DOMAIN_ICONS: Record<string, string> = {
  ingeniería: '⚙',
  arquitectura: '⌂',
  medicina: '⚕',
  biología: '⌬',
  economía: '◇',
  finanzas: '◇',
  naturaleza: '≈',
  arte: '✎',
  música: '♩',
  astronomía: '✦',
  física: '⚛',
  geografía: '⊕',
  cartografía: '◫',
  informática: '⌘',
};

function mix(color: string, bg: string, pct: number): string {
  return `color-mix(in srgb, ${color}, ${bg} ${pct}%)`;
}

export const DOMAIN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  ingeniería: { bg: mix('var(--theme-ocre)', 'var(--theme-lienzo)', 85), text: 'var(--theme-ocre)', border: mix('var(--theme-ocre)', 'transparent', 50) },
  arquitectura: { bg: mix('var(--theme-mora)', 'var(--theme-lienzo)', 85), text: 'var(--theme-mora)', border: mix('var(--theme-mora)', 'transparent', 50) },
  medicina: { bg: mix('var(--theme-canela)', 'var(--theme-lienzo)', 85), text: 'var(--theme-canela)', border: mix('var(--theme-canela)', 'transparent', 50) },
  biología: { bg: mix('var(--theme-musgo)', 'var(--theme-lienzo)', 85), text: 'var(--theme-musgo)', border: mix('var(--theme-musgo)', 'transparent', 50) },
  economía: { bg: mix('var(--theme-ocre)', 'var(--theme-lienzo)', 85), text: 'var(--theme-ocre)', border: mix('var(--theme-ocre)', 'transparent', 50) },
  finanzas: { bg: mix('var(--theme-ocre)', 'var(--theme-lienzo)', 85), text: 'var(--theme-ocre)', border: mix('var(--theme-ocre)', 'transparent', 50) },
  naturaleza: { bg: mix('var(--theme-canela)', 'var(--theme-lienzo)', 85), text: 'var(--theme-canela)', border: mix('var(--theme-canela)', 'transparent', 50) },
  física: { bg: mix('var(--theme-pavo)', 'var(--theme-lienzo)', 85), text: 'var(--theme-pavo)', border: mix('var(--theme-pavo)', 'transparent', 50) },
  astronomía: { bg: mix('var(--theme-mora)', 'var(--theme-lienzo)', 85), text: 'var(--theme-mora)', border: mix('var(--theme-mora)', 'transparent', 50) },
  cartografía: { bg: mix('var(--theme-canela)', 'var(--theme-lienzo)', 85), text: 'var(--theme-canela)', border: mix('var(--theme-canela)', 'transparent', 50) },
};

export interface ContentTypeStyle {
  bg: string;
  border: string;
  text: string;
  badge: string;
  ringColor: string;
}

export interface ContentTypeConfig {
  id: string;
  labelSingular: string;
  labelPlural: string;
  routePrefix: string;
  graphGroup: string;
  graphColor: string;
  nodeStyle: ContentTypeStyle;
  hierarchyLevel: number;
}

import { CONTENT_TYPE_COLORS, CONTENT_TYPE_ALIASES } from '@/design/contentTypeColors';

// Shorthand helpers
const c = (type: keyof typeof CONTENT_TYPE_COLORS) => CONTENT_TYPE_COLORS[type];

export const CONTENT_TYPE_CONFIG: Record<string, ContentTypeConfig> = {
  axioma: {
    id: 'axioma',
    labelSingular: 'Axioma',
    labelPlural: 'Axiomas',
    routePrefix: 'axioma',
    graphGroup: 'axioma',
    graphColor: c('axioma').cssVar,
    nodeStyle: { bg: c('axioma').cssVar, border: c('axioma').cssVar, text: 'var(--theme-lienzo)', badge: 'AXIOMA', ringColor: c('axioma').cssVar },
    hierarchyLevel: 0,
  },
  'sistema-axiomatico': {
    id: 'sistema-axiomatico',
    labelSingular: 'Sistema axiomático',
    labelPlural: 'Sistemas axiomáticos',
    routePrefix: 'sistema',
    graphGroup: 'sistema-axiomatico',
    graphColor: c('sistema-axiomatico').cssVar,
    nodeStyle: { bg: c('sistema-axiomatico').cssVar, border: c('sistema-axiomatico').cssVar, text: 'var(--theme-lienzo)', badge: 'SISTEMA', ringColor: c('sistema-axiomatico').cssVar },
    hierarchyLevel: 0,
  },
  concepto: {
    id: 'concepto',
    labelSingular: 'Concepto',
    labelPlural: 'Conceptos',
    routePrefix: 'definicion',
    graphGroup: 'definition',
    graphColor: c('concepto').cssVar,
    nodeStyle: { bg: c('concepto').cssVar, border: c('concepto').cssVar, text: 'var(--theme-lienzo)', badge: 'CONCEPTO', ringColor: c('concepto').cssVar },
    hierarchyLevel: 0,
  },
  definicion: {
    id: 'definicion',
    labelSingular: 'Definición',
    labelPlural: 'Definiciones',
    routePrefix: 'definicion',
    graphGroup: 'definition',
    graphColor: c('definicion').cssVar,
    nodeStyle: { bg: c('definicion').cssVar, border: c('definicion').cssVar, text: 'var(--theme-lienzo)', badge: 'DEFINICION', ringColor: c('definicion').cssVar },
    hierarchyLevel: 1,
  },
  lema: {
    id: 'lema',
    labelSingular: 'Lema',
    labelPlural: 'Lemas',
    routePrefix: 'teorema',
    graphGroup: 'lemma',
    graphColor: c('lema').cssVar,
    nodeStyle: { bg: c('lema').cssVar, border: c('lema').cssVar, text: 'var(--theme-lienzo)', badge: 'LEMA', ringColor: c('lema').cssVar },
    hierarchyLevel: 2,
  },
  teorema: {
    id: 'teorema',
    labelSingular: 'Teorema',
    labelPlural: 'Teoremas',
    routePrefix: 'teorema',
    graphGroup: 'theorem',
    graphColor: c('teorema').cssVar,
    nodeStyle: { bg: c('teorema').cssVar, border: c('teorema').cssVar, text: 'var(--theme-lienzo)', badge: 'TEOREMA', ringColor: c('teorema').cssVar },
    hierarchyLevel: 3,
  },
  corolario: {
    id: 'corolario',
    labelSingular: 'Corolario',
    labelPlural: 'Corolarios',
    routePrefix: 'teorema',
    graphGroup: 'corollary',
    graphColor: c('corolario').cssVar,
    nodeStyle: { bg: c('corolario').cssVar, border: c('corolario').cssVar, text: 'var(--theme-lienzo)', badge: 'COROLARIO', ringColor: c('corolario').cssVar },
    hierarchyLevel: 4,
  },
  demostracion: {
    id: 'demostracion',
    labelSingular: 'Demostración',
    labelPlural: 'Demostraciones',
    routePrefix: 'demo',
    graphGroup: 'demostracion',
    graphColor: c('demostracion').cssVar,
    nodeStyle: { bg: c('demostracion').cssVar, border: c('demostracion').cssVar, text: 'var(--theme-lienzo)', badge: 'DEMO', ringColor: c('demostracion').cssVar },
    hierarchyLevel: 5,
  },
  ejemplo: {
    id: 'ejemplo',
    labelSingular: 'Ejemplo',
    labelPlural: 'Ejemplos',
    routePrefix: 'ejemplo',
    graphGroup: 'example',
    graphColor: c('ejemplo').cssVar,
    nodeStyle: { bg: c('ejemplo').cssVar, border: c('ejemplo').cssVar, text: 'var(--theme-lienzo)', badge: 'EJEMPLO', ringColor: c('ejemplo').cssVar },
    hierarchyLevel: 10,
  },
  ejercicio: {
    id: 'ejercicio',
    labelSingular: 'Ejercicio',
    labelPlural: 'Ejercicios',
    routePrefix: 'ejercicio',
    graphGroup: 'exercise',
    graphColor: c('ejercicio').cssVar,
    nodeStyle: { bg: c('ejercicio').cssVar, border: c('ejercicio').cssVar, text: 'var(--theme-lienzo)', badge: 'EJERCICIO', ringColor: c('ejercicio').cssVar },
    hierarchyLevel: 10,
  },
  'caso-de-uso': {
    id: 'caso-de-uso',
    labelSingular: 'Caso de uso',
    labelPlural: 'Casos de uso',
    routePrefix: 'caso',
    graphGroup: 'usecase',
    graphColor: c('caso-de-uso').cssVar,
    nodeStyle: { bg: c('caso-de-uso').cssVar, border: c('caso-de-uso').cssVar, text: 'var(--theme-lienzo)', badge: 'USO', ringColor: c('caso-de-uso').cssVar },
    hierarchyLevel: 10,
  },
  matematico: {
    id: 'matematico',
    labelSingular: 'Matemático',
    labelPlural: 'Matemáticos',
    routePrefix: 'bio',
    graphGroup: 'mathematician',
    graphColor: c('matematico').cssVar,
    nodeStyle: { bg: c('matematico').cssVar, border: c('matematico').cssVar, text: 'var(--theme-lienzo)', badge: 'BIO', ringColor: c('matematico').cssVar },
    hierarchyLevel: 10,
  },
  metodo: {
    id: 'metodo',
    labelSingular: 'Método',
    labelPlural: 'Métodos',
    routePrefix: 'metodo',
    graphGroup: 'method',
    graphColor: c('metodo').cssVar,
    nodeStyle: { bg: c('metodo').cssVar, border: c('metodo').cssVar, text: 'var(--theme-lienzo)', badge: 'MÉTODO', ringColor: c('metodo').cssVar },
    hierarchyLevel: 10,
  },
  modelo: {
    id: 'modelo',
    labelSingular: 'Modelo',
    labelPlural: 'Modelos',
    routePrefix: 'modelo',
    graphGroup: 'modelo',
    graphColor: c('modelo').cssVar,
    nodeStyle: { bg: c('modelo').cssVar, border: c('modelo').cssVar, text: 'var(--theme-lienzo)', badge: 'MODELO', ringColor: c('modelo').cssVar },
    hierarchyLevel: 10,
  },
  'plan-de-estudio': {
    id: 'plan-de-estudio',
    labelSingular: 'Plan de estudio',
    labelPlural: 'Planes de estudio',
    routePrefix: 'plan',
    graphGroup: 'plan-de-estudio',
    graphColor: c('plan-de-estudio').cssVar,
    nodeStyle: { bg: c('plan-de-estudio').cssVar, border: c('plan-de-estudio').cssVar, text: 'var(--theme-lienzo)', badge: 'PLAN', ringColor: c('plan-de-estudio').cssVar },
    hierarchyLevel: 10,
  },
  glosario: {
    id: 'glosario',
    labelSingular: 'Glosario',
    labelPlural: 'Glosario',
    routePrefix: 'glosario',
    graphGroup: 'concept',
    graphColor: c('glosario').cssVar,
    nodeStyle: { bg: c('glosario').cssVar, border: c('glosario').cssVar, text: 'var(--theme-lienzo)', badge: 'GLOSARIO', ringColor: c('glosario').cssVar },
    hierarchyLevel: 10,
  },
  msc2020: {
    id: 'msc2020',
    labelSingular: 'Clasificación MSC2020',
    labelPlural: 'Clasificación MSC2020',
    routePrefix: 'msc2020',
    graphGroup: 'concept',
    graphColor: c('msc2020').cssVar,
    nodeStyle: { bg: c('msc2020').cssVar, border: c('msc2020').cssVar, text: 'var(--theme-lienzo)', badge: 'MSC2020', ringColor: c('msc2020').cssVar },
    hierarchyLevel: 10,
  },
};

export const GRAPH_NODE_COLORS: Record<string, string> = {
  central: CONTENT_TYPE_COLORS.matematico.cssVar,
  branch:  CONTENT_TYPE_COLORS.teorema.cssVar,
  ...Object.fromEntries(
    Object.values(CONTENT_TYPE_CONFIG).map(cfg => [cfg.graphGroup, cfg.nodeStyle.bg]),
  ),
};

export const TYPE_STYLES: Record<string, ContentTypeStyle> = Object.fromEntries(
  Object.entries(CONTENT_TYPE_CONFIG).map(([id, cfg]) => [id, cfg.nodeStyle]),
);

export const SITE_TAGLINE = 'Enciclopedia de estructuras formales — teoremas, definiciones y demostraciones';

// ── Tablas derivadas y funciones utilitarias canónicas ───────────────────────

const NON_CONTENT_CATEGORY_LABELS: Record<string, { singular: string; plural: string }> = {
  geometria: { singular: 'Geometría', plural: 'Geometría' },
  geometry: { singular: 'Geometría', plural: 'Geometría' },
  algebra: { singular: 'Álgebra', plural: 'Álgebra' },
  calculo: { singular: 'Cálculo', plural: 'Cálculo' },
  calculus: { singular: 'Cálculo', plural: 'Cálculo' },
  logica: { singular: 'Lógica', plural: 'Lógica' },
  logic: { singular: 'Lógica', plural: 'Lógica' },
  general: { singular: 'General', plural: 'General' },
  triangulos: { singular: 'Triángulo', plural: 'Triángulos' },
};

const NON_CONTENT_CATEGORY_LABELS_EU: Record<string, { singular: string; plural: string }> = {
  geometria: { singular: 'Geometria', plural: 'Geometria' },
  geometry: { singular: 'Geometria', plural: 'Geometria' },
  algebra: { singular: 'Aljebra', plural: 'Aljebra' },
  calculo: { singular: 'Kalkulua', plural: 'Kalkulua' },
  calculus: { singular: 'Kalkulua', plural: 'Kalkulua' },
  logica: { singular: 'Logika', plural: 'Logika' },
  logic: { singular: 'Logika', plural: 'Logika' },
  general: { singular: 'Orokorra', plural: 'Orokorra' },
  triangulos: { singular: 'Hirukia', plural: 'Hirukiak' },
};

const NON_CONTENT_CATEGORY_LABELS_EN: Record<string, { singular: string; plural: string }> = {
  geometria: { singular: 'Geometry', plural: 'Geometry' },
  geometry: { singular: 'Geometry', plural: 'Geometry' },
  algebra: { singular: 'Algebra', plural: 'Algebra' },
  calculo: { singular: 'Calculus', plural: 'Calculus' },
  calculus: { singular: 'Calculus', plural: 'Calculus' },
  logica: { singular: 'Logic', plural: 'Logic' },
  logic: { singular: 'Logic', plural: 'Logic' },
  general: { singular: 'General', plural: 'General' },
  triangulos: { singular: 'Triangle', plural: 'Triangles' },
};

const CONTENT_TYPE_LABELS_EU: Record<string, { singular: string; plural: string }> = {
  axioma: { singular: 'Axioma', plural: 'Axiomak' },
  'sistema-axiomatico': { singular: 'Sistema axiomatikoa', plural: 'Sistema axiomatikoak' },
  concepto: { singular: 'Kontzeptua', plural: 'Kontzeptuak' },
  definicion: { singular: 'Definizioa', plural: 'Definizioak' },
  lema: { singular: 'Lema', plural: 'Lemak' },
  teorema: { singular: 'Teorema', plural: 'Teoremak' },
  corolario: { singular: 'Korolarioa', plural: 'Korolarioak' },
  demostracion: { singular: 'Frogapena', plural: 'Frogapenak' },
  ejemplo: { singular: 'Adibidea', plural: 'Adibideak' },
  ejercicio: { singular: 'Ariketa', plural: 'Ariketak' },
  'caso-de-uso': { singular: 'Erabilera-kasua', plural: 'Erabilera-kasuak' },
  matematico: { singular: 'Matematikaria', plural: 'Matematikariak' },
  metodo: { singular: 'Metodoa', plural: 'Metodoak' },
  modelo: { singular: 'Eredua', plural: 'Ereduak' },
  'plan-de-estudio': { singular: 'Ikasketa-plana', plural: 'Ikasketa-planak' },
  glosario: { singular: 'Glosarioa', plural: 'Glosarioa' },
  msc2020: { singular: 'MSC2020 sailkapena', plural: 'MSC2020 sailkapena' },
};

const CONTENT_TYPE_LABELS_EN: Record<string, { singular: string; plural: string }> = {
  axioma: { singular: 'Axiom', plural: 'Axioms' },
  'sistema-axiomatico': { singular: 'Axiomatic system', plural: 'Axiomatic systems' },
  concepto: { singular: 'Concept', plural: 'Concepts' },
  definicion: { singular: 'Definition', plural: 'Definitions' },
  lema: { singular: 'Lemma', plural: 'Lemmas' },
  teorema: { singular: 'Theorem', plural: 'Theorems' },
  corolario: { singular: 'Corollary', plural: 'Corollaries' },
  demostracion: { singular: 'Proof', plural: 'Proofs' },
  ejemplo: { singular: 'Example', plural: 'Examples' },
  ejercicio: { singular: 'Exercise', plural: 'Exercises' },
  'caso-de-uso': { singular: 'Use case', plural: 'Use cases' },
  matematico: { singular: 'Mathematician', plural: 'Mathematicians' },
  metodo: { singular: 'Method', plural: 'Methods' },
  modelo: { singular: 'Model', plural: 'Models' },
  'plan-de-estudio': { singular: 'Study plan', plural: 'Study plans' },
  glosario: { singular: 'Glossary', plural: 'Glossaries' },
  msc2020: { singular: 'MSC2020 classification', plural: 'MSC2020 classification' },
};

export const CONTENT_TYPE_LABELS_SINGULAR: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(CONTENT_TYPE_CONFIG).map(([id, cfg]) => [id, cfg.labelSingular]),
  ),
  ...Object.fromEntries(
    Object.entries(NON_CONTENT_CATEGORY_LABELS).map(([id, cfg]) => [id, cfg.singular]),
  ),
};

export const CONTENT_TYPE_LABELS_PLURAL: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(CONTENT_TYPE_CONFIG).map(([id, cfg]) => [id, cfg.labelPlural]),
  ),
  ...Object.fromEntries(
    Object.entries(NON_CONTENT_CATEGORY_LABELS).map(([id, cfg]) => [id, cfg.plural]),
  ),
};

export function getContentTypeLabel(rawKey?: string | null, form: 'singular' | 'plural' = 'singular', lang?: string): string {
  if (typeof rawKey !== 'string' || !rawKey.trim()) {
    if (lang === 'eu') return form === 'plural' ? 'Teoremak' : 'Teorema';
    if (lang === 'en') return form === 'plural' ? 'Theorems' : 'Theorem';
    return form === 'plural' ? 'Teoremas' : 'Teorema';
  }
  const cleanKey = rawKey.startsWith('diagram-') ? rawKey.slice('diagram-'.length) : rawKey;
  const normalized = cleanKey.toLowerCase().trim();
  const canonical = CONTENT_TYPE_ALIASES[normalized] ?? normalized;

  if (lang === 'eu') {
    const euEntry = CONTENT_TYPE_LABELS_EU[canonical] || CONTENT_TYPE_LABELS_EU[normalized] || NON_CONTENT_CATEGORY_LABELS_EU[canonical] || NON_CONTENT_CATEGORY_LABELS_EU[normalized];
    if (euEntry) return form === 'plural' ? euEntry.plural : euEntry.singular;
  }

  if (lang === 'en') {
    const enEntry = CONTENT_TYPE_LABELS_EN[canonical] || CONTENT_TYPE_LABELS_EN[normalized] || NON_CONTENT_CATEGORY_LABELS_EN[canonical] || NON_CONTENT_CATEGORY_LABELS_EN[normalized];
    if (enEntry) return form === 'plural' ? enEntry.plural : enEntry.singular;
  }

  const dict = form === 'plural' ? CONTENT_TYPE_LABELS_PLURAL : CONTENT_TYPE_LABELS_SINGULAR;

  if (dict[canonical]) return dict[canonical];
  if (dict[normalized]) return dict[normalized];
  return cleanKey.replace(/-/g, ' ').replace(/^\p{L}/u, v => v.toUpperCase());
}

export function getContentTypeRoutePrefix(rawKey?: string | null): string {
  if (typeof rawKey !== 'string' || !rawKey.trim()) return '';
  const cleanKey = rawKey.startsWith('diagram-') ? rawKey.slice('diagram-'.length) : rawKey;
  const normalized = cleanKey.toLowerCase().trim();
  const canonical = CONTENT_TYPE_ALIASES[normalized] ?? normalized;
  return CONTENT_TYPE_CONFIG[canonical]?.routePrefix ?? '';
}


export const typeLabels: Record<string, string> = CONTENT_TYPE_LABELS_SINGULAR;

