import { describe, expect, it } from 'vitest';
import type { FileNode } from '../../../../src/fixed-pages/editor/types/editorContracts';
import {
  editorDocumentKey,
  editorStateFromUrl,
  editorUrlFromState,
  fileNodeFromPath,
  sanitizeReturnPath,
} from '../../../../src/fixed-pages/editor/session/editorNavigationModel';

const base = { capability: 'visual-exact', capabilityLabel: 'Editable', reason: '' } as const;
const anguloEs: FileNode = { ...base, path: 'content/mdx/es/definitions/angulo.mdx', name: 'angulo.mdx', type: 'definitions', kind: 'mdx-document', lang: 'es', id: 'angulo' };
const anguloEu: FileNode = { ...base, path: 'content/mdx/eu/definitions/angulo.mdx', name: 'angulo.mdx', type: 'definitions', kind: 'mdx-document', lang: 'eu', id: 'angulo' };
const tales: FileNode = { ...base, path: 'content/diagrams/Teoremas/Tales.tsx', name: 'Tales.tsx', type: 'diagram-teoremas', kind: 'diagram', id: 'Tales' };
const files = [anguloEs, anguloEu, tales];

const parse = (url: string) => {
  const [pathname, search = ''] = url.split('?');
  return editorStateFromUrl({ pathname, search }, files);
};

describe('URL del editor', () => {
  it('portada con sección', () => {
    expect(editorUrlFromState({ uiLang: 'es' })).toBe('/es/editor');
    expect(editorUrlFromState({ uiLang: 'eu', section: 'diagrams' })).toBe('/eu/editor?seccion=diagramas');
    expect(parse('/es/editor')).toEqual({ status: 'landing', section: 'documents' });
    expect(parse('/es/editor?seccion=diagramas')).toEqual({ status: 'landing', section: 'diagrams' });
    expect(parse('/es/editor?tab=diagrams')).toEqual({ status: 'landing', section: 'diagrams' });
  });

  it('documento MDX: idioma de interfaz y de documento son independientes', () => {
    const url = editorUrlFromState({ uiLang: 'es', file: anguloEu, viewMode: 'code', blockId: 'block-3' });
    expect(url).toBe('/es/editor/eu/definitions/angulo?vista=codigo&bloque=block-3');
    expect(parse(url)).toEqual({
      status: 'file', path: anguloEu.path, viewMode: 'code', blockId: 'block-3',
      diagramSurface: false, step: null, returnTo: null,
    });
    // Cambiar `:lang` no cambia el documento abierto.
    expect(parse('/en/editor/eu/definitions/angulo')).toMatchObject({ path: anguloEu.path });
  });

  it('ida y vuelta conserva vista, bloque, superficie de diagrama y paso', () => {
    const url = editorUrlFromState({ uiLang: 'es', file: anguloEs, viewMode: 'preview', blockId: 'block-1', diagramSurface: true, step: '2' });
    expect(url).toBe('/es/editor/es/definitions/angulo?vista=previa&bloque=block-1&editar=diagrama&paso=2');
    expect(parse(url)).toMatchObject({ viewMode: 'preview', blockId: 'block-1', diagramSurface: true, step: '2' });
  });

  it('diagrama por id con ruta de vuelta', () => {
    const url = editorUrlFromState({ uiLang: 'es', file: tales, step: '3', returnTo: '/es/editor/es/definitions/angulo?vista=codigo' });
    expect(url).toBe('/es/editor/diagrama/Tales?paso=3&volver=%2Fes%2Feditor%2Fes%2Fdefinitions%2Fangulo%3Fvista%3Dcodigo');
    expect(parse(url)).toMatchObject({
      status: 'file', path: tales.path, step: '3', diagramSurface: false,
      returnTo: '/es/editor/es/definitions/angulo?vista=codigo',
    });
    expect(parse('/es/editor/diagrama/tales')).toMatchObject({ path: tales.path });
  });

  it('rutas inexistentes o mal formadas → no encontrado', () => {
    expect(parse('/es/editor/en/definitions/angulo')).toEqual({ status: 'not-found', requested: 'en/definitions/angulo' });
    expect(parse('/es/editor/diagrama/NoExiste')).toMatchObject({ status: 'not-found' });
    expect(parse('/es/editor/algo')).toMatchObject({ status: 'not-found' });
    expect(parse('/es/editor/es/definitions/angulo?vista=rara')).toMatchObject({ viewMode: 'visual' });
  });

  it('solo acepta rutas de vuelta internas', () => {
    expect(sanitizeReturnPath('/es/editor')).toBe('/es/editor');
    expect(sanitizeReturnPath('//evil.example')).toBeNull();
    expect(sanitizeReturnPath('https://evil.example')).toBeNull();
    expect(parse('/es/editor/diagrama/Tales?volver=//evil.example')).toMatchObject({ returnTo: null });
  });

  it('la clave de documento ignora vista, bloque y paso pero no la superficie', () => {
    const key = (url: string) => {
      const [pathname, search = ''] = url.split('?');
      return editorDocumentKey({ pathname, search });
    };
    expect(key('/es/editor/es/definitions/angulo?vista=codigo&bloque=b')).toBe(key('/eu/editor/es/definitions/angulo'));
    expect(key('/es/editor/es/definitions/angulo?editar=diagrama')).not.toBe(key('/es/editor/es/definitions/angulo'));
    expect(key('/es/editor/es/definitions/angulo')).not.toBe(key('/es/editor/eu/definitions/angulo'));
    expect(key('/base/es/editor/x/y/z')).toBe(key('/es/editor/x/y/z'));
    expect(key('/es/teorema/tales')).toBe('outside:/es/teorema/tales');
  });

  it('deduce la identidad de un recurso recién creado a partir de su ruta', () => {
    expect(editorUrlFromState({ uiLang: 'es', file: fileNodeFromPath('content/mdx/eu/theorems/berria.mdx') }))
      .toBe('/es/editor/eu/theorems/berria');
    expect(editorUrlFromState({ uiLang: 'es', file: fileNodeFromPath('content/diagrams/Teoremas/Nuevo.tsx') }))
      .toBe('/es/editor/diagrama/Nuevo');
    expect(fileNodeFromPath('src/otro.ts')).toBeNull();
  });
});
