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
import { curveAreaFill, objectDashed, objectStyle, omitKeys, withObjectLabelVisible, withObjectStylePatch, type DiagramObject, type PathArrow } from '@/diagrams';
import { useI18n } from '@/i18n';
import { Callout, Swatch, controlClassName } from '@/fixed-pages/editor/ui/primitives';

function withPathArrow<T extends DiagramObject>(current: T, arrow: PathArrow | undefined): T {
  if (current.objectType !== 'path') return current;
  const appearance = arrow ? { ...current.appearance, arrow } : omitKeys(current.appearance ?? {}, 'arrow');
  return (Object.keys(appearance).length > 0 ? { ...current, appearance } : omitKeys(current, 'appearance')) as T;
}

/** Propiedades: color, strokeWidth, highlightStrokeWidth, fillOpacity, highlightFillOpacity, angleRadius, dashed, preserveColorOnHighlight, highlightable, layerId */
export const ElementStyleSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
}) => {
  const { t } = useI18n();
  const layers = availableLayers(model, t);
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
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1.5">{t('editor.diagramInspector.mainColor')}</label>
        <div className="flex flex-wrap gap-2">
          {PALETTE_TOKENS.map(c => (
            <Swatch
              key={c.id}
              label={c.name}
              selected={element.color === c.id}
              onClick={() => onUpdateElement(element.id, { color: c.id })}
              className={c.bgClass}
            />
          ))}
        </div>
      </div>

      {showStroke && (
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              {t('editor.diagramInspector.strokeWidthPx')}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              aria-label={t('editor.diagramInspector.strokeWidthPx')}
              value={style?.strokeWidth ?? 2.4}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ strokeWidth: parseOptionalNumber(e.target.value, 2.4) }))
              }
              className={controlClassName}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              {t('editor.diagramInspector.hoverStrokeWidthPx')}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="30"
              aria-label={t('editor.diagramInspector.strokeWidthOnHover')}
              value={style?.highlightStrokeWidth ?? 3}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ highlightStrokeWidth: parseOptionalNumber(e.target.value, 3) }))
              }
              className={controlClassName}
            />
          </div>
        </div>
      )}

      {showFill && (
        <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-carbon/10">
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              {t('editor.diagramInspector.fillOpacity')}
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1"
              aria-label={t('editor.diagramInspector.fillOpacity')}
              value={style?.fillOpacity ?? 0.2}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ fillOpacity: parseOptionalNumber(e.target.value, 0) }))
              }
              className={controlClassName}
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              {t('editor.diagramInspector.hoverFillOpacity')}
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
              className={controlClassName}
            />
          </div>
        </div>
      )}

      {showAngleRadius && (
        <div className="pt-2 border-t border-carbon/10">
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            {t('editor.diagramInspector.arcRadiusPx')}
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
            className={controlClassName}
          />
        </div>
      )}

      {['dimensionLine', 'measurement', 'label', 'text', 'formula'].includes(kind) ? (
        <div className="pt-2 border-t border-carbon/10">
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            {kind === 'dimensionLine' ? t('editor.diagramInspector.dimensionSizePxTitled') : t('editor.diagramInspector.labelSizePxTitled')}
          </label>
          <input
            type="number"
            min="6"
            max="72"
            step="1"
            aria-label={kind === 'dimensionLine' ? t('editor.diagramInspector.dimensionSize') : t('editor.diagramInspector.labelSize')}
            value={style?.labelSize ?? (kind === 'dimensionLine' ? 14 : 16)}
            onChange={e =>
              onUpdateElement(element.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, kind === 'dimensionLine' ? 14 : 16), }))
            }
            className={controlClassName}
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
        <Callout className="text-xs">
          <p className="font-bold text-carbon">{t('editor.diagramInspector.linkedLabel')}</p>
          {attachedLabel ? (
            <div className="mt-1.5 space-y-2">
              <label className="flex items-center gap-2 text-carbon cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={attachedLabel.visible !== false}
                  onChange={event => onUpdateElement(attachedLabel.id, { visible: event.target.checked })}
                  className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
                />
                {t('editor.diagramInspector.showNextToElement')}
              </label>
              {attachedLabel.visible !== false && (
                <div>
                  <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">{t('editor.diagramInspector.labelSizePx')}</label>
                  <input
                    type="number"
                    min="6"
                    max="72"
                    step="1"
                    aria-label={t('editor.diagramInspector.linkedLabelSize')}
                    value={attachedStyle?.labelSize ?? 14}
                    onChange={e =>
                      onUpdateElement(attachedLabel.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, 14), }))
                    }
                    className={controlClassName}
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="mt-1 text-[10px] text-carbon/55">{t('editor.diagramInspector.linkedLabelHint')}</p>
          )}
        </Callout>
      )}

      {kind === 'segment' && element.objectType === 'path' && (
        <div className="pt-2 border-t border-carbon/10">
          <label htmlFor={`arrow-${element.id}`} className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            {t('editor.diagramInspector.arrowHead')}
          </label>
          <select
            id={`arrow-${element.id}`}
            value={element.appearance?.arrow ?? ''}
            onChange={e => onUpdateElement(element.id, current => withPathArrow(current, (e.target.value || undefined) as PathArrow | undefined))}
            className={controlClassName}
          >
            <option value="">{t('editor.diagramInspector.arrowNone')}</option>
            <option value="start">{t('editor.diagramInspector.arrowStart')}</option>
            <option value="end">{t('editor.diagramInspector.arrowEnd')}</option>
            <option value="both">{t('editor.diagramInspector.arrowBoth')}</option>
          </select>
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
              {t('editor.diagramInspector.dashedAuxiliaryLine')}
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
            {t('editor.diagramInspector.keepOwnColorNoYellow')}
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
            {t('editor.diagramInspector.allowPointerHighlight')}
          </label>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">{t('editor.diagramInspector.boardLayer')}</label>
        <select
          value={element.layerId || 'geometry'}
          onChange={e => onUpdateElement(element.id, { layerId: e.target.value })}
          className={controlClassName}
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
