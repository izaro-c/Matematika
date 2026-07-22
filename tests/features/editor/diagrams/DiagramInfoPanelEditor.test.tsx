import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createTemplateModel, element } from '../../../../src/features/editor/diagrams/model';
import type { VisualDiagramModel } from '../../../../src/features/editor/diagrams/model/types';
import { DiagramInspector } from '../../../../src/features/editor/diagrams/ui/DiagramInspector';

const initial = (() => {
  const base = createTemplateModel('lienzo-inicial', 'Panel compuesto');
  const panel = element('panel', 'Panel', 'infoPanel', [], 'pizarra', true, {
    text: '',
    properties: {
      title: 'Clasificación',
      anchorMode: 'viewport',
      viewportPosition: [0.1, 0.2],
      infoPanelLayout: 'stack',
      infoPanelBlocks: [{ id: 'lados', title: 'Por sus lados', text: 'Escaleno', rules: [] }],
    },
  });
  return { ...base, elements: [panel] };
})();

function Harness() {
  const [model, setModel] = useState<VisualDiagramModel>(initial);
  return <>
    <DiagramInspector model={model} selectedId="panel" onSelect={() => {}} onModelEdit={setModel} onDeleteSelected={() => {}} />
    <output data-testid="panel-model">{JSON.stringify(model)}</output>
  </>;
}

describe('composite information panel editor', () => {
  it('adds, orders and configures independent conditional blocks without source editing', () => {
    render(<Harness />);
    const openBtn = screen.getByRole('button', { name: /Editar contenido y diseño del panel/i });
    if (openBtn) fireEvent.click(openBtn);
    fireEvent.click(screen.getByRole('tab', { name: /Bloques/ }));

    expect(screen.getByRole('option', { name: 'Lista vertical (uno tras otro)' })).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Distribución de bloques'), { target: { value: 'columns' } });
    fireEvent.click(screen.getByRole('button', { name: '+ Añadir bloque' }));
    expect(screen.getByText('2 · Nuevo bloque')).toBeTruthy();
    fireEvent.click(screen.getByText('2 · Nuevo bloque'));
    expect(screen.getAllByRole('button', { name: '↑ Subir' })).toHaveLength(2);

    fireEvent.click(screen.getAllByRole('button', { name: '+ Añadir variante condicional' })[1]);
    fireEvent.change(screen.getByLabelText('¿Cuándo se activa este caso?'), { target: { value: 'gt(pA.x,0)' } });
    fireEvent.change(screen.getByLabelText('Contenido del caso 1'), { target: { value: 'Caso alternativo {value}' } });
    fireEvent.change(screen.getByLabelText('Fórmula para {value} si se cumple el caso'), { target: { value: 'pA.x^2' } });

    const edited = JSON.parse(screen.getByTestId('panel-model').textContent || '{}');
    const properties = edited.elements[0].properties;
    expect(properties.infoPanelLayout).toBe('columns');
    expect(properties.infoPanelBlocks).toHaveLength(2);
    expect(properties.infoPanelBlocks[1].rules[0]).toMatchObject({ when: 'gt(pA.x,0)', text: 'Caso alternativo {value}', expression: 'pA.x^2' });
    expect(edited.dependencies).toContainEqual({ sourceId: 'pA', targetId: 'panel', relation: 'expression' });
  });
});
