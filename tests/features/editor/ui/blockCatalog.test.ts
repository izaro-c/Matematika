import { describe, expect, it } from 'vitest';
import { blockCatalog, filterBlockCatalog, type BlockCatalogEntry } from '../../../../src/fixed-pages/editor/ui/panels/blockCatalog';
import { serializeRegisteredBlock } from '../../../../src/fixed-pages/editor/document';
import { parseInlineNodes } from '../../../../src/fixed-pages/editor/session/parser';
import { esLanguage as es } from '../../../../src/i18n/languages/es';
import { euLanguage as eu } from '../../../../src/i18n/languages/eu';
import { enLanguage as en } from '../../../../src/i18n/languages/en';

const label = (dictionary: typeof es) => (entry: BlockCatalogEntry) => {
  const key = entry.label.slice('palette.'.length) as keyof typeof dictionary.dictionary.editor.palette;
  return dictionary.dictionary.editor.palette[key];
};

describe('blockCatalog', () => {
  it('offers the profile blocks first, then every general block once', () => {
    const entries = blockCatalog('teorema');
    expect(entries[0].group).toBe('profile');
    expect(new Set(entries.map(entry => entry.id)).size).toBe(entries.length);
    for (const id of ['definition', 'statement', 'proof-step', 'exercise', 'diagram', 'visual-bind']) {
      expect(entries.some(entry => entry.id === id), id).toBe(true);
    }
    expect(blockCatalog('desconocido').every(entry => entry.group !== 'profile')).toBe(true);
  });

  it('has a label for every entry in the three languages', () => {
    const all = Object.keys({ definicion: 1, teorema: 1, demostracion: 1, ejemplo: 1, ejercicio: 1, 'caso-de-uso': 1, matematico: 1, modelo: 1 })
      .flatMap(type => blockCatalog(type));
    for (const dictionary of [es, eu, en]) {
      for (const entry of all) expect(label(dictionary)(entry), `${dictionary.code} ${entry.label}`).toBeTruthy();
    }
  });

  it('serializes every block entry to project MDX', () => {
    for (const entry of blockCatalog('ejercicio')) {
      if (entry.action.kind !== 'block') continue;
      const source = serializeRegisteredBlock(entry.action.type, { content: entry.action.content, metadata: entry.action.metadata });
      expect(source, entry.id).not.toContain('component=');
    }
    const step = blockCatalog('').find(entry => entry.id === 'step-section');
    if (step?.action.kind !== 'block') throw new Error('Missing StepSection entry');
    expect(serializeRegisteredBlock(step.action.type, step.action)).toBe('<StepSection step="step-1">\nTexto ligado al paso del diagrama.\n</StepSection>');
  });

  it('searches labels, syntax and keywords without accents, label prefixes first', () => {
    const entries = blockCatalog('');
    const spanish = label(es);
    expect(filterBlockCatalog(entries, 'formula', spanish)[0].id).toBe('formula');
    expect(filterBlockCatalog(entries, 'TEOREMA', spanish).map(entry => entry.id)).toContain('statement');
    expect(filterBlockCatalog(entries, 'visualbind', spanish).map(entry => entry.id)).toEqual(['visual-bind']);
    expect(filterBlockCatalog(entries, 'frogapena', label(eu)).map(entry => entry.id)).toContain('proof-step');
    expect(filterBlockCatalog(entries, 'zzz', spanish)).toEqual([]);
    expect(filterBlockCatalog(entries, '  ', spanish)).toBe(entries);
  });

  it('writes VisualBind markup that the prose surface reads back as a chip', () => {
    const entry = blockCatalog('').find(candidate => candidate.id === 'visual-bind');
    if (entry?.action.kind !== 'inline') throw new Error('Missing VisualBind entry');
    const markup = entry.action.markup('$A$');
    expect(parseInlineNodes(`Sea ${markup}.`)).toEqual([
      { type: 'text', value: 'Sea ' },
      { type: 'interactiveElement', tag: 'VisualBind', value: '$A$', attrs: { element: 'elemento', color: 'canela' }, raw: markup },
      { type: 'text', value: '.' },
    ]);
  });
});
