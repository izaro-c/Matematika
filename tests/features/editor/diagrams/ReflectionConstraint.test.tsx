import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { resolvePointCoordinates } from '../../../../src/shared/diagrams/spec/scene';
import { migrateDiagramSpecV2ToV3, projectDiagramSpecV3ToV2 } from '../../../../src/shared/diagrams/spec/v3Compatibility';
import { parseDiagramSpecV3 } from '../../../../src/shared/diagrams/spec/schemaV3';
import { setReflectionConstraintForPoint, setReflectionConstraintForSegment } from '../../../../src/features/editor/diagrams/model/reflectionConstraints';
import { SegmentReflectionConstraintEditor } from '../../../../src/features/editor/diagrams/ui/SegmentReflectionConstraintEditor';
import type { VisualDiagramModel } from '../../../../src/features/editor/diagrams/model/types';

const baseModel: VisualDiagramModel = {
  version: '2.0',
  renderer: 'matematika-diagram-renderer-v2',
  title: 'Test Reflejo',
  componentId: 'test-reflejo',
  category: 'Demos',
  mode: 'simulation',
  axis: false,
  grid: false,
  showLabels: true,
  viewport: { bounds: [-5, 5, 5, -5], home: [-5, 5, 5, -5], minZoom: 0.2, maxZoom: 12, padding: 0.16 },
  layers: [
    { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
    { id: 'controls', label: 'Controles', order: 1, visible: true, locked: false },
  ],
  groups: [],
  points: [
    { id: 'pP', label: 'P', x: 1, y: 3, showLabel: true, fixed: false, color: 'terracota', constraint: 'free', layerId: 'geometry', order: 0, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pC', label: 'C', x: 3, y: 3, showLabel: true, fixed: true, color: 'salvia', constraint: 'fixed', layerId: 'geometry', order: 1, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pPrime', label: "P'", x: 0, y: 0, showLabel: true, fixed: false, color: 'ocre', constraint: 'constrained', constraintIds: ['cReflP'], layerId: 'geometry', order: 2, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pA', label: 'A', x: 0, y: 0, showLabel: true, fixed: true, color: 'pavo', constraint: 'fixed', layerId: 'geometry', order: 3, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pB', label: 'B', x: 4, y: 0, showLabel: true, fixed: true, color: 'pavo', constraint: 'fixed', layerId: 'geometry', order: 4, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pQ', label: 'Q', x: 2, y: 4, showLabel: true, fixed: false, color: 'terracota', constraint: 'free', layerId: 'geometry', order: 5, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'pQPrime', label: "Q'", x: 0, y: 0, showLabel: true, fixed: false, color: 'granada', constraint: 'constrained', constraintIds: ['cReflQ'], layerId: 'geometry', order: 6, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
  ],
  elements: [
    { id: 'segAB', label: 'Eje AB', kind: 'segment', refs: ['pA', 'pB'], color: 'carbon', layerId: 'geometry', order: 10, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'segS1', label: 'Segmento S1', kind: 'segment', refs: ['pP', 'pQ'], color: 'pavo', layerId: 'geometry', order: 11, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
    { id: 'segS2', label: 'Segmento S2', kind: 'segment', refs: ['pPrime', 'pQPrime'], color: 'granada', layerId: 'geometry', order: 12, visible: true, locked: false, groupIds: [], selection: { selectable: true }, target: true },
  ],
  sliders: [],
  steps: [],
  constraints: [
    { id: 'cReflP', label: "Reflejo central de P respecto de C", kind: 'reflection', refs: ['pPrime', 'pC', 'pP'], enabled: true },
    { id: 'cReflQ', label: "Reflejo axial de Q respecto del eje AB", kind: 'reflection', refs: ['pQPrime', 'segAB', 'pQ'], enabled: true },
  ],
  dependencies: [],
  note: 'Test note',
  extensions: {},
};

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
    const addedConstraint = updated.constraints?.find(c => c.refs[0] === 'pQPrime' && c.refs[1] === 'pC' && c.refs[2] === 'pQ');
    expect(addedConstraint).toBeDefined();
    expect(addedConstraint?.kind).toBe('reflection');

    // Q = (2, 4), C = (3, 3) => Q' = 2(3,3) - (2,4) = (4, 2)
    const updatedPoint = updated.points.find(p => p.id === 'pQPrime');
    expect(updatedPoint?.x).toBe(4);
    expect(updatedPoint?.y).toBe(2);
  });

  it('creates segment reflection constraint helper correctly', () => {
    const updated = setReflectionConstraintForSegment(baseModel, 'segS2', 'segAB', 'segS1');
    const segmentConstraint = updated.constraints?.find(c => c.refs[0] === 'segS2');
    expect(segmentConstraint).toBeDefined();
    expect(segmentConstraint?.kind).toBe('reflection');
  });

  it('performs lossless V2 -> V3 migration and schema validation for reflection relations', () => {
    const v3 = migrateDiagramSpecV2ToV3(baseModel);
    const validation = parseDiagramSpecV3(v3);
    if (!validation.success) console.log('V3 Validation Error:', JSON.stringify(validation.error.issues, null, 2));
    expect(validation.success).toBe(true);

    const relP = v3.relations.find(r => r.id === 'cReflP');
    expect(relP?.type).toBe('reflection');

    const projectedV2 = projectDiagramSpecV3ToV2(v3);
    const projectedConstraint = projectedV2.constraints?.find(c => c.id === 'cReflP');
    expect(projectedConstraint?.kind).toBe('reflection');
  });

  it('renders SegmentReflectionConstraintEditor UI correctly', () => {
    const seg = baseModel.elements.find(e => e.id === 'segS2')!;
    render(<SegmentReflectionConstraintEditor model={baseModel} segment={seg} onModelEdit={vi.fn()} />);

    expect(screen.getByText('Reflejo simétrico de segmento')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Establecer reflejo simétrico' })).toBeDefined();
  });
});
