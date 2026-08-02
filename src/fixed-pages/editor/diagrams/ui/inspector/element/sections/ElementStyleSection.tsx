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
    <div className="p-2.5 space-y-2.5 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
      <div>
        <label className="block text-[11px] font-bold text-carbon/70 mb-1">Color Principal</label>
        <div className="flex flex-wrap gap-1.5">
          {PALETTE_TOKENS.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => onUpdateElement(element.id, { color: c.id })}
              className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${c.bgClass} ${
                element.color === c.id ? 'border-carbon scale-110 shadow-xs' : 'border-transparent opacity-80'
              }`}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {showStroke && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">
              Grosor Trazo (px)
              <input
                type="number"
                step="0.5"
                min="1"
                max="10"
                aria-label="Grosor Trazo (px)"
                value={element.style?.strokeWidth ?? 2.4}
                onChange={e =>
                  onUpdateElement(element.id, {
                    style: { ...(element.style || {}), strokeWidth: parseFloat(e.target.value) || 2.4 },
                  })
                }
                className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon font-bold"
              />
            </label>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">
              Grosor Trazo en Hover (px)
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                aria-label="Grosor Trazo en Hover (px)"
                value={element.style?.highlightStrokeWidth ?? 3}
                onChange={e =>
                  onUpdateElement(element.id, {
                    style: { ...(element.style || {}), highlightStrokeWidth: parseFloat(e.target.value) || 3 },
                  })
                }
                className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon font-bold"
              />
            </label>
          </div>
        </div>
      )}

      {showFill && (
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-carbon/10">
          <div>
            <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">
              Opacidad Relleno
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
                className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
              />
            </label>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">
              Opacidad Relleno en Hover
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={element.style?.highlightFillOpacity ?? 0.34}
                onChange={e =>
                  onUpdateElement(element.id, {
                    style: { ...(element.style || {}), highlightFillOpacity: parseFloat(e.target.value) || 0.34 },
                  })
                }
                className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
              />
            </label>
          </div>
        </div>
      )}

      {showAngleRadius && (
        <div className="pt-1 border-t border-carbon/10">
          <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
            Radio del Arco (px)
            <input
              type="number"
              min="10"
              max="80"
              value={element.style?.angleRadius ?? 28}
              onChange={e =>
                onUpdateElement(element.id, {
                  style: { ...(element.style || {}), angleRadius: parseInt(e.target.value, 10) || 28 },
                })
              }
              className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
            />
          </label>
        </div>
      )}

      {(capabilities.fontSize || capabilities.textOffset) && (
        <DiagramNativeLabelEditor
          label={element.label}
          visible={element.showLabel ?? true}
          size={element.style?.labelSize ?? 16}
          offset={element.style?.labelOffset}
          position={element.style?.labelPosition}
          onVisibleChange={showLabel => onUpdateElement(element.id, { showLabel })}
          onStyleChange={style => onUpdateElement(element.id, { style: { ...element.style, ...style } })}
        />
      )}

      {capabilities.attachedLabel && (
        <div className="rounded border border-ocre/20 bg-ocre/5 p-2 text-xs">
          <p className="font-bold text-carbon">Etiqueta vinculada</p>
          {attachedLabel ? (
            <label className="mt-1 flex items-center gap-2 text-carbon">
              <input
                type="checkbox"
                checked={attachedLabel.visible !== false}
                onChange={event => onUpdateElement(attachedLabel.id, { visible: event.target.checked })}
              />
              Mostrar junto al elemento
            </label>
          ) : (
            <p className="mt-1 text-[10px] text-carbon/55">Añade una etiqueta y ancla su referencia a este objeto para vincularla.</p>
          )}
        </div>
      )}

      <div className="space-y-1.5 pt-2 border-t border-carbon/10">
        {showDashed && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`dashed-${element.id}`}
              checked={element.dashed || false}
              onChange={e => onUpdateElement(element.id, { dashed: e.target.checked })}
              className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
            />
            <label htmlFor={`dashed-${element.id}`} className="text-xs font-bold text-carbon/80 cursor-pointer">
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
          <label htmlFor={`preserveColor-${element.id}`} className="text-xs text-carbon/80 cursor-pointer">
            Conservar color propio en hover (sin cambiar a resaltado amarillo)
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
          <label htmlFor={`highlightable-${element.id}`} className="text-xs text-carbon/80 cursor-pointer">
            Permitir resaltado visual con el puntero
          </label>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">Capa del Tablero</label>
        <select
          value={element.layerId || 'geometry'}
          onChange={e => onUpdateElement(element.id, { layerId: e.target.value })}
          className="w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
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
