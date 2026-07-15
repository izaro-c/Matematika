import Fuse from 'fuse.js';
import { describe, expect, it } from 'vitest';
import { db } from '@/entities/content';
import { mscNames } from '@/entities/content/msc2020';
import {
  ALL_TYPES,
  TYPE_COLORS,
  TYPE_ICONS,
  TYPE_LABELS,
  TYPE_RESULT_LABELS,
  SEARCH_FUSE_OPTIONS,
  buildSearchIndex,
} from '@/features/search/lib/searchContracts';
import { dictionary } from '@/shared/lib/glossaryDictionary';
import { routePath } from '@/shared/lib/routeHelper';

const searchIndex = buildSearchIndex();

describe('search contracts', () => {
  it('defines an icon and color for every result type', () => {
    expect(new Set(Object.keys(TYPE_ICONS))).toEqual(new Set(ALL_TYPES));
    expect(new Set(Object.keys(TYPE_COLORS))).toEqual(new Set(ALL_TYPES));
    expect(new Set(Object.keys(TYPE_LABELS))).toEqual(new Set(ALL_TYPES));
    expect(new Set(Object.keys(TYPE_RESULT_LABELS))).toEqual(new Set(ALL_TYPES));
  });

  it('treats accented and unaccented queries as the same search', () => {
    const fuse = new Fuse(
      [{ id: 'pitagoras', type: 'teorema' as const, title: 'Pitágoras', href: '/pitagoras' }],
      { ...SEARCH_FUSE_OPTIONS, includeScore: true },
    );

    const [result] = fuse.search('pitagoras');

    expect(SEARCH_FUSE_OPTIONS.ignoreDiacritics).toBe(true);
    expect(result?.item.title).toBe('Pitágoras');
    expect(result?.score).toBeLessThan(0.000001);
  });

  it('includes real theorem and definition content with routePath hrefs', () => {
    const theorem = db.theorems.values().next().value;
    const definition = db.definitions.values().next().value;

    expect(theorem).toBeDefined();
    expect(definition).toBeDefined();
    if (!theorem || !definition) {
      throw new Error('Expected theorem and definition content in the current index');
    }

    expect(searchIndex).toContainEqual({
      id: `thm-${theorem.id}`,
      type: 'teorema',
      title: theorem.title,
      subtitle: theorem.description,
      href: routePath(`/teorema/${theorem.slug}`),
    });
    expect(searchIndex).toContainEqual({
      id: `def-${definition.id}`,
      type: 'definición',
      title: definition.title,
      subtitle: definition.description,
      href: routePath(`/definicion/${definition.slug}`),
    });
  });

  it('preserves glossary term ids as hrefs', () => {
    const glossaryEntry = Object.entries(dictionary)[0];

    expect(glossaryEntry).toBeDefined();
    if (!glossaryEntry) {
      throw new Error('Expected at least one glossary entry');
    }
    const [termId, term] = glossaryEntry;

    expect(searchIndex).toContainEqual({
      id: `glossary-${termId}`,
      type: 'glosario',
      title: term.title,
      subtitle: term.definition.slice(0, 120),
      href: termId,
    });
  });

  it('links MSC2020 entries to their branch pages', () => {
    const mscEntry = Object.entries(mscNames)[0];

    expect(mscEntry).toBeDefined();
    if (!mscEntry) {
      throw new Error('Expected at least one MSC2020 entry');
    }
    const [code, name] = mscEntry;

    expect(searchIndex).toContainEqual({
      id: `msc-${code}`,
      type: 'msc2020',
      title: `${code} — ${name}`,
      subtitle: 'Clasificación MSC2020',
      href: routePath(`/rama/${code}`),
    });
  });

  it('keeps the minimum result fields stable', () => {
    expect(searchIndex.length).toBeGreaterThan(0);

    for (const result of searchIndex) {
      expect(typeof result.id).toBe('string');
      expect(typeof result.title).toBe('string');
      expect(typeof result.type).toBe('string');
      expect(typeof result.href).toBe('string');
      expect(ALL_TYPES).toContain(result.type);
      expect(result.subtitle === undefined || typeof result.subtitle === 'string').toBe(true);
    }
  });
});
