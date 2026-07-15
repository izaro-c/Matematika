import { describe, it, expect } from 'vitest';
import { createTemplateModel, point, element, generatedElementId, projectPointToSupport, toolReferenceLabel, updatePoint } from '../../../../src/features/editor/diagrams/model/commands';
import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS } from '../../../../src/shared/diagrams/public';
import { buildTargets, targetKind } from '../../../../src/features/editor/diagrams/model/selectors';

describe('Diagram Model & Selectors', () => {
  it('should construct visual point with correct options', () => {
    const pt = point('pA', 'A', 2.5, -3.1, true, 'salvia');
    expect(pt.id).toBe('pA');
    expect(pt.label).toBe('A');
    expect(pt.x).toBe(2.5);
    expect(pt.y).toBe(-3.1);
    expect(pt.fixed).toBe(true);
    expect(pt.color).toBe('salvia');
    expect(pt.constraint).toBe('fixed');
  });

  it('keeps the legacy fixed flag consistent with the selected movement constraint', () => {
    const model = createTemplateModel('circunferencia', 'Restricciones', 'definicion');
    const source = model.points[0];
    const fixedModel = {
      ...model,
      points: model.points.map(item => item.id === source.id
        ? { ...item, fixed: true, constraint: 'fixed' as const }
        : item),
    };

    const gliderModel = updatePoint(fixedModel, source.id, {
      constraint: 'glider',
      gliderTarget: model.elements[0].id,
    });
    const glider = gliderModel.points.find(item => item.id === source.id);

    expect(glider).toMatchObject({
      fixed: false,
      constraint: 'glider',
      gliderTarget: model.elements[0].id,
    });
  });

  it('should construct elements with correct references', () => {
    const el = element('segAB', 'Segmento AB', 'segment', ['pA', 'pB'], 'carbon');
    expect(el.id).toBe('segAB');
    expect(el.kind).toBe('segment');
    expect(el.refs).toEqual(['pA', 'pB']);
    expect(el.color).toBe('carbon');
  });

  it('creates angular marks with explicit valid radii and identifies the vertex slot', () => {
    expect(element('angleABC', 'Ángulo ABC', 'angle', ['pA', 'pB', 'pC'], 'ocre').style?.angleRadius).toBe(DEFAULT_ANGLE_RADIUS);
    expect(element('rightABC', 'Ángulo recto ABC', 'rightAngle', ['pA', 'pB', 'pC'], 'ocre').style?.angleRadius).toBe(DEFAULT_RIGHT_ANGLE_RADIUS);
    expect(toolReferenceLabel('angle', 0)).toBe('Punto del primer lado');
    expect(toolReferenceLabel('angle', 1)).toBe('Vértice');
    expect(toolReferenceLabel('angle', 2)).toBe('Punto del segundo lado');
  });

  it('should create template models successfully', () => {
    const model = createTemplateModel('circunferencia', 'Círculo de prueba', 'definicion');
    expect(model.title).toBe('Círculo de prueba');
    expect(model.points).toHaveLength(2); // O and A
    expect(model.elements.some(e => e.kind === 'circle')).toBe(true);
  });

  it('should map element kinds to target kinds correctly', () => {
    expect(targetKind('segment')).toBe('segment');
    expect(targetKind('perpendicular')).toBe('line');
    expect(targetKind('midpoint')).toBe('point');
    expect(targetKind('angle')).toBe('angle');
    expect(targetKind('text')).toBe('measurement');
  });

  it('should generate build targets registry for a model', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const targets = buildTargets(model);
    expect(targets.length).toBeGreaterThan(0);
    expect(targets.some(t => t.id === 'pO')).toBe(true);
  });

  it('should project points to glider supports', () => {
    const model = createTemplateModel('lugar-geometrico', 'Lugar', 'definicion');
    const pP = model.points.find(p => p.id === 'pP')!;
    const projected = projectPointToSupport(model, pP, { x: 0.5, y: 1 });
    // Glide target is lineMediatriz, which is x=0 mediatriz of AB.
    // Projected x coordinate must be exactly 0
    expect(projected.x).toBeCloseTo(0, 5);
  });

  it('should generate unique component element IDs', () => {
    const existing = [
      element('segAB', 'Segment', 'segment', ['pA', 'pB'], 'carbon')
    ];
    const nextId = generatedElementId('segment', ['pA', 'pB'], existing);
    expect(nextId).toBe('segAB_2');
  });
});
