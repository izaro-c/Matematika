import { objectKind } from '@/diagrams';
import { modelElements, modelPoints, modelSliders } from '../../model/scene/objectLists';
import React, { useState } from 'react';
import type { VisualDiagramModel, VisualStep } from '../../model/types';
import type { DiagramStepEmphasis } from '@/diagrams';
import { toggleInitialStep, duplicateStep, moveStep } from '../../model/elements/diagramElements';
import { syncStepObjectVisibility } from '../workbenchSelection';
import { DiagramStepObjectAppearanceEditor } from '../DiagramStepObjectAppearanceEditor';
import { IconPlus, IconTrash, IconCopy, IconChevronUp, IconChevronDown } from './WorkbenchIcons';
import { InspectorExpandableBlock } from '../inspector/InspectorExpandableBlock';
import { useI18n } from '@/i18n';
import { Button, Callout, Card, IconButton, controlClassName, inlineFieldClassName } from '@/fixed-pages/editor/ui/primitives';

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
  none: { label: 'editor.diagramToolbar.emphasisNormal', bg: 'bg-carbon/10 text-carbon/70', text: 'text-carbon/60' },
  primary: { label: 'editor.diagramToolbar.emphasisPrimary', bg: 'bg-canela text-lienzo', text: 'text-canela' },
  secondary: { label: 'editor.diagramToolbar.emphasisSecondary', bg: 'bg-terracota text-lienzo', text: 'text-terracota' },
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
  const { t } = useI18n();
  const [bulkObjectId, setBulkObjectId] = useState('');

  if (!model) return null;

  const steps = model.steps || [];
  const allObjects = [
    ...modelPoints(model).map(p => ({ id: p.id, label: p.label || p.id, type: 'Punto' })),
    ...modelElements(model).map(e => ({ id: e.id, label: e.label || e.id, type: String(objectKind(e)) })),
    ...modelSliders(model).map(s => ({ id: s.id, label: s.label || s.id, type: 'Deslizador' })),
  ];
  const effectiveBulkId = bulkObjectId && allObjects.some(o => o.id === bulkObjectId)
    ? bulkObjectId
    : (allObjects[0]?.id || '');
  const selectedObjectId = selectedIds[0] ?? '';
  const selectedObject = modelPoints(model).find(point => point.id === selectedObjectId)
    ?? modelElements(model).find(element => element.id === selectedObjectId)
    ?? modelSliders(model).find(slider => slider.id === selectedObjectId);

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
          <h3 className="font-bold text-sm text-carbon">{t('editor.diagramToolbar.proofSteps')}</h3>
          <p className="text-[11px] text-carbon/50 italic">{t('editor.diagramToolbar.interactiveStepByStep')}</p>
        </div>
        <Button size="sm" variant="primary" onClick={onAddStep}>
          <IconPlus className="w-3.5 h-3.5" />
          <span>{t('editor.diagramToolbar.addStep')}</span>
        </Button>
      </div>

      {/* Acción Masiva */}
      <InspectorExpandableBlock title={t('editor.diagramToolbar.bulkActionVisibility')} defaultOpen={false}>
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-carbon/70 uppercase tracking-wider">
            {t('editor.diagramToolbar.bulkTargetAria')}
          </label>
          <div className="flex items-center space-x-1.5">
            <select
              value={effectiveBulkId}
              onChange={e => setBulkObjectId(e.target.value)}
              className={`${controlClassName} flex-1`}
            >
              {allObjects.map(obj => (
                <option key={obj.id} value={obj.id}>
                  {obj.label} ({obj.id})
                </option>
              ))}
            </select>
            <Button size="sm" variant="primary" onClick={() => {
                if (effectiveBulkId) onToggleObjectInAllSteps(effectiveBulkId, true);
              }} title={t('editor.diagramToolbar.showInAllSteps')}>
              {t('editor.diagramToolbar.show')}
            </Button>
            <Button size="sm" variant="danger" onClick={() => {
                if (effectiveBulkId) onToggleObjectInAllSteps(effectiveBulkId, false);
              }} title={t('editor.diagramToolbar.hideInAllSteps')}>
              {t('editor.diagramToolbar.hide')}
            </Button>
          </div>
        </div>
      </InspectorExpandableBlock>

      {steps.length === 0 ? (
        <Card dashed className="text-center">
          <p className="italic">{t('editor.diagramToolbar.noSteps')}</p>
          <Button size="sm" variant="quiet" className="mt-2" onClick={onAddStep}>
            {t('editor.diagramToolbar.createTheFirstStep')}
          </Button>
        </Card>
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
                      className={`${inlineFieldClassName} font-bold text-xs hover:border-carbon/20 focus:border-canela focus:outline-none px-1 py-0.5 text-carbon truncate`}
                      placeholder={t('editor.diagramToolbar.stepN', { n: idx + 1 })}
                    />
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <IconButton size="sm" label={t('editor.diagramToolbar.moveStepUp')} onClick={() => handleMoveStep(st.id, -1)} disabled={idx === 0}>
                      <IconChevronUp className="w-3.5 h-3.5" />
                    </IconButton>
                    <IconButton size="sm" label={t('editor.diagramToolbar.moveStepDown')} onClick={() => handleMoveStep(st.id, 1)} disabled={idx === steps.length - 1}>
                      <IconChevronDown className="w-3.5 h-3.5" />
                    </IconButton>
                    <IconButton size="sm" label={t('editor.diagramToolbar.duplicateStep')} onClick={() => handleDuplicateStep(st.id)}>
                      <IconCopy className="w-3.5 h-3.5" />
                    </IconButton>

                    <Button size="sm" aria-pressed={isInitial} onClick={() => handleToggleInitialStep(st.id)} title={t('editor.diagramToolbar.initialStepTitle')}>
                      {isInitial ? t('editor.diagramToolbar.initial') : t('editor.diagramToolbar.makeInitial')}
                    </Button>

                    <Button size="sm" aria-pressed={isActive} onClick={() => onSelectStepIndex(isActive ? null : idx)}>
                      {isActive ? t('editor.diagramToolbar.viewing') : t('editor.diagramToolbar.view')}
                    </Button>

                    <IconButton size="sm" tone="danger" label={t('editor.diagramToolbar.deleteStep')} onClick={() => onDeleteStep(idx)}>
                      <IconTrash className="w-3.5 h-3.5" />
                    </IconButton>
                  </div>
                </div>

                <textarea
                  value={st.description || ''}
                  onChange={(e) => onUpdateStep(idx, { description: e.target.value })}
                  className={`${controlClassName} mb-2`}
                  rows={2}
                  placeholder={t('editor.diagramToolbar.stepDescriptionPlaceholder')}
                />

                <Card className="flex items-center justify-between gap-2 mb-2">
                  <label className="text-[10px] font-bold text-carbon/70 uppercase tracking-wider">
                    {t('editor.diagramToolbar.transitionMs')}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={st.durationMs ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? undefined : Number(e.target.value);
                        onUpdateStep(idx, { durationMs: val });
                      }}
                      placeholder="1800"
                      className={`${controlClassName} w-20`}
                    />
                    <span className="text-[10px] text-carbon/40 font-mono">{'ms'}</span>
                  </div>
                </Card>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                    <label className="block text-[10px] font-bold text-carbon/60 uppercase tracking-wider">
                      {t('editor.diagramToolbar.visibleObjectsEmphasis', { count: st.visibleTargets?.length || 0 })}
                    </label>
                    <div className="flex flex-wrap items-center gap-1">
                      {onTogglePickingStepIndex && (
                        <Button size="sm" aria-pressed={pickingStepIndex === idx} onClick={() => onTogglePickingStepIndex(pickingStepIndex === idx ? null : idx)} title={t('editor.diagramToolbar.pickVisibilityHint')}>
                          {pickingStepIndex === idx ? t('editor.diagramToolbar.selectingOnTheCanvas') : t('editor.diagramToolbar.selectOnTheCanvas')}
                        </Button>
                      )}
                      {selectedIds.length > 0 && (
                        <>
                          <Button size="sm" onClick={() => {
                              let nextStep = st;
                              selectedIds.forEach(id => {
                                nextStep = syncStepObjectVisibility(nextStep, id, true);
                              });
                              onUpdateStep(idx, nextStep);
                            }} title={t('editor.diagramToolbar.showSelectedInStepTitle')}>
                            {t('editor.diagramToolbar.showSelected', { count: selectedIds.length })}
                          </Button>
                          <Button size="sm" onClick={() => {
                              let nextStep = st;
                              selectedIds.forEach(id => {
                                nextStep = syncStepObjectVisibility(nextStep, id, false);
                              });
                              onUpdateStep(idx, nextStep);
                            }} title={t('editor.diagramToolbar.hideSelectedInStepTitle')}>
                            {t('editor.diagramToolbar.hideSelected', { count: selectedIds.length })}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <Card className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
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
                          <Button size="sm" variant="quiet" className="font-mono" aria-pressed={isVisible} onClick={() => {
                              const isVis = (st.visibleTargets || []).includes(obj.id);
                              onUpdateStep(idx, syncStepObjectVisibility(st, obj.id, !isVis));
                              onSelectObjects?.([obj.id]);
                            }}>
                            {obj.label}
                          </Button>

                          {isVisible && (
                            <Button size="sm" variant="quiet" onClick={() => handleCycleEmphasis(idx, obj.id)} className={empInfo.bg} title={t('editor.diagramToolbar.changeEmphasis', { label: t(empInfo.label) })}>
                              {t(empInfo.label)}
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </Card>
                </div>

                {modelSliders(model).length > 0 && (
                  <Card className="mt-2 space-y-1.5">
                    <label className="block text-[10px] font-bold text-carbon/60 uppercase tracking-wider">
                      {t('editor.diagramToolbar.stepSliderValues')}
                    </label>
                    <div className="space-y-1.5">
                      {modelSliders(model).map(sl => {
                        const stepVal = st.objectStates?.[sl.id]?.value;
                        const isOverridden = stepVal !== undefined;
                        return (
                          <div key={sl.id} className="flex items-center justify-between gap-2 text-[11px]">
                            <span className="font-mono text-carbon truncate flex-1" title={sl.label || sl.id}>
                              {sl.label || sl.id}
                              <span className="text-[10px] text-carbon/40 ml-1">
                                ({sl.range.min}..{sl.range.max})
                              </span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={sl.range.min}
                                max={sl.range.max}
                                step={sl.range.step || 0.01}
                                value={stepVal ?? ''}
                                placeholder={String(sl.value)}
                                onChange={e => {
                                  const val = e.target.value === '' ? undefined : Number(e.target.value);
                                  onUpdateStep(idx, {
                                    objectStates: {
                                      ...(st.objectStates || {}),
                                      [sl.id]: {
                                        ...(st.objectStates?.[sl.id] || {}),
                                        value: val,
                                      },
                                    },
                                  });
                                }}
                                className={`${controlClassName} w-16 font-mono`}
                              />
                              {isOverridden && (
                                <IconButton size="sm" tone="danger" label={t('editor.diagramToolbar.resetToBaseValue')} onClick={() => {
                                    onUpdateStep(idx, {
                                      objectStates: {
                                        ...(st.objectStates || {}),
                                        [sl.id]: {
                                          ...(st.objectStates?.[sl.id] || {}),
                                          value: undefined,
                                        },
                                      },
                                    });
                                  }}>
                                  ×
                                </IconButton>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}
                {isActive && selectedObject && (
                  <Callout className="mt-2">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-canela">
                        {t('editor.diagramToolbar.appearanceOf', { name: selectedObject.label || selectedObject.id })}
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
                        {t('editor.diagramToolbar.interactive')}
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
                  </Callout>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
