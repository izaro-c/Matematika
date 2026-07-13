import React, { useEffect, useMemo, useState } from 'react';
import type { EditorDiagramReference } from '../../core/editorTypes';
import type { ConstructionKind, ElementKind, VisualDiagramModel } from '../../diagrams/model/types';
import { useDiagramState } from '../../diagrams/hooks/useDiagramState';
import { buildTargets, getDiagramSaveCapability } from '../../diagrams/model/selectors';
import { DiagramCanvas } from '../../diagrams/ui/DiagramCanvas';
import { DiagramToolbar } from '../../diagrams/ui/DiagramToolbar';
import { DiagramInspector } from '../../diagrams/ui/DiagramInspector';
import { DiagramStatusBar } from '../../diagrams/ui/DiagramStatusBar';
import { DiagramReferencesPanel } from '../../diagrams/ui/DiagramReferencesPanel';
import { DiagramCodePanel } from '../../diagrams/ui/DiagramCodePanel';
import { DiagramValidationPanel } from '../../diagrams/ui/DiagramValidationPanel';
import { DiagramStepsEditor } from '../../diagrams/ui/DiagramStepsEditor';
import { DiagramTargetSelector } from '../../diagrams/ui/DiagramTargetSelector';
import { generateDiagramSource } from '../../diagrams/source/generator';
import {
  CONSTRUCTION_OPTIONS, KIND_LABELS, refsNeededForTool,
  point, element, slider, step, projectPointToSupport,
  generatedElementId, elementColorForKind,
  supportElements, applyGuidedConstruction,
  normalizeConstructionRefs, validConstructionRefs,
  normalizeVisualModel, createTemplateModel, nextStepId
} from '../../diagrams/model/commands';

export type DiagramWorkbenchMode =
  | { kind: 'file'; path: string }
  | { kind: 'inline'; source: string; componentName?: string; model?: Record<string, unknown> | null }
  | { kind: 'new'; componentName: string };

interface DiagramWorkbenchCoreProps {
  isOpen: boolean;
  mode: DiagramWorkbenchMode;
  metadataType: string;
  onClose: () => void;
  onConfirm: (spec: EditorDiagramReference) => void;
}

type DiagramWorkbenchAdapterProps = Omit<DiagramWorkbenchCoreProps, 'mode'>;

function componentNameFromPath(path: string | null): string {
  const base = (path?.split('/').pop() || 'DiagramaInteractivo').replace(/\.tsx$/, '');
  const cleaned = base.replace(/\W/g, '');
  return cleaned || 'DiagramaInteractivo';
}

function componentNameFromSource(source: string | undefined, fallback: string): string {
  const match = source?.match(/export\s+const\s+([A-Z]\w*)\b/);
  return match?.[1] || fallback;
}

function refsForElementKind(kind: ElementKind, refs: string[]): string[] {
  if (kind === 'polygon') return refs;
  if (kind === 'segment' || kind === 'line' || kind === 'ray' || kind === 'circle' || kind === 'midpoint' || kind === 'congruenceMark' || kind === 'dimensionLine') {
    return refs.slice(0, 2);
  }
  if (kind === 'arc' || kind === 'perpendicularFoot' || kind === 'baseExtension' || kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'angle' || kind === 'rightAngle' || kind === 'perpendicularMark') {
    return refs.slice(0, 3);
  }
  if (kind === 'areaDecomposition') return refs.slice(0, 4);
  if (kind === 'poincareGeodesic' || kind === 'poincareArc' || kind === 'grid') return refs.slice(0, 4);
  if (kind === 'functionCurve' || kind === 'parametricCurve') return [];
  return refs.slice(0, 1);
}

export const DiagramWorkbenchCore: React.FC<DiagramWorkbenchCoreProps> = ({
  isOpen,
  mode,
  metadataType,
  onClose,
  onConfirm,
}) => {
  const {
    state,
    isDirty,
    loadDiagram,
    loadInlineDiagram,
    loadNewDiagram,
    handleVisualEdit,
    handleSourceEdit,
    undo,
    redo,
    selectElement,
    setCanvasTool,
    setActiveStep,
    resolveDivergence,
    saveDiagram,
  } = useDiagramState();

  const [tab, setTab] = useState<'visual' | 'source'>('visual');

  // Local UI states
  const [previewHighlightId, setPreviewHighlightId] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');

  // Guided constructions
  const [constructionKind, setConstructionKind] = useState<ConstructionKind>('mediatriz');
  const [constructionRefs, setConstructionRefs] = useState<Record<string, string>>({ a: '', b: '', c: '' });

  // Tool references selection
  const [pendingRefs, setPendingRefs] = useState<string[]>([]);
  const isFileMode = mode.kind === 'file';
  const inlineModel = useMemo(() => (
    mode.kind === 'inline'
      ? normalizeVisualModel(mode.model, metadataType)
      : null
  ), [mode, metadataType]);
  const newModel = useMemo(() => (
    mode.kind === 'new' && isOpen
      ? createTemplateModel('circunferencia', 'Diagrama interactivo', metadataType)
      : null
  ), [mode.kind, isOpen, metadataType]);

  const choosePointForTool = (pointId: string) => {
    const canvasTool = state.canvasTool;
    if (canvasTool === 'select' || canvasTool === 'point') return false;
    const needed = refsNeededForTool(canvasTool);
    if (needed === 0) return false;
    const nextRefs = [...pendingRefs, pointId].slice(0, needed);
    if (nextRefs.length === needed) {
      handleAddElement(canvasTool as ElementKind, nextRefs);
      setPendingRefs([]);
    } else {
      setPendingRefs(nextRefs);
      selectElement(pointId);
    }
    return true;
  };

  // Load or initialize diagram when it opens
  useEffect(() => {
    if (!isOpen) return;

    if (mode.kind === 'file') {
      void loadDiagram(mode.path, componentNameFromPath(mode.path));
      return;
    }

    if (mode.kind === 'inline') {
      const fallbackName = mode.componentName || componentNameFromPath(null);
      const componentName = mode.componentName || componentNameFromSource(mode.source, fallbackName);
      loadInlineDiagram(mode.source, componentName, inlineModel);
      return;
    }

    if (newModel) {
      loadNewDiagram(mode.componentName, newModel);
    }
  }, [isOpen, mode, inlineModel, newModel, loadDiagram, loadInlineDiagram, loadNewDiagram]);

  if (!isOpen) return null;

  const model: VisualDiagramModel | null = state.currentModel;
  const componentName = state.componentName || 'DiagramaInteractivo';
  const saveCapability = getDiagramSaveCapability(state);

  const saveCodeOnlyDiagram = () => {
    if (isFileMode) void saveDiagram();
  };

  if (!model) {
    if (state.currentSource || state.diagnostics.length > 0) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col bg-lienzo text-carbon font-sans">
          <header className="flex items-center justify-between border-b border-carbon/15 px-4 py-3 bg-carbon/5">
            <div>
              <h2 className="text-sm font-bold text-carbon">Editor de diagramas: código TSX</h2>
              <p className="text-[11px] text-carbon/55 font-mono">{state.filePath}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded border border-carbon/20 px-3 py-1 text-xs font-bold text-carbon/75 hover:bg-carbon/5 transition-all"
            >
              Cerrar
            </button>
          </header>
          <DiagramCodePanel
            source={state.currentSource}
            sourceTouched={isDirty}
            filePath={state.filePath}
            componentName={componentName}
            onSourceChange={handleSourceEdit}
          />
          <DiagramValidationPanel
            diagnostics={state.diagnostics}
            targets={[]}
            selectedTargetId=""
            onSelectTarget={() => {}}
          />
          <DiagramStatusBar
            status={state.status}
            isDirty={isDirty}
            saveCapability={isFileMode ? saveCapability : undefined}
            onSave={saveCodeOnlyDiagram}
          />
        </div>
      );
    }
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/40 backdrop-blur-sm">
        <div className="rounded bg-lienzo p-6 shadow-xl max-w-sm w-full text-center">
          <p className="text-sm font-bold text-carbon">Cargando el editor de diagramas…</p>
        </div>
      </div>
    );
  }

  const handleSaveAndConfirm = async () => {
    if (isFileMode) {
      const ok = await saveDiagram();
      if (!ok) return;
    } else if (state.status === 'invalid-source' || state.status === 'diverged' || state.status === 'conflict' || state.diagnostics.some(d => d.severity === 'error')) {
      return;
    }
    onConfirm({
      componentName,
      category: model.category,
      path: isFileMode && mode.kind === 'file' ? mode.path : '',
      importPath: isFileMode && mode.kind === 'file' ? mode.path : '',
      source: state.currentSource,
      targets: buildTargets(model),
      mode: model.mode,
      visualModel: model as unknown as Record<string, unknown>,
    });
    onClose();
  };

  // Quick action handlers
  const handleAddPoint = () => {
    const id = `p${model.points.length + 1}`;
    const newPoint = point(id, id.replace(/^p/, ''), 0, 0);
    handleVisualEdit({
      ...model,
      points: [...model.points, newPoint],
    });
    selectElement(id);
  };

  const handleAddSlider = () => {
    const id = `slider${model.sliders.length + 1}`;
    const newSlider = slider(id, `Control ${model.sliders.length + 1}`, -4, -4 + model.sliders.length * 0.45, 1);
    handleVisualEdit({
      ...model,
      sliders: [...model.sliders, newSlider],
    });
    selectElement(id);
  };

  const handleAddStep = () => {
    const id = nextStepId(model.steps);
    const visibleTargets = [
      ...model.points.map(item => item.id),
      ...model.elements.map(item => item.id),
      ...model.sliders.map(item => item.id),
    ];
    const newStep = step(id, `Paso ${model.steps.length + 1}`, 'Describa qué construcción se ve.', visibleTargets);
    handleVisualEdit({
      ...model,
      steps: [...model.steps, newStep],
    });
    selectElement(id);
    setActiveStep(id);
  };

  const handleAddElement = (kind: ElementKind, explicitRefs?: string[]) => {
    const refs = explicitRefs || model.points.map(item => item.id);
    const elementRefs = refsForElementKind(kind, refs);

    const id = generatedElementId(kind, elementRefs, model.elements);
    const properties = kind === 'functionCurve'
      ? { expression: 'sin(x)', parameter: 'x', domain: [-5, 5] as [number, number], samples: 128 }
      : kind === 'parametricCurve'
        ? { xExpression: '3*cos(t)', yExpression: '2*sin(t)', parameter: 't', domain: [0, 6.283185307179586] as [number, number], samples: 128 }
        : kind === 'congruenceMark'
          ? { markCount: 1 }
          : kind === 'grid' || kind === 'areaDecomposition'
            ? { rows: 4, columns: 4 }
            : kind === 'dimensionLine' || kind === 'measurement'
              ? { precision: 2 }
              : undefined;
    const newElement = element(id, KIND_LABELS[kind], kind, elementRefs, elementColorForKind(kind), true, properties ? { properties } : {});
    handleVisualEdit({
      ...model,
      elements: [...model.elements, newElement],
      dependencies: [
        ...(model.dependencies || []),
        ...elementRefs.map(sourceId => ({ sourceId, targetId: id, relation: 'construction' as const })),
      ],
    });
    selectElement(id);
  };

  const handleAddGliderPoint = () => {
    const support = supportElements(model)[0];
    if (!support) return;
    const id = `p${model.points.length + 1}`;
    const initial = { x: 0, y: 0 };
    const nextPoint = point(id, id.replace(/^p/, ''), initial.x, initial.y, false, 'ocre', 'glider', support.id);
    const projected = projectPointToSupport(model, nextPoint, initial);
    handleVisualEdit({
      ...model,
      points: [...model.points, { ...nextPoint, ...projected }],
    });
    selectElement(id);
  };

  const handleDeleteSelected = () => {
    const selectedId = state.selectedId;
    if (!selectedId) return;

    handleVisualEdit({
      ...model,
      points: model.points.filter(item => item.id !== selectedId),
      elements: model.elements.filter(item => item.id !== selectedId && !item.refs.includes(selectedId)),
      sliders: model.sliders.filter(item => item.id !== selectedId),
      steps: model.steps.filter(item => item.id !== selectedId).map(item => ({
        ...item,
        visibleTargets: item.visibleTargets.filter(t => t !== selectedId),
        objectStates: item.objectStates
          ? Object.fromEntries(Object.entries(item.objectStates).filter(([id]) => id !== selectedId))
          : undefined,
      })),
      groups: model.groups.map(group => ({ ...group, memberIds: group.memberIds.filter(id => id !== selectedId) })),
      constraints: model.constraints?.filter(constraint => constraint.id !== selectedId && !constraint.refs.includes(selectedId)),
      dependencies: model.dependencies?.filter(dependency => dependency.sourceId !== selectedId && dependency.targetId !== selectedId && dependency.constraintId !== selectedId),
    });
    selectElement('');
  };

  const selectedConstruction = CONSTRUCTION_OPTIONS.find(c => c.value === constructionKind) || CONSTRUCTION_OPTIONS[0];
  const normalizedRefs = normalizeConstructionRefs(model.points, constructionRefs);
  const constructionReady = validConstructionRefs(constructionKind, normalizedRefs);

  const handleCreateGuidedConstruction = () => {
    if (!constructionReady) return;
    const result = applyGuidedConstruction(model, constructionKind, normalizedRefs);
    handleVisualEdit(result.model);
    selectElement(result.selectedId);
    setCanvasTool('select');
  };

  const mdxTargets = buildTargets(model);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-lienzo text-carbon font-sans">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-carbon/15 px-4 py-3 bg-carbon/5">
        <div>
          <h2 className="text-sm font-bold text-carbon">Editor visual exacto: {model.title}</h2>
          <p className="text-[11px] text-carbon/55 font-mono">{state.filePath}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded border border-carbon/15 p-0.5 bg-lienzo" aria-label="Historial de comandos">
            <button
              type="button"
              onClick={undo}
              disabled={state.modelHistory.past.length === 0}
              className="rounded px-2 py-1 text-xs font-bold text-carbon/70 hover:bg-carbon/5 disabled:opacity-35"
              aria-label="Deshacer"
              title={state.modelHistory.past[state.modelHistory.past.length - 1]?.label ?? 'Nada que deshacer'}
            >
              ↶
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={state.modelHistory.future.length === 0}
              className="rounded px-2 py-1 text-xs font-bold text-carbon/70 hover:bg-carbon/5 disabled:opacity-35"
              aria-label="Rehacer"
              title={state.modelHistory.future[0]?.label ?? 'Nada que rehacer'}
            >
              ↷
            </button>
          </div>
          <div className="flex rounded border border-carbon/15 p-0.5 bg-lienzo">
            <button
              onClick={() => setTab('visual')}
              className={`rounded px-3 py-1 text-xs font-bold transition-all ${tab === 'visual' ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:bg-carbon/5'}`}
            >
              Modelo visual
            </button>
            <button
              onClick={() => setTab('source')}
              className={`rounded px-3 py-1 text-xs font-bold transition-all ${tab === 'source' ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:bg-carbon/5'}`}
            >
              Código TSX
            </button>
          </div>
          <button
            onClick={onClose}
            className="rounded border border-carbon/20 px-3 py-1 text-xs font-bold text-carbon/75 hover:bg-carbon/5 transition-all"
          >
            Cerrar
          </button>
        </div>
      </header>

      {tab === 'visual' ? (
        <div className="grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)_320px] overflow-hidden">
          {/* Left panel: tools & quick actions */}
          <aside className="border-r border-carbon/15 bg-carbon/5 p-4 space-y-4 overflow-y-auto">
            {/* Quick Actions */}
            <div className="rounded border border-carbon/10 bg-lienzo p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-2">Añadir rápido</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button onClick={handleAddPoint} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5">Punto</button>
                <button onClick={() => handleAddElement('segment')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Segmento</button>
                <button onClick={() => handleAddElement('line')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Recta</button>
                <button onClick={() => handleAddElement('circle')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Circunferencia</button>
                <button onClick={() => handleAddElement('polygon')} disabled={model.points.length < 3} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Polígono</button>
                <button onClick={handleAddGliderPoint} disabled={supportElements(model).length < 1} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Punto sobre objeto</button>
                <button onClick={handleAddSlider} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5">Control</button>
                <button onClick={handleAddStep} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5">Paso</button>
              </div>
            </div>

            {/* Guided Constructions */}
            <div className="rounded border border-pavo/20 bg-pavo/5 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-2">Construcciones guiadas</p>
              <select
                className="w-full rounded border border-carbon/15 bg-lienzo p-2 text-xs mb-2"
                value={constructionKind}
                onChange={(e) => setConstructionKind(e.target.value as ConstructionKind)}
              >
                {CONSTRUCTION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-[10px] italic text-carbon/55 mb-3">{selectedConstruction.description}</p>

              <div className="space-y-2">
                {selectedConstruction.slots.map((slot) => (
                  <div key={slot.key} className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-carbon/60">{slot.label}</span>
                    <select
                      className="rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                      value={normalizedRefs[slot.key] || ''}
                      onChange={(e) => setConstructionRefs(prev => ({ ...prev, [slot.key]: e.target.value }))}
                    >
                      <option value="">Seleccionar punto</option>
                      {model.points.map(pt => (
                        <option key={pt.id} value={pt.id}>Punto {pt.label} ({pt.id})</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCreateGuidedConstruction}
                disabled={!constructionReady}
                className="mt-4 w-full rounded bg-pavo text-lienzo py-2 text-xs font-bold hover:bg-pavo/90 disabled:opacity-40 transition-all cursor-pointer"
              >
                Crear {selectedConstruction.label}
              </button>
            </div>

            {/* Preview controls */}
            <div className="rounded border border-carbon/10 bg-lienzo p-3 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-2">Estado de la vista previa</p>
              <div>
                <label className="block text-[10px] font-bold text-carbon mb-1">Elemento resaltado</label>
                <select
                  className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={previewHighlightId}
                  onChange={(e) => setPreviewHighlightId(e.target.value)}
                >
                  <option value="">Ninguno</option>
                  {mdxTargets.map(t => (
                    <option key={t.id} value={t.id}>{t.label} ({t.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-carbon mb-1">Paso Activo</label>
                <select
                  className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={state.activeStepId}
                  onChange={(e) => setActiveStep(e.target.value)}
                >
                  <option value="">Mostrar todo</option>
                  {model.steps.map(s => (
                    <option key={s.id} value={s.id}>{s.label} ({s.id})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bounding box settings */}
            <div className="rounded border border-carbon/10 bg-lienzo p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-2">Límites del plano</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['Min X', 'Max Y', 'Max X', 'Min Y'] as const).map((label, idx) => (
                  <div key={label}>
                    <label className="block text-[10px] font-bold text-carbon/60 mb-0.5">{label}</label>
                    <input
                      type="number"
                      step="0.5"
                      className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs font-mono"
                      value={model.viewport.bounds[idx]}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (Number.isFinite(val)) {
                          const nextBox = [...model.viewport.bounds] as [number, number, number, number];
                          nextBox[idx] = val;
                          handleVisualEdit({ ...model, viewport: { ...model.viewport, bounds: nextBox } }, { label: 'Editar límites del viewport', mergeKey: 'viewport-input' });
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 w-full rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold text-carbon"
                onClick={() => {
                  const index = model.layers.length + 1;
                  handleVisualEdit({ ...model, layers: [...model.layers, { id: `layer${index}`, label: `Capa ${index}`, order: index, visible: true, locked: false }] }, { label: 'Añadir capa' });
                }}
              >
                + Capa
              </button>
            </div>

            <div className="rounded border border-carbon/10 bg-lienzo p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-2">Grupos de objetos</p>
              <div className="space-y-2">
                {model.groups.map(group => (
                  <div key={group.id} className="rounded border border-carbon/10 p-2">
                    <p className="text-xs font-bold text-carbon">{group.label}</p>
                    <p className="text-[10px] font-mono text-carbon/45">{group.memberIds.length} objeto(s)</p>
                    <div className="mt-1 flex gap-1">
                      <button type="button" className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => handleVisualEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, visible: !item.visible } : item) }, { label: `${group.visible ? 'Ocultar' : 'Mostrar'} grupo ${group.label}` })}>{group.visible ? 'Visible' : 'Oculto'}</button>
                      <button type="button" className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => handleVisualEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, locked: !item.locked } : item) }, { label: `${group.locked ? 'Desbloquear' : 'Bloquear'} grupo ${group.label}` })}>{group.locked ? 'Fijo' : 'Editable'}</button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-2 w-full rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold text-carbon"
                onClick={() => {
                  const index = model.groups.length + 1;
                  handleVisualEdit({
                    ...model,
                    groups: [...model.groups, { id: `group${index}`, label: `Grupo ${index}`, memberIds: [], visible: true, locked: false, selection: { selectable: true, role: 'secondary' } }],
                  }, { label: 'Añadir grupo' });
                }}
              >
                + Grupo
              </button>
            </div>

            <div className="rounded border border-carbon/10 bg-lienzo p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-2">Capas de escena</p>
              <div className="space-y-2">
                {model.layers.slice().sort((a, b) => a.order - b.order).map((layer, index, orderedLayers) => (
                  <div key={layer.id} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded border border-carbon/10 p-2">
                    <div>
                      <p className="text-xs font-bold text-carbon">{layer.label}</p>
                      <p className="text-[10px] font-mono text-carbon/45">{layer.id}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        aria-label={`${layer.visible ? 'Ocultar' : 'Mostrar'} capa ${layer.label}`}
                        className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]"
                        onClick={() => handleVisualEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, visible: !item.visible } : item) }, { label: `${layer.visible ? 'Ocultar' : 'Mostrar'} capa ${layer.label}` })}
                      >
                        {layer.visible ? 'Visible' : 'Oculta'}
                      </button>
                      <button
                        type="button"
                        aria-label={`${layer.locked ? 'Desbloquear' : 'Bloquear'} capa ${layer.label}`}
                        className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]"
                        onClick={() => handleVisualEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, locked: !item.locked } : item) }, { label: `${layer.locked ? 'Desbloquear' : 'Bloquear'} capa ${layer.label}` })}
                      >
                        {layer.locked ? 'Fija' : 'Editable'}
                      </button>
                      <button
                        type="button"
                        aria-label={`Bajar capa ${layer.label}`}
                        disabled={index === 0}
                        className="rounded border border-carbon/15 px-1 disabled:opacity-30"
                        onClick={() => {
                          const previous = orderedLayers[index - 1];
                          handleVisualEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, order: previous.order } : item.id === previous.id ? { ...item, order: layer.order } : item) }, { label: `Reordenar capa ${layer.label}` });
                        }}
                      >↓</button>
                      <button
                        type="button"
                        aria-label={`Subir capa ${layer.label}`}
                        disabled={index === orderedLayers.length - 1}
                        className="rounded border border-carbon/15 px-1 disabled:opacity-30"
                        onClick={() => {
                          const next = orderedLayers[index + 1];
                          handleVisualEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, order: next.order } : item.id === next.id ? { ...item, order: layer.order } : item) }, { label: `Reordenar capa ${layer.label}` });
                        }}
                      >↑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Center panel: toolbar + canvas + validation */}
          <main className="min-w-0 flex flex-col p-4 gap-4 overflow-y-auto">
            <DiagramToolbar
              model={model}
              canvasTool={state.canvasTool}
              syncStatus={state.status}
              onSetCanvasTool={setCanvasTool}
              onAddElement={handleAddElement}
              onModelEdit={handleVisualEdit}
              onAddSlider={handleAddSlider}
              onAddStep={handleAddStep}
              onResolveDivergence={resolveDivergence}
            />

            <DiagramCanvas
              model={model}
              selectedId={state.selectedId}
              canvasTool={state.canvasTool}
              pendingRefs={pendingRefs}
              previewHighlightId={previewHighlightId}
              previewStepId={state.activeStepId}
              onSelect={selectElement}
              onModelEdit={handleVisualEdit}
              onChoosePointForTool={choosePointForTool}
            />

            <DiagramStepsEditor
              model={model}
              activeStepId={state.activeStepId || model.steps[0]?.id || ''}
              onActiveStepChange={setActiveStep}
              onModelEdit={handleVisualEdit}
              onSelectObject={selectElement}
            />

            <DiagramTargetSelector
              model={model}
              selectedTargetId={selectedTargetId}
              onSelectTarget={(objectId, targetId) => {
                selectElement(objectId);
                setSelectedTargetId(targetId);
                setPreviewHighlightId(targetId);
              }}
              onModelEdit={handleVisualEdit}
            />

            <DiagramValidationPanel
              diagnostics={state.diagnostics}
              targets={mdxTargets}
              selectedTargetId={selectedTargetId}
              onSelectTarget={(t) => {
                setSelectedTargetId(t.id);
                setPreviewHighlightId(t.id);
              }}
            />
          </main>

          {/* Right panel: properties & references */}
          <aside className="border-l border-carbon/15 bg-carbon/5 p-4 space-y-4 overflow-y-auto">
            <DiagramInspector
              model={model}
              selectedId={state.selectedId}
              onSelect={selectElement}
              onModelEdit={handleVisualEdit}
              onDeleteSelected={handleDeleteSelected}
            />

            <DiagramReferencesPanel
              filePath={state.filePath}
            />
          </aside>
        </div>
      ) : (
        <DiagramCodePanel
          source={state.currentSource}
          sourceTouched={state.status === 'source-authoritative' || state.status === 'diverged'}
          filePath={state.filePath}
          componentName={componentName}
          onSourceChange={handleSourceEdit}
          onRegenerate={state.parseStatus === 'visual-exact' && state.status !== 'source-authoritative' && state.status !== 'diverged' ? () => {
            const gen = generateDiagramSource(model, componentName);
            if (gen.ok) {
              handleSourceEdit(gen.source);
            }
          } : undefined}
        />
      )}

      {/* Footer Status Bar */}
      <DiagramStatusBar
        status={state.status}
        isDirty={isDirty}
        saveCapability={isFileMode ? saveCapability : undefined}
        onSave={handleSaveAndConfirm}
      />
    </div>
  );
};

export const FileDiagramWorkbench: React.FC<DiagramWorkbenchAdapterProps & { path: string }> = ({
  path,
  ...props
}) => (
  <DiagramWorkbenchCore
    {...props}
    mode={{ kind: 'file', path }}
  />
);

export const InlineDiagramWorkbench: React.FC<DiagramWorkbenchAdapterProps & {
  source: string;
  componentName?: string;
  model?: Record<string, unknown> | null;
}> = ({
  source,
  componentName,
  model,
  ...props
}) => (
  <DiagramWorkbenchCore
    {...props}
    mode={{ kind: 'inline', source, componentName, model }}
  />
);

export const NewDiagramWorkbench: React.FC<DiagramWorkbenchAdapterProps & { componentName: string }> = ({
  componentName,
  ...props
}) => (
  <DiagramWorkbenchCore
    {...props}
    mode={{ kind: 'new', componentName }}
  />
);

export const DiagramWorkbench = DiagramWorkbenchCore;
export default DiagramWorkbench;
