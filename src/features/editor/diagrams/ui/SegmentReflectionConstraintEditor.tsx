import React, { useState } from 'react';
import {
  editableReflectionCandidates,
  reflectionConstraintForSegment,
  removeSegmentReflectionConstraint,
  setReflectionConstraintForSegment,
} from '../model/reflectionConstraints';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import { DiagramButton, DiagramField, DiagramPanel } from './primitives';

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
  const existing = reflectionConstraintForSegment(model, segment.id);
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
    <DiagramPanel title="Reflejo simétrico de segmento">

      {existing && (
        <div className="space-y-2 border-b border-carbon/10 pb-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-carbon/80">{existing.label}</span>
            <DiagramButton
              variant="ghost"
              aria-label={`Eliminar ${existing.label}`}
              onClick={() => onModelEdit(removeSegmentReflectionConstraint(model, segment.id))}
            >
              Eliminar
            </DiagramButton>
          </div>
        </div>
      )}

      {candidates.length === 0 ? (
        <p className="text-[10px] leading-relaxed text-carbon/50">
          No hay centros (puntos) ni ejes (rectas/segmentos) en la escena para definir la simetría.
        </p>
      ) : (
        <div className="space-y-2">
          <DiagramField label="Centro o eje de simetría (respecto a qué)">
            <select
              aria-label={`Centro o eje de simetría para ${segment.label}`}
              value={selectedCenterOrAxis || candidates[0]?.id || ''}
              onChange={e => setSelectedCenterOrAxis(e.target.value)}
            >
              {candidates.map(candidate => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.label} ({candidate.id})
                </option>
              ))}
            </select>
          </DiagramField>

          {otherSegments.length > 0 && (
            <DiagramField label="Segmento de origen (de qué segmento es reflejo)">
              <select
                aria-label={`Segmento de origen para ${segment.label}`}
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
            </DiagramField>
          )}

          <DiagramButton variant="primary" fullWidth onClick={handleAddSegmentReflection}>
            Establecer reflejo simétrico
          </DiagramButton>
        </div>
      )}
    </DiagramPanel>
  );
};
export default SegmentReflectionConstraintEditor;
