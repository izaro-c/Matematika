import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';
import { createTemplateModel, element, point } from '../../../../../src/features/editor/diagrams/model';
import { DiagramConstraintEditor } from '../../../../../src/features/editor/diagrams/ui/DiagramConstraintEditor';
import { ReferencePickProvider } from '../../../../../src/features/editor/diagrams/ui/relations/ReferencePickContext';

function modelFixture() {
  const base = createTemplateModel('lienzo-inicial', 'Test', 'test');
  return {
    ...base,
    points: [
      { ...point('pA', 'A', 0, 0), constraint: 'constrained' as const, constraintIds: ['constraint1'] },
      point('pB', 'B', 1, 0),
    ],
    elements: [
      element('lineAB', 'AB', 'line', ['pA', 'pB'], 'terracota'),
    ],
    constraints: [{
      id: 'constraint1',
      label: 'A distancia fija',
      kind: 'distance' as const,
      refs: ['pA', 'pB'],
      enabled: true,
      value: 1,
    }],
  };
}

describe('DiagramConstraintEditor slot filtering', () => {
  it('does not offer lines as distance references', () => {
    render(
      <ReferencePickProvider>
        <DiagramConstraintEditor model={modelFixture()} point={modelFixture().points[0]} onModelEdit={vi.fn()} />
      </ReferencePickProvider>,
    );
    const select = screen.getByLabelText(/Punto de referencia de constraint1/i) as HTMLSelectElement;
    const values = [...select.options].map(option => option.value);
    expect(values).toContain('pB');
    expect(values).not.toContain('lineAB');
  });

  it('disables adding distance when midpoint is already active', () => {
    const model = modelFixture();
    model.constraints = [{
      id: 'constraint1',
      label: 'Punto medio',
      kind: 'midpoint',
      refs: ['pA', 'pB', 'pB'],
      enabled: true,
    }];
    model.points[0] = { ...model.points[0], constraintIds: ['constraint1'] };
    // need third point for midpoint defaults — add pC
    model.points.push(point('pC', 'C', 0, 1));
    model.constraints[0].refs = ['pA', 'pB', 'pC'];

    render(
      <ReferencePickProvider>
        <DiagramConstraintEditor model={model} point={model.points[0]} onModelEdit={vi.fn()} />
      </ReferencePickProvider>,
    );

    const picker = screen.getByLabelText('Nueva restricción') as HTMLSelectElement;
    fireEvent.change(picker, { target: { value: 'distance' } });
    const distanceOption = within(picker).getByRole('option', { name: 'A distancia fija' }) as HTMLOptionElement;
    expect(distanceOption.disabled).toBe(true);
    expect((screen.getByRole('button', { name: 'Añadir relación' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
