import React from 'react';
import {
  congruenceMarkForSegment,
  setSegmentCongruenceMark,
  parallelMarkForSegment,
  setSegmentParallelMark,
  dimensionLineForSegment,
  toggleSegmentDimensionLine,
  measurementForSegment,
  toggleSegmentMeasurement,
} from '@/fixed-pages/editor/diagrams/model/elements/segmentMarks';
import type { ElementPanelProps } from '../../types';
import {
  showsDirectMarkCount,
  showsMeasureTicksProps,
  showsSegmentMarks,
} from '../../elementSections';
import { elementInspectorCapabilities } from '@/fixed-pages/editor/diagrams/model/elements/elementInspectorCapabilities';

/** Propiedades: congruence/parallel marks, dimension line, measurement, markCount, markHeight, tickDistance, minorTickCount */
export const ElementMarksSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
  onUpdateModel,
}) => {
  const cap = elementInspectorCapabilities(element.kind);

  return (
    <div className="space-y-3">
      {showsSegmentMarks(element.kind) && (
        <>
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1.5">
              Marcas de Congruencia ({congruenceMarkForSegment(model, element.id)?.properties?.markCount ?? 0})
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map(cnt => {
                const currentCount = congruenceMarkForSegment(model, element.id)?.properties?.markCount ?? 0;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      if (onUpdateModel) {
                        const next = setSegmentCongruenceMark(model, element.id, cnt);
                        onUpdateModel(next, `Cambiar marcas de congruencia de ${element.id} a ${cnt}`);
                      }
                    }}
                    className={`py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      currentCount === cnt
                        ? 'bg-salvia text-lienzo border-salvia shadow-2xs'
                        : 'bg-lienzo text-carbon border-carbon/15 hover:bg-carbon/5'
                    }`}
                  >
                    {cnt === 0 ? 'Ninguna' : `${cnt} ${cnt === 1 ? '|' : cnt === 2 ? '||' : cnt === 3 ? '|||' : '||||'}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1.5">
              Marcas de Paralelismo ({parallelMarkForSegment(model, element.id)?.properties?.markCount ?? 0})
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 1, 2, 3].map(cnt => {
                const currentCount = parallelMarkForSegment(model, element.id)?.properties?.markCount ?? 0;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      if (onUpdateModel) {
                        const next = setSegmentParallelMark(model, element.id, cnt);
                        onUpdateModel(next, `Cambiar marcas de paralelismo de ${element.id} a ${cnt}`);
                      }
                    }}
                    className={`py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      currentCount === cnt
                        ? 'bg-pavo text-lienzo border-pavo shadow-2xs'
                        : 'bg-lienzo text-carbon border-carbon/15 hover:bg-carbon/5'
                    }`}
                  >
                    {cnt === 0 ? 'Ninguna' : `${cnt} ${cnt === 1 ? '▶' : cnt === 2 ? '▶▶' : '▶▶▶'}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-carbon/10">
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-carbon select-none">
              <input
                type="checkbox"
                checked={Boolean(dimensionLineForSegment(model, element.id))}
                onChange={e => {
                  if (onUpdateModel) {
                    const next = toggleSegmentDimensionLine(model, element.id, e.target.checked);
                    onUpdateModel(next, `${e.target.checked ? 'Añadir' : 'Eliminar'} cota en ${element.id}`);
                  }
                }}
                className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
              />
              <span>Línea de Cota</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-carbon select-none">
              <input
                type="checkbox"
                checked={Boolean(measurementForSegment(model, element.id))}
                onChange={e => {
                  if (onUpdateModel) {
                    const next = toggleSegmentMeasurement(model, element.id, e.target.checked);
                    onUpdateModel(next, `${e.target.checked ? 'Añadir' : 'Eliminar'} medida en ${element.id}`);
                  }
                }}
                className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
              />
              <span>Etiqueta de Medida</span>
            </label>
          </div>
        </>
      )}

      {showsDirectMarkCount(element.kind) && (
        <div>
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            Número de Marcas
          </label>
          <input
            type="number"
            min="1"
            max="12"
            aria-label="Número de Marcas"
            value={element.properties?.markCount ?? 1}
            onChange={e =>
              onUpdateElement(element.id, {
                properties: { ...(element.properties || {}), markCount: parseInt(e.target.value, 10) || 1 },
              })
            }
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
          />
        </div>
      )}

      {cap.markHeight && (
        <div>
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            Tamaño / Longitud Marca (px)
          </label>
          <input
            type="number"
            step="0.05"
            min="0.05"
            max="100"
            aria-label="Tamaño / Longitud Marca"
            value={element.style?.markHeight ?? 0.32}
            onChange={e => {
              const val = parseFloat(e.target.value) || 0.32;
              onUpdateElement(element.id, {
                style: { ...(element.style || {}), markHeight: val },
              });
            }}
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon font-bold shadow-2xs focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
          />
        </div>
      )}

      {showsMeasureTicksProps(element.kind) && (
        <div className="space-y-2.5 pt-2 border-t border-carbon/10">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Separación entre Marcas
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                value={element.properties?.tickDistance ?? 2}
                onChange={e =>
                  onUpdateElement(element.id, {
                    properties: { ...(element.properties || {}), tickDistance: parseFloat(e.target.value) || 2 },
                  })
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Subdivisiones Menores
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={element.properties?.minorTickCount ?? 4}
                onChange={e =>
                  onUpdateElement(element.id, {
                    properties: { ...(element.properties || {}), minorTickCount: parseInt(e.target.value, 10) || 0 },
                  })
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
