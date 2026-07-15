export const DIFF_COLORS: Record<string, string> = {
  básico: 'var(--theme-musgo)',
  intermedio: 'var(--theme-ocre)',
  avanzado: 'var(--theme-granada)',
};

export const DOMAIN_ICONS: Record<string, string> = {
  ingeniería: '⚙',
  arquitectura: '🏛',
  medicina: '⚕',
  biología: '🌿',
  economía: '📈',
  finanzas: '💹',
  naturaleza: '🌊',
  arte: '🎨',
  música: '♩',
  astronomía: '✦',
  física: '⚛',
  geografía: '🗺',
  cartografía: '🗺',
  informática: '◻',
};

function mix(color: string, bg: string, pct: number): string {
  return `color-mix(in srgb, ${color}, ${bg} ${pct}%)`;
}

export const DOMAIN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  ingeniería: { bg: mix('var(--theme-ocre)', 'var(--theme-lienzo)', 85), text: 'var(--theme-ocre)', border: mix('var(--theme-ocre)', 'transparent', 50) },
  arquitectura: { bg: mix('var(--theme-pizarra)', 'var(--theme-lienzo)', 85), text: 'var(--theme-pizarra)', border: mix('var(--theme-pizarra)', 'transparent', 50) },
  medicina: { bg: mix('var(--theme-salvia)', 'var(--theme-lienzo)', 85), text: 'var(--theme-salvia)', border: mix('var(--theme-salvia)', 'transparent', 50) },
  biología: { bg: mix('var(--theme-musgo)', 'var(--theme-lienzo)', 85), text: 'var(--theme-musgo)', border: mix('var(--theme-musgo)', 'transparent', 50) },
  economía: { bg: mix('var(--theme-ocre)', 'var(--theme-lienzo)', 85), text: 'var(--theme-ocre)', border: mix('var(--theme-ocre)', 'transparent', 50) },
  finanzas: { bg: mix('var(--theme-ocre)', 'var(--theme-lienzo)', 85), text: 'var(--theme-ocre)', border: mix('var(--theme-ocre)', 'transparent', 50) },
  naturaleza: { bg: mix('var(--theme-salvia)', 'var(--theme-lienzo)', 85), text: 'var(--theme-salvia)', border: mix('var(--theme-salvia)', 'transparent', 50) },
  física: { bg: mix('var(--theme-pavo)', 'var(--theme-lienzo)', 85), text: 'var(--theme-pavo)', border: mix('var(--theme-pavo)', 'transparent', 50) },
  astronomía: { bg: mix('var(--theme-pizarra)', 'var(--theme-lienzo)', 85), text: 'var(--theme-pizarra)', border: mix('var(--theme-pizarra)', 'transparent', 50) },
  cartografía: { bg: mix('var(--theme-salvia)', 'var(--theme-lienzo)', 85), text: 'var(--theme-salvia)', border: mix('var(--theme-salvia)', 'transparent', 50) },
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

import { CONTENT_TYPE_COLORS } from '@/shared/design/contentTypeColors';

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
    labelSingular: 'Caso de Uso',
    labelPlural: 'Casos de Uso',
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
    labelSingular: 'Plan de Estudio',
    labelPlural: 'Planes de Estudio',
    routePrefix: 'plan',
    graphGroup: 'plan-de-estudio',
    graphColor: c('plan-de-estudio').cssVar,
    nodeStyle: { bg: c('plan-de-estudio').cssVar, border: c('plan-de-estudio').cssVar, text: 'var(--theme-lienzo)', badge: 'PLAN', ringColor: c('plan-de-estudio').cssVar },
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

export const typeLabels: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(CONTENT_TYPE_CONFIG).map(([id, cfg]) => [id, cfg.labelSingular]),
  ),
  theorem: 'Teorema',
  lemma: 'Lema',
  corollary: 'Corolario',
};
