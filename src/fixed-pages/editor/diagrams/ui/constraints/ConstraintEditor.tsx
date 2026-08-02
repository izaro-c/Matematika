import React, { useState } from 'react';
import type { AreaMembership } from '@/diagrams/model/schema/types';
import type { VisualDiagramModel, VisualConstraint } from '../../model/types';
import {
  RELATION_CATALOG,
  RELATION_CATEGORY_LABELS,
  RELATION_CATEGORY_ORDER,
  constraintPresentation,
  defaultConstraintRefs,
  getConstraintDisabledReason,
  getConstraintSlotLabel,
  relationsForScope,
  RelationScope,
  uniqueConstraintId,
  withConstraintDependencies,
  updatePoint,
  removeConstraintFromModel,
  candidatesForSlot,
  editableSlotsFor,
} from '../../model';
import { withResolvedPointConstraints } from '@/diagrams/geometry/layout/scene';
import { IconClose, IconPlus, IconTrash } from '../toolbar/WorkbenchIcons';

interface ConstraintEditorProps {
  model: VisualDiagramModel | null;
  selectedId?: string;
  onUpdateModel: (nextModel: VisualDiagramModel, label: string) => void;
}

export const ConstraintEditor: React.FC<ConstraintEditorProps> = ({
  model,
  selectedId,
  onUpdateModel,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKind, setNewKind] = useState<VisualConstraint['kind']>('fixed');
  const [newTargetId, setNewTargetId] = useState<string>('');

  if (!model) return null;

  const constraints = model.constraints || [];
  const points = model.points || [];
  const elements = model.elements || [];

  const activeConstraints = selectedId
    ? constraints.filter(c => c.refs.includes(selectedId) || points.find(p => p.id === selectedId)?.constraintIds?.includes(c.id))
    : constraints;

  const handleToggleConstraint = (id: string) => {
    const nextConstraints = constraints.map(c =>
      c.id === id ? { ...c, enabled: c.enabled === false ? true : false } : c
    );
    onUpdateModel(
      withResolvedPointConstraints({ ...model, constraints: nextConstraints }),
      `Alternar restricción ${id}`,
    );
  };

  const handleDeleteConstraint = (id: string) => {
    onUpdateModel(removeConstraintFromModel(model, id), `Eliminar restricción ${id}`);
  };

  const handleUpdateSlotRef = (constraintId: string, slotIndex: number, newRefId: string) => {
    const target = constraints.find(c => c.id === constraintId);
    if (!target) return;
    const nextRefs = [...target.refs];
    nextRefs[slotIndex] = newRefId;

    const nextConstraints = constraints.map(c =>
      c.id === constraintId ? { ...c, refs: nextRefs } : c
    );
    let nextModel: VisualDiagramModel = { ...model, constraints: nextConstraints };
    nextModel = withConstraintDependencies(nextModel, constraintId, nextRefs);
    onUpdateModel(withResolvedPointConstraints(nextModel), `Actualizar referencia de restricción ${constraintId}`);
  };

  const handleUpdateConstraintField = (
    constraintId: string,
    patch: Partial<VisualConstraint>,
  ) => {
    const nextConstraints = constraints.map(c =>
      c.id === constraintId ? { ...c, ...patch } : c
    );
    onUpdateModel(
      withResolvedPointConstraints({ ...model, constraints: nextConstraints }),
      `Actualizar restricción ${constraintId}`,
    );
  };

  const handleAddConstraint = () => {
    const target = newTargetId || selectedId || (points[0]?.id ?? elements[0]?.id ?? '');
    if (!target) return;

    const refs = defaultConstraintRefs(model, newKind, target);
    const id = uniqueConstraintId(model);
    const presentation = constraintPresentation(newKind);
    const point = points.find(p => p.id === target);

    const newConstraint: VisualConstraint = {
      id,
      label: presentation.label,
      kind: newKind,
      refs,
      enabled: true,
      ...(newKind === 'distance' ? { value: 1 } : {}),
    };

    let nextModel: VisualDiagramModel = {
      ...model,
      constraints: [...(model.constraints || []), newConstraint],
    };
    nextModel = withConstraintDependencies(
      nextModel,
      id,
      newKind === 'equalAngle' ? refs.slice(0, 4) : refs,
    );
    if (point) {
      nextModel = updatePoint(nextModel, point.id, {
        constraint: 'constrained',
        constraintIds: [...(point.constraintIds || []), id],
      });
    }
    onUpdateModel(withResolvedPointConstraints(nextModel), `Añadir restricción ${presentation.label}`);
    setShowAddModal(false);
  };

  return (
    <div className="p-2.5 space-y-3 font-serif text-xs text-carbon">
      <div className="flex items-center justify-between border-b border-carbon/10 pb-2">
        <div>
          <h3 className="font-bold text-[10px] uppercase tracking-wider text-salvia">
            Restricciones {selectedId ? `(${selectedId})` : `Totales (${constraints.length})`}
          </h3>
          <p className="text-[10px] text-carbon/55">
            Relaciones geométricas, posicionales y algebraicas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNewTargetId(selectedId || points[0]?.id || '');
            setShowAddModal(true);
          }}
          className="flex items-center space-x-1 px-2.5 py-1 bg-salvia text-lienzo rounded font-bold hover:bg-salvia/90 transition-all cursor-pointer text-[11px] shadow-2xs"
        >
          <IconPlus className="w-3 h-3" />
          <span>Restricción</span>
        </button>
      </div>

      {activeConstraints.length === 0 ? (
        <p className="text-center py-4 text-carbon/40 italic">
          {selectedId
            ? `El objeto "${selectedId}" no tiene restricciones activas.`
            : 'No hay ninguna restricción definida en este diagrama.'}
        </p>
      ) : (
        <div className="space-y-2">
          {activeConstraints.map(c => {
            const presentation = constraintPresentation(c.kind);
            const disabledReason = getConstraintDisabledReason(model, c.kind, c.refs[0] || '');
            const slots = editableSlotsFor(c.kind);
            return (
              <div
                key={c.id}
                className={`p-2.5 rounded-xl border transition-all bg-carbon/5 ${
                  c.enabled === false ? 'border-carbon/10 opacity-60' : 'border-carbon/15 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={c.enabled !== false}
                      onChange={() => handleToggleConstraint(c.id)}
                      className="rounded text-salvia border-carbon/20 focus:ring-salvia cursor-pointer"
                      title={c.enabled === false ? 'Activar restricción' : 'Desactivar restricción'}
                    />
                    <span className="font-bold text-xs text-carbon">{c.label || presentation.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteConstraint(c.id)}
                    className="text-granada hover:bg-granada/10 p-1 rounded text-[10px] cursor-pointer"
                    title="Eliminar restricción"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] text-carbon/60 mb-2 leading-tight">{presentation.description}</p>

                <div className="space-y-1.5 bg-carbon/5 p-2 rounded-lg border border-carbon/10">
                  <span className="text-[10px] font-bold text-carbon/70 block">
                    Referencias ({c.refs.length} / {presentation.refs}):
                  </span>
                  <div className="space-y-1">
                    {(slots.length > 0 ? slots : c.refs.map((_, index) => ({ index, label: getConstraintSlotLabel(c.kind, index) }))).map(slot => {
                      const slotIdx = slot.index;
                      const refId = c.refs[slotIdx] || '';
                      const candidates = candidatesForSlot(model, c.kind, slotIdx, c.refs);
                      const options = candidates.some(item => item.id === refId) || !refId
                        ? candidates
                        : [{ id: refId, label: refId }, ...candidates];
                      return (
                        <div key={slotIdx} className="flex flex-col space-y-0.5 text-[10px] bg-lienzo p-1.5 rounded border border-carbon/10">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-salvia font-bold">Slot {slotIdx + 1}:</span>
                            <span className="text-[10px] text-carbon/60 font-medium italic">
                              {slot.label || getConstraintSlotLabel(c.kind, slotIdx)}
                            </span>
                          </div>
                          <select
                            value={refId}
                            onChange={e => handleUpdateSlotRef(c.id, slotIdx, e.target.value)}
                            className="w-full bg-carbon/5 border border-carbon/20 rounded px-1.5 py-1 text-xs text-carbon font-mono font-bold"
                          >
                            {!refId && <option value="">-- Seleccionar --</option>}
                            {options.map(cand => (
                              <option key={cand.id} value={cand.id}>
                                {cand.label || cand.id} ({cand.id})
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {c.kind === 'distance' && (
                  <label className="mt-2 block text-[10px] font-bold text-carbon/70">
                    Distancia
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={c.value ?? 1}
                      onChange={e => handleUpdateConstraintField(c.id, {
                        value: Number(e.target.value),
                        expression: undefined,
                      })}
                      className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-1.5 py-1 text-xs font-mono"
                    />
                  </label>
                )}

                {c.kind === 'expression' && (
                  <label className="mt-2 block text-[10px] font-bold text-carbon/70">
                    Expresión
                    <input
                      type="text"
                      value={c.expression ?? ''}
                      onChange={e => handleUpdateConstraintField(c.id, { expression: e.target.value })}
                      className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-1.5 py-1 text-xs font-mono"
                    />
                  </label>
                )}

                {c.kind === 'insideArea' && (
                  <label className="mt-2 block text-[10px] font-bold text-carbon/70">
                    Pertenencia al área
                    <select
                      value={c.areaMembership ?? 'interior'}
                      onChange={e => handleUpdateConstraintField(c.id, {
                        areaMembership: e.target.value as AreaMembership,
                      })}
                      className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-1.5 py-1 text-xs"
                    >
                      <option value="interior">Interior</option>
                      <option value="boundary">Perímetro o frontera</option>
                    </select>
                  </label>
                )}

                {c.kind === 'sameSide' && (
                  <label className="mt-2 block text-[10px] font-bold text-carbon/70">
                    Lado
                    <select
                      value={c.side ?? 1}
                      onChange={e => handleUpdateConstraintField(c.id, {
                        side: Number(e.target.value) as 1 | -1,
                      })}
                      className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-1.5 py-1 text-xs"
                    >
                      <option value={1}>Positivo</option>
                      <option value={-1}>Negativo</option>
                    </select>
                  </label>
                )}

                {disabledReason && (
                  <p className="mt-1 text-[10px] text-granada font-medium bg-granada/5 p-1.5 rounded border border-granada/15">
                    {disabledReason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-lienzo rounded-2xl border border-carbon/20 shadow-2xl p-4 space-y-3 font-serif">
            <div className="flex items-center justify-between border-b border-carbon/10 pb-2">
              <h3 className="font-bold text-sm text-carbon">Nueva Restricción</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-carbon/60 hover:text-carbon p-1 cursor-pointer"
              >
                <IconClose />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-carbon/80 mb-1">Objeto Principal de la Restricción</label>
              <select
                value={newTargetId}
                onChange={e => setNewTargetId(e.target.value)}
                className="w-full bg-carbon/5 border border-carbon/20 rounded-lg px-2.5 py-1.5 text-xs text-carbon"
              >
                <optgroup label="Puntos">
                  {points.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.label || p.id} ({p.id})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Elementos / Segmentos">
                  {elements.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.label || e.id} ({e.kind})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-carbon/80 mb-1">Tipo de Restricción</label>
              <select
                value={newKind}
                onChange={e => setNewKind(e.target.value as VisualConstraint['kind'])}
                className="w-full bg-carbon/5 border border-carbon/20 rounded-lg px-2.5 py-1.5 text-xs text-carbon"
              >
                {(() => {
                  const targetScope: RelationScope | undefined = points.some(p => p.id === (newTargetId || selectedId))
                    ? 'point'
                    : elements.some(e => e.id === (newTargetId || selectedId) && e.kind === 'segment')
                    ? 'segment'
                    : elements.some(e => e.id === (newTargetId || selectedId) && ['angle', 'nonReflexAngle', 'rightAngle'].includes(e.kind))
                    ? 'angle'
                    : undefined;

                  const allowedEntries = targetScope ? relationsForScope(targetScope) : RELATION_CATALOG;

                  return RELATION_CATEGORY_ORDER.map(cat => {
                    const catEntries = allowedEntries.filter(entry => entry.category === cat);
                    if (catEntries.length === 0) return null;
                    return (
                      <optgroup key={cat} label={RELATION_CATEGORY_LABELS[cat]}>
                        {catEntries.map(entry => (
                          <option key={entry.value} value={entry.value}>
                            {entry.label}
                          </option>
                        ))}
                      </optgroup>
                    );
                  });
                })()}
              </select>
            </div>

            <div className="bg-carbon/5 p-2 rounded-lg border border-carbon/10 text-[11px]">
              <span className="font-bold block text-carbon">Información y compatibilidad:</span>
              <p className="text-carbon/70">{constraintPresentation(newKind).description}</p>
              <p className="text-carbon/50 mt-1">
                Requiere {constraintPresentation(newKind).refs} referencia(s). Se auto-completarán únicamente con objetos compatibles existentes.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-carbon/10">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 border border-carbon/20 rounded-lg text-xs font-bold text-carbon/70 hover:bg-carbon/5 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAddConstraint}
                className="px-4 py-1.5 bg-salvia text-lienzo rounded-lg text-xs font-bold hover:bg-salvia/90 transition-all cursor-pointer shadow-2xs"
              >
                Crear Restricción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
