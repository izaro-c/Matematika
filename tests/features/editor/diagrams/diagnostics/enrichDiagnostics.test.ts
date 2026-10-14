import { describe, expect, it } from 'vitest';
import {
  enrichDiagramDiagnostics,
  summarizeDiagnostics,
  formatDiagnosticTabDetail,
  fieldErrorsForObject,
} from '../../../../../src/fixed-pages/editor/diagrams/checks';
import { parseDiagnosticPath } from '../../../../../src/fixed-pages/editor/diagrams/checks/locationParsing';
import { resolveObjectId } from '../../../../../src/fixed-pages/editor/diagrams/checks/locationResolution';
import type { DiagramDiagnostic } from '../../../../../src/fixed-pages/editor/diagrams/source/generator';
import { createTemplateModel, isModelElement, modelPoints } from '../../../../../src/fixed-pages/editor/diagrams/model';

describe('enrichDiagramDiagnostics', () => {
  const model = createTemplateModel('triangulo', 'Triángulo', 'definicion');
  const elementIndex = model.objects.findIndex(isModelElement);
  const elementId = model.objects[elementIndex].id;
  const pointIndex = model.objects.findIndex(object => object.id === modelPoints(model)[0].id);

  it('parses Zod paths into object locations', () => {
    const parsed = parseDiagnosticPath(['objects', elementIndex, 'geometry', 'points']);
    expect(parsed.collection).toBe('objects');
    expect(parsed.index).toBe(elementIndex);
    expect(parsed.field).toBe('geometry.points');
    expect(resolveObjectId(model, parsed)).toBe(elementId);
  });

  it('enriches atomic diagnostics with title, hint and navigation target', () => {
    const diagnostics: DiagramDiagnostic[] = [{
      code: 'invalid-diagram-spec-v3',
      severity: 'error',
      message: 'Required',
      source: 'model',
      path: ['objects', elementIndex, 'geometry', 'points'],
    }];

    const enriched = enrichDiagramDiagnostics(diagnostics, model);
    expect(enriched).toHaveLength(1);
    expect(enriched[0].title).toBeTruthy();
    expect(enriched[0].hint).toMatch(/inspector/i);
    expect(enriched[0].location.objectId).toBe(elementId);
    expect(enriched[0].location.inspectorSection).toBe('geometry');
    expect(enriched[0].location.fieldKey).toBe('refs');
    expect(enriched[0].location.leftPanel).toBe('objects');
    expect(enriched[0].location.workspace).toBe('build');
  });

  it('splits legacy multiline diagnostic strings', () => {
    const diagnostics: DiagramDiagnostic[] = [{
      code: 'invalid-diagram-spec-v3',
      severity: 'warning',
      message: 'objects.0.geometry: Error uno. objects.1.geometry: Error dos.',
      source: 'model',
    }];

    const enriched = enrichDiagramDiagnostics(diagnostics, model);
    expect(enriched).toHaveLength(2);
    expect(summarizeDiagnostics(enriched).warningCount).toBe(2);
  });

  it('formats tab detail prioritizing errors over warnings', () => {
    const summary = summarizeDiagnostics([
      {
        id: 'a',
        severity: 'error',
        code: 'x',
        title: 'Error',
        message: 'm',
        hint: 'h',
        location: { workspace: 'build' },
      },
      {
        id: 'b',
        severity: 'warning',
        code: 'y',
        title: 'Aviso',
        message: 'm',
        hint: 'h',
        location: { workspace: 'build' },
      },
    ]);
    expect(formatDiagnosticTabDetail(summary)).toBe('1 error');
    expect(summary.objectIdsWithErrors).toEqual([]);
  });

  it('maps field errors for the selected object', () => {
    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v3',
      severity: 'error',
      message: 'Required',
      source: 'model',
      path: ['objects', elementIndex, 'geometry', 'points'],
    }], model);

    const fieldErrors = fieldErrorsForObject(enriched, elementId);
    expect(fieldErrors.get('refs')).toBeTruthy();
  });

  it('routes derived-point object-level errors to geometry expressions', () => {
    const base = createTemplateModel('triangulo', 'Derivado', 'definicion');
    const derived = {
      ...modelPoints(base)[0],
      id: 'pDeriv',
      label: 'P',
      definition: { type: 'expression' as const, x: '', y: '', fallback: [0, 0] as [number, number] },
    };
    const modelWithDerived = {
      ...base,
      objects: [...base.objects, derived],
    };
    const derivedIndex = modelWithDerived.objects.length - 1;

    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v3',
      severity: 'error',
      message: `El punto derivado ${derived.id} necesita expresiones x/y y dependencias explícitas.`,
      source: 'model',
      path: ['objects', derivedIndex],
    }], modelWithDerived);

    expect(enriched).toHaveLength(1);
    expect(enriched[0].location.objectId).toBe('pDeriv');
    expect(enriched[0].location.inspectorSection).toBe('geometry');
    expect(enriched[0].location.fieldKey).toBe('xExpression');
  });

  it('routes explicit xExpression paths to geometry', () => {
    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v3',
      severity: 'error',
      message: 'El punto derivado A necesita una expresión x.',
      source: 'model',
      path: ['objects', pointIndex, 'definition', 'x'],
    }], model);

    expect(enriched[0].location.inspectorSection).toBe('geometry');
    expect(enriched[0].location.fieldKey).toBe('xExpression');
  });

  it('routes dependencies paths to geometry', () => {
    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v3',
      severity: 'error',
      message: 'El punto derivado A necesita dependencias explícitas.',
      source: 'model',
      path: ['objects', pointIndex, 'dependencies'],
    }], model);

    expect(enriched[0].location.inspectorSection).toBe('geometry');
    expect(enriched[0].location.fieldKey).toBe('dependencies');
  });
});
