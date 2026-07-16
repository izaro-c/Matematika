import React, { useState } from 'react';
import type { VisualConstraint, VisualDiagramModel, VisualPoint } from '../model/types';
import { updatePoint } from '../model/commands';
import { CONSTRAINT_OPTIONS, constraintPresentation, defaultConstraintRefs, withConstraintDependencies } from '../model/constraintOptions';
import { removeConstraintFromModel } from '../model/segmentLengthConstraints';

function referenceCandidates(model: VisualDiagramModel, constraint: VisualConstraint, index: number) {
  if (index === 0) return model.points;
  if (constraint.kind === 'on' && index === 1) return model.elements;
  if (constraint.kind === 'equalLength') {
    if (index === 1) {
      return model.points.filter(candidate => model.elements.some(element => (
        element.kind === 'segment'
        && element.refs.includes(constraint.refs[0])
        && element.refs.includes(candidate.id)
      )));
    }
    if (index === 2) {
      const targetSegment = model.elements.find(element => (
        element.kind === 'segment'
        && element.refs.includes(constraint.refs[0])
        && element.refs.includes(constraint.refs[1])
      ));
      return model.elements.filter(element => element.kind === 'segment' && element.id !== targetSegment?.id);
    }
  }
  if (constraint.kind === 'midpoint') {
    return model.points.filter(candidate => !constraint.refs.slice(0, index).includes(candidate.id));
  }
  return [...model.points, ...model.elements];
}

function referenceLabel(constraint: VisualConstraint, index: number): string {
  if (constraint.kind === 'equalLength') {
    return ['Extremo ajustado', 'Extremo ancla', 'Segmento de referencia'][index] ?? `Referencia ${index}`;
  }
  if (constraint.kind === 'midpoint') {
    return ['Punto medio', 'Primer extremo', 'Segundo extremo'][index] ?? `Referencia ${index}`;
  }
  return index === 0 ? 'Punto restringido' : `Referencia ${index}`;
}

interface DiagramConstraintEditorProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  onModelEdit: (model: VisualDiagramModel) => void;
}

export const DiagramConstraintEditor: React.FC<DiagramConstraintEditorProps> = ({ model, point, onModelEdit }) => {
  const [newKind, setNewKind] = useState<VisualConstraint['kind']>('horizontal');

  const changeRefs = (constraintId: string, refs: string[]) => {
    const next = withConstraintDependencies(model, constraintId, refs);
    onModelEdit({
      ...next,
      constraints: model.constraints?.map(constraint => constraint.id === constraintId ? { ...constraint, refs } : constraint),
    });
  };

  const changeKind = (constraint: VisualConstraint, kind: VisualConstraint['kind']) => {
    const refs = defaultConstraintRefs(model, kind, constraint.refs[0]);
    const next = withConstraintDependencies(model, constraint.id, refs);
    let expression: string | undefined;
    if (kind === 'expression') expression = constraint.expression ?? '1';
    else if (kind === 'distance') expression = constraint.expression;
    onModelEdit({
      ...next,
      constraints: model.constraints?.map(item => item.id === constraint.id ? {
        ...item,
        kind,
        label: constraintPresentation(kind).label,
        refs,
        value: kind === 'distance' ? item.value ?? 1 : undefined,
        expression,
      } : item),
    });
  };

  const changeReference = (constraint: VisualConstraint, index: number, value: string) => {
    const refs = [...constraint.refs];
    refs[index] = value;
    changeRefs(constraint.id, refs);
  };

  const addConstraint = () => {
    const refs = defaultConstraintRefs(model, newKind, point.id);
    const presentation = constraintPresentation(newKind);
    if (refs.length < presentation.refs) return;
    let index = (model.constraints?.length ?? 0) + 1;
    while (model.constraints?.some(item => item.id === `constraint${index}`)) index += 1;
    const id = `constraint${index}`;
    const constraint: VisualConstraint = {
      id,
      label: presentation.label,
      kind: newKind,
      refs,
      enabled: true,
      ...(newKind === 'distance' ? { value: 1 } : {}),
    };
    const next = withConstraintDependencies(model, id, refs);
    const nextWithConstraint = {
      ...next,
      constraints: [...(model.constraints || []), constraint],
    };
    onModelEdit(updatePoint(nextWithConstraint, point.id, {
      constraint: 'constrained',
      constraintIds: [...(point.constraintIds || []), id],
    }));
  };

  const deleteConstraint = (constraintId: string) => {
    onModelEdit(removeConstraintFromModel(model, constraintId));
  };

  const assignedConstraints = (point.constraintIds || [])
    .map(id => model.constraints?.find(item => item.id === id))
    .filter((constraint): constraint is VisualConstraint => Boolean(constraint));
  const defaultRefs = defaultConstraintRefs(model, newKind, point.id);

  return (
    <div className="space-y-2 rounded border border-pavo/20 bg-pavo/5 p-2">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-pavo">Cómo puede moverse este punto</p>
        <p className="mt-1 text-[10px] leading-relaxed text-carbon/55">Las relaciones activas se cumplen simultáneamente al mover el punto. Cada tarjeta explica qué objetos intervienen.</p>
      </div>
      {assignedConstraints.length === 0 && <p className="rounded bg-lienzo p-2 text-[10px] text-carbon/55">Todavía no hay ninguna relación asignada.</p>}
      {assignedConstraints.map(constraint => {
        const presentation = constraintPresentation(constraint.kind);
        return (
          <details key={constraint.id} className="rounded border border-carbon/10 bg-lienzo" open>
            <summary className="cursor-pointer list-none px-2 py-1.5 text-xs font-bold text-carbon [&::-webkit-details-marker]:hidden">
              {presentation.label}<span className="float-right text-[9px] font-normal text-carbon/45">{constraint.enabled ? 'Activa' : 'Pausada'} ▾</span>
            </summary>
            <div className="space-y-2 border-t border-carbon/10 p-2">
              <p className="text-[10px] leading-relaxed text-carbon/55">{presentation.description}</p>
              <select aria-label={`Tipo de ${constraint.id}`} className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={constraint.kind} onChange={event => changeKind(constraint, event.target.value as VisualConstraint['kind'])}>
                {CONSTRAINT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                {constraint.kind === 'expression' && <option value="expression">Relación por expresión</option>}
              </select>
              {constraint.refs.map((ref, index) => {
                const candidates = referenceCandidates(model, constraint, index);
                return (
                  <label key={`${constraint.id}-ref-${index}`} className="block text-[10px] font-bold text-carbon/60">
                    {referenceLabel(constraint, index)}
                    <select aria-label={`Referencia ${index + 1} de ${constraint.id}`} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={ref} onChange={event => changeReference(constraint, index, event.target.value)}>
                      {candidates.map(item => <option key={item.id} value={item.id}>{item.label} ({item.id})</option>)}
                    </select>
                  </label>
                );
              })}
              {constraint.kind === 'distance' && (
                <label className="block text-[10px] font-bold text-carbon/60">Distancia
                  <input type="number" min="0" step="0.1" aria-label={`Distancia de ${constraint.id}`} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={constraint.value ?? 1} onChange={event => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, value: Number(event.target.value), expression: undefined } : item) })} />
                </label>
              )}
              {constraint.kind === 'expression' && (
                <label className="block text-[10px] font-bold text-carbon/60">Expresión conservada
                  <input aria-label={`Expresión de ${constraint.id}`} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={constraint.expression ?? ''} onChange={event => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, expression: event.target.value } : item) })} />
                </label>
              )}
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-start gap-1.5 text-[10px] text-carbon">
                  <input type="checkbox" checked={constraint.enabled} onChange={event => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, enabled: event.target.checked } : item) })} />
                  <span>Relación activa<span className="block font-normal leading-relaxed text-carbon/45">Desmarcar para pausarla sin eliminarla.</span></span>
                </label>
                <button type="button" className="text-[10px] font-bold text-granada hover:underline" onClick={() => deleteConstraint(constraint.id)}>Eliminar relación</button>
              </div>
            </div>
          </details>
        );
      })}
      <div className="rounded border border-dashed border-pavo/25 bg-lienzo p-2">
        <label className="block text-[10px] font-bold text-carbon/60">Añadir una relación
          <select aria-label="Nueva restricción" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={newKind} onChange={event => setNewKind(event.target.value as VisualConstraint['kind'])}>
            {CONSTRAINT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">{constraintPresentation(newKind).description}</p>
        <button type="button" disabled={defaultRefs.length < constraintPresentation(newKind).refs} className="mt-2 w-full rounded bg-pavo px-2 py-1.5 text-xs font-bold text-lienzo disabled:cursor-not-allowed disabled:opacity-35" onClick={addConstraint}>Añadir relación</button>
      </div>
    </div>
  );
};

export default DiagramConstraintEditor;
