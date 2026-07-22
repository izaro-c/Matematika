import React from 'react';
import type { VisualDiagramModel, VisualElement } from '../../model/types';
import { DiagramAnnotationPositionEditor } from '../DiagramAnnotationPositionEditor';
import { DiagramExpressionField } from '../DiagramExpressionField';
import type { InspectorHandlers } from './useInspectorHandlers';
import { curveParameter, elementReferenceCandidates } from './inspectorUtils';
import type { InspectorSection } from './inspectorUtils';

interface InspectorElementKindGeometrySectionProps {
  model: VisualDiagramModel;
  element: VisualElement;
  activeSection: InspectorSection;
  handlers: InspectorHandlers;
}

export const InspectorElementKindGeometrySection: React.FC<InspectorElementKindGeometrySectionProps> = ({
  model,
  element: selectedElement,
  activeSection: activeInspectorSection,
  handlers: { handleElementChange, handleElementPropertiesChange, handleElementStyleChange },
}) => {
  if (activeInspectorSection !== 'geometry') return null;

  return (
    <>
      {selectedElement.kind === 'label' && (
        <section className="space-y-3" aria-label="Posición junto al elemento">
          <h5 className="text-xs font-bold text-carbon">Posición junto al elemento</h5>
          <label className="block text-xs font-bold text-carbon">
            Tamaño de la etiqueta
            <input
              type="number"
              min="6"
              max="72"
              step="1"
              aria-label="Tamaño de la etiqueta vinculada"
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedElement.style?.labelSize ?? 14}
              onChange={(event) => handleElementStyleChange({ labelSize: Number(event.target.value) })}
            />
          </label>
          {model.elements.some(item => item.id === selectedElement.refs[0]) && (
            <label className="block text-xs font-bold text-carbon">
              Posición sobre el elemento: {Math.round((selectedElement.properties?.anchorParameter ?? 0.5) * 100)}%
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                aria-label="Posición de la etiqueta sobre el elemento"
                className="mt-1 w-full accent-ocre"
                value={selectedElement.properties?.anchorParameter ?? 0.5}
                onChange={(event) => handleElementPropertiesChange({ anchorMode: 'reference', anchorParameter: Number(event.target.value) })}
              />
            </label>
          )}
          <DiagramAnnotationPositionEditor element={selectedElement} onStyleChange={handleElementStyleChange} variant="embedded" />
          <p className="text-[10px] leading-relaxed text-carbon/50">0% corresponde al inicio y 100% al final. Las separaciones permiten evitar solapes sin crear puntos auxiliares.</p>
        </section>
      )}

      {selectedElement.kind !== 'label' && (
        <DiagramAnnotationPositionEditor element={selectedElement} onStyleChange={handleElementStyleChange} />
      )}

      {selectedElement.kind === 'functionCurve' && (
        <DiagramExpressionField model={model} label="f(x)" ariaLabel="Expresión de función" value={selectedElement.properties?.expression || ''} onChange={value => handleElementPropertiesChange({ expression: value })} parameter={selectedElement.properties?.parameter ?? 'x'} help="x representa cada punto del dominio; también pueden usarse controles y valores de la escena." />
      )}

      {selectedElement.kind === 'parametricCurve' && (
        <div className="space-y-2">
          <DiagramExpressionField model={model} label="x(t)" ariaLabel="Expresión paramétrica x" value={selectedElement.properties?.xExpression || ''} onChange={value => handleElementPropertiesChange({ xExpression: value })} parameter={selectedElement.properties?.parameter ?? 't'} />
          <DiagramExpressionField model={model} label="y(t)" ariaLabel="Expresión paramétrica y" value={selectedElement.properties?.yExpression || ''} onChange={value => handleElementPropertiesChange({ yExpression: value })} parameter={selectedElement.properties?.parameter ?? 't'} />
        </div>
      )}

      {selectedElement.kind === 'functionCurve' && (
        <fieldset className="grid grid-cols-1 gap-2 rounded border border-carbon/10 p-2">
          <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Área</legend>
          <label className="text-xs font-bold text-carbon">
            Relleno de área
            <select
              aria-label="Modo de relleno de área de la gráfica"
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedElement.properties?.areaFill === 'half-plane' ? 'half-plane' : 'none'}
              onChange={event => {
                const areaFill = event.target.value as 'none' | 'half-plane';
                handleElementPropertiesChange({ areaFill });
                if (areaFill !== 'half-plane' && selectedElement.refs.length > 0) {
                  handleElementChange({ refs: [] });
                }
              }}
            >
              <option value="none">Sin relleno</option>
              <option value="half-plane">Semiplano acotado por la curva</option>
            </select>
          </label>
          {selectedElement.properties?.areaFill === 'half-plane' && (
            <label className="text-xs font-bold text-carbon">
              Punto del semiplano
              <select
                aria-label="Punto que indica el lado del semiplano"
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
                value={selectedElement.refs[0] ?? ''}
                onChange={event => {
                  const nextRef = event.target.value;
                  handleElementChange({ refs: nextRef ? [nextRef] : [] });
                }}
              >
                <option value="">— Elegir punto —</option>
                {elementReferenceCandidates(model, selectedElement, 0).map(item => (
                  <option key={item.id} value={item.id}>{item.label} ({item.id})</option>
                ))}
              </select>
            </label>
          )}
          <p className="text-[10px] leading-relaxed text-carbon/45">
            El semiplano usa la gráfica como frontera entre los extremos del dominio y requiere un punto que indique el lado a rellenar.
          </p>
        </fieldset>
      )}

      {selectedElement.kind === 'parametricCurve' && (
        <fieldset className="grid grid-cols-1 gap-2 rounded border border-carbon/10 p-2">
          <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Área</legend>
          <label className="text-xs font-bold text-carbon">
            Relleno de área
            <select
              aria-label="Modo de relleno de área de la curva"
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedElement.properties?.areaFill ?? 'none'}
              onChange={event => {
                const areaFill = event.target.value as 'none' | 'interior' | 'half-plane';
                handleElementPropertiesChange({ areaFill });
                if (areaFill !== 'half-plane' && selectedElement.refs.length > 0) {
                  handleElementChange({ refs: [] });
                }
              }}
            >
              <option value="none">Sin relleno</option>
              <option value="interior">Interior de curva cerrada</option>
              <option value="half-plane">Semiplano acotado por la curva</option>
            </select>
          </label>
          {selectedElement.properties?.areaFill === 'half-plane' && (
            <label className="text-xs font-bold text-carbon">
              Punto del semiplano
              <select
                aria-label="Punto que indica el lado del semiplano"
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
                value={selectedElement.refs[0] ?? ''}
                onChange={event => {
                  const nextRef = event.target.value;
                  handleElementChange({ refs: nextRef ? [nextRef] : [] });
                }}
              >
                <option value="">— Elegir punto —</option>
                {elementReferenceCandidates(model, selectedElement, 0).map(item => (
                  <option key={item.id} value={item.id}>{item.label} ({item.id})</option>
                ))}
              </select>
            </label>
          )}
          <p className="text-[10px] leading-relaxed text-carbon/45">
            El interior rellena lazos cerrados por autointersección. El semiplano acota la región entre los extremos del dominio paramétrico.
          </p>
        </fieldset>
      )}

      {(['functionCurve', 'parametricCurve'].includes(selectedElement.kind)) && (
        <fieldset className="grid grid-cols-2 gap-2 rounded border border-carbon/10 p-2">
          <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Dominio y muestreo</legend>
          <label className="text-xs font-bold text-carbon">Dominio mínimo<input type="number" aria-label="Dominio mínimo" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.domain?.[0] ?? -5} onChange={(event) => handleElementPropertiesChange({ domain: [Number(event.target.value), selectedElement.properties?.domain?.[1] ?? 5] })} /></label>
          <label className="text-xs font-bold text-carbon">Dominio máximo<input type="number" aria-label="Dominio máximo" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.domain?.[1] ?? 5} onChange={(event) => handleElementPropertiesChange({ domain: [selectedElement.properties?.domain?.[0] ?? -5, Number(event.target.value)] })} /></label>
          <label className="text-xs font-bold text-carbon">Variable<input aria-label="Variable de la curva" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={curveParameter(selectedElement)} onChange={event => handleElementPropertiesChange({ parameter: event.target.value || curveParameter(selectedElement) })} /></label>
          <label className="text-xs font-bold text-carbon">Muestras<input type="number" min="8" max="512" step="8" aria-label="Número de muestras de la curva" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.samples ?? 128} onChange={event => handleElementPropertiesChange({ samples: Number(event.target.value) })} /></label>
          <p className="col-span-2 text-[10px] leading-relaxed text-carbon/45">La variable debe coincidir con la usada en la expresión. Más muestras mejoran la estimación de la escena, con mayor coste de cálculo.</p>
        </fieldset>
      )}

      {(selectedElement.kind === 'poincareGeodesic' || selectedElement.kind === 'poincareArc') && (
        <p className="rounded border border-pavo/20 bg-pavo/5 p-2 text-[10px] leading-relaxed text-carbon/60">
          {selectedElement.kind === 'poincareGeodesic'
            ? 'Los dos primeros puntos fijan la recta de frontera del disco de Poincaré; los dos siguientes marcan los extremos interiores de la geodésica. Todos deben permanecer en el interior o sobre el borde del disco modelo.'
            : 'Los dos primeros puntos definen la circunferencia ortogonal de frontera; los dos siguientes señalan el inicio y el final del arco hiperbólico dentro del disco. El arco sigue la geodésica entre esos extremos.'}
        </p>
      )}

      {(selectedElement.kind === 'congruenceMark' || selectedElement.kind === 'parallelMark') && (
        <label className="block text-xs font-bold text-carbon">Número de marcas<input type="number" min="1" max="4" aria-label="Número de marcas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.markCount ?? 1} onChange={(event) => handleElementPropertiesChange({ markCount: Number(event.target.value) })} /></label>
      )}

      {selectedElement.kind === 'measureTicks' && (
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-bold text-carbon">Separación<input type="number" min="0.05" max="100" step="0.05" aria-label="Separación entre marcas de medida" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.tickDistance ?? 2} onChange={(event) => handleElementPropertiesChange({ tickDistance: Number(event.target.value) })} /></label>
          <label className="col-span-2 text-xs font-bold text-carbon">Subdivisiones menores<input type="number" min="0" max="10" step="1" aria-label="Número de subdivisiones menores" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.minorTickCount ?? 4} onChange={(event) => handleElementPropertiesChange({ minorTickCount: Number(event.target.value) })} /></label>
          <div className="col-span-2"><DiagramExpressionField model={model} label="Separación dinámica" ariaLabel="Expresión de separación entre marcas" placeholder="Vacío = usar separación fija" value={selectedElement.properties?.tickDistanceExpression ?? ''} onChange={value => handleElementPropertiesChange({ tickDistanceExpression: value || undefined })} optional /></div>
        </div>
      )}

      {(['grid', 'areaDecomposition'].includes(selectedElement.kind)) && (
        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs font-bold text-carbon">Filas<input type="number" min="1" max="100" aria-label="Filas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.rows ?? 4} onChange={(event) => handleElementPropertiesChange({ rows: Number(event.target.value) })} /></label>
          <label className="text-xs font-bold text-carbon">Columnas<input type="number" min="1" max="100" aria-label="Columnas" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedElement.properties?.columns ?? 4} onChange={(event) => handleElementPropertiesChange({ columns: Number(event.target.value) })} /></label>
        </div>
      )}
    </>
  );
};
