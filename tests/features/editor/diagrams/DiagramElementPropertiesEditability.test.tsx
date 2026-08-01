import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DiagramElementKind } from '../../../../src/shared/diagrams/public';
import { WorkbenchElementInspector } from '../../../../src/features/editor/diagrams/ui/WorkbenchElementInspector';
import { element, createTemplateModel } from '../../../../src/features/editor/diagrams/model';
import type { VisualDiagramModel, VisualElement } from '../../../../src/features/editor/diagrams/model/types';

afterEach(cleanup);

function setupV2Inspector(
  kind: DiagramElementKind,
  extra: Partial<VisualElement> = {}
) {
  const onUpdateElement = vi.fn();
  const onUpdatePoint = vi.fn();
  const onUpdateSlider = vi.fn();
  const onUpdateModel = vi.fn();
  const onDeleteSelected = vi.fn();

  const base = createTemplateModel('estatico', 'Escena', 'diagram');
  const segment = base.elements.find(item => item.kind === 'segment')!;
  const refs = kind === 'label' ? [segment.id] : [base.points[0].id];
  const targetElement = element(`el-${kind}`, `Elemento ${kind}`, kind, refs, 'pizarra', true, {
    text: 'Texto base',
    properties: { anchorMode: 'reference', anchorParameter: 0.5 },
    ...extra,
  });

  const model: VisualDiagramModel = {
    ...base,
    elements: [...base.elements, targetElement],
  };

  render(
    <WorkbenchElementInspector
      model={model}
      selectedId={targetElement.id}
      onUpdatePoint={onUpdatePoint}
      onUpdateElement={onUpdateElement}
      onUpdateSlider={onUpdateSlider}
      onDeleteSelected={onDeleteSelected}
      onUpdateModel={onUpdateModel}
    />
  );

  return { onUpdateElement, onUpdatePoint, onUpdateModel, targetElement, model };
}

describe('V2ElementPropertiesEditability', () => {
  describe('Identity & Labels', () => {
    it('updates element visual label', () => {
      const { onUpdateElement } = setupV2Inspector('segment');
      const input = screen.getByLabelText(/Etiqueta Visual/i);
      fireEvent.change(input, { target: { value: '$s_1$' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-segment', { label: '$s_1$' });
    });
  });

  describe('Marks & Annotations', () => {
    it('updates mark count for congruenceMark element', () => {
      const { onUpdateElement } = setupV2Inspector('congruenceMark');
      const input = screen.getByLabelText(/Número de Marcas/i);
      fireEvent.change(input, { target: { value: '3' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-congruenceMark', expect.objectContaining({
        properties: expect.objectContaining({ markCount: 3 }),
      }));
    });

    it('updates mark stroke height and stroke width for mark element', () => {
      const { onUpdateElement } = setupV2Inspector('congruenceMark');
      const heightInput = screen.getByLabelText(/Tamaño \/ Longitud Marca/i);
      fireEvent.change(heightInput, { target: { value: '0.6' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-congruenceMark', expect.objectContaining({
        style: expect.objectContaining({ markHeight: 0.6 }),
      }));

      const widthInput = screen.getByLabelText(/^Grosor Trazo \(px\)$/i);
      fireEvent.change(widthInput, { target: { value: '3.5' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-congruenceMark', expect.objectContaining({
        style: expect.objectContaining({ strokeWidth: 3.5 }),
      }));
    });

    it('updates segment congruence marks using quick buttons', () => {
      const { onUpdateModel } = setupV2Inspector('segment');
      const btn = screen.getByRole('button', { name: '2 ||' });
      fireEvent.click(btn);
      expect(onUpdateModel).toHaveBeenCalled();
    });
  });

  describe('Curves & Functions', () => {
    it('updates functionCurve expression and domain', () => {
      const { onUpdateElement } = setupV2Inspector('functionCurve');
      const exprInput = screen.getByLabelText(/Expresión \$f\(x\)\$/i);
      fireEvent.change(exprInput, { target: { value: 'x^2 - 1' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-functionCurve', expect.objectContaining({
        properties: expect.objectContaining({ expression: 'x^2 - 1' }),
      }));

      const minDomain = screen.getByLabelText(/Mínimo Dominio/i);
      fireEvent.change(minDomain, { target: { value: '-10' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-functionCurve', expect.objectContaining({
        properties: expect.objectContaining({ domain: [-10, 5] }),
      }));
    });

    it('updates parametricCurve x and y expressions', () => {
      const { onUpdateElement } = setupV2Inspector('parametricCurve');
      const xInput = screen.getByLabelText(/Expresión \$x\(t\)\$/i);
      fireEvent.change(xInput, { target: { value: '2*cos(t)' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-parametricCurve', expect.objectContaining({
        properties: expect.objectContaining({ xExpression: '2*cos(t)' }),
      }));
    });
  });

  describe('InfoPanel & Text Content', () => {
    it('updates title and subtitle text for infoPanel', () => {
      const { onUpdateElement } = setupV2Inspector('infoPanel');
      fireEvent.click(screen.getByRole('button', { name: /Editar contenido y diseño del panel/i }));
      const titleInput = screen.getByLabelText(/Título del panel/i);
      fireEvent.change(titleInput, { target: { value: 'Teorema de Pitágoras' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-infoPanel', expect.objectContaining({
        properties: expect.objectContaining({ title: 'Teorema de Pitágoras' }),
      }));

      const bodyInput = screen.getByLabelText(/Contenido del panel/i);
      fireEvent.change(bodyInput, { target: { value: 'Demostración visual en $R^2$' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-infoPanel', expect.objectContaining({
        text: 'Demostración visual en $R^2$',
      }));
    });

    it('allows setting viewport position to 0,0', () => {
      const { onUpdateElement } = setupV2Inspector('infoPanel', {
        properties: { anchorMode: 'viewport', viewportPosition: [0.1, 0.2] },
      });
      fireEvent.click(screen.getByRole('button', { name: /Editar contenido y diseño del panel/i }));
      fireEvent.click(screen.getByRole('tab', { name: 'Posición' }));
      const inputX = screen.getByLabelText(/Posición horizontal del panel/i);
      fireEvent.change(inputX, { target: { value: '0' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-infoPanel', expect.objectContaining({
        properties: expect.objectContaining({ viewportPosition: [0, 0.2] }),
      }));
    });
  });

  describe('Style & Appearance', () => {
    it('updates strokeWidth for line elements', () => {
      const { onUpdateElement } = setupV2Inspector('segment');
      const input = screen.getByLabelText(/^Grosor Trazo \(px\)$/i);
      fireEvent.change(input, { target: { value: '4' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-segment', expect.objectContaining({
        style: expect.objectContaining({ strokeWidth: 4 }),
      }));
    });

    it('updates fillOpacity for polygon elements', () => {
      const { onUpdateElement } = setupV2Inspector('polygon');
      const input = screen.getByLabelText(/^Opacidad Relleno$/i);
      fireEvent.change(input, { target: { value: '0.4' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-polygon', expect.objectContaining({
        style: expect.objectContaining({ fillOpacity: 0.4 }),
      }));
    });

    it('updates dashed checkbox', () => {
      const { onUpdateElement } = setupV2Inspector('line');
      const checkbox = screen.getByLabelText(/Línea Discontinua/i);
      fireEvent.click(checkbox);
      expect(onUpdateElement).toHaveBeenCalledWith('el-line', { dashed: true });
    });
  });

  describe('Hover & Highlighting', () => {
    it('updates preserveColorOnHighlight checkbox', () => {
      const { onUpdateElement } = setupV2Inspector('segment');
      const checkbox = screen.getByLabelText(/Conservar color propio en hover/i);
      fireEvent.click(checkbox);
      expect(onUpdateElement).toHaveBeenCalledWith('el-segment', expect.objectContaining({
        style: expect.objectContaining({ preserveColorOnHighlight: false }),
      }));
    });

    it('updates highlight stroke width in hover section', () => {
      const { onUpdateElement } = setupV2Inspector('segment');
      const strokeInput = screen.getByLabelText(/^Grosor Trazo en Hover \(px\)$/i);
      fireEvent.change(strokeInput, { target: { value: '5.5' } });
      expect(onUpdateElement).toHaveBeenCalledWith('el-segment', expect.objectContaining({
        style: expect.objectContaining({ highlightStrokeWidth: 5.5 }),
      }));
    });
  });
});
