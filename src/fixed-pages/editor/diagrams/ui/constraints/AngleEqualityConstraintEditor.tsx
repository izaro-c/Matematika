import React, { useState } from 'react';
import type { VisualDiagramModel, VisualElement } from '../../model/types';
import {
  editableAngleEndpoints,
  equalAngleConstraintForAngle,
  referenceAngles,
  removeConstraintFromModel,
  setEqualAngleConstraint,
} from '../../model';
import { findPointLike } from '../../model/constraints/segmentLengthConstraints';
import { equalAngleRoles, objectConstructionReferences } from '@/diagrams';
import { findPositionedPoint } from '../../model/constraints/relationModel';
import { DiagramButton, DiagramPanel } from '../primitives';
import { DiagramFormField, diagramInputClassName } from '../primitives/DiagramFormField';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';

interface AngleEqualityConstraintEditorProps {
  model: VisualDiagramModel;
  angle: VisualElement;
  onModelEdit: (model: VisualDiagramModel) => void;
}

export const AngleEqualityConstraintEditor: React.FC<AngleEqualityConstraintEditorProps> = ({
  model,
  angle,
  onModelEdit,
}) => {
  const { t } = useI18n();
  const existing = equalAngleConstraintForAngle(model, angle.id);
  const existingRoles = existing?.type === 'equal-angle' ? equalAngleRoles(existing, model.objects) : undefined;
  const angleRefs = objectConstructionReferences(angle);
  const endpoints = editableAngleEndpoints(model, angle.id);
  const [movingEndpointId, setMovingEndpointId] = useState(existingRoles?.driven ?? endpoints[0]?.id ?? '');
  const candidates = referenceAngles(model, angle.id, movingEndpointId);
  const [sourceAngleId, setSourceAngleId] = useState(existingRoles?.source ?? candidates[0]?.id ?? '');
  const [expanded, setExpanded] = useState(Boolean(existing));
  const effectiveSourceAngleId = candidates.some(candidate => candidate.id === sourceAngleId)
    ? sourceAngleId
    : candidates[0]?.id ?? '';
  const movingEndpoint = findPositionedPoint(model, movingEndpointId);
  const vertex = findPointLike(model, angleRefs[1]);
  const fixedEndpointId = angleRefs[0] === movingEndpointId ? angleRefs[2] : angleRefs[0];
  const fixedEndpoint = findPointLike(model, fixedEndpointId);
  const sourceAngle = candidates.find(candidate => candidate.id === effectiveSourceAngleId);
  const ready = Boolean(movingEndpoint && vertex && fixedEndpoint && sourceAngle);

  let disabledReason = '';
  if (endpoints.length === 0) {
    disabledReason = t('editor.diagramConstraints.angleNoMovableEndpoints');
  } else if (candidates.length === 0) {
    disabledReason = t('editor.diagramConstraints.noOtherAngles');
  } else if (!ready) {
    disabledReason = t('editor.diagramConstraints.selectEndpointAndAngle');
  }

  return (
    <DiagramPanel
      title={t('editor.diagramConstraints.equalizeAngles')}
      badge={existing ? 'Configurada' : 'Opcional'}
      collapsible
      open={expanded}
      onOpenChange={setExpanded}
    >
        <p className="text-[10px] leading-relaxed text-carbon/60">
          {t('editor.diagramConstraints.angleEqualityHint')}
        </p>
        <ol className="space-y-1 text-[10px] leading-relaxed text-carbon/55">
          <li><strong>1.</strong> {t('editor.diagramConstraints.angleEqualityStepEndpoint')}</li>
          <li><strong>2.</strong> {t('editor.diagramConstraints.angleEqualityStepSource')}</li>
        </ol>

        {endpoints.length > 0 && candidates.length > 0 ? (
          <>
            <DiagramFormField label={t('editor.diagramConstraints.endpointThatAdjusts')} className="p-0 border-0">
              <select
                aria-label={t('editor.diagramConstraints.angleAdjustableEndpointAria')}
                className={diagramInputClassName}
                value={movingEndpointId}
                onChange={event => {
                  setMovingEndpointId(event.target.value);
                  setSourceAngleId('');
                }}
              >
                {endpoints.map(point => <option key={point.id} value={point.id}>{point.label} ({point.id})</option>)}
              </select>
            </DiagramFormField>
            <DiagramFormField label={t('editor.diagramConstraints.referenceAngle')} className="p-0 border-0">
              <select
                aria-label={t('editor.diagramConstraints.angleReferenceAria')}
                className={diagramInputClassName}
                value={effectiveSourceAngleId}
                onChange={event => setSourceAngleId(event.target.value)}
              >
                {candidates.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.label} ({candidate.id})</option>)}
              </select>
            </DiagramFormField>
            {ready ? (
              <p className="rounded bg-lienzo px-2 py-1.5 text-[10px] leading-relaxed text-carbon/60" aria-live="polite">
                {renderRichText(t('editor.diagramConstraints.angleEqualityPreview', { moving: movingEndpoint?.label ?? '', vertex: vertex?.label ?? '', fixed: fixedEndpoint?.label ?? '', source: sourceAngle?.label ?? '' }), { b: c => <strong>{c}</strong> })}
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
              onClick={() => onModelEdit(setEqualAngleConstraint(model, angle.id, movingEndpointId, effectiveSourceAngleId))}
            >
              {existing ? t('editor.diagramConstraints.updateAngleEquality') : t('editor.diagramConstraints.keepTheSameAngle')}
            </DiagramButton>
            {existing && (
              <DiagramButton
                variant="danger"
                fullWidth
                onClick={() => onModelEdit(removeConstraintFromModel(model, existing.id))}
              >
                {t('editor.diagramConstraints.removeAngleEquality')}
              </DiagramButton>
            )}
          </>
        ) : (
          <p className="rounded bg-ocre/10 p-2 text-[10px] leading-relaxed text-ocre font-medium">
            {disabledReason || t('editor.diagramConstraints.angleEqualityUnavailable')}
          </p>
        )}
    </DiagramPanel>
  );
};

export default AngleEqualityConstraintEditor;
