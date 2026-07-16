import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import pointsFixture from '../../../fixtures/diagrams/phase3-points-constraints.json';
import annotationsFixture from '../../../fixtures/diagrams/phase3-annotations-layers.json';
import marksFixture from '../../../fixtures/diagrams/phase3-marks-angles.json';
import primitivesFixture from '../../../fixtures/diagrams/phase3-euclidean-primitives.json';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { migrateDiagramSpec } from '../../../../src/shared/diagrams/public';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';

describe('Phase 3 source serialization', () => {
  it.each([
    ['constraints', pointsFixture, 'Phase3Constraints'],
    ['reactive annotations', annotationsFixture, 'Phase3Annotations'],
    ['angular marks', marksFixture, 'Phase3Angles'],
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

  it('roundtrips viewport-relative information panel positions', () => {
    const model = migrateDiagramSpec(annotationsFixture).spec;
    const positioned = {
      ...model,
      elements: model.elements.map(element => element.id === 'panelA'
        ? { ...element, refs: [], properties: { ...element.properties, anchorMode: 'viewport' as const, viewportPosition: [0.12, 0.18] as [number, number] } }
        : element),
    };
    const generated = generateDiagramSource(positioned, 'ViewportPanel');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status === 'visual-exact') expect(parsed.model).toEqual(positioned);
  });

  it('roundtrips the independent highlightability option exactly', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const target = base.elements[0];
    const model = {
      ...base,
      elements: base.elements.map(element => element.id === target.id
        ? { ...element, selection: { ...element.selection, highlightable: false } }
        : element),
    };
    const generated = generateDiagramSource(model, 'NonHighlightableElement');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(parsed.model.elements.find(item => item.id === target.id)?.selection).toMatchObject({ selectable: true, highlightable: false });
    const regenerated = generateDiagramSource(parsed.model, 'NonHighlightableElement');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('roundtrips additive MDX highlighting exactly', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const target = base.elements[0];
    const model = {
      ...base,
      elements: base.elements.map(element => element.id === target.id
        ? { ...element, selection: { ...element.selection, dimOthersOnHighlight: false } }
        : element),
    };
    const generated = generateDiagramSource(model, 'AdditiveHighlightElement');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(parsed.model.elements.find(item => item.id === target.id)?.selection.dimOthersOnHighlight).toBe(false);
    const regenerated = generateDiagramSource(parsed.model, 'AdditiveHighlightElement');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('roundtrips an editable intersection and its finite-support policy', () => {
    const base = migrateDiagramSpec(primitivesFixture).spec;
    const line = { ...base.elements.find(item => item.id === 'lineBC')!, id: 'lineOC', label: 'Recta OC', refs: ['pO', 'pC'], target: false };
    const intersection = {
      ...base.elements.find(item => item.id === 'segAB')!,
      id: 'intQ', label: 'Q', kind: 'intersection' as const, refs: ['lineOC', 'segAB'], order: 80,
      locked: true, target: false, properties: { restrictToSupports: true },
    };
    const model = { ...base, elements: [...base.elements, line, intersection] };
    const generated = generateDiagramSource(model, 'EditableIntersection');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(parsed.model.elements.find(item => item.id === 'intQ')).toMatchObject({
      kind: 'intersection',
      refs: ['lineOC', 'segAB'],
      properties: { restrictToSupports: true },
    });
    const regenerated = generateDiagramSource(parsed.model, 'EditableIntersection');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('roundtrips the equal-length relation authored in Congruence1 byte for byte', () => {
    const source = readFileSync('src/widgets/diagrams/Axiomas/Congruence1.tsx', 'utf8');
    const parsed = parseDiagramSourceAST(source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(parsed.model.constraints).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'equalLength', refs: ['pD', 'pC', 'segAB'] }),
    ]));
    const regenerated = generateDiagramSource(parsed.model, 'Congruence1');
    expect(regenerated.ok && regenerated.source).toBe(source);
  });
});
