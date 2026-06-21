import type { ThemeColors } from '@/boundary/components/graph/MathBoard';

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
