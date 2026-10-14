import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { createTemplateModel, element, point } from '../../../../../src/fixed-pages/editor/diagrams/model';
import { DiagramConstraintEditor } from '../../../../../src/fixed-pages/editor/diagrams/ui/panels/DiagramConstraintEditor';
import type { DiagramRelation } from '../../../../../src/diagrams';
import type { VisualDiagramModel } from '../../../../../src/fixed-pages/editor/diagrams/model/types';
import { constrained, pointById, relationFor } from '../../../../helpers/diagramSpec';
import { ReferencePickProvider } from '../../../../../src/fixed-pages/editor/diagrams/ui/constraints/relations/ReferencePickContext';

function modelFixture(relations: DiagramRelation[] = [relationFor('distance', 'constraint1', 'A distancia fija', ['pA', 'pB'], [], { value: 1 })]): VisualDiagramModel {
  const base = createTemplateModel('lienzo-inicial', 'Test', 'test');
  return {
    ...base,
    objects: [
      constrained(point('pA', 'A', 0, 0), ['constraint1']),
      point('pB', 'B', 1, 0),
      point('pC', 'C', 0, 1),
      element('lineAB', 'AB', 'line', ['pA', 'pB'], 'terracota'),
    ],
    relations,
  };
}

describe('DiagramConstraintEditor slot filtering', () => {
  it('does not offer lines as distance references', () => {
    render(
      <ReferencePickProvider>
        <DiagramConstraintEditor model={modelFixture()} point={pointById(modelFixture(), 'pA')} onModelEdit={vi.fn()} />
      </ReferencePickProvider>,
    );
    const select = screen.getByLabelText(/Punto de referencia de constraint1/i) as HTMLSelectElement;
    const values = [...select.options].map(option => option.value);
    expect(values).toContain('pB');
    expect(values).not.toContain('lineAB');
  });

  it('disables adding distance when a coincidence is already active', () => {
    const model = modelFixture([relationFor('coincident', 'constraint1', 'Coincidente', ['pA', 'pC'])]);

    render(
      <ReferencePickProvider>
        <DiagramConstraintEditor model={model} point={pointById(model, 'pA')} onModelEdit={vi.fn()} />
      </ReferencePickProvider>,
    );

    const picker = screen.getByLabelText('Nueva restricción') as HTMLSelectElement;
    fireEvent.change(picker, { target: { value: 'distance' } });
    const distanceOption = within(picker).getByRole('option', { name: 'A distancia fija' }) as HTMLOptionElement;
    expect(distanceOption.disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'Añadir relación' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
