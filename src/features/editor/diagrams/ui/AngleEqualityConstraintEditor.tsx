import React, { useState } from 'react';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import {
  editableAngleEndpoints,
  equalAngleConstraintForAngle,
  referenceAngles,
  removeConstraintFromModel,
  setEqualAngleConstraint,
} from '../model';
import { findPointLike } from '../model/segmentLengthConstraints';
import { DiagramButton, DiagramField, DiagramPanel } from './primitives';

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
  const [expanded, setExpanded] = useState(Boolean(existing));
  const effectiveSourceAngleId = candidates.some(candidate => candidate.id === sourceAngleId)
    ? sourceAngleId
    : candidates[0]?.id ?? '';
  const movingEndpoint = model.points.find(point => point.id === movingEndpointId);
  const vertex = findPointLike(model, angle.refs[1]);
  const fixedEndpointId = angle.refs[0] === movingEndpointId ? angle.refs[2] : angle.refs[0];
  const fixedEndpoint = findPointLike(model, fixedEndpointId);
  const sourceAngle = candidates.find(candidate => candidate.id === effectiveSourceAngleId);
  const ready = Boolean(movingEndpoint && vertex && fixedEndpoint && sourceAngle);

  let disabledReason = '';
  if (endpoints.length === 0) {
    disabledReason = 'Este ángulo no tiene extremos móviles (sus puntos del lado son fijos o derivados).';
  } else if (candidates.length === 0) {
    disabledReason = 'No hay otros ángulos del mismo tipo en el diagrama para copiar su amplitud.';
  } else if (!ready) {
    disabledReason = 'Seleccione un extremo móvil del lado y un ángulo de referencia.';
  }

  return (
    <DiagramPanel
      title="Igualar ángulos"
      badge={existing ? 'Configurada' : 'Opcional'}
      collapsible
      open={expanded}
      onOpenChange={setExpanded}
    >
        <p className="text-[10px] leading-relaxed text-carbon/60">
          Uno de los lados girará alrededor del vértice para conservar la misma amplitud que otro ángulo. Su distancia al vértice no cambia.
        </p>
        <ol className="space-y-1 text-[10px] leading-relaxed text-carbon/55">
          <li><strong>1.</strong> Elija el extremo del lado que puede ajustarse.</li>
          <li><strong>2.</strong> Elija el ángulo cuya amplitud se copiará.</li>
        </ol>

        {endpoints.length > 0 && candidates.length > 0 ? (
          <>
            <DiagramField label="Extremo que se ajusta">
              <select
                aria-label="Extremo que se ajusta para igualar ángulos"
                value={movingEndpointId}
                onChange={event => {
                  setMovingEndpointId(event.target.value);
                  setSourceAngleId('');
                }}
              >
                {endpoints.map(point => <option key={point.id} value={point.id}>{point.label} ({point.id})</option>)}
              </select>
            </DiagramField>
            <DiagramField label="Ángulo de referencia">
              <select
                aria-label="Ángulo de referencia para igualar ángulos"
                value={effectiveSourceAngleId}
                onChange={event => setSourceAngleId(event.target.value)}
              >
                {candidates.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.label} ({candidate.id})</option>)}
              </select>
            </DiagramField>
            {ready ? (
              <p className="rounded bg-lienzo px-2 py-1.5 text-[10px] leading-relaxed text-carbon/60" aria-live="polite">
                Se ajustará <strong>{movingEndpoint?.label}</strong> alrededor de <strong>{vertex?.label}</strong>; el lado hacia <strong>{fixedEndpoint?.label}</strong> quedará como referencia. La amplitud será la de <strong>{sourceAngle?.label}</strong>.
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
              {existing ? 'Actualizar igualdad de ángulos' : 'Mantener el mismo ángulo'}
            </DiagramButton>
            {existing && (
              <DiagramButton
                variant="danger"
                fullWidth
                onClick={() => onModelEdit(removeConstraintFromModel(model, existing.id))}
              >
                Quitar igualdad de ángulos
              </DiagramButton>
            )}
          </>
        ) : (
          <p className="rounded bg-ocre/10 p-2 text-[10px] leading-relaxed text-ocre font-medium">
            {disabledReason || 'Se necesita otro ángulo del mismo tipo y al menos un extremo móvil. Los puntos fijos, derivados o ligados a otro objeto no pueden ser el lado ajustado.'}
          </p>
        )}
    </DiagramPanel>
  );
};

export default AngleEqualityConstraintEditor;
