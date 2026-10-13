import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ARTS_AND_CRAFTS_COLORS,
  EDITOR_THEME_COLOR_OPTIONS,
  buildInteractiveReference,
  normalizeContentId,
} from '@/fixed-pages/editor/types/editorContracts';

describe('editor identity and path contracts', () => {
  it('normalizes generated content IDs to kebab-case', () => {
    expect(normalizeContentId('  Teorema del Ángulo_Recto  ')).toBe('teorema-del-angulo-recto');
  });
});

describe('editor MDX generation contracts', () => {
  it('only offers palette colors and guards generated interactive references', () => {
    const palette = new Set<string>(ARTS_AND_CRAFTS_COLORS);

    expect(EDITOR_THEME_COLOR_OPTIONS.every(option => palette.has(option.value))).toBe(true);
    expect(EDITOR_THEME_COLOR_OPTIONS.some(option => option.value === 'dorado')).toBe(false);
    expect(buildInteractiveReference('lado-c', 'dorado', '$c$')).toBe(
      '<InteractiveElement target="lado-c" color="canela">$c$</InteractiveElement>',
    );
  });
});

describe('editor module purity', () => {
  it('keeps pure editor modules free from React, Monaco and fetch', () => {
    const source = fs.readFileSync(
      path.resolve(import.meta.dirname, '../../../src/fixed-pages/editor/types/editorContracts.ts'),
      'utf8',
    );
    expect(source).not.toMatch(/from\s+['"]react|@monaco-editor|\bfetch\s*\(/);
  });
});
