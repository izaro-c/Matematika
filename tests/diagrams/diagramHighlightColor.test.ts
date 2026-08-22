import { describe, expect, it } from 'vitest';
import {
  preservesOwnColorOnHighlight,
  withNativeHighlightDisabledBorders,
} from '@/diagrams/render/interaction/diagramHover';

describe('preserve color on highlight', () => {
  it('trata undefined como conservar color (default del editor)', () => {
    expect(preservesOwnColorOnHighlight(undefined)).toBe(true);
    expect(preservesOwnColorOnHighlight({})).toBe(true);
    expect(preservesOwnColorOnHighlight({ preserveColorOnHighlight: true })).toBe(true);
    expect(preservesOwnColorOnHighlight({ preserveColorOnHighlight: false })).toBe(false);
  });

  it('propaga highlight:false a borders para evitar el azul nativo de JSXGraph', () => {
    expect(withNativeHighlightDisabledBorders({
      strokeColor: 'carbon',
      borders: { strokeColor: 'canela', strokeWidth: 1.5, fixed: true },
    })).toEqual({
      strokeColor: 'carbon',
      highlight: false,
      borders: { strokeColor: 'canela', strokeWidth: 1.5, fixed: true, highlight: false },
    });
  });
});
