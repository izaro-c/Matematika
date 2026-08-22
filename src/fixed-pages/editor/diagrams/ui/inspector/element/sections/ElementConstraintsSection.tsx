import React, { useState } from 'react';
import {
  equalLengthConstraintForSegment,
  setEqualLengthConstraint,
  removeConstraintFromModel,
  editableSegmentEndpoints,
} from '@/fixed-pages/editor/diagrams/model/constraints/segmentLengthConstraints';
import {
  equalAngleConstraintForAngle,
  setEqualAngleConstraint,
} from '@/fixed-pages/editor/diagrams/model/constraints/angleConstraints';
import {
  editableReflectionCandidates,
  reflectionConstraintForSegment,
  removeSegmentReflectionConstraint,
  setReflectionConstraintForSegment,
} from '@/fixed-pages/editor/diagrams/model/constraints/reflectionConstraints';
import type { VisualDiagramModel, VisualElement } from '@/fixed-pages/editor/diagrams/model/types';
import type { ElementPanelProps } from '../../types';
import { constraintScopeForKind } from '../../elementSections';

const fieldClass =
  'w-full rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1.5 text-xs font-mono font-bold text-carbon focus:border-canela focus:outline-none';
const cardClass = 'space-y-2 rounded-lg border border-carbon/10 bg-lienzo/60 p-3 shadow-2xs';
const applyBtn =
  'w-full py-1.5 bg-canela text-lienzo rounded-lg font-bold text-[10px] hover:bg-canela/90 transition-all cursor-pointer disabled:opacity-40';
const removeBtn =
  'w-full py-1.5 bg-granada/10 hover:bg-granada/20 text-granada rounded-lg font-bold text-[10px] transition-all cursor-pointer';

const SegmentReflectionCard: React.FC<{
  model: VisualDiagramModel;
  element: VisualElement;
  onUpdateModel: (next: VisualDiagramModel, label: string) => void;
}> = ({ model, element, onUpdateModel }) => {
  const reflection = reflectionConstraintForSegment(model, element.id);
  const reflectionCandidates = editableReflectionCandidates(model, element.id);
  const otherSegments = model.elements.filter(e => e.kind === 'segment' && e.id !== element.id);
  const existingCenter = reflection?.refs.length === 3 ? reflection.refs[2] : reflection?.refs[1];
  const existingSource = reflection?.refs.length === 3 ? reflection.refs[1] : '';
  const [centerId, setCenterId] = useState(existingCenter || reflectionCandidates[0]?.id || '');
  const [sourceId, setSourceId] = useState(existingSource);

  return (
    <div className={cardClass}>
      <span className="font-bold text-canela block uppercase tracking-wider text-[10px]">Reflejo Simétrico</span>
      <p className="text-[11px] text-carbon/60 leading-relaxed">
        El segmento queda como reflejo respecto a un centro o eje.
      </p>
      {reflectionCandidates.length === 0 ? (
        <p className="text-[11px] text-ocre bg-ocre/10 rounded-lg p-2 border border-ocre/20">No hay centros ni ejes disponibles.</p>
      ) : (
        <>
          <div>
            <label className="block text-[11px] text-carbon/75 font-bold mb-1">Centro o eje</label>
            <select
              value={centerId || reflectionCandidates[0]?.id || ''}
              onChange={e => setCenterId(e.target.value)}
              className={fieldClass}
            >
              {reflectionCandidates.map(c => (
                <option key={c.id} value={c.id}>{c.label || c.id} ({c.id})</option>
              ))}
            </select>
          </div>
          {otherSegments.length > 0 && (
            <div>
              <label className="block text-[11px] text-carbon/75 font-bold mb-1">Segmento origen (opcional)</label>
              <select value={sourceId} onChange={e => setSourceId(e.target.value)} className={fieldClass}>
                <option value="">Posición actual</option>
                {otherSegments.map(s => (
                  <option key={s.id} value={s.id}>{s.label || s.id} ({s.id})</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            disabled={!centerId && !reflectionCandidates[0]}
            onClick={() => {
              const axis = centerId || reflectionCandidates[0]?.id;
              if (!axis) return;
              onUpdateModel(
                setReflectionConstraintForSegment(model, element.id, axis, sourceId || undefined),
                `Reflejo simétrico de ${element.id}`,
              );
            }}
            className={applyBtn}
          >
            {reflection ? 'Actualizar Reflejo' : 'Aplicar Reflejo Simétrico'}
          </button>
          {reflection && (
            <button
              type="button"
              onClick={() => onUpdateModel(removeSegmentReflectionConstraint(model, element.id), `Eliminar reflejo de ${element.id}`)}
              className={removeBtn}
            >
              Quitar Reflejo Simétrico
            </button>
          )}
        </>
      )}
    </div>
  );
};

/** UI V2 unificado de restricciones de elemento (segment / angle). */
export const ElementConstraintsSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateModel,
}) => {
  const scope = constraintScopeForKind(element.kind);
  if (!scope || !onUpdateModel) return null;

  if (scope === 'segment') {
    const lengthConstraint = equalLengthConstraintForSegment(model, element.id);
    const otherSegments = model.elements.filter(e => e.kind === 'segment' && e.id !== element.id);
    const editablePts = editableSegmentEndpoints(model, element.id);
    const movingPtId = lengthConstraint ? lengthConstraint.refs[0] : (editablePts[0]?.id || element.refs[0] || '');
    const sourceSegId = lengthConstraint ? lengthConstraint.refs[2] : (otherSegments[0]?.id || '');

    return (
      <div className="space-y-3">
        <div className={cardClass}>
          <span className="font-bold text-canela block uppercase tracking-wider text-[10px]">Igualar Longitud de Segmento</span>
          <p className="text-[11px] text-carbon/60 leading-relaxed">
            Un extremo se ajusta para copiar la longitud de otro segmento.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-carbon/75 font-bold mb-1">Extremo Móvil</label>
              <select
                value={movingPtId}
                onChange={e => {
                  if (sourceSegId && e.target.value) {
                    onUpdateModel(
                      setEqualLengthConstraint(model, element.id, e.target.value, sourceSegId),
                      `Cambiar extremo móvil a ${e.target.value}`,
                    );
                  }
                }}
                className={fieldClass}
              >
                {(editablePts.length ? editablePts.map(p => p.id) : element.refs).map(r => (
                  <option key={r} value={r}>Punto {r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-carbon/75 font-bold mb-1">Segmento a igualar</label>
              <select
                value={sourceSegId}
                onChange={e => {
                  if (e.target.value) {
                    onUpdateModel(
                      setEqualLengthConstraint(model, element.id, movingPtId, e.target.value),
                      `Igualar longitud de ${element.id} con ${e.target.value}`,
                    );
                  }
                }}
                className={fieldClass}
              >
                <option value="">-- Ninguno --</option>
                {otherSegments.map(s => (
                  <option key={s.id} value={s.id}>{s.label || s.id} ({s.id})</option>
                ))}
              </select>
            </div>
          </div>
          {lengthConstraint ? (
            <button
              type="button"
              onClick={() => onUpdateModel(removeConstraintFromModel(model, lengthConstraint.id), `Eliminar igualdad de longitud en ${element.id}`)}
              className={removeBtn}
            >
              Quitar Igualdad de Longitud
            </button>
          ) : (
            <button
              type="button"
              disabled={!sourceSegId || !movingPtId}
              onClick={() => {
                if (sourceSegId) {
                  onUpdateModel(
                    setEqualLengthConstraint(model, element.id, movingPtId, sourceSegId),
                    `Igualar longitud de ${element.id} con ${sourceSegId}`,
                  );
                }
              }}
              className={applyBtn}
            >
              Aplicar Igualdad de Longitud
            </button>
          )}
        </div>

        <SegmentReflectionCard model={model} element={element} onUpdateModel={onUpdateModel} />
      </div>
    );
  }

  const constraint = equalAngleConstraintForAngle(model, element.id);
  const otherAngles = model.elements.filter(e =>
    (e.kind === 'angle' || e.kind === 'nonReflexAngle') && e.id !== element.id,
  );
  const movingPtId = constraint ? constraint.refs[0] : (element.refs[0] || '');
  const sourceAngleId = constraint ? constraint.refs[3] : (otherAngles[0]?.id || '');

  return (
    <div className="space-y-3">
      <div className={cardClass}>
        <span className="font-bold text-canela block uppercase tracking-wider text-[10px]">Igualar Amplitud de Ángulo</span>
        <p className="text-[11px] text-carbon/60 leading-relaxed">
          La amplitud de este ángulo se igualará a la del ángulo de referencia.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] text-carbon/75 font-bold mb-1">Extremo / Vértice Móvil</label>
            <select
              value={movingPtId}
              onChange={e => {
                if (constraint && sourceAngleId) {
                  onUpdateModel(
                    setEqualAngleConstraint(model, element.id, e.target.value, sourceAngleId),
                    `Cambiar punto móvil de ángulo a ${e.target.value}`,
                  );
                }
              }}
              className={fieldClass}
            >
              {element.refs.map(r => (
                <option key={r} value={r}>Punto {r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] text-carbon/75 font-bold mb-1">Ángulo a igualar</label>
            <select
              value={sourceAngleId}
              onChange={e => {
                if (e.target.value) {
                  onUpdateModel(
                    setEqualAngleConstraint(model, element.id, movingPtId, e.target.value),
                    `Igualar amplitud de ${element.id} con ${e.target.value}`,
                  );
                }
              }}
              className={fieldClass}
            >
              <option value="">-- Ninguno --</option>
              {otherAngles.map(a => (
                <option key={a.id} value={a.id}>{a.label || a.id} ({a.id})</option>
              ))}
            </select>
          </div>
        </div>
        {constraint ? (
          <button
            type="button"
            onClick={() => onUpdateModel(removeConstraintFromModel(model, constraint.id), `Eliminar igualdad de amplitud en ${element.id}`)}
            className={removeBtn}
          >
            Quitar Igualdad de Ángulo
          </button>
        ) : (
          <button
            type="button"
            disabled={!sourceAngleId || !movingPtId}
            onClick={() => {
              if (sourceAngleId) {
                onUpdateModel(
                  setEqualAngleConstraint(model, element.id, movingPtId, sourceAngleId),
                  `Igualar amplitud de ${element.id} con ${sourceAngleId}`,
                );
              }
            }}
            className={applyBtn}
          >
            Aplicar Igualdad de Ángulo
          </button>
        )}
      </div>
    </div>
  );
};
