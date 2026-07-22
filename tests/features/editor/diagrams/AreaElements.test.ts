import { describe, expect, it } from 'vitest';
import { diagramConstraint, element, point } from '../../../../src/features/editor/diagrams/model/diagramElements';
import { migrateDiagramSpecV2ToV3, projectDiagramSpecV3ToV2 } from '../../../../src/shared/diagrams/spec';
import { constrainPointCoordinates } from '../../../../src/shared/diagrams/spec/scene';
import { pointInsideAreaElement } from '../../../../src/shared/diagrams/spec/areaRegions';
import { diagramSpecV3Schema } from '../../../../src/shared/diagrams/spec/schemaV3';
import type { VisualDiagramModel } from '../../../../src/features/editor/diagrams/model/types';

function halfPlaneModel(): VisualDiagramModel {
  return {
    version: 2,
    renderer: 'matematika-diagram-renderer-v2',
    title: 'Semiplano',
    componentId: 'semiplano',
    category: 'Demos',
    mode: 'simulation',
    axis: false,
    grid: false,
    viewport: { bounds: [-6, 6, 6, -6], home: [-6, 6, 6, -6], minZoom: 0.5, maxZoom: 4, padding: 0.08 },
    layers: [{ id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [],
    points: [
      point('pA', 'A', -2, 0),
      point('pB', 'B', 2, 0),
      point('pC', 'C', 0, 2),
      point('pD', 'D', 0, -1, false, 'terracota', 'constrained', undefined),
    ].map(item => (
      item.id === 'pD' ? { ...item, constraintIds: ['inside-half'] } : item
    )),
    elements: [
      element('half1', 'Semiplano superior', 'halfPlane', ['pA', 'pB', 'pC'], 'salvia'),
    ],
    sliders: [],
    steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pA', 'pB', 'pC', 'pD', 'half1'], durationMs: 0 }],
    constraints: [
      diagramConstraint('inside-half', 'D dentro del semiplano', 'insideArea', ['pD', 'half1']),
    ],
    note: '',
    extensions: {},
  };
}

describe('area elements', () => {
  it('migra semiplanos e intersecciones al contrato v3', () => {
    const model = halfPlaneModel();
    const v3 = migrateDiagramSpecV2ToV3(model);
    expect(diagramSpecV3Schema.safeParse(v3).success).toBe(true);
    expect(v3.objects.some(object => object.objectType === 'area' && object.geometry.type === 'half-plane')).toBe(true);
    expect(v3.relations.some(relation => relation.type === 'inside-area')).toBe(true);
    const roundtrip = projectDiagramSpecV3ToV2(v3);
    expect(roundtrip.elements.some(elementItem => elementItem.kind === 'halfPlane')).toBe(true);
    expect(roundtrip.constraints?.some(constraint => constraint.kind === 'insideArea')).toBe(true);
  });

  it('restringe un punto al interior de un semiplano', () => {
    const model = halfPlaneModel();
    model.points = model.points.map(item => (
      item.id === 'pD'
        ? { ...item, y: -4, constraintIds: ['inside-half'] }
        : item
    ));
    const constrained = model.points.find(item => item.id === 'pD');
    if (!constrained) throw new Error('missing point');
    const next = constrainPointCoordinates(model, constrained, { x: constrained.x, y: constrained.y });
    expect(next.y).toBeGreaterThan(0);
  });

  it('restringe un punto al perímetro de un círculo', () => {
    const model: VisualDiagramModel = {
      ...halfPlaneModel(),
      points: [
        point('pO', 'O', 0, 0),
        point('pR', 'R', 3, 0),
        { ...point('pD', 'D', 0, 0, false, 'terracota', 'constrained'), constraintIds: ['on-circle'] },
      ],
      elements: [
        element('circle1', 'Círculo', 'circle', ['pO', 'pR'], 'salvia'),
      ],
      constraints: [
        diagramConstraint('on-circle', 'D en el perímetro', 'insideArea', ['pD', 'circle1'], { areaMembership: 'boundary' }),
      ],
      steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pO', 'pR', 'pD', 'circle1'], durationMs: 0 }],
    };
    const constrained = model.points.find(item => item.id === 'pD');
    if (!constrained) throw new Error('missing point');
    const next = constrainPointCoordinates(model, constrained, { x: 1, y: 1 });
    expect(Math.hypot(next.x, next.y)).toBeCloseTo(3, 5);
    const v3 = migrateDiagramSpecV2ToV3(model);
    const relation = v3.relations.find(item => item.type === 'inside-area');
    expect(relation && 'membership' in relation ? relation.membership : undefined).toBe('boundary');
  });

  it('restringe un punto al semiplano de una función muestreada', () => {
    const model: VisualDiagramModel = {
      ...halfPlaneModel(),
      points: [
        point('pSide', 'S', 0, 4),
        { ...point('pD', 'D', 0, -4, false, 'terracota', 'constrained'), constraintIds: ['inside-sin'] },
      ],
      elements: [
        element('sinArea', 'sin(x)', 'functionCurve', ['pSide'], 'salvia', true, {
          properties: {
            expression: 'sin(x)',
            parameter: 'x',
            domain: [-5, 5],
            samples: 32,
            areaFill: 'half-plane',
          },
        }),
      ],
      constraints: [
        diagramConstraint('inside-sin', 'D dentro del semiplano de sin', 'insideArea', ['pD', 'sinArea']),
      ],
      steps: [{ id: 'initial', label: 'Inicio', description: '', visibleTargets: ['pSide', 'pD', 'sinArea'], durationMs: 0 }],
    };
    const constrained = model.points.find(item => item.id === 'pD');
    if (!constrained) throw new Error('missing point');
    const next = constrainPointCoordinates(model, constrained, { x: constrained.x, y: constrained.y });
    expect(next.y).toBeGreaterThan(-1);
    expect(pointInsideAreaElement(model, model.elements[0], next)).toBe(true);
  });
});
