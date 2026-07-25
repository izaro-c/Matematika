import React from 'react';
import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS } from '@/shared/diagrams/public';
import type { ColorToken, VisualElement } from '../model/types';
import { COLOR_OPTIONS } from '../model';
import { elementInspectorCapabilities } from '../model/elementInspectorCapabilities';

interface DiagramElementAppearanceEditorProps {
  element: VisualElement;
  onElementChange: (update: Partial<VisualElement>) => void;
  onStyleChange: (update: NonNullable<VisualElement['style']>) => void;
}

const COLOR_SWATCHES: Record<ColorToken, string> = {
  carbon: '#2b2927',
  terracota: '#c85a32',
  salvia: '#7d8c7c',
  pizarra: '#4a5568',
  ocre: '#d99b35',
  pavo: '#2c6e63',
  granada: '#a83232',
  musgo: '#556b2f',
};

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
  const hasDetailedAppearance =
    capabilities.stroke ||
    capabilities.fill ||
    capabilities.pointSize ||
    capabilities.angleRadius ||
    capabilities.markHeight ||
    capabilities.fontSize;
  const markHeight = markHeightPresentation(element);

  return (
    <fieldset className="space-y-3 rounded-lg border border-carbon/10 bg-lienzo p-3 shadow-xs">
      <legend className="px-1 ac-label ac-label--sm ac-label--soft">Apariencia</legend>

      {/* Color Palette Chips */}
      <div>
        <label className="block text-xs font-bold text-carbon">
          Color
          <select
            aria-label="Color del elemento"
            className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-bold"
            value={element.color}
            onChange={event => onElementChange({ color: event.target.value as ColorToken })}
          >
            {COLOR_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="Paleta de colores Arts & Crafts">
          {COLOR_OPTIONS.map(option => {
            const isSelected = element.color === option.value;
            const hex = COLOR_SWATCHES[option.value as ColorToken] || '#000';
            return (
              <button
                key={option.value}
                type="button"
                aria-label={`Color ${option.label}`}
                title={option.label}
                onClick={() => onElementChange({ color: option.value as ColorToken })}
                className={`h-6 w-6 rounded-full border transition-all ${
                  isSelected ? 'ring-2 ring-carbon ring-offset-1 scale-110 shadow-xs' : 'border-carbon/20 hover:scale-105'
                }`}
                style={{ backgroundColor: hex }}
              />
            );
          })}
        </div>
      </div>

      {hasDetailedAppearance && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          {capabilities.pointSize && (
            <>
              <label className="text-xs font-bold text-carbon">
                Tamaño
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  aria-label="Tamaño del punto construido"
                  className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                  value={element.style?.pointSize ?? 7}
                  onChange={event => onStyleChange({ pointSize: Number(event.target.value) })}
                />
              </label>
              <label className="text-xs font-bold text-carbon">
                Resaltado
                <input
                  type="number"
                  min="0"
                  max="40"
                  step="0.5"
                  aria-label="Tamaño resaltado del punto construido"
                  className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                  value={element.style?.highlightPointSize ?? 10}
                  onChange={event => onStyleChange({ highlightPointSize: Number(event.target.value) })}
                />
              </label>
            </>
          )}

          {capabilities.angleRadius && (
            <label className="col-span-2 text-xs font-bold text-carbon">
              Radio de la marca
              <input
                type="number"
                min="0.05"
                max="10"
                step="0.05"
                aria-label="Radio de la marca angular"
                className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                value={element.style?.angleRadius ?? angleRadiusFallback(element)}
                onChange={event => onStyleChange({ angleRadius: Number(event.target.value) })}
              />
            </label>
          )}

          {capabilities.markHeight && (
            <label className="col-span-2 text-xs font-bold text-carbon">
              Altura de la marca
              <input
                type="number"
                min="0.05"
                max="100"
                step="0.05"
                aria-label={markHeight.ariaLabel}
                className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                value={element.style?.markHeight ?? markHeight.fallback}
                onChange={event => onStyleChange({ markHeight: Number(event.target.value) })}
              />
            </label>
          )}

          {capabilities.fontSize && (
            <label className="col-span-2 text-xs font-bold text-carbon">
              Tamaño del texto
              <input
                type="number"
                min="6"
                max="72"
                step="1"
                aria-label="Tamaño del texto del elemento"
                className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                value={element.style?.labelSize ?? (element.kind === 'label' ? 14 : 16)}
                onChange={event => onStyleChange({ labelSize: Number(event.target.value) })}
              />
            </label>
          )}

          {capabilities.stroke && (
            <>
              <label className="text-xs font-bold text-carbon">
                Grosor
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  aria-label="Grosor del elemento"
                  className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                  value={element.style?.strokeWidth ?? 2.4}
                  onChange={event => onStyleChange({ strokeWidth: Number(event.target.value) })}
                />
              </label>
              <label className="text-xs font-bold text-carbon">
                Grosor resaltado
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.1"
                  aria-label="Grosor resaltado del elemento"
                  className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                  value={element.style?.highlightStrokeWidth ?? 3}
                  onChange={event => onStyleChange({ highlightStrokeWidth: Number(event.target.value) })}
                />
              </label>
              <label className="col-span-2 text-xs font-bold text-carbon">
                Opacidad del trazo
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  aria-label="Opacidad del trazo"
                  className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                  value={element.style?.strokeOpacity ?? 1}
                  onChange={event => onStyleChange({ strokeOpacity: Number(event.target.value) })}
                />
              </label>
            </>
          )}

          {capabilities.fill && (
            <>
              <label className="text-xs font-bold text-carbon">
                Relleno
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  aria-label="Opacidad de relleno"
                  className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                  value={element.style?.fillOpacity ?? 0.16}
                  onChange={event => onStyleChange({ fillOpacity: Number(event.target.value) })}
                />
              </label>
              <label className="text-xs font-bold text-carbon">
                Relleno resaltado
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  aria-label="Opacidad de relleno resaltado"
                  className="mt-1 w-full rounded-md border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                  value={element.style?.highlightFillOpacity ?? 0.34}
                  onChange={event => onStyleChange({ highlightFillOpacity: Number(event.target.value) })}
                />
              </label>
            </>
          )}
        </div>
      )}

      {capabilities.dashed && (
        <label className="flex items-center gap-2 text-xs font-bold text-carbon cursor-pointer">
          <input
            type="checkbox"
            aria-label="¿Línea discontinua?"
            checked={element.dashed ?? false}
            onChange={event => onElementChange({ dashed: event.target.checked })}
            className="h-4 w-4 accent-pavo cursor-pointer"
          />
          Línea discontinua
        </label>
      )}
      <label className="flex items-center gap-2 text-xs font-bold text-carbon cursor-pointer">
        <input
          type="checkbox"
          checked={element.style?.preserveColorOnHighlight ?? true}
          onChange={event => onStyleChange({ preserveColorOnHighlight: event.target.checked })}
          className="h-4 w-4 accent-pavo cursor-pointer"
        />
        Conservar color al resaltar
      </label>
    </fieldset>
  );
};
