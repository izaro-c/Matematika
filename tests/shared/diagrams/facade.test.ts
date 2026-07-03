import { afterEach, describe, expect, it } from 'vitest';
import {
  DIAGRAM_THEME_TOKENS,
  getDiagramColor,
  isDiagramTargetActive,
} from '@/widgets/diagrams';

describe('diagram facade', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('exposes exactly the Arts & Crafts theme tokens', () => {
    expect(DIAGRAM_THEME_TOKENS).toEqual([
      'lienzo',
      'carbon',
      'salvia',
      'terracota',
      'pizarra',
      'ocre',
      'pavo',
      'granada',
      'musgo',
    ]);
  });

  it('reads a diagram color from its canonical CSS variable', () => {
    document.documentElement.style.setProperty(
      '--theme-terracota',
      'rgb(200, 100, 70)',
    );

    expect(getDiagramColor('terracota')).toBe('rgb(200, 100, 70)');
  });

  it('matches scalar and multi-target interaction state safely', () => {
    expect(isDiagramTargetActive('segmento-ab', 'segmento-ab')).toBe(true);
    expect(
      isDiagramTargetActive(['punto-a', 'segmento-ab'], 'segmento-ab'),
    ).toBe(true);
    expect(isDiagramTargetActive(null, 'segmento-ab')).toBe(false);
    expect(isDiagramTargetActive([1, 2], 'segmento-ab')).toBe(false);
  });
});
