import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createTemplateModel } from '../../../../src/features/editor/diagrams/model/commands';
import { DiagramExpressionField, DiagramFormulaField } from '../../../../src/features/editor/diagrams/ui/DiagramExpressionField';
import marksFixture from '../../../fixtures/diagrams/phase3-marks-angles.json';
import { migrateDiagramSpec } from '../../../../src/shared/diagrams/public';

const model = createTemplateModel('circunferencia', 'Expresiones', 'definicion');

const ExpressionHarness = () => {
  const [value, setValue] = useState('');
  return <DiagramExpressionField model={model} label="Cálculo seguro" value={value} onChange={setValue} optional />;
};

const AngleExpressionHarness = () => {
  const [value, setValue] = useState('');
  return <DiagramExpressionField model={migrateDiagramSpec(marksFixture).spec} label="Cálculo angular" value={value} onChange={setValue} optional />;
};

describe('DiagramExpressionField', () => {
  it('inserts available scene variables and validates the result immediately', () => {
    render(<ExpressionHarness />);

    fireEvent.change(screen.getByLabelText('Variable para Cálculo seguro'), { target: { value: 'segOA.length' } });
    fireEvent.click(screen.getByRole('button', { name: 'Insertar' }));

    expect((screen.getByLabelText('Cálculo seguro') as HTMLInputElement).value).toBe('segOA.length');
    expect(screen.getByText(/Expresión válida/)).toBeTruthy();
  });

  it('explains the safe language and rejects arbitrary JavaScript calls', () => {
    render(<ExpressionHarness />);
    fireEvent.click(screen.getByText('Qué se puede escribir y cómo'));
    expect(screen.getByText(/No se ejecuta JavaScript/)).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Cálculo seguro'), { target: { value: 'window.alert(1)' } });
    expect(screen.getByText(/no está permitida/)).toBeTruthy();
  });

  it('offers radians and degrees from both angular object types', () => {
    render(<AngleExpressionHarness />);
    const variablePicker = screen.getByLabelText('Variable para Cálculo angular');

    expect(screen.getByRole('group', { name: 'Ángulo AVB — angleAVB' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Ángulo no reflejo AVB — nonReflexAngleAVB' })).toBeTruthy();
    expect(screen.getByRole('option', { name: /angleAVB\.degrees · medida angular en grados/ })).toBeTruthy();
    expect(screen.getByRole('option', { name: /nonReflexAngleAVB\.radians · medida angular en radianes/ })).toBeTruthy();
    expect(screen.getByRole('option', { name: /nonReflexAngleAVB\.degrees.*ahora 90/ })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Buscar variable para Cálculo angular'), { target: { value: 'angulo no reflejo grados' } });
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(screen.getByText(/agrupadas por objeto y muestran su valor actual/)).toBeTruthy();
    fireEvent.change(variablePicker, { target: { value: 'nonReflexAngleAVB.degrees' } });
    fireEvent.click(screen.getByRole('button', { name: 'Insertar' }));

    expect((screen.getByLabelText('Cálculo angular') as HTMLInputElement).value).toBe('nonReflexAngleAVB.degrees');
    expect(screen.getByText(/Expresión válida · valor de prueba 90/)).toBeTruthy();
  });

  it('documents visible KaTeX separately from the safe numeric expression', () => {
    render(<DiagramFormulaField label="Fórmula visible" value="a^2 = {value}" onChange={() => {}} />);
    fireEvent.click(screen.getByText('Cómo escribir la fórmula visible'));
    expect(screen.getByText(/Se usa sintaxis KaTeX/)).toBeTruthy();
    expect(screen.getByText(/se edita justo debajo/)).toBeTruthy();
  });
});
