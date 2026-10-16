import React, { useState } from 'react';
import type { VisualDiagramModel, VisualElement } from '../../model/types';
import {
  editableSegmentEndpoints,
  equalLengthConstraintForSegment,
  findPointLike,
  removeConstraintFromModel,
  setEqualLengthConstraint,
} from '../../model/constraints/segmentLengthConstraints';
import { equalLengthRoles, objectConstructionReferences, objectKind } from '@/diagrams';
import { findPositionedPoint } from '../../model/constraints/relationModel';
import { modelElements } from '../../model/scene/objectLists';
import { DiagramButton, DiagramPanel } from '../primitives';
import { DiagramFormField, diagramInputClassName } from '../primitives/DiagramFormField';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';

interface SegmentLengthConstraintEditorProps {
  model: VisualDiagramModel;
  segment: VisualElement;
  onModelEdit: (model: VisualDiagramModel) => void;
}

export const SegmentLengthConstraintEditor: React.FC<SegmentLengthConstraintEditorProps> = ({
  model,
  segment,
  onModelEdit,
}) => {
  const { t } = useI18n();
  const existing = equalLengthConstraintForSegment(model, segment.id);
  const endpoints = editableSegmentEndpoints(model, segment.id);
  const existingRoles = existing?.type === 'equal-length' ? equalLengthRoles(existing, model.objects) : undefined;
  const allReferenceSegments = modelElements(model).filter(element => objectKind(element) === 'segment' && element.id !== segment.id);
  const [expanded, setExpanded] = useState(Boolean(existing));
  const [movingEndpointId, setMovingEndpointId] = useState(existingRoles?.driven ?? endpoints[0]?.id ?? '');
  const [sourceSegmentId, setSourceSegmentId] = useState(existingRoles?.source ?? allReferenceSegments[0]?.id ?? '');
  const referenceSegments = allReferenceSegments.filter(candidate => !objectConstructionReferences(candidate).includes(movingEndpointId));
  const effectiveSourceSegmentId = referenceSegments.some(candidate => candidate.id === sourceSegmentId)
    ? sourceSegmentId
    : referenceSegments[0]?.id ?? '';
  const movingEndpoint = findPositionedPoint(model, movingEndpointId);
  const anchor = objectConstructionReferences(segment)
    .map(ref => findPointLike(model, ref))
    .find(point => point && point.id !== movingEndpointId);
  const sourceSegment = referenceSegments.find(candidate => candidate.id === effectiveSourceSegmentId);
  const ready = Boolean(movingEndpoint && anchor && sourceSegment);

  let disabledReason = '';
  if (endpoints.length === 0) {
    disabledReason = t('editor.diagramConstraints.segmentNoMovableEndpoints');
  } else if (allReferenceSegments.length === 0) {
    disabledReason = t('editor.diagramConstraints.noOtherSegments');
  } else if (referenceSegments.length === 0) {
    disabledReason = t('editor.diagramConstraints.endpointInAllSegments');
  } else if (!ready) {
    disabledReason = t('editor.diagramConstraints.selectEndpointAndSegment');
  }

  return (
    <DiagramPanel
      title={t('editor.diagramConstraints.equalizeLengths')}
      badge={existing ? 'Configurada' : 'Opcional'}
      collapsible
      open={expanded}
      onOpenChange={setExpanded}
    >
        <p className="text-[10px] leading-relaxed text-carbon/60">
          {t('editor.diagramConstraints.lengthEqualityHint')}
        </p>
        <ol className="space-y-1 text-[10px] leading-relaxed text-carbon/55">
          <li><strong>1.</strong> {t('editor.diagramConstraints.lengthEqualityStepEndpoint')}</li>
          <li><strong>2.</strong> {t('editor.diagramConstraints.lengthEqualityStepSource')}</li>
        </ol>

        {endpoints.length > 0 && referenceSegments.length > 0 ? (
          <>
            <DiagramFormField label={t('editor.diagramConstraints.endpointThatAdjusts')} className="p-0 border-0">
              <select
                aria-label={t('editor.diagramConstraints.lengthAdjustableEndpointAria')}
                className={diagramInputClassName}
                value={movingEndpointId}
                onChange={event => setMovingEndpointId(event.target.value)}
              >
                {endpoints.map(point => <option key={point.id} value={point.id}>{point.label} ({point.id})</option>)}
              </select>
            </DiagramFormField>
            <DiagramFormField label={t('editor.diagramConstraints.referenceSegment')} className="p-0 border-0">
              <select
                aria-label={t('editor.diagramConstraints.lengthReferenceAria')}
                className={diagramInputClassName}
                value={effectiveSourceSegmentId}
                onChange={event => setSourceSegmentId(event.target.value)}
              >
                {referenceSegments.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.label} ({candidate.id})</option>)}
              </select>
            </DiagramFormField>
            {ready ? (
              <p className="rounded bg-lienzo px-2 py-1.5 text-[10px] leading-relaxed text-carbon/60" aria-live="polite">
                {renderRichText(t('editor.diagramConstraints.lengthEqualityPreview', { moving: movingEndpoint?.label ?? '', anchor: anchor?.label ?? '', source: sourceSegment?.label ?? '' }), { b: c => <strong>{c}</strong> })}
              </p>
            ) : disabledReason ? (
              <p className="rounded bg-ocre/10 px-2 py-1.5 text-[10px] leading-relaxed text-ocre font-medium" aria-live="polite">
                {disabledReason}
              </p>
            ) : null}
            <DiagramButton
              variant="primary"
              fullWidth
              disabled={!ready}
              onClick={() => onModelEdit(setEqualLengthConstraint(model, segment.id, movingEndpointId, effectiveSourceSegmentId))}
            >
              {existing ? t('editor.diagramConstraints.updateLengthEquality') : t('editor.diagramConstraints.keepTheSameLength')}
            </DiagramButton>
            {existing && (
              <DiagramButton
                variant="danger"
                fullWidth
                onClick={() => onModelEdit(removeConstraintFromModel(model, existing.id))}
              >
                {t('editor.diagramConstraints.removeLengthEquality')}
              </DiagramButton>
            )}
          </>
        ) : (
          <p className="rounded bg-ocre/10 p-2 text-[10px] leading-relaxed text-ocre font-medium">
            {disabledReason || t('editor.diagramConstraints.lengthEqualityUnavailable')}
          </p>
        )}
    </DiagramPanel>
  );
};

export default SegmentLengthConstraintEditor;
