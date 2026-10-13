import { THEME_COLOR_VARS, type ThemeColorName } from '@/design';

/** Lista derivada de THEME_COLOR_VARS en primitives.ts. */
export const ARTS_AND_CRAFTS_COLORS = Object.keys(THEME_COLOR_VARS) as readonly ThemeColorName[];

export type ArtsAndCraftsColor = ThemeColorName;

export const EDITOR_THEME_COLOR_OPTIONS = [
  { value: 'terracota', label: 'Terracota (Teoremas, Default)' },
  { value: 'canela', label: 'canela (Lógica, Análisis)' },
  { value: 'ocre', label: 'Ocre (Corolarios, Especial)' },
  { value: 'carbon', label: 'Carbón (Definiciones)' },
  { value: 'mora', label: 'mora (Auxiliar)' },
] as const satisfies ReadonlyArray<{ value: ArtsAndCraftsColor; label: string }>;

export interface FileNode {
  path: string;
  name: string;
  title?: string;
  type: string;
  kind: 'mdx-document' | 'diagram';
  capability: 'visual-exact' | 'code-preview' | 'invalid';
  capabilityLabel: string;
  reason: string;
  lang?: string;
  id?: string;
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

export function normalizeContentId(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '');
}

export function isArtsAndCraftsColor(value: string): value is ArtsAndCraftsColor {
  return ARTS_AND_CRAFTS_COLORS.some(color => color === value);
}

export function normalizeEditorColor(
  value: string,
  fallback: ArtsAndCraftsColor,
): ArtsAndCraftsColor {
  return isArtsAndCraftsColor(value) ? value : fallback;
}

export function buildInteractiveReference(target: string, color: string, text: string): string {
  const safeColor = normalizeEditorColor(color, 'canela');
  return `<InteractiveElement target="${escapeAttribute(target)}" color="${safeColor}">${text}</InteractiveElement>`;
}
