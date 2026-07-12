import { describe, it, expect } from 'vitest';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';
import { createTemplateModel, point, element } from '../../../../src/features/editor/diagrams/model/commands';

describe('Diagram TSX Generator', () => {
  it('should generate source for a template model', () => {
    const model = createTemplateModel('circunferencia', 'Círculo de prueba', 'definicion');
    const result = generateDiagramSource(model, 'CirculoDePrueba');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.source).toContain('export const CirculoDePrueba = () => {');
      expect(result.source).toContain('MathBoard');
      expect(result.source).toContain('createPoint');
      expect(result.source).toContain('createCircle');
    }
  });

  it('should return error diagnostics on invalid model state', () => {
    // Model with empty componentId or no points
    const model = {
      title: 'Empty',
      componentId: '',
      category: 'Teoremas',
      mode: 'simulation' as const,
      axis: false,
      grid: false,
      boundingBox: [-5, 5, 5, -5] as [number, number, number, number],
      points: [],
      elements: [],
      sliders: [],
      steps: [],
      note: 'None',
    };

    const result = generateDiagramSource(model, 'Empty');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.diagnostics.length).toBeGreaterThan(0);
      expect(result.diagnostics.some(d => d.code === 'empty-component-id')).toBe(true);
      expect(result.diagnostics.some(d => d.code === 'no-points')).toBe(true);
    }
  });

  it('should flag elements referencing non-existent points', () => {
    const model = {
      title: 'Dangling Ref',
      componentId: 'dangling-ref',
      category: 'Teoremas',
      mode: 'simulation' as const,
      axis: false,
      grid: false,
      boundingBox: [-5, 5, 5, -5] as [number, number, number, number],
      points: [point('pA', 'A', 0, 0)],
      elements: [element('segAB', 'Segment AB', 'segment', ['pA', 'pB'], 'carbon')],
      sliders: [],
      steps: [],
      note: 'None',
    };

    const result = generateDiagramSource(model, 'DanglingRef');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.diagnostics.some(d => d.code === 'invalid-reference')).toBe(true);
    }
  });
});
