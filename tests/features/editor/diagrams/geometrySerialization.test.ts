import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import pointsFixture from '../../../fixtures/diagrams/points-constraints.json';
import annotationsFixture from '../../../fixtures/diagrams/annotations-layers.json';
import marksFixture from '../../../fixtures/diagrams/marks-angles.json';
import primitivesFixture from '../../../fixtures/diagrams/euclidean-primitives.json';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { generateDiagramSource } from '../../../../src/fixed-pages/editor/diagrams/source/generator';
import {
  convertAngleKind,
  element as constructionElement,
  modelElements,
  modelPoints,
  point,
  relationDraft,
  setEqualAngleConstraint,
  setSegmentCongruenceMark,
  toEditorModel,
} from '../../../../src/fixed-pages/editor/diagrams/model';
import type { VisualDiagramModel } from '../../../../src/fixed-pages/editor/diagrams/model/types';
import { objectKind, objectStyle, omitKeys, type AngleObject, type DiagramObject } from '../../../../src/diagrams';
import { findById } from '../../../helpers/diagramSpec';

function asModel(value: unknown): VisualDiagramModel {
  const model = toEditorModel(value);
  if (!model) throw new Error('fixture inválido');
  return model;
}

/** El modelo del editor es la propia especificación V3: se compara tal cual. */
function withoutDerivedGraph(model: VisualDiagramModel) {
  return model;
}

function mapObject(model: VisualDiagramModel, id: string, update: (object: DiagramObject) => DiagramObject): VisualDiagramModel {
  return { ...model, objects: model.objects.map(object => object.id === id ? update(object) : object) };
}

describe('Diagram source serialization', () => {
  it.each([
    ['constraints', pointsFixture, 'GeometryConstraints'],
    ['reactive annotations', annotationsFixture, 'GeometryAnnotations'],
    ['angular marks', marksFixture, 'GeometryAngles'],
  ] as const)('roundtrips %s through the production TSX adapter', (_family, fixture, componentName) => {
    const model = asModel(fixture);
    const generated = generateDiagramSource(model, componentName);
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(withoutDerivedGraph(parsed.model)).toEqual(withoutDerivedGraph(model));
    const regenerated = generateDiagramSource(parsed.model, componentName);
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('roundtrips an in-place angular type conversion byte for byte', () => {
    const base = asModel(marksFixture);
    const converted = convertAngleKind(base, 'angleAVB', 'nonReflexAngle');
    const generated = generateDiagramSource(converted, 'ConvertedAngle');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;

    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(withoutDerivedGraph(parsed.model)).toEqual(withoutDerivedGraph(converted));
    expect(objectKind(findById(parsed.model, 'angleAVB'))).toBe('nonReflexAngle');
    const regenerated = generateDiagramSource(parsed.model, 'ConvertedAngle');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('blocks unsafe expressions before source generation and reports their schema path', () => {
    const model = asModel(annotationsFixture);
    const unsafe = mapObject(model, 'formulaA', object => object.objectType === 'annotation'
      ? { ...object, content: { ...object.content, expression: 'window.location.href' } }
      : object);
    const generated = generateDiagramSource(unsafe, 'UnsafeFormula');
    expect(generated.ok).toBe(false);
    if (generated.ok) return;
    expect(generated.diagnostics[0].path?.[0]).toMatch(/^(elements|objects)$/);
  });

  it('roundtrips viewport-relative information panel positions', () => {
    const model = asModel(annotationsFixture);
    const positioned = mapObject(model, 'panelA', object => object.objectType === 'annotation'
      ? { ...object, anchor: { type: 'viewport', position: [0.12, 0.18] } }
      : object);
    const generated = generateDiagramSource(positioned, 'ViewportPanel');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status === 'visual-exact') expect(withoutDerivedGraph(parsed.model)).toEqual(withoutDerivedGraph(positioned));
  });

  it('roundtrips composite panel blocks and their conditional values byte for byte', () => {
    const base = asModel(annotationsFixture);
    const composed = mapObject(base, 'panelA', object => object.objectType === 'annotation'
        ? {
            ...object,
            content: {
              ...object.content,
              layout: 'columns' as const,
              blocks: [
                { id: 'x-reading', title: 'Coordenada x', text: 'x = {value}', expression: 'pA.x', precision: 3 },
                { id: 'sign-reading', title: 'Signo', text: 'No positivo', rules: [{ when: 'gt(pA.x,0)', text: 'Positivo: {value}', expression: 'pA.x', unit: 'u', precision: 1 }] },
              ],
            },
          }
        : object);
    const generated = generateDiagramSource(composed, 'CompositePanel');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(withoutDerivedGraph(parsed.model)).toEqual(withoutDerivedGraph(composed));
    expect(generateDiagramSource(parsed.model, 'CompositePanel')).toMatchObject({ ok: true, source: generated.source });
  });

  it('roundtrips an explicit, ordered header equality byte for byte', () => {
    const base = asModel(annotationsFixture);
    const firstPanel = findById(base, 'panelA');
    const panelWithoutTarget = omitKeys(firstPanel, 'targetId');
    const secondPanel = { ...panelWithoutTarget, id: 'panelB', label: 'Segunda medida', order: firstPanel.order + 1, groupIds: [], target: false } as DiagramObject;
    const model = {
      ...base,
      objects: [...base.objects, secondPanel],
      header: {
        readingsMode: 'custom' as const,
        readings: [{
          id: 'same-measure',
          sourceIds: ['panelA', 'panelB'],
          presentation: 'equality' as const,
          label: 'AB = CD',
        }],
      },
    };
    const generated = generateDiagramSource(model, 'ExplicitHeaderEquality');
    expect(generated.ok, generated.ok ? '' : JSON.stringify(generated.diagnostics)).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(parsed.model.header).toEqual(model.header);
    expect(generateDiagramSource(parsed.model, 'ExplicitHeaderEquality')).toMatchObject({ ok: true, source: generated.source });
  });

  it('roundtrips the independent highlightability option exactly', () => {
    const base = asModel(primitivesFixture);
    const target = modelElements(base)[0];
    const model = mapObject(base, target.id, object => ({ ...object, selection: { ...object.selection, highlightable: false } }));
    const generated = generateDiagramSource(model, 'NonHighlightableElement');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(findById(parsed.model, target.id).selection).toMatchObject({ selectable: true, highlightable: false });
    const regenerated = generateDiagramSource(parsed.model, 'NonHighlightableElement');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('adds per-element label visibility without reordering canonical point fields', () => {
    const base = asModel(primitivesFixture);
    const first = modelElements(base)[0];
    const model = mapObject(base, first.id, object => object.objectType === 'path' ? { ...object, appearance: { ...object.appearance, labelVisible: false } } : object);
    const generated = generateDiagramSource(model, 'ElementLabelVisibility');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    expect(generated.source.indexOf('"y":')).toBeLessThan(generated.source.indexOf('"labelVisible":'));
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status === 'visual-exact') expect(findById(parsed.model, first.id)).toMatchObject({ appearance: { labelVisible: false } });
  });

  it('roundtrips additive MDX highlighting exactly', () => {
    const base = asModel(primitivesFixture);
    const target = modelElements(base)[0];
    const model = mapObject(base, target.id, object => ({ ...object, selection: { ...object.selection, dimOthersOnHighlight: false } }));
    const generated = generateDiagramSource(model, 'AdditiveHighlightElement');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(findById(parsed.model, target.id).selection.dimOthersOnHighlight).toBe(false);
    const regenerated = generateDiagramSource(parsed.model, 'AdditiveHighlightElement');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('roundtrips an editable intersection and its finite-support policy', () => {
    const base = asModel(primitivesFixture);
    const line = constructionElement('lineOC', 'Recta OC', 'line', ['pO', 'pC'], 'pavo', false);
    const intersection = { ...constructionElement('intQ', 'Q', 'intersection', ['lineOC', 'segAB'], 'carbon', false), order: 80, locked: true };
    const model = { ...base, objects: [...base.objects, line, intersection] };
    const generated = generateDiagramSource(model, 'EditableIntersection');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(findById(parsed.model, 'intQ')).toMatchObject({
      objectType: 'point',
      definition: { type: 'intersection', supports: ['lineOC', 'segAB'], restrictToSupports: true },
    });
    const regenerated = generateDiagramSource(parsed.model, 'EditableIntersection');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('roundtrips congruence marks added from the segment inspector byte for byte', () => {
    const base = asModel(primitivesFixture);
    const model = setSegmentCongruenceMark(base, 'segAB', 2);
    const generated = generateDiagramSource(model, 'SegmentCongruenceMarks');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(withoutDerivedGraph(parsed.model)).toEqual(withoutDerivedGraph(model));
    const regenerated = generateDiagramSource(parsed.model, 'SegmentCongruenceMarks');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('roundtrips the equal-length relation authored in Congruence1 byte for byte', () => {
    const source = readFileSync('content/diagrams/Axiomas/Congruence1.tsx', 'utf8');
    const parsed = parseDiagramSourceAST(source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(parsed.model.relations.map(relation => relationDraft(relation, parsed.model.objects))).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'equalLength', refs: ['pD', 'pC', 'segAB'] }),
    ]));
    const regenerated = generateDiagramSource(parsed.model, 'Congruence1');
    expect(regenerated.ok && regenerated.source).toBe(source);
  });

  it('reopens Congruence4 with its equal-angle relation as visual-exact', () => {
    const source = readFileSync('content/diagrams/Axiomas/Congruence4.tsx', 'utf8');
    const parsed = parseDiagramSourceAST(source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(parsed.model.relations.map(relation => relationDraft(relation, parsed.model.objects))).toEqual(expect.arrayContaining([
      expect.objectContaining({
        kind: 'equalAngle',
        refs: ['pBB', 'pOO', 'pAA', 'nonReflexAngleAOB', 'nonReflexAngleAAOOBB'],
      }),
    ]));
    const regenerated = generateDiagramSource(parsed.model, 'Congruence4');
    expect(regenerated.ok && regenerated.source).toBe(source);
  });

  it('roundtrips an equal-angle relation authored from the angle inspector byte for byte', () => {
    const base = asModel(marksFixture);
    const pointTemplate = modelPoints(base)[0];
    const angleTemplate = base.objects.find((object): object is AngleObject => objectKind(object) === 'nonReflexAngle')!;
    const model = setEqualAngleConstraint({
      ...base,
      objects: [
        ...base.objects,
        { ...pointTemplate, ...point('pC', 'C', 5, 0), order: 3 },
        { ...pointTemplate, ...point('pW', 'W', 4, 0, true), locked: true, order: 4 },
        { ...pointTemplate, ...point('pD', 'D', 4.5, Math.sqrt(3) / 2), order: 5 },
        { ...angleTemplate, id: 'angleCWD', label: 'Ángulo CWD', points: ['pC', 'pW', 'pD'], order: 20 },
      ],
    }, 'nonReflexAngleAVB', 'pA', 'angleCWD');

    const generated = generateDiagramSource(model, 'EqualAngles');
    expect(generated.ok).toBe(true);
    if (!generated.ok) return;
    const parsed = parseDiagramSourceAST(generated.source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    expect(withoutDerivedGraph(parsed.model)).toEqual(withoutDerivedGraph(model));
    const regenerated = generateDiagramSource(parsed.model, 'EqualAngles');
    expect(regenerated.ok && regenerated.source).toBe(generated.source);
  });

  it('reopens Congruence2 with independent ruler spacing and height controls', () => {
    const source = readFileSync('content/diagrams/Axiomas/Congruence2.tsx', 'utf8');
    const parsed = parseDiagramSourceAST(source);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    const measureTicks = parsed.model.objects.filter(object => object.objectType === 'mark' && object.variant === 'graduation');
    expect(measureTicks).toHaveLength(3);
    expect(measureTicks.every(object => object.objectType === 'mark' && (object.spacing ?? 0) > 0)).toBe(true);
    expect(measureTicks.every(object => (objectStyle(object)?.markHeight ?? 0) > 0)).toBe(true);
    const regenerated = generateDiagramSource(parsed.model, 'Congruence2');
    expect(regenerated.ok && regenerated.source).toBe(source);
  });
});
