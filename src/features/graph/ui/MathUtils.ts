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

// ─── Utilidades Geométricas Avanzadas para JSXGraph ──────────────────────────

/**
 * Proyecta y crea dinámicamente los dos puntos externos para construir un cuadrado
 * perpendicular al segmento p1-p2, orientado hacia fuera del punto opp.
 * Retorna los cuatro vértices del cuadrado [p1, p2, p3, p4] en sentido cíclico.
 */
export function projectSquareVertices(board: any, p1: any, p2: any, opp: any): [any, any, any, any] {
  const len = () => p1.Dist(p2);
  const dx = () => p2.X() - p1.X();
  const dy = () => p2.Y() - p1.Y();
  const ndx = () => -dy() / Math.max(len(), 0.001);
  const ndy = () => dx() / Math.max(len(), 0.001);
  const mx = () => (p1.X() + p2.X()) / 2;
  const my = () => (p1.Y() + p2.Y()) / 2;
  const sign = () => ((opp.X() - mx()) * ndx() + (opp.Y() - my()) * ndy() > 0 ? -1 : 1);

  const p3 = board.create('point', [
    () => p2.X() + ndx() * len() * sign(),
    () => p2.Y() + ndy() * len() * sign()
  ], { visible: false });

  const p4 = board.create('point', [
    () => p1.X() + ndx() * len() * sign(),
    () => p1.Y() + ndy() * len() * sign()
  ], { visible: false });

  return [p1, p2, p3, p4];
}

/**
 * Crea una cuadrícula interna unitaria de tamaño NxN apoyada sobre los cuatro
 * vértices de un cuadrado proyectado. Retorna los segmentos resultantes.
 */
export function createSquareGrid(board: any, pts: [any, any, any, any], N: number, theme: ThemeColors): any[] {
  const p1 = pts[0];
  const p2 = pts[1];
  const p3 = pts[2];
  const p4 = pts[3];
  const segments: any[] = [];

  for (let i = 1; i < N; i++) {
    const t = i / N;

    const ptStart1 = board.create('point', [
      () => p1.X() + t * (p2.X() - p1.X()),
      () => p1.Y() + t * (p2.Y() - p1.Y())
    ], { visible: false });
    const ptEnd1 = board.create('point', [
      () => p4.X() + t * (p3.X() - p4.X()),
      () => p4.Y() + t * (p3.Y() - p4.Y())
    ], { visible: false });
    segments.push(board.create('segment', [ptStart1, ptEnd1], {
      strokeColor: theme.carbon, strokeWidth: 0.5, strokeOpacity: 0.2, fixed: true
    }));

    const ptStart2 = board.create('point', [
      () => p1.X() + t * (p4.X() - p1.X()),
      () => p1.Y() + t * (p4.Y() - p1.Y())
    ], { visible: false });
    const ptEnd2 = board.create('point', [
      () => p2.X() + t * (p3.X() - p2.X()),
      () => p2.Y() + t * (p3.Y() - p2.Y())
    ], { visible: false });
    segments.push(board.create('segment', [ptStart2, ptEnd2], {
      strokeColor: theme.carbon, strokeWidth: 0.5, strokeOpacity: 0.2, fixed: true
    }));
  }
  return segments;
}

/**
 * Crea un ángulo recto robusto como un polígono dinámico de 4 vértices que siempre
 * se dibuja como un cuadrado perfecto orientado hacia el interior de los catetos,
 * evitando las distorsiones de 270 grados en las marcas nativas al cambiar de cuadrante.
 */
export function createRobustRightAngle(
  board: any,
  vertex: any,
  pBase: any,
  pAlt: any,
  size: number,
  options: any = {},
  theme: ThemeColors
) {
  const baseDir = () => {
    const dx = pBase.X() - vertex.X();
    const len = Math.abs(dx);
    return len < 1e-6 ? { x: 1, y: 0 } : { x: dx / len, y: 0 };
  };
  const altDir = () => {
    const dy = pAlt.Y() - vertex.Y();
    const len = Math.abs(dy);
    return len < 1e-6 ? { x: 0, y: 1 } : { x: 0, y: dy / len };
  };

  const sq0 = vertex;
  const sq1 = board.create('point', [
    () => { const d = baseDir(); return vertex.X() + d.x * size; },
    () => { const d = baseDir(); return vertex.Y() + d.y * size; }
  ], { visible: false });
  const sq2 = board.create('point', [
    () => { const d = baseDir(); const a = altDir(); return vertex.X() + d.x * size + a.x * size; },
    () => { const d = baseDir(); const a = altDir(); return vertex.Y() + d.y * size + a.y * size; }
  ], { visible: false });
  const sq3 = board.create('point', [
    () => { const a = altDir(); return vertex.X() + a.x * size; },
    () => { const a = altDir(); return vertex.Y() + a.y * size; }
  ], { visible: false });

  const defaultOpts = {
    fillColor: theme.carbon,
    fillOpacity: 0.05,
    borders: { strokeColor: theme.carbon, strokeWidth: 1, strokeOpacity: 0.15 }
  };

  const finalOpts = { ...defaultOpts, ...options };
  return board.create('polygon', [sq0, sq1, sq2, sq3], finalOpts);
}
