/**
 * contentTypeColors — módulo puente entre el sistema de diseño y los grafos.
 *
 * Para cada tipo de contenido editorial expone la variable `--theme-*`
 * canónica para componentes React, SVG y React Flow. Canvas resuelve esa
 * misma variable en runtime mediante useThemeColors().
 *
 * Cambiar un rol en semanticTokens.ts propaga automáticamente aquí,
 * y desde aquí a constants.ts y todos los grafos.
 */

import { SEMANTIC_COLOR_ROLES } from './semanticTokens';
import type { ContentPageAccentType } from './pageAccents';

// Tipos de contenido que aparecen en grafos (superset de ContentPageAccentType)
export type ContentTypeKey =
  | ContentPageAccentType
  | 'glosario'
  | 'msc2020';

// ── Mapeo tipo → rol semántico ───────────────────────────────────────────────
// Editar aquí para cambiar el color de UN tipo concreto
// (o editar semanticTokens.ts para cambiar el color de un ROL completo)

const CONTENT_TYPE_ROLE_MAP = {
  // Tipos axiomáticos
  axioma:              'axiomAccent',
  teorema:             'theoremAccent',
  lema:                'lemmaAccent',
  corolario:           'corollaryAccent',
  demostracion:        'proofAccent',
  modelo:              'modelAccent',
  // Tipos referenciales
  definicion:          'definitionAccent',
  concepto:            'conceptAccent',
  'sistema-axiomatico':'neutralStrong',
  // Tipos pedagógicos
  metodo:              'methodAccent',
  ejemplo:             'exampleAccent',
  ejercicio:           'exerciseAccent',
  'caso-de-uso':       'exampleAccent',
  'plan-de-estudio':   'secondaryAccent',
  // Biográfico / clasificatorio
  matematico:          'biographyAccent',
  glosario:            'conceptAccent',
  msc2020:             'conceptAccent',
} as const satisfies Record<ContentTypeKey, keyof typeof SEMANTIC_COLOR_ROLES>;

export type ContentTypeRoleMap = typeof CONTENT_TYPE_ROLE_MAP;

// ── Tabla derivada — fuente de verdad para todos los consumidores ────────────

export const CONTENT_TYPE_COLORS = Object.fromEntries(
  Object.entries(CONTENT_TYPE_ROLE_MAP).map(([type, role]) => [
    type,
    {
      cssVar: SEMANTIC_COLOR_ROLES[role as keyof typeof SEMANTIC_COLOR_ROLES],
    },
  ]),
) as Record<ContentTypeKey, { cssVar: string }>;

export function getTypeCssVar(group: string): string {
  const cleanGroup = group.startsWith('diagram-') ? group.slice('diagram-'.length) : group;
  const normalized = ENGLISH_TO_SPANISH[cleanGroup] ?? ENGLISH_TO_SPANISH[group] ?? cleanGroup;
  return (
    CONTENT_TYPE_COLORS[normalized as ContentTypeKey]?.cssVar ??
    DIAGRAM_CATEGORY_COLORS[cleanGroup] ??
    'var(--theme-salvia)'
  );
}

// Colores para categorías de diagramas no editoriales
const DIAGRAM_CATEGORY_COLORS: Record<string, string> = {
  geometria: 'var(--theme-salvia)',
  geometry: 'var(--theme-salvia)',
  algebra: 'var(--theme-terracota)',
  calculo: 'var(--theme-musgo)',
  calculus: 'var(--theme-musgo)',
  logica: 'var(--theme-pavo)',
  logic: 'var(--theme-pavo)',
  general: 'var(--theme-pavo)',
  modelos: 'var(--theme-pavo)',
  triangulos: 'var(--theme-terracota)',
};

// ── Tabla de aliases inglés/plurales → clave canónica en español ─────────────

export const CONTENT_TYPE_ALIASES: Record<string, string> = {
  theorem: 'teorema',
  theorems: 'teorema',
  teoremas: 'teorema',
  teorema: 'teorema',
  lemma: 'lema',
  lemmas: 'lema',
  lemas: 'lema',
  lema: 'lema',
  corollary: 'corolario',
  corollaries: 'corolario',
  corolarios: 'corolario',
  corolario: 'corolario',
  proof: 'demostracion',
  proofs: 'demostracion',
  demo: 'demostracion',
  demos: 'demostracion',
  demonstration: 'demostracion',
  demonstrations: 'demostracion',
  demostraciones: 'demostracion',
  demostracion: 'demostracion',
  axiom: 'axioma',
  axioms: 'axioma',
  axiomas: 'axioma',
  axioma: 'axioma',
  definition: 'definicion',
  definitions: 'definicion',
  definiciones: 'definicion',
  definicion: 'definicion',
  concept: 'concepto',
  concepts: 'concepto',
  conceptos: 'concepto',
  concepto: 'concepto',
  model: 'modelo',
  models: 'modelo',
  modelos: 'modelo',
  modelo: 'modelo',
  method: 'metodo',
  methods: 'metodo',
  metodos: 'metodo',
  metodo: 'metodo',
  example: 'ejemplo',
  examples: 'ejemplo',
  ejemplos: 'ejemplo',
  ejemplo: 'ejemplo',
  exercise: 'ejercicio',
  exercises: 'ejercicio',
  ejercicios: 'ejercicio',
  ejercicio: 'ejercicio',
  mathematician: 'matematico',
  mathematicians: 'matematico',
  matematicos: 'matematico',
  matematico: 'matematico',
  glossary: 'glosario',
  glosario: 'glosario',
  usecases: 'caso-de-uso',
  'use-cases': 'caso-de-uso',
  'casos-de-uso': 'caso-de-uso',
  casosuso: 'caso-de-uso',
  'caso-de-uso': 'caso-de-uso',
  'axiomatic-systems': 'sistema-axiomatico',
  'sistemas-axiomaticos': 'sistema-axiomatico',
  'sistema-axiomatico': 'sistema-axiomatico',
  plans: 'plan-de-estudio',
  planes: 'plan-de-estudio',
  'planes-de-estudio': 'plan-de-estudio',
  'plan-de-estudio': 'plan-de-estudio',
  msc2020: 'msc2020',
};

export const ENGLISH_TO_SPANISH = CONTENT_TYPE_ALIASES;


