import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkbenchElementInspector } from '../../../../src/fixed-pages/editor/diagrams/ui/workbench/WorkbenchElementInspector';
import { element, createTemplateModel } from '../../../../src/fixed-pages/editor/diagrams/model';
import type { VisualDiagramModel, VisualElement } from '../../../../src/fixed-pages/editor/diagrams/model/types';

afterEach(cleanup);

function setupInspectorWithElement(el: VisualElement, baseModel?: VisualDiagramModel) {
  const onUpdateElement = vi.fn();
  const onUpdatePoint = vi.fn();
  const onUpdateSlider = vi.fn();
  const onUpdateModel = vi.fn();
  const onDeleteSelected = vi.fn();

  const base = baseModel ?? createTemplateModel('estatico', 'Escena', 'diagram');
  const model: VisualDiagramModel = {
    ...base,
    elements: [...base.elements.filter(item => item.id !== el.id), el],
  };

  render(
    <WorkbenchElementInspector
      model={model}
      selectedId={el.id}
      onUpdatePoint={onUpdatePoint}
      onUpdateElement={onUpdateElement}
      onUpdateSlider={onUpdateSlider}
      onDeleteSelected={onDeleteSelected}
      onUpdateModel={onUpdateModel}
    />
  );

  return { onUpdateElement, onUpdatePoint, onUpdateModel, el, model };
}

describe('Dimension and Measurement Inspector Editability', () => {
  describe('dimensionLine (Cotas)', () => {
    it('allows editing reference offset, precision, unit, and text template', () => {
      const dimLine = element('dim-1', 'AB', 'dimensionLine', ['p1', 'p2'], 'mora', true, {
        text: 'AB: {value}',
        properties: { offset: 0.35, precision: 2, unit: 'cm' },
      });

      const { onUpdateElement } = setupInspectorWithElement(dimLine);

      // Distancia de referencia
      const offsetInput = screen.getByLabelText(/Distancia u offset de cota/i);
      fireEvent.change(offsetInput, { target: { value: '0.8' } });
      expect(onUpdateElement).toHaveBeenCalledWith('dim-1', {
        properties: { offset: 0.8, precision: 2, unit: 'cm' },
      });

      // Precisión
      const precisionInput = screen.getByLabelText(/Precisión decimal/i);
      fireEvent.change(precisionInput, { target: { value: '3' } });
      expect(onUpdateElement).toHaveBeenCalledWith('dim-1', {
        properties: { offset: 0.35, precision: 3, unit: 'cm' },
      });

      // Unidad
      const unitInput = screen.getByLabelText(/Unidad de cota/i);
      fireEvent.change(unitInput, { target: { value: 'm' } });
      expect(onUpdateElement).toHaveBeenCalledWith('dim-1', {
        properties: { offset: 0.35, precision: 2, unit: 'm' },
      });

      // Texto / Plantilla
      const textInput = screen.getByLabelText(/Título o texto/i);
      fireEvent.change(textInput, { target: { value: 'd = {value}' } });
      expect(onUpdateElement).toHaveBeenCalledWith('dim-1', {
        label: 'd = {value}',
        text: 'd = {value}',
        properties: { offset: 0.35, precision: 2, unit: 'cm', title: 'd = {value}' },
      });
    });

    it('allows toggling label visibility in canvas', () => {
      const dimLine = element('dim-1', 'AB', 'dimensionLine', ['p1', 'p2'], 'mora', true, {
        showLabel: true,
        properties: { offset: 0.35, precision: 2 },
      });

      const { onUpdateElement } = setupInspectorWithElement(dimLine);

      const labelVisibleCheckbox = screen.getByLabelText(/Mostrar etiqueta en el lienzo/i);
      fireEvent.click(labelVisibleCheckbox);
      expect(onUpdateElement).toHaveBeenCalledWith('dim-1', {
        showLabel: false,
      });
    });

    it('allows adding and removing dimension line to header subtitle readings', () => {
      const dimLine = element('dim-1', 'AB', 'dimensionLine', ['p1', 'p2'], 'mora', true, {
        properties: { offset: 0.35, precision: 2 },
      });

      const { onUpdateModel } = setupInspectorWithElement(dimLine);

      const subtitleCheckbox = screen.getByLabelText(/Mostrar como subtítulo en la cabecera/i);
      fireEvent.click(subtitleCheckbox);

      expect(onUpdateModel).toHaveBeenCalled();
      const updatedModel = onUpdateModel.mock.calls[0][0] as VisualDiagramModel;
      expect(updatedModel.header.readingsMode).toBe('custom');
      expect(updatedModel.header.readings.some(r => r.sourceIds.includes('dim-1'))).toBe(true);
    });

    it('allows editing fine text offset X and Y', () => {
      const dimLine = element('dim-1', 'AB', 'dimensionLine', ['p1', 'p2'], 'mora', true, {
        style: { textOffset: [0.1, 0.2] },
      });

      const { onUpdateElement } = setupInspectorWithElement(dimLine);

      const offsetXInput = screen.getByLabelText(/Desplazamiento X respecto al padre/i);
      fireEvent.change(offsetXInput, { target: { value: '0.5' } });
      expect(onUpdateElement).toHaveBeenCalledWith('dim-1', {
        style: expect.objectContaining({ textOffset: [0.5, 0.2] }),
      });

      const offsetYInput = screen.getByLabelText(/Desplazamiento Y respecto al padre/i);
      fireEvent.change(offsetYInput, { target: { value: '-0.3' } });
      expect(onUpdateElement).toHaveBeenCalledWith('dim-1', {
        style: expect.objectContaining({ textOffset: [0.1, -0.3] }),
      });
    });
  });

  describe('measurement (Medidas)', () => {
    it('allows editing position along parent, unit, precision, and subtitle status', () => {
      const meas = element('meas-1', 'm_1', 'measurement', ['seg-1'], 'terracota', true, {
        properties: { anchorParameter: 0.5, unit: 'cm', precision: 2 },
      });

      const { onUpdateElement } = setupInspectorWithElement(meas);

      // Posición a lo largo del elemento
      const positionSlider = screen.getByLabelText(/Posición a lo largo del elemento padre/i);
      fireEvent.change(positionSlider, { target: { value: '0.75' } });
      expect(onUpdateElement).toHaveBeenCalledWith('meas-1', {
        properties: { anchorParameter: 0.75, unit: 'cm', precision: 2 },
      });

      // Unidad
      const unitInput = screen.getByLabelText(/Unidad de medida/i);
      fireEvent.change(unitInput, { target: { value: 'mm' } });
      expect(onUpdateElement).toHaveBeenCalledWith('meas-1', {
        properties: { anchorParameter: 0.5, unit: 'mm', precision: 2 },
      });

      // Precisión
      const precisionInput = screen.getByLabelText(/Precisión de medida/i);
      fireEvent.change(precisionInput, { target: { value: '1' } });
      expect(onUpdateElement).toHaveBeenCalledWith('meas-1', {
        properties: { anchorParameter: 0.5, unit: 'cm', precision: 1 },
      });
    });
  });
});
