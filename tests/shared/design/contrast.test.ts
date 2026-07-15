import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CONTENT_TYPE_CONFIG, GRAPH_NODE_COLORS } from '@/shared/lib/constants';

const CANONICAL_NAMES = ['lienzo', 'carbon', 'salvia', 'terracota', 'pizarra', 'ocre', 'pavo', 'granada', 'musgo'] as const;
const ACCENT_NAMES = CANONICAL_NAMES.filter(name => name !== 'lienzo' && name !== 'carbon');

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

function oklab(hex: string): [number, number, number] {
  const [red = 0, green = 0, blue = 0] = hex.slice(1).match(/../g)
    ?.map(value => Number.parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4) ?? [];
  const long = Math.cbrt(0.4122214708 * red + 0.5363325363 * green + 0.0514459929 * blue);
  const medium = Math.cbrt(0.2119034982 * red + 0.6806995451 * green + 0.1073969566 * blue);
  const short = Math.cbrt(0.0883024619 * red + 0.2817188376 * green + 0.6299787005 * blue);
  return [
    0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short,
    1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short,
    0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short,
  ];
}

function perceptualDistance(left: string, right: string): number {
  const a = oklab(left);
  const b = oklab(right);
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

describe('Arts & Crafts contrast contract', () => {
  it('keeps every canonical ink token at WCAG AA contrast on the light canvas', () => {
    const palette = cssPalette(':root');
    const background = palette.lienzo;
    for (const name of CANONICAL_NAMES) {
      if (name === 'lienzo') continue;
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

  it.each([':root', '.dark'] as const)('keeps accent pigments perceptually distinct in %s', selector => {
    const palette = cssPalette(selector);
    for (const [index, name] of ACCENT_NAMES.entries()) {
      for (const other of ACCENT_NAMES.slice(index + 1)) {
        expect(
          perceptualDistance(palette[name], palette[other]),
          `${name} and ${other} are too similar in ${selector}`,
        ).toBeGreaterThanOrEqual(0.075);
      }
    }
  });
});

describe('graph theme color contract', () => {
  it('binds every node style to theme.css variables', () => {
    for (const config of Object.values(CONTENT_TYPE_CONFIG)) {
      expect(config.graphColor).toMatch(/^var\(--theme-/);
      expect(config.nodeStyle.bg).toBe(config.graphColor);
      expect(config.nodeStyle.border).toBe(config.graphColor);
      expect(config.nodeStyle.ringColor).toBe(config.graphColor);
    }

    for (const color of Object.values(GRAPH_NODE_COLORS)) {
      expect(color).toMatch(/^var\(--theme-/);
    }
  });
});
