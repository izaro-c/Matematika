import { describe, expect, it } from 'vitest';
import type { ThemeColors } from '@/diagrams/core/theme';

const PALETTE_KEYS = [
  'carbon', 'terracota', 'salvia', 'lienzo', 'pizarra', 'ocre', 'pavo', 'granada', 'musgo',
] as const;

describe('ThemeColors contract', () => {
  it('exige exactamente los nueve tokens Arts & Crafts', () => {
    const sample: ThemeColors = Object.fromEntries(
      PALETTE_KEYS.map(key => [key, `#${key}`]),
    ) as ThemeColors;
    expect(Object.keys(sample).sort()).toEqual([...PALETTE_KEYS].sort());
  });
});
