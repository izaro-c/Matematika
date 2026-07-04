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
    nodeStyle: { bg: c('axioma').hex, border: c('axioma').hex, text: '#ffffff', badge: 'AXIOMA', ringColor: c('axioma').ringHex },
    hierarchyLevel: 0,
  },
  concepto: {
    id: 'concepto',
    labelSingular: 'Concepto',
    labelPlural: 'Conceptos',
    routePrefix: 'definicion',
    graphGroup: 'definition',
    graphColor: c('concepto').cssVar,
    nodeStyle: { bg: c('concepto').hex, border: c('concepto').hex, text: '#ffffff', badge: 'CONCEPTO', ringColor: c('concepto').ringHex },
    hierarchyLevel: 0,
  },
  definicion: {
    id: 'definicion',
    labelSingular: 'Definición',
    labelPlural: 'Definiciones',
    routePrefix: 'definicion',
    graphGroup: 'definition',
    graphColor: c('definicion').cssVar,
    nodeStyle: { bg: c('definicion').hex, border: c('definicion').hex, text: '#ffffff', badge: 'DEFINICION', ringColor: c('definicion').ringHex },
    hierarchyLevel: 1,
  },
  lema: {
    id: 'lema',
    labelSingular: 'Lema',
    labelPlural: 'Lemas',
    routePrefix: 'teorema',
    graphGroup: 'lemma',
    graphColor: c('lema').cssVar,
    nodeStyle: { bg: c('lema').hex, border: c('lema').hex, text: '#ffffff', badge: 'LEMA', ringColor: c('lema').ringHex },
    hierarchyLevel: 2,
  },
  teorema: {
    id: 'teorema',
    labelSingular: 'Teorema',
    labelPlural: 'Teoremas',
    routePrefix: 'teorema',
    graphGroup: 'theorem',
    graphColor: c('teorema').cssVar,
    nodeStyle: { bg: c('teorema').hex, border: c('teorema').hex, text: '#ffffff', badge: 'TEOREMA', ringColor: c('teorema').ringHex },
    hierarchyLevel: 3,
  },
  corolario: {
    id: 'corolario',
    labelSingular: 'Corolario',
    labelPlural: 'Corolarios',
    routePrefix: 'teorema',
    graphGroup: 'corollary',
    graphColor: c('corolario').cssVar,
    nodeStyle: { bg: c('corolario').hex, border: c('corolario').hex, text: '#ffffff', badge: 'COROLARIO', ringColor: c('corolario').ringHex },
    hierarchyLevel: 4,
  },
  demostracion: {
    id: 'demostracion',
    labelSingular: 'Demostración',
    labelPlural: 'Demostraciones',
    routePrefix: 'demo',
    graphGroup: 'demostracion',
    graphColor: c('demostracion').cssVar,
    nodeStyle: { bg: c('demostracion').hex, border: c('demostracion').hex, text: '#ffffff', badge: 'DEMO', ringColor: c('demostracion').ringHex },
    hierarchyLevel: 5,
  },
  ejemplo: {
    id: 'ejemplo',
    labelSingular: 'Ejemplo',
    labelPlural: 'Ejemplos',
    routePrefix: 'ejemplo',
    graphGroup: 'example',
    graphColor: c('ejemplo').cssVar,
    nodeStyle: { bg: c('ejemplo').hex, border: c('ejemplo').hex, text: '#ffffff', badge: 'EJEMPLO', ringColor: c('ejemplo').ringHex },
    hierarchyLevel: 10,
  },
  ejercicio: {
    id: 'ejercicio',
    labelSingular: 'Ejercicio',
    labelPlural: 'Ejercicios',
    routePrefix: 'ejercicio',
    graphGroup: 'exercise',
    graphColor: c('ejercicio').cssVar,
    nodeStyle: { bg: c('ejercicio').hex, border: c('ejercicio').hex, text: '#ffffff', badge: 'EJERCICIO', ringColor: c('ejercicio').ringHex },
    hierarchyLevel: 10,
  },
  'caso-de-uso': {
    id: 'caso-de-uso',
    labelSingular: 'Caso de Uso',
    labelPlural: 'Casos de Uso',
    routePrefix: 'caso',
    graphGroup: 'usecase',
    graphColor: c('caso-de-uso').cssVar,
    nodeStyle: { bg: c('caso-de-uso').hex, border: c('caso-de-uso').hex, text: '#ffffff', badge: 'USO', ringColor: c('caso-de-uso').ringHex },
    hierarchyLevel: 10,
  },
  matematico: {
    id: 'matematico',
    labelSingular: 'Matemático',
    labelPlural: 'Matemáticos',
    routePrefix: 'bio',
    graphGroup: 'mathematician',
    graphColor: c('matematico').cssVar,
    nodeStyle: { bg: c('matematico').hex, border: c('matematico').hex, text: '#ffffff', badge: 'BIO', ringColor: c('matematico').ringHex },
    hierarchyLevel: 10,
  },
  leccion: {
    id: 'leccion',
    labelSingular: 'Lección',
    labelPlural: 'Lecciones',
    routePrefix: 'leccion',
    graphGroup: 'lesson',
    graphColor: c('leccion').cssVar,
    nodeStyle: { bg: c('leccion').hex, border: c('leccion').hex, text: '#ffffff', badge: 'LECCIÓN', ringColor: c('leccion').ringHex },
    hierarchyLevel: 10,
  },
  modelo: {
    id: 'modelo',
    labelSingular: 'Modelo',
    labelPlural: 'Modelos',
    routePrefix: 'modelo',
    graphGroup: 'modelo',
    graphColor: c('modelo').cssVar,
    nodeStyle: { bg: c('modelo').hex, border: c('modelo').hex, text: '#ffffff', badge: 'MODELO', ringColor: c('modelo').ringHex },
    hierarchyLevel: 10,
  },
  'plan-de-estudio': {
    id: 'plan-de-estudio',
    labelSingular: 'Plan de Estudio',
    labelPlural: 'Planes de Estudio',
    routePrefix: 'plan',
    graphGroup: 'plan-de-estudio',
    graphColor: c('plan-de-estudio').cssVar,
    nodeStyle: { bg: c('plan-de-estudio').hex, border: c('plan-de-estudio').hex, text: '#ffffff', badge: 'PLAN', ringColor: c('plan-de-estudio').ringHex },
    hierarchyLevel: 10,
  },
};

export const GRAPH_NODE_COLORS: Record<string, string> = {
  central: CONTENT_TYPE_COLORS.matematico.hex,
  branch:  CONTENT_TYPE_COLORS.teorema.hex,
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
