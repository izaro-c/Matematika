import { describe, expect, it } from 'vitest';
import pointsFixture from '../../../fixtures/diagrams/phase3-points-constraints.json';
import annotationsFixture from '../../../fixtures/diagrams/phase3-annotations-layers.json';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { migrateDiagramSpec } from '../../../../src/shared/diagrams/public';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';

describe('Phase 3 source serialization', () => {
  it.each([
    ['constraints', pointsFixture, 'Phase3Constraints'],
    ['reactive annotations', annotationsFixture, 'Phase3Annotations'],
  ] as const)('roundtrips %s through the production TSX adapter', (_family, fixture, componentName) => {
    const model = migrateDiagramSpec(fixture).spec;
    const generated = generateDiagramSource(model, componentName);
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(parsed.model).toEqual(model);
    const regenerated = generateDiagramSource(parsed.model, componentName);
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('blocks unsafe expressions before source generation and reports their schema path', () => {
    const model = migrateDiagramSpec(annotationsFixture).spec;
    const unsafe = {
      ...model,
      elements: model.elements.map(element => element.id === 'formulaA'
        ? { ...element, properties: { ...element.properties, expression: 'window.location.href' } }
        : element),
    };
    const generated = generateDiagramSource(unsafe, 'UnsafeFormula');
    expect(generated.ok).toBe(false);
    if (generated.ok) return;
    expect(generated.diagnostics[0].message).toContain('elements.1.properties.expression');
  });
});
