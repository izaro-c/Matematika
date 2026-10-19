import { describe, expect, it } from 'vitest';
import type { FileNode } from '../../../../src/fixed-pages/editor/types/editorContracts';
import {
  buildConceptIndex,
  conceptVersions,
  documentVersionStatuses,
  translationOriginLang,
} from '../../../../src/fixed-pages/editor/session/conceptVersions';
import { documentOutline } from '../../../../src/fixed-pages/editor/save/catalogNode';
import { diagramVersionStatuses } from '../../../../src/fixed-pages/editor/diagrams/model/scene/translationStatus';
import type { VisualDiagramModel } from '../../../../src/fixed-pages/editor/diagrams/model/types';

const base = { capability: 'visual-exact', capabilityLabel: 'Editable', reason: '', kind: 'mdx-document' } as const;
const doc = (lang: string, id: string, type = 'definicion', outline?: string): FileNode => ({
  ...base, path: `content/mdx/${lang}/definitions/${id}.mdx`, name: `${id}.mdx`, type, lang, id, outline,
});

describe('versiones de idioma de un concepto', () => {
  const files = [
    doc('es', 'angulo', 'definicion', 'Definicion,h2'),
    doc('eu', 'angulo', 'definicion', 'Definicion,h2'),
    doc('en', 'angulo', 'definicion', 'Definicion'),
    doc('es', 'angulo', 'teorema'),
    doc('es', 'punto'),
  ];

  it('agrupa por id (y tipo) los documentos de content/mdx/{es,eu,en}', () => {
    expect(conceptVersions(files, 'angulo', 'definicion')).toEqual({
      es: 'content/mdx/es/definitions/angulo.mdx',
      eu: 'content/mdx/eu/definitions/angulo.mdx',
      en: 'content/mdx/en/definitions/angulo.mdx',
    });
    expect(conceptVersions(files, 'punto')).toEqual({ es: 'content/mdx/es/definitions/punto.mdx' });
    expect(buildConceptIndex(files).size).toBe(3);
  });

  it('estado: existe, falta o desfasada respecto al castellano', () => {
    const versions = buildConceptIndex(files).get('definicion:angulo')!;
    expect(documentVersionStatuses(versions, ['es', 'eu', 'en']).map(v => v.status)).toEqual(['present', 'present', 'outdated']);
    const punto = buildConceptIndex(files).get('definicion:punto')!;
    expect(documentVersionStatuses(punto, ['es', 'eu']).map(v => v.status)).toEqual(['present', 'missing']);
  });

  it('sin esquema no se marca nada como desfasado', () => {
    const versions = { es: doc('es', 'x'), eu: doc('eu', 'x', 'definicion', 'h2') };
    expect(documentVersionStatuses(versions, ['eu'])[0].status).toBe('present');
  });

  it('original para traducir: el castellano o, si falta, otra versión', () => {
    expect(translationOriginLang({ es: 'a', eu: 'b' }, 'eu')).toBe('es');
    expect(translationOriginLang({ es: 'a', eu: 'b' }, 'es')).toBe('eu');
    expect(translationOriginLang({ es: 'a' }, 'es')).toBeNull();
  });
});

describe('esquema de bloques del catálogo', () => {
  it('títulos y componentes de bloque, sin texto en línea ni código', () => {
    const source = [
      'export const metadata = { id: "x" };',
      "import { X } from './x';",
      '<Capitular letra="U" />n texto.',
      '## Título',
      'Prosa con <ConceptLink targetId="y">enlace</ConceptLink>.',
      '<ConceptLink targetId="z">Enlace</ConceptLink> al inicio de un párrafo.',
      '<Definicion title="T">',
      '  <PropiedadItem />',
      '</Definicion>',
      '```',
      '# comentario',
      '```',
    ].join('\n');
    expect(documentOutline(source)).toBe('h2,Definicion');
  });
});

describe('variantes de idioma de un diagrama', () => {
  it('el castellano existe siempre; otro idioma, si tiene algún texto', () => {
    const model = { translations: { eu: { title: 'Angelua' }, en: { labels: { a: '' } } } } as unknown as VisualDiagramModel;
    expect(diagramVersionStatuses(model, ['es', 'eu', 'en']).map(v => v.status)).toEqual(['present', 'present', 'missing']);
  });
});
