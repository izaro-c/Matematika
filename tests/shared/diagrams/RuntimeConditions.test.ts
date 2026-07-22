import { describe, expect, it, vi } from 'vitest';
import fixture from '../../fixtures/diagrams/diagram-spec-v2.json';
import {
  diagramTemplateExpressions,
  interpolateDiagramTemplate,
  parseDiagramSpecV2,
  renameDiagramTemplateIdentifiers,
} from '../../../src/shared/diagrams/public';
import { conditionAllows, measurementText, reactiveText } from '../../../src/shared/diagrams/runtime/diagramRuntimeUtils';
import { compactHeaderReadings } from '../../../src/shared/diagrams/runtime/DiagramKatexOverlay';

describe('diagram runtime diagnostics and conditions', () => {
  it('applies visibleWhen against live scene variables', () => {
    const parsed = parseDiagramSpecV2(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const item = { ...parsed.data.elements[0], properties: { visibleWhen: 'gt(pA.x, 1)' } };
    const elements = {
      pO: { X: () => 0, Y: () => 0 },
      pA: { X: () => 2, Y: () => 0 },
    };
    expect(conditionAllows(item, elements, parsed.data)).toBe(true);
    elements.pA.X = () => 0.5;
    expect(conditionAllows(item, elements, parsed.data)).toBe(false);
  });

  it('applies the shared visibleWhen property to points and sliders', () => {
    const parsed = parseDiagramSpecV2(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const elements = {
      pO: { X: () => 0, Y: () => 0 },
      pA: { X: () => 2, Y: () => 0 },
    };
    const point = { ...parsed.data.points[0], visibleWhen: 'gt(pA.x, 1)' };
    const slider = { ...parsed.data.sliders[0], visibleWhen: 'lt(pA.x, 3)' };

    expect(conditionAllows(point, elements, parsed.data)).toBe(true);
    expect(conditionAllows(slider, elements, parsed.data)).toBe(true);
    elements.pA.X = () => 4;
    expect(conditionAllows(point, elements, parsed.data)).toBe(true);
    expect(conditionAllows(slider, elements, parsed.data)).toBe(false);
  });

  it('keeps transient expression failures quiet while the scene is being constructed', () => {
    const parsed = parseDiagramSpecV2(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const item = { ...parsed.data.elements[0], text: 'Valor: {missing.x}' };
    expect(measurementText(item, {}, parsed.data)).toContain('{missing.x}');
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('renders several calculations with independent precision and units without touching KaTeX braces', () => {
    const template = String.raw`$\frac{1}{2}$ · mitad {= segAB.length / 2 | precision: 1 | unit: "cm"}; área {= segAB.length ^ 2 | precision: 3 | unit: "cm²"}`;
    expect(diagramTemplateExpressions(template)).toHaveLength(2);
    expect(interpolateDiagramTemplate(template, { 'segAB.length': 5 })).toBe(
      String.raw`$\frac{1}{2}$ · mitad 2.5 cm; área 25.000 cm²`,
    );
  });

  it('renames identifiers inside embedded calculations through the expression AST', () => {
    expect(renameDiagramTemplateIdentifiers(
      'Longitud {= segAB.length / 2 | precision: 2 | unit: "cm"}',
      'segAB',
      'ladoBase',
    )).toBe('Longitud {= ladoBase.length / 2 | precision: 2 | unit: "cm"}');
  });

  it('evaluates embedded calculations inside conditional text variants', () => {
    const parsed = parseDiagramSpecV2(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const item = {
      ...parsed.data.elements[0],
      properties: {
        ...parsed.data.elements[0].properties,
        textRules: [{ when: 'gt(pA.x, 0)', text: 'Doble: {= pA.x * 2 | precision: 1 | unit: "cm"}' }],
      },
    };
    expect(reactiveText(item, { pA: { X: () => 2, Y: () => 0 } }, parsed.data)).toBe('Doble: 4.0 cm');
  });

  it('renders configured equalities deterministically instead of guessing from adjacent text', () => {
    const parsed = parseDiagramSpecV2(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const template = parsed.data.elements[0];
    const left = { ...template, id: 'measureAB', label: 'AB', kind: 'dimensionLine' as const };
    const right = { ...template, id: 'measureCD', label: 'CD', kind: 'dimensionLine' as const };
    const spec = {
      ...parsed.data,
      elements: [...parsed.data.elements, left, right],
      header: {
        readingsMode: 'custom' as const,
        readings: [{ id: 'equal-sides', sourceIds: [left.id, right.id], presentation: 'equality' as const }],
      },
    };
    const readings = compactHeaderReadings([
      { item: left, text: 'AB = 4.00 cm' },
      { item: right, text: 'CD = 3.99 cm' },
    ], spec);
    expect(readings).toEqual([{
      id: 'equal-sides',
      itemIds: ['measureAB', 'measureCD'],
      text: 'AB = CD = 4.00 cm',
      visibility: 'all',
    }]);
  });
});
