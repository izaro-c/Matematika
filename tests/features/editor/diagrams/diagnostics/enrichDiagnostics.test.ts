import { describe, expect, it } from 'vitest';
import {
  enrichDiagramDiagnostics,
  parseDiagnosticPath,
  resolveObjectId,
  summarizeDiagnostics,
  formatDiagnosticTabDetail,
  fieldErrorsForObject,
} from '../../../../../src/features/editor/diagrams/diagnostics/enrichDiagnostics';
import type { DiagramDiagnostic } from '../../../../../src/features/editor/diagrams/source/generator';
import { createTemplateModel } from '../../../../../src/features/editor/diagrams/model';

describe('enrichDiagramDiagnostics', () => {
  const model = createTemplateModel('triangulo', 'Triángulo', 'definicion');

  it('parses Zod paths into object locations', () => {
    const parsed = parseDiagnosticPath(['elements', 0, 'refs']);
    expect(parsed.collection).toBe('elements');
    expect(parsed.index).toBe(0);
    expect(parsed.field).toBe('refs');
    expect(resolveObjectId(model, parsed)).toBe(model.elements[0]?.id);
  });

  it('enriches atomic diagnostics with title, hint and navigation target', () => {
    const elementId = model.elements[0]?.id ?? 'elemento';
    const diagnostics: DiagramDiagnostic[] = [{
      code: 'invalid-diagram-spec-v2',
      severity: 'error',
      message: 'Required',
      source: 'model',
      path: ['elements', 0, 'refs'],
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
      code: 'invalid-diagram-spec-v2',
      severity: 'warning',
      message: 'elements.0.refs: Error uno. elements.1.refs: Error dos.',
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
    const elementId = model.elements[0]?.id ?? 'elemento';
    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v2',
      severity: 'error',
      message: 'Required',
      source: 'model',
      path: ['elements', 0, 'refs'],
    }], model);

    const fieldErrors = fieldErrorsForObject(enriched, elementId);
    expect(fieldErrors.get('refs')).toBeTruthy();
  });

  it('routes derived-point object-level errors to geometry expressions', () => {
    const base = createTemplateModel('triangulo', 'Derivado', 'definicion');
    const derived = {
      ...base.points[0],
      id: 'pDeriv',
      label: 'P',
      constraint: 'derived' as const,
      fixed: true,
      xExpression: undefined,
      yExpression: undefined,
      dependencies: [] as string[],
    };
    const modelWithDerived = {
      ...base,
      points: [...base.points, derived],
    };
    const pointIndex = modelWithDerived.points.length - 1;

    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v2',
      severity: 'error',
      message: `El punto derivado ${derived.id} necesita expresiones x/y y dependencias explícitas.`,
      source: 'model',
      path: ['points', pointIndex],
    }], modelWithDerived);

    expect(enriched).toHaveLength(1);
    expect(enriched[0].location.objectId).toBe('pDeriv');
    expect(enriched[0].location.inspectorSection).toBe('geometry');
    expect(enriched[0].location.fieldKey).toBe('xExpression');
  });

  it('routes explicit xExpression paths to geometry', () => {
    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v2',
      severity: 'error',
      message: 'El punto derivado A necesita una expresión x.',
      source: 'model',
      path: ['points', 0, 'xExpression'],
    }], model);

    expect(enriched[0].location.inspectorSection).toBe('geometry');
    expect(enriched[0].location.fieldKey).toBe('xExpression');
  });

  it('routes dependencies paths to geometry', () => {
    const enriched = enrichDiagramDiagnostics([{
      code: 'invalid-diagram-spec-v2',
      severity: 'error',
      message: 'El punto derivado A necesita dependencias explícitas.',
      source: 'model',
      path: ['points', 0, 'dependencies'],
    }], model);

    expect(enriched[0].location.inspectorSection).toBe('geometry');
    expect(enriched[0].location.fieldKey).toBe('dependencies');
  });
});
