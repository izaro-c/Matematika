import type { ThemeColors } from '@/features/graph/ui/MathBoard';

// ─── Paleta Arts & Crafts ───────────────────────────────────────────────────

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

/** Lee una variable CSS --theme-<token> del documento. Seguro en SSR. */
export function getDiagramColor(token: DiagramThemeToken): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--theme-${token}`)
    .trim();
}

/** Lee cualquier variable CSS por nombre completo (ej. '--theme-carbon'). */
export function getCSSVar(name: string): string {
  if (typeof document === 'undefined') return '#000';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#000';
}

// ─── Highlight helpers ───────────────────────────────────────────────────────

export type DiagramTargetState = string | readonly string[] | null | undefined;
export type DiagramTargetMatcher = (targetId: string) => boolean;

/** Comprueba si un target está activo dado el valor del highlight del MathStore. */
export function isDiagramTargetActive(
  value: unknown,
  targetId: string,
): boolean {
  if (typeof value === 'string') return value === targetId;
  if (!Array.isArray(value)) return false;
  return (value as readonly unknown[]).includes(targetId);
}

// ─── JXG Type Aliases ────────────────────────────────────────────────────────

import type JXG from 'jsxgraph';
export type DiagramBoard = JXG.Board;
export type DiagramElement = JXG.GeometryElement;
export type DiagramElementRegistry = Record<string, unknown>;

export class StyleManager {
  private isStepFn: (id: string) => boolean;
  private isHLFn: (id: string) => boolean;
  public anyHovered: boolean;
  public theme: ThemeColors;

  constructor(
    isStepFn: (id: string) => boolean,
    isHLFn: (id: string) => boolean,
    anyHovered: boolean,
    theme: ThemeColors
  ) {
    this.isStepFn = isStepFn;
    this.isHLFn = isHLFn;
    this.anyHovered = anyHovered;
    this.theme = theme;
  }

  isStep(ids: string[] | string): boolean {
    if (typeof ids === 'string') return this.isStepFn(ids);
    return ids.some(this.isStepFn);
  }

  isHL(ids: string[] | string): boolean {
    if (typeof ids === 'string') return this.isHLFn(ids);
    return ids.some(this.isHLFn);
  }

  getOp(hovered: boolean, activeInStep: boolean, base = 0.2): number {
    if (hovered) return 1;
    if (this.anyHovered) return base;
    return activeInStep ? 1 : base;
  }

  getOpAng(hovered: boolean, activeInStep: boolean, base = 0.05, hoverVal = 0.4, activeVal = 0.2): number {
    if (hovered) return hoverVal;
    if (this.anyHovered) return base;
    return activeInStep ? activeVal : base;
  }

  getW(hovered: boolean, normal = 2, highlighted = 4): number {
    return hovered ? highlighted : normal;
  }

  getC(hovered: boolean, normalColor: string, highlightColor: string): string {
    return hovered ? highlightColor : normalColor;
  }
}
