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

  it('keeps unsupported TSX source authoritative instead of syncing a default model', () => {
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
      parseStatus: 'unsupported',
      diagnostics: [{
        code: 'unsupported-source',
        severity: 'warning',
        message: 'No supported visual model could be extracted.',
        source: 'source',
      }],
    });

    expect(state.status).toBe('source-authoritative');
    expect(state.currentModel).toBeNull();
    expect(state.currentSource).toBe(manualSource);
    expect(getDiagramSaveCapability(state)).toEqual({ allowed: false, reason: 'unsupported' });
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
