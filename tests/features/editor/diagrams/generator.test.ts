import { describe, it, expect } from 'vitest';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';
import { createTemplateModel, point, element, slider, step } from '../../../../src/features/editor/diagrams/model/commands';
import type { VisualDiagramModel } from '../../../../src/features/editor/diagrams/model/types';

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

  it('generates all supported construction helpers, sliders, gliders and step visibility', () => {
    const model: VisualDiagramModel = {
      title: 'Completo',
      componentId: 'completo',
      category: 'geogebra',
      mode: 'simulation',
      axis: true,
      grid: true,
      boundingBox: [-5, 5, 5, -5],
      points: [
        point('pA', 'A', -1, 0, false, 'pavo'),
        point('pB', 'B', 1, 0),
        point('pC', 'C', 0, 2),
        point('pD', 'D', 2, 2, false, 'salvia', 'horizontal'),
        point('pE', 'E', -2, 2, false, 'terracota', 'vertical'),
        point('pG', 'G', 0, 0, false, 'ocre', 'glider', 'segAB'),
      ],
      elements: [
        element('segAB', 'AB', 'segment', ['pA', 'pB'], 'carbon', true, { dashed: true }),
        element('lineAB', 'recta AB', 'line', ['pA', 'pB'], 'pavo', false),
        element('rayAC', 'rayo AC', 'ray', ['pA', 'pC'], 'salvia'),
        element('polyABC', 'ABC', 'polygon', ['pA', 'pB', 'pC'], 'musgo', false, true),
        element('circAB', 'cAB', 'circle', ['pA', 'pB'], 'granada'),
        element('midAB', 'M', 'midpoint', ['pA', 'pB'], 'ocre'),
        element('footCAB', 'F', 'perpendicularFoot', ['pC', 'pA', 'pB'], 'terracota'),
        element('extCAB', 'ext', 'baseExtension', ['pC', 'pA', 'pB'], 'pizarra'),
        element('perpCAB', 'perp', 'perpendicular', ['pC', 'pA', 'pB'], 'pavo', true),
        element('parCAB', 'par', 'parallel', ['pC', 'pA', 'pB'], 'salvia'),
        element('bisABC', 'bis', 'angleBisector', ['pA', 'pB', 'pC'], 'musgo'),
        element('angABC', 'ang', 'angle', ['pA', 'pB', 'pC'], 'granada'),
        element('rightABC', 'right', 'rightAngle', ['pA', 'pB', 'pC'], 'ocre'),
        { ...element('txtA', 'texto', 'text', ['pA'], 'carbon'), text: 'Texto' },
        { ...element('measureG', 'medida', 'measurement', ['pG'], 'pavo'), text: 'm' },
      ],
      sliders: [{ ...slider('s1', 'Control', -4, -4, 2, 'granada'), min: 0, max: 4, step: 0.5 }],
      steps: [step('step1', 'Paso 1', 'Mostrar AB', ['pA', 'pB', 'segAB'])],
      note: 'Nota',
    };

    const result = generateDiagramSource(model, 'Completo');

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const helper of [
      'createBaseExtensionToFoot',
      'createGlider',
      'createParallelLine',
      'createPerpendicularFoot',
      'createPerpendicularLine',
      'createSlider',
      'createText',
      'createRightAngleMarker',
    ]) {
      expect(result.source).toContain(helper);
    }
    expect(result.source).toContain('axis');
    expect(result.source).toContain('grid');
    expect(result.source).toContain('"step1"');
    expect(result.source).toContain('outsideBaseExtension');
    expect(result.source).toContain('els["pD"].on');
    expect(result.source).toContain('els["pE"].on');
  });
});
