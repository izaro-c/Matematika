import React, { useState } from 'react';
import { StepNavigator } from '@/shared/ui/StepNavigator';
import type { DiagramStepObjectState } from '@/shared/diagrams/spec';
import type { VisualDiagramModel } from '../model/types';
import {
  duplicateStep,
  moveStep,
  nextStepId,
  removeStep,
  step,
  updateStep,
  updateStepObjectState,
} from '../model/commands';
import { toggleInitialStep, reindexSteps } from '../model/diagramElements';
import { DiagramExpressionField } from './DiagramExpressionField';
import { COLOR_OPTIONS } from '../model/commands';

interface DiagramStepsEditorProps {
  model: VisualDiagramModel;
  activeStepId: string;
  onActiveStepChange: (stepId: string) => void;
  onModelEdit: (model: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
  onSelectObject: (objectId: string) => void;
}

const emphasisLabel = { none: 'Sin resaltar', secondary: 'Resaltado suave', primary: 'Resaltado fuerte' } as const;

function matrixCellClass(selected: boolean, visible: boolean): string {
  if (selected) return 'border-terracota bg-terracota/10';
  if (visible) return 'border-salvia/40 bg-salvia/10';
  return 'border-carbon/10 bg-carbon/[0.02] text-carbon/45';
}

function emphasisSummary(emphasis: keyof typeof emphasisLabel): string {
  if (emphasis === 'primary') return 'Resaltado fuerte';
  if (emphasis === 'secondary') return 'Resaltado suave';
  return 'Sin resaltar';
}

export const DiagramStepsEditor: React.FC<DiagramStepsEditorProps> = ({
  model,
  activeStepId,
  onActiveStepChange,
  onModelEdit,
  onSelectObject,
}) => {
  const items = [...model.points, ...model.elements, ...model.sliders];
  const [selectedCell, setSelectedCell] = useState<{ stepId: string; objectId: string } | null>(null);
  const [objectQuery, setObjectQuery] = useState('');
  const activeStep = model.steps.find(item => item.id === activeStepId) ?? model.steps[0];
  const selectedStep = selectedCell ? model.steps.find(item => item.id === selectedCell.stepId) : undefined;
  const selectedObject = selectedCell ? items.find(item => item.id === selectedCell.objectId) : undefined;
  const selectedState = selectedStep && selectedObject
    ? selectedStep.objectStates?.[selectedObject.id] ?? { visible: selectedStep.visibleTargets.includes(selectedObject.id), emphasis: 'none' as const, interactive: true }
    : undefined;
  const visibleItems = items.filter(item => `${item.label} ${item.id}`.toLocaleLowerCase('es').includes(objectQuery.trim().toLocaleLowerCase('es')));

  const editSteps = (steps: VisualDiagramModel['steps'], label: string) => onModelEdit({ ...model, steps: reindexSteps(steps) }, { label });
  const addStep = () => {
    const id = nextStepId(model.steps);
    const visibleIds = items.filter(item => item.visible).map(item => item.id);
    editSteps([...model.steps, step(id, `Paso ${model.steps.length + 1}`, 'Describa qué cambia y por qué.', visibleIds)], 'Añadir paso');
    onActiveStepChange(id);
  };
  const addInitialStep = () => {
    if (model.steps.some(s => s.id === 'initial')) return;
    const visibleIds = items.filter(item => item.visible).map(item => item.id);
    const initialStep = step('initial', 'Figura inicial', 'Estado inicial del enunciado', visibleIds);
    editSteps([initialStep, ...model.steps], 'Añadir paso inicial');
    onActiveStepChange('initial');
  };
  const handleToggleInitial = () => {
    if (!activeStep) return;
    const nextSteps = toggleInitialStep(model.steps, activeStep.id);
    editSteps(nextSteps, 'Cambiar estado inicial');
    const newActiveId = activeStep.id === 'initial' ? 'step1' : 'initial';
    onActiveStepChange(newActiveId);
  };
  const editState = (update: Partial<DiagramStepObjectState>, label: string) => {
    if (!selectedCell) return;
    editSteps(updateStepObjectState(model.steps, selectedCell.stepId, selectedCell.objectId, update), label);
  };

  const hasInitialStep = model.steps.some(s => s.id === 'initial');

  return (
    <section className="rounded border border-carbon/15 bg-lienzo p-3" aria-labelledby="diagram-steps-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id="diagram-steps-title" className="text-xs font-bold uppercase tracking-widest text-carbon/55">Línea temporal y comportamiento</h3>
          <p className="mt-1 text-[10px] text-carbon/55">Cada celda resume qué cambia. Selecciónela para editar todos sus detalles.</p>
        </div>
        <div className="flex items-center gap-2">
          {!hasInitialStep && (
            <button
              type="button"
              onClick={addInitialStep}
              className="rounded border border-terracota/30 bg-terracota/10 px-2.5 py-1.5 text-xs font-bold text-terracota hover:bg-terracota/20"
              title="Añade un paso inicial con ID 'initial' para la figura del enunciado"
            >
              + Paso inicial ('initial')
            </button>
          )}
          <button type="button" onClick={addStep} className="rounded bg-terracota px-3 py-1.5 text-xs font-bold text-lienzo">+ Crear paso</button>
        </div>
      </div>

      {model.steps.length === 0 ? (
        <p className="mt-3 rounded border border-dashed border-carbon/20 p-5 text-center text-xs italic text-carbon/55">La secuencia todavía no tiene pasos.</p>
      ) : (
        <>
          <StepNavigator
            steps={model.steps}
            scopeId={model.componentId}
            activeStepId={activeStep?.id}
            onStepChange={onActiveStepChange}
            className="mt-3"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2 rounded border border-carbon/10 bg-carbon/[0.02] p-2">
            <span className="text-[10px] font-bold text-carbon/55">Paso activo:</span>
            <button type="button" className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold" onClick={() => {
              if (!activeStep) return;
              const steps = items.reduce((result, item) => updateStepObjectState(result, activeStep.id, item.id, { visible: true }), model.steps);
              editSteps(steps, `Mostrar todo en ${activeStep.label}`);
            }}>Mostrar todos los objetos</button>
            <button type="button" className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold" onClick={() => {
              if (!activeStep) return;
              const steps = items.reduce((result, item) => updateStepObjectState(result, activeStep.id, item.id, { visible: false }), model.steps);
              editSteps(steps, `Ocultar todo en ${activeStep.label}`);
            }}>Ocultar todos</button>
            <span className="ml-auto text-[9px] text-carbon/45">Después puede ajustar excepciones en la matriz.</span>
          </div>

          <ol className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Edición de la línea temporal">
            {model.steps.map((item, index) => (
              <li key={item.id} className={`min-w-52 rounded border p-2 ${item.id === activeStep?.id ? 'border-terracota bg-terracota/5' : 'border-carbon/10'}`}>
                <button type="button" className="w-full text-left" onClick={() => onActiveStepChange(item.id)} aria-current={item.id === activeStep?.id ? 'step' : undefined}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="block text-xs font-bold text-carbon">{index + 1}. {item.label}</span>
                    {item.id === 'initial' && (
                      <span className="rounded bg-terracota/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-terracota">Initial</span>
                    )}
                  </div>
                  <span className="mt-0.5 block truncate text-[10px] text-carbon/55">{item.description || 'Sin descripción'}</span>
                </button>
                <div className="mt-2 flex gap-1">
                  <button type="button" aria-label={`Mover ${item.label} a la izquierda`} disabled={index === 0} onClick={() => editSteps(moveStep(model.steps, item.id, -1), `Reordenar ${item.label}`)} className="rounded border border-carbon/15 px-1.5 text-xs disabled:opacity-30">Anterior</button>
                  <button type="button" aria-label={`Mover ${item.label} a la derecha`} disabled={index === model.steps.length - 1} onClick={() => editSteps(moveStep(model.steps, item.id, 1), `Reordenar ${item.label}`)} className="rounded border border-carbon/15 px-1.5 text-xs disabled:opacity-30">Siguiente</button>
                  <button type="button" onClick={() => editSteps(duplicateStep(model.steps, item.id), `Duplicar ${item.label}`)} className="rounded border border-carbon/15 px-1.5 text-[10px]">Duplicar</button>
                  <button
                    type="button"
                    onClick={() => {
                      const remaining = removeStep(model.steps, item.id);
                      editSteps(remaining, `Eliminar ${item.label}`);
                      if (item.id === activeStep?.id) onActiveStepChange(remaining[Math.max(0, index - 1)]?.id ?? '');
                    }}
                    className="ml-auto rounded border border-granada/20 px-1.5 text-[10px] text-granada"
                    aria-label={`Eliminar ${item.label}`}
                  >Eliminar</button>
                </div>
              </li>
            ))}
          </ol>

          {activeStep && (
            <fieldset className="mt-3 grid gap-2 rounded border border-carbon/10 bg-carbon/[0.02] p-3 sm:grid-cols-[1.2fr_1.5fr_2fr_110px]">
              <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/50">Datos del paso activo</legend>
              <div>
                <label className="block text-[10px] font-bold text-carbon/60 mb-1">Identificador del paso</label>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-carbon/5 border border-carbon/15 px-2 py-1 text-xs font-mono text-carbon font-bold">
                    {activeStep.id}
                  </span>
                  {activeStep.id !== 'initial' ? (
                    <button
                      type="button"
                      onClick={handleToggleInitial}
                      className="rounded border border-terracota/30 bg-terracota/10 px-2 py-1 text-[10px] font-bold text-terracota hover:bg-terracota/20"
                      title="Establece este paso como la figura del enunciado (ID 'initial')"
                    >
                      Marcar como 'initial'
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleInitial}
                      className="rounded border border-carbon/20 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5"
                      title="Convierte este paso a un paso numerado secuencial"
                    >
                      Convertir a numerado
                    </button>
                  )}
                </div>
              </div>
              <label className="text-[10px] font-bold text-carbon/60">Etiqueta
                <input className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={activeStep.label} onChange={event => editSteps(updateStep(model, activeStep.id, { label: event.target.value }).steps, 'Editar etiqueta del paso')} />
              </label>
              <label className="text-[10px] font-bold text-carbon/60">Qué cambia
                <input className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={activeStep.description} onChange={event => editSteps(updateStep(model, activeStep.id, { description: event.target.value }).steps, 'Editar descripción del paso')} />
              </label>
              <label className="text-[10px] font-bold text-carbon/60">Duración (ms)
                <input type="number" min="200" max="60000" step="100" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={activeStep.durationMs ?? 1800} onChange={event => editSteps(updateStep(model, activeStep.id, { durationMs: Number(event.target.value) }).steps, 'Editar duración del paso')} />
              </label>
            </fieldset>
          )}

          <div className="mt-4 grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="overflow-x-auto rounded border border-carbon/10">
            <div className="border-b border-carbon/10 bg-carbon/5 p-2"><input type="search" aria-label="Buscar objetos en la secuencia" placeholder="Buscar objetos en la matriz…" className="w-full max-w-sm rounded border border-carbon/15 bg-lienzo p-1.5 text-[10px]" value={objectQuery} onChange={event => setObjectQuery(event.target.value)} /></div>
            <table className="min-w-full border-collapse text-[10px]">
              <caption className="border-b border-carbon/10 bg-carbon/5 px-3 py-2 text-left font-bold uppercase tracking-widest text-carbon/50">Matriz objetos × pasos</caption>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 z-10 min-w-44 border-b border-r border-carbon/10 bg-lienzo p-2 text-left">Objeto</th>
                  {model.steps.map((item, index) => <th key={item.id} scope="col" className="min-w-28 border-b border-carbon/10 p-2 text-left">{index + 1}. {item.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {visibleItems.map(item => (
                  <tr key={item.id}>
                    <th scope="row" className="sticky left-0 z-10 border-r border-t border-carbon/10 bg-lienzo p-2 text-left">
                      <button type="button" className="font-bold text-carbon hover:text-terracota" onClick={() => onSelectObject(item.id)}>{item.label}</button>
                      <span className="block font-mono text-[9px] font-normal text-carbon/45">{item.id}</span>
                    </th>
                    {model.steps.map(stepItem => {
                      const state = stepItem.objectStates?.[item.id];
                      const visible = state?.visible ?? stepItem.visibleTargets.includes(item.id);
                      const emphasis = state?.emphasis ?? 'none';
                      const selected = selectedCell?.stepId === stepItem.id && selectedCell.objectId === item.id;
                      const summary = [visible ? 'Visible' : 'Oculto', emphasisLabel[emphasis], state?.label ? 'etiqueta' : '', state?.overlay?.visible ? 'overlay' : '', state?.interactive === false ? 'bloqueado' : 'interactivo'].filter(Boolean).join(', ');
                      return (
                        <td key={stepItem.id} className="border-t border-carbon/10 p-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCell({ stepId: stepItem.id, objectId: item.id });
                              if (stepItem.id !== activeStep?.id) onActiveStepChange(stepItem.id);
                            }}
                            aria-label={`${item.label} en ${stepItem.label}: ${summary}`}
                            aria-pressed={selected}
                            className={`w-full rounded border p-1.5 text-left ${matrixCellClass(selected, visible)}`}
                          >
                            <span className="block font-bold">{visible ? 'Visible' : 'Oculto'}</span>
                            <span className="block truncate text-[9px]">{emphasisSummary(emphasis)}</span>
                            <span className="block text-[9px]">{state?.overlay?.visible ? 'Panel' : ''}{state?.label ? ' · Etiqueta' : ''}{state?.interactive === false ? ' · Bloqueado' : ''}</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedCell && selectedStep && selectedObject && selectedState && (
            <fieldset className="sticky top-3 space-y-3 rounded border border-terracota/25 bg-terracota/5 p-3">
              <legend className="px-1 text-xs font-bold text-carbon">{selectedObject.label} · {selectedStep.label}</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex items-center gap-2 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedState.visible !== false} onChange={event => editState({ visible: event.target.checked }, 'Cambiar visibilidad del paso')} />Visible</label>
                <label className="flex items-center gap-2 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedState.interactive !== false} onChange={event => editState({ interactive: event.target.checked }, 'Cambiar interacción del paso')} />Interactivo</label>
                <label className="text-[10px] font-bold text-carbon/60">Resaltado en este paso
                  <select className="ml-2 rounded border border-carbon/15 bg-lienzo p-1 text-xs" value={selectedState.emphasis ?? 'none'} onChange={event => editState({ emphasis: event.target.value as DiagramStepObjectState['emphasis'] }, 'Cambiar resaltado del paso')}>
                    <option value="none">Sin resaltar</option><option value="primary">Resaltado fuerte</option><option value="secondary">Resaltado suave</option>
                  </select>
                </label>
              </div>
              {(selectedState.emphasis ?? 'none') !== 'none' && <label className="block text-[10px] font-bold text-carbon/60">Color del énfasis
                <select aria-label="Color del énfasis del paso" className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={selectedState.emphasisColor ?? ''} onChange={event => editState({ emphasisColor: (event.target.value || undefined) as DiagramStepObjectState['emphasisColor'] }, 'Cambiar color del énfasis')}>
                  <option value="">Conservar color original</option>
                  {COLOR_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <span className="mt-1 block text-[9px] font-normal leading-relaxed text-carbon/45">El resaltado fuerte usa mayor grosor; el suave conserva menor intensidad. Un enlace MDX activo sustituye ambos.</span>
              </label>}
              <label className="block text-[10px] font-bold text-carbon/60">Etiqueta temporal
                <input className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" placeholder={selectedObject.label} value={selectedState.label ?? ''} onChange={event => editState({ label: event.target.value || undefined }, 'Editar etiqueta temporal')} />
              </label>
              {'min' in selectedObject && (
                <label className="block text-[10px] font-bold text-carbon/60">Valor temporal del control
                  <input type="number" min={selectedObject.min} max={selectedObject.max} step={selectedObject.step} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={selectedState.value ?? selectedObject.value} onChange={event => editState({ value: Number(event.target.value) }, 'Editar valor temporal')} />
                </label>
              )}
              <div className="rounded border border-carbon/10 bg-lienzo p-2">
                <label className="flex items-center gap-2 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedState.overlay?.visible ?? false} onChange={event => editState({ overlay: { visible: event.target.checked, title: selectedState.overlay?.title ?? selectedObject.label, content: selectedState.overlay?.content ?? '{value}', expression: selectedState.overlay?.expression, unit: selectedState.overlay?.unit, precision: selectedState.overlay?.precision, position: selectedState.overlay?.position ?? 'bottom-right' } }, 'Cambiar overlay del paso')} />Mostrar panel informativo</label>
                {selectedState.overlay && (
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <label className="text-[10px] font-bold text-carbon/60">Título<input className="mt-1 w-full rounded border border-carbon/15 p-1.5 text-xs" value={selectedState.overlay.title} onChange={event => editState({ overlay: { ...selectedState.overlay!, title: event.target.value } }, 'Editar título del overlay')} /></label>
                    <label className="text-[10px] font-bold text-carbon/60">Posición<select className="mt-1 w-full rounded border border-carbon/15 p-1.5 text-xs" value={selectedState.overlay.position ?? 'bottom-right'} onChange={event => editState({ overlay: { ...selectedState.overlay!, position: event.target.value as NonNullable<DiagramStepObjectState['overlay']>['position'] } }, 'Mover overlay')}><option value="top-left">Arriba izquierda</option><option value="top-right">Arriba derecha</option><option value="bottom-left">Abajo izquierda</option><option value="bottom-right">Abajo derecha</option></select></label>
                    <label className="text-[10px] font-bold text-carbon/60">Contenido<input className="mt-1 w-full rounded border border-carbon/15 p-1.5 text-xs" value={selectedState.overlay.content} onChange={event => editState({ overlay: { ...selectedState.overlay!, content: event.target.value } }, 'Editar contenido del overlay')} /></label>
                    <div className="sm:col-span-2"><DiagramExpressionField model={model} label="Expresión reactiva del panel" value={selectedState.overlay.expression ?? ''} onChange={value => editState({ overlay: { ...selectedState.overlay!, expression: value || undefined } }, 'Editar expresión del overlay')} placeholder="segAB.length" optional help="El resultado sustituye a {value} en el contenido del panel durante este paso." /></div>
                  </div>
                )}
              </div>
            </fieldset>
          )}
          {!selectedCell && <aside className="sticky top-3 rounded border border-dashed border-carbon/20 bg-carbon/[0.02] p-4 text-center text-xs text-carbon/50">Seleccione una celda de la matriz para editar aquí su visibilidad, resaltado, interacción y panel informativo.</aside>}
          </div>
        </>
      )}
    </section>
  );
};

export default DiagramStepsEditor;
