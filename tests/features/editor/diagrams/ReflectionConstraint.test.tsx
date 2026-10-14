import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { resolvePointCoordinates } from '../../../../src/diagrams/geometry/layout/scene';
import { parseDiagramSpecV3 } from '../../../../src/diagrams/model/schema/schemaV3';
import { setReflectionConstraintForPoint, setReflectionConstraintForSegment } from '../../../../src/fixed-pages/editor/diagrams/model/constraints/reflectionConstraints';
import { SegmentReflectionConstraintEditor } from '../../../../src/fixed-pages/editor/diagrams/ui/constraints/SegmentReflectionConstraintEditor';
import type { VisualDiagramModel } from '../../../../src/fixed-pages/editor/diagrams/model/types';
import { element, point } from '../../../../src/fixed-pages/editor/diagrams/model';
import { constrained, diagramConstraint, findById, positionOf, sceneFromParts } from '../../../helpers/diagramSpec';

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

describe('Reflection Constraint (Simetría central y axial)', () => {
  it('evaluates central symmetry of a point across another point (2C - P)', () => {
    // P = (1, 3), C = (3, 3) => P' = 2(3,3) - (1,3) = (5, 3)
    const coords = resolvePointCoordinates(baseModel, 'pPrime');
    expect(coords).toEqual({ x: 5, y: 3 });
  });

  it('evaluates axial symmetry of a point across a segment (2F - Q)', () => {
    // Q = (2, 4), Segment AB from (0,0) to (4,0) (horizontal line y=0)
    // Foot F = (2, 0) => Q' = 2(2,0) - (2,4) = (2, -4)
    const coords = resolvePointCoordinates(baseModel, 'pQPrime');
    expect(coords).toEqual({ x: 2, y: -4 });
  });

  it('creates point reflection constraint helper correctly and immediately computes target coordinates', () => {
    const updated = setReflectionConstraintForPoint(baseModel, 'pQPrime', 'pC', 'pQ');
    const addedConstraint = updated.relations.find(c => c.type === 'reflection' && c.refs[0] === 'pQPrime' && c.refs[1] === 'pC' && c.refs[2] === 'pQ');
    expect(addedConstraint).toBeDefined();

    // Q = (2, 4), C = (3, 3) => Q' = 2(3,3) - (2,4) = (4, 2)
    expect(positionOf(updated, 'pQPrime')).toEqual({ x: 4, y: 2 });
  });

  it('creates segment reflection constraint helper correctly', () => {
    const updated = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    const segmentConstraint = updated.relations.find(c => c.type === 'reflection' && c.refs[0] === 'segS2');
    expect(segmentConstraint).toBeDefined();
  });

  it('validates reflection relations against the V3 schema', () => {
    const validation = parseDiagramSpecV3(baseModel);
    expect(validation.success).toBe(true);
    expect(baseModel.relations.find(r => r.id === 'cReflP')?.type).toBe('reflection');
  });

  it('renders SegmentReflectionConstraintEditor UI correctly', () => {
    const seg = findById(baseModel, 'segS2');
    render(<SegmentReflectionConstraintEditor model={baseModel} segment={seg} onModelEdit={vi.fn()} />);

    expect(screen.getByText('Reflejo simétrico de segmento')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Establecer reflejo simétrico' })).toBeDefined();
  });
});
