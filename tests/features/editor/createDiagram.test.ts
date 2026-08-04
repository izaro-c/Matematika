import { describe, expect, it } from 'vitest';
import { idToComponentName, createDiagramPath, toDiagramImportPath } from '../../../src/fixed-pages/editor/review/authoringModel';

describe('create diagram helpers', () => {
  it('converts kebab-case IDs into PascalCase component names', () => {
    expect(idToComponentName('triangulo-pasos')).toBe('TrianguloPasos');
    expect(idToComponentName('circulo-unitario')).toBe('CirculoUnitario');
    expect(idToComponentName('demostracion-tales-1')).toBe('DemostracionTales1');
    expect(idToComponentName('')).toBe('DiagramaInteractivo');
  });

  it('builds diagram file path in content/diagrams directory', () => {
    expect(createDiagramPath({
      id: 'triangulo-pasos',
      title: 'Triángulo con pasos',
      category: 'Teoremas',
      templateType: 'triangulo-deformable',
    })).toBe('content/diagrams/Teoremas/TrianguloPasos.tsx');

    expect(createDiagramPath({
      id: 'circulo-unitario',
      title: 'Círculo unitario',
      category: 'Definiciones',
      templateType: 'circulo-unitario',
    })).toBe('content/diagrams/Definiciones/CirculoUnitario.tsx');
  });

  it('normalizes filesystem diagram paths to @content imports', () => {
    expect(toDiagramImportPath('content/diagrams/Teoremas/TrianguloPasos.tsx'))
      .toBe('@content/diagrams/Teoremas/TrianguloPasos');
    expect(toDiagramImportPath('@content/diagrams/Definiciones/CirculoUnitario'))
      .toBe('@content/diagrams/Definiciones/CirculoUnitario');
    expect(toDiagramImportPath('@/content/diagrams/Axiomas/Incidence1.tsx'))
      .toBe('@content/diagrams/Axiomas/Incidence1');
  });
});
