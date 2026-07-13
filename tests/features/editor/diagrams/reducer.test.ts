import { describe, it, expect } from 'vitest';
import { initialDiagramState, diagramReducer } from '../../../../src/features/editor/diagrams/state/reducer';
import type { DiagramState } from '../../../../src/features/editor/diagrams/state/types';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model/commands';
import { getDiagramSaveCapability } from '../../../../src/features/editor/diagrams/model/selectors';

describe('Diagram Reducer', () => {
  it('should return initial state', () => {
    const res = diagramReducer(initialDiagramState, { type: 'SELECT_ELEMENT', id: 'foo' });
    expect(res.selectedId).toBe('foo');
  });

  it('should handle LOAD_DIAGRAM action', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const state = diagramReducer(initialDiagramState, {
      type: 'LOAD_DIAGRAM',
      filePath: 'src/widgets/diagrams/Test.tsx',
      componentName: 'Test',
      source: 'code',
      model,
    });

    expect(state.filePath).toBe('src/widgets/diagrams/Test.tsx');
    expect(state.componentName).toBe('Test');
    expect(state.originalSource).toBe('code');
    expect(state.status).toBe('synced');
    expect(state.currentModel).toEqual(model);
  });

  it('should transition to visual-authoritative on visual edit from synced', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const loadedState = diagramReducer(initialDiagramState, {
      type: 'LOAD_DIAGRAM',
      filePath: 'src/widgets/diagrams/Test.tsx',
      componentName: 'Test',
      source: 'code',
      model,
    });

    const nextModel = { ...model, title: 'Updated' };
    const editedState = diagramReducer(loadedState, {
      type: 'VISUAL_EDIT',
      model: nextModel,
    });

    expect(editedState.status).toBe('visual-authoritative');
    expect(editedState.currentModel?.title).toBe('Updated');
  });

  it('should transition to diverged on visual edit from source-authoritative', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const state: DiagramState = {
      ...initialDiagramState,
      filePath: 'src/widgets/diagrams/Test.tsx',
      componentName: 'Test',
      originalSource: 'code',
      currentSource: 'code_edited',
      originalModel: model,
      currentModel: model,
      status: 'source-authoritative',
    };

    const nextModel = { ...model, title: 'Updated' };
    const editedState = diagramReducer(state, {
      type: 'VISUAL_EDIT',
      model: nextModel,
    });

    expect(editedState.status).toBe('diverged');
  });

  it('should handle explicit resolution actions', () => {
    const model = createTemplateModel('circunferencia', 'Test', 'definicion');
    const divergedState: DiagramState = {
      ...initialDiagramState,
      filePath: 'src/widgets/diagrams/Test.tsx',
      componentName: 'Test',
      originalSource: 'code',
      currentSource: 'code_edited',
      originalModel: model,
      currentModel: model,
      status: 'diverged',
    };

    const resolved = diagramReducer(divergedState, {
      type: 'RESOLVE_TO_VISUAL',
      source: 'resolved_code',
    });

    expect(resolved.status).toBe('visual-authoritative');
    expect(resolved.currentSource).toBe('resolved_code');
  });

  it('covers source edits, parser results, save lifecycle and UI selections', () => {
    const model = createTemplateModel('circunferencia', 'Lifecycle', 'definicion');
    const loadedState = diagramReducer(initialDiagramState, {
      type: 'LOAD_DIAGRAM',
      filePath: 'src/shared/diagrams/Lifecycle.tsx',
      componentName: 'Lifecycle',
      source: 'source',
      model,
      expectedVersion: 'v1',
    });

    expect(diagramReducer(loadedState, { type: 'SOURCE_EDIT', source: 'source changed' }).status)
      .toBe('source-authoritative');
    expect(diagramReducer({ ...loadedState, status: 'visual-authoritative' }, { type: 'SOURCE_EDIT', source: 'source changed' }).status)
      .toBe('diverged');
    expect(diagramReducer({ ...loadedState, status: 'invalid-source' }, { type: 'SOURCE_EDIT', source: 'source changed' }).status)
      .toBe('source-authoritative');

    const selected = diagramReducer(loadedState, { type: 'SELECT_ELEMENT', id: 'pB' });
    expect(selected.selectedId).toBe('pB');
    expect(diagramReducer(selected, { type: 'SET_CANVAS_TOOL', tool: 'segment' }).canvasTool).toBe('segment');
    expect(diagramReducer(selected, { type: 'SET_ACTIVE_STEP', stepId: 'step-1' }).activeStepId).toBe('step-1');
    expect(diagramReducer(selected, { type: 'SET_STATUS', status: 'saving' }).status).toBe('saving');
    expect(diagramReducer(selected, { type: 'SET_DIAGNOSTICS', diagnostics: [{ code: 'i', severity: 'info', message: 'info' }] }).diagnostics)
      .toHaveLength(1);

    const parsed = diagramReducer({ ...loadedState, currentSource: 'source changed' }, {
      type: 'APPLY_PARSED_MODEL',
      model: { ...model, title: 'Parsed' },
      diagnostics: [{ code: 'w', severity: 'warning', message: 'warning' }],
    });
    expect(parsed.status).toBe('source-authoritative');
    expect(parsed.currentModel?.title).toBe('Parsed');

    const parsedSynced = diagramReducer(loadedState, {
      type: 'APPLY_PARSED_MODEL',
      model,
      diagnostics: [],
    });
    expect(parsedSynced.status).toBe('synced');

    expect(diagramReducer(loadedState, {
      type: 'PARSE_CODE_PREVIEW',
      diagnostics: [{ code: 'u', severity: 'warning', message: 'code preview' }],
    }).status).toBe('source-authoritative');
    expect(diagramReducer(loadedState, {
      type: 'PARSE_FAILED',
      diagnostics: [{ code: 'e', severity: 'error', message: 'invalid' }],
    }).status).toBe('invalid-source');

    const sourceResolved = diagramReducer({ ...loadedState, diagnostics: [{ code: 's', severity: 'error', message: 'sync', source: 'synchronization' }] }, {
      type: 'RESOLVE_TO_SOURCE',
      model,
    });
    expect(sourceResolved.status).toBe('source-authoritative');
    expect(sourceResolved.diagnostics).toEqual([]);

    const visualResolved = diagramReducer({
      ...loadedState,
      diagnostics: [
        { code: 's', severity: 'error', message: 'sync', source: 'synchronization' },
        { code: 'm', severity: 'warning', message: 'model', source: 'model' },
      ],
    }, {
      type: 'RESOLVE_TO_VISUAL',
      source: 'visual source',
    });
    expect(visualResolved.diagnostics).toEqual([{ code: 'm', severity: 'warning', message: 'model', source: 'model' }]);

    expect(diagramReducer(loadedState, { type: 'SAVE_START' }).status).toBe('saving');
    const saved = diagramReducer(loadedState, {
      type: 'SAVE_SUCCESS',
      source: 'saved',
      model,
      expectedVersion: 'v2',
    });
    expect(saved.status).toBe('synced');
    expect(saved.expectedVersion).toBe('v2');
    expect(diagramReducer({ ...loadedState, parseStatus: 'code-preview' }, {
      type: 'SAVE_SUCCESS',
      source: 'manual saved',
      model: null,
      expectedVersion: 'v3',
    }).parseStatus).toBe('code-preview');
    expect(diagramReducer(loadedState, { type: 'SAVE_FAILURE', error: 'network' }).status)
      .toBe('visual-authoritative');
    expect(diagramReducer(loadedState, { type: 'SAVE_FAILURE', error: 'conflict', isConflict: true }).status)
      .toBe('conflict');
    expect(diagramReducer(loadedState, { type: 'UNKNOWN' } as never)).toBe(loadedState);
  });

  it('does not treat an invalid TSX source as synced with a default model', () => {
    const originalManualSource = 'export const Broken = () => <MathBoard';
    const state = diagramReducer(initialDiagramState, {
      type: 'LOAD_DIAGRAM',
      filePath: 'src/shared/diagrams/Broken.tsx',
      componentName: 'Broken',
      source: originalManualSource,
      model: null,
      parseStatus: 'invalid',
      diagnostics: [{
        code: 'typescript-syntax-error',
        severity: 'error',
        message: 'Unterminated JSX contents.',
        source: 'source',
      }],
    });

    expect(state.status).toBe('invalid-source');
    expect(state.currentModel).toBeNull();
    expect(state.currentSource).toBe(originalManualSource);
    expect(state.originalSource).toBe(originalManualSource);
  });

  it('keeps code-with-preview TSX source authoritative instead of syncing a partial model', () => {
    const manualSource = [
      "import React from 'react';",
      'export const Bespoke = () => <svg><path d="M0 0 L1 1" /></svg>;',
    ].join('\n');

    const state = diagramReducer(initialDiagramState, {
      type: 'LOAD_DIAGRAM',
      filePath: 'src/shared/diagrams/Bespoke.tsx',
      componentName: 'Bespoke',
      source: manualSource,
      model: null,
      parseStatus: 'code-preview',
      diagnostics: [{
        code: 'code-preview',
        severity: 'warning',
        message: 'The complete source is authoritative.',
        source: 'source',
      }],
    });

    expect(state.status).toBe('source-authoritative');
    expect(state.currentModel).toBeNull();
    expect(state.currentSource).toBe(manualSource);
    expect(getDiagramSaveCapability(state)).toEqual({ allowed: true });
  });

  it('never reuses the previous diagram model when the next source is invalid', () => {
    const previousModel = createTemplateModel('circunferencia', 'Previous', 'definicion');
    const loadedState = diagramReducer(initialDiagramState, {
      type: 'LOAD_DIAGRAM',
      filePath: 'src/shared/diagrams/Previous.tsx',
      componentName: 'Previous',
      source: 'valid source',
      model: previousModel,
    });

    const brokenSource = 'export const Next = () => <MathBoard';
    const nextState = diagramReducer(loadedState, {
      type: 'LOAD_DIAGRAM',
      filePath: 'src/shared/diagrams/Next.tsx',
      componentName: 'Next',
      source: brokenSource,
      model: null,
      parseStatus: 'invalid',
      diagnostics: [{
        code: 'typescript-syntax-error',
        severity: 'error',
        message: 'Unterminated JSX contents.',
        source: 'source',
      }],
    });

    expect(nextState.currentModel).toBeNull();
    expect(nextState.currentModel).not.toBe(previousModel);
    expect(nextState.status).toBe('invalid-source');
  });

  it('preserves a non-convertible manual source byte for byte after visual edits are rejected', () => {
    const model = createTemplateModel('circunferencia', 'Manual', 'definicion');
    const originalManualSource = 'export const Manual = () => <svg data-manual="si" />;\n';
    const state: DiagramState = {
      ...initialDiagramState,
      filePath: 'src/shared/diagrams/Manual.tsx',
      componentName: 'Manual',
      originalSource: originalManualSource,
      currentSource: originalManualSource,
      originalModel: null,
      currentModel: null,
      status: 'source-authoritative',
      diagnostics: [{
        code: 'unsupported-source',
        severity: 'warning',
        message: 'Manual source is not convertible.',
        source: 'source',
      }],
    };

    const editedState = diagramReducer(state, {
      type: 'VISUAL_EDIT',
      model,
    });

    const savedSource = editedState.currentSource;
    expect(savedSource).toBe(originalManualSource);
    expect(editedState.status).toBe('diverged');
    expect(getDiagramSaveCapability(editedState)).toEqual({ allowed: false, reason: 'diverged' });
  });

  it.each([
    ['diverged', 'diverged'],
    ['conflict', 'conflict'],
    ['invalid-source', 'invalid-source'],
  ] as const)('blocks save capability for %s diagram state', (status, reason) => {
    const model = createTemplateModel('circunferencia', 'Unsafe', 'definicion');
    const state: DiagramState = {
      ...initialDiagramState,
      filePath: 'src/shared/diagrams/Unsafe.tsx',
      componentName: 'Unsafe',
      originalSource: 'source',
      currentSource: 'source',
      originalModel: model,
      currentModel: model,
      status,
    };

    expect(getDiagramSaveCapability(state)).toEqual({ allowed: false, reason });
  });

  it('blocks save capability for validation errors, stale revisions and missing authority', () => {
    const model = createTemplateModel('circunferencia', 'Unsafe', 'definicion');
    const withValidationError: DiagramState = {
      ...initialDiagramState,
      filePath: 'src/shared/diagrams/Unsafe.tsx',
      componentName: 'Unsafe',
      originalSource: 'source',
      currentSource: 'source',
      originalModel: model,
      currentModel: model,
      status: 'visual-authoritative',
      diagnostics: [{
        code: 'invalid-reference',
        severity: 'error',
        message: 'Invalid model reference.',
        source: 'model',
      }],
    };
    expect(getDiagramSaveCapability(withValidationError)).toEqual({ allowed: false, reason: 'validation-error' });

    expect(getDiagramSaveCapability({ ...withValidationError, diagnostics: [], filePath: null }))
      .toEqual({ allowed: false, reason: 'missing-authority' });

    expect(getDiagramSaveCapability({
      ...withValidationError,
      diagnostics: [],
      expectedVersion: '',
    })).toEqual({ allowed: false, reason: 'stale-revision' });
  });
});
