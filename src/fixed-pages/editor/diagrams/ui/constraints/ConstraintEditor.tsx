import React, { useState } from 'react';
import type { AreaMembership } from '@/diagrams/model/schema/types';
import type { VisualDiagramModel } from '../../model/types';
import {
  RELATION_CATALOG,
  RELATION_CATEGORY_LABELS,
  RELATION_CATEGORY_ORDER,
  constraintPresentation,
  defaultConstraintRefs,
  getConstraintDisabledReason,
  getConstraintSlotLabel,
  relationsForScope,
  RelationScope,
  uniqueConstraintId,
  removeConstraintFromModel,
  modelRelationDrafts,
  updateRelationDraft,
  addRelationDraftToPoint,
  draftToRelation,
  findPositionedPoint,
  modelPoints,
  modelElements,
  type RelationDraft,
  type RelationIntent,
  candidatesForSlot,
  editableSlotsFor,
} from '../../model';
import { withResolvedPointConstraints } from '@/diagrams/geometry/layout/scene';
import { objectKind } from '@/diagrams';
import { IconPlus, IconTrash } from '../toolbar/WorkbenchIcons';
import { useI18n } from '@/i18n';
import { Button, Card, Field, IconButton, Modal, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface ConstraintEditorProps {
  model: VisualDiagramModel | null;
  selectedId?: string;
  onUpdateModel: (nextModel: VisualDiagramModel, label: string) => void;
}

export const ConstraintEditor: React.FC<ConstraintEditorProps> = ({
  model,
  selectedId,
  onUpdateModel,
}) => {
  const { t } = useI18n();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKind, setNewKind] = useState<RelationIntent>('fixed');
  const [newTargetId, setNewTargetId] = useState<string>('');

  if (!model) return null;

  const constraints = modelRelationDrafts(model);
  const points = modelPoints(model);
  const elements = modelElements(model);
  const selectedPoint = selectedId ? findPositionedPoint(model, selectedId) : undefined;
  const selectedRelationIds = selectedPoint?.mobility.type === 'constrained' ? selectedPoint.mobility.relationIds : [];

  const activeConstraints = selectedId
    ? constraints.filter(c => c.refs.includes(selectedId) || selectedRelationIds.includes(c.id))
    : constraints;

  const handleToggleConstraint = (id: string) => {
    onUpdateModel(
      withResolvedPointConstraints(updateRelationDraft(model, id, c => ({ ...c, enabled: c.enabled === false }))),
      `Alternar restricción ${id}`,
    );
  };

  const handleDeleteConstraint = (id: string) => {
    onUpdateModel(removeConstraintFromModel(model, id), `Eliminar restricción ${id}`);
  };

  const handleUpdateSlotRef = (constraintId: string, slotIndex: number, newRefId: string) => {
    const nextModel = updateRelationDraft(model, constraintId, c => {
      const nextRefs = [...c.refs];
      nextRefs[slotIndex] = newRefId;
      return { ...c, refs: nextRefs };
    });
    onUpdateModel(withResolvedPointConstraints(nextModel), `Actualizar referencia de restricción ${constraintId}`);
  };

  const handleUpdateConstraintField = (
    constraintId: string,
    patch: Partial<RelationDraft>,
  ) => {
    onUpdateModel(
      withResolvedPointConstraints(updateRelationDraft(model, constraintId, c => ({ ...c, ...patch }))),
      `Actualizar restricción ${constraintId}`,
    );
  };

  const handleAddConstraint = () => {
    const target = newTargetId || selectedId || (points[0]?.id ?? elements[0]?.id ?? '');
    if (!target) return;

    const refs = defaultConstraintRefs(model, newKind, target);
    const id = uniqueConstraintId(model);
    const presentation = constraintPresentation(newKind);
    const point = points.find(p => p.id === target);

    const newConstraint: RelationDraft = {
      id,
      label: presentation.label,
      kind: newKind,
      refs,
      enabled: true,
      ...(newKind === 'distance' ? { value: 1 } : {}),
    };

    let nextModel: VisualDiagramModel = model;
    if (point) {
      nextModel = addRelationDraftToPoint(model, point.id, newConstraint);
    } else {
      const relation = draftToRelation(newConstraint, model.objects);
      if (relation) nextModel = { ...model, relations: [...model.relations, relation] };
    }
    onUpdateModel(withResolvedPointConstraints(nextModel), `Añadir restricción ${presentation.label}`);
    setShowAddModal(false);
  };

  return (
    <div className="p-2.5 space-y-3 font-serif text-xs text-carbon">
      <div className="flex items-center justify-between border-b border-carbon/10 pb-2">
        <div>
          <h3 className="font-bold text-[10px] uppercase tracking-wider text-canela">
            {selectedId ? t('editor.diagramConstraints.constraintsOf', { id: selectedId }) : t('editor.diagramConstraints.constraintsTotal', { count: constraints.length })}
          </h3>
          <p className="text-[10px] text-carbon/55">
            {t('editor.diagramConstraints.constraintsSubtitle')}
          </p>
        </div>
        <Button size="sm" variant="primary" onClick={() => {
            setNewTargetId(selectedId || points[0]?.id || '');
            setShowAddModal(true);
          }}>
          <IconPlus className="w-3 h-3" />
          <span>{t('editor.diagramConstraints.constraint')}</span>
        </Button>
      </div>

      {activeConstraints.length === 0 ? (
        <p className="text-center py-4 text-carbon/40 italic">
          {selectedId
            ? t('editor.diagramConstraints.noActiveConstraints', { id: selectedId })
            : t('editor.diagramConstraints.noConstraints')}
        </p>
      ) : (
        <div className="space-y-2">
          {activeConstraints.map(c => {
            const presentation = constraintPresentation(c.kind);
            const disabledReason = getConstraintDisabledReason(model, c.kind, c.refs[0] || '');
            const slots = editableSlotsFor(c.kind);
            return (
              <div
                key={c.id}
                className={`p-2.5 rounded-xl border transition-all bg-carbon/5 ${
                  c.enabled === false ? 'border-carbon/10 opacity-60' : 'border-carbon/15 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={c.enabled !== false}
                      onChange={() => handleToggleConstraint(c.id)}
                      className="rounded text-canela border-carbon/20 focus:ring-canela cursor-pointer"
                      title={c.enabled === false ? t('editor.diagramConstraints.enableConstraint') : t('editor.diagramConstraints.disableConstraint')}
                    />
                    <span className="font-bold text-xs text-carbon">{c.label || presentation.label}</span>
                  </div>
                  <IconButton size="sm" tone="danger" label={t('editor.diagramConstraints.deleteConstraint')} onClick={() => handleDeleteConstraint(c.id)}>
                    <IconTrash className="w-3.5 h-3.5" />
                  </IconButton>
                </div>

                <p className="text-[10px] text-carbon/60 mb-2 leading-tight">{presentation.description}</p>

                <Card className="space-y-1.5">
                  <span className="text-[10px] font-bold text-carbon/70 block">
                    {t('editor.diagramConstraints.referencesCount', { current: c.refs.length, total: presentation.refs })}
                  </span>
                  <div className="space-y-1">
                    {(slots.length > 0 ? slots : c.refs.map((_, index) => ({ index, label: getConstraintSlotLabel(c.kind, index) }))).map(slot => {
                      const slotIdx = slot.index;
                      const refId = c.refs[slotIdx] || '';
                      const candidates = candidatesForSlot(model, c.kind, slotIdx, c.refs);
                      const options = candidates.some(item => item.id === refId) || !refId
                        ? candidates
                        : [{ id: refId, label: refId }, ...candidates];
                      return (
                        <Card className="flex flex-col space-y-0.5 text-[10px]" key={slotIdx}>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-canela font-bold">{t('editor.diagramConstraints.slotN', { n: slotIdx + 1 })}</span>
                            <span className="text-[10px] text-carbon/60 font-medium italic">
                              {slot.label || getConstraintSlotLabel(c.kind, slotIdx)}
                            </span>
                          </div>
                          <select
                            value={refId}
                            onChange={e => handleUpdateSlotRef(c.id, slotIdx, e.target.value)}
                            className={`${controlClassName} font-mono`}
                          >
                            {!refId && <option value="">{t('editor.diagramConstraints.select')}</option>}
                            {options.map(cand => (
                              <option key={cand.id} value={cand.id}>
                                {cand.label || cand.id} ({cand.id})
                              </option>
                            ))}
                          </select>
                        </Card>
                      );
                    })}
                  </div>
                </Card>

                {c.kind === 'distance' && (
                  <label className="mt-2 block text-[10px] font-bold text-carbon/70">
                    {t('editor.diagramConstraints.distance')}
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={c.value ?? 1}
                      onChange={e => handleUpdateConstraintField(c.id, {
                        value: Number(e.target.value),
                        expression: undefined,
                      })}
                      className={`${controlClassName} mt-0.5 font-mono`}
                    />
                  </label>
                )}

                {c.kind === 'expression' && (
                  <label className="mt-2 block text-[10px] font-bold text-carbon/70">
                    {t('editor.diagramConstraints.expression')}
                    <input
                      type="text"
                      value={c.expression ?? ''}
                      onChange={e => handleUpdateConstraintField(c.id, { expression: e.target.value })}
                      className={`${controlClassName} mt-0.5 font-mono`}
                    />
                  </label>
                )}

                {c.kind === 'insideArea' && (
                  <label className="mt-2 block text-[10px] font-bold text-carbon/70">
                    {t('editor.diagramConstraints.areaMembership')}
                    <select
                      value={c.areaMembership ?? 'interior'}
                      onChange={e => handleUpdateConstraintField(c.id, {
                        areaMembership: e.target.value as AreaMembership,
                      })}
                      className={`${controlClassName} mt-0.5`}
                    >
                      <option value="interior">{t('editor.diagramConstraints.interior')}</option>
                      <option value="boundary">{t('editor.diagramConstraints.perimeterOrBoundary')}</option>
                    </select>
                  </label>
                )}

                {c.kind === 'sameSide' && (
                  <label className="mt-2 block text-[10px] font-bold text-carbon/70">
                    {t('editor.diagramConstraints.side')}
                    <select
                      value={c.side ?? 1}
                      onChange={e => handleUpdateConstraintField(c.id, {
                        side: Number(e.target.value) as 1 | -1,
                      })}
                      className={`${controlClassName} mt-0.5`}
                    >
                      <option value={1}>{t('editor.diagramConstraints.positive')}</option>
                      <option value={-1}>{t('editor.diagramConstraints.negative')}</option>
                    </select>
                  </label>
                )}

                {disabledReason && (
                  <p className="mt-1 text-[10px] text-granada font-medium bg-granada/5 p-1.5 rounded border border-granada/15">
                    {disabledReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={t('editor.diagramConstraints.newConstraint')}
        footer={
          <>
            <Button onClick={() => setShowAddModal(false)}>{t('editor.diagramConstraints.cancel')}</Button>
            <Button variant="primary" onClick={handleAddConstraint}>{t('editor.diagramConstraints.createConstraint')}</Button>
          </>
        }
      >
        <div className="space-y-3">
            <Field label={t('editor.diagramConstraints.constraintMainObject')}>
              <select
                value={newTargetId}
                onChange={e => setNewTargetId(e.target.value)}
              >
                <optgroup label={t('editor.diagramConstraints.points')}>
                  {points.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.label || p.id} ({p.id})
                    </option>
                  ))}
                </optgroup>
                <optgroup label={t('editor.diagramConstraints.elementsSegments')}>
                  {elements.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.label || e.id} ({objectKind(e)})
                    </option>
                  ))}
                </optgroup>
              </select>
            </Field>

            <Field label={t('editor.diagramConstraints.constraintType')}>
              <select
                value={newKind}
                onChange={e => setNewKind(e.target.value as RelationIntent)}
              >
                {(() => {
                  const targetScope: RelationScope | undefined = points.some(p => p.id === (newTargetId || selectedId))
                    ? 'point'
                    : elements.some(e => e.id === (newTargetId || selectedId) && objectKind(e) === 'segment')
                    ? 'segment'
                    : elements.some(e => e.id === (newTargetId || selectedId) && ['angle', 'nonReflexAngle', 'rightAngle'].includes(objectKind(e)))
                    ? 'angle'
                    : undefined;

                  const allowedEntries = targetScope ? relationsForScope(targetScope) : RELATION_CATALOG;

                  return RELATION_CATEGORY_ORDER.map(cat => {
                    const catEntries = allowedEntries.filter(entry => entry.category === cat);
                    if (catEntries.length === 0) return null;
                    return (
                      <optgroup key={cat} label={RELATION_CATEGORY_LABELS[cat]}>
                        {catEntries.map(entry => (
                          <option key={entry.value} value={entry.value}>
                            {entry.label}
                          </option>
                        ))}
                      </optgroup>
                    );
                  });
                })()}
              </select>
            </Field>

            <div className="border-l-2 border-[color:var(--ed-rule-strong)] pl-3 text-sm">
              <span className="font-bold block text-carbon">{t('editor.diagramConstraints.informationAndCompatibility')}</span>
              <p className="text-carbon/70">{constraintPresentation(newKind).description}</p>
              <p className="text-carbon/50 mt-1">
                {t(constraintPresentation(newKind).refs === 1 ? 'editor.diagramConstraints.requiresRefsOne' : 'editor.diagramConstraints.requiresRefsOther', { count: constraintPresentation(newKind).refs })}
              </p>
            </div>
        </div>
      </Modal>
    </div>
  );
};
