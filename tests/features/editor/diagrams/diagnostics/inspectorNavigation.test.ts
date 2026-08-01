import { describe, expect, it } from 'vitest';
import {
  buildInspectorNavigationIntent,
  enrichDiagramDiagnostics,
} from '../../../../../src/fixed-pages/editor/diagrams/diagnostics';
import { resolveNavigationObjectId } from '../../../../../src/fixed-pages/editor/diagrams/diagnostics/locationResolution';
import { createTemplateModel } from '../../../../../src/fixed-pages/editor/diagrams/model';

describe('inspector navigation', () => {
  it('builds a navigation intent with section and field key', () => {
    const model = createTemplateModel('triangulo', 'Triángulo', 'definicion');
    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v2',
      severity: 'error',
      message: 'Required',
      source: 'model',
      path: ['elements', 0, 'refs'],
    }], model)[0];

    const intent = buildInspectorNavigationIntent(enriched, 1);
    expect(intent.section).toBe('geometry');
    expect(intent.fieldKey).toBe('refs');
    expect(intent.objectId).toBe(model.elements[0]?.id);
    expect(intent.leftPanel).toBe('objects');
    expect(intent.revision).toBe(1);
  });

  it('routes segment constraints to the segment element', () => {
    const model = createTemplateModel('triangulo', 'Triángulo', 'definicion');
    const segment = model.elements.find(element => element.kind === 'segment');
    if (!segment || segment.refs.length < 2) return;

    const [first, second] = segment.refs;
    const modelWithConstraint = {
      ...model,
      constraints: [{
        id: 'eq-test',
        label: 'Igualar longitud',
        kind: 'equalLength' as const,
        refs: [first, second, 'otro-segmento'],
        enabled: true,
      }],
    };

    const navigationObjectId = resolveNavigationObjectId(modelWithConstraint, {
      collection: 'constraints',
      index: 0,
    });
    expect(navigationObjectId).toBe(segment.id);
  });
});
