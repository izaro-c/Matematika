import React, { useState } from 'react';
import { editableReflectionCandidates, setReflectionConstraintForSegment } from '../model/reflectionConstraints';
import { removeConstraintFromModel } from '../model/commands';
import type { VisualDiagramModel, VisualElement } from '../model/types';

interface SegmentReflectionConstraintEditorProps {
  model: VisualDiagramModel;
  segment: VisualElement;
  onModelEdit: (model: VisualDiagramModel) => void;
}

export const SegmentReflectionConstraintEditor: React.FC<SegmentReflectionConstraintEditorProps> = ({
  model,
  segment,
  onModelEdit,
}) => {
  const activeReflectionConstraints = (model.constraints || []).filter(c => (
    c.kind === 'reflection'
    && c.enabled
    && (c.refs.includes(segment.id) || segment.refs.some(ref => c.refs.includes(ref)))
  ));

  const candidates = editableReflectionCandidates(model, segment.id);
  const otherSegments = model.elements.filter(e => e.kind === 'segment' && e.id !== segment.id);
  const [selectedCenterOrAxis, setSelectedCenterOrAxis] = useState<string>(candidates[0]?.id || '');
  const [selectedSourceSegment, setSelectedSourceSegment] = useState<string>('');

  const handleAddSegmentReflection = () => {
    const targetCenterOrAxis = selectedCenterOrAxis || candidates[0]?.id;
    if (!targetCenterOrAxis) return;
    const updated = setReflectionConstraintForSegment(
      model,
      segment.id,
      targetCenterOrAxis,
      selectedSourceSegment || undefined,
    );
    onModelEdit(updated);
  };

  return (
    <fieldset className="space-y-3 rounded border border-carbon/10 p-2">
      <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45">Reflejo simétrico de segmento</legend>

      {activeReflectionConstraints.length > 0 && (
        <div className="space-y-2 border-b border-carbon/10 pb-2">
          {activeReflectionConstraints.map(constraint => (
            <div key={constraint.id} className="flex items-center justify-between text-xs">
              <span className="text-carbon/80">{constraint.label}</span>
              <button
                type="button"
                className="text-[10px] font-bold text-granada hover:underline"
                onClick={() => onModelEdit(removeConstraintFromModel(model, constraint.id))}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}

      {candidates.length === 0 ? (
        <p className="text-[10px] leading-relaxed text-carbon/50">
          No hay centros (puntos) ni ejes (rectas/segmentos) en la escena para definir la simetría.
        </p>
      ) : (
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-carbon/60">
            Centro o eje de simetría (respecto a qué)
            <select
              aria-label={`Centro o eje de simetría para ${segment.label}`}
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedCenterOrAxis || candidates[0]?.id || ''}
              onChange={e => setSelectedCenterOrAxis(e.target.value)}
            >
              {candidates.map(candidate => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.label} ({candidate.id})
                </option>
              ))}
            </select>
          </label>

          {otherSegments.length > 0 && (
            <label className="block text-[10px] font-bold text-carbon/60">
              Segmento de origen (de qué segmento es reflejo)
              <select
                aria-label={`Segmento de origen para ${segment.label}`}
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={selectedSourceSegment}
                onChange={e => setSelectedSourceSegment(e.target.value)}
              >
                <option value="">Reflejar la posición actual del segmento</option>
                {otherSegments.map(other => (
                  <option key={other.id} value={other.id}>
                    {other.label} ({other.id})
                  </option>
                ))}
              </select>
            </label>
          )}

          <button
            type="button"
            className="w-full rounded bg-pavo px-3 py-1.5 text-xs font-bold text-lienzo hover:bg-pavo/90"
            onClick={handleAddSegmentReflection}
          >
            Establecer reflejo simétrico
          </button>
        </div>
      )}
    </fieldset>
  );
};
export default SegmentReflectionConstraintEditor;
