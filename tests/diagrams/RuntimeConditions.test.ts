import { describe, expect, it, vi } from 'vitest';
import fixture from '../fixtures/diagrams/diagram-spec.json';
import {
  diagramTemplateExpressions,
  interpolateDiagramTemplate,
  parseDiagramSpecV3,
  renameDiagramTemplateIdentifiers,
} from '@/diagrams/public';
import { element, slider } from '@/fixed-pages/editor/diagrams/model';
import { conditionAllows, measurementText, reactiveText } from '@/diagrams/render/diagramRuntimeUtils';
import { compactHeaderReadings } from '@/diagrams/render/DiagramKatexOverlay';

describe('diagram runtime diagnostics and conditions', () => {
  it('applies visibleWhen against live scene variables', () => {
    const parsed = parseDiagramSpecV3(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const item = { ...parsed.data.objects.find(object => object.id === 'segAB')!, visibleWhen: 'gt(pA.x, 1)' };
    const elements = {
      pO: { X: () => 0, Y: () => 0 },
      pA: { X: () => 2, Y: () => 0 },
    };
    expect(conditionAllows(item, elements, parsed.data)).toBe(true);
    elements.pA.X = () => 0.5;
    expect(conditionAllows(item, elements, parsed.data)).toBe(false);
  });

  it('applies the shared visibleWhen property to points and sliders', () => {
    const parsed = parseDiagramSpecV3(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const elements = {
      pO: { X: () => 0, Y: () => 0 },
      pA: { X: () => 2, Y: () => 0 },
    };
    const point = { ...parsed.data.objects[0], visibleWhen: 'gt(pA.x, 1)' };
    const control = { ...slider('k', 'k', 0, 0, 1), visibleWhen: 'lt(pA.x, 3)' };

    expect(conditionAllows(point, elements, parsed.data)).toBe(true);
    expect(conditionAllows(control, elements, parsed.data)).toBe(true);
    elements.pA.X = () => 4;
    expect(conditionAllows(point, elements, parsed.data)).toBe(true);
    expect(conditionAllows(control, elements, parsed.data)).toBe(false);
  });

  it('keeps transient expression failures quiet while the scene is being constructed', () => {
    const parsed = parseDiagramSpecV3(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const item = element('note', 'Nota', 'text', ['pA'], 'carbon', true, { text: 'Valor: {missing.x}' });
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
    const parsed = parseDiagramSpecV3(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const base = element('note', 'Nota', 'text', ['pA'], 'carbon');
    const item = base.objectType === 'annotation'
      ? { ...base, content: { ...base.content, rules: [{ when: 'gt(pA.x, 0)', text: 'Doble: {= pA.x * 2 | precision: 1 | unit: "cm"}' }] } }
      : base;
    expect(reactiveText(item, { pA: { X: () => 2, Y: () => 0 } }, parsed.data)).toBe('Doble: 4.0 cm');
  });

  it('renders configured equalities conditionally only when values are equal, separating them otherwise', () => {
    const parsed = parseDiagramSpecV3(fixture);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const left = element('measureAB', 'AB', 'dimensionLine', ['pA', 'pB'], 'carbon');
    const right = element('measureCD', 'CD', 'dimensionLine', ['pB', 'pC'], 'carbon');
    const spec = {
      ...parsed.data,
      objects: [...parsed.data.objects, left, right],
      header: {
        readingsMode: 'custom' as const,
        readings: [{ id: 'equal-sides', sourceIds: [left.id, right.id], presentation: 'equality' as const }],
      },
    };

    // Cuando los valores difieren, se desglosan por separado
    const readingsDiff = compactHeaderReadings([
      { item: left, text: 'AB = 4.00 cm' },
      { item: right, text: 'CD = 3.99 cm' },
    ], spec);
    expect(readingsDiff).toEqual([
      {
        id: 'equal-sides-measureAB-0',
        itemIds: ['measureAB'],
        text: 'AB = 4.00 cm',
        visibility: 'any',
      },
      {
        id: 'equal-sides-measureCD-1',
        itemIds: ['measureCD'],
        text: 'CD = 3.99 cm',
        visibility: 'any',
      },
    ]);

    // Cuando los valores coinciden, se combinan en igualdad
    const readingsEqual = compactHeaderReadings([
      { item: left, text: 'AB = 4.00 cm' },
      { item: right, text: 'CD = 4.00 cm' },
    ], spec);
    expect(readingsEqual).toEqual([{
      id: 'equal-sides',
      itemIds: ['measureAB', 'measureCD'],
      text: 'AB = CD = 4.00 cm',
      visibility: 'all',
    }]);
  });
});
