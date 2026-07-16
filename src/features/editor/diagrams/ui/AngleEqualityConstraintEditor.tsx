import React, { useState } from 'react';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import {
  editableAngleEndpoints,
  equalAngleConstraintForAngle,
  referenceAngles,
  removeConstraintFromModel,
  setEqualAngleConstraint,
} from '../model/commands';

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
  const existing = equalAngleConstraintForAngle(model, angle.id);
  const endpoints = editableAngleEndpoints(model, angle.id);
  const [movingEndpointId, setMovingEndpointId] = useState(existing?.refs[0] ?? endpoints[0]?.id ?? '');
  const candidates = referenceAngles(model, angle.id, movingEndpointId);
  const [sourceAngleId, setSourceAngleId] = useState(existing?.refs[3] ?? candidates[0]?.id ?? '');
  const [expanded, setExpanded] = useState(Boolean(existing) || candidates.length > 0);
  const effectiveSourceAngleId = candidates.some(candidate => candidate.id === sourceAngleId)
    ? sourceAngleId
    : candidates[0]?.id ?? '';
  const movingEndpoint = model.points.find(point => point.id === movingEndpointId);
  const vertex = model.points.find(point => point.id === angle.refs[1]);
  const fixedEndpoint = model.points.find(point => (
    point.id === (angle.refs[0] === movingEndpointId ? angle.refs[2] : angle.refs[0])
  ));
  const sourceAngle = candidates.find(candidate => candidate.id === effectiveSourceAngleId);
  const ready = Boolean(movingEndpoint && vertex && fixedEndpoint && sourceAngle);

  return (
    <details
      className="rounded border border-pavo/25 bg-pavo/5"
      open={expanded}
      onToggle={event => setExpanded(event.currentTarget.open)}
    >
      <summary className="cursor-pointer list-none px-2 py-2 text-xs font-bold text-pavo [&::-webkit-details-marker]:hidden">
        Igualar ángulos
        <span className="float-right text-[9px] font-normal text-carbon/45">{existing ? 'Configurada' : 'Opcional'} ▾</span>
      </summary>
      <div className="space-y-2 border-t border-pavo/15 p-2">
        <p className="text-[10px] leading-relaxed text-carbon/60">
          Uno de los lados girará alrededor del vértice para conservar la misma amplitud que otro ángulo. Su distancia al vértice no cambia.
        </p>
        <ol className="space-y-1 text-[10px] leading-relaxed text-carbon/55">
          <li><strong>1.</strong> Elija el extremo del lado que puede ajustarse.</li>
          <li><strong>2.</strong> Elija el ángulo cuya amplitud se copiará.</li>
        </ol>

        {endpoints.length > 0 && candidates.length > 0 ? (
          <>
            <label className="block text-[10px] font-bold text-carbon/65">
              Extremo que se ajusta
              <select
                aria-label="Extremo que se ajusta para igualar ángulos"
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={movingEndpointId}
                onChange={event => {
                  setMovingEndpointId(event.target.value);
                  setSourceAngleId('');
                }}
              >
                {endpoints.map(point => <option key={point.id} value={point.id}>{point.label} ({point.id})</option>)}
              </select>
            </label>
            <label className="block text-[10px] font-bold text-carbon/65">
              Ángulo de referencia
              <select
                aria-label="Ángulo de referencia para igualar ángulos"
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={effectiveSourceAngleId}
                onChange={event => setSourceAngleId(event.target.value)}
              >
                {candidates.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.label} ({candidate.id})</option>)}
              </select>
            </label>
            {ready && (
              <p className="rounded bg-lienzo px-2 py-1.5 text-[10px] leading-relaxed text-carbon/60" aria-live="polite">
                Se ajustará <strong>{movingEndpoint?.label}</strong> alrededor de <strong>{vertex?.label}</strong>; el lado hacia <strong>{fixedEndpoint?.label}</strong> quedará como referencia. La amplitud será la de <strong>{sourceAngle?.label}</strong>.
              </p>
            )}
            <button
              type="button"
              disabled={!ready}
              className="w-full rounded bg-pavo px-2 py-1.5 text-xs font-bold text-lienzo disabled:cursor-not-allowed disabled:opacity-35"
              onClick={() => onModelEdit(setEqualAngleConstraint(model, angle.id, movingEndpointId, effectiveSourceAngleId))}
            >
              {existing ? 'Actualizar igualdad de ángulos' : 'Mantener el mismo ángulo'}
            </button>
            {existing && (
              <button
                type="button"
                className="w-full rounded border border-granada/20 bg-lienzo px-2 py-1.5 text-xs font-bold text-granada"
                onClick={() => onModelEdit(removeConstraintFromModel(model, existing.id))}
              >
                Quitar igualdad de ángulos
              </button>
            )}
          </>
        ) : (
          <p className="rounded bg-lienzo p-2 text-[10px] leading-relaxed text-carbon/55">
            Se necesita otro ángulo del mismo tipo y al menos un extremo móvil. Los puntos fijos, derivados o ligados a otro objeto no pueden ser el lado ajustado.
          </p>
        )}
      </div>
    </details>
  );
};

export default AngleEqualityConstraintEditor;
