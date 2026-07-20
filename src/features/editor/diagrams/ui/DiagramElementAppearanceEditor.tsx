import React from 'react';
import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS } from '@/shared/diagrams/public';
import type { ColorToken, VisualElement } from '../model/types';
import { COLOR_OPTIONS } from '../model/commands';
import { elementInspectorCapabilities } from '../model/elementInspectorCapabilities';

interface DiagramElementAppearanceEditorProps {
  element: VisualElement;
  onElementChange: (update: Partial<VisualElement>) => void;
  onStyleChange: (update: NonNullable<VisualElement['style']>) => void;
}

function angleRadiusFallback(element: VisualElement): number {
  return element.kind === 'angle' || element.kind === 'nonReflexAngle'
    ? DEFAULT_ANGLE_RADIUS
    : DEFAULT_RIGHT_ANGLE_RADIUS;
}

function markHeightPresentation(element: VisualElement): { ariaLabel: string; fallback: number } {
  if (element.kind === 'measureTicks') return { ariaLabel: 'Altura de las marcas de medida', fallback: 10 };
  if (element.kind === 'parallelMark') return { ariaLabel: 'Altura de las marcas de paralelismo', fallback: 0.42 };
  return { ariaLabel: 'Altura de las marcas de congruencia', fallback: 0.32 };
}

export const DiagramElementAppearanceEditor: React.FC<DiagramElementAppearanceEditorProps> = ({
  element,
  onElementChange,
  onStyleChange,
}) => {
  const capabilities = elementInspectorCapabilities(element.kind);
  const hasDetailedAppearance = capabilities.stroke || capabilities.fill || capabilities.pointSize
    || capabilities.angleRadius || capabilities.markHeight || capabilities.fontSize;
  const markHeight = markHeightPresentation(element);

  return (
    <fieldset className="space-y-3 rounded border border-carbon/10 p-2">
      <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Apariencia</legend>
      <label className="block text-xs font-bold text-carbon">
        Color
        <select aria-label="Color del elemento" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.color} onChange={event => onElementChange({ color: event.target.value as ColorToken })}>
          {COLOR_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>

      {hasDetailedAppearance && <div className="grid grid-cols-2 gap-2">
        {capabilities.pointSize && <>
          <label className="text-xs font-bold text-carbon">Tamaño<input type="number" min="0" max="30" step="0.5" aria-label="Tamaño del punto construido" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.pointSize ?? 7} onChange={event => onStyleChange({ pointSize: Number(event.target.value) })} /></label>
          <label className="text-xs font-bold text-carbon">Tamaño resaltado<input type="number" min="0" max="40" step="0.5" aria-label="Tamaño resaltado del punto construido" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.highlightPointSize ?? 10} onChange={event => onStyleChange({ highlightPointSize: Number(event.target.value) })} /></label>
        </>}

        {capabilities.angleRadius && <label className="col-span-2 text-xs font-bold text-carbon">Radio de la marca<input type="number" min="0.05" max="10" step="0.05" aria-label="Radio de la marca angular" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.angleRadius ?? angleRadiusFallback(element)} onChange={event => onStyleChange({ angleRadius: Number(event.target.value) })} /></label>}

        {capabilities.markHeight && <label className="col-span-2 text-xs font-bold text-carbon">Altura de la marca<input type="number" min="0.05" max="100" step="0.05" aria-label={markHeight.ariaLabel} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.markHeight ?? markHeight.fallback} onChange={event => onStyleChange({ markHeight: Number(event.target.value) })} /></label>}

        {capabilities.fontSize && <label className="col-span-2 text-xs font-bold text-carbon">Tamaño del texto<input type="number" min="6" max="72" step="1" aria-label="Tamaño del texto del elemento" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.labelSize ?? (element.kind === 'label' ? 14 : 16)} onChange={event => onStyleChange({ labelSize: Number(event.target.value) })} /></label>}

        {capabilities.stroke && <>
          <label className="text-xs font-bold text-carbon">Grosor<input type="number" min="0" max="20" step="0.1" aria-label="Grosor del elemento" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.strokeWidth ?? 2.4} onChange={event => onStyleChange({ strokeWidth: Number(event.target.value) })} /></label>
          <label className="text-xs font-bold text-carbon">Al resaltar<input type="number" min="0" max="30" step="0.1" aria-label="Grosor resaltado del elemento" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.highlightStrokeWidth ?? 3} onChange={event => onStyleChange({ highlightStrokeWidth: Number(event.target.value) })} /></label>
          <label className="col-span-2 text-xs font-bold text-carbon">Opacidad del trazo<input type="number" min="0" max="1" step="0.01" aria-label="Opacidad del trazo" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.strokeOpacity ?? 1} onChange={event => onStyleChange({ strokeOpacity: Number(event.target.value) })} /></label>
        </>}

        {capabilities.fill && <>
          <label className="text-xs font-bold text-carbon">Relleno<input type="number" min="0" max="1" step="0.01" aria-label="Opacidad de relleno" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.fillOpacity ?? 0.16} onChange={event => onStyleChange({ fillOpacity: Number(event.target.value) })} /></label>
          <label className="text-xs font-bold text-carbon">Al resaltar<input type="number" min="0" max="1" step="0.01" aria-label="Opacidad de relleno resaltado" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={element.style?.highlightFillOpacity ?? 0.34} onChange={event => onStyleChange({ highlightFillOpacity: Number(event.target.value) })} /></label>
        </>}
      </div>}

      {capabilities.dashed && <label className="flex items-center gap-1.5 text-xs font-bold text-carbon"><input type="checkbox" aria-label="¿Línea discontinua?" checked={element.dashed ?? false} onChange={event => onElementChange({ dashed: event.target.checked })} />Línea discontinua</label>}
      <label className="flex items-center gap-1.5 text-xs font-bold text-carbon"><input type="checkbox" checked={element.style?.preserveColorOnHighlight ?? true} onChange={event => onStyleChange({ preserveColorOnHighlight: event.target.checked })} />Conservar color al resaltar</label>
    </fieldset>
  );
};
