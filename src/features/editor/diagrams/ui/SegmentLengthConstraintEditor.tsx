import React, { useState } from 'react';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import {
  editableSegmentEndpoints,
  equalLengthConstraintForSegment,
  removeConstraintFromModel,
  setEqualLengthConstraint,
} from '../model/segmentLengthConstraints';

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
  const [movingEndpointId, setMovingEndpointId] = useState(existing?.refs[0] ?? endpoints[0]?.id ?? '');
  const [sourceSegmentId, setSourceSegmentId] = useState(existing?.refs[2] ?? allReferenceSegments[0]?.id ?? '');
  const referenceSegments = allReferenceSegments.filter(candidate => !candidate.refs.includes(movingEndpointId));
  const effectiveSourceSegmentId = referenceSegments.some(candidate => candidate.id === sourceSegmentId)
    ? sourceSegmentId
    : referenceSegments[0]?.id ?? '';
  const movingEndpoint = model.points.find(point => point.id === movingEndpointId);
  const anchor = segment.refs
    .map(ref => model.points.find(point => point.id === ref))
    .find(point => point && point.id !== movingEndpointId);
  const sourceSegment = referenceSegments.find(candidate => candidate.id === effectiveSourceSegmentId);
  const ready = Boolean(movingEndpoint && anchor && sourceSegment);

  return (
    <fieldset className="space-y-2 rounded border border-pavo/25 bg-pavo/5 p-2">
      <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-pavo">Igualar longitudes</legend>
      <p className="text-[10px] leading-relaxed text-carbon/60">
        Este segmento conservará la longitud de otro. Un extremo queda como ancla y el otro se ajusta automáticamente.
      </p>
      <ol className="space-y-1 text-[10px] leading-relaxed text-carbon/55">
        <li><strong>1.</strong> Elija el extremo que puede moverse.</li>
        <li><strong>2.</strong> Elija el segmento cuya longitud se copiará.</li>
      </ol>

      {endpoints.length > 0 && referenceSegments.length > 0 ? (
        <>
          <label className="block text-[10px] font-bold text-carbon/65">
            Extremo que se ajusta
            <select
              aria-label="Extremo que se ajusta para igualar longitudes"
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={movingEndpointId}
              onChange={event => setMovingEndpointId(event.target.value)}
            >
              {endpoints.map(point => <option key={point.id} value={point.id}>{point.label} ({point.id})</option>)}
            </select>
          </label>
          <label className="block text-[10px] font-bold text-carbon/65">
            Segmento de referencia
            <select
              aria-label="Segmento de referencia para igualar longitudes"
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={effectiveSourceSegmentId}
              onChange={event => setSourceSegmentId(event.target.value)}
            >
              {referenceSegments.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.label} ({candidate.id})</option>)}
            </select>
          </label>
          {ready && (
            <p className="rounded bg-lienzo px-2 py-1.5 text-[10px] leading-relaxed text-carbon/60" aria-live="polite">
              Se ajustará <strong>{movingEndpoint?.label}</strong>; <strong>{anchor?.label}</strong> quedará como ancla. La longitud será la de <strong>{sourceSegment?.label}</strong>.
            </p>
          )}
          <button
            type="button"
            disabled={!ready}
            className="w-full rounded bg-pavo px-2 py-1.5 text-xs font-bold text-lienzo disabled:cursor-not-allowed disabled:opacity-35"
            onClick={() => onModelEdit(setEqualLengthConstraint(model, segment.id, movingEndpointId, effectiveSourceSegmentId))}
          >
            {existing ? 'Actualizar igualdad de longitudes' : 'Mantener la misma longitud'}
          </button>
          {existing && (
            <button
              type="button"
              className="w-full rounded border border-granada/20 bg-lienzo px-2 py-1.5 text-xs font-bold text-granada"
              onClick={() => onModelEdit(removeConstraintFromModel(model, existing.id))}
            >
              Quitar igualdad de longitudes
            </button>
          )}
        </>
      ) : (
        <p className="rounded bg-lienzo p-2 text-[10px] leading-relaxed text-carbon/55">
          Se necesitan otro segmento y al menos un extremo móvil. Los puntos fijos o derivados no pueden ser el extremo ajustado.
        </p>
      )}
    </fieldset>
  );
};

export default SegmentLengthConstraintEditor;
