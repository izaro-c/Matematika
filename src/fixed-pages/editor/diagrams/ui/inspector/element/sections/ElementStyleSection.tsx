import React from 'react';
import { PALETTE_TOKENS } from '../../paletteTokens';
import type { ElementPanelProps } from '../../types';
import { availableLayers } from '../../utils';
import { parseOptionalNumber } from '../../../workbenchSelection';
import {
  showsAngleRadius,
  showsDashed,
  showsFillOpacity,
  showsStrokeControls,
} from '../../elementSections';
import { DiagramNativeLabelEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramNativeLabelEditor';
import { elementInspectorCapabilities } from '@/fixed-pages/editor/diagrams/model/elements/elementInspectorCapabilities';
import { elementKind } from '@/fixed-pages/editor/diagrams/model';
import { dashedPatch, stylePatch } from '../../elementSettings';
import { curveAreaFill, objectDashed, objectStyle, withObjectLabelVisible, withObjectStylePatch } from '@/diagrams';

/** Propiedades: color, strokeWidth, highlightStrokeWidth, fillOpacity, highlightFillOpacity, angleRadius, dashed, preserveColorOnHighlight, highlightable, layerId */
export const ElementStyleSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
}) => {
  const layers = availableLayers(model);
  const kind = elementKind(element);
  const style = objectStyle(element);
  const showStroke = showsStrokeControls(kind);
  const showFill = showsFillOpacity(kind, curveAreaFill(element));
  const showAngleRadius = showsAngleRadius(kind);
  const showDashed = showsDashed(kind);
  const capabilities = elementInspectorCapabilities(kind);
  const attachedLabel = kind === 'label'
    ? undefined
    : model.objects.find(item => item.objectType === 'annotation' && item.variant === 'label' && item.anchor.type === 'object' && item.anchor.object === element.id);
  const attachedStyle = attachedLabel ? objectStyle(attachedLabel) : undefined;

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
              value={style?.strokeWidth ?? 2.4}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ strokeWidth: parseOptionalNumber(e.target.value, 2.4) }))
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 font-bold"
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
              value={style?.highlightStrokeWidth ?? 3}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ highlightStrokeWidth: parseOptionalNumber(e.target.value, 3) }))
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 font-bold"
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
              value={style?.fillOpacity ?? 0.2}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ fillOpacity: parseOptionalNumber(e.target.value, 0) }))
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
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
              value={style?.highlightFillOpacity ?? 0.35}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ highlightFillOpacity: parseOptionalNumber(e.target.value, 0.35) }))
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
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
            value={style?.angleRadius ?? 1}
            onChange={e =>
              onUpdateElement(element.id, stylePatch({ angleRadius: parseOptionalNumber(e.target.value, 1) }))
            }
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
          />
        </div>
      )}

      {['dimensionLine', 'measurement', 'label', 'text', 'formula'].includes(kind) ? (
        <div className="pt-2 border-t border-carbon/10">
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            {kind === 'dimensionLine' ? 'Tamaño de la Cota (px)' : 'Tamaño de la Etiqueta (px)'}
          </label>
          <input
            type="number"
            min="6"
            max="72"
            step="1"
            aria-label={kind === 'dimensionLine' ? 'Tamaño de cota' : 'Tamaño de etiqueta'}
            value={style?.labelSize ?? (kind === 'dimensionLine' ? 14 : 16)}
            onChange={e =>
              onUpdateElement(element.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, kind === 'dimensionLine' ? 14 : 16), }))
            }
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
          />
        </div>
      ) : (capabilities.fontSize || capabilities.textOffset) ? (
        <DiagramNativeLabelEditor
          label={element.label}
          visible={element.objectType !== 'region' && element.objectType !== 'area' && element.objectType !== 'mark' && element.appearance?.labelVisible === true}
          size={style?.labelSize ?? 16}
          offset={style?.labelOffset}
          position={style?.labelPosition}
          alongPath={['segment', 'line', 'ray', 'parallel', 'perpendicular', 'angleBisector', 'segmentExtension', 'arc', 'functionCurve', 'parametricCurve', 'poincareGeodesic', 'poincareArc'].includes(kind)}
          onVisibleChange={showLabel => onUpdateElement(element.id, current => withObjectLabelVisible(current, showLabel))}
          onStyleChange={update => onUpdateElement(element.id, current => withObjectStylePatch(current, update))}
        />
      ) : null}

      {capabilities.attachedLabel && (
        <div className="rounded-lg border border-canela/20 bg-canela/5 p-2.5 text-xs">
          <p className="font-bold text-carbon">Etiqueta vinculada</p>
          {attachedLabel ? (
            <div className="mt-1.5 space-y-2">
              <label className="flex items-center gap-2 text-carbon cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={attachedLabel.visible !== false}
                  onChange={event => onUpdateElement(attachedLabel.id, { visible: event.target.checked })}
                  className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
                />
                Mostrar junto al elemento
              </label>
              {attachedLabel.visible !== false && (
                <div>
                  <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">Tamaño de la etiqueta (px)</label>
                  <input
                    type="number"
                    min="6"
                    max="72"
                    step="1"
                    aria-label="Tamaño de etiqueta vinculada"
                    value={attachedStyle?.labelSize ?? 14}
                    onChange={e =>
                      onUpdateElement(attachedLabel.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, 14), }))
                    }
                    className="w-full rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs focus:border-canela focus:outline-none"
                  />
                </div>
              )}
            </div>
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
              checked={objectDashed(element)}
              onChange={e => onUpdateElement(element.id, dashedPatch(e.target.checked))}
              className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
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
            checked={style?.preserveColorOnHighlight !== false}
            onChange={e =>
              onUpdateElement(element.id, stylePatch({ preserveColorOnHighlight: e.target.checked }))
            }
            className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
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
            className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
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
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 cursor-pointer"
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
