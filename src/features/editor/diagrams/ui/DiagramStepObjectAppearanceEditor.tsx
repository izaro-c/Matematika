import React from 'react';
import { DEFAULT_ANGLE_RADIUS, DEFAULT_RIGHT_ANGLE_RADIUS } from '@/shared/diagrams/public';
import type { DiagramStepObjectState, DiagramStepVisualStyle } from '@/shared/diagrams/spec';
import type { VisualElement, VisualPoint } from '../model/types';
import { COLOR_OPTIONS } from '../model';
import { elementInspectorCapabilities } from '../model/elementInspectorCapabilities';
import { DiagramField } from './primitives';

type StepSceneItem = VisualPoint | VisualElement;

interface DiagramStepObjectAppearanceEditorProps {
  object: StepSceneItem;
  state: DiagramStepObjectState;
  onStateChange: (update: Partial<DiagramStepObjectState>, label: string) => void;
}

function isPoint(object: StepSceneItem): object is VisualPoint {
  return 'constraint' in object;
}

function isSlider(object: StepSceneItem): object is VisualElement & { min: number } {
  return 'min' in object;
}

function angleRadiusFallback(element: VisualElement): number {
  return element.kind === 'angle' || element.kind === 'nonReflexAngle'
    ? DEFAULT_ANGLE_RADIUS
    : DEFAULT_RIGHT_ANGLE_RADIUS;
}

function markHeightFallback(element: VisualElement): number {
  if (element.kind === 'measureTicks') return 10;
  if (element.kind === 'parallelMark') return 0.42;
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
  const capabilities = isPoint(object)
    ? { stroke: false, fill: false, dashed: false, pointSize: true, angleRadius: false, markHeight: false, fontSize: true, attachedLabel: true }
    : elementInspectorCapabilities(object.kind);
  const baseStyle = object.style ?? {};
  const stepStyle = state.style ?? {};
  const hasAppearanceControls = capabilities.stroke || capabilities.fill || capabilities.pointSize
    || capabilities.angleRadius || capabilities.markHeight || capabilities.fontSize || capabilities.dashed;

  return (
    <div className="space-y-3">
      <fieldset className="space-y-3 rounded border border-carbon/10 bg-lienzo p-2">
        <legend className="px-1 ac-label ac-label--sm ac-label--soft">Etiqueta en este paso</legend>
        <label className="flex items-center gap-2 text-xs font-bold text-carbon">
          <input
            type="checkbox"
            checked={state.showLabel ?? ('showLabel' in object ? object.showLabel !== false : true)}
            onChange={event => onStateChange({ showLabel: event.target.checked }, 'Cambiar visibilidad de etiqueta del paso')}
          />
          Mostrar etiqueta
        </label>
        <DiagramField label="Texto temporal">
          <input
            placeholder={object.label}
            value={state.label ?? ''}
            onChange={event => onStateChange({ label: event.target.value || undefined }, 'Editar etiqueta temporal')}
          />
        </DiagramField>
        {capabilities.fontSize && (
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="text-xs font-bold text-carbon">
              Tamaño
              <input
                type="number"
                min="6"
                max="72"
                step="1"
                aria-label="Tamaño temporal de la etiqueta"
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
              Desplazamiento X
              <input
                type="number"
                step="1"
                aria-label="Desplazamiento horizontal temporal de la etiqueta"
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
              Desplazamiento Y
              <input
                type="number"
                step="1"
                aria-label="Desplazamiento vertical temporal de la etiqueta"
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

      {!isSlider(object) && (
        <fieldset className="space-y-3 rounded border border-carbon/10 bg-lienzo p-2">
          <legend className="px-1 ac-label ac-label--sm ac-label--soft">Apariencia temporal</legend>
          <DiagramField label="Color del objeto">
            <select
              aria-label="Color temporal del objeto"
              value={state.color ?? ''}
              onChange={event => onStateChange(
                { color: (event.target.value || undefined) as DiagramStepObjectState['color'] },
                'Cambiar color temporal del objeto',
              )}
            >
              <option value="">Conservar color original ({object.color})</option>
              {COLOR_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </DiagramField>

          {hasAppearanceControls && (
            <div className="grid grid-cols-2 gap-2">
              {capabilities.pointSize && (
                <label className="text-xs font-bold text-carbon">
                  Tamaño del punto
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    aria-label="Tamaño temporal del punto"
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
                  Radio angular
                  <input
                    type="number"
                    min="0.05"
                    max="10"
                    step="0.05"
                    aria-label="Radio temporal de la marca angular"
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
                  Altura de marca
                  <input
                    type="number"
                    min="0.05"
                    max="100"
                    step="0.05"
                    aria-label="Altura temporal de la marca"
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
                    Grosor
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.1"
                      aria-label="Grosor temporal del trazo"
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
                    Opacidad del trazo
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      aria-label="Opacidad temporal del trazo"
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
                  Opacidad de relleno
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    aria-label="Opacidad temporal de relleno"
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
                checked={state.dashed ?? Boolean(object.dashed)}
                onChange={event => onStateChange({ dashed: event.target.checked }, 'Cambiar trazo discontinuo temporal')}
              />
              Línea discontinua en este paso
            </label>
          )}
        </fieldset>
      )}
    </div>
  );
};

export default DiagramStepObjectAppearanceEditor;
