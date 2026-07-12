import { describe, it, expect } from 'vitest';
import { initialDiagramState, diagramReducer } from '../../../../src/features/editor/diagrams/state/reducer';
import type { DiagramState } from '../../../../src/features/editor/diagrams/state/types';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model/commands';

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
});
