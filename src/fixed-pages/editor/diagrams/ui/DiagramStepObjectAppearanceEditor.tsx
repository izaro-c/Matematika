import { isControlObject, isPositionedPoint, objectDashed, objectKind, objectStyle } from '@/diagrams';
import React from 'react';
import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS } from '@/diagrams/public';
import type { DiagramStepObjectState, DiagramStepVisualStyle } from '@/diagrams';
import type { ElementKind, VisualElement, VisualPoint, VisualSlider } from '../model/types';
import { COLOR_OPTIONS } from '../model';
import { elementInspectorCapabilities } from '../model/elements/elementInspectorCapabilities';
import { DiagramField } from './primitives';
import { useI18n } from '@/i18n';

type StepSceneItem = VisualPoint | VisualElement | VisualSlider;

interface DiagramStepObjectAppearanceEditorProps {
  object: StepSceneItem;
  state: DiagramStepObjectState;
  onStateChange: (update: Partial<DiagramStepObjectState>, label: string) => void;
}

function isPoint(object: StepSceneItem): object is VisualPoint {
  return isPositionedPoint(object);
}

function isSlider(object: StepSceneItem): object is VisualSlider {
  return isControlObject(object);
}

function angleRadiusFallback(element: VisualElement): number {
  return element.objectType === 'angle' && element.marker === 'arc'
    ? DEFAULT_ANGLE_RADIUS
    : DEFAULT_RIGHT_ANGLE_RADIUS;
}

function markHeightFallback(element: VisualElement): number {
  if (element.objectType === 'mark' && element.variant === 'graduation') return 10;
  if (element.objectType === 'mark' && element.variant === 'parallel') return 0.42;
  return 0.32;
}

function editStyle(
  state: DiagramStepObjectState,
  onStateChange: DiagramStepObjectAppearanceEditorProps['onStateChange'],
  update: Partial<DiagramStepVisualStyle>,
  label: string,
): void {
  onStateChange({ style: { ...state.style, ...update } }, label);
}

export const DiagramStepObjectAppearanceEditor: React.FC<DiagramStepObjectAppearanceEditorProps> = ({
  object,
  state,
  onStateChange,
}) => {
  const { t } = useI18n();
  const capabilities = isPoint(object)
    ? { stroke: false, fill: false, dashed: false, pointSize: true, angleRadius: false, markHeight: false, fontSize: true, attachedLabel: true }
    : isSlider(object)
      ? { stroke: false, fill: false, dashed: false, pointSize: false, angleRadius: false, markHeight: false, fontSize: true, attachedLabel: true }
      : elementInspectorCapabilities(objectKind(object) as ElementKind);
  const baseStyle = objectStyle(object) ?? {};
  const stepStyle = state.style ?? {};
  const hasAppearanceControls = capabilities.stroke || capabilities.fill || capabilities.pointSize
    || capabilities.angleRadius || capabilities.markHeight || capabilities.fontSize || capabilities.dashed;

  return (
    <div className="space-y-3">
      <fieldset className="space-y-3 rounded border border-carbon/10 bg-lienzo p-2">
        <legend className="px-1 ac-label ac-label--sm ac-label--soft">{t('editor.diagramEditors.labelInThisStep')}</legend>
        <label className="flex items-center gap-2 text-xs font-bold text-carbon">
          <input
            type="checkbox"
            checked={state.showLabel ?? ('showLabel' in object ? object.showLabel !== false : true)}
            onChange={event => onStateChange({ showLabel: event.target.checked }, 'Cambiar visibilidad de etiqueta del paso')}
          />
          {t('editor.diagramEditors.showLabel')}
        </label>
        <DiagramField label={t('editor.diagramEditors.temporaryText')}>
          <input
            placeholder={object.label}
            value={state.label ?? ''}
            onChange={event => onStateChange({ label: event.target.value || undefined }, 'Editar etiqueta temporal')}
          />
        </DiagramField>
        {capabilities.fontSize && (
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs font-bold text-carbon">
              {t('editor.diagramEditors.size')}
              <input
                type="number"
                min="6"
                max="72"
                step="1"
                aria-label={t('editor.diagramEditors.temporaryLabelSize')}
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                placeholder={String(baseStyle.labelSize ?? (isPoint(object) ? 14 : 16))}
                value={stepStyle.labelSize ?? ''}
                onChange={event => editStyle(
                  state,
                  onStateChange,
                  { labelSize: event.target.value ? Number(event.target.value) : undefined },
                  'Editar tamaño temporal de etiqueta',
                )}
              />
            </label>
            <label className="text-xs font-bold text-carbon">
              {t('editor.diagramEditors.xOffset')}
              <input
                type="number"
                step="1"
                aria-label={t('editor.diagramEditors.temporaryHorizontalLabelOffset')}
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                placeholder={String(baseStyle.labelOffset?.[0] ?? 0)}
                value={stepStyle.labelOffset?.[0] ?? ''}
                onChange={event => editStyle(
                  state,
                  onStateChange,
                  {
                    labelOffset: [
                      event.target.value ? Number(event.target.value) : (baseStyle.labelOffset?.[0] ?? 0),
                      stepStyle.labelOffset?.[1] ?? baseStyle.labelOffset?.[1] ?? 0,
                    ],
                  },
                  'Editar desplazamiento temporal de etiqueta',
                )}
              />
            </label>
            <label className="text-xs font-bold text-carbon sm:col-span-2">
              {t('editor.diagramEditors.yOffset')}
              <input
                type="number"
                step="1"
                aria-label={t('editor.diagramEditors.temporaryVerticalLabelOffset')}
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                placeholder={String(baseStyle.labelOffset?.[1] ?? 0)}
                value={stepStyle.labelOffset?.[1] ?? ''}
                onChange={event => editStyle(
                  state,
                  onStateChange,
                  {
                    labelOffset: [
                      stepStyle.labelOffset?.[0] ?? baseStyle.labelOffset?.[0] ?? 0,
                      event.target.value ? Number(event.target.value) : (baseStyle.labelOffset?.[1] ?? 0),
                    ],
                  },
                  'Editar desplazamiento temporal de etiqueta',
                )}
              />
            </label>
          </div>
        )}
      </fieldset>

      {isSlider(object) && (
        <fieldset className="space-y-3 rounded border border-carbon/10 bg-lienzo p-2">
          <legend className="px-1 ac-label ac-label--sm ac-label--soft">{t('editor.diagramEditors.stepSliderValue')}</legend>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-carbon">{t('editor.diagramEditors.temporaryValue')}</span>
              <span className="font-mono font-bold text-canela">
                {state.value !== undefined ? state.value : `${object.value} (base)`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={object.range.min}
                max={object.range.max}
                step={object.range.step || 0.01}
                value={state.value !== undefined ? state.value : object.value}
                onChange={event => onStateChange(
                  { value: Number(event.target.value) },
                  'Editar valor del deslizador en el paso',
                )}
                className="w-full accent-canela cursor-pointer"
              />
              <input
                type="number"
                min={object.range.min}
                max={object.range.max}
                step={object.range.step || 0.01}
                value={state.value !== undefined ? state.value : ''}
                placeholder={String(object.value)}
                onChange={event => onStateChange(
                  { value: event.target.value !== '' ? Number(event.target.value) : undefined },
                  'Editar valor numérico del deslizador en el paso',
                )}
                className="w-20 rounded border border-carbon/20 bg-lienzo p-1 text-xs text-right font-mono"
              />
            </div>
            {state.value !== undefined && (
              <button
                type="button"
                onClick={() => onStateChange({ value: undefined }, 'Restablecer valor base del deslizador')}
                className="text-[10px] text-carbon/60 hover:text-granada underline cursor-pointer"
              >
                {t('editor.diagramEditors.resetBaseValue', { value: object.value })}
              </button>
            )}
          </div>
        </fieldset>
      )}

      {!isSlider(object) && (
        <fieldset className="space-y-3 rounded border border-carbon/10 bg-lienzo p-2">
          <legend className="px-1 ac-label ac-label--sm ac-label--soft">{t('editor.diagramEditors.temporaryAppearance')}</legend>
          <DiagramField label={t('editor.diagramEditors.objectColor')}>
            <select
              aria-label={t('editor.diagramEditors.temporaryObjectColor')}
              value={state.color ?? ''}
              onChange={event => onStateChange(
                { color: (event.target.value || undefined) as DiagramStepObjectState['color'] },
                'Cambiar color temporal del objeto',
              )}
            >
              <option value="">{t('editor.diagramEditors.keepOriginalColor', { color: object.color })}</option>
              {COLOR_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </DiagramField>

          {hasAppearanceControls && (
            <div className="grid grid-cols-2 gap-2">
              {capabilities.pointSize && (
                <label className="text-xs font-bold text-carbon">
                  {t('editor.diagramEditors.pointSize')}
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    aria-label={t('editor.diagramEditors.temporaryPointSize')}
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                    placeholder={String(baseStyle.pointSize ?? 7)}
                    value={stepStyle.pointSize ?? ''}
                    onChange={event => editStyle(
                      state,
                      onStateChange,
                      { pointSize: event.target.value ? Number(event.target.value) : undefined },
                      'Editar tamaño temporal del punto',
                    )}
                  />
                </label>
              )}

              {capabilities.angleRadius && !isPoint(object) && (
                <label className="col-span-2 text-xs font-bold text-carbon">
                  {t('editor.diagramEditors.angularRadius')}
                  <input
                    type="number"
                    min="0.05"
                    max="10"
                    step="0.05"
                    aria-label={t('editor.diagramEditors.stepAngleRadius')}
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                    placeholder={String(baseStyle.angleRadius ?? angleRadiusFallback(object))}
                    value={stepStyle.angleRadius ?? ''}
                    onChange={event => editStyle(
                      state,
                      onStateChange,
                      { angleRadius: event.target.value ? Number(event.target.value) : undefined },
                      'Editar radio angular temporal',
                    )}
                  />
                </label>
              )}

              {capabilities.markHeight && !isPoint(object) && (
                <label className="col-span-2 text-xs font-bold text-carbon">
                  {t('editor.diagramEditors.markHeight')}
                  <input
                    type="number"
                    min="0.05"
                    max="100"
                    step="0.05"
                    aria-label={t('editor.diagramEditors.temporaryMarkHeight')}
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                    placeholder={String(baseStyle.markHeight ?? markHeightFallback(object))}
                    value={stepStyle.markHeight ?? ''}
                    onChange={event => editStyle(
                      state,
                      onStateChange,
                      { markHeight: event.target.value ? Number(event.target.value) : undefined },
                      'Editar altura temporal de marca',
                    )}
                  />
                </label>
              )}

              {capabilities.stroke && !isPoint(object) && (
                <>
                  <label className="text-xs font-bold text-carbon">
                    {t('editor.diagramEditors.thickness')}
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      aria-label={t('editor.diagramEditors.temporaryStrokeWidth')}
                      className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                      placeholder={String(baseStyle.strokeWidth ?? 2.4)}
                      value={stepStyle.strokeWidth ?? ''}
                      onChange={event => editStyle(
                        state,
                        onStateChange,
                        { strokeWidth: event.target.value ? Number(event.target.value) : undefined },
                        'Editar grosor temporal',
                      )}
                    />
                  </label>
                  <label className="text-xs font-bold text-carbon">
                    {t('editor.diagramEditors.strokeOpacity')}
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      aria-label={t('editor.diagramEditors.temporaryStrokeOpacity')}
                      className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                      placeholder={String(baseStyle.strokeOpacity ?? 1)}
                      value={stepStyle.strokeOpacity ?? ''}
                      onChange={event => editStyle(
                        state,
                        onStateChange,
                        { strokeOpacity: event.target.value ? Number(event.target.value) : undefined },
                        'Editar opacidad temporal del trazo',
                      )}
                    />
                  </label>
                </>
              )}

              {capabilities.fill && !isPoint(object) && (
                <label className="col-span-2 text-xs font-bold text-carbon">
                  {t('editor.diagramEditors.fillOpacity')}
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    aria-label={t('editor.diagramEditors.temporaryFillOpacity')}
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                    placeholder={String(baseStyle.fillOpacity ?? 0.16)}
                    value={stepStyle.fillOpacity ?? ''}
                    onChange={event => editStyle(
                      state,
                      onStateChange,
                      { fillOpacity: event.target.value ? Number(event.target.value) : undefined },
                      'Editar opacidad temporal de relleno',
                    )}
                  />
                </label>
              )}
            </div>
          )}

          {capabilities.dashed && !isPoint(object) && (
            <label className="flex items-center gap-2 text-xs font-bold text-carbon">
              <input
                type="checkbox"
                checked={state.dashed ?? objectDashed(object)}
                onChange={event => onStateChange({ dashed: event.target.checked }, 'Cambiar trazo discontinuo temporal')}
              />
              {t('editor.diagramEditors.stepDashedLine')}
            </label>
          )}
        </fieldset>
      )}
    </div>
  );
};

export default DiagramStepObjectAppearanceEditor;
