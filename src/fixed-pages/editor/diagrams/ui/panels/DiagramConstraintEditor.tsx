import React, { useState } from 'react';
import type { AreaMembership } from '@/diagrams/model/schema/types';
import { pointPosition } from '@/diagrams';
import type { VisualDiagramModel, VisualPoint } from '../../model/types';
import {
  RELATION_CATEGORY_LABELS,
  RELATION_CATEGORY_ORDER,
  constraintPresentation,
  defaultConstraintRefs,
  relationsForPointPicker,
} from '../../model/constraints/constraintOptions';
import type { RelationDraft, RelationIntent } from '../../model/constraints/relationIntents';
import {
  addRelationDraftToPoint,
  findPositionedPoint,
  pointRelationDrafts,
  uniqueConstraintId,
  updateRelationDraft,
} from '../../model/constraints/relationModel';
import {
  candidatesForSlot,
  editableSlotsFor,
  relationAvailability,
} from '../../model/constraints/relationSlots';
import { removeConstraintFromModel } from '../../model/constraints/segmentLengthConstraints';
import { withResolvedPointConstraints } from '@/diagrams/geometry/layout/scene';
import { computeHalfPlaneSide } from '@/diagrams/geometry/areas/areaGeometry';
import { DiagramExpressionField } from './DiagramExpressionField';
import { RelationIntentPicker } from '../constraints/relations/RelationIntentPicker';
import { RelationSlotField } from '../constraints/relations/RelationSlotField';
import { DiagramButton, DiagramPanel } from '../primitives';
import { DiagramFormField, diagramInputClassName } from '../primitives/DiagramFormField';

interface DiagramConstraintEditorProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  onModelEdit: (model: VisualDiagramModel) => void;
}

function computeSameSide(model: VisualDiagramModel, refs: string[]): 1 | -1 | undefined {
  if (refs.length < 3) return undefined;
  const findXY = (id: string) => {
    const point = findPositionedPoint(model, id);
    return point ? pointPosition(point) : undefined;
  };
  const p = findXY(refs[0]);
  const a = findXY(refs[1]);
  const b = findXY(refs[2]);
  if (!p || !a || !b) return undefined;
  return computeHalfPlaneSide(a, b, p);
}

function emptyHintForKind(kind: RelationIntent): string {
  switch (kind) {
    case 'distance':
    case 'coincident':
    case 'horizontal':
    case 'vertical':
    case 'midpoint':
      return 'Añade otro punto primero';
    case 'on':
      return 'Añade una recta, segmento o curva primero';
    case 'insideArea':
      return 'Añade un área primero';
    default:
      return 'No hay objetos compatibles para esta referencia';
  }
}

export const DiagramConstraintEditor: React.FC<DiagramConstraintEditorProps> = ({ model, point, onModelEdit }) => {
  const [newKind, setNewKind] = useState<RelationIntent>('horizontal');

  const assignedConstraints = pointRelationDrafts(model, point.id);

  const activeKinds = assignedConstraints
    .filter(constraint => constraint.enabled)
    .map(constraint => constraint.kind);

  const editDraft = (constraintId: string, update: (draft: RelationDraft) => RelationDraft) => (
    updateRelationDraft(model, constraintId, update)
  );

  const changeRefs = (constraintId: string, refs: string[]) => {
    onModelEdit(withResolvedPointConstraints(editDraft(constraintId, draft => {
      const sameSide = draft.kind === 'sameSide' ? computeSameSide(model, refs) : undefined;
      return { ...draft, refs, ...(sameSide !== undefined ? { side: sameSide } : {}) };
    })));
  };

  const changeKind = (constraint: RelationDraft, kind: RelationIntent) => {
    const availability = relationAvailability(model, kind, point.id, activeKinds, { ignoreKind: constraint.kind });
    if (availability.status === 'disabled') return;
    const refs = defaultConstraintRefs(model, kind, constraint.refs[0]);
    let expression: string | undefined;
    if (kind === 'expression') expression = constraint.expression ?? '1';
    else if (kind === 'distance') expression = constraint.expression;
    const sameSide = kind === 'sameSide' ? computeSameSide(model, refs) : undefined;
    onModelEdit(withResolvedPointConstraints(editDraft(constraint.id, item => ({
      ...item,
      kind,
      label: constraintPresentation(kind).label,
      refs,
      value: kind === 'distance' ? item.value ?? 1 : undefined,
      expression,
      areaMembership: kind === 'insideArea' ? item.areaMembership ?? 'interior' : undefined,
      side: sameSide,
    }))));
  };

  const changeAreaMembership = (constraint: RelationDraft, membership: AreaMembership) => {
    onModelEdit(withResolvedPointConstraints(editDraft(constraint.id, item => ({ ...item, areaMembership: membership }))));
  };

  const changeReference = (constraint: RelationDraft, index: number, value: string) => {
    const refs = [...constraint.refs];
    refs[index] = value;
    changeRefs(constraint.id, refs);
  };

  const addConstraint = () => {
    const availability = relationAvailability(model, newKind, point.id, activeKinds);
    if (availability.status === 'disabled') return;
    const refs = defaultConstraintRefs(model, newKind, point.id);
    const presentation = constraintPresentation(newKind);
    if (refs.length < presentation.refs) return;
    const id = uniqueConstraintId(model);
    const sameSide = newKind === 'sameSide' ? computeSameSide(model, refs) : undefined;
    const constraint: RelationDraft = {
      id,
      label: presentation.label,
      kind: newKind,
      refs,
      enabled: true,
      ...(newKind === 'distance' ? { value: 1 } : {}),
      ...(sameSide !== undefined ? { side: sameSide } : {}),
    };
    onModelEdit(withResolvedPointConstraints(addRelationDraftToPoint(model, point.id, constraint)));
  };

  const deleteConstraint = (constraintId: string) => {
    onModelEdit(removeConstraintFromModel(model, constraintId));
  };

  const pickerEntries = relationsForPointPicker();
  const constraintOptions = (
    <>
      {RELATION_CATEGORY_ORDER.map(category => {
        const options = pickerEntries.filter(entry => entry.category === category);
        if (options.length === 0) return null;
        return (
          <optgroup key={category} label={RELATION_CATEGORY_LABELS[category]}>
            {options.map(option => {
              const availability = relationAvailability(model, option.value, point.id, activeKinds, {
                ignoreKind: undefined,
              });
              return (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={availability.status === 'disabled'}
                  title={availability.reason}
                >
                  {option.label}
                </option>
              );
            })}
          </optgroup>
        );
      })}
      {assignedConstraints.some(constraint => constraint.kind === 'expression') && (
        <option value="expression">{constraintPresentation('expression').label}</option>
      )}
    </>
  );

  const addAvailability = relationAvailability(model, newKind, point.id, activeKinds);

  const renderSlots = (constraint: RelationDraft) => {
    const slots = editableSlotsFor(constraint.kind);
    return slots.map(slot => {
      if (constraint.kind === 'reflection' && slot.index === 2) {
        const candidates = candidatesForSlot(model, constraint.kind, slot.index, constraint.refs);
        return (
          <RelationSlotField
            key={`${constraint.id}-ref-${slot.index}`}
            label={slot.label}
            ariaLabel={`${slot.label} de ${constraint.id}`}
            value={constraint.refs[2] || ''}
            candidates={candidates}
            emptyHint={emptyHintForKind(constraint.kind)}
            pickHint={`Elija en el lienzo: ${slot.label.toLowerCase()}`}
            optionalEmptyOption={{ value: '', label: `Posición base de ${point.label} (${point.id})` }}
            onChange={val => {
              if (!val) changeRefs(constraint.id, [constraint.refs[0], constraint.refs[1]]);
              else changeRefs(constraint.id, [constraint.refs[0], constraint.refs[1], val]);
            }}
          />
        );
      }
      const candidates = candidatesForSlot(model, constraint.kind, slot.index, constraint.refs);
      const current = constraint.refs[slot.index] || '';
      const hasCurrent = candidates.some(item => item.id === current);
      return (
        <RelationSlotField
          key={`${constraint.id}-ref-${slot.index}`}
          label={slot.label}
          ariaLabel={`${slot.label} de ${constraint.id}`}
          value={hasCurrent ? current : ''}
          candidates={candidates}
          emptyHint={emptyHintForKind(constraint.kind)}
          pickHint={`Elija en el lienzo: ${slot.label.toLowerCase()}`}
          onChange={val => changeReference(constraint, slot.index, val)}
        />
      );
    });
  };

  return (
    <section aria-label="Relaciones geométricas del punto" className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h5 className="text-xs font-bold text-carbon">Relaciones geométricas</h5>
          <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">
            Todas las relaciones activas se cumplen a la vez. Se pueden pausar sin perder su configuración.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-pavo/10 px-2 py-1 text-[9px] font-bold text-pavo">
          {assignedConstraints.length} activa{assignedConstraints.length === 1 ? '' : 's'}
        </span>
      </div>

      {assignedConstraints.length === 0 && (
        <p className="border-l-2 border-carbon/15 pl-3 text-[10px] leading-relaxed text-carbon/50">
          Este punto todavía no depende de ninguna relación.
        </p>
      )}

      <div className="divide-y divide-carbon/10 border-y border-carbon/10">
        {assignedConstraints.map(constraint => {
          const presentation = constraintPresentation(constraint.kind);
          const kindAvailability = relationAvailability(model, constraint.kind, point.id, activeKinds, {
            ignoreKind: constraint.kind,
          });
          return (
            <DiagramPanel
              key={constraint.id}
              title={presentation.label}
              badge={constraint.enabled ? 'Activa' : 'Pausada'}
              className="my-3 border-0 bg-transparent p-0 shadow-none"
            >
              <header className="flex items-start gap-2">
                <label className="flex min-h-11 flex-1 items-center gap-2 text-xs font-bold text-carbon">
                  <input
                    aria-label={`Relación activa de ${constraint.id}`}
                    type="checkbox"
                    checked={constraint.enabled}
                    onChange={event => onModelEdit(editDraft(constraint.id, item => ({ ...item, enabled: event.target.checked })))}
                  />
                  <span>Activa</span>
                </label>
                <DiagramButton type="button" variant="ghost" aria-label="Eliminar relación" onClick={() => deleteConstraint(constraint.id)}>
                  Eliminar
                </DiagramButton>
              </header>
              <p className="text-[10px] leading-relaxed text-carbon/55">{presentation.description}</p>
              <DiagramFormField label="Tipo de relación" className="p-0 border-0">
                <select
                  aria-label={`Tipo de ${constraint.id}`}
                  className={diagramInputClassName}
                  value={constraint.kind}
                  onChange={event => changeKind(constraint, event.target.value as RelationIntent)}
                >
                  {constraintOptions}
                </select>
              </DiagramFormField>
              {kindAvailability.status === 'disabled' && kindAvailability.reason && (
                <p className="rounded bg-ocre/10 p-2 text-[10px] font-medium text-ocre" role="status">
                  {kindAvailability.reason}
                </p>
              )}
              {renderSlots(constraint)}
              {constraint.kind === 'insideArea' && (
                <DiagramFormField label="Pertenencia al área" className="p-0 border-0">
                  <select
                    aria-label={`Pertenencia al área de ${constraint.id}`}
                    className={diagramInputClassName}
                    value={constraint.areaMembership ?? 'interior'}
                    onChange={event => changeAreaMembership(constraint, event.target.value as AreaMembership)}
                  >
                    <option value="interior">Interior</option>
                    <option value="boundary">Perímetro o frontera</option>
                  </select>
                </DiagramFormField>
              )}
              {constraint.kind === 'distance' && (
                <DiagramFormField label="Distancia" className="p-0 border-0">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    aria-label={`Distancia de ${constraint.id}`}
                    className={diagramInputClassName}
                    value={constraint.value ?? 1}
                    onChange={event => onModelEdit(editDraft(constraint.id, item => ({ ...item, value: Number(event.target.value), expression: undefined })))}
                  />
                </DiagramFormField>
              )}
              {constraint.kind === 'expression' && (
                <DiagramExpressionField
                  model={model}
                  label="Expresión conservada"
                  ariaLabel={`Expresión de ${constraint.id}`}
                  value={constraint.expression ?? ''}
                  onChange={value => onModelEdit(editDraft(constraint.id, item => ({ ...item, expression: value })))}
                  help="La relación usa el mismo lenguaje matemático seguro que fórmulas, curvas y condiciones de visibilidad."
                />
              )}
            </DiagramPanel>
          );
        })}
      </div>

      <DiagramPanel title="Nueva relación" className="mt-1">
        <RelationIntentPicker
          model={model}
          scope="point"
          targetId={point.id}
          value={newKind}
          onChange={setNewKind}
          activeKinds={activeKinds}
        />
        <DiagramButton
          type="button"
          variant="primary"
          fullWidth
          disabled={addAvailability.status === 'disabled'}
          onClick={addConstraint}
        >
          Añadir relación
        </DiagramButton>
      </DiagramPanel>
    </section>
  );
};

export default DiagramConstraintEditor;
