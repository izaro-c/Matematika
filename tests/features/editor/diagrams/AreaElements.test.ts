import { describe, expect, it } from 'vitest';
import { element, point } from '../../../../src/fixed-pages/editor/diagrams/model/elements/diagramElements';
import { constrainPointCoordinates } from '../../../../src/diagrams/geometry/layout/scene';
import { pointInsideAreaElement } from '../../../../src/diagrams/geometry/areas/areaRegions';
import { diagramSpecV3Schema } from '../../../../src/diagrams/model/schema/schemaV3';
import type { DiagramObject, DiagramSpec } from '../../../../src/diagrams';
import { constrained, curvePath, diagramConstraint, findById, movedTo, pointById, sceneFromParts, type TestRelation } from '../../../helpers/diagramSpec';

function areaScene(points: DiagramObject[], elements: DiagramObject[], constraints: TestRelation[]): DiagramSpec {
  return sceneFromParts({
    title: 'Semiplano',
    componentId: 'semiplano',
    viewport: { bounds: [-6, 6, 6, -6], home: [-6, 6, 6, -6], minZoom: 0.5, maxZoom: 4, padding: 0.08 },
    points,
    elements,
    constraints,
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: [...points, ...elements].map(item => item.id), durationMs: 0 }],
  });
}

function halfPlaneModel(): DiagramSpec {
  return areaScene(
    [
      point('pA', 'A', -2, 0),
      point('pB', 'B', 2, 0),
      point('pC', 'C', 0, 2),
      constrained(point('pD', 'D', 0, -1), ['inside-half']),
    ],
    [element('half1', 'Semiplano superior', 'halfPlane', ['pA', 'pB', 'pC'], 'canela')],
    [diagramConstraint('inside-half', 'D dentro del semiplano', 'insideArea', ['pD', 'half1'])],
  );
}

describe('area elements', () => {
  it('representa semiplanos y pertenencia con el contrato v3', () => {
    const model = halfPlaneModel();
    expect(diagramSpecV3Schema.safeParse(model).success).toBe(true);
    expect(model.objects.some(object => object.objectType === 'area' && object.geometry.type === 'half-plane')).toBe(true);
    expect(model.relations.some(relation => relation.type === 'inside-area')).toBe(true);
  });

  it('restringe un punto al interior de un semiplano', () => {
    const model = movedTo(halfPlaneModel(), 'pD', 0, -4);
    const next = constrainPointCoordinates(model, pointById(model, 'pD'), { x: 0, y: -4 });
    expect(next.y).toBeGreaterThan(0);
  });

  it('restringe un punto al perímetro de un círculo', () => {
    const model = areaScene(
      [point('pO', 'O', 0, 0), point('pR', 'R', 3, 0), constrained(point('pD', 'D', 0, 0), ['on-circle'])],
      [element('circle1', 'Círculo', 'circle', ['pO', 'pR'], 'canela')],
      [diagramConstraint('on-circle', 'D en el perímetro', 'insideArea', ['pD', 'circle1'], { areaMembership: 'boundary' })],
    );
    const next = constrainPointCoordinates(model, pointById(model, 'pD'), { x: 1, y: 1 });
    expect(Math.hypot(next.x, next.y)).toBeCloseTo(3, 5);
    const relation = model.relations.find(item => item.type === 'inside-area');
    expect(relation && 'membership' in relation ? relation.membership : undefined).toBe('boundary');
  });

  it('restringe un punto al semiplano de una función muestreada', () => {
    const model = areaScene(
      [point('pSide', 'S', 0, 4), constrained(point('pD', 'D', 0, -4), ['inside-sin'])],
      [curvePath('sinArea', 'sin(x)', 'functionCurve', ['pSide'], {
        expression: 'sin(x)',
        variable: 'x',
        domain: [-5, 5],
        samples: 32,
        areaFill: 'half-plane',
      })],
      [diagramConstraint('inside-sin', 'D dentro del semiplano de sin', 'insideArea', ['pD', 'sinArea'])],
    );
    const next = constrainPointCoordinates(model, pointById(model, 'pD'), { x: 0, y: -4 });
    expect(next.y).toBeGreaterThan(-1);
    expect(pointInsideAreaElement(model, findById(model, 'sinArea'), next)).toBe(true);
  });
});
