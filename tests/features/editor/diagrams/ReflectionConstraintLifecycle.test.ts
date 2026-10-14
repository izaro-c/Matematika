import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  reflectionConstraintForPoint,
  reflectionConstraintForSegment,
  removeSegmentReflectionConstraint,
  setReflectionConstraintForPoint,
  setReflectionConstraintForSegment,
} from '../../../../src/fixed-pages/editor/diagrams/model/constraints/reflectionConstraints';
import { SegmentReflectionConstraintEditor } from '../../../../src/fixed-pages/editor/diagrams/ui/constraints/SegmentReflectionConstraintEditor';
import type { VisualDiagramModel } from '../../../../src/fixed-pages/editor/diagrams/model/types';
import { segmentEndpoints, type DiagramRelation } from '../../../../src/diagrams';
import { element, point, pointMode } from '../../../../src/fixed-pages/editor/diagrams/model';
import { constrained, diagramConstraint, findById, pointById, sceneFromParts } from '../../../helpers/diagramSpec';

const baseModel: VisualDiagramModel = sceneFromParts({
  title: 'Test Reflejo',
  componentId: 'test-reflejo',
  viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
  points: [
    point('pP', 'P', 1, 3),
    { ...point('pC', 'C', 3, 3, true, 'canela'), order: 1 },
    { ...constrained(point('pPrime', "P'", 0, 0, false, 'ocre'), ['cReflP']), order: 2 },
    { ...point('pA', 'A', 0, 0, true, 'pavo'), order: 3 },
    { ...point('pB', 'B', 4, 0, true, 'pavo'), order: 4 },
    { ...point('pQ', 'Q', 2, 4), order: 5 },
    { ...constrained(point('pQPrime', "Q'", 0, 0, false, 'granada'), ['cReflQ']), order: 6 },
  ],
  elements: [
    { ...element('segAB', 'Eje AB', 'segment', ['pA', 'pB'], 'carbon'), order: 10 },
    { ...element('segS1', 'Segmento S1', 'segment', ['pP', 'pQ'], 'pavo'), order: 11 },
    { ...element('segS2', 'Segmento S2', 'segment', ['pPrime', 'pQPrime'], 'granada'), order: 12 },
  ],
  constraints: [
    diagramConstraint('cReflP', 'Reflejo central de P respecto de C', 'reflection', ['pPrime', 'pC', 'pP']),
    diagramConstraint('cReflQ', 'Reflejo axial de Q respecto del eje AB', 'reflection', ['pQPrime', 'segAB', 'pQ']),
  ],
  note: 'Test note',
});

function reflectionRefs(relation: DiagramRelation | undefined): string[] | undefined {
  return relation?.type === 'reflection' ? relation.refs : undefined;
}

function reflections(model: VisualDiagramModel) {
  return model.relations.filter(relation => relation.type === 'reflection');
}

function segmentReflectionConstraints(model: VisualDiagramModel, segmentId: string) {
  const endpoints = segmentEndpoints(model.objects.find(object => object.id === segmentId));
  if (!endpoints) return [];
  return reflections(model).filter(relation => {
    const target = reflectionRefs(relation)?.[0];
    return target === segmentId || endpoints.some(ref => target === ref);
  });
}

describe('Reflection constraint lifecycle', () => {
  it('setReflectionConstraintForSegment creates a coherent group (segment + endpoint reflections)', () => {
    const updated = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    const segmentConstraint = reflectionConstraintForSegment(updated, 'segS2');

    expect(segmentConstraint).toBeDefined();
    expect(reflectionRefs(segmentConstraint)).toEqual(['segS2', 'segS1', 'segAB']);
    expect(reflectionConstraintForPoint(updated, 'pPrime')).toBeDefined();
    expect(reflectionConstraintForPoint(updated, 'pQPrime')).toBeDefined();
    expect(segmentReflectionConstraints(updated, 'segS2')).toHaveLength(3);
  });

  it('removeSegmentReflectionConstraint removes the segment constraint and both endpoint reflections', () => {
    const withReflection = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    expect(segmentReflectionConstraints(withReflection, 'segS2')).toHaveLength(3);

    const removed = removeSegmentReflectionConstraint(withReflection, 'segS2');

    expect(reflectionConstraintForSegment(removed, 'segS2')).toBeUndefined();
    expect(reflectionConstraintForPoint(removed, 'pPrime')).toBeUndefined();
    expect(reflectionConstraintForPoint(removed, 'pQPrime')).toBeUndefined();
    expect(reflections(removed)).toHaveLength(0);
    expect(pointMode(pointById(removed, 'pPrime'))).toBe('free');
    expect(pointMode(pointById(removed, 'pQPrime'))).toBe('free');
  });

  it('re-applying segment reflection replaces the previous group instead of accumulating', () => {
    const first = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    expect(segmentReflectionConstraints(first, 'segS2')).toHaveLength(3);

    const second = setReflectionConstraintForSegment(first, 'segS2', 'pC', 'segS1');
    const secondGroup = segmentReflectionConstraints(second, 'segS2');

    expect(secondGroup).toHaveLength(3);
    expect(reflections(second)).toHaveLength(3);
    expect(reflectionRefs(reflectionConstraintForSegment(second, 'segS2'))).toEqual(['segS2', 'segS1', 'pC']);
  });

  it('setReflectionConstraintForPoint replaces an existing point reflection instead of accumulating', () => {
    const first = setReflectionConstraintForPoint(baseModel, 'pQPrime', 'pC', 'pQ');
    const firstId = reflectionConstraintForPoint(first, 'pQPrime')?.id;

    const second = setReflectionConstraintForPoint(first, 'pQPrime', 'segAB', 'pQ');
    const secondConstraint = reflectionConstraintForPoint(second, 'pQPrime');

    expect(secondConstraint).toBeDefined();
    expect(secondConstraint?.id).toBe(firstId);
    expect(reflectionRefs(secondConstraint)).toEqual(['pQPrime', 'segAB', 'pQ']);
    expect(pointById(second, 'pQPrime').mobility).toEqual({ type: 'constrained', relationIds: [firstId] });
    expect(reflections(second).filter(relation => reflectionRefs(relation)?.[0] === 'pQPrime')).toHaveLength(1);
  });

  it('SegmentReflectionConstraintEditor shows one active reflection entry, not three', () => {
    const model = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    const segment = findById(model, 'segS2');

    render(React.createElement(SegmentReflectionConstraintEditor, { model, segment, onModelEdit: vi.fn() }));

    expect(screen.getAllByRole('button', { name: /^Eliminar / })).toHaveLength(1);
  });
});
