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

export const CONTENT_TYPE_CONFIG: Record<string, ContentTypeConfig> = {
  axioma: {
    id: 'axioma',
    labelSingular: 'Axioma',
    labelPlural: 'Axiomas',
    routePrefix: 'axioma',
    graphGroup: 'axioma',
    graphColor: '#f5c542',
    nodeStyle: { bg: '#1c1917', border: '#1c1917', text: '#f8f6f1', badge: 'AXIOMA', ringColor: '#f5c542' },
    hierarchyLevel: 0,
  },
  definicion: {
    id: 'definicion',
    labelSingular: 'Definición',
    labelPlural: 'Definiciones',
    routePrefix: 'definicion',
    graphGroup: 'definition',
    graphColor: '#c49b4f',
    nodeStyle: { bg: '#a47b2f', border: '#a47b2f', text: '#ffffff', badge: 'DEFINICION', ringColor: '#d2b48c' },
    hierarchyLevel: 1,
  },
  lema: {
    id: 'lema',
    labelSingular: 'Lema',
    labelPlural: 'Lemas',
    routePrefix: 'teorema',
    graphGroup: 'lemma',
    graphColor: '#A2C2A2',
    nodeStyle: { bg: '#4a6070', border: '#4a6070', text: '#ffffff', badge: 'LEMA', ringColor: '#a0c4d8' },
    hierarchyLevel: 2,
  },
  teorema: {
    id: 'teorema',
    labelSingular: 'Teorema',
    labelPlural: 'Teoremas',
    routePrefix: 'teorema',
    graphGroup: 'theorem',
    graphColor: '#A2C2A2',
    nodeStyle: { bg: '#6b9e6b', border: '#6b9e6b', text: '#ffffff', badge: 'TEOREMA', ringColor: '#a8d5a8' },
    hierarchyLevel: 3,
  },
  corolario: {
    id: 'corolario',
    labelSingular: 'Corolario',
    labelPlural: 'Corolarios',
    routePrefix: 'teorema',
    graphGroup: 'corollary',
    graphColor: '#A2C2A2',
    nodeStyle: { bg: '#b85c38', border: '#b85c38', text: '#ffffff', badge: 'COROLARIO', ringColor: '#f5a07a' },
    hierarchyLevel: 4,
  },
  demostracion: {
    id: 'demostracion',
    labelSingular: 'Demostración',
    labelPlural: 'Demostraciones',
    routePrefix: 'demo',
    graphGroup: 'demostracion',
    graphColor: '#C86446',
    nodeStyle: { bg: '#5a3a2a', border: '#5a3a2a', text: '#ffffff', badge: 'DEMO', ringColor: '#e8946a' },
    hierarchyLevel: 5,
  },
  ejemplo: {
    id: 'ejemplo',
    labelSingular: 'Ejemplo',
    labelPlural: 'Ejemplos',
    routePrefix: 'ejemplo',
    graphGroup: 'example',
    graphColor: '#5D7080',
    nodeStyle: { bg: '#5D7080', border: '#5D7080', text: '#ffffff', badge: 'EJEMPLO', ringColor: '#9FAABF' },
    hierarchyLevel: 10,
  },
  ejercicio: {
    id: 'ejercicio',
    labelSingular: 'Ejercicio',
    labelPlural: 'Ejercicios',
    routePrefix: 'ejercicio',
    graphGroup: 'exercise',
    graphColor: '#A2C2A2',
    nodeStyle: { bg: '#4a6a4a', border: '#4a6a4a', text: '#ffffff', badge: 'EJERCICIO', ringColor: '#8aba8a' },
    hierarchyLevel: 10,
  },
  caso_de_uso: {
    id: 'caso_de_uso',
    labelSingular: 'Caso de Uso',
    labelPlural: 'Casos de Uso',
    routePrefix: 'caso',
    graphGroup: 'usecase',
    graphColor: '#C86446',
    nodeStyle: { bg: '#C86446', border: '#C86446', text: '#ffffff', badge: 'USO', ringColor: '#f0a082' },
    hierarchyLevel: 10,
  },
  matematico: {
    id: 'matematico',
    labelSingular: 'Matemático',
    labelPlural: 'Matemáticos',
    routePrefix: 'bio',
    graphGroup: 'mathematician',
    graphColor: '#c49b4f',
    nodeStyle: { bg: '#8a7a4a', border: '#8a7a4a', text: '#ffffff', badge: 'BIO', ringColor: '#d4c07a' },
    hierarchyLevel: 10,
  },
  leccion: {
    id: 'leccion',
    labelSingular: 'Lección',
    labelPlural: 'Lecciones',
    routePrefix: 'leccion',
    graphGroup: 'lesson',
    graphColor: '#7A9CAE',
    nodeStyle: { bg: '#3b5e6b', border: '#3b5e6b', text: '#ffffff', badge: 'LECCIÓN', ringColor: '#7A9CAE' },
    hierarchyLevel: 10,
  },
  modelo: {
    id: 'modelo',
    labelSingular: 'Modelo',
    labelPlural: 'Modelos',
    routePrefix: 'modelo',
    graphGroup: 'modelo',
    graphColor: '#C86446',
    nodeStyle: { bg: '#a84426', border: '#a84426', text: '#ffffff', badge: 'MODELO', ringColor: '#f0a082' },
    hierarchyLevel: 10,
  },
  plan_de_estudio: {
    id: 'plan_de_estudio',
    labelSingular: 'Plan de Estudio',
    labelPlural: 'Planes de Estudio',
    routePrefix: 'plan',
    graphGroup: 'plan_de_estudio',
    graphColor: '#8B9DC4',
    nodeStyle: { bg: '#3a4a6a', border: '#3a4a6a', text: '#ffffff', badge: 'PLAN', ringColor: '#8B9DC4' },
    hierarchyLevel: 10,
  },
};

export const GRAPH_NODE_COLORS: Record<string, string> = {
  central: '#333333',
  branch: '#C86446',
  ...Object.fromEntries(
    Object.values(CONTENT_TYPE_CONFIG).map(cfg => [cfg.graphGroup, cfg.graphColor]),
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
