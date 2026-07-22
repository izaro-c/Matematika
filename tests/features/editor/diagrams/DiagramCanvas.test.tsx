import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiagramCanvas } from '../../../../src/features/editor/diagrams/ui/DiagramCanvas';
import {
  KIND_LABELS,
  addToolReference,
  createTemplateModel,
  defaultElementProperties,
  element,
  elementColorForKind,
  generatedElementId,
  point,
  refsForKind,
  step,
  toolReferencesAreReady,
} from '../../../../src/features/editor/diagrams/model';
import type { CanvasTool, ElementKind, VisualDiagramModel } from '../../../../src/features/editor/diagrams/model/types';

const rendererState = vi.hoisted(() => ({
  props: null as Record<string, unknown> | null,
}));

vi.mock('@/shared/diagrams/public', async importOriginal => {
  const actual = await importOriginal<typeof import('@/shared/diagrams/public')>();
  return {
    ...actual,
    DiagramRenderer: (props: Record<string, unknown>) => {
      rendererState.props = props;
      return (
        <div data-testid="mock-diagram-renderer">
          <button
            type="button"
            data-testid="trigger-create-point"
            onClick={() => (props.onCanvasPointCreate as ((x: number, y: number) => void) | undefined)?.(1.37, 2.63)}
          >
            Crear punto
          </button>
          <button
            type="button"
            data-testid="trigger-select"
            onClick={() => (props.onSelectionChange as ((id: string) => void) | undefined)?.('pB')}
          >
            Seleccionar pB
          </button>
          <button
            type="button"
            data-testid="trigger-select-pA"
            onClick={() => (props.onSelectionChange as ((id: string) => void) | undefined)?.('pA')}
          >
            Seleccionar pA
          </button>
          <button
            type="button"
            data-testid="trigger-select-pC"
            onClick={() => (props.onSelectionChange as ((id: string) => void) | undefined)?.('pC')}
          >
            Seleccionar pC
          </button>
          <button
            type="button"
            data-testid="trigger-select-segment"
            onClick={() => (props.onSelectionChange as ((id: string) => void) | undefined)?.('segAB')}
          >
            Seleccionar segAB
          </button>
          <button
            type="button"
            data-testid="trigger-annotation-move"
            onClick={() => (props.onAnnotationMove as ((id: string, placement: { textOffset: [number, number] }) => void) | undefined)?.(
              'labelA',
              { textOffset: [0.12, -0.08] },
            )}
          >
            Mover anotación
          </button>
        </div>
      );
    },
  };
});

function modelWithSteps(): VisualDiagramModel {
  const base = createTemplateModel('lienzo-inicial', 'Canvas test', 'definicion');
  return {
    ...base,
    points: [
      point('pA', 'A', -2, -1),
      point('pB', 'B', 2, -0.6),
      point('pC', 'C', 0, 2.2),
    ],
    elements: [],
    steps: [
      step('step1', 'Paso 1', 'Primer paso', ['pA', 'pB', 'pC']),
      step('step2', 'Paso 2', 'Segundo paso', ['pA']),
    ],
  };
}

function makeVisibleInEveryStep(candidate: VisualDiagramModel, objectId: string): VisualDiagramModel {
  return {
    ...candidate,
    steps: candidate.steps.map(item => ({
      ...item,
      visibleTargets: item.visibleTargets.includes(objectId) ? item.visibleTargets : [...item.visibleTargets, objectId],
      objectStates: item.objectStates?.[objectId]
        ? { ...item.objectStates, [objectId]: { ...item.objectStates[objectId], visible: true } }
        : item.objectStates,
    })),
  };
}

function appendDiagramElement(model: VisualDiagramModel, kind: ElementKind, explicitRefs: string[]): { model: VisualDiagramModel; id: string } {
  const elementRefs = refsForKind(kind, explicitRefs);
  const id = generatedElementId(kind, elementRefs, model.elements);
  const properties = defaultElementProperties(kind);
  const baseElement = element(
    id,
    KIND_LABELS[kind],
    kind,
    elementRefs,
    elementColorForKind(kind),
    kind !== 'label',
    properties ? { properties } : {},
  );
  const nextElement = {
    ...baseElement,
    order: Math.max(0, ...[...model.points, ...model.elements].filter(item => item.layerId === baseElement.layerId).map(item => item.order)) + 1000,
  };
  const nextModel = makeVisibleInEveryStep({
    ...model,
    elements: [...model.elements, nextElement],
    dependencies: [
      ...(model.dependencies || []),
      ...elementRefs.map(sourceId => ({ sourceId, targetId: id, relation: 'construction' as const })),
    ],
  }, id);
  return { model: nextModel, id };
}

function chooseToolReference({
  tool,
  pendingRefs,
  referenceId,
  model,
  setModel,
  setPendingRefs,
  setSelectedId,
}: {
  tool: CanvasTool;
  pendingRefs: string[];
  referenceId: string;
  model: VisualDiagramModel;
  setModel: (model: VisualDiagramModel) => void;
  setPendingRefs: (refs: string[]) => void;
  setSelectedId: (id: string) => void;
}): boolean {
  if (tool === 'select' || tool === 'point') return false;
  const nextRefs = addToolReference(tool, pendingRefs, referenceId);
  if (tool !== 'polygon' && nextRefs.every(Boolean) && toolReferencesAreReady(tool, nextRefs)) {
    const result = appendDiagramElement(model, tool, nextRefs);
    setModel(result.model);
    setPendingRefs([]);
    setSelectedId(result.id);
  } else {
    setPendingRefs(nextRefs);
    setSelectedId(referenceId);
  }
  return true;
}

function renderCanvas(overrides: Partial<React.ComponentProps<typeof DiagramCanvas>> = {}) {
  const model = overrides.model ?? modelWithSteps();
  const onModelEdit = overrides.onModelEdit ?? vi.fn();
  const onSelect = overrides.onSelect ?? vi.fn();
  const onChooseReferenceForTool = overrides.onChooseReferenceForTool ?? vi.fn(() => true);
  const onCompleteTool = overrides.onCompleteTool ?? vi.fn();

  render(
    <DiagramCanvas
      model={model}
      selectedId={overrides.selectedId ?? ''}
      canvasTool={overrides.canvasTool ?? 'select'}
      pendingRefs={overrides.pendingRefs ?? []}
      previewHighlightId={overrides.previewHighlightId ?? ''}
      previewStepId={overrides.previewStepId ?? ''}
      onSelect={onSelect}
      onModelEdit={onModelEdit}
      onChooseReferenceForTool={onChooseReferenceForTool}
      onCompleteTool={onCompleteTool}
    />,
  );

  return { model, onModelEdit, onSelect, onChooseReferenceForTool, onCompleteTool };
}

describe('DiagramCanvas', () => {
  it('snaps canvas point creation to half-unit grid and reveals the new point in every step', () => {
    const { onModelEdit, onSelect, onCompleteTool } = renderCanvas({ canvasTool: 'point' });

    fireEvent.click(screen.getByTestId('trigger-create-point'));

    expect(onModelEdit).toHaveBeenCalledTimes(1);
    const [nextModel, command] = onModelEdit.mock.calls[0];
    const created = nextModel.points.find((item: { id: string }) => item.id === 'pD');
    expect(created).toMatchObject({ x: 1.5, y: 2.5, label: 'D' });
    expect(nextModel.steps).toEqual([
      expect.objectContaining({ id: 'step1', visibleTargets: expect.arrayContaining(['pD']) }),
      expect.objectContaining({ id: 'step2', visibleTargets: expect.arrayContaining(['pD']) }),
    ]);
    expect(command).toEqual({ label: 'Añadir punto pD' });
    expect(onSelect).toHaveBeenCalledWith('pD');
    expect(onCompleteTool).toHaveBeenCalledTimes(1);
    expect(rendererState.props?.onCanvasPointCreate).toBeTypeOf('function');
  });

  it('does not expose onCanvasPointCreate when the active tool is not point', () => {
    renderCanvas({ canvasTool: 'segment' });
    expect(rendererState.props?.onCanvasPointCreate).toBeUndefined();
  });

  it('completes a segment after two vertex references chosen through the canvas', () => {
    let currentModel = modelWithSteps();
    const pending: string[] = [];
    let selectedId = '';

    render(
      <DiagramCanvas
        model={currentModel}
        selectedId={selectedId}
        canvasTool="segment"
        pendingRefs={pending}
        previewHighlightId=""
        previewStepId=""
        onSelect={id => { selectedId = id; }}
        onModelEdit={next => { currentModel = next; }}
        onChooseReferenceForTool={referenceId => chooseToolReference({
          tool: 'segment',
          pendingRefs: pending,
          referenceId,
          model: currentModel,
          setModel: next => { currentModel = next; },
          setPendingRefs: next => {
            pending.splice(0, pending.length, ...next);
          },
          setSelectedId: id => { selectedId = id; },
        })}
        onCompleteTool={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('trigger-select-pA'));
    expect(pending).toEqual(['pA', '']);
    expect(selectedId).toBe('pA');
    expect(currentModel.elements.filter(item => item.kind === 'segment' && item.refs.join() === 'pA,pB')).toHaveLength(0);

    fireEvent.click(screen.getByTestId('trigger-select'));
    expect(pending).toEqual([]);
    const segment = currentModel.elements.find(item => item.kind === 'segment' && item.refs.join() === 'pA,pB');
    expect(segment).toBeTruthy();
    expect(selectedId).toBe('pB');
  });

  it('accumulates polygon vertices through the canvas until the contour is ready', () => {
    let currentModel = modelWithSteps();
    const pending: string[] = [];

    render(
      <DiagramCanvas
        model={currentModel}
        selectedId=""
        canvasTool="polygon"
        pendingRefs={pending}
        previewHighlightId=""
        previewStepId=""
        onSelect={vi.fn()}
        onModelEdit={next => { currentModel = next; }}
        onChooseReferenceForTool={referenceId => chooseToolReference({
          tool: 'polygon',
          pendingRefs: pending,
          referenceId,
          model: currentModel,
          setModel: next => { currentModel = next; },
          setPendingRefs: next => {
            pending.splice(0, pending.length, ...next);
          },
          setSelectedId: () => {},
        })}
        onCompleteTool={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('trigger-select-pA'));
    expect(pending).toEqual(['pA', '', '']);
    expect(currentModel.elements.filter(item => item.kind === 'polygon')).toHaveLength(0);

    fireEvent.click(screen.getByTestId('trigger-select'));
    expect(pending).toEqual(['pA', 'pB', '']);
    expect(currentModel.elements.filter(item => item.kind === 'polygon')).toHaveLength(0);

    fireEvent.click(screen.getByTestId('trigger-select-pC'));
    expect(pending).toEqual(['pA', 'pB', 'pC']);
    expect(toolReferencesAreReady('polygon', pending)).toBe(true);
    expect(currentModel.elements.filter(item => item.kind === 'polygon')).toHaveLength(0);
  });

  it('routes valid reference selections through onChooseReferenceForTool for segment and polygon tools', () => {
    const onChooseReferenceForTool = vi.fn(() => true);
    const { rerender } = render(
      <DiagramCanvas
        model={modelWithSteps()}
        selectedId=""
        canvasTool="segment"
        pendingRefs={[]}
        previewHighlightId=""
        previewStepId=""
        onSelect={vi.fn()}
        onModelEdit={vi.fn()}
        onChooseReferenceForTool={onChooseReferenceForTool}
        onCompleteTool={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('trigger-select-pA'));
    expect(onChooseReferenceForTool).toHaveBeenCalledWith('pA');
    onChooseReferenceForTool.mockClear();

    fireEvent.click(screen.getByTestId('trigger-select-segment'));
    expect(onChooseReferenceForTool).not.toHaveBeenCalled();

    rerender(
      <DiagramCanvas
        model={modelWithSteps()}
        selectedId=""
        canvasTool="polygon"
        pendingRefs={['pA']}
        previewHighlightId=""
        previewStepId=""
        onSelect={vi.fn()}
        onModelEdit={vi.fn()}
        onChooseReferenceForTool={onChooseReferenceForTool}
        onCompleteTool={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByTestId('trigger-select'));
    expect(onChooseReferenceForTool).toHaveBeenCalledWith('pB');
  });

  it('persists annotation textOffset edits through onModelEdit', () => {
    const base = createTemplateModel('lienzo-inicial', 'Anotación', 'definicion');
    const model: VisualDiagramModel = {
      ...base,
      elements: [
        element('labelA', 'Etiqueta A', 'label', ['pA'], 'carbon', true, {
          style: { textOffset: [0, 0] as [number, number], preserveColorOnHighlight: true },
        }),
      ],
    };
    const { onModelEdit } = renderCanvas({ model, canvasTool: 'select' });

    fireEvent.click(screen.getByTestId('trigger-annotation-move'));

    expect(onModelEdit).toHaveBeenCalledTimes(1);
    const [nextModel, command] = onModelEdit.mock.calls[0];
    const label = nextModel.elements.find((item: { id: string }) => item.id === 'labelA');
    expect(label?.style?.textOffset).toEqual([0.12, -0.08]);
    expect(command).toEqual({ label: 'Mover labelA', mergeKey: 'annotation:labelA' });
  });
});
