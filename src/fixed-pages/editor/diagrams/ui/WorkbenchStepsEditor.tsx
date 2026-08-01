import React, { useState } from 'react';
import type { VisualDiagramModel, VisualStep } from '../model/types';
import type { DiagramStepEmphasis } from '@/diagrams/spec';
import { toggleInitialStep, duplicateStep, moveStep } from '../model/diagramElements';
import { syncStepObjectVisibility } from './workbenchSelection';
import { DiagramStepObjectAppearanceEditor } from './DiagramStepObjectAppearanceEditor';
import { IconPlus, IconTrash, IconCopy, IconChevronUp, IconChevronDown } from './WorkbenchIcons';

interface WorkbenchStepsEditorProps {
  model: VisualDiagramModel | null;
  activeStepIndex: number | null;
  selectedIds?: readonly string[];
  onSelectStepIndex: (index: number | null) => void;
  onAddStep: () => void;
  onUpdateStep: (index: number, updates: Partial<VisualStep>) => void;
  onDeleteStep: (index: number) => void;
  onToggleObjectInAllSteps: (objectId: string, makeVisible: boolean) => void;
  onUpdateModel?: (nextModel: VisualDiagramModel, label: string) => void;
}

const EMPHASIS_COLORS: Record<string, { label: string; bg: string; text: string }> = {
  none: { label: 'Normal', bg: 'bg-carbon/10 text-carbon/70', text: 'text-carbon/60' },
  primary: { label: 'Principal', bg: 'bg-salvia text-lienzo', text: 'text-salvia' },
  secondary: { label: 'Secundario', bg: 'bg-terracota text-lienzo', text: 'text-terracota' },
};

const EMPHASIS_SEQUENCE: DiagramStepEmphasis[] = ['none', 'primary', 'secondary'];

export const WorkbenchStepsEditor: React.FC<WorkbenchStepsEditorProps> = ({
  model,
  activeStepIndex,
  selectedIds = [],
  onSelectStepIndex,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onToggleObjectInAllSteps,
  onUpdateModel,
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
          <p className="text-[11px] text-pizarra/70 italic">Explicación interactiva secuencia a secuencia.</p>
        </div>
        <button
          type="button"
          onClick={onAddStep}
          className="flex items-center space-x-1 px-3 py-1.5 bg-salvia text-lienzo rounded-lg font-bold shadow-2xs hover:bg-salvia/90 transition-all cursor-pointer"
        >
          <IconPlus className="w-3.5 h-3.5" />
          <span>Añadir Paso</span>
        </button>
      </div>

      {/* Acción Masiva */}
      <div className="p-2.5 bg-carbon/5 rounded-xl border border-carbon/10 space-y-1">
        <label className="block text-[10px] font-bold text-carbon/70 uppercase tracking-wider">
          Acción Masiva: Visibilidad en Todos los Pasos
        </label>
        <div className="flex items-center space-x-1.5">
          <select
            value={effectiveBulkId}
            onChange={e => setBulkObjectId(e.target.value)}
            className="flex-1 bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
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
            className="px-2 py-1 bg-salvia text-lienzo rounded font-bold text-[10px] cursor-pointer"
            title="Mostrar en todos los pasos"
          >
            Mostrar
          </button>
          <button
            type="button"
            onClick={() => {
              if (effectiveBulkId) onToggleObjectInAllSteps(effectiveBulkId, false);
            }}
            className="px-2 py-1 bg-granada text-lienzo rounded font-bold text-[10px] cursor-pointer"
            title="Ocultar en todos los pasos"
          >
            Ocultar
          </button>
        </div>
      </div>

      {steps.length === 0 ? (
        <div className="p-6 text-center text-pizarra/50 border border-dashed border-carbon/20 rounded-xl bg-carbon/2">
          <p className="italic">No hay pasos creados en este diagrama.</p>
          <button
            type="button"
            onClick={onAddStep}
            className="mt-2 text-salvia underline font-bold cursor-pointer"
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
                    ? 'border-salvia bg-salvia/10 shadow-xs ring-1 ring-salvia'
                    : 'border-carbon/15 bg-carbon/5 hover:border-carbon/30'
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
                      className="font-bold text-xs bg-transparent border-b border-transparent hover:border-carbon/20 focus:border-salvia focus:outline-hidden px-1 py-0.5 text-carbon truncate"
                      placeholder={`Paso ${idx + 1}`}
                    />
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {/* Botones de Reordenar y Duplicar */}
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
                      className="p-1 text-salvia hover:bg-salvia/10 rounded cursor-pointer"
                      title="Duplicar paso"
                    >
                      <IconCopy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleInitialStep(st.id)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        isInitial ? 'bg-ocre text-carbon' : 'bg-carbon/10 text-carbon/70 hover:bg-carbon/20'
                      }`}
                      title="Garantizar que solo un paso es el estado inicial"
                    >
                      {isInitial ? 'Inicial' : 'Hacer Inicial'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectStepIndex(isActive ? null : idx)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        isActive ? 'bg-salvia text-lienzo' : 'bg-carbon/10 text-carbon hover:bg-carbon/20'
                      }`}
                    >
                      {isActive ? 'Viendo' : 'Ver'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteStep(idx)}
                      className="text-granada hover:bg-granada/10 p-1 rounded text-[10px] font-bold cursor-pointer"
                      title="Eliminar paso"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={st.description || ''}
                  onChange={(e) => onUpdateStep(idx, { description: e.target.value })}
                  className="w-full bg-lienzo border border-carbon/15 rounded p-1.5 text-xs text-carbon focus:ring-1 focus:ring-salvia mb-2"
                  rows={2}
                  placeholder="Descripción explicativa del paso..."
                />

                {/* Selección de Objetos Visibles & Énfasis en este paso */}
                <div>
                  <label className="block text-[10px] font-bold text-carbon/60 uppercase tracking-wider mb-1">
                    Objetos visibles & Énfasis al hacer clic ({st.visibleTargets?.length || 0})
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-1.5 bg-carbon/5 rounded border border-carbon/10">
                    {allObjects.map(obj => {
                      const isVisible = (st.visibleTargets || []).includes(obj.id);
                      const currentEmp = (st.objectStates?.[obj.id]?.emphasis || 'none') as string;
                      const empInfo = EMPHASIS_COLORS[currentEmp] || EMPHASIS_COLORS['none'];

                      return (
                        <div key={obj.id} className="flex items-center space-x-1 bg-lienzo px-1.5 py-0.5 rounded border border-carbon/15 text-[10px]">
                          <button
                            type="button"
                            onClick={() => {
                              const isVisible = (st.visibleTargets || []).includes(obj.id);
                              onUpdateStep(idx, syncStepObjectVisibility(st, obj.id, !isVisible));
                            }}
                            className={`font-mono font-bold cursor-pointer ${isVisible ? 'text-salvia' : 'text-carbon/30 line-through'}`}
                          >
                            {obj.label}
                          </button>

                          {isVisible && (
                            <button
                              type="button"
                              onClick={() => handleCycleEmphasis(idx, obj.id)}
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold cursor-pointer transition-all ${empInfo.bg}`}
                              title={`Hacer clic para cambiar nivel de énfasis (Actual: ${empInfo.label})`}
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
                  <div className="mt-2 rounded border border-salvia/25 bg-salvia/5 p-2">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-salvia">
                        Apariencia de {selectedObject.label || selectedObject.id}
                      </span>
                      <label className="flex items-center gap-1 text-[10px] font-bold text-carbon">
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
