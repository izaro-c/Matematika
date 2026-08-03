import { describe, expect, it } from 'vitest';
import {
  normalizeDiagramModulePath,
  resolveDiagramLoader,
} from '@/fixed-pages/editor/diagrams/ui/DiagramRuntimePreview';

describe('DiagramRuntimePreview path resolution', () => {
  const modules = {
    '/content/diagrams/Teoremas/Pitagoras.tsx': async () => ({}),
    '/content/diagrams/Definiciones/Triangulo.tsx': async () => ({}),
  };

  it('normalizes editor, alias and bare import paths to content/diagrams', () => {
    expect(normalizeDiagramModulePath('content/diagrams/Teoremas/Pitagoras.tsx'))
      .toBe('content/diagrams/Teoremas/Pitagoras.tsx');
    expect(normalizeDiagramModulePath('@content/diagrams/Teoremas/Pitagoras'))
      .toBe('content/diagrams/Teoremas/Pitagoras.tsx');
    expect(normalizeDiagramModulePath('@/content/diagrams/Teoremas/Pitagoras'))
      .toBe('content/diagrams/Teoremas/Pitagoras.tsx');
    expect(normalizeDiagramModulePath('/Matematika/content/diagrams/Teoremas/Pitagoras.tsx'))
      .toBe('content/diagrams/Teoremas/Pitagoras.tsx');
    expect(normalizeDiagramModulePath('src/content/diagrams/Teoremas/Pitagoras.tsx'))
      .toBe('content/diagrams/Teoremas/Pitagoras.tsx');
  });

  it('resolves loaders from alias paths and component names', () => {
    expect(resolveDiagramLoader(modules, '@content/diagrams/Teoremas/Pitagoras', 'Pitagoras'))
      .toBe(modules['/content/diagrams/Teoremas/Pitagoras.tsx']);
    expect(resolveDiagramLoader(modules, null, 'Triangulo'))
      .toBe(modules['/content/diagrams/Definiciones/Triangulo.tsx']);
    expect(resolveDiagramLoader(modules, 'missing/path.tsx', 'Missing')).toBeUndefined();
  });
});
