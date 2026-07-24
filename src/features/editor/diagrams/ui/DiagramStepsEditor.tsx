import React, { useMemo, useState } from 'react';
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
} from '../model';
import { toggleInitialStep, reindexSteps } from '../model/diagramElements';
import { DiagramExpressionField } from './DiagramExpressionField';
import { DiagramStepObjectAppearanceEditor } from './DiagramStepObjectAppearanceEditor';
import { COLOR_OPTIONS } from '../model';
import { DiagramButton, DiagramField, DiagramPanel } from './primitives';
import {
  MATRIX_CELL_LABELS,
  matrixCellVisualState,
  nextMatrixCellState,
  type MatrixCellVisualState,
} from './stepMatrixUtils';
import { listSceneItemIdsInLayerVisualOrder } from '../model/sceneOrdering';
import { summarizeStepObjectState } from './stepObjectStateSummary';

type SceneItem = VisualDiagramModel['points'][number] | VisualDiagramModel['elements'][number] | VisualDiagramModel['sliders'][number];

interface DiagramStepsEditorProps {
  model: VisualDiagramModel;
  activeStepId: string;
  onActiveStepChange: (stepId: string) => void;
  onModelEdit: (model: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
  onSelectObject: (objectId: string) => void;
}

const MATRIX_CELL_ICONS: Record<MatrixCellVisualState, string> = {
  hidden: '○',
  visible: '●',
  'emphasis-secondary': '◐',
  'emphasis-primary': '◉',
};

const MATRIX_CELL_STYLES: Record<MatrixCellVisualState, string> = {
  hidden: 'border-dashed border-carbon/35 bg-carbon/[0.06] text-carbon/35',
  visible: 'border-musgo/70 bg-musgo/25 text-musgo',
  'emphasis-secondary': 'border-ocre/80 bg-ocre/28 text-ocre',
  'emphasis-primary': 'border-granada/85 bg-granada/32 text-granada',
};

function matrixCellClass(selected: boolean, visual: MatrixCellVisualState): string {
  const base = MATRIX_CELL_STYLES[visual];
  return selected ? `${base} ring-2 ring-terracota/55 ring-offset-1` : base;
}

export const DiagramStepsEditor: React.FC<DiagramStepsEditorProps> = ({
  model,
  activeStepId,
  onActiveStepChange,
  onModelEdit,
  onSelectObject,
}) => {
  const items = useMemo(() => {
    const byId = new Map<string, SceneItem>();
    [...model.points, ...model.elements, ...model.sliders].forEach(item => byId.set(item.id, item));
    return listSceneItemIdsInLayerVisualOrder(model)
      .map(id => byId.get(id))
      .filter((item): item is SceneItem => Boolean(item));
  }, [model]);
  const [selectedCell, setSelectedCell] = useState<{ stepId: string; objectId: string } | null>(null);
  const [objectQuery, setObjectQuery] = useState('');
  const activeStep = model.steps.find(item => item.id === activeStepId) ?? model.steps[0];
  const selectedStep = selectedCell ? model.steps.find(item => item.id === selectedCell.stepId) : undefined;
  const selectedObject = selectedCell ? items.find(item => item.id === selectedCell.objectId) : undefined;
  const selectedState = selectedStep && selectedObject
    ? selectedStep.objectStates?.[selectedObject.id] ?? { visible: selectedStep.visibleTargets.includes(selectedObject.id), emphasis: 'none' as const, interactive: true }
    : undefined;
  const normalizedQuery = objectQuery.trim().toLocaleLowerCase('es');
  const visibleItems = items.filter(item => !normalizedQuery || `${item.label} ${item.id}`.toLocaleLowerCase('es').includes(normalizedQuery));
  const matrixRows = useMemo(() => {
    const rows: Array<{ kind: 'layer'; layerId: string; label: string } | { kind: 'object'; item: SceneItem }> = [];
    let lastLayerId: string | null = null;
    visibleItems.forEach(item => {
      if (item.layerId !== lastLayerId) {
        const layer = model.layers.find(entry => entry.id === item.layerId);
        rows.push({ kind: 'layer', layerId: item.layerId, label: layer?.label ?? item.layerId });
        lastLayerId = item.layerId;
      }
      rows.push({ kind: 'object', item });
    });
    return rows;
  }, [visibleItems, model.layers]);

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
  const cycleCellState = (stepId: string, objectId: string) => {
    const stepItem = model.steps.find(item => item.id === stepId);
    const objectItem = items.find(item => item.id === objectId);
    if (!stepItem || !objectItem) return;
    const current = matrixCellVisualState(stepItem, objectId);
    const update = nextMatrixCellState(current);
    const nextVisual: MatrixCellVisualState = update.visible === false
      ? 'hidden'
      : update.emphasis === 'primary'
        ? 'emphasis-primary'
        : update.emphasis === 'secondary'
          ? 'emphasis-secondary'
          : 'visible';
    editSteps(
      updateStepObjectState(model.steps, stepId, objectId, update),
      `Cambiar ${objectItem.label} en ${stepItem.label} a ${MATRIX_CELL_LABELS[nextVisual]}`,
    );
  };

  const hasInitialStep = model.steps.some(s => s.id === 'initial');

  return (
    <section className="rounded border border-carbon/15 bg-lienzo p-3" aria-labelledby="diagram-steps-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id="diagram-steps-title" className="ac-label ac-label--md ac-label--strong">Línea temporal y comportamiento</h3>
          <p className="mt-1 text-[10px] text-carbon/55">Cada celda resume qué cambia. Selecciónela para editar todos sus detalles.</p>
        </div>
        <div className="flex items-center gap-2">
          {!hasInitialStep && (
            <DiagramButton
              variant="danger"
              className="border-terracota/30 bg-terracota/10 text-terracota hover:bg-terracota/20"
              onClick={addInitialStep}
              title="Añade un paso inicial con ID 'initial' para la figura del enunciado"
            >
              + Paso inicial ('initial')
            </DiagramButton>
          )}
          <DiagramButton variant="primary" className="bg-terracota hover:bg-terracota/90" onClick={addStep}>+ Crear paso</DiagramButton>
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
            editorMode
            className="mt-3"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2 rounded border border-carbon/10 bg-carbon/[0.02] p-2">
            <span className="text-[10px] font-bold text-carbon/55">Paso activo:</span>
            <DiagramButton variant="danger" className="!min-h-0 border-carbon/15 bg-lienzo px-2 py-1 text-[10px] text-carbon hover:bg-carbon/5" onClick={() => {
              if (!activeStep) return;
              const steps = items.reduce((result, item) => updateStepObjectState(result, activeStep.id, item.id, { visible: true }), model.steps);
              editSteps(steps, `Mostrar todo en ${activeStep.label}`);
            }}>Mostrar todos los objetos</DiagramButton>
            <DiagramButton variant="danger" className="!min-h-0 border-carbon/15 bg-lienzo px-2 py-1 text-[10px] text-carbon hover:bg-carbon/5" onClick={() => {
              if (!activeStep) return;
              const steps = items.reduce((result, item) => updateStepObjectState(result, activeStep.id, item.id, { visible: false }), model.steps);
              editSteps(steps, `Ocultar todo en ${activeStep.label}`);
            }}>Ocultar todos</DiagramButton>
            <span className="ml-auto text-[9px] text-carbon/45">Después puede ajustar excepciones en la matriz.</span>
          </div>

          <ol className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Edición de la línea temporal">
            {model.steps.map((item, index) => (
              <li key={item.id} className={`min-w-52 rounded border p-2 ${item.id === activeStep?.id ? 'border-terracota bg-terracota/5' : 'border-carbon/10'}`}>
                <button type="button" className="w-full text-left" onClick={() => onActiveStepChange(item.id)} aria-current={item.id === activeStep?.id ? 'step' : undefined}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="block text-xs font-bold text-carbon">{index + 1}. {item.label}</span>
                    {item.id === 'initial' && (
                      <span className="ac-editor-badge ac-editor-badge--terracota">Initial</span>
                    )}
                  </div>
                  <span className="mt-0.5 block truncate text-[10px] text-carbon/55">{item.description || 'Sin descripción'}</span>
                </button>
                <div className="mt-2 flex gap-1">
                  <DiagramButton variant="danger" aria-label={`Mover ${item.label} a la izquierda`} disabled={index === 0} className="!min-h-0 !min-w-0 border-carbon/15 px-2 text-sm disabled:opacity-30" onClick={() => editSteps(moveStep(model.steps, item.id, -1), `Reordenar ${item.label}`)}>←</DiagramButton>
                  <DiagramButton variant="danger" aria-label={`Mover ${item.label} a la derecha`} disabled={index === model.steps.length - 1} className="!min-h-0 !min-w-0 border-carbon/15 px-2 text-sm disabled:opacity-30" onClick={() => editSteps(moveStep(model.steps, item.id, 1), `Reordenar ${item.label}`)}>→</DiagramButton>
                  <DiagramButton variant="danger" className="!min-h-0 border-carbon/15 px-1.5 text-[10px]" onClick={() => editSteps(duplicateStep(model.steps, item.id), `Duplicar ${item.label}`)}>Duplicar</DiagramButton>
                  <DiagramButton
                    variant="danger"
                    className="!min-h-0 ml-auto border-granada/20 px-1.5 text-[10px] text-granada"
                    onClick={() => {
                      const remaining = removeStep(model.steps, item.id);
                      editSteps(remaining, `Eliminar ${item.label}`);
                      if (item.id === activeStep?.id) onActiveStepChange(remaining[Math.max(0, index - 1)]?.id ?? '');
                    }}
                    aria-label={`Eliminar ${item.label}`}
                  >Eliminar</DiagramButton>
                </div>
              </li>
            ))}
          </ol>

          {activeStep && (
            <DiagramPanel title="Datos del paso activo" className="mt-3 border-carbon/10 bg-carbon/[0.02]">
              <div className="grid gap-2 sm:grid-cols-[1.2fr_1.5fr_2fr_110px]">
                <div>
                  <p className="mb-1 text-[10px] font-bold text-carbon/60">Identificador del paso</p>
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-carbon/15 bg-carbon/5 px-2 py-1 font-mono text-xs font-bold text-carbon">
                      {activeStep.id}
                    </span>
                    {activeStep.id !== 'initial' ? (
                      <DiagramButton
                        variant="danger"
                        className="!min-h-0 border-terracota/30 bg-terracota/10 px-2 py-1 text-[10px] text-terracota hover:bg-terracota/20"
                        onClick={handleToggleInitial}
                        title="Establece este paso como la figura del enunciado (ID 'initial')"
                      >
                        Marcar como 'initial'
                      </DiagramButton>
                    ) : (
                      <DiagramButton
                        variant="danger"
                        className="!min-h-0 border-carbon/20 bg-lienzo px-2 py-1 text-[10px] text-carbon/60 hover:bg-carbon/5"
                        onClick={handleToggleInitial}
                        title="Convierte este paso a un paso numerado secuencial"
                      >
                        Convertir a numerado
                      </DiagramButton>
                    )}
                  </div>
                </div>
                <DiagramField label="Etiqueta">
                  <input value={activeStep.label} onChange={event => editSteps(updateStep(model, activeStep.id, { label: event.target.value }).steps, 'Editar etiqueta del paso')} />
                </DiagramField>
                <DiagramField label="Qué cambia">
                  <input value={activeStep.description} onChange={event => editSteps(updateStep(model, activeStep.id, { description: event.target.value }).steps, 'Editar descripción del paso')} />
                </DiagramField>
                <DiagramField label="Duración (ms)">
                  <input type="number" min="200" max="60000" step="100" value={activeStep.durationMs ?? 1800} onChange={event => editSteps(updateStep(model, activeStep.id, { durationMs: Number(event.target.value) }).steps, 'Editar duración del paso')} />
                </DiagramField>
              </div>
            </DiagramPanel>
          )}

          <div className="mt-4 grid items-start gap-3 2xl:grid-cols-[minmax(0,1fr)_min(18rem,30%)]">
          <div className="min-w-0 rounded border border-carbon/10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-carbon/10 bg-carbon/5 px-3 py-2">
              <p className="ac-label ac-label--sm">Matriz objetos × pasos</p>
              <div className="flex min-w-[12rem] flex-1 items-center gap-2">
                <DiagramField label="Buscar objetos en la secuencia" className="min-w-[10rem] flex-1">
                  <input type="search" aria-label="Buscar objetos en la secuencia" placeholder="Buscar por nombre o id…" className="text-[10px]" value={objectQuery} onChange={event => setObjectQuery(event.target.value)} />
                </DiagramField>
                {normalizedQuery ? (
                  <span className="shrink-0 text-[9px] text-carbon/45">{visibleItems.length}/{items.length}</span>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-[9px] text-carbon/55" aria-hidden>
                {(Object.entries(MATRIX_CELL_ICONS) as Array<[MatrixCellVisualState, string]>).map(([state, icon]) => (
                  <span key={state} className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 ${MATRIX_CELL_STYLES[state]}`}>
                    <span className="text-xs leading-none">{icon}</span>
                    {MATRIX_CELL_LABELS[state]}
                  </span>
                ))}
              </div>
            </div>
            <div className="max-h-[min(70vh,42rem)] overflow-auto">
            <table className="w-max min-w-full border-collapse text-[10px]" aria-label="Matriz objetos × pasos">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th scope="col" className="sticky left-0 z-30 min-w-36 border-b border-r border-carbon/10 bg-lienzo p-1.5 text-left ac-sticky-shadow-end">Objeto</th>
                  {model.steps.map((item, index) => (
                    <th
                      key={item.id}
                      scope="col"
                      className={`min-w-[4.25rem] border-b border-carbon/10 p-1 text-center ${item.id === activeStep?.id ? 'bg-terracota/10 text-carbon' : 'bg-lienzo text-carbon/70'}`}
                      title={`${index + 1}. ${item.label}`}
                    >
                      <span className="block text-[11px] font-bold leading-none">{index + 1}</span>
                      <span className="mt-0.5 block max-w-[5.5rem] truncate text-[8px] font-normal leading-tight">{item.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.length === 0 ? (
                  <tr>
                    <td colSpan={model.steps.length + 1} className="border-t border-carbon/10 p-4 text-center text-xs italic text-carbon/50">Ningún objeto coincide con la búsqueda.</td>
                  </tr>
                ) : matrixRows.map(row => row.kind === 'layer' ? (
                  <tr key={`layer-${row.layerId}`} className="bg-carbon/[0.03]">
                    <th scope="rowgroup" colSpan={model.steps.length + 1} className="sticky left-0 border-t border-carbon/10 px-2 py-1 text-left ac-label ac-label--xs ac-label--soft">{row.label}</th>
                  </tr>
                ) : (
                  <tr key={row.item.id}>
                    <th scope="row" className="sticky left-0 z-10 border-r border-t border-carbon/10 bg-lienzo p-1.5 text-left ac-sticky-shadow-end">
                      <button type="button" className="max-w-[9rem] truncate font-bold text-carbon hover:text-terracota" title={row.item.label} onClick={() => onSelectObject(row.item.id)}>{row.item.label}</button>
                      <span className="block truncate font-mono text-[8px] font-normal text-carbon/45">{row.item.id}</span>
                    </th>
                    {model.steps.map(stepItem => {
                      const visual = matrixCellVisualState(stepItem, row.item.id);
                      const state = stepItem.objectStates?.[row.item.id];
                      const selected = selectedCell?.stepId === stepItem.id && selectedCell.objectId === row.item.id;
                      const extras = summarizeStepObjectState(state).join(', ');
                      const summary = [MATRIX_CELL_LABELS[visual], extras].filter(Boolean).join(', ');
                      return (
                        <td key={stepItem.id} className={`border-t border-carbon/10 p-0.5 ${stepItem.id === activeStep?.id ? 'bg-terracota/[0.04]' : ''}`}>
                          <div className={`flex items-stretch rounded border ${matrixCellClass(selected, visual)}`}>
                            <button
                              type="button"
                              onClick={() => {
                                cycleCellState(stepItem.id, row.item.id);
                                if (stepItem.id !== activeStep?.id) onActiveStepChange(stepItem.id);
                              }}
                              aria-label={`Cambiar estado de ${row.item.label} en ${stepItem.label}: ${summary}`}
                              title={summary}
                              className="relative min-w-[2.25rem] flex-1 p-1 text-center"
                            >
                              <span className="text-base leading-none" aria-hidden>{MATRIX_CELL_ICONS[visual]}</span>
                              {extras ? <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-carbon/35" aria-hidden /> : null}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCell({ stepId: stepItem.id, objectId: row.item.id });
                                if (stepItem.id !== activeStep?.id) onActiveStepChange(stepItem.id);
                              }}
                              aria-label={`Editar detalles de ${row.item.label} en ${stepItem.label}`}
                              aria-pressed={selected}
                              className="shrink-0 border-l border-inherit px-1 text-[10px] leading-none text-carbon/50 hover:bg-carbon/5 hover:text-carbon"
                              title="Editar etiqueta, panel y más opciones"
                            >
                              ⋯
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>

          {selectedCell && selectedStep && selectedObject && selectedState && (
            <DiagramPanel title={`${selectedObject.label} · ${selectedStep.label}`} className="sticky top-3 border-terracota/25 bg-terracota/5">
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex items-center gap-2 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedState.visible !== false} onChange={event => editState({ visible: event.target.checked }, 'Cambiar visibilidad del paso')} />Visible</label>
                <label className="flex items-center gap-2 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedState.interactive !== false} onChange={event => editState({ interactive: event.target.checked }, 'Cambiar interacción del paso')} />Interactivo</label>
                <DiagramField label="Resaltado en este paso">
                  <select value={selectedState.emphasis ?? 'none'} onChange={event => editState({ emphasis: event.target.value as DiagramStepObjectState['emphasis'] }, 'Cambiar resaltado del paso')}>
                    <option value="none">Sin resaltar</option><option value="primary">Resaltado fuerte</option><option value="secondary">Resaltado suave</option>
                  </select>
                </DiagramField>
              </div>
              {(selectedState.emphasis ?? 'none') !== 'none' && (
                <span className="block text-[9px] font-normal leading-relaxed text-carbon/45">El resaltado fuerte pulsa grosor, relleno, radio (ángulos), tamaño (puntos y marcas) y tipografía (anotaciones). El suave adopta el grosor de resaltado definido en el inspector, igual que al pasar el cursor. Un enlace MDX activo sustituye ambos.</span>
              )}
              <DiagramField label="Color temporal del resaltado">
                <select aria-label="Color temporal del resaltado" value={selectedState.emphasisColor ?? ''} onChange={event => editState({ emphasisColor: (event.target.value || undefined) as DiagramStepObjectState['emphasisColor'] }, 'Cambiar color temporal')}>
                  <option value="">Conservar color original</option>
                  {COLOR_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </DiagramField>
              {'min' in selectedObject ? null : (
                <DiagramStepObjectAppearanceEditor
                  object={selectedObject}
                  state={selectedState}
                  onStateChange={(update, label) => editState(update, label)}
                />
              )}
              {'min' in selectedObject && (
                <DiagramField label="Valor temporal del control">
                  <input type="number" min={selectedObject.min} max={selectedObject.max} step={selectedObject.step} value={selectedState.value ?? selectedObject.value} onChange={event => editState({ value: Number(event.target.value) }, 'Editar valor temporal')} />
                </DiagramField>
              )}
              <div className="rounded border border-carbon/10 bg-lienzo p-2">
                <label className="flex items-center gap-2 text-xs font-bold text-carbon"><input type="checkbox" checked={selectedState.overlay?.visible ?? false} onChange={event => editState({ overlay: { visible: event.target.checked, title: selectedState.overlay?.title ?? selectedObject.label, content: selectedState.overlay?.content ?? '{value}', expression: selectedState.overlay?.expression, unit: selectedState.overlay?.unit, precision: selectedState.overlay?.precision, position: selectedState.overlay?.position ?? 'bottom-right' } }, 'Cambiar overlay del paso')} />Mostrar panel informativo</label>
                {selectedState.overlay && (
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <DiagramField label="Título"><input value={selectedState.overlay.title} onChange={event => editState({ overlay: { ...selectedState.overlay!, title: event.target.value } }, 'Editar título del overlay')} /></DiagramField>
                    <DiagramField label="Posición"><select value={selectedState.overlay.position ?? 'bottom-right'} onChange={event => editState({ overlay: { ...selectedState.overlay!, position: event.target.value as NonNullable<DiagramStepObjectState['overlay']>['position'] } }, 'Mover overlay')}><option value="top-left">Arriba izquierda</option><option value="top-right">Arriba derecha</option><option value="bottom-left">Abajo izquierda</option><option value="bottom-right">Abajo derecha</option></select></DiagramField>
                    <DiagramField label="Contenido"><input value={selectedState.overlay.content} onChange={event => editState({ overlay: { ...selectedState.overlay!, content: event.target.value } }, 'Editar contenido del overlay')} /></DiagramField>
                    <div className="sm:col-span-2"><DiagramExpressionField model={model} label="Expresión reactiva del panel" value={selectedState.overlay.expression ?? ''} onChange={value => editState({ overlay: { ...selectedState.overlay!, expression: value || undefined } }, 'Editar expresión del overlay')} placeholder="segAB.length" optional help="El resultado sustituye a {value} en el contenido del panel durante este paso." /></div>
                  </div>
                )}
              </div>
            </DiagramPanel>
          )}
          {!selectedCell && <aside className="sticky top-3 rounded border border-dashed border-carbon/20 bg-carbon/[0.02] p-4 text-center text-xs text-carbon/50">Seleccione una celda de la matriz para editar aquí su visibilidad, resaltado, etiqueta, color, estilo y panel informativo.</aside>}
          </div>
        </>
      )}
    </section>
  );
};

export default DiagramStepsEditor;
