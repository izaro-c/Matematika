import React, { useState } from 'react';
import {
  editableReflectionCandidates,
  reflectionConstraintForSegment,
  removeSegmentReflectionConstraint,
  setReflectionConstraintForSegment,
} from '../../model/constraints/reflectionConstraints';
import type { VisualDiagramModel, VisualElement } from '../../model/types';
import { DiagramButton, DiagramPanel } from '../primitives';
import { DiagramFormField, diagramInputClassName } from '../primitives/DiagramFormField';

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

  const existingCenterOrAxisId = existing?.refs.length === 3 ? existing.refs[2] : existing?.refs[1];
  const existingSourceSegmentId = existing?.refs.length === 3 ? existing.refs[1] : '';

  const [selectedCenterOrAxis, setSelectedCenterOrAxis] = useState<string>(existingCenterOrAxisId || candidates[0]?.id || '');
  const [selectedSourceSegment, setSelectedSourceSegment] = useState<string>(existingSourceSegmentId || '');
  const [expanded, setExpanded] = useState(Boolean(existing));

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
    <DiagramPanel
      title="Reflejo simétrico de segmento"
      badge={existing ? 'Configurado' : 'Opcional'}
      collapsible
      open={expanded}
      onOpenChange={setExpanded}
    >
      <p className="text-[10px] leading-relaxed text-carbon/60">
        Este segmento será el reflejo simétrico de sí mismo o de otro respecto a un centro o eje.
      </p>

      {candidates.length === 0 ? (
        <p className="rounded bg-ocre/10 p-2 text-[10px] leading-relaxed text-ocre font-medium">
          No hay centros (puntos) ni ejes (rectas/segmentos) en la escena para definir la simetría.
        </p>
      ) : (
        <div className="space-y-2 mt-2">
          <DiagramFormField label="Centro o eje de simetría (respecto a qué)" className="p-0 border-0">
            <select
              aria-label={`Centro o eje de simetría para ${segment.label}`}
              className={diagramInputClassName}
              value={selectedCenterOrAxis || candidates[0]?.id || ''}
              onChange={e => setSelectedCenterOrAxis(e.target.value)}
            >
              {candidates.map(candidate => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.label} ({candidate.id})
                </option>
              ))}
            </select>
          </DiagramFormField>

          {otherSegments.length > 0 && (
            <DiagramFormField label="Segmento de origen (de qué segmento es reflejo)" className="p-0 border-0">
              <select
                aria-label={`Segmento de origen para ${segment.label}`}
                className={diagramInputClassName}
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
            </DiagramFormField>
          )}

          <DiagramButton variant="primary" fullWidth onClick={handleAddSegmentReflection}>
            {existing ? 'Actualizar reflejo simétrico' : 'Establecer reflejo simétrico'}
          </DiagramButton>

          {existing && (
            <DiagramButton
              variant="danger"
              fullWidth
              onClick={() => onModelEdit(removeSegmentReflectionConstraint(model, segment.id))}
            >
              Eliminar reflejo simétrico
            </DiagramButton>
          )}
        </div>
      )}
    </DiagramPanel>
  );
};
export default SegmentReflectionConstraintEditor;
