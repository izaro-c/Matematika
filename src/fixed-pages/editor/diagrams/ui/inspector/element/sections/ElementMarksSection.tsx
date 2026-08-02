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
    <div className="p-2.5 space-y-3 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
      {showsSegmentMarks(element.kind) && (
        <>
          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-1">
              Marcas de Congruencia ({congruenceMarkForSegment(model, element.id)?.properties?.markCount ?? 0})
            </label>
            <div className="grid grid-cols-5 gap-1">
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
                    className={`py-1 text-xs font-bold rounded border cursor-pointer ${
                      currentCount === cnt
                        ? 'bg-salvia text-lienzo border-salvia'
                        : 'bg-lienzo text-carbon border-carbon/20 hover:bg-carbon/5'
                    }`}
                  >
                    {cnt === 0 ? 'Ninguna' : `${cnt} ${cnt === 1 ? '|' : cnt === 2 ? '||' : cnt === 3 ? '|||' : '||||'}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-1">
              Marcas de Paralelismo ({parallelMarkForSegment(model, element.id)?.properties?.markCount ?? 0})
            </label>
            <div className="grid grid-cols-4 gap-1">
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
                    className={`py-1 text-xs font-bold rounded border cursor-pointer ${
                      currentCount === cnt
                        ? 'bg-pavo text-lienzo border-pavo'
                        : 'bg-lienzo text-carbon border-carbon/20 hover:bg-carbon/5'
                    }`}
                  >
                    {cnt === 0 ? 'Ninguna' : `${cnt} ${cnt === 1 ? '▶' : cnt === 2 ? '▶▶' : '▶▶▶'}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-carbon/10">
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-carbon">
              <input
                type="checkbox"
                checked={Boolean(dimensionLineForSegment(model, element.id))}
                onChange={e => {
                  if (onUpdateModel) {
                    const next = toggleSegmentDimensionLine(model, element.id, e.target.checked);
                    onUpdateModel(next, `${e.target.checked ? 'Añadir' : 'Eliminar'} cota en ${element.id}`);
                  }
                }}
                className="rounded text-salvia border-carbon/30 focus:ring-salvia"
              />
              <span>Línea de Cota</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-carbon">
              <input
                type="checkbox"
                checked={Boolean(measurementForSegment(model, element.id))}
                onChange={e => {
                  if (onUpdateModel) {
                    const next = toggleSegmentMeasurement(model, element.id, e.target.checked);
                    onUpdateModel(next, `${e.target.checked ? 'Añadir' : 'Eliminar'} medida en ${element.id}`);
                  }
                }}
                className="rounded text-salvia border-carbon/30 focus:ring-salvia"
              />
              <span>Etiqueta de Medida</span>
            </label>
          </div>
        </>
      )}

      {showsDirectMarkCount(element.kind) && (
        <div>
          <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
            Número de Marcas
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
              className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon font-bold"
            />
          </label>
        </div>
      )}

      {cap.markHeight && (
        <div>
          <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">
            Tamaño / Longitud Marca (px)
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
              className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon font-bold"
            />
          </label>
        </div>
      )}

      {showsMeasureTicksProps(element.kind) && (
        <div className="space-y-2 pt-1 border-t border-carbon/10">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">
                Separación entre Marcas
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
                  className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
                />
              </label>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">
                Subdivisiones Menores
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
                  className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
