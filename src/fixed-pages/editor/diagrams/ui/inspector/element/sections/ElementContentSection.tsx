import React from 'react';
import type { DiagramHeaderConfiguration, DiagramHeaderReading } from '@/diagrams/public';
import type { ElementPanelProps } from '../../types';
import { DiagramTextRulesEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramTextRulesEditor';
import { DiagramInfoPanelContentEditor } from '@/fixed-pages/editor/diagrams/ui/panels/DiagramInfoPanelContentEditor';
import { elementInspectorCapabilities } from '@/fixed-pages/editor/diagrams/model/elements/elementInspectorCapabilities';
import { parseOptionalNumber } from '../../../workbenchSelection';

/** Contenido: infoPanel usa el editor completo (bloques + variantes); resto texto/reglas, cotas, medidas, posición/offset y subtítulo. */
export const ElementContentSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
  onUpdateModel,
}) => {
  if (element.kind === 'infoPanel') {
    return (
      <div className="space-y-3">
        <DiagramInfoPanelContentEditor
          model={model}
          panel={element}
          onElementChange={update => onUpdateElement(element.id, update)}
          onTextChange={text => onUpdateElement(element.id, { text })}
          onPropertiesChange={properties =>
            onUpdateElement(element.id, {
              properties: { ...(element.properties || {}), ...properties },
            })
          }
        />
      </div>
    );
  }

  const hasParentRef = Boolean(element.refs && element.refs.length > 0);
  const isCota = element.kind === 'dimensionLine';
  const isMedida = element.kind === 'measurement';
  const isMeasurableOrHeadingCandidate = isCota || isMedida || Boolean(element.properties?.expression);

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

  const isLabelVisible = element.showLabel !== false;

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
          value={element.text || element.properties?.title || element.label || ''}
          onChange={e =>
            onUpdateElement(element.id, {
              text: e.target.value,
              label: e.target.value,
              properties: { ...(element.properties || {}), title: e.target.value },
            })
          }
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-bold text-xs text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 placeholder-carbon/30"
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
          onChange={e =>
            onUpdateElement(element.id, {
              showLabel: e.target.checked,
            })
          }
          className="h-4 w-4 rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
        />
      </div>

      {/* Mostrar como subtítulo / Información bajo el título */}
      {isMeasurableOrHeadingCandidate && (
        <div className="space-y-2 rounded-lg border border-salvia/20 bg-salvia/[0.03] p-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="block text-[11px] font-bold text-salvia">Mostrar en subtítulo</span>
              <span className="block text-[9px] text-carbon/50">Información bajo el título del diagrama</span>
            </div>
            <input
              type="checkbox"
              aria-label="Mostrar como subtítulo en la cabecera"
              checked={isInHeaderReadings}
              onChange={e => toggleHeaderReading(e.target.checked)}
              className="h-4 w-4 rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
            />
          </div>

          {isInHeaderReadings && currentReading && (
            <div className="pt-2 border-t border-salvia/15 space-y-1.5">
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
                className="w-full rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon shadow-2xs focus:border-salvia focus:outline-none"
              >
                <option value="label-value">Nombre y valor (ej. AB: 5 cm)</option>
                <option value="value">Solo el valor (ej. 5 cm)</option>
                <option value="equality">Igualdad condicional (ej. AB = BC = 5 cm)</option>
              </select>
              {currentReading.presentation === 'equality' && (
                <p className="text-[9px] text-salvia/90 leading-tight">
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
          <span className="block text-[10px] font-bold text-salvia uppercase tracking-wider">
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
                value={element.properties?.offset ?? 0.35}
                onChange={e =>
                  onUpdateElement(element.id, {
                    properties: { ...(element.properties || {}), offset: parseOptionalNumber(e.target.value, 0.35) },
                  })
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
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
                value={element.properties?.precision ?? 2}
                onChange={e =>
                  onUpdateElement(element.id, {
                    properties: { ...(element.properties || {}), precision: parseOptionalNumber(e.target.value, 2) },
                  })
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              Unidad
            </label>
            <input
              type="text"
              aria-label="Unidad de cota"
              value={element.properties?.unit ?? ''}
              onChange={e =>
                onUpdateElement(element.id, {
                  properties: { ...(element.properties || {}), unit: e.target.value },
                })
              }
              placeholder="ej. cm, m, °"
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
            />
          </div>
        </div>
      )}

      {/* Parámetros específicos de Medida (measurement) */}
      {isMedida && (
        <div className="space-y-2.5 pt-2 border-t border-carbon/10">
          <span className="block text-[10px] font-bold text-salvia uppercase tracking-wider">
            Ajustes de Medida
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Unidad
              </label>
              <input
                type="text"
                aria-label="Unidad de medida"
                value={element.properties?.unit ?? 'cm'}
                onChange={e =>
                  onUpdateElement(element.id, {
                    properties: { ...(element.properties || {}), unit: e.target.value },
                  })
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
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
                value={element.properties?.precision ?? 2}
                onChange={e =>
                  onUpdateElement(element.id, {
                    properties: { ...(element.properties || {}), precision: parseOptionalNumber(e.target.value, 2) },
                  })
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* Posición a lo largo del padre (para medidas, etiquetas, textos referenciados) */}
      {hasParentRef && !isCota && (
        <div className="space-y-2 pt-2 border-t border-carbon/10">
          <span className="block text-[10px] font-bold text-salvia uppercase tracking-wider">
            Posición respecto a la referencia ({element.refs.join(', ')})
          </span>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-carbon/75">
                Posición a lo largo del elemento ({Math.round((element.properties?.anchorParameter ?? 0.5) * 100)}%)
              </label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              aria-label="Posición a lo largo del elemento padre"
              value={element.properties?.anchorParameter ?? 0.5}
              onChange={e =>
                onUpdateElement(element.id, {
                  properties: {
                    ...(element.properties || {}),
                    anchorParameter: parseOptionalNumber(e.target.value, 0.5),
                  },
                })
              }
              className="w-full cursor-pointer accent-salvia"
            />
          </div>
        </div>
      )}

      {/* Desplazamiento / Offsets finos de texto (X, Y) para TODOS los elementos de texto/cota/medida */}
      <div className="space-y-2 pt-2 border-t border-carbon/10">
        <span className="block text-[10px] font-bold text-salvia uppercase tracking-wider">
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
              value={element.style?.textOffset?.[0] ?? (element.kind === 'label' ? 0.04 : isCota ? 0 : 0.25)}
              onChange={e =>
                onUpdateElement(element.id, {
                  style: {
                    ...(element.style || {}),
                    textOffset: [
                      parseOptionalNumber(e.target.value, 0),
                      element.style?.textOffset?.[1] ?? (element.kind === 'label' ? 0.04 : isCota ? 0 : 0.35),
                    ],
                  },
                })
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs text-carbon shadow-2xs focus:border-salvia focus:outline-none"
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
              value={element.style?.textOffset?.[1] ?? (element.kind === 'label' ? 0.04 : isCota ? 0 : 0.35)}
              onChange={e =>
                onUpdateElement(element.id, {
                  style: {
                    ...(element.style || {}),
                    textOffset: [
                      element.style?.textOffset?.[0] ?? (element.kind === 'label' ? 0.04 : isCota ? 0 : 0.25),
                      parseOptionalNumber(e.target.value, 0),
                    ],
                  },
                })
              }
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs text-carbon shadow-2xs focus:border-salvia focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Reglas condicionales de texto si aplica */}
      {elementInspectorCapabilities(element.kind).conditionalText && (
        <div className="pt-2 border-t border-carbon/10">
          <DiagramTextRulesEditor
            model={model}
            element={element}
            onChange={textRules =>
              onUpdateElement(element.id, {
                properties: { ...(element.properties || {}), textRules },
              })
            }
          />
        </div>
      )}
    </div>
  );
};
