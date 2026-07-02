export const DIAGRAM_THEME_TOKENS = [
  'lienzo',
  'carbon',
  'salvia',
  'terracota',
  'pizarra',
  'ocre',
  'pavo',
  'granada',
  'musgo',
] as const;

export type DiagramThemeToken = (typeof DIAGRAM_THEME_TOKENS)[number];

export function getDiagramColor(token: DiagramThemeToken): string {
  if (typeof document === 'undefined') return '';

  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--theme-${token}`)
    .trim();
}
