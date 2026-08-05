import React from 'react';
import { PALETTE_TOKENS } from '../../paletteTokens';
import type { ElementPanelProps } from '../../types';
import { availableLayers } from '../../utils';
import {
  showsAngleRadius,
  showsDashed,
  showsFillOpacity,
  showsStrokeControls,
} from '../../elementSections';
import { DiagramNativeLabelEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramNativeLabelEditor';
import { elementInspectorCapabilities } from '@/fixed-pages/editor/diagrams/model/elements/elementInspectorCapabilities';

/** Propiedades: color, strokeWidth, highlightStrokeWidth, fillOpacity, highlightFillOpacity, angleRadius, dashed, preserveColorOnHighlight, highlightable, layerId */
export const ElementStyleSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
}) => {
  const layers = availableLayers(model);
  const showStroke = showsStrokeControls(element.kind);
  const showFill = showsFillOpacity(element.kind, element.properties?.areaFill);
  const showAngleRadius = showsAngleRadius(element.kind);
  const showDashed = showsDashed(element.kind);
  const capabilities = elementInspectorCapabilities(element.kind);
  const attachedLabel = element.kind === 'label'
    ? undefined
    : model.elements.find(item => item.kind === 'label' && item.refs[0] === element.id);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1.5">Color Principal</label>
        <div className="flex flex-wrap gap-2">
          {PALETTE_TOKENS.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => onUpdateElement(element.id, { color: c.id })}
              className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${c.bgClass} ${
                element.color === c.id ? 'border-carbon scale-110 shadow-xs ring-2 ring-carbon/20' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {showStroke && (
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              Grosor Trazo (px)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              aria-label="Grosor Trazo (px)"
              value={element.style?.strokeWidth ?? 2.4}
              onChange={e =>
                onUpdateElement(element.id, {
                  style: { ...(element.style || {}), strokeWidth: parseFloat(e.target.value) || 2.4 },
                })
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 font-bold"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              Grosor Trazo Hover (px)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="30"
              aria-label="Grosor Trazo en Hover (px)"
              value={element.style?.highlightStrokeWidth ?? 3}
              onChange={e =>
                onUpdateElement(element.id, {
                  style: { ...(element.style || {}), highlightStrokeWidth: parseFloat(e.target.value) || 3 },
                })
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 font-bold"
            />
          </div>
        </div>
      )}

      {showFill && (
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-carbon/10">
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              Opacidad Relleno
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              aria-label="Opacidad Relleno"
              value={element.style?.fillOpacity ?? 0.2}
              onChange={e =>
                onUpdateElement(element.id, {
                  style: { ...(element.style || {}), fillOpacity: parseFloat(e.target.value) || 0 },
                })
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              Opacidad Relleno Hover
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={element.style?.highlightFillOpacity ?? 0.35}
              onChange={e =>
                onUpdateElement(element.id, {
                  style: { ...(element.style || {}), highlightFillOpacity: parseFloat(e.target.value) || 0.35 },
                })
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
            />
          </div>
        </div>
      )}

      {showAngleRadius && (
        <div className="pt-2 border-t border-carbon/10">
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            Radio del Arco (px)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="80"
            value={element.style?.angleRadius ?? 1}
            onChange={e =>
              onUpdateElement(element.id, {
                style: { ...(element.style || {}), angleRadius: parseFloat(e.target.value) || 1 },
              })
            }
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
          />
        </div>
      )}

      {(capabilities.fontSize || capabilities.textOffset) && (
        <DiagramNativeLabelEditor
          label={element.label}
          visible={element.showLabel === true}
          size={element.style?.labelSize ?? 16}
          offset={element.style?.labelOffset}
          position={element.style?.labelPosition}
          alongPath={['segment', 'line', 'ray', 'arc', 'functionCurve', 'parametricCurve', 'poincareGeodesic', 'poincareArc'].includes(element.kind)}
          onVisibleChange={showLabel => onUpdateElement(element.id, { showLabel })}
          onStyleChange={style => onUpdateElement(element.id, { style: { ...element.style, ...style } })}
        />
      )}

      {capabilities.attachedLabel && (
        <div className="rounded-lg border border-salvia/20 bg-salvia/5 p-2.5 text-xs">
          <p className="font-bold text-carbon">Etiqueta vinculada</p>
          {attachedLabel ? (
            <label className="mt-1.5 flex items-center gap-2 text-carbon cursor-pointer select-none">
              <input
                type="checkbox"
                checked={attachedLabel.visible !== false}
                onChange={event => onUpdateElement(attachedLabel.id, { visible: event.target.checked })}
                className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
              />
              Mostrar junto al elemento
            </label>
          ) : (
            <p className="mt-1 text-[10px] text-carbon/55">Añade una etiqueta y ancla su referencia a este objeto para vincularla.</p>
          )}
        </div>
      )}

      <div className="space-y-2 pt-2 border-t border-carbon/10">
        {showDashed && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`dashed-${element.id}`}
              checked={element.dashed || false}
              onChange={e => onUpdateElement(element.id, { dashed: e.target.checked })}
              className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
            />
            <label htmlFor={`dashed-${element.id}`} className="text-xs font-bold text-carbon/80 cursor-pointer select-none">
              Línea Discontinua / Auxiliar
            </label>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`preserveColor-${element.id}`}
            checked={element.style?.preserveColorOnHighlight !== false}
            onChange={e =>
              onUpdateElement(element.id, {
                style: { ...(element.style || {}), preserveColorOnHighlight: e.target.checked },
              })
            }
            className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
          />
          <label htmlFor={`preserveColor-${element.id}`} className="text-xs text-carbon/80 cursor-pointer select-none">
            Conservar color propio en hover (sin resaltar en amarillo)
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`highlightable-${element.id}`}
            checked={element.selection?.highlightable !== false}
            onChange={e =>
              onUpdateElement(element.id, {
                selection: { ...(element.selection || { selectable: true }), highlightable: e.target.checked },
              })
            }
            className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
          />
          <label htmlFor={`highlightable-${element.id}`} className="text-xs text-carbon/80 cursor-pointer select-none">
            Permitir resaltado visual con el puntero
          </label>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">Capa del Tablero</label>
        <select
          value={element.layerId || 'geometry'}
          onChange={e => onUpdateElement(element.id, { layerId: e.target.value })}
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 cursor-pointer"
        >
          {layers.map(l => (
            <option key={l.id} value={l.id}>
              {l.label} ({l.id})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
