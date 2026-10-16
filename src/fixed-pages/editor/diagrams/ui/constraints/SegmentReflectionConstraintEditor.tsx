import React, { useState } from 'react';
import {
  editableReflectionCandidates,
  reflectionConstraintForSegment,
  removeSegmentReflectionConstraint,
  setReflectionConstraintForSegment,
} from '../../model/constraints/reflectionConstraints';
import type { VisualDiagramModel, VisualElement } from '../../model/types';
import { objectKind } from '@/diagrams';
import { modelElements } from '../../model/scene/objectLists';
import { DiagramButton, DiagramPanel } from '../primitives';
import { DiagramFormField, diagramInputClassName } from '../primitives/DiagramFormField';
import { useI18n } from '@/i18n';

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
  const { t } = useI18n();
  const existing = reflectionConstraintForSegment(model, segment.id);
  const candidates = editableReflectionCandidates(model, segment.id);
  const otherSegments = modelElements(model).filter(e => objectKind(e) === 'segment' && e.id !== segment.id);

  const existingRefs = existing?.type === 'reflection' ? existing.refs : undefined;
  const existingCenterOrAxisId = existingRefs?.length === 3 ? existingRefs[2] : existingRefs?.[1];
  const existingSourceSegmentId = existingRefs?.length === 3 ? existingRefs[1] : '';

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
      title={t('editor.diagramConstraints.segmentReflectionTitle')}
      badge={existing ? 'Configurado' : 'Opcional'}
      collapsible
      open={expanded}
      onOpenChange={setExpanded}
    >
      <p className="text-[10px] leading-relaxed text-carbon/60">
        {t('editor.diagramConstraints.segmentReflectionHint')}
      </p>

      {candidates.length === 0 ? (
        <p className="rounded bg-ocre/10 p-2 text-[10px] leading-relaxed text-ocre font-medium">
          {t('editor.diagramConstraints.noSymmetryReferences')}
        </p>
      ) : (
        <div className="space-y-2 mt-2">
          <DiagramFormField label={t('editor.diagramConstraints.symmetryCenterLabel')} className="p-0 border-0">
            <select
              aria-label={t('editor.diagramConstraints.symmetryCenterFor', { label: segment.label })}
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
            <DiagramFormField label={t('editor.diagramConstraints.reflectionSourceLabel')} className="p-0 border-0">
              <select
                aria-label={t('editor.diagramConstraints.sourceSegmentFor', { label: segment.label })}
                className={diagramInputClassName}
                value={selectedSourceSegment}
                onChange={e => setSelectedSourceSegment(e.target.value)}
              >
                <option value="">{t('editor.diagramConstraints.reflectCurrentPosition')}</option>
                {otherSegments.map(other => (
                  <option key={other.id} value={other.id}>
                    {other.label} ({other.id})
                  </option>
                ))}
              </select>
            </DiagramFormField>
          )}

          <DiagramButton variant="primary" fullWidth onClick={handleAddSegmentReflection}>
            {existing ? t('editor.diagramConstraints.updateSymmetricReflection') : t('editor.diagramConstraints.setSymmetricReflection')}
          </DiagramButton>

          {existing && (
            <DiagramButton
              variant="danger"
              fullWidth
              onClick={() => onModelEdit(removeSegmentReflectionConstraint(model, segment.id))}
            >
              {t('editor.diagramConstraints.removeSymmetricReflection')}
            </DiagramButton>
          )}
        </div>
      )}
    </DiagramPanel>
  );
};
export default SegmentReflectionConstraintEditor;
