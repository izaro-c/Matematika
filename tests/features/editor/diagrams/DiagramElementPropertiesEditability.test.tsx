import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { objectStyle, type DiagramConstructionKind as DiagramElementKind, type DiagramObject } from '../../../../src/diagrams/public';
import { WorkbenchElementInspector } from '../../../../src/fixed-pages/editor/diagrams/ui/workbench/WorkbenchElementInspector';
import { element, createTemplateModel, insertObjects, modelElements, modelPoints, elementKind } from '../../../../src/fixed-pages/editor/diagrams/model';
import type { VisualDiagramModel, VisualElement } from '../../../../src/fixed-pages/editor/diagrams/model/types';

afterEach(cleanup);

function setupInspector(
  kind: DiagramElementKind,
  configure: (element: VisualElement) => VisualElement = element => element,
) {
  const onUpdateElement = vi.fn();
  const onUpdatePoint = vi.fn();
  const onUpdateSlider = vi.fn();
  const onUpdateModel = vi.fn();
  const onDeleteSelected = vi.fn();

  const base = createTemplateModel('modelo-estatico', 'Escena', 'diagram');
  const segment = modelElements(base).find(item => elementKind(item) === 'segment')!;
  const refs = kind === 'label' ? [segment.id] : [modelPoints(base)[0].id];
  const targetElement = configure(element(`el-${kind}`, `Elemento ${kind}`, kind, refs, 'mora', true, { text: 'Texto base' }));

  const model: VisualDiagramModel = insertObjects(base, [targetElement]);

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

  /** Resultado de aplicar la última actualización del inspector sobre el objeto. */
  const applied = (): DiagramObject => {
    const update = onUpdateElement.mock.calls.at(-1)?.[1];
    return typeof update === 'function' ? update(targetElement) : { ...targetElement, ...update };
  };

  return { onUpdateElement, onUpdatePoint, onUpdateModel, targetElement, model, applied };
}

describe('DiagramElementPropertiesEditability', () => {
  describe('Identity & Labels', () => {
    it('updates element visual label', () => {
      const { applied } = setupInspector('segment');
      const input = screen.getByLabelText(/Etiqueta Visual/i);
      fireEvent.change(input, { target: { value: '$s_1$' } });
      expect(applied()).toMatchObject({ label: '$s_1$' });
    });
  });

  describe('Marks & Annotations', () => {
    it('updates mark count for congruenceMark element', () => {
      const { applied } = setupInspector('congruenceMark');
      const input = screen.getByLabelText(/Número de Marcas/i);
      fireEvent.change(input, { target: { value: '3' } });
      expect(applied()).toMatchObject({ count: 3 });
    });

    it('updates mark stroke height and stroke width for mark element', () => {
      const { applied } = setupInspector('congruenceMark');
      const heightInput = screen.getByLabelText(/Tamaño \/ Longitud Marca/i);
      fireEvent.change(heightInput, { target: { value: '0.6' } });
      expect(objectStyle(applied())).toMatchObject({ markHeight: 0.6 });

      const widthInput = screen.getByLabelText(/^Grosor Trazo \(px\)$/i);
      fireEvent.change(widthInput, { target: { value: '3.5' } });
      expect(objectStyle(applied())).toMatchObject({ strokeWidth: 3.5 });
    });

    it('updates segment congruence marks using quick buttons', () => {
      const { onUpdateModel } = setupInspector('segment');
      const btn = screen.getByRole('button', { name: '2 ||' });
      fireEvent.click(btn);
      expect(onUpdateModel).toHaveBeenCalled();
    });
  });

  describe('Curves & Functions', () => {
    it('updates functionCurve expression and domain', () => {
      const { applied } = setupInspector('functionCurve');
      const exprInput = screen.getByLabelText(/Expresión \$f\(x\)\$/i);
      fireEvent.change(exprInput, { target: { value: 'x^2 - 1' } });
      expect(applied()).toMatchObject({ geometry: { expression: 'x^2 - 1' } });

      const minDomain = screen.getByLabelText(/Mínimo Dominio/i);
      fireEvent.change(minDomain, { target: { value: '-10' } });
      expect(applied()).toMatchObject({ geometry: { domain: [-10, 5] } });
    });

    it('updates parametricCurve x and y expressions', () => {
      const { applied } = setupInspector('parametricCurve');
      const xInput = screen.getByLabelText(/Expresión \$x\(t\)\$/i);
      fireEvent.change(xInput, { target: { value: '2*cos(t)' } });
      expect(applied()).toMatchObject({ geometry: { x: '2*cos(t)' } });
    });
  });

  describe('InfoPanel & Text Content', () => {
    it('updates title and subtitle text for infoPanel', () => {
      const { applied } = setupInspector('infoPanel');
      fireEvent.click(screen.getByRole('button', { name: /Editar contenido y diseño del panel/i }));
      const titleInput = screen.getByLabelText(/Título del panel/i);
      fireEvent.change(titleInput, { target: { value: 'Teorema de Pitágoras' } });
      expect(applied()).toMatchObject({ content: { title: 'Teorema de Pitágoras' } });

      const subtitleInput = screen.getByLabelText(/Subtítulo opcional del panel/i);
      fireEvent.change(subtitleInput, { target: { value: 'Prueba por áreas' } });
      expect(applied()).toMatchObject({ content: { subtitle: 'Prueba por áreas' } });

      const bodyInput = screen.getByLabelText(/Contenido del panel/i);
      fireEvent.change(bodyInput, { target: { value: 'Demostración visual en $R^2$' } });
      expect(applied()).toMatchObject({ content: { text: 'Demostración visual en $R^2$' } });
    });

    it('allows setting viewport position to 0,0', () => {
      const { applied } = setupInspector('infoPanel', panel => (
        panel.objectType === 'annotation' ? { ...panel, anchor: { type: 'viewport', position: [0.1, 0.2] } } : panel
      ));
      fireEvent.click(screen.getByRole('button', { name: /Editar contenido y diseño del panel/i }));
      fireEvent.click(screen.getByRole('tab', { name: 'Posición' }));
      const inputX = screen.getByLabelText(/Posición horizontal del panel/i);
      fireEvent.change(inputX, { target: { value: '0' } });
      expect(applied()).toMatchObject({ anchor: { type: 'viewport', position: [0, 0.2] } });
    });
  });

  describe('Style & Appearance', () => {
    it('updates strokeWidth for line elements', () => {
      const { applied } = setupInspector('segment');
      const input = screen.getByLabelText(/^Grosor Trazo \(px\)$/i);
      fireEvent.change(input, { target: { value: '4' } });
      expect(objectStyle(applied())).toMatchObject({ strokeWidth: 4 });
    });

    it('updates fillOpacity for polygon elements', () => {
      const { applied } = setupInspector('polygon');
      const input = screen.getByLabelText(/^Opacidad Relleno$/i);
      fireEvent.change(input, { target: { value: '0.4' } });
      expect(objectStyle(applied())).toMatchObject({ fillOpacity: 0.4 });
    });

    it('updates dashed checkbox', () => {
      const { applied } = setupInspector('line');
      const checkbox = screen.getByLabelText(/Línea Discontinua/i);
      fireEvent.click(checkbox);
      expect(applied()).toMatchObject({ appearance: { dashed: true } });
    });
  });

  describe('Hover & Highlighting', () => {
    it('updates preserveColorOnHighlight checkbox', () => {
      const { applied } = setupInspector('segment');
      const checkbox = screen.getByLabelText(/Conservar color propio en hover/i);
      fireEvent.click(checkbox);
      expect(objectStyle(applied())).toMatchObject({ preserveColorOnHighlight: false });
    });

    it('updates highlight stroke width in hover section', () => {
      const { applied } = setupInspector('segment');
      const strokeInput = screen.getByLabelText(/^Grosor Trazo en Hover \(px\)$/i);
      fireEvent.change(strokeInput, { target: { value: '5.5' } });
      expect(objectStyle(applied())).toMatchObject({ highlightStrokeWidth: 5.5 });
    });
  });
});
