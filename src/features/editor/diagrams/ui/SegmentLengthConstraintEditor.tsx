import React, { useState } from 'react';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import {
  editableSegmentEndpoints,
  equalLengthConstraintForSegment,
  findPointLike,
  removeConstraintFromModel,
  setEqualLengthConstraint,
} from '../model/segmentLengthConstraints';
import { DiagramButton, DiagramField, DiagramPanel } from './primitives';

interface SegmentLengthConstraintEditorProps {
  model: VisualDiagramModel;
  segment: VisualElement;
  onModelEdit: (model: VisualDiagramModel) => void;
}

export const SegmentLengthConstraintEditor: React.FC<SegmentLengthConstraintEditorProps> = ({
  model,
  segment,
  onModelEdit,
}) => {
  const existing = equalLengthConstraintForSegment(model, segment.id);
  const endpoints = editableSegmentEndpoints(model, segment.id);
  const allReferenceSegments = model.elements.filter(element => element.kind === 'segment' && element.id !== segment.id);
  const [expanded, setExpanded] = useState(Boolean(existing));
  const [movingEndpointId, setMovingEndpointId] = useState(existing?.refs[0] ?? endpoints[0]?.id ?? '');
  const [sourceSegmentId, setSourceSegmentId] = useState(existing?.refs[2] ?? allReferenceSegments[0]?.id ?? '');
  const referenceSegments = allReferenceSegments.filter(candidate => !candidate.refs.includes(movingEndpointId));
  const effectiveSourceSegmentId = referenceSegments.some(candidate => candidate.id === sourceSegmentId)
    ? sourceSegmentId
    : referenceSegments[0]?.id ?? '';
  const movingEndpoint = model.points.find(point => point.id === movingEndpointId);
  const anchor = segment.refs
    .map(ref => findPointLike(model, ref))
    .find(point => point && point.id !== movingEndpointId);
  const sourceSegment = referenceSegments.find(candidate => candidate.id === effectiveSourceSegmentId);
  const ready = Boolean(movingEndpoint && anchor && sourceSegment);

  let disabledReason = '';
  if (endpoints.length === 0) {
    disabledReason = 'Este segmento no tiene extremos móviles (sus puntos son fijos o derivados).';
  } else if (allReferenceSegments.length === 0) {
    disabledReason = 'No hay otros segmentos en el diagrama para copiar su longitud.';
  } else if (referenceSegments.length === 0) {
    disabledReason = 'El extremo seleccionado pertenece a todos los demás segmentos disponibles.';
  } else if (!ready) {
    disabledReason = 'Seleccione un extremo móvil válido y un segmento de referencia.';
  }

  return (
    <DiagramPanel
      title="Igualar longitudes"
      badge={existing ? 'Configurada' : 'Opcional'}
      collapsible
      open={expanded}
      onOpenChange={setExpanded}
    >
        <p className="text-[10px] leading-relaxed text-carbon/60">
          Este segmento conservará la longitud de otro. Un extremo queda como ancla y el otro se ajusta automáticamente.
        </p>
        <ol className="space-y-1 text-[10px] leading-relaxed text-carbon/55">
          <li><strong>1.</strong> Elija el extremo que puede moverse.</li>
          <li><strong>2.</strong> Elija el segmento cuya longitud se copiará.</li>
        </ol>

        {endpoints.length > 0 && referenceSegments.length > 0 ? (
          <>
            <DiagramField label="Extremo que se ajusta">
              <select
                aria-label="Extremo que se ajusta para igualar longitudes"
                value={movingEndpointId}
                onChange={event => setMovingEndpointId(event.target.value)}
              >
                {endpoints.map(point => <option key={point.id} value={point.id}>{point.label} ({point.id})</option>)}
              </select>
            </DiagramField>
            <DiagramField label="Segmento de referencia">
              <select
                aria-label="Segmento de referencia para igualar longitudes"
                value={effectiveSourceSegmentId}
                onChange={event => setSourceSegmentId(event.target.value)}
              >
                {referenceSegments.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.label} ({candidate.id})</option>)}
              </select>
            </DiagramField>
            {ready ? (
              <p className="rounded bg-lienzo px-2 py-1.5 text-[10px] leading-relaxed text-carbon/60" aria-live="polite">
                Se ajustará <strong>{movingEndpoint?.label}</strong>; <strong>{anchor?.label}</strong> quedará como ancla. La longitud será la de <strong>{sourceSegment?.label}</strong>.
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
              onClick={() => onModelEdit(setEqualLengthConstraint(model, segment.id, movingEndpointId, effectiveSourceSegmentId))}
            >
              {existing ? 'Actualizar igualdad de longitudes' : 'Mantener la misma longitud'}
            </DiagramButton>
            {existing && (
              <DiagramButton
                variant="danger"
                fullWidth
                onClick={() => onModelEdit(removeConstraintFromModel(model, existing.id))}
              >
                Quitar igualdad de longitudes
              </DiagramButton>
            )}
          </>
        ) : (
          <p className="rounded bg-ocre/10 p-2 text-[10px] leading-relaxed text-ocre font-medium">
            {disabledReason || 'Se necesitan otro segmento y al menos un extremo móvil. Los puntos fijos o derivados no pueden ser el extremo ajustado.'}
          </p>
        )}
    </DiagramPanel>
  );
};

export default SegmentLengthConstraintEditor;
