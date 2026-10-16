import React, { useState } from 'react';
import {
  equalLengthConstraintForSegment,
  setEqualLengthConstraint,
  removeConstraintFromModel,
  editableSegmentEndpoints,
} from '@/fixed-pages/editor/diagrams/model/constraints/segmentLengthConstraints';
import {
  equalAngleConstraintForAngle,
  setEqualAngleConstraint,
} from '@/fixed-pages/editor/diagrams/model/constraints/angleConstraints';
import {
  editableReflectionCandidates,
  reflectionConstraintForSegment,
  removeSegmentReflectionConstraint,
  setReflectionConstraintForSegment,
} from '@/fixed-pages/editor/diagrams/model/constraints/reflectionConstraints';
import type { VisualDiagramModel, VisualElement } from '@/fixed-pages/editor/diagrams/model/types';
import type { ElementPanelProps } from '../../types';
import { constraintScopeForKind } from '../../elementSections';
import { objectConstructionReferences, objectKind } from '@/diagrams';
import { elementKind, modelElements, relationDraft } from '@/fixed-pages/editor/diagrams/model';
import { useI18n } from '@/i18n';

const fieldClass =
  'w-full rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1.5 text-xs font-mono font-bold text-carbon focus:border-canela focus:outline-none';
const cardClass = 'space-y-2 rounded-lg border border-carbon/10 bg-lienzo/60 p-3 shadow-2xs';
const applyBtn =
  'w-full py-1.5 bg-canela text-lienzo rounded-lg font-bold text-[10px] hover:bg-canela/90 transition-all cursor-pointer disabled:opacity-40';
const removeBtn =
  'w-full py-1.5 bg-granada/10 hover:bg-granada/20 text-granada rounded-lg font-bold text-[10px] transition-all cursor-pointer';

const SegmentReflectionCard: React.FC<{
  model: VisualDiagramModel;
  element: VisualElement;
  onUpdateModel: (next: VisualDiagramModel, label: string) => void;
}> = ({ model, element, onUpdateModel }) => {
  const { t } = useI18n();
  const reflection = reflectionConstraintForSegment(model, element.id);
  const reflectionRefs = reflection?.type === 'reflection' ? reflection.refs : [];
  const reflectionCandidates = editableReflectionCandidates(model, element.id);
  const otherSegments = modelElements(model).filter(e => objectKind(e) === 'segment' && e.id !== element.id);
  const existingCenter = reflectionRefs.length === 3 ? reflectionRefs[2] : reflectionRefs[1];
  const existingSource = reflectionRefs.length === 3 ? reflectionRefs[1] : '';
  const [centerId, setCenterId] = useState(existingCenter || reflectionCandidates[0]?.id || '');
  const [sourceId, setSourceId] = useState(existingSource);

  return (
    <div className={cardClass}>
      <span className="font-bold text-canela block uppercase tracking-wider text-[10px]">{t('editor.diagramInspector.symmetricReflection')}</span>
      <p className="text-[11px] text-carbon/60 leading-relaxed">
        {t('editor.diagramInspector.reflectionHint')}
      </p>
      {reflectionCandidates.length === 0 ? (
        <p className="text-[11px] text-ocre bg-ocre/10 rounded-lg p-2 border border-ocre/20">{t('editor.diagramInspector.noReflectionTargets')}</p>
      ) : (
        <>
          <div>
            <label className="block text-[11px] text-carbon/75 font-bold mb-1">{t('editor.diagramInspector.centerOrAxis')}</label>
            <select
              value={centerId || reflectionCandidates[0]?.id || ''}
              onChange={e => setCenterId(e.target.value)}
              className={fieldClass}
            >
              {reflectionCandidates.map(c => (
                <option key={c.id} value={c.id}>{c.label || c.id} ({c.id})</option>
              ))}
            </select>
          </div>
          {otherSegments.length > 0 && (
            <div>
              <label className="block text-[11px] text-carbon/75 font-bold mb-1">{t('editor.diagramInspector.sourceSegmentOptional')}</label>
              <select value={sourceId} onChange={e => setSourceId(e.target.value)} className={fieldClass}>
                <option value="">{t('editor.diagramInspector.currentPosition')}</option>
                {otherSegments.map(s => (
                  <option key={s.id} value={s.id}>{s.label || s.id} ({s.id})</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            disabled={!centerId && !reflectionCandidates[0]}
            onClick={() => {
              const axis = centerId || reflectionCandidates[0]?.id;
              if (!axis) return;
              onUpdateModel(
                setReflectionConstraintForSegment(model, element.id, axis, sourceId || undefined),
                `Reflejo simétrico de ${element.id}`,
              );
            }}
            className={applyBtn}
          >
            {reflection ? t('editor.diagramInspector.updateReflection') : t('editor.diagramInspector.applySymmetricReflection')}
          </button>
          {reflection && (
            <button
              type="button"
              onClick={() => onUpdateModel(removeSegmentReflectionConstraint(model, element.id), `Eliminar reflejo de ${element.id}`)}
              className={removeBtn}
            >
              {t('editor.diagramInspector.removeSymmetricReflection')}
            </button>
          )}
        </>
      )}
    </div>
  );
};

/** UI unificado de restricciones de elemento (segment / angle). */
export const ElementConstraintsSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateModel,
}) => {
  const { t } = useI18n();
  const scope = constraintScopeForKind(elementKind(element));
  if (!scope || !onUpdateModel) return null;

  if (scope === 'segment') {
    const lengthConstraint = equalLengthConstraintForSegment(model, element.id);
    const otherSegments = modelElements(model).filter(e => objectKind(e) === 'segment' && e.id !== element.id);
    const editablePts = editableSegmentEndpoints(model, element.id);
    const movingPtId = lengthConstraint ? relationDraft(lengthConstraint, model.objects).refs[0] : (editablePts[0]?.id || objectConstructionReferences(element)[0] || '');
    const sourceSegId = lengthConstraint ? relationDraft(lengthConstraint, model.objects).refs[2] : (otherSegments[0]?.id || '');

    return (
      <div className="space-y-3">
        <div className={cardClass}>
          <span className="font-bold text-canela block uppercase tracking-wider text-[10px]">{t('editor.diagramInspector.equalizeSegmentLength')}</span>
          <p className="text-[11px] text-carbon/60 leading-relaxed">
            {t('editor.diagramInspector.lengthEqualityHint')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-carbon/75 font-bold mb-1">{t('editor.diagramInspector.movableEndpoint')}</label>
              <select
                value={movingPtId}
                onChange={e => {
                  if (sourceSegId && e.target.value) {
                    onUpdateModel(
                      setEqualLengthConstraint(model, element.id, e.target.value, sourceSegId),
                      `Cambiar extremo móvil a ${e.target.value}`,
                    );
                  }
                }}
                className={fieldClass}
              >
                {(editablePts.length ? editablePts.map(p => p.id) : objectConstructionReferences(element)).map(r => (
                  <option key={r} value={r}>{t('editor.diagramInspector.pointRef', { id: r })}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-carbon/75 font-bold mb-1">{t('editor.diagramInspector.segmentToEqualize')}</label>
              <select
                value={sourceSegId}
                onChange={e => {
                  if (e.target.value) {
                    onUpdateModel(
                      setEqualLengthConstraint(model, element.id, movingPtId, e.target.value),
                      `Igualar longitud de ${element.id} con ${e.target.value}`,
                    );
                  }
                }}
                className={fieldClass}
              >
                <option value="">{t('editor.diagramInspector.none')}</option>
                {otherSegments.map(s => (
                  <option key={s.id} value={s.id}>{s.label || s.id} ({s.id})</option>
                ))}
              </select>
            </div>
          </div>
          {lengthConstraint ? (
            <button
              type="button"
              onClick={() => onUpdateModel(removeConstraintFromModel(model, lengthConstraint.id), `Eliminar igualdad de longitud en ${element.id}`)}
              className={removeBtn}
            >
              {t('editor.diagramInspector.removeLengthEquality')}
            </button>
          ) : (
            <button
              type="button"
              disabled={!sourceSegId || !movingPtId}
              onClick={() => {
                if (sourceSegId) {
                  onUpdateModel(
                    setEqualLengthConstraint(model, element.id, movingPtId, sourceSegId),
                    `Igualar longitud de ${element.id} con ${sourceSegId}`,
                  );
                }
              }}
              className={applyBtn}
            >
              {t('editor.diagramInspector.applyLengthEquality')}
            </button>
          )}
        </div>

        <SegmentReflectionCard model={model} element={element} onUpdateModel={onUpdateModel} />
      </div>
    );
  }

  const constraint = equalAngleConstraintForAngle(model, element.id);
  const otherAngles = modelElements(model).filter(e =>
    (objectKind(e) === 'angle' || objectKind(e) === 'nonReflexAngle') && e.id !== element.id,
  );
  const movingPtId = constraint ? relationDraft(constraint, model.objects).refs[0] : (objectConstructionReferences(element)[0] || '');
  const sourceAngleId = constraint ? relationDraft(constraint, model.objects).refs[3] : (otherAngles[0]?.id || '');

  return (
    <div className="space-y-3">
      <div className={cardClass}>
        <span className="font-bold text-canela block uppercase tracking-wider text-[10px]">{t('editor.diagramInspector.equalizeAngleAmplitude')}</span>
        <p className="text-[11px] text-carbon/60 leading-relaxed">
          {t('editor.diagramInspector.angleEqualityHint')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] text-carbon/75 font-bold mb-1">{t('editor.diagramInspector.movableEndpointVertex')}</label>
            <select
              value={movingPtId}
              onChange={e => {
                if (constraint && sourceAngleId) {
                  onUpdateModel(
                    setEqualAngleConstraint(model, element.id, e.target.value, sourceAngleId),
                    `Cambiar punto móvil de ángulo a ${e.target.value}`,
                  );
                }
              }}
              className={fieldClass}
            >
              {objectConstructionReferences(element).map(r => (
                <option key={r} value={r}>{t('editor.diagramInspector.pointRef', { id: r })}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-carbon/75 font-bold mb-1">{t('editor.diagramInspector.angleToEqualize')}</label>
            <select
              value={sourceAngleId}
              onChange={e => {
                if (e.target.value) {
                  onUpdateModel(
                    setEqualAngleConstraint(model, element.id, movingPtId, e.target.value),
                    `Igualar amplitud de ${element.id} con ${e.target.value}`,
                  );
                }
              }}
              className={fieldClass}
            >
              <option value="">{t('editor.diagramInspector.none')}</option>
              {otherAngles.map(a => (
                <option key={a.id} value={a.id}>{a.label || a.id} ({a.id})</option>
              ))}
            </select>
          </div>
        </div>
        {constraint ? (
          <button
            type="button"
            onClick={() => onUpdateModel(removeConstraintFromModel(model, constraint.id), `Eliminar igualdad de amplitud en ${element.id}`)}
            className={removeBtn}
          >
            {t('editor.diagramInspector.removeAngleEquality')}
          </button>
        ) : (
          <button
            type="button"
            disabled={!sourceAngleId || !movingPtId}
            onClick={() => {
              if (sourceAngleId) {
                onUpdateModel(
                  setEqualAngleConstraint(model, element.id, movingPtId, sourceAngleId),
                  `Igualar amplitud de ${element.id} con ${sourceAngleId}`,
                );
              }
            }}
            className={applyBtn}
          >
            {t('editor.diagramInspector.applyAngleEquality')}
          </button>
        )}
      </div>
    </div>
  );
};
