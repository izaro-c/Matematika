import { describe, expect, it } from 'vitest';
import {
  buildInspectorNavigationIntent,
  enrichDiagramDiagnostics,
} from '../../../../../src/fixed-pages/editor/diagrams/checks';
import { resolveNavigationObjectId } from '../../../../../src/fixed-pages/editor/diagrams/checks/locationResolution';
import { segmentEndpoints } from '../../../../../src/diagrams';
import { createTemplateModel, isModelElement, modelElements } from '../../../../../src/fixed-pages/editor/diagrams/model';
import { relationFor } from '../../../../helpers/diagramSpec';

describe('inspector navigation', () => {
  it('builds a navigation intent with section and field key', () => {
    const model = createTemplateModel('triangulo', 'Triángulo', 'definicion');
    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v3',
      severity: 'error',
      message: 'Required',
      source: 'model',
      path: ['objects', model.objects.findIndex(isModelElement), 'geometry', 'points'],
    }], model)[0];

    const intent = buildInspectorNavigationIntent(enriched, 1);
    expect(intent.section).toBe('geometry');
    expect(intent.fieldKey).toBe('refs');
    expect(intent.objectId).toBe(model.objects.find(isModelElement)?.id);
    expect(intent.leftPanel).toBe('objects');
    expect(intent.revision).toBe(1);
  });

  it('routes segment constraints to the segment element', () => {
    const model = createTemplateModel('triangulo', 'Triángulo', 'definicion');
    const segment = modelElements(model).find(element => element.objectType === 'path' && element.geometry.type === 'segment');
    const endpoints = segment ? segmentEndpoints(segment) : undefined;
    if (!segment || !endpoints) return;

    const [first, second] = endpoints;
    const other = modelElements(model).find(element => element.id !== segment.id && element.objectType === 'path' && element.geometry.type === 'segment');
    if (!other) return;
    const modelWithConstraint = {
      ...model,
      relations: [relationFor('equalLength', 'eq-test', 'Igualar longitud', [first, second, other.id], model.objects)],
    };

    const navigationObjectId = resolveNavigationObjectId(modelWithConstraint, {
      collection: 'relations',
      index: 0,
    });
    expect(navigationObjectId).toBe(segment.id);
  });
});
