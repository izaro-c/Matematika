import { describe, expect, it } from 'vitest';
import type { Block } from '../../../../src/fixed-pages/editor/session/parser';
import { alignTranslationBlocks, hasTranslatableText } from '../../../../src/fixed-pages/editor/session/translationAlignment';

let next = 0;
const block = (type: Block['type'], content: string, metadata?: Record<string, unknown>): Block => ({ id: `b${next++}`, type, content, metadata });

describe('alineación por bloques para traducir', () => {
  it('empareja por forma y distingue traducido, sin traducir y sin texto', () => {
    const source = [block('heading', 'Ángulo', { level: 2 }), block('paragraph', 'Un ángulo es…'), block('formula', '$$a = b$$')];
    const target = [block('heading', 'Angelua', { level: 2 }), block('paragraph', 'Un ángulo es…'), block('formula', '$$a = b$$')];
    const result = alignTranslationBlocks(source, target);
    expect(result.rows.map(row => row.status)).toEqual(['translated', 'untranslated', 'neutral']);
    expect(result.untranslated).toBe(1);
    expect(result.missing).toBe(0);
  });

  it('un bloque añadido al original no desplaza al resto', () => {
    const source = [block('heading', 'A', { level: 2 }), block('note', 'Nuevo'), block('paragraph', 'Texto')];
    const target = [block('heading', 'A eu', { level: 2 }), block('paragraph', 'Testua'), block('list', '- extra')];
    const result = alignTranslationBlocks(source, target);
    expect(result.rows.map(row => row.status)).toEqual(['translated', 'missing', 'translated', 'extra']);
    expect(result.missing).toBe(1);
  });

  it('el nivel del título y el componente forman parte de la forma', () => {
    const source = [block('heading', 'A', { level: 2 })];
    const target = [block('heading', 'A', { level: 3 })];
    expect(alignTranslationBlocks(source, target).rows.map(row => row.status)).toEqual(['missing', 'extra']);
  });

  it('texto traducible: ignora fórmulas y sintaxis JSX, pero no los títulos', () => {
    expect(hasTranslatableText('$$\\angle AOB$$')).toBe(false);
    expect(hasTranslatableText('<Separador />')).toBe(false);
    expect(hasTranslatableText('<Definicion title="Ángulo">$x$</Definicion>')).toBe(true);
  });
});
