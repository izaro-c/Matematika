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

/** Contenido: infoPanel usa el editor completo (bloques + variantes); resto texto/reglas, cotas, medidas, posición/offset y subtítulo. */
export const ElementContentSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
  onUpdateModel,
}) => {
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
          {isCota ? 'Etiqueta / Plantilla de Cota' : isMedida ? 'Etiqueta / Plantilla de Medida' : 'Título / Texto'}
        </label>
        <input
          type="text"
          aria-label="Título o texto"
          value={elementText(element) || setting(element, 'title') || element.label || ''}
          onChange={e =>
            {
              const text = e.target.value;
              onUpdateElement(element.id, current => withElementText({ ...current, label: text }, text));
            }
          }
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-bold text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
          placeholder={isCota || isMedida ? '{value} o etiqueta personalizada...' : 'Título o texto...'}
        />
        {(isCota || isMedida) && (
          <p className="mt-1 text-[9px] text-carbon/50">
            Use <code className="rounded bg-carbon/5 px-1 py-0.5 font-mono text-[9px]">{'{value}'}</code> para insertar el valor numérico dinámico.
          </p>
        )}
      </div>

      {/* Visibilidad de la etiqueta en el lienzo */}
      <div className="flex items-center justify-between rounded-lg border border-carbon/10 bg-carbon/[0.02] p-2">
        <div>
          <span className="block text-[11px] font-bold text-carbon">Mostrar etiqueta en el lienzo</span>
          <span className="block text-[9px] text-carbon/50">
            {isLabelVisible ? 'Visible en el dibujo geométrico' : 'Oculta en el dibujo'}
          </span>
        </div>
        <input
          type="checkbox"
          aria-label="Mostrar etiqueta en el lienzo"
          checked={isLabelVisible}
          onChange={e => onUpdateElement(element.id, labelVisiblePatch(e.target.checked))}
          className="h-4 w-4 rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
        />
      </div>

      {/* Tamaño de la etiqueta o cota */}
      {isLabelVisible && (
        <div>
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            {isCota ? 'Tamaño de la cota (px)' : isMedida ? 'Tamaño de la medida (px)' : 'Tamaño de la etiqueta (px)'}
          </label>
          <input
            type="number"
            min="6"
            max="72"
            step="1"
            aria-label={isCota ? 'Tamaño de cota' : isMedida ? 'Tamaño de medida' : 'Tamaño de etiqueta'}
            value={style?.labelSize ?? (isCota ? 14 : 16)}
            onChange={e =>
              onUpdateElement(element.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, isCota ? 14 : 16), }))
            }
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
          />
        </div>
      )}

      {/* Mostrar como subtítulo / Información bajo el título */}
      {isMeasurableOrHeadingCandidate && (
        <div className="space-y-2 rounded-lg border border-canela/20 bg-canela/[0.03] p-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-canela">Mostrar en subtítulo</span>
              <span className="block text-[9px] text-carbon/50">Información bajo el título del diagrama</span>
            </div>
            <input
              type="checkbox"
              aria-label="Mostrar como subtítulo en la cabecera"
              checked={isInHeaderReadings}
              onChange={e => toggleHeaderReading(e.target.checked)}
              className="h-4 w-4 rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
            />
          </div>

          {isInHeaderReadings && currentReading && (
            <div className="pt-2 border-t border-canela/15 space-y-1.5">
              <label className="block text-[10px] font-bold text-carbon/70">
                Formato en subtítulo
              </label>
              <select
                aria-label="Formato en subtítulo"
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
                className="w-full rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs focus:border-canela focus:outline-none"
              >
                <option value="label-value">Nombre y valor (ej. AB: 5 cm)</option>
                <option value="value">Solo el valor (ej. 5 cm)</option>
                <option value="equality">Igualdad condicional (ej. AB = BC = 5 cm)</option>
              </select>
              {currentReading.presentation === 'equality' && (
                <p className="text-[9px] text-canela/90 leading-tight">
                  La igualdad solo se mostrará combinada cuando los valores coincidan; si difieren, se mostrarán por separado.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Parámetros específicos de Cota (dimensionLine) */}
      {isCota && (
        <div className="space-y-2.5 pt-2 border-t border-carbon/10">
          <span className="block text-[10px] font-bold text-canela uppercase tracking-wider">
            Ajustes de Cota
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Distancia de la referencia
              </label>
              <input
                type="number"
                step="0.05"
                aria-label="Distancia u offset de cota"
                value={setting(element, 'offset') ?? 0.35}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('offset', parseOptionalNumber(e.target.value, 0.35)))
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Precisión (decimales)
              </label>
              <input
                type="number"
                min="0"
                max="12"
                aria-label="Precisión decimal"
                value={setting(element, 'precision') ?? 2}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('precision', parseOptionalNumber(e.target.value, 2)))
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Unidad
              </label>
              <input
                type="text"
                aria-label="Unidad de cota"
                value={setting(element, 'unit') ?? ''}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('unit', e.target.value))
                }
                placeholder="ej. cm, m, °"
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Tamaño (px)
              </label>
              <input
                type="number"
                min="6"
                max="72"
                step="1"
                aria-label="Tamaño de cota"
                value={style?.labelSize ?? 14}
                onChange={e =>
                  onUpdateElement(element.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, 14), }))
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Parámetros específicos de Medida (measurement) */}
      {isMedida && (
        <div className="space-y-2.5 pt-2 border-t border-carbon/10">
          <span className="block text-[10px] font-bold text-canela uppercase tracking-wider">
            Ajustes de Medida
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Unidad
              </label>
              <input
                type="text"
                aria-label="Unidad de medida"
                value={setting(element, 'unit') ?? 'cm'}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('unit', e.target.value))
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Precisión (decimales)
              </label>
              <input
                type="number"
                min="0"
                max="12"
                aria-label="Precisión de medida"
                value={setting(element, 'precision') ?? 2}
                onChange={e =>
                  onUpdateElement(element.id, settingPatch('precision', parseOptionalNumber(e.target.value, 2)))
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Tamaño (px)
              </label>
              <input
                type="number"
                min="6"
                max="72"
                step="1"
                aria-label="Tamaño de medida"
                value={style?.labelSize ?? 16}
                onChange={e =>
                  onUpdateElement(element.id, stylePatch({ labelSize: parseOptionalNumber(e.target.value, 16), }))
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Posición a lo largo del padre (para medidas, etiquetas, textos referenciados) */}
      {hasParentRef && !isCota && (
        <div className="space-y-2 pt-2 border-t border-carbon/10">
          <span className="block text-[10px] font-bold text-canela uppercase tracking-wider">
            Posición respecto a la referencia ({refs.join(', ')})
          </span>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-carbon/75">
                Posición a lo largo del elemento ({Math.round((Number(setting(element, 'anchorParameter') ?? 0.5)) * 100)}%)
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              aria-label="Posición a lo largo del elemento padre"
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
          Desplazamiento fino del texto (Offset X, Y)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-carbon/75 mb-1">
              Offset X
            </label>
            <input
              type="number"
              step="0.05"
              aria-label="Desplazamiento X respecto al padre"
              value={style?.textOffset?.[0] ?? (kind === 'label' ? 0.04 : isCota ? 0 : 0.25)}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ textOffset: [
                      parseOptionalNumber(e.target.value, 0),
                      style?.textOffset?.[1] ?? (kind === 'label' ? 0.04 : isCota ? 0 : 0.35),
                    ], }))
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs text-carbon shadow-2xs focus:border-canela focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-carbon/75 mb-1">
              Offset Y
            </label>
            <input
              type="number"
              step="0.05"
              aria-label="Desplazamiento Y respecto al padre"
              value={style?.textOffset?.[1] ?? (kind === 'label' ? 0.04 : isCota ? 0 : 0.35)}
              onChange={e =>
                onUpdateElement(element.id, stylePatch({ textOffset: [
                      style?.textOffset?.[0] ?? (kind === 'label' ? 0.04 : isCota ? 0 : 0.25),
                      parseOptionalNumber(e.target.value, 0),
                    ], }))
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs text-carbon shadow-2xs focus:border-canela focus:outline-none"
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
