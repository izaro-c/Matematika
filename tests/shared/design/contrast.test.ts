import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { THEME_PALETTE_HEX } from '@/shared/design/primitives';

const CANONICAL_NAMES = ['lienzo', 'carbon', 'salvia', 'terracota', 'pizarra', 'ocre', 'pavo', 'granada', 'musgo'] as const;

function cssPalette(selector: ':root' | '.dark'): Record<string, string> {
  const css = readFileSync(resolve(process.cwd(), 'src/app/theme.css'), 'utf8');
  const escapedSelector = selector === ':root' ? ':root' : '\\.dark';
  const block = css.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';
  return Object.fromEntries(CANONICAL_NAMES.map(name => {
    const value = block.match(new RegExp(`--theme-${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1] ?? '';
    return [name, value];
  }));
}

function luminance(hex: string): number {
  const channels = hex.slice(1).match(/../g)?.map(value => Number.parseInt(value, 16) / 255) ?? [];
  const [red = 0, green = 0, blue = 0] = channels.map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(left: string, right: string): number {
  const a = luminance(left);
  const b = luminance(right);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

describe('Arts & Crafts contrast contract', () => {
  it('keeps every canonical ink token at WCAG AA contrast on the light canvas', () => {
    const palette = cssPalette(':root');
    const background = palette.lienzo;
    for (const [name, token] of Object.entries(THEME_PALETTE_HEX)) {
      if (name === 'lienzo') continue;
      expect(token.hex).toBe(palette[name]);
      expect(contrast(background, palette[name]), `${name} lacks 4.5:1 contrast`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps every canonical ink token at WCAG AA contrast in the dark theme', () => {
    const palette = cssPalette('.dark');
    for (const name of CANONICAL_NAMES) {
      expect(palette[name], `${name} is missing from the dark palette`).toMatch(/^#[0-9A-Fa-f]{6}$/);
      if (name === 'lienzo') continue;
      expect(contrast(palette.lienzo, palette[name]), `${name} lacks 4.5:1 contrast in dark mode`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
