import { describe, expect, it } from 'vitest';
import type { FileNode } from '../../../../src/fixed-pages/editor/types/editorContracts';
import {
  documentPathCrumbs,
  editorDocumentKey,
  editorStateFromUrl,
  editorUrlFromState,
  sanitizeReturnPath,
} from '../../../../src/fixed-pages/editor/session/editorNavigationModel';

const base = { capability: 'visual-exact', capabilityLabel: 'Editable', reason: '' } as const;
// `id` y `type` imitan lo que devuelve la API de desarrollo: heurísticas poco fiables.
const anguloEs: FileNode = { ...base, path: 'content/mdx/es/definitions/angulo.mdx', name: 'angulo.mdx', type: 'definicion', kind: 'mdx-document', lang: 'es', id: 'angulo' };
const anguloEu: FileNode = { ...base, path: 'content/mdx/eu/definitions/angulo.mdx', name: 'angulo.mdx', type: 'definicion', kind: 'mdx-document', lang: 'eu', id: 'angulo' };
const congruence1: FileNode = { ...base, path: 'content/diagrams/Axiomas/Congruence1.tsx', name: 'Congruence1.tsx', type: 'diagram-axiomas', kind: 'diagram', id: 'geometry' };
const tales: FileNode = { ...base, path: 'content/diagrams/Teoremas/Tales.tsx', name: 'Tales.tsx', type: 'diagram-teoremas', kind: 'diagram', id: 'geometry' };
const readme: FileNode = { ...base, path: 'content/diagrams/README.md', name: 'README.md', type: 'content', kind: 'mdx-document', id: 'README' };
const pitagorasA: FileNode = { ...base, path: 'content/diagrams/Axiomas/Pitagoras.tsx', name: 'Pitagoras.tsx', type: 'diagram-axiomas', kind: 'diagram', id: 'geometry' };
const pitagorasT: FileNode = { ...base, path: 'content/diagrams/Teoremas/Pitagoras.tsx', name: 'Pitagoras.tsx', type: 'diagram-teoremas', kind: 'diagram', id: 'geometry' };
const files = [anguloEs, anguloEu, congruence1, tales, pitagorasA, pitagorasT, readme];

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
    const url = editorUrlFromState({ uiLang: 'es', path: anguloEu.path, viewMode: 'code', blockId: 'block-3' });
    expect(url).toBe('/es/editor/eu/definitions/angulo?vista=codigo&bloque=block-3');
    expect(parse(url)).toEqual({
      status: 'file', path: anguloEu.path, viewMode: 'code', originLang: null, blockId: 'block-3',
      diagramSurface: false, step: null, returnTo: null,
    });
    // Cambiar `:lang` no cambia el documento abierto.
    expect(parse('/en/editor/eu/definitions/angulo')).toMatchObject({ path: anguloEu.path });
  });

  it('vista de traducción con el idioma del original', () => {
    const url = editorUrlFromState({ uiLang: 'eu', path: anguloEu.path, viewMode: 'translate', originLang: 'es' });
    expect(url).toBe('/eu/editor/eu/definitions/angulo?vista=traduccion&desde=es');
    expect(parse(url)).toMatchObject({ viewMode: 'translate', originLang: 'es' });
    // `desde` solo tiene sentido en la vista de traducción y solo admite códigos de idioma.
    expect(editorUrlFromState({ uiLang: 'es', path: anguloEu.path, viewMode: 'code', originLang: 'es' })).not.toContain('desde');
    expect(parse('/es/editor/eu/definitions/angulo?vista=traduccion&desde=../x')).toMatchObject({ originLang: null });
  });

  it('ida y vuelta conserva vista, bloque, superficie de diagrama y paso', () => {
    const url = editorUrlFromState({ uiLang: 'es', path: anguloEs.path, viewMode: 'preview', blockId: 'block-1', diagramSurface: true, step: '2' });
    expect(url).toBe('/es/editor/es/definitions/angulo?vista=previa&bloque=block-1&editar=diagrama&paso=2');
    expect(parse(url)).toMatchObject({ viewMode: 'preview', blockId: 'block-1', diagramSurface: true, step: '2' });
  });

  it('cada diagrama se identifica por su archivo aunque el catálogo repita `id`', () => {
    const url = editorUrlFromState({ uiLang: 'es', path: tales.path, step: '3', returnTo: '/es/editor/es/definitions/angulo?vista=codigo' });
    expect(url).toBe('/es/editor/diagrama/Teoremas/Tales?paso=3&volver=%2Fes%2Feditor%2Fes%2Fdefinitions%2Fangulo%3Fvista%3Dcodigo');
    expect(parse(url)).toMatchObject({
      status: 'file', path: tales.path, step: '3', diagramSurface: false,
      returnTo: '/es/editor/es/definitions/angulo?vista=codigo',
    });
    expect(parse('/es/editor/diagrama/teoremas/tales')).toMatchObject({ path: tales.path });
    expect(parse('/es/editor/diagrama/Axiomas/Congruence1')).toMatchObject({ path: congruence1.path });
  });

  it('diagramas con el mismo nombre en carpetas distintas tienen URLs distintas', () => {
    expect(parse(editorUrlFromState({ uiLang: 'es', path: pitagorasA.path }))).toMatchObject({ path: pitagorasA.path });
    expect(parse(editorUrlFromState({ uiLang: 'es', path: pitagorasT.path }))).toMatchObject({ path: pitagorasT.path });
    // La forma corta solo resuelve nombres únicos.
    expect(parse('/es/editor/diagrama/Tales')).toMatchObject({ path: tales.path });
    expect(parse('/es/editor/diagrama/Pitagoras')).toMatchObject({ status: 'not-found' });
  });

  it('otros recursos del catálogo usan su ruta completa', () => {
    const url = editorUrlFromState({ uiLang: 'es', path: readme.path });
    expect(url).toBe('/es/editor/archivo/content/diagrams/README.md');
    expect(parse(url)).toMatchObject({ path: readme.path });
  });

  it('archivos aún fuera del catálogo (recién creados) tienen URL', () => {
    expect(editorUrlFromState({ uiLang: 'es', path: 'content/mdx/eu/theorems/berria.mdx' })).toBe('/es/editor/eu/theorems/berria');
    expect(editorUrlFromState({ uiLang: 'es', path: 'content/diagrams/Teoremas/Nuevo.tsx' })).toBe('/es/editor/diagrama/Teoremas/Nuevo');
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
    expect(sanitizeReturnPath('/\t//evil.example')).toBeNull();
    expect(sanitizeReturnPath('/\n/evil.example')).toBeNull();
    expect(sanitizeReturnPath('/es/editor?vista=codigo')).toBe('/es/editor?vista=codigo');
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
});

describe('ruta del documento en la barra superior', () => {
  it('muestra carpeta y nombre, sin el prefijo del corpus ni el idioma', () => {
    expect(documentPathCrumbs('content/mdx/es/definitions/angulo.mdx')).toEqual(['definitions', 'angulo']);
    expect(documentPathCrumbs('content/diagrams/geometria/Triangulo.tsx')).toEqual(['geometria', 'Triangulo']);
    expect(documentPathCrumbs('widgets/diagrams/Punto.tsx')).toEqual(['widgets', 'diagrams', 'Punto']);
    expect(documentPathCrumbs('')).toEqual([]);
  });
});
