import { describe, it, expect, vi } from 'vitest';
import { StyleManager } from '@/shared/diagrams/core/MathUtils';

describe('StyleManager', () => {
  const dummyTheme = {
    primary: '#111',
    secondary: '#222',
    accent: '#333',
    background: '#fff',
    text: '#000',
    highlight: '#ff0',
  };

  it('isStep evaluates correctly for string and arrays', () => {
    const isStepFn = vi.fn((id: string) => id === 'step2');
    const manager = new StyleManager(isStepFn, () => false, false, dummyTheme);

    expect(manager.isStep('step1')).toBe(false);
    expect(manager.isStep('step2')).toBe(true);
    expect(manager.isStep(['step1', 'step3'])).toBe(false);
    expect(manager.isStep(['step1', 'step2'])).toBe(true);
    
    // Verify the mock was called correctly
    expect(isStepFn).toHaveBeenCalledWith('step1');
  });

  it('isHL evaluates correctly for string and arrays', () => {
    const isHLFn = vi.fn((id: string) => id === 'hl1');
    const manager = new StyleManager(() => false, isHLFn, false, dummyTheme);

    expect(manager.isHL('hl2')).toBe(false);
    expect(manager.isHL('hl1')).toBe(true);
    expect(manager.isHL(['hl2', 'hl3'])).toBe(false);
    expect(manager.isHL(['hl2', 'hl1'])).toBe(true);
  });

  describe('getOp (Opacity)', () => {
    it('returns 1 if hovered', () => {
      const manager = new StyleManager(() => false, () => false, false, dummyTheme);
      expect(manager.getOp(true, false)).toBe(1);
      expect(manager.getOp(true, true)).toBe(1);
    });

    it('returns base if anyHovered is true but this element is not hovered', () => {
      const manager = new StyleManager(() => false, () => false, true, dummyTheme);
      // hovered=false, activeInStep=true, anyHovered=true -> should fade out to base
      expect(manager.getOp(false, true, 0.2)).toBe(0.2);
    });

    it('returns 1 if active in step and nothing is hovered', () => {
      const manager = new StyleManager(() => false, () => false, false, dummyTheme);
      // hovered=false, activeInStep=true, anyHovered=false -> should be fully visible
      expect(manager.getOp(false, true, 0.2)).toBe(1);
    });

    it('returns base if not active and nothing is hovered', () => {
      const manager = new StyleManager(() => false, () => false, false, dummyTheme);
      expect(manager.getOp(false, false, 0.3)).toBe(0.3);
    });
  });

  describe('getOpAng (Angle Opacity)', () => {
    it('returns hoverVal if hovered', () => {
      const manager = new StyleManager(() => false, () => false, false, dummyTheme);
      expect(manager.getOpAng(true, false, 0.05, 0.5, 0.2)).toBe(0.5);
    });

    it('returns base if anyHovered but this is not hovered', () => {
      const manager = new StyleManager(() => false, () => false, true, dummyTheme);
      expect(manager.getOpAng(false, true, 0.05, 0.5, 0.2)).toBe(0.05);
    });

    it('returns activeVal if active in step and nothing is hovered', () => {
      const manager = new StyleManager(() => false, () => false, false, dummyTheme);
      expect(manager.getOpAng(false, true, 0.05, 0.5, 0.2)).toBe(0.2);
    });
  });

  describe('getW (Stroke Width)', () => {
    it('returns highlighted width if hovered', () => {
      const manager = new StyleManager(() => false, () => false, false, dummyTheme);
      expect(manager.getW(true, 2, 5)).toBe(5);
    });

    it('returns normal width if not hovered', () => {
      const manager = new StyleManager(() => false, () => false, false, dummyTheme);
      expect(manager.getW(false, 2, 5)).toBe(2);
    });
  });

  describe('getC (Color)', () => {
    it('returns highlight color if hovered', () => {
      const manager = new StyleManager(() => false, () => false, false, dummyTheme);
      expect(manager.getC(true, 'blue', 'red')).toBe('red');
    });

    it('returns normal color if not hovered', () => {
      const manager = new StyleManager(() => false, () => false, false, dummyTheme);
      expect(manager.getC(false, 'blue', 'red')).toBe('blue');
    });
  });
});
