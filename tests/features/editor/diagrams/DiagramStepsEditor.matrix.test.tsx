import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MathProvider } from '../../../../src/shared/lib/MathStoreContext';
import { DiagramStepsEditor } from '../../../../src/features/editor/diagrams/ui/DiagramStepsEditor';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model';
import { listSceneItemIdsInLayerVisualOrder } from '../../../../src/features/editor/diagrams/model/sceneOrdering';
import {
  matrixCellVisualState,
  nextMatrixCellState,
} from '../../../../src/features/editor/diagrams/ui/stepMatrixUtils';

describe('DiagramStepsEditor matrix UX', () => {
  const model = createTemplateModel('demostracion-pasos', 'Matriz UX', 'demostracion');

  it('uses arrow buttons to reorder steps instead of wide text labels', () => {
    render(
      <MathProvider>
        <DiagramStepsEditor
          model={model}
          activeStepId="step1"
          onActiveStepChange={vi.fn()}
          onModelEdit={vi.fn()}
          onSelectObject={vi.fn()}
        />
      </MathProvider>,
    );
    expect(screen.queryByRole('button', { name: 'Anterior' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Siguiente' })).toBeNull();
    expect(screen.getByRole('button', { name: /Mover Paso 1 a la izquierda/ })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Mover Paso 1 a la derecha/ })).toBeTruthy();
  });

  it('does not duplicate the step indicator below playback controls', () => {
    render(
      <MathProvider>
        <DiagramStepsEditor
          model={model}
          activeStepId="step1"
          onActiveStepChange={vi.fn()}
          onModelEdit={vi.fn()}
          onSelectObject={vi.fn()}
        />
      </MathProvider>,
    );
    const navigator = screen.getByRole('navigation', { name: 'Navegación de pasos del diagrama' });
    expect(within(navigator).queryByText(/1 \/ 3/)).toBeNull();
    expect(within(navigator).queryByRole('list', { name: 'Línea temporal de pasos' })).toBeNull();
    expect(screen.getByDisplayValue('Paso 1')).toBeTruthy();
  });

  it('cycles cell visibility on click and opens details on the edit affordance', () => {
    const onEdit = vi.fn();
    render(
      <MathProvider>
        <DiagramStepsEditor
          model={model}
          activeStepId="step1"
          onActiveStepChange={vi.fn()}
          onModelEdit={onEdit}
          onSelectObject={vi.fn()}
        />
      </MathProvider>,
    );

    const step = model.steps[0];
    const objectId = 'segAB';
    const initial = matrixCellVisualState(step, objectId);
    const cell = screen.getByRole('button', { name: new RegExp(`Cambiar estado de Base AB en Paso 1`) });
    fireEvent.click(cell);
    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ steps: expect.any(Array) }),
      expect.objectContaining({ label: expect.stringContaining('Base AB') }),
    );
    const next = nextMatrixCellState(initial);
    const editedSteps = onEdit.mock.calls.at(-1)?.[0].steps;
    const editedState = editedSteps[0].objectStates?.[objectId];
    expect(editedState).toMatchObject(next);

    const editButton = screen.getByRole('button', { name: /Editar detalles de Base AB en Paso 1/ });
    fireEvent.click(editButton);
    expect(screen.getByText('Base AB · Paso 1')).toBeTruthy();
  });

  it('lists matrix rows in the same order as scene layers', () => {
    render(
      <MathProvider>
        <DiagramStepsEditor
          model={model}
          activeStepId="step1"
          onActiveStepChange={vi.fn()}
          onModelEdit={vi.fn()}
          onSelectObject={vi.fn()}
        />
      </MathProvider>,
    );

    const objectButtons = screen.getAllByRole('button').filter(button => button.className.includes('truncate'));
    const matrixObjectIds = objectButtons
      .map(button => button.parentElement?.querySelector('.font-mono')?.textContent?.trim())
      .filter((id): id is string => Boolean(id));
    expect(matrixObjectIds).toEqual(listSceneItemIdsInLayerVisualOrder(model));
  });
});
