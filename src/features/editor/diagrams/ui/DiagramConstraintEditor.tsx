import React, { useState } from 'react';
import type { AreaMembership } from '../../../../shared/diagrams/spec/types';
import type { VisualConstraint, VisualDiagramModel, VisualPoint } from '../model/types';
import { updatePoint } from '../model';
import { CONSTRAINT_OPTIONS, constraintPresentation, defaultConstraintRefs, withConstraintDependencies } from '../model/constraintOptions';
import { removeConstraintFromModel } from '../model/segmentLengthConstraints';
import {
  anchorCandidatesForEqualLength,
  angleCandidates,
  otherSegmentCandidatesForEqualLength,
  areaCandidates,
  pointLikeCandidates,
  reflectionAxisCandidates,
  segmentCandidates,
  supportCandidates,
} from '../model/v3Projection';
import { withResolvedPointConstraints } from '../../../../shared/diagrams/spec/scene';
import { DiagramExpressionField } from './DiagramExpressionField';
import { DiagramButton, DiagramField, DiagramPanel } from './primitives';

function equalLengthReferenceCandidates(model: VisualDiagramModel, constraint: VisualConstraint, index: number) {
  if (index === 1) return anchorCandidatesForEqualLength(model, constraint.refs[0]);
  if (index !== 2) return [...model.points, ...model.elements];
  return otherSegmentCandidatesForEqualLength(model, constraint.refs[1], constraint.refs[0]);
}

function getAddConstraintDisabledReason(model: VisualDiagramModel, kind: VisualConstraint['kind'], targetId: string): string | undefined {
  const presentation = constraintPresentation(kind);
  const refs = defaultConstraintRefs(model, kind, targetId);
  if (refs.length >= presentation.refs) return undefined;

  switch (kind) {
    case 'equalLength': {
      const targetSegment = segmentCandidates(model).find(item => item.refs.includes(targetId));
      if (!targetSegment) return 'Este punto no forma parte de ningún segmento. Debe ser extremo de un segmento para igualar su longitud.';
      const otherSegments = segmentCandidates(model).filter(item => item.id !== targetSegment.id);
      if (otherSegments.length === 0) return 'No existe otro segmento en el diagrama para tomar como referencia de longitud.';
      return 'Se requiere un segmento de referencia y un punto ancla para igualar la longitud.';
    }
    case 'equalAngle': {
      const targetAngle = model.elements.find(item => (item.kind === 'angle' || item.kind === 'nonReflexAngle') && (item.refs[0] === targetId || item.refs[2] === targetId));
      if (!targetAngle) return 'Este punto no es extremo del lado de ningún ángulo.';
      return 'No hay otro ángulo del mismo tipo en la escena para copiar su amplitud.';
    }
    case 'on':
      return 'No hay segmentos, rectas, semirrectas ni curvas en el diagrama sobre las que colocar este punto.';
    case 'midpoint':
      return 'Se necesitan al menos otros dos puntos para definir un punto medio.';
    case 'perpendicular':
    case 'parallel':
      return 'Se necesitan otros dos puntos o una recta para definir la dirección de la referencia.';
    case 'insideDisk':
    case 'sameSide':
    case 'insideArea':
      return 'Se necesitan más puntos en la escena para definir la región de esta restricción.';
    case 'horizontal':
    case 'vertical':
    case 'coincident':
    case 'distance':
      return 'Se necesita al menos otro punto en la escena para relacionarlo con este punto.';
    default:
      return 'Se necesitan más objetos en el diagrama para establecer esta relación.';
  }
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
    const kinds = targetAngle?.kind === 'angle' || targetAngle?.kind === 'nonReflexAngle'
      ? [targetAngle.kind]
      : undefined;
    return angleCandidates(model, kinds).filter(element => (
      element.id !== targetAngle?.id && !element.refs.includes(constraint.refs[0])
    ));
  }
  return index === 4 ? targetAngles : [...model.points, ...model.elements];
}

function referenceCandidates(model: VisualDiagramModel, constraint: VisualConstraint, index: number) {
  if (index === 0) return model.points;
  if (constraint.kind === 'on' && index === 1) return supportCandidates(model);
  if (constraint.kind === 'insideArea' && index === 1) return areaCandidates(model);
  if (constraint.kind === 'equalLength') return equalLengthReferenceCandidates(model, constraint, index);
  if (constraint.kind === 'equalAngle') return equalAngleReferenceCandidates(model, constraint, index);
  if (constraint.kind === 'midpoint') {
    return model.points.filter(candidate => !constraint.refs.slice(0, index).includes(candidate.id));
  }
  if (constraint.kind === 'reflection') {
    if (index === 1) {
      return reflectionAxisCandidates(model).filter(candidate => candidate.id !== constraint.refs[0]);
    }
    if (index === 2) {
      return pointLikeCandidates(model).filter(candidate => (
        candidate.id !== constraint.refs[0] && candidate.id !== constraint.refs[1]
      ));
    }
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
  if (constraint.kind === 'reflection') {
    return ['Punto ajustado (resultado)', 'Centro o eje de simetría (respecto a qué)', 'Objeto de origen (de qué objeto es reflejo)'][index] ?? `Referencia ${index}`;
  }
  if (constraint.kind === 'insideArea' && index === 1) return 'Área';
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
    const updatedModel = {
      ...next,
      constraints: model.constraints?.map(constraint => constraint.id === constraintId ? { ...constraint, refs } : constraint),
    };
    onModelEdit(withResolvedPointConstraints(updatedModel));
  };

  const changeKind = (constraint: VisualConstraint, kind: VisualConstraint['kind']) => {
    const refs = defaultConstraintRefs(model, kind, constraint.refs[0]);
    const next = withConstraintDependencies(model, constraint.id, kind === 'equalAngle' ? refs.slice(0, 4) : refs);
    let expression: string | undefined;
    if (kind === 'expression') expression = constraint.expression ?? '1';
    else if (kind === 'distance') expression = constraint.expression;
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
    const updatedWithPoint = updatePoint(nextWithConstraint, point.id, {
      constraint: 'constrained',
      constraintIds: [...(point.constraintIds || []), id],
    });
    onModelEdit(withResolvedPointConstraints(updatedWithPoint));
  };

  const deleteConstraint = (constraintId: string) => {
    onModelEdit(removeConstraintFromModel(model, constraintId));
  };

  const assignedConstraints = (point.constraintIds || [])
    .map(id => model.constraints?.find(item => item.id === id))
    .filter((constraint): constraint is VisualConstraint => Boolean(constraint));

  const constraintOptions = (
    <>
      <optgroup label="Posición y guía">
        {CONSTRAINT_OPTIONS.filter(option => ['fixed', 'horizontal', 'vertical', 'on'].includes(option.value)).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </optgroup>
      <optgroup label="Relaciones entre puntos">
        {CONSTRAINT_OPTIONS.filter(option => ['coincident', 'distance', 'midpoint'].includes(option.value)).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </optgroup>
      <optgroup label="Dirección y región">
        {CONSTRAINT_OPTIONS.filter(option => ['perpendicular', 'parallel', 'insideDisk', 'sameSide', 'insideArea'].includes(option.value)).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </optgroup>
      <optgroup label="Congruencia y Simetría">
        {CONSTRAINT_OPTIONS.filter(option => ['equalLength', 'reflection'].includes(option.value)).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </optgroup>
      <optgroup label="Medición y expresión">
        <option value="equalAngle">{constraintPresentation('equalAngle').label}</option>
        <option value="expression">{constraintPresentation('expression').label}</option>
      </optgroup>
    </>
  );

  const addDisabledReason = getAddConstraintDisabledReason(model, newKind, point.id);

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
          <DiagramPanel
            key={constraint.id}
            title={presentation.label}
            badge={constraint.enabled ? 'Activa' : 'Pausada'}
            className="my-3"
          >
            <header className="flex items-start gap-2">
              <label className="flex min-h-11 flex-1 items-start gap-2 text-xs font-bold text-carbon">
                <input aria-label={`Relación activa de ${constraint.id}`} type="checkbox" checked={constraint.enabled} onChange={event => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, enabled: event.target.checked } : item) })} />
                <span className="sr-only">{presentation.label}</span>
              </label>
              <DiagramButton type="button" variant="ghost" aria-label="Eliminar relación" onClick={() => deleteConstraint(constraint.id)}>Eliminar</DiagramButton>
            </header>
              <p className="text-[10px] leading-relaxed text-carbon/55">{presentation.description}</p>
              <DiagramField label="Tipo de relación">
                <select aria-label={`Tipo de ${constraint.id}`} value={constraint.kind} onChange={event => changeKind(constraint, event.target.value as VisualConstraint['kind'])}>
                {constraintOptions}
                {constraint.kind === 'equalAngle' && <option value="equalAngle">Misma amplitud que otro ángulo</option>}
                {constraint.kind === 'expression' && <option value="expression">Relación por expresión</option>}
              </select></DiagramField>
              {constraint.kind === 'reflection' ? (
                <>
                  <DiagramField label="Centro o eje de simetría (respecto a qué)">
                    <select
                      aria-label={`Centro o eje de simetría de ${constraint.id}`}
                      value={constraint.refs[1] || ''}
                      onChange={event => changeReference(constraint, 1, event.target.value)}
                    >
                      {referenceCandidates(model, constraint, 1).map(item => (
                        <option key={item.id} value={item.id}>{item.label} ({item.id})</option>
                      ))}
                    </select>
                  </DiagramField>
                  <DiagramField label="Objeto de origen (de qué objeto es reflejo)">
                    <select
                      aria-label={`Objeto de origen de ${constraint.id}`}
                      value={constraint.refs[2] || ''}
                      onChange={event => {
                        const val = event.target.value;
                        if (!val) changeRefs(constraint.id, [constraint.refs[0], constraint.refs[1]]);
                        else changeRefs(constraint.id, [constraint.refs[0], constraint.refs[1], val]);
                      }}
                    >
                      <option value="">Posición base de {point.label} ({point.id})</option>
                      {referenceCandidates(model, constraint, 2).map(item => (
                        <option key={item.id} value={item.id}>{item.label} ({item.id})</option>
                      ))}
                    </select>
                  </DiagramField>
                </>
              ) : (
                <>
                  {constraint.refs.slice(1).map((ref, relativeIndex) => {
                    const index = relativeIndex + 1;
                    const candidates = referenceCandidates(model, constraint, index);
                    return (
                      <DiagramField key={`${constraint.id}-ref-${index}`} label={referenceLabel(constraint, index)}>
                        <select aria-label={`Referencia ${index + 1} de ${constraint.id}`} value={ref} onChange={event => changeReference(constraint, index, event.target.value)}>
                          {candidates.map(item => <option key={item.id} value={item.id}>{item.label} ({item.id})</option>)}
                        </select>
                      </DiagramField>
                    );
                  })}
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
                </>
              )}
              {constraint.kind === 'distance' && (
                <DiagramField label="Distancia">
                  <input type="number" min="0" step="0.1" aria-label={`Distancia de ${constraint.id}`} value={constraint.value ?? 1} onChange={event => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, value: Number(event.target.value), expression: undefined } : item) })} />
                </DiagramField>
              )}
              {constraint.kind === 'expression' && (
                <DiagramExpressionField model={model} label="Expresión conservada" ariaLabel={`Expresión de ${constraint.id}`} value={constraint.expression ?? ''} onChange={value => onModelEdit({ ...model, constraints: model.constraints?.map(item => item.id === constraint.id ? { ...item, expression: value } : item) })} help="La relación usa el mismo lenguaje matemático seguro que fórmulas, curvas y condiciones de visibilidad." />
              )}
          </DiagramPanel>
        );
      })}
      </div>
      <DiagramPanel title="Nueva relación" className="mt-4 border-t-0">
        <DiagramField label="Tipo de relación">
          <select aria-label="Nueva restricción" value={newKind} onChange={event => setNewKind(event.target.value as VisualConstraint['kind'])}>
            {constraintOptions}
          </select>
        </DiagramField>
        <p className="text-[10px] leading-relaxed text-carbon/50">{constraintPresentation(newKind).description}</p>
        {addDisabledReason && (
          <p className="rounded bg-ocre/10 p-2 text-[10px] font-medium leading-relaxed text-ocre">
            {addDisabledReason}
          </p>
        )}
        <DiagramButton type="button" variant="primary" fullWidth disabled={Boolean(addDisabledReason)} onClick={addConstraint}>Añadir relación</DiagramButton>
      </DiagramPanel>
    </section>
  );
};

export default DiagramConstraintEditor;
