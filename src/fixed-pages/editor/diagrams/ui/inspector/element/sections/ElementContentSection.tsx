import React from 'react';
import type { DiagramHeaderConfiguration, DiagramHeaderReading } from '@/diagrams/public';
import type { ElementPanelProps } from '../../types';
import { DiagramTextRulesEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramTextRulesEditor';
import { DiagramInfoPanelContentEditor } from '@/fixed-pages/editor/diagrams/ui/panels/DiagramInfoPanelContentEditor';
import { elementInspectorCapabilities } from '@/fixed-pages/editor/diagrams/model/elements/elementInspectorCapabilities';
import { parseOptionalNumber } from '../../../workbenchSelection';
import { objectLabelVisible, objectStyle, sceneReferences } from '@/diagrams';
import { elementKind } from '@/fixed-pages/editor/diagrams/model';
import { elementExpression, elementText, labelVisiblePatch, setting, settingPatch, stylePatch, withElementText, withElementTextRules } from '../../elementSettings';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';
import { Callout, Card, controlClassName } from '@/fixed-pages/editor/ui/primitives';

/** Contenido: infoPanel usa el editor completo (bloques + variantes); resto texto/reglas, cotas, medidas, posición/offset y subtítulo. */
export const ElementContentSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
  onUpdateModel,
}) => {
  const { t } = useI18n();
  const kind = elementKind(element);
  const style = objectStyle(element);
  if (element.objectType === 'annotation' && element.variant === 'panel') {
    return (
      <div className="space-y-3">
        <DiagramInfoPanelContentEditor
          model={model}
          panel={element}
          onPanelChange={update => onUpdateElement(element.id, current => current.objectType === 'annotation' ? update(current) : current)}
        />
      </div>
    );
  }

  const refs = sceneReferences(model, element);
  const hasParentRef = refs.length > 0;
  const isCota = kind === 'dimensionLine';
  const isMedida = kind === 'measurement';
  const isMeasurableOrHeadingCandidate = isCota || isMedida || Boolean(elementExpression(element));

  const isInHeaderReadings = Boolean(
    model.header?.readings?.some(r => r.sourceIds.includes(element.id))
  );
  const currentReading = model.header?.readings?.find(r => r.sourceIds.includes(element.id));

  const toggleHeaderReading = (enabled: boolean) => {
    if (!onUpdateModel) return;
    const header: DiagramHeaderConfiguration = model.header ?? { readingsMode: 'automatic', readings: [] };
    const currentReadings = header.readings ?? [];
    if (enabled) {
      if (!currentReadings.some(r => r.sourceIds.includes(element.id))) {
        let index = currentReadings.length + 1;
        while (currentReadings.some(r => r.id === `header-reading-${index}`)) index += 1;
        const newReading: DiagramHeaderReading = {
          id: `header-reading-${index}`,
          sourceIds: [element.id],
          presentation: 'label-value',
        };
        onUpdateModel(
          {
            ...model,
            header: {
              ...header,
              readingsMode: 'custom',
              readings: [...currentReadings, newReading],
            },
          },
          `Añadir ${element.id} a la cabecera`
        );
      }
    } else {
      const nextReadings = currentReadings.filter(r => !r.sourceIds.includes(element.id));
      onUpdateModel(
        {
          ...model,
          header: {
            ...header,
            readings: nextReadings,
          },
        },
        `Quitar ${element.id} de la cabecera`
      );
    }
  };

  const isLabelVisible = objectLabelVisible(element) !== false;

  return (
    <div className="space-y-3">
      {/* Título / Contenido del texto */}
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
          {isCota ? t('editor.diagramInspector.dimensionLabelTemplate') : isMedida ? t('editor.diagramInspector.measureLabelTemplate') : t('editor.diagramInspector.titleText')}
        </label>
        <input
          type="text"
          aria-label={t('editor.diagramInspector.titleOrText')}
          value={elementText(element) || setting(element, 'title') || element.label || ''}
          onChange={e =>
            {
              const text = e.target.value;
              onUpdateElement(element.id, current => withElementText({ ...current, label: text }, text));
            }
          }
          className={controlClassName}
          placeholder={isCota || isMedida ? t('editor.diagramInspector.orCustomLabel', { value: '{value}' }) : t('editor.diagramInspector.titleOrTextPlaceholder')}
        />
        {(isCota || isMedida) && (
          <p className="mt-1 text-[9px] text-carbon/50">
            {renderRichText(t('editor.diagramInspector.useValuePlaceholder', { value: '{value}' }), { code: c => <code className="rounded bg-carbon/5 px-1 py-0.5 font-mono text-[9px]">{c}</code> })}
          </p>
        )}
      </div>

      {/* Visibilidad de la etiqueta en el lienzo */}
      <Card className="flex items-center justify-between">
        <div>
          <span className="block text-[11px] font-bold text-carbon">{t('editor.diagramInspector.showLabelOnCanvas')}</span>
          <span className="block text-[9px] text-carbon/50">
            {isLabelVisible ? t('editor.diagramInspector.visibleInDrawing') : t('editor.diagramInspector.hiddenInTheDrawing')}
          </span>
        </div>
        <input
          type="checkbox"
          aria-label={t('editor.diagramInspector.showLabelOnCanvas')}
          checked={isLabelVisible}
          onChange={e => onUpdateElement(element.id, labelVisiblePatch(e.target.checked))}
          className="h-4 w-4 rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
        />
      </Card>

      {/* Tamaño de la etiqueta o cota */}
      {isLabelVisible && (
        <div>
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            {isCota ? t('editor.diagramInspector.dimensionSizePx') : isMedida ? t('editor.diagramInspector.measureSizePx') : t('editor.diagramInspector.labelSizePx')}
          </label>
          <input
            type="number"
            min="6"
            max="72"
            step="1"
            aria-label={isCota ? t('editor.diagramInspector.dimensionSize') : isMedida ? t('editor.diagramInspector.measureSize') : t('editor.diagramInspector.labelSize')}
            value={style?.labelSize ?? (isCota ? 14 : 16)}
            onChange={e =>
              onUpdateElement(element.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, isCota ? 14 : 16), }))
            }
            className={controlClassName}
          />
        </div>
      )}

      {/* Mostrar como subtítulo / Información bajo el título */}
      {isMeasurableOrHeadingCandidate && (
        <Callout className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-canela">{t('editor.diagramInspector.showInSubtitle')}</span>
              <span className="block text-[9px] text-carbon/50">{t('editor.diagramInspector.headerInfoLabel')}</span>
            </div>
            <input
              type="checkbox"
              aria-label={t('editor.diagramInspector.showAsSubtitle')}
              checked={isInHeaderReadings}
              onChange={e => toggleHeaderReading(e.target.checked)}
              className="h-4 w-4 rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
            />
          </div>

          {isInHeaderReadings && currentReading && (
            <div className="pt-2 border-t border-canela/15 space-y-1.5">
              <label className="block text-[10px] font-bold text-carbon/70">
                {t('editor.diagramInspector.subtitleFormat')}
              </label>
              <select
                aria-label={t('editor.diagramInspector.subtitleFormat')}
                value={currentReading.presentation}
                onChange={e => {
                  if (!onUpdateModel) return;
                  const header = model.header!;
                  const presentation = e.target.value as DiagramHeaderReading['presentation'];
                  onUpdateModel(
                    {
                      ...model,
                      header: {
                        ...header,
                        readings: header.readings.map(r =>
                          r.id === currentReading.id ? { ...r, presentation } : r
                        ),
                      },
                    },
                    `Cambiar formato de lectura ${currentReading.id}`
                  );
                }}
                className={controlClassName}
              >
                <option value="label-value">{t('editor.diagramInspector.formatNameAndValue')}</option>
                <option value="value">{t('editor.diagramInspector.formatValueOnly')}</option>
                <option value="equality">{t('editor.diagramInspector.formatConditionalEquality')}</option>
              </select>
              {currentReading.presentation === 'equality' && (
                <p className="text-[9px] text-canela/90 leading-tight">
                  {t('editor.diagramInspector.equalityCombinedHint')}
                </p>
              )}
            </div>
          )}
        </Callout>
      )}

      {/* Parámetros específicos de Cota (dimensionLine) */}
      {isCota && (
        <div className="space-y-2.5 pt-2 border-t border-carbon/10">
          <span className="block text-[10px] font-bold text-canela uppercase tracking-wider">
            {t('editor.diagramInspector.dimensionSettings')}
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.distanceFromTheReference')}
              </label>
              <input
                type="number"
                step="0.05"
                aria-label={t('editor.diagramInspector.dimensionDistanceOrOffset')}
                value={setting(element, 'offset') ?? 0.35}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('offset', parseOptionalNumber(e.target.value, 0.35)))
                }
                className={controlClassName}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.precisionDecimals')}
              </label>
              <input
                type="number"
                min="0"
                max="12"
                aria-label={t('editor.diagramInspector.decimalPrecision')}
                value={setting(element, 'precision') ?? 2}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('precision', parseOptionalNumber(e.target.value, 2)))
                }
                className={controlClassName}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.unit')}
              </label>
              <input
                type="text"
                aria-label={t('editor.diagramInspector.dimensionUnit')}
                value={setting(element, 'unit') ?? ''}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('unit', e.target.value))
                }
                placeholder={t('editor.diagramInspector.unitPlaceholder')}
                className={controlClassName}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.sizePx')}
              </label>
              <input
                type="number"
                min="6"
                max="72"
                step="1"
                aria-label={t('editor.diagramInspector.dimensionSize')}
                value={style?.labelSize ?? 14}
                onChange={e =>
                  onUpdateElement(element.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, 14), }))
                }
                className={controlClassName}
              />
            </div>
          </div>
        </div>
      )}

      {/* Parámetros específicos de Medida (measurement) */}
      {isMedida && (
        <div className="space-y-2.5 pt-2 border-t border-carbon/10">
          <span className="block text-[10px] font-bold text-canela uppercase tracking-wider">
            {t('editor.diagramInspector.measureSettings')}
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.unit')}
              </label>
              <input
                type="text"
                aria-label={t('editor.diagramInspector.measureUnit')}
                value={setting(element, 'unit') ?? 'cm'}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('unit', e.target.value))
                }
                className={controlClassName}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.precisionDecimals')}
              </label>
              <input
                type="number"
                min="0"
                max="12"
                aria-label={t('editor.diagramInspector.measurePrecision')}
                value={setting(element, 'precision') ?? 2}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('precision', parseOptionalNumber(e.target.value, 2)))
                }
                className={controlClassName}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                {t('editor.diagramInspector.sizePx')}
              </label>
              <input
                type="number"
                min="6"
                max="72"
                step="1"
                aria-label={t('editor.diagramInspector.measureSize')}
                value={style?.labelSize ?? 16}
                onChange={e =>
                  onUpdateElement(element.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, 16), }))
                }
                className={controlClassName}
              />
            </div>
          </div>
        </div>
      )}

      {/* Posición a lo largo del padre (para medidas, etiquetas, textos referenciados) */}
      {hasParentRef && !isCota && (
        <div className="space-y-2 pt-2 border-t border-carbon/10">
          <span className="block text-[10px] font-bold text-canela uppercase tracking-wider">
            {t('editor.diagramInspector.positionRelativeToRef', { refs: refs.join(', ') })}
          </span>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-carbon/75">
                {t('editor.diagramInspector.positionAlongElement', { percent: Math.round((Number(setting(element, 'anchorParameter') ?? 0.5)) * 100) })}
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              aria-label={t('editor.diagramInspector.positionAlongParentLabel')}
              value={setting(element, 'anchorParameter') ?? 0.5}
              onChange={e =>
                onUpdateElement(element.id, settingPatch('anchorParameter', parseOptionalNumber(e.target.value, 0.5)))
              }
              className="w-full cursor-pointer accent-canela"
            />
          </div>
        </div>
      )}

      {/* Desplazamiento / Offsets finos de texto (X, Y) para TODOS los elementos de texto/cota/medida */}
      <div className="space-y-2 pt-2 border-t border-carbon/10">
        <span className="block text-[10px] font-bold text-canela uppercase tracking-wider">
          {t('editor.diagramInspector.fineTextOffset')}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-carbon/75 mb-1">
              {t('editor.diagramInspector.offsetX')}
            </label>
            <input
              type="number"
              step="0.05"
              aria-label={t('editor.diagramInspector.xOffsetFromParent')}
              value={style?.textOffset?.[0] ?? (kind === 'label' ? 0.04 : isCota ? 0 : 0.25)}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ textOffset: [
                      parseOptionalNumber(e.target.value, 0),
                      style?.textOffset?.[1] ?? (kind === 'label' ? 0.04 : isCota ? 0 : 0.35),
                    ], }))
              }
              className={controlClassName}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-carbon/75 mb-1">
              {t('editor.diagramInspector.offsetY')}
            </label>
            <input
              type="number"
              step="0.05"
              aria-label={t('editor.diagramInspector.yOffsetFromParent')}
              value={style?.textOffset?.[1] ?? (kind === 'label' ? 0.04 : isCota ? 0 : 0.35)}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ textOffset: [
                      style?.textOffset?.[0] ?? (kind === 'label' ? 0.04 : isCota ? 0 : 0.25),
                      parseOptionalNumber(e.target.value, 0),
                    ], }))
              }
              className={controlClassName}
            />
          </div>
        </div>
      </div>

      {/* Reglas condicionales de texto si aplica */}
      {elementInspectorCapabilities(kind).conditionalText && (
        <div className="pt-2 border-t border-carbon/10">
          <DiagramTextRulesEditor
            model={model}
            element={element}
            onChange={textRules => onUpdateElement(element.id, current => withElementTextRules(current, textRules))}
          />
        </div>
      )}
    </div>
  );
};
