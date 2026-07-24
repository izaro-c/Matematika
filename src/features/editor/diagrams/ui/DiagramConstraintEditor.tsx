import React, { useState } from 'react';
import type { AreaMembership } from '../../../../shared/diagrams/spec/types';
import type { VisualConstraint, VisualDiagramModel, VisualPoint } from '../model/types';
import { updatePoint } from '../model';
import {
  RELATION_CATEGORY_LABELS,
  RELATION_CATEGORY_ORDER,
  constraintPresentation,
  defaultConstraintRefs,
  relationsForPointPicker,
  uniqueConstraintId,
  withConstraintDependencies,
} from '../model/constraintOptions';
import {
  candidatesForSlot,
  editableSlotsFor,
  relationAvailability,
} from '../model/relationSlots';
import { removeConstraintFromModel } from '../model/segmentLengthConstraints';
import { withResolvedPointConstraints } from '../../../../shared/diagrams/spec/scene';
import { computeHalfPlaneSide } from '../../../../shared/diagrams/spec/areaGeometry';
import { DiagramExpressionField } from './DiagramExpressionField';
import { RelationIntentPicker } from './relations/RelationIntentPicker';
import { RelationSlotField } from './relations/RelationSlotField';
import { DiagramButton, DiagramField, DiagramPanel } from './primitives';

interface DiagramConstraintEditorProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  onModelEdit: (model: VisualDiagramModel) => void;
}

function computeSameSide(model: VisualDiagramModel, refs: string[]): 1 | -1 | undefined {
  if (refs.length < 3) return undefined;
  const findXY = (id: string) => model.points.find(p => p.id === id);
  const p = findXY(refs[0]);
  const a = findXY(refs[1]);
  const b = findXY(refs[2]);
  if (!p || !a || !b) return undefined;
  return computeHalfPlaneSide(a, b, p);
}

function emptyHintForKind(kind: VisualConstraint['kind']): string {
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
  const [newKind, setNewKind] = useState<VisualConstraint['kind']>('horizontal');

  const assignedConstraints = (point.constraintIds || [])
    .map(id => model.constraints?.find(item => item.id === id))
    .filter((constraint): constraint is VisualConstraint => Boolean(constraint));

  const activeKinds = assignedConstraints
    .filter(constraint => constraint.enabled)
    .map(constraint => constraint.kind);

  const changeRefs = (constraintId: string, refs: string[]) => {
    const constraint = model.constraints?.find(item => item.id === constraintId);
    const dependencyRefs = constraint?.kind === 'equalAngle' ? refs.slice(0, 4) : refs;
    const next = withConstraintDependencies(model, constraintId, dependencyRefs);
    const sameSide = constraint?.kind === 'sameSide'
      ? computeSameSide(model, refs)
      : undefined;
    const updatedModel = {
      ...next,
      constraints: model.constraints?.map(c => c.id === constraintId
        ? { ...c, refs, ...(sameSide !== undefined ? { side: sameSide } : {}) }
        : c),
    };
    onModelEdit(withResolvedPointConstraints(updatedModel));
  };

  const changeKind = (constraint: VisualConstraint, kind: VisualConstraint['kind']) => {
    const availability = relationAvailability(model, kind, point.id, activeKinds, { ignoreKind: constraint.kind });
    if (availability.status === 'disabled') return;
    const refs = defaultConstraintRefs(model, kind, constraint.refs[0]);
    const next = withConstraintDependencies(model, constraint.id, kind === 'equalAngle' ? refs.slice(0, 4) : refs);
    let expression: string | undefined;
    if (kind === 'expression') expression = constraint.expression ?? '1';
    else if (kind === 'distance') expression = constraint.expression;
    const sameSide = kind === 'sameSide' ? computeSameSide(model, refs) : undefined;
    const updatedModel = {
      ...next,
      constraints: model.constraints?.map(item => item.id === constraint.id ? {
        ...item,
        kind,
        label: constraintPresentation(kind).label,
        refs,
        value: kind === 'distance' ? item.value ?? 1 : undefined,
        expression,
        ...(kind === 'insideArea' ? { areaMembership: item.areaMembership ?? 'interior' } : { areaMembership: undefined }),
        ...(sameSide !== undefined ? { side: sameSide } : { side: undefined }),
      } : item),
    };
    onModelEdit(withResolvedPointConstraints(updatedModel));
  };

  const changeAreaMembership = (constraint: VisualConstraint, membership: AreaMembership) => {
    onModelEdit(withResolvedPointConstraints({
      ...model,
      constraints: model.constraints?.map(item => (
        item.id === constraint.id ? { ...item, areaMembership: membership } : item
      )),
    }));
  };

  const changeReference = (constraint: VisualConstraint, index: number, value: string) => {
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
    const constraint: VisualConstraint = {
      id,
      label: presentation.label,
      kind: newKind,
      refs,
      enabled: true,
      ...(newKind === 'distance' ? { value: 1 } : {}),
      ...(sameSide !== undefined ? { side: sameSide } : {}),
    };
    const next = withConstraintDependencies(model, id, newKind === 'equalAngle' ? refs.slice(0, 4) : refs);
    const nextWithConstraint = {
      ...next,
      constraints: [...(model.constraints || []), constraint],
    };
    const updatedWithPoint = updatePoint(nextWithConstraint, point.id, {
      constraint: 'constrained',
      constraintIds: [...(point.constraintIds || []), id],
    });
    onModelEdit(withResolvedPointConstraints(updatedWithPoint));
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

  const renderSlots = (constraint: VisualConstraint) => {
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
                    onChange={event => onModelEdit({
                      ...model,
                      constraints: model.constraints?.map(item => item.id === constraint.id
                        ? { ...item, enabled: event.target.checked }
                        : item),
                    })}
                  />
                  <span>Activa</span>
                </label>
                <DiagramButton type="button" variant="ghost" aria-label="Eliminar relación" onClick={() => deleteConstraint(constraint.id)}>
                  Eliminar
                </DiagramButton>
              </header>
              <p className="text-[10px] leading-relaxed text-carbon/55">{presentation.description}</p>
              <DiagramField label="Tipo de relación">
                <select
                  aria-label={`Tipo de ${constraint.id}`}
                  value={constraint.kind}
                  onChange={event => changeKind(constraint, event.target.value as VisualConstraint['kind'])}
                >
                  {constraintOptions}
                </select>
              </DiagramField>
              {kindAvailability.status === 'disabled' && kindAvailability.reason && (
                <p className="rounded bg-ocre/10 p-2 text-[10px] font-medium text-ocre" role="status">
                  {kindAvailability.reason}
                </p>
              )}
              {renderSlots(constraint)}
              {constraint.kind === 'insideArea' && (
                <DiagramField label="Pertenencia al área">
                  <select
                    aria-label={`Pertenencia al área de ${constraint.id}`}
                    value={constraint.areaMembership ?? 'interior'}
                    onChange={event => changeAreaMembership(constraint, event.target.value as AreaMembership)}
                  >
                    <option value="interior">Interior</option>
                    <option value="boundary">Perímetro o frontera</option>
                  </select>
                </DiagramField>
              )}
              {constraint.kind === 'distance' && (
                <DiagramField label="Distancia">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    aria-label={`Distancia de ${constraint.id}`}
                    value={constraint.value ?? 1}
                    onChange={event => onModelEdit({
                      ...model,
                      constraints: model.constraints?.map(item => item.id === constraint.id
                        ? { ...item, value: Number(event.target.value), expression: undefined }
                        : item),
                    })}
                  />
                </DiagramField>
              )}
              {constraint.kind === 'expression' && (
                <DiagramExpressionField
                  model={model}
                  label="Expresión conservada"
                  ariaLabel={`Expresión de ${constraint.id}`}
                  value={constraint.expression ?? ''}
                  onChange={value => onModelEdit({
                    ...model,
                    constraints: model.constraints?.map(item => item.id === constraint.id
                      ? { ...item, expression: value }
                      : item),
                  })}
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
