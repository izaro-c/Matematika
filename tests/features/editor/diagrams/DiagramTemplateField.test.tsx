import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model';
import { DiagramTemplateField } from '../../../../src/features/editor/diagrams/ui/DiagramTemplateField';

function Harness() {
  const [value, setValue] = useState('Área: ');
  return <>
    <DiagramTemplateField model={createTemplateModel('lienzo-inicial', 'Plantilla')} label="Contenido" value={value} onChange={setValue} />
    <output data-testid="value">{value}</output>
  </>;
}

describe('diagram template field', () => {
  it('inserts a self-contained calculation with unit and precision', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: '+ Insertar cálculo' }));
    fireEvent.change(screen.getByLabelText('Expresión para Contenido'), { target: { value: 'pA.x ^ 2' } });
    fireEvent.change(screen.getByLabelText('Unidad para Contenido'), { target: { value: 'cm²' } });
    fireEvent.change(screen.getByLabelText('Decimales para Contenido'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Insertar cálculo en Contenido' }));

    expect(screen.getByTestId('value').textContent).toBe('Área: {= pA.x ^ 2 | precision: 3 | unit: "cm²"}');
  });
});
