import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WorkbenchElementInspector } from '../../../../src/fixed-pages/editor/diagrams/ui/workbench/WorkbenchElementInspector';
import { element, createTemplateModel } from '../../../../src/fixed-pages/editor/diagrams/model';
import type { VisualDiagramModel, VisualElement } from '../../../../src/fixed-pages/editor/diagrams/model/types';
import { objectLabelVisible, objectStyle, type DiagramObject } from '../../../../src/diagrams';
import { elementText, setting, withSetting, type SettingKey } from '../../../../src/fixed-pages/editor/diagrams/ui/inspector/elementSettings';

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
    objects: [...base.objects.filter(item => item.id !== el.id), el],
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

/** Aplica la última actualización (parche o transformación) recibida por el inspector. */
function lastUpdate(onUpdateElement: ReturnType<typeof vi.fn>, el: VisualElement): DiagramObject {
  const [id, update] = onUpdateElement.mock.calls.at(-1)!;
  expect(id).toBe(el.id);
  return typeof update === 'function' ? update(el) : { ...el, ...update };
}

function withSettings(el: VisualElement, values: Partial<Record<SettingKey, number | string>>): VisualElement {
  return Object.entries(values).reduce((current, [key, value]) => withSetting(current, key as SettingKey, value!), el);
}

function settingsOf(object: DiagramObject, keys: SettingKey[]) {
  return Object.fromEntries(keys.map(key => [key, setting(object, key)]));
}

describe('Dimension and Measurement Inspector Editability', () => {
  describe('dimensionLine (Cotas)', () => {
    it('allows editing reference offset, precision, unit, and text template', () => {
      const dimLine = withSettings(element('dim-1', 'AB', 'dimensionLine', ['p1', 'p2'], 'mora', true, {
        text: 'AB: {value}',
      }), { offset: 0.35, precision: 2, unit: 'cm' });
      const keys: SettingKey[] = ['offset', 'precision', 'unit'];

      const { onUpdateElement } = setupInspectorWithElement(dimLine);

      // Distancia de referencia
      const offsetInput = screen.getByLabelText(/Distancia u offset de cota/i);
      fireEvent.change(offsetInput, { target: { value: '0.8' } });
      expect(settingsOf(lastUpdate(onUpdateElement, dimLine), keys)).toEqual({ offset: 0.8, precision: 2, unit: 'cm' });

      // Precisión
      const precisionInput = screen.getByLabelText(/Precisión decimal/i);
      fireEvent.change(precisionInput, { target: { value: '3' } });
      expect(settingsOf(lastUpdate(onUpdateElement, dimLine), keys)).toEqual({ offset: 0.35, precision: 3, unit: 'cm' });

      // Unidad
      const unitInput = screen.getByLabelText(/Unidad de cota/i);
      fireEvent.change(unitInput, { target: { value: 'm' } });
      expect(settingsOf(lastUpdate(onUpdateElement, dimLine), keys)).toEqual({ offset: 0.35, precision: 2, unit: 'm' });

      // Texto / Plantilla
      const textInput = screen.getByLabelText(/Título o texto/i);
      fireEvent.change(textInput, { target: { value: 'd = {value}' } });
      const titled = lastUpdate(onUpdateElement, dimLine);
      expect(titled.label).toBe('d = {value}');
      expect(elementText(titled)).toBe('d = {value}');
      expect(settingsOf(titled, keys)).toEqual({ offset: 0.35, precision: 2, unit: 'cm' });
    });

    it('allows toggling label visibility in canvas', () => {
      const dimLine = withSettings(element('dim-1', 'AB', 'dimensionLine', ['p1', 'p2'], 'mora', true, {
        showLabel: true,
      }), { offset: 0.35, precision: 2 });

      const { onUpdateElement } = setupInspectorWithElement(dimLine);

      const labelVisibleCheckbox = screen.getByLabelText(/Mostrar etiqueta en el lienzo/i);
      fireEvent.click(labelVisibleCheckbox);
      expect(objectLabelVisible(lastUpdate(onUpdateElement, dimLine))).toBe(false);
    });

    it('allows adding and removing dimension line to header subtitle readings', () => {
      const dimLine = withSettings(element('dim-1', 'AB', 'dimensionLine', ['p1', 'p2'], 'mora', true), { offset: 0.35, precision: 2 });

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
      expect(objectStyle(lastUpdate(onUpdateElement, dimLine))?.textOffset).toEqual([0.5, 0.2]);

      const offsetYInput = screen.getByLabelText(/Desplazamiento Y respecto al padre/i);
      fireEvent.change(offsetYInput, { target: { value: '-0.3' } });
      expect(objectStyle(lastUpdate(onUpdateElement, dimLine))?.textOffset).toEqual([0.1, -0.3]);
    });

    it('allows changing font size (labelSize) of dimensionLine', () => {
      const dimLine = element('dim-1', 'AB', 'dimensionLine', ['p1', 'p2'], 'mora', true, {
        style: { labelSize: 14 },
      });

      const { onUpdateElement } = setupInspectorWithElement(dimLine);

      const sizeInputs = screen.getAllByLabelText(/Tamaño de cota/i);
      expect(sizeInputs.length).toBeGreaterThanOrEqual(1);
      fireEvent.change(sizeInputs[0], { target: { value: '20' } });
      expect(objectStyle(lastUpdate(onUpdateElement, dimLine))?.labelSize).toBe(20);
    });
  });

  describe('measurement (Medidas)', () => {
    it('allows editing position along parent, unit, precision, and subtitle status', () => {
      const meas = withSettings(element('meas-1', 'm_1', 'measurement', ['seg-1'], 'terracota', true), { anchorParameter: 0.5, unit: 'cm', precision: 2 });
      const keys: SettingKey[] = ['anchorParameter', 'unit', 'precision'];

      const { onUpdateElement } = setupInspectorWithElement(meas);

      // Posición a lo largo del elemento
      const positionSlider = screen.getByLabelText(/Posición a lo largo del elemento padre/i);
      fireEvent.change(positionSlider, { target: { value: '0.75' } });
      expect(settingsOf(lastUpdate(onUpdateElement, meas), keys)).toEqual({ anchorParameter: 0.75, unit: 'cm', precision: 2 });

      // Unidad
      const unitInput = screen.getByLabelText(/Unidad de medida/i);
      fireEvent.change(unitInput, { target: { value: 'mm' } });
      expect(settingsOf(lastUpdate(onUpdateElement, meas), keys)).toEqual({ anchorParameter: 0.5, unit: 'mm', precision: 2 });

      // Precisión
      const precisionInput = screen.getByLabelText(/Precisión de medida/i);
      fireEvent.change(precisionInput, { target: { value: '1' } });
      expect(settingsOf(lastUpdate(onUpdateElement, meas), keys)).toEqual({ anchorParameter: 0.5, unit: 'cm', precision: 1 });
    });

    it('allows changing font size (labelSize) of measurement', () => {
      const meas = element('meas-1', 'm_1', 'measurement', ['seg-1'], 'terracota', true, {
        style: { labelSize: 16 },
      });

      const { onUpdateElement } = setupInspectorWithElement(meas);

      const sizeInputs = screen.getAllByLabelText(/Tamaño de medida/i);
      expect(sizeInputs.length).toBeGreaterThanOrEqual(1);
      fireEvent.change(sizeInputs[0], { target: { value: '18' } });
      expect(objectStyle(lastUpdate(onUpdateElement, meas))?.labelSize).toBe(18);
    });
  });

  describe('label (Etiquetas)', () => {
    it('allows changing font size (labelSize) of label', () => {
      const lbl = element('lbl-1', 'Etiqueta', 'label', ['p1'], 'carbon', true, {
        text: 'Hipotenusa',
        style: { labelSize: 16 },
      });

      const { onUpdateElement } = setupInspectorWithElement(lbl);

      const sizeInputs = screen.getAllByLabelText(/Tamaño de etiqueta/i);
      expect(sizeInputs.length).toBeGreaterThanOrEqual(1);
      fireEvent.change(sizeInputs[0], { target: { value: '22' } });
      expect(objectStyle(lastUpdate(onUpdateElement, lbl))?.labelSize).toBe(22);
    });
  });
});
