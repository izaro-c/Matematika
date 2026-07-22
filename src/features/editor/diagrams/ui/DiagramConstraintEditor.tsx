import React, { useState } from 'react';
import type { VisualConstraint, VisualDiagramModel, VisualPoint } from '../model/types';
import { updatePoint } from '../model/commands';
import { CONSTRAINT_OPTIONS, constraintPresentation, defaultConstraintRefs, withConstraintDependencies } from '../model/constraintOptions';
import { removeConstraintFromModel } from '../model/segmentLengthConstraints';
import { DiagramExpressionField } from './DiagramExpressionField';

function equalLengthReferenceCandidates(model: VisualDiagramModel, constraint: VisualConstraint, index: number) {
  if (index === 1) {
    return model.points.filter(candidate => model.elements.some(element => (
      element.kind === 'segment'
      && element.refs.includes(constraint.refs[0])
      && element.refs.includes(candidate.id)
    )));
  }
  if (index !== 2) return [...model.points, ...model.elements];
  const targetSegment = model.elements.find(element => (
    element.kind === 'segment'
    && element.refs.includes(constraint.refs[0])
    && element.refs.includes(constraint.refs[1])
  ));
  return model.elements.filter(element => element.kind === 'segment' && element.id !== targetSegment?.id);
}

function equalAngleReferenceCandidates(model: VisualDiagramModel, constraint: VisualConstraint, index: number) {
  const targetAngles = model.elements.filter(element => (
    (element.kind === 'angle' || element.kind === 'nonReflexAngle')
    && (element.refs[0] === constraint.refs[0] || element.refs[2] === constraint.refs[0])
  ));
  if (index === 1) return model.points.filter(candidate => targetAngles.some(angle => angle.refs[1] === candidate.id));
  if (index === 2) {
    return model.points.filter(candidate => targetAngles.some(angle => (
      angle.refs[1] === constraint.refs[1]
      && candidate.id !== constraint.refs[0]
      && (angle.refs[0] === candidate.id || angle.refs[2] === candidate.id)
    )));
  }
  if (index === 3) {
    const targetAngle = targetAngles.find(angle => angle.refs[1] === constraint.refs[1] && angle.refs.includes(constraint.refs[2]));
    return model.elements.filter(element => element.id !== targetAngle?.id && element.kind === targetAngle?.kind && !element.refs.includes(constraint.refs[0]));
  }
  return index === 4 ? targetAngles : [...model.points, ...model.elements];
}

function referenceCandidates(model: VisualDiagramModel, constraint: VisualConstraint, index: number) {
  if (index === 0) return model.points;
  if (constraint.kind === 'on' && index === 1) return model.elements;
  if (constraint.kind === 'equalLength') return equalLengthReferenceCandidates(model, constraint, index);
  if (constraint.kind === 'equalAngle') return equalAngleReferenceCandidates(model, constraint, index);
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
  if (constraint.kind === 'equalAngle') {
    return ['Extremo ajustado', 'Vértice', 'Punto del lado fijo', 'Ángulo de referencia', 'Ángulo ajustado'][index] ?? `Referencia ${index}`;
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
    const constraint = model.constraints?.find(item => item.id === constraintId);
    const dependencyRefs = constraint?.kind === 'equalAngle' ? refs.slice(0, 4) : refs;
    const next = withConstraintDependencies(model, constraintId, dependencyRefs);
    onModelEdit({
      ...next,
      constraints: model.constraints?.map(constraint => constraint.id === constraintId ? { ...constraint, refs } : constraint),
    });
  };

  const changeKind = (constraint: VisualConstraint, kind: VisualConstraint['kind']) => {
    const refs = defaultConstraintRefs(model, kind, constraint.refs[0]);
    const next = withConstraintDependencies(model, constraint.id, kind === 'equalAngle' ? refs.slice(0, 4) : refs);
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
    const next = withConstraintDependencies(model, id, newKind === 'equalAngle' ? refs.slice(0, 4) : refs);
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

  const constraintOptions = (
    <>
      <optgroup label="Posición y guía">
        {CONSTRAINT_OPTIONS.filter(option => ['fixed', 'horizontal', 'vertical', 'on'].includes(option.value)).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </optgroup>
      <optgroup label="Relaciones entre puntos">
        {CONSTRAINT_OPTIONS.filter(option => ['coincident', 'distance', 'midpoint'].includes(option.value)).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </optgroup>
      <optgroup label="Dirección y región">
        {CONSTRAINT_OPTIONS.filter(option => ['perpendicular', 'parallel', 'insideDisk', 'sameSide'].includes(option.value)).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </optgroup>
      <optgroup label="Congruencia">
        {CONSTRAINT_OPTIONS.filter(option => option.value === 'equalLength').map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </optgroup>
    </>
  );

  return (
    <section className="border-t border-carbon/10 pt-4" aria-label="Relaciones geométricas del punto">
      <div className="flex items-start justify-between gap-3">
        <div><h5 className="text-xs font-bold text-carbon">Relaciones geométricas</h5><p className="mt-1 text-[10px] leading-relaxed text-carbon/50">Todas las relaciones activas se cumplen a la vez. Se pueden pausar sin perder su configuración.</p></div>
        <span className="shrink-0 rounded-full bg-pavo/10 px-2 py-1 text-[9px] font-bold text-pavo">{assignedConstraints.length} activa{assignedConstraints.length === 1 ? '' : 's'}</span>
      </div>
      {assignedConstraints.length === 0 && <p className="mt-3 border-l-2 border-carbon/15 pl-3 text-[10px] leading-relaxed text-carbon/50">Este punto todavía no depende de ninguna relación.</p>}
      <div className="mt-3 divide-y divide-carbon/10 border-y border-carbon/10">
      {assignedConstraints.map(constraint => {
        const presentation = constraintPresentation(constraint.kind);
        return (
          <article key={constraint.id} className="space-y-3 py-3">
            <header className="flex items-start gap-2">
              <label className="flex min-h-9 flex-1 items-start gap-2 text-xs font-bold text-carbon">
                <input aria-label={`Relación activa de ${constraint.id}`} type="checkbox" checked={constraint.enabled} onChange={event => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, enabled: event.target.checked } : item) })} />
                <span>{presentation.label}<span className="mt-0.5 block text-[9px] font-normal text-carbon/45">{constraint.enabled ? 'Activa' : 'Pausada'}</span></span>
              </label>
              <button type="button" aria-label="Eliminar relación" className="min-h-9 px-1 text-[10px] font-bold text-granada hover:underline" onClick={() => deleteConstraint(constraint.id)}>Eliminar</button>
            </header>
              <p className="text-[10px] leading-relaxed text-carbon/55">{presentation.description}</p>
              <label className="block text-[10px] font-bold text-carbon/60">Tipo de relación<select aria-label={`Tipo de ${constraint.id}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={constraint.kind} onChange={event => changeKind(constraint, event.target.value as VisualConstraint['kind'])}>
                {constraintOptions}
                {constraint.kind === 'equalAngle' && <option value="equalAngle">Misma amplitud que otro ángulo</option>}
                {constraint.kind === 'expression' && <option value="expression">Relación por expresión</option>}
              </select></label>
              {constraint.refs.slice(1).map((ref, relativeIndex) => {
                const index = relativeIndex + 1;
                const candidates = referenceCandidates(model, constraint, index);
                return (
                  <label key={`${constraint.id}-ref-${index}`} className="block text-[10px] font-bold text-carbon/60">
                    {referenceLabel(constraint, index)}
                    <select aria-label={`Referencia ${index + 1} de ${constraint.id}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={ref} onChange={event => changeReference(constraint, index, event.target.value)}>
                      {candidates.map(item => <option key={item.id} value={item.id}>{item.label} ({item.id})</option>)}
                    </select>
                  </label>
                );
              })}
              {constraint.kind === 'distance' && (
                <label className="block text-[10px] font-bold text-carbon/60">Distancia
                  <input type="number" min="0" step="0.1" aria-label={`Distancia de ${constraint.id}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={constraint.value ?? 1} onChange={event => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, value: Number(event.target.value), expression: undefined } : item) })} />
                </label>
              )}
              {constraint.kind === 'expression' && (
                <DiagramExpressionField model={model} label="Expresión conservada" ariaLabel={`Expresión de ${constraint.id}`} value={constraint.expression ?? ''} onChange={value => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, expression: value } : item) })} help="La relación usa el mismo lenguaje matemático seguro que fórmulas, curvas y condiciones de visibilidad." />
              )}
          </article>
        );
      })}
      </div>
      <div className="pt-4">
        <label className="block text-xs font-bold text-carbon">Nueva relación
          <select aria-label="Nueva restricción" className="mt-1 min-h-11 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={newKind} onChange={event => setNewKind(event.target.value as VisualConstraint['kind'])}>
            {constraintOptions}
          </select>
        </label>
        <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">{constraintPresentation(newKind).description}</p>
        <button type="button" disabled={defaultRefs.length < constraintPresentation(newKind).refs} className="mt-3 min-h-11 w-full rounded bg-pavo px-3 text-xs font-bold text-lienzo disabled:cursor-not-allowed disabled:opacity-35" onClick={addConstraint}>Añadir relación</button>
      </div>
    </section>
  );
};

export default DiagramConstraintEditor;
