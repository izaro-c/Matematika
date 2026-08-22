import React, { useState } from 'react';
import type { VisualDiagramModel, VisualStep } from '../../model/types';
import type { DiagramStepEmphasis } from '@/diagrams';
import { toggleInitialStep, duplicateStep, moveStep } from '../../model/elements/diagramElements';
import { syncStepObjectVisibility } from '../workbenchSelection';
import { DiagramStepObjectAppearanceEditor } from '../DiagramStepObjectAppearanceEditor';
import { IconPlus, IconTrash, IconCopy, IconChevronUp, IconChevronDown } from './WorkbenchIcons';
import { InspectorExpandableBlock } from '../inspector/InspectorExpandableBlock';

interface WorkbenchStepsEditorProps {
  model: VisualDiagramModel | null;
  activeStepIndex: number | null;
  selectedIds?: readonly string[];
  pickingStepIndex?: number | null;
  onSelectStepIndex: (index: number | null) => void;
  onAddStep: () => void;
  onUpdateStep: (index: number, updates: Partial<VisualStep>) => void;
  onDeleteStep: (index: number) => void;
  onToggleObjectInAllSteps: (objectId: string, makeVisible: boolean) => void;
  onUpdateModel?: (nextModel: VisualDiagramModel, label: string) => void;
  onSelectObjects?: (ids: string[], additive?: boolean) => void;
  onTogglePickingStepIndex?: (index: number | null) => void;
}

const EMPHASIS_COLORS: Record<string, { label: string; bg: string; text: string }> = {
  none: { label: 'Normal', bg: 'bg-carbon/10 text-carbon/70', text: 'text-carbon/60' },
  primary: { label: 'Principal', bg: 'bg-canela text-lienzo', text: 'text-canela' },
  secondary: { label: 'Secundario', bg: 'bg-terracota text-lienzo', text: 'text-terracota' },
};

const EMPHASIS_SEQUENCE: DiagramStepEmphasis[] = ['none', 'primary', 'secondary'];

export const WorkbenchStepsEditor: React.FC<WorkbenchStepsEditorProps> = ({
  model,
  activeStepIndex,
  selectedIds = [],
  pickingStepIndex = null,
  onSelectStepIndex,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onToggleObjectInAllSteps,
  onUpdateModel,
  onSelectObjects,
  onTogglePickingStepIndex,
}) => {
  const [bulkObjectId, setBulkObjectId] = useState('');

  if (!model) return null;

  const steps = model.steps || [];
  const allObjects = [
    ...model.points.map(p => ({ id: p.id, label: p.label || p.id, type: 'Punto' })),
    ...model.elements.map(e => ({ id: e.id, label: e.label || e.id, type: e.kind })),
    ...model.sliders.map(s => ({ id: s.id, label: s.label || s.id, type: 'Deslizador' })),
  ];
  const effectiveBulkId = bulkObjectId && allObjects.some(o => o.id === bulkObjectId)
    ? bulkObjectId
    : (allObjects[0]?.id || '');
  const selectedObjectId = selectedIds[0] ?? '';
  const selectedObject = model.points.find(point => point.id === selectedObjectId)
    ?? model.elements.find(element => element.id === selectedObjectId);

  const syncActiveAfterReorder = (nextSteps: VisualStep[], previousId?: string) => {
    const id = previousId ?? (activeStepIndex !== null ? steps[activeStepIndex]?.id : undefined);
    if (!id) return;
    const nextIndex = nextSteps.findIndex(st => st.id === id);
    onSelectStepIndex(nextIndex >= 0 ? nextIndex : null);
  };

  const handleToggleInitialStep = (stepId: string) => {
    if (!onUpdateModel) return;
    const nextSteps = toggleInitialStep(steps, stepId);
    onUpdateModel({ ...model, steps: nextSteps }, 'Alternar paso inicial único');
    if (stepId !== 'initial') {
      onSelectStepIndex(0);
    } else if (activeStepIndex !== null && nextSteps.length > 0) {
      onSelectStepIndex(Math.min(activeStepIndex, nextSteps.length - 1));
    }
  };

  const handleDuplicateStep = (stepId: string) => {
    if (!onUpdateModel) return;
    const nextSteps = duplicateStep(steps, stepId);
    onUpdateModel({ ...model, steps: nextSteps }, 'Duplicar paso de demostración');
  };

  const handleMoveStep = (stepId: string, dir: -1 | 1) => {
    if (!onUpdateModel) return;
    const nextSteps = moveStep(steps, stepId, dir);
    onUpdateModel({ ...model, steps: nextSteps }, 'Reordenar pasos de demostración');
    syncActiveAfterReorder(nextSteps, stepId);
  };

  const handleCycleEmphasis = (stepIdx: number, objectId: string) => {
    const st = steps[stepIdx];
    if (!st) return;
    const currentEmp: DiagramStepEmphasis = st.objectStates?.[objectId]?.emphasis || 'none';
    const nextEmp = EMPHASIS_SEQUENCE[(EMPHASIS_SEQUENCE.indexOf(currentEmp) + 1) % EMPHASIS_SEQUENCE.length];

    const objectStates = { ...(st.objectStates || {}) };
    objectStates[objectId] = {
      ...(objectStates[objectId] || {}),
      emphasis: nextEmp,
    };
    onUpdateStep(stepIdx, { objectStates });
  };

  return (
    <div className="p-3 space-y-3 text-xs font-serif text-carbon">
      <div className="flex items-center justify-between border-b border-carbon/10 pb-2">
        <div>
          <h3 className="font-bold text-sm text-carbon">Pasos de Demostración</h3>
          <p className="text-[11px] text-carbon/50 italic">Explicación interactiva secuencia a secuencia.</p>
        </div>
        <button
          type="button"
          onClick={onAddStep}
          className="flex items-center space-x-1 px-3 py-1.5 bg-canela text-lienzo rounded-lg font-bold shadow-2xs hover:bg-canela/90 transition-all cursor-pointer"
        >
          <IconPlus className="w-3.5 h-3.5" />
          <span>Añadir Paso</span>
        </button>
      </div>

      {/* Acción Masiva */}
      <InspectorExpandableBlock title="Acción Masiva: Visibilidad" defaultOpen={false}>
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-carbon/70 uppercase tracking-wider">
            Objeto objetivo para visibilidad global
          </label>
          <div className="flex items-center space-x-1.5">
            <select
              value={effectiveBulkId}
              onChange={e => setBulkObjectId(e.target.value)}
              className="flex-1 bg-lienzo border border-carbon/20 rounded-lg px-2.5 py-1.5 text-xs text-carbon focus:border-canela focus:outline-none"
            >
              {allObjects.map(obj => (
                <option key={obj.id} value={obj.id}>
                  {obj.label} ({obj.id})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                if (effectiveBulkId) onToggleObjectInAllSteps(effectiveBulkId, true);
              }}
              className="px-2.5 py-1.5 bg-canela text-lienzo rounded-lg font-bold text-[10px] hover:bg-canela/90 transition-colors cursor-pointer"
              title="Mostrar en todos los pasos"
            >
              Mostrar
            </button>
            <button
              type="button"
              onClick={() => {
                if (effectiveBulkId) onToggleObjectInAllSteps(effectiveBulkId, false);
              }}
              className="px-2.5 py-1.5 bg-granada text-lienzo rounded-lg font-bold text-[10px] hover:bg-granada/90 transition-colors cursor-pointer"
              title="Ocultar en todos los pasos"
            >
              Ocultar
            </button>
          </div>
        </div>
      </InspectorExpandableBlock>

      {steps.length === 0 ? (
        <div className="p-6 text-center text-carbon/50 border border-dashed border-carbon/20 rounded-xl bg-carbon/5">
          <p className="italic">No hay pasos creados en este diagrama.</p>
          <button
            type="button"
            onClick={onAddStep}
            className="mt-2 text-canela underline font-bold cursor-pointer"
          >
            Crear el primer paso
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((st, idx) => {
            const isActive = activeStepIndex === idx;
            const isInitial = st.id === 'initial';
            return (
              <div
                key={st.id || `step-${idx}`}
                className={`p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'border-canela bg-canela/10 shadow-xs ring-1 ring-canela'
                    : 'border-carbon/15 bg-lienzo/40 hover:border-carbon/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full font-mono font-bold text-[10px] shrink-0 ${
                      isInitial ? 'bg-ocre text-carbon' : 'bg-carbon/20 text-carbon'
                    }`}>
                      {isInitial ? '0' : idx + 1}
                    </span>
                    <input
                      type="text"
                      value={st.label || ''}
                      onChange={(e) => onUpdateStep(idx, { label: e.target.value })}
                      className="font-bold text-xs bg-transparent border-b border-transparent hover:border-carbon/20 focus:border-canela focus:outline-none px-1 py-0.5 text-carbon truncate"
                      placeholder={`Paso ${idx + 1}`}
                    />
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMoveStep(st.id, -1)}
                      disabled={idx === 0}
                      className="p-1 text-carbon/60 hover:text-carbon disabled:opacity-20 cursor-pointer"
                      title="Mover paso arriba"
                    >
                      <IconChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveStep(st.id, 1)}
                      disabled={idx === steps.length - 1}
                      className="p-1 text-carbon/60 hover:text-carbon disabled:opacity-20 cursor-pointer"
                      title="Mover paso abajo"
                    >
                      <IconChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateStep(st.id)}
                      className="p-1 text-canela hover:bg-canela/10 rounded cursor-pointer"
                      title="Duplicar paso"
                    >
                      <IconCopy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleInitialStep(st.id)}
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition-all ${
                        isInitial ? 'bg-ocre text-carbon' : 'bg-carbon/10 text-carbon/70 hover:bg-carbon/20'
                      }`}
                      title="Garantizar que solo un paso es el estado inicial"
                    >
                      {isInitial ? 'Inicial' : 'Hacer Inicial'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectStepIndex(isActive ? null : idx)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer ${
                        isActive ? 'bg-canela text-lienzo' : 'bg-carbon/10 text-carbon hover:bg-carbon/20'
                      }`}
                    >
                      {isActive ? 'Viendo' : 'Ver'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteStep(idx)}
                      className="text-granada hover:bg-granada/10 p-1 rounded-md text-[10px] font-bold cursor-pointer"
                      title="Eliminar paso"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={st.description || ''}
                  onChange={(e) => onUpdateStep(idx, { description: e.target.value })}
                  className="w-full bg-lienzo border border-carbon/15 rounded-lg p-2 text-xs text-carbon focus:ring-1 focus:ring-canela mb-2 placeholder-carbon/30"
                  rows={2}
                  placeholder="Descripción explicativa del paso..."
                />

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                    <label className="block text-[10px] font-bold text-carbon/60 uppercase tracking-wider">
                      Objetos visibles & Énfasis ({st.visibleTargets?.length || 0})
                    </label>
                    <div className="flex flex-wrap items-center gap-1">
                      {onTogglePickingStepIndex && (
                        <button
                          type="button"
                          onClick={() => onTogglePickingStepIndex(pickingStepIndex === idx ? null : idx)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all border ${
                            pickingStepIndex === idx
                              ? 'bg-canela text-lienzo border-canela shadow-2xs ring-1 ring-canela/50 animate-pulse'
                              : 'bg-lienzo text-carbon/80 border-carbon/20 hover:border-canela hover:text-canela'
                          }`}
                          title="Hacer clic en elementos del lienzo para alternar su visibilidad en este paso"
                        >
                          {pickingStepIndex === idx ? 'Seleccionando en lienzo...' : 'Seleccionar en lienzo'}
                        </button>
                      )}
                      {selectedIds.length > 0 && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              let nextStep = st;
                              selectedIds.forEach(id => {
                                nextStep = syncStepObjectVisibility(nextStep, id, true);
                              });
                              onUpdateStep(idx, nextStep);
                            }}
                            className="px-1.5 py-0.5 bg-canela/10 text-canela hover:bg-canela/20 rounded text-[9px] font-bold cursor-pointer transition-all border border-canela/30"
                            title="Mostrar en este paso los elementos seleccionados en lienzo"
                          >
                            + Mostrar sel. ({selectedIds.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              let nextStep = st;
                              selectedIds.forEach(id => {
                                nextStep = syncStepObjectVisibility(nextStep, id, false);
                              });
                              onUpdateStep(idx, nextStep);
                            }}
                            className="px-1.5 py-0.5 bg-granada/10 text-granada hover:bg-granada/20 rounded text-[9px] font-bold cursor-pointer transition-all border border-granada/30"
                            title="Ocultar en este paso los elementos seleccionados en lienzo"
                          >
                            - Ocultar sel. ({selectedIds.length})
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 bg-lienzo/60 rounded-lg border border-carbon/10">
                    {allObjects.map(obj => {
                      const isVisible = (st.visibleTargets || []).includes(obj.id);
                      const isCanvasSelected = selectedIds.includes(obj.id);
                      const currentEmp = (st.objectStates?.[obj.id]?.emphasis || 'none') as string;
                      const empInfo = EMPHASIS_COLORS[currentEmp] || EMPHASIS_COLORS['none'];

                      return (
                        <div
                          key={obj.id}
                          className={`flex items-center space-x-1 bg-lienzo px-2 py-0.5 rounded-md border text-[10px] ${
                            isCanvasSelected ? 'border-canela ring-1 ring-canela/60' : 'border-carbon/15'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const isVis = (st.visibleTargets || []).includes(obj.id);
                              onUpdateStep(idx, syncStepObjectVisibility(st, obj.id, !isVis));
                              onSelectObjects?.([obj.id]);
                            }}
                            className={`font-mono font-bold cursor-pointer ${isVisible ? 'text-canela' : 'text-carbon/30 line-through'}`}
                          >
                            {obj.label}
                          </button>

                          {isVisible && (
                            <button
                              type="button"
                              onClick={() => handleCycleEmphasis(idx, obj.id)}
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold cursor-pointer transition-all ${empInfo.bg}`}
                              title={`Cambiar énfasis (Actual: ${empInfo.label})`}
                            >
                              {empInfo.label}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {isActive && selectedObject && (
                  <div className="mt-2 rounded-xl border border-canela/25 bg-canela/5 p-2.5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-canela">
                        Apariencia de {selectedObject.label || selectedObject.id}
                      </span>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-carbon cursor-pointer">
                        <input
                          type="checkbox"
                          checked={st.objectStates?.[selectedObject.id]?.interactive ?? true}
                          onChange={event => onUpdateStep(idx, {
                            objectStates: {
                              ...(st.objectStates || {}),
                              [selectedObject.id]: {
                                ...(st.objectStates?.[selectedObject.id] || {}),
                                interactive: event.target.checked,
                              },
                            },
                          })}
                          className="rounded text-canela focus:ring-canela cursor-pointer"
                        />
                        Interactivo
                      </label>
                    </div>
                    <DiagramStepObjectAppearanceEditor
                      object={selectedObject}
                      state={st.objectStates?.[selectedObject.id] || {}}
                      onStateChange={update => onUpdateStep(idx, {
                        objectStates: {
                          ...(st.objectStates || {}),
                          [selectedObject.id]: {
                            ...(st.objectStates?.[selectedObject.id] || {}),
                            ...update,
                          },
                        },
                      })}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
