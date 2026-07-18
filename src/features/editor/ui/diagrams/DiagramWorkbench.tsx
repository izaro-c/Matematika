import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { EditorDiagramReference } from '../../core/editorTypes';
import type { CanvasTool, ConstructionKind, ElementKind, TemplateKind, VisualDiagramModel } from '../../diagrams/model/types';
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
import { DiagramObjectList } from '../../diagrams/ui/DiagramObjectList';
import { DiagramOrganizationPanel } from '../../diagrams/ui/DiagramOrganizationPanel';
import { DiagramToolReferencePicker } from '../../diagrams/ui/DiagramToolReferencePicker';
import { generateDiagramSource } from '../../diagrams/source/generator';
import {
  CONSTRUCTION_OPTIONS, KIND_LABELS, refsNeededForTool,
  addToolReference, completedToolReferenceCount, toolReferencesAreReady,
  point, element, slider, step, projectPointToSupport,
  generatedElementId, elementColorForKind,
  addLabelToElement,
  supportElements, applyGuidedConstruction,
  normalizeConstructionRefs, validConstructionRefs,
  normalizeVisualModel, createTemplateModel, nextStepId,
  toolReferenceCandidates
} from '../../diagrams/model/commands';
import { useModalFocus } from '../hooks/useModalFocus';

export type DiagramWorkbenchMode =
  | { kind: 'file'; path: string }
  | { kind: 'inline'; source: string; componentName?: string; model?: Record<string, unknown> | null }
  | { kind: 'new'; componentName: string }
  | { kind: 'rewrite'; path: string; componentName: string; title: string; template: TemplateKind };

interface DiagramWorkbenchCoreProps {
  isOpen: boolean;
  mode: DiagramWorkbenchMode;
  metadataType: string;
  onClose: () => void;
  onConfirm: (spec: EditorDiagramReference) => boolean | void | Promise<boolean | void>;
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
  if (kind === 'segment' || kind === 'line' || kind === 'ray' || kind === 'circle' || kind === 'intersection' || kind === 'midpoint' || kind === 'congruenceMark' || kind === 'parallelMark' || kind === 'dimensionLine' || kind === 'measurement') {
    return refs.slice(0, 2);
  }
  if (kind === 'arc' || kind === 'perpendicularFoot' || kind === 'baseExtension' || kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'angle' || kind === 'nonReflexAngle' || kind === 'rightAngle' || kind === 'perpendicularMark') {
    return refs.slice(0, 3);
  }
  if (kind === 'areaDecomposition') return refs.slice(0, 4);
  if (kind === 'poincareGeodesic' || kind === 'poincareArc' || kind === 'grid') return refs.slice(0, 4);
  if (kind === 'functionCurve' || kind === 'parametricCurve' || kind === 'infoPanel') return [];
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
    loadDiagramForRewrite,
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
  const [visualSection, setVisualSection] = useState<'build' | 'steps' | 'targets' | 'check'>('build');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const workbenchRef = useModalFocus<HTMLDivElement>(isOpen, onClose, closeButtonRef);

  // Local UI states
  const [previewHighlightId, setPreviewHighlightId] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');

  // Guided constructions
  const [constructionKind, setConstructionKind] = useState<ConstructionKind>('mediatriz');
  const [constructionRefs, setConstructionRefs] = useState<Record<string, string>>({ a: '', b: '', c: '' });

  // Tool references selection
  const [pendingRefs, setPendingRefs] = useState<string[]>([]);
  const isFileMode = mode.kind === 'file' || mode.kind === 'rewrite';
  const inlineModel = useMemo(() => (
    mode.kind === 'inline'
      ? normalizeVisualModel(mode.model, metadataType)
      : null
  ), [mode, metadataType]);
  const newModel = useMemo(() => {
    if (!isOpen) return null;
    if (mode.kind === 'new') return createTemplateModel('circunferencia', 'Diagrama interactivo', metadataType);
    if (mode.kind === 'rewrite') return createTemplateModel(mode.template, mode.title, metadataType);
    return null;
  }, [isOpen, metadataType, mode]);

  const activateCanvasTool = (tool: CanvasTool) => {
    setPendingRefs([]);
    setCanvasTool(tool);
  };

  const chooseReferenceForTool = (referenceId: string) => {
    const canvasTool = state.canvasTool;
    if (canvasTool === 'select' || canvasTool === 'point') return false;
    const needed = refsNeededForTool(canvasTool);
    if (needed === 0) return false;
    const nextRefs = addToolReference(canvasTool, pendingRefs, referenceId);
    if (canvasTool !== 'polygon' && nextRefs.every(Boolean) && toolReferencesAreReady(canvasTool, nextRefs)) {
      handleAddElement(canvasTool as ElementKind, nextRefs);
      setPendingRefs([]);
    } else {
      setPendingRefs(nextRefs);
      selectElement(referenceId);
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

    if (mode.kind === 'rewrite' && newModel) {
      void loadDiagramForRewrite(mode.path, mode.componentName, newModel);
      return;
    }

    if (newModel) {
      loadNewDiagram(mode.componentName, newModel);
    }
  }, [isOpen, mode, inlineModel, newModel, loadDiagram, loadInlineDiagram, loadNewDiagram, loadDiagramForRewrite]);

  if (!isOpen) return null;

  const model: VisualDiagramModel | null = state.currentModel;
  const componentName = state.componentName || 'DiagramaInteractivo';
  const saveCapability = getDiagramSaveCapability(state);
  const makeVisibleInEveryStep = (candidate: VisualDiagramModel, objectId: string): VisualDiagramModel => ({
    ...candidate,
    steps: candidate.steps.map(item => ({
      ...item,
      visibleTargets: item.visibleTargets.includes(objectId) ? item.visibleTargets : [...item.visibleTargets, objectId],
      objectStates: item.objectStates?.[objectId]
        ? { ...item.objectStates, [objectId]: { ...item.objectStates[objectId], visible: true } }
        : item.objectStates,
    })),
  });

  const saveCodeOnlyDiagram = () => {
    if (isFileMode) void saveDiagram();
  };

  if (!model) {
    if (state.currentSource || state.diagnostics.length > 0) {
      return (
        <div ref={workbenchRef} className="fixed inset-0 z-50 flex flex-col bg-lienzo text-carbon font-sans" role="dialog" aria-modal="true" aria-label="Editor de diagramas en código">
          <header className="flex items-center justify-between border-b border-carbon/15 px-4 py-3 bg-carbon/5">
            <div>
              <h2 className="text-sm font-bold text-carbon">Editor de diagramas: código TSX</h2>
              <p className="text-[11px] text-carbon/55 font-mono">{state.filePath}</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
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
      <div ref={workbenchRef} className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Cargando editor de diagramas" aria-busy="true" tabIndex={-1}>
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
    const confirmed = await onConfirm({
      componentName,
      category: model.category,
      path: mode.kind === 'file' || mode.kind === 'rewrite' ? mode.path : '',
      importPath: mode.kind === 'file' || mode.kind === 'rewrite' ? mode.path : '',
      source: state.currentSource,
      targets: buildTargets(model),
      mode: model.mode,
      visualModel: model as unknown as Record<string, unknown>,
    });
    if (confirmed === false) return;
    onClose();
  };

  // Quick action handlers
  const handleAddSlider = () => {
    const id = `slider${model.sliders.length + 1}`;
    const newSlider = {
      ...slider(id, `Control ${model.sliders.length + 1}`, -4, -4 + model.sliders.length * 0.45, 1),
      order: Math.max(0, ...model.sliders.filter(item => item.layerId === 'controls').map(item => item.order)) + 1000,
    };
    handleVisualEdit(makeVisibleInEveryStep({
      ...model,
      sliders: [...model.sliders, newSlider],
    }, id), { label: `Añadir control ${id}` });
    selectElement(id);
    activateCanvasTool('select');
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
    const refs = explicitRefs || toolReferenceCandidates(model, kind).map(item => item.id);
    const elementRefs = refsForElementKind(kind, refs);

    const id = generatedElementId(kind, elementRefs, model.elements);
    const properties = kind === 'intersection'
      ? { restrictToSupports: true }
      : kind === 'functionCurve'
      ? { expression: 'sin(x)', parameter: 'x', domain: [-5, 5] as [number, number], samples: 128 }
      : kind === 'parametricCurve'
        ? { xExpression: '3*cos(t)', yExpression: '2*sin(t)', parameter: 't', domain: [0, 6.283185307179586] as [number, number], samples: 128 }
        : kind === 'congruenceMark' || kind === 'parallelMark'
          ? { markCount: 1 }
          : kind === 'measureTicks'
            ? { tickDistance: 2 }
          : kind === 'grid' || kind === 'areaDecomposition'
            ? { rows: 4, columns: 4 }
            : kind === 'dimensionLine' || kind === 'measurement'
              ? { precision: 2 }
              : kind === 'infoPanel'
                ? { anchorMode: 'viewport' as const, viewportPosition: [0.08, 0.22] as [number, number], title: 'Información' }
              : kind === 'label'
                ? { anchorMode: 'reference' as const, anchorParameter: 0.5 }
              : undefined;
    const baseElement = element(
      id,
      KIND_LABELS[kind],
      kind,
      elementRefs,
      elementColorForKind(kind),
      kind !== 'label',
      {
        ...(properties ? { properties } : {}),
        ...(kind === 'label' ? { style: { textOffset: [0.04, 0.04] as [number, number], preserveColorOnHighlight: true } } : {}),
      },
    );
    const newElement = {
      ...baseElement,
      order: Math.max(0, ...[...model.points, ...model.elements].filter(item => item.layerId === baseElement.layerId).map(item => item.order)) + 1000,
    };
    handleVisualEdit(makeVisibleInEveryStep({
      ...model,
      elements: [...model.elements, newElement],
      dependencies: [
        ...(model.dependencies || []),
        ...elementRefs.map(sourceId => ({ sourceId, targetId: id, relation: 'construction' as const })),
      ],
    }, id), { label: `Añadir ${KIND_LABELS[kind]}` });
    selectElement(id);
    activateCanvasTool('select');
  };

  const handleAddGliderPoint = () => {
    const support = supportElements(model)[0];
    if (!support) return;
    const id = `p${model.points.length + 1}`;
    const initial = { x: 0, y: 0 };
    const nextPoint = {
      ...point(id, id.replace(/^p/, ''), initial.x, initial.y, false, 'ocre', 'glider', support.id),
      order: Math.max(0, ...[...model.points, ...model.elements].filter(item => item.layerId === 'geometry').map(item => item.order)) + 1000,
    };
    const projected = projectPointToSupport(model, nextPoint, initial);
    handleVisualEdit(makeVisibleInEveryStep({
      ...model,
      points: [...model.points, { ...nextPoint, ...projected }],
    }, id), { label: `Añadir punto sobre ${support.id}` });
    selectElement(id);
    activateCanvasTool('select');
  };

  const handleAddElementLabel = (elementId: string) => {
    const result = addLabelToElement(model, elementId);
    const next = makeVisibleInEveryStep(result.model, result.labelId);
    handleVisualEdit(next, { label: `Añadir etiqueta a ${elementId}` });
    selectElement(result.labelId);
    activateCanvasTool('select');
  };

  const handleDeleteSelected = () => {
    const selectedId = state.selectedId;
    if (!selectedId) return;

    const removedSceneIds = new Set([
      selectedId,
      ...model.elements.filter(item => item.id === selectedId || item.refs.includes(selectedId)).map(item => item.id),
    ]);
    const removedConstraintIds = new Set((model.constraints ?? [])
      .filter(constraint => constraint.id === selectedId || constraint.refs.some(ref => removedSceneIds.has(ref)))
      .map(constraint => constraint.id));
    const points = model.points
      .filter(item => !removedSceneIds.has(item.id))
      .map(item => {
        const constraintIds = item.constraintIds?.filter(id => !removedConstraintIds.has(id));
        const attractorIds = item.attractorIds?.filter(id => !removedSceneIds.has(id));
        const attraction = attractorIds?.length
          ? { attractorIds }
          : { attractorIds: undefined, attractorDistance: undefined, snatchDistance: undefined };
        if (item.constraint !== 'constrained' || constraintIds?.length) {
          return { ...item, ...(constraintIds ? { constraintIds } : {}), ...attraction };
        }
        const next = { ...item, ...attraction, fixed: false, constraint: 'free' as const };
        delete next.constraintIds;
        return next;
      });
    handleVisualEdit({
      ...model,
      points,
      elements: model.elements.filter(item => !removedSceneIds.has(item.id)),
      sliders: model.sliders.filter(item => !removedSceneIds.has(item.id)),
      steps: model.steps.filter(item => !removedSceneIds.has(item.id)).map(item => ({
        ...item,
        visibleTargets: item.visibleTargets.filter(targetId => !removedSceneIds.has(targetId)),
        objectStates: item.objectStates
          ? Object.fromEntries(Object.entries(item.objectStates).filter(([id]) => !removedSceneIds.has(id)))
          : undefined,
      })),
      groups: model.groups.map(group => ({ ...group, memberIds: group.memberIds.filter(id => !removedSceneIds.has(id)) })),
      constraints: model.constraints?.filter(constraint => !removedConstraintIds.has(constraint.id)),
      dependencies: model.dependencies?.filter(dependency => (
        !removedSceneIds.has(dependency.sourceId)
        && !removedSceneIds.has(dependency.targetId)
        && (!dependency.constraintId || !removedConstraintIds.has(dependency.constraintId))
      )),
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
    activateCanvasTool('select');
  };

  const mdxTargets = buildTargets(model);

  return (
    <div ref={workbenchRef} className="fixed inset-0 z-50 flex flex-col bg-lienzo text-carbon font-sans" role="dialog" aria-modal="true" aria-labelledby="diagram-workbench-title">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-carbon/15 bg-carbon/5 px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <h2 id="diagram-workbench-title" className="truncate text-sm font-bold text-carbon">Editor visual exacto: {model.title}</h2>
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
          <div className="flex rounded border border-carbon/15 p-0.5 bg-lienzo" role="tablist" aria-label="Vista del diagrama">
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'visual'}
              onClick={() => setTab('visual')}
              className={`rounded px-3 py-1 text-xs font-bold transition-all ${tab === 'visual' ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:bg-carbon/5'}`}
            >
              Modelo visual
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'source'}
              onClick={() => setTab('source')}
              className={`rounded px-3 py-1 text-xs font-bold transition-all ${tab === 'source' ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:bg-carbon/5'}`}
            >
              Código TSX
            </button>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded border border-carbon/20 px-3 py-1 text-xs font-bold text-carbon/75 hover:bg-carbon/5 transition-all"
          >
            Cerrar
          </button>
        </div>
      </header>

      {mode.kind === 'rewrite' && (
        <div className="shrink-0 border-b border-ocre/25 bg-ocre/10 px-4 py-2 text-xs text-carbon" role="status">
          <strong className="text-ocre">Reescritura visual desde cero.</strong>{' '}
          El TSX actual permanece intacto mientras trabaja. Al guardar, se sustituirá por este modelo visual exacto y se conservará un backup recuperable.
        </div>
      )}

      {tab === 'visual' ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <nav className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-carbon/15 bg-lienzo px-3 py-2" role="tablist" aria-label="Tareas del editor visual">
            {([
              ['build', 'Construir', `${model.points.length + model.elements.length} objetos`],
              ['steps', 'Secuencia', `${model.steps.length} pasos`],
              ['targets', 'Enlaces MDX', `${mdxTargets.length} targets`],
              ['check', 'Comprobar', state.diagnostics.length > 0 ? `${state.diagnostics.length} avisos` : 'Sin errores'],
            ] as const).map(([id, label, detail]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={visualSection === id}
                onClick={() => setVisualSection(id)}
                className={`whitespace-nowrap rounded px-3 py-1.5 text-left text-xs font-bold ${visualSection === id ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:bg-carbon/5'}`}
              >
                {label} <span className={`ml-1 font-mono text-[9px] ${visualSection === id ? 'text-lienzo/65' : 'text-carbon/35'}`}>{detail}</span>
              </button>
            ))}
          </nav>

          {visualSection === 'build' && <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[260px_minmax(0,1fr)] lg:overflow-hidden xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          {/* Left panel: tools & quick actions */}
          <aside className="border-r border-carbon/15 bg-carbon/5 p-4 space-y-4 overflow-y-auto">
            <section className="rounded border border-carbon/10 bg-lienzo p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Cabecera del diagrama</p>
              <label className="mt-2 block text-[10px] font-bold text-carbon/55">Título<input value={model.title} onChange={event => handleVisualEdit({ ...model, title: event.target.value }, { label: 'Editar título' })} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-2 font-serif text-xs font-bold" /></label>
              <label className="mt-2 block text-[10px] font-bold text-carbon/55">Nota para la lectura<textarea value={model.note} onChange={event => handleVisualEdit({ ...model, note: event.target.value }, { label: 'Editar nota' })} className="mt-1 min-h-16 w-full rounded border border-carbon/15 bg-lienzo p-2 font-serif text-xs leading-relaxed" /></label>
              <div className="mt-2 grid grid-cols-2 gap-2"><label className="text-[10px] font-bold text-carbon/55">Categoría<input value={model.category} onChange={event => handleVisualEdit({ ...model, category: event.target.value }, { label: 'Editar categoría' })} className="mt-1 w-full rounded border border-carbon/15 p-1.5 text-xs" /></label><label className="text-[10px] font-bold text-carbon/55">Uso<select value={model.mode} onChange={event => handleVisualEdit({ ...model, mode: event.target.value as VisualDiagramModel['mode'] }, { label: 'Editar modo' })} className="mt-1 w-full rounded border border-carbon/15 p-1.5 text-xs"><option value="diagram">Diagrama</option><option value="simulation">Simulación</option><option value="inline">Inline</option></select></label></div>
            </section>
            <DiagramObjectList model={model} selectedId={state.selectedId} onSelect={selectElement} />

            {/* Guided Constructions */}
            <details className="group rounded border border-pavo/20 bg-pavo/5">
              <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-carbon/55 hover:bg-pavo/5 [&::-webkit-details-marker]:hidden">Construcciones guiadas <span className="float-right" aria-hidden="true">▾</span></summary>
              <div className="border-t border-pavo/15 p-3">
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
            </details>

            {/* Preview controls */}
            <details className="group rounded border border-carbon/10 bg-lienzo">
              <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-carbon/55 hover:bg-carbon/5 [&::-webkit-details-marker]:hidden">Vista previa <span className="float-right" aria-hidden="true">▾</span></summary>
              <div className="space-y-2 border-t border-carbon/10 p-3">
              <div>
                <label className="block text-[10px] font-bold text-carbon mb-1">Elemento resaltado</label>
                <select
                  className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={previewHighlightId}
                  onChange={(e) => setPreviewHighlightId(e.target.value)}
                >
                  <option value="">Ninguno</option>
                  {mdxTargets.map(t => (
                    <option key={t.qualifiedId ?? t.id} value={t.objectId ?? t.id}>{t.label} ({t.id})</option>
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
            </details>

            {/* Bounding box settings */}
            <details className="group rounded border border-carbon/10 bg-lienzo">
              <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-carbon/55 hover:bg-carbon/5 [&::-webkit-details-marker]:hidden">Plano y viewport <span className="float-right" aria-hidden="true">▾</span></summary>
              <div className="border-t border-carbon/10 p-3">
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
              </div>
            </details>

            <DiagramOrganizationPanel model={model} onModelEdit={handleVisualEdit} />
          </aside>

          {/* Center panel: toolbar + canvas + validation */}
          <main className="flex min-h-[480px] min-w-0 flex-col gap-4 overflow-y-auto p-4">
            <DiagramToolbar
              model={model}
              canvasTool={state.canvasTool}
              syncStatus={state.status}
              onSetCanvasTool={activateCanvasTool}
              onAddElement={handleAddElement}
              onModelEdit={handleVisualEdit}
              onAddSlider={handleAddSlider}
              onAddGliderPoint={handleAddGliderPoint}
              onAddStep={handleAddStep}
              onResolveDivergence={resolveDivergence}
            />

            <div className={`flex flex-wrap items-center gap-2 rounded border px-3 py-2 text-xs ${state.canvasTool === 'select' ? 'border-carbon/10 bg-carbon/5 text-carbon/55' : 'border-pavo/25 bg-pavo/5 text-carbon'}`} role="status">
              <span className="min-w-0 flex-1">
                {state.canvasTool === 'select' && 'Seleccione un objeto en el lienzo o en la lista de la izquierda para editarlo.'}
                {state.canvasTool === 'point' && 'Haga clic una vez en el lugar exacto del lienzo. Después se volverá automáticamente a Seleccionar.'}
                {state.canvasTool !== 'select' && state.canvasTool !== 'point' && refsNeededForTool(state.canvasTool) > 0 && (state.canvasTool === 'polygon'
                  ? `Creando polígono: elija al menos 3 vértices distintos en el lienzo o en los selectores inferiores y pulse Crear polígono (${completedToolReferenceCount(state.canvasTool, pendingRefs)} elegidos).`
                  : `Creando ${KIND_LABELS[state.canvasTool]}: elija ${refsNeededForTool(state.canvasTool)} referencias compatibles distintas en el lienzo o en los selectores inferiores (${completedToolReferenceCount(state.canvasTool, pendingRefs)}/${refsNeededForTool(state.canvasTool)}).`)}
                {pendingRefs.some(Boolean) && <span className="ml-1 font-mono text-[10px] text-pavo">Elegidos: {pendingRefs.filter(Boolean).join(', ')}</span>}
              </span>
              {state.canvasTool !== 'select' && <button type="button" className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon" onClick={() => activateCanvasTool('select')}>Cancelar</button>}
            </div>

            {state.canvasTool !== 'select' && state.canvasTool !== 'point' && refsNeededForTool(state.canvasTool) > 0 && (
              <DiagramToolReferencePicker
                model={model}
                tool={state.canvasTool}
                refs={pendingRefs}
                onRefsChange={setPendingRefs}
                onCreate={() => {
                  if (toolReferencesAreReady(state.canvasTool, pendingRefs)) {
                    handleAddElement(state.canvasTool as ElementKind, pendingRefs);
                  }
                }}
              />
            )}

            <DiagramCanvas
              model={model}
              selectedId={state.selectedId}
              canvasTool={state.canvasTool}
              pendingRefs={pendingRefs}
              previewHighlightId={previewHighlightId}
              previewStepId={state.activeStepId}
              onSelect={selectElement}
              onModelEdit={handleVisualEdit}
              onChooseReferenceForTool={chooseReferenceForTool}
              onCompleteTool={() => activateCanvasTool('select')}
            />

          </main>

          {/* Right panel: contextual properties */}
          <aside className="space-y-4 overflow-y-auto border-l border-carbon/15 bg-carbon/5 p-4 lg:col-span-2 lg:border-l-0 lg:border-t xl:col-span-1 xl:border-l xl:border-t-0">
            <DiagramInspector
              model={model}
              selectedId={state.selectedId}
              onSelect={selectElement}
              onModelEdit={handleVisualEdit}
              onDeleteSelected={handleDeleteSelected}
              onAddElementLabel={handleAddElementLabel}
            />

          </aside>
        </div>}
        {visualSection === 'steps' && (
          <main className="min-h-0 flex-1 overflow-y-auto bg-carbon/[0.02] p-3 sm:p-5" aria-label="Edición de la secuencia">
            <div className="mx-auto grid max-w-[96rem] items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.8fr)]">
              <DiagramStepsEditor
                model={model}
                activeStepId={state.activeStepId || model.steps[0]?.id || ''}
                onActiveStepChange={setActiveStep}
                onModelEdit={handleVisualEdit}
                onSelectObject={(id) => {
                  selectElement(id);
                  setVisualSection('build');
                }}
              />
              <div className="sticky top-0">
                <DiagramCanvas model={model} selectedId={state.selectedId} canvasTool="select" pendingRefs={[]} previewHighlightId={previewHighlightId} previewStepId={state.activeStepId} onSelect={selectElement} onModelEdit={handleVisualEdit} onChooseReferenceForTool={() => false} onCompleteTool={() => {}} />
                <p className="mt-2 rounded border border-carbon/10 bg-lienzo p-2 text-[10px] text-carbon/55">La vista muestra el paso activo. Cambie de paso en la matriz para comprobar exactamente qué aparece.</p>
              </div>
            </div>
          </main>
        )}
        {visualSection === 'targets' && (
          <main className="min-h-0 flex-1 overflow-y-auto bg-carbon/[0.02] p-3 sm:p-5" aria-label="Enlaces entre el diagrama y MDX">
            <div className="mx-auto max-w-6xl">
              <DiagramTargetSelector
                model={model}
                selectedTargetId={selectedTargetId}
                onSelectTarget={(objectId, targetId) => {
                  selectElement(objectId);
                  setSelectedTargetId(targetId);
                  setPreviewHighlightId(objectId);
                }}
                onModelEdit={handleVisualEdit}
              />
            </div>
          </main>
        )}
        {visualSection === 'check' && (
          <main className="min-h-0 flex-1 overflow-y-auto bg-carbon/[0.02] p-3 sm:p-5" aria-label="Comprobaciones del diagrama">
            <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
              <DiagramValidationPanel
                diagnostics={state.diagnostics}
                targets={mdxTargets}
                selectedTargetId={selectedTargetId}
                onSelectTarget={(target) => {
                  setSelectedTargetId(target.id);
                  setPreviewHighlightId(target.objectId ?? target.id);
                }}
              />
              <DiagramReferencesPanel filePath={state.filePath} />
            </div>
          </main>
        )}
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
