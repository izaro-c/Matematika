import React from 'react';
import type { VisualDiagramModel, VisualElement } from '../../model/types';
import { KIND_LABELS, toolReferenceLabel } from '../../model';
import { SegmentMarksEditor } from '../SegmentMarksEditor';
import { SegmentLengthConstraintEditor } from '../SegmentLengthConstraintEditor';
import { SegmentReflectionConstraintEditor } from '../SegmentReflectionConstraintEditor';
import { AngleEqualityConstraintEditor } from '../AngleEqualityConstraintEditor';
import type { InspectorHandlers } from './useInspectorHandlers';
import { elementReferenceCandidates } from './inspectorUtils';
import type { InspectorSection } from './inspectorUtils';

interface InspectorElementRefsSectionProps {
  model: VisualDiagramModel;
  element: VisualElement;
  activeSection: InspectorSection;
  handlers: InspectorHandlers;
  onModelEdit: (model: VisualDiagramModel) => void;
}

export const InspectorElementRefsSection: React.FC<InspectorElementRefsSectionProps> = ({
  model,
  element: selectedElement,
  activeSection: activeInspectorSection,
  handlers: { handleElementChange, handleElementPropertiesChange },
  onModelEdit,
}) => {
  if (activeInspectorSection !== 'geometry') return null;

  const isCurveHalfPlane = ['functionCurve', 'parametricCurve'].includes(selectedElement.kind)
    && selectedElement.properties?.areaFill === 'half-plane';
  const renderedRefs = isCurveHalfPlane
    ? [selectedElement.refs[0] ?? '']
    : selectedElement.refs;

  return (
    <>
      {(renderedRefs.length > 0 || isCurveHalfPlane) && selectedElement.kind !== 'infoPanel' && selectedElement.kind !== 'label' && (
        <fieldset className="space-y-1 rounded border border-carbon/10 p-2">
          <legend className="px-1 ac-label ac-label--sm ac-label--soft">Referencias geométricas</legend>
          {renderedRefs.map((ref, index) => {
            const referenceLabel = toolReferenceLabel(selectedElement.kind, index);
            return (
              <label key={`${selectedElement.id}-ref-${index}`} className="block text-[10px] font-bold text-carbon/60">
                {referenceLabel}
                <select
                  aria-label={`${referenceLabel} de ${KIND_LABELS[selectedElement.kind]}`}
                  className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
                  value={ref}
                  onChange={(event) => {
                    const nextRef = event.target.value;
                    if (isCurveHalfPlane) {
                      handleElementChange({ refs: nextRef ? [nextRef] : [] });
                      return;
                    }
                    handleElementChange({
                      refs: selectedElement.refs.map((value, refIndex) => refIndex === index ? nextRef : value),
                    });
                  }}
                >
                  {isCurveHalfPlane && <option value="">— Elegir punto —</option>}
                  {elementReferenceCandidates(model, selectedElement, index).map(item => (
                    <option key={item.id} value={item.id}>{item.label} ({item.id})</option>
                  ))}
                </select>
              </label>
            );
          })}
          {(selectedElement.kind === 'polygon' || selectedElement.kind === 'areaDecomposition') && (
            <div className="flex gap-1 pt-1">
              <button
                type="button"
                className="flex-1 rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold"
                onClick={() => {
                  const candidate = model.points.find(point => !selectedElement.refs.includes(point.id));
                  if (candidate) handleElementChange({ refs: [...selectedElement.refs, candidate.id] });
                }}
              >
                + Vértice
              </button>
              <button
                type="button"
                disabled={selectedElement.refs.length <= 3}
                className="flex-1 rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold disabled:opacity-35"
                onClick={() => handleElementChange({ refs: selectedElement.refs.slice(0, -1) })}
              >
                − Último vértice
              </button>
            </div>
          )}
          {selectedElement.kind === 'areaIntersection' && (
            <div className="flex gap-1 pt-1">
              <button
                type="button"
                className="flex-1 rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold"
                onClick={() => {
                  const candidate = model.elements.find(item => (
                    ['halfPlane', 'polygon', 'circle', 'areaIntersection', 'areaDecomposition', 'grid', 'functionCurve', 'parametricCurve'].includes(item.kind)
                    && (['functionCurve', 'parametricCurve'].includes(item.kind)
                      ? item.properties?.areaFill && item.properties.areaFill !== 'none'
                      : true)
                    && !selectedElement.refs.includes(item.id)
                    && item.id !== selectedElement.id
                  ));
                  if (candidate) handleElementChange({ refs: [...selectedElement.refs, candidate.id] });
                }}
              >
                + Área
              </button>
              <button
                type="button"
                disabled={selectedElement.refs.length <= 2}
                className="flex-1 rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold disabled:opacity-35"
                onClick={() => handleElementChange({ refs: selectedElement.refs.slice(0, -1) })}
              >
                − Última área
              </button>
            </div>
          )}
        </fieldset>
      )}

      {selectedElement.kind === 'segment' && (
        <>
          <SegmentMarksEditor
            model={model}
            segment={selectedElement}
            onModelEdit={onModelEdit}
          />
          <SegmentLengthConstraintEditor
            key={selectedElement.id}
            model={model}
            segment={selectedElement}
            onModelEdit={onModelEdit}
          />
          <SegmentReflectionConstraintEditor
            key={`refl-${selectedElement.id}`}
            model={model}
            segment={selectedElement}
            onModelEdit={onModelEdit}
          />
        </>
      )}

      {(selectedElement.kind === 'angle' || selectedElement.kind === 'nonReflexAngle') && (
        <AngleEqualityConstraintEditor
          key={selectedElement.id}
          model={model}
          angle={selectedElement}
          onModelEdit={onModelEdit}
        />
      )}

      {selectedElement.kind === 'intersection' && (
        <fieldset className="space-y-2 rounded border border-pavo/20 bg-pavo/5 p-2">
          <legend className="px-1 ac-label ac-label--sm ac-label--pavo">Intersección exacta</legend>
          <label className="flex items-start gap-1.5 text-xs font-bold text-carbon">
            <input
              type="checkbox"
              checked={selectedElement.properties?.restrictToSupports ?? true}
              onChange={(event) => handleElementPropertiesChange({ restrictToSupports: event.target.checked })}
            />
            <span>Exigir pertenencia a los soportes finitos<span className="mt-0.5 block text-[10px] font-normal leading-relaxed text-carbon/50">Si un soporte es un segmento o una semirrecta, el punto se oculta cuando la intersección de sus rectas portadoras cae fuera.</span></span>
          </label>
        </fieldset>
      )}
    </>
  );
};
