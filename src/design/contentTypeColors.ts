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
  const normalized = ENGLISH_TO_SPANISH[group] ?? group;
  return (
    CONTENT_TYPE_COLORS[normalized as ContentTypeKey]?.cssVar ??
    'var(--theme-carbon)'
  );
}

// ── Tabla de aliases inglés → español ────────────────────────────────────────

const ENGLISH_TO_SPANISH: Record<string, string> = {
  theorem:      'teorema',
  lemma:        'lema',
  corollary:    'corolario',
  proof:        'demostracion',
  demo:         'demostracion',
  axiom:        'axioma',
  definition:   'definicion',
  concept:      'concepto',
  model:        'modelo',
  method:       'metodo',
  example:      'ejemplo',
  exercise:     'ejercicio',
  mathematician:'matematico',
  glossary:     'glosario',
};
