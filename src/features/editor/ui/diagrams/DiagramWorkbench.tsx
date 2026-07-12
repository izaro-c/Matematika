import React, { useEffect, useState } from 'react';
import type { DiagramSpec } from '../../core/editorTypes';
import type { ConstructionKind, ElementKind } from '../../diagrams/model/types';
import { useDiagramState } from '../../diagrams/hooks/useDiagramState';
import { buildTargets } from '../../diagrams/model/selectors';
import { DiagramCanvas } from '../../diagrams/ui/DiagramCanvas';
import { DiagramToolbar } from '../../diagrams/ui/DiagramToolbar';
import { DiagramInspector } from '../../diagrams/ui/DiagramInspector';
import { DiagramStatusBar } from '../../diagrams/ui/DiagramStatusBar';
import { DiagramReferencesPanel } from '../../diagrams/ui/DiagramReferencesPanel';
import { DiagramCodePanel } from '../../diagrams/ui/DiagramCodePanel';
import { DiagramValidationPanel } from '../../diagrams/ui/DiagramValidationPanel';
import { generateDiagramSource } from '../../diagrams/source/generator';
import {
  CONSTRUCTION_OPTIONS, KIND_LABELS, refsNeededForTool,
  point, element, slider, step, projectPointToSupport,
  generatedElementId, elementColorForKind,
  supportElements, applyGuidedConstruction,
  normalizeConstructionRefs, validConstructionRefs
} from '../../diagrams/model/commands';

interface DiagramWorkbenchProps {
  isOpen: boolean;
  currentFile: string | null;
  metadataType: string;
  initialModel?: Record<string, unknown> | null;
  initialSource?: string;
  onClose: () => void;
  onConfirm: (spec: DiagramSpec) => void;
}

export const DiagramWorkbench: React.FC<DiagramWorkbenchProps> = ({
  isOpen,
  currentFile,
  metadataType,
  onClose,
  onConfirm,
}) => {
  const {
    state,
    isDirty,
    loadDiagram,
    handleVisualEdit,
    handleSourceEdit,
    selectElement,
    setCanvasTool,
    resolveDivergence,
    saveDiagram,
  } = useDiagramState();

  const [tab, setTab] = useState<'visual' | 'source'>('visual');

  // Local UI states
  const [previewHighlightId, setPreviewHighlightId] = useState('');
  const [previewStepId, setPreviewStepId] = useState('');
  const [selectedTargetId, setSelectedTargetId] = useState('');

  // Guided constructions
  const [constructionKind, setConstructionKind] = useState<ConstructionKind>('mediatriz');
  const [constructionRefs, setConstructionRefs] = useState<Record<string, string>>({ a: '', b: '', c: '' });

  // Tool references selection
  const [pendingRefs, setPendingRefs] = useState<string[]>([]);

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
    if (isOpen) {
      if (currentFile) {
        loadDiagram(currentFile, metadataType);
      }
    }
  }, [isOpen, currentFile, metadataType, loadDiagram]);

  if (!isOpen) return null;

  const model = state.currentModel;
  if (!model) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/40 backdrop-blur-sm">
        <div className="rounded bg-lienzo p-6 shadow-xl max-w-sm w-full text-center">
          <p className="text-sm font-bold text-carbon">Cargando Workbench de diagramas...</p>
        </div>
      </div>
    );
  }

  // Component Name extraction
  const componentName = state.componentName || 'DiagramaInteractivo';

  const handleSaveAndConfirm = async () => {
    const ok = await saveDiagram();
    if (ok) {
      onConfirm({
        componentName,
        category: model.category,
        path: currentFile || '',
        importPath: currentFile || '',
        source: state.currentSource,
        targets: buildTargets(model),
        mode: model.mode,
      });
      onClose();
    }
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
    const id = `step${model.steps.length + 1}`;
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
    setPreviewStepId(id);
  };

  const handleAddElement = (kind: ElementKind, explicitRefs?: string[]) => {
    const refs = explicitRefs || model.points.map(item => item.id);
    const elementRefs = kind === 'segment' || kind === 'line' || kind === 'ray' || kind === 'circle' || kind === 'midpoint'
      ? refs.slice(0, 2)
      : kind === 'perpendicularFoot' || kind === 'baseExtension' || kind === 'perpendicular' || kind === 'parallel' || kind === 'angleBisector' || kind === 'angle' || kind === 'rightAngle'
        ? refs.slice(0, 3)
        : refs.slice(0, 1);

    const id = generatedElementId(kind, elementRefs, model.elements);
    const newElement = element(id, KIND_LABELS[kind], kind, elementRefs, elementColorForKind(kind));
    handleVisualEdit({
      ...model,
      elements: [...model.elements, newElement],
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
      })),
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
          <h2 className="text-sm font-bold text-carbon">Workbench de Diagramas: {model.title}</h2>
          <p className="text-[11px] text-carbon/55 font-mono">{state.filePath}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded border border-carbon/15 p-0.5 bg-lienzo">
            <button
              onClick={() => setTab('visual')}
              className={`rounded px-3 py-1 text-xs font-bold transition-all ${tab === 'visual' ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:bg-carbon/5'}`}
            >
              Visual
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
                <button onClick={handleAddPoint} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5">Point</button>
                <button onClick={() => handleAddElement('segment')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Segment</button>
                <button onClick={() => handleAddElement('line')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Line</button>
                <button onClick={() => handleAddElement('circle')} disabled={model.points.length < 2} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Circle</button>
                <button onClick={() => handleAddElement('polygon')} disabled={model.points.length < 3} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Polygon</button>
                <button onClick={handleAddGliderPoint} disabled={supportElements(model).length < 1} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-40">Glider</button>
                <button onClick={handleAddSlider} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5">Slider</button>
                <button onClick={handleAddStep} className="rounded border border-carbon/15 bg-lienzo py-1.5 text-xs font-bold text-carbon hover:bg-carbon/5">Step</button>
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-2">Visualización de Preview</p>
              <div>
                <label className="block text-[10px] font-bold text-carbon mb-1">Highlight Target</label>
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
                  value={previewStepId}
                  onChange={(e) => setPreviewStepId(e.target.value)}
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-2">Límites (BoundingBox)</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['Min X', 'Max Y', 'Max X', 'Min Y'] as const).map((label, idx) => (
                  <div key={label}>
                    <label className="block text-[10px] font-bold text-carbon/60 mb-0.5">{label}</label>
                    <input
                      type="number"
                      step="0.5"
                      className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs font-mono"
                      value={model.boundingBox[idx]}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (Number.isFinite(val)) {
                          const nextBox = [...model.boundingBox] as [number, number, number, number];
                          nextBox[idx] = val;
                          handleVisualEdit({ ...model, boundingBox: nextBox });
                        }
                      }}
                    />
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
              previewStepId={previewStepId}
              onSelect={selectElement}
              onModelEdit={handleVisualEdit}
              onChoosePointForTool={choosePointForTool}
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
          onSourceChange={handleSourceEdit}
          onRegenerate={() => {
            const gen = generateDiagramSource(model, componentName);
            if (gen.ok) {
              handleSourceEdit(gen.source);
            }
          }}
        />
      )}

      {/* Footer Status Bar */}
      <DiagramStatusBar
        status={state.status}
        isDirty={isDirty}
        onSave={handleSaveAndConfirm}
      />
    </div>
  );
};
export default DiagramWorkbench;
