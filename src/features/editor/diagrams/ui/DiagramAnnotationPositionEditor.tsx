import React from 'react';
import type { VisualElement } from '../model/types';
import { elementInspectorCapabilities } from '../model/elementInspectorCapabilities';

interface DiagramAnnotationPositionEditorProps {
  element: VisualElement;
  onStyleChange: (update: NonNullable<VisualElement['style']>) => void;
  variant?: 'fieldset' | 'embedded';
}

function defaultTextOffset(kind: VisualElement['kind']): [number, number] {
  return kind === 'label' ? [0.04, 0.04] : [0.25, 0.35];
}

function horizontalAriaLabel(kind: VisualElement['kind']): string {
  return kind === 'label' ? 'Separación horizontal de la etiqueta' : 'Separación horizontal de la anotación';
}

function verticalAriaLabel(kind: VisualElement['kind']): string {
  return kind === 'label' ? 'Separación vertical de la etiqueta' : 'Separación vertical de la anotación';
}

export const DiagramAnnotationPositionEditor: React.FC<DiagramAnnotationPositionEditorProps> = ({
  element,
  onStyleChange,
  variant = 'fieldset',
}) => {
  if (!elementInspectorCapabilities(element.kind).textOffset) return null;
  if (element.kind === 'infoPanel' && element.properties?.anchorMode === 'viewport') return null;
  const offset = element.style?.textOffset ?? defaultTextOffset(element.kind);
  const controls = (
    <div className="grid grid-cols-2 gap-2">
      <label className="text-xs font-bold text-carbon">
        {variant === 'embedded' ? 'Separación X' : 'Horizontal'}
        <input
          type="number"
          step="0.01"
          aria-label={horizontalAriaLabel(element.kind)}
          className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
          value={offset[0]}
          onChange={event => onStyleChange({ textOffset: [Number(event.target.value), offset[1]] })}
        />
      </label>
      <label className="text-xs font-bold text-carbon">
        {variant === 'embedded' ? 'Separación Y' : 'Vertical'}
        <input
          type="number"
          step="0.01"
          aria-label={verticalAriaLabel(element.kind)}
          className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
          value={offset[1]}
          onChange={event => onStyleChange({ textOffset: [offset[0], Number(event.target.value)] })}
        />
      </label>
    </div>
  );

  if (variant === 'embedded') return controls;

  return (
    <fieldset className="space-y-2 rounded border border-carbon/10 p-2">
      <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Separación respecto al anclaje</legend>
      {controls}
      <p className="text-[10px] leading-relaxed text-carbon/45">Ajusta la posición visual sin crear puntos auxiliares ni cambiar el objeto de referencia.</p>
    </fieldset>
  );
};
