import React from 'react';
import type { CanvasTool, ElementKind, VisualDiagramModel } from '../model/types';
import { completedToolReferenceCount, KIND_LABELS, normalizedToolReferences, refsNeededForTool, toolReferenceLabel, toolReferencePurpose, toolReferencesAreReady } from '../model';
import { DiagramToolReferencePicker } from './DiagramToolReferencePicker';

interface DiagramToolGuidanceProps {
  model: VisualDiagramModel;
  tool: CanvasTool;
  refs: string[];
  onRefsChange: (refs: string[]) => void;
  onCreate: (kind: ElementKind, refs: string[]) => void;
  onCancel: () => void;
}

function guidanceText(tool: CanvasTool, refs: string[]): string {
  if (tool === 'select') return 'Seleccione un objeto en el lienzo o en la lista de la izquierda para editarlo.';
  if (tool === 'point') return 'Haga clic una vez en el lugar exacto del lienzo. Después se volverá automáticamente a Seleccionar.';
  const selectedCount = completedToolReferenceCount(tool, refs);
  if (tool === 'polygon') return `Creando polígono: elija al menos 3 vértices distintos y pulse Crear polígono (${selectedCount} elegidos).`;
  if (tool === 'areaIntersection') {
    return `Creando intersección: elija al menos 2 áreas distintas (${selectedCount}/${refsNeededForTool(tool)} elegidas). Puede añadir más áreas si lo necesita.`;
  }
  const normalized = normalizedToolReferences(tool, refs);
  const nextIndex = normalized.findIndex(reference => !reference);
  const nextInstruction = nextIndex >= 0 ? ` Siguiente: ${toolReferenceLabel(tool, nextIndex).toLocaleLowerCase('es')}; ${toolReferencePurpose(tool, nextIndex)}` : '';
  return `Creando ${KIND_LABELS[tool]}: ${selectedCount}/${refsNeededForTool(tool)} referencias elegidas.${nextInstruction}`;
}

export const DiagramToolGuidance: React.FC<DiagramToolGuidanceProps> = ({ model, tool, refs, onRefsChange, onCreate, onCancel }) => {
  const isSelecting = tool === 'select';
  const needsReferences = !isSelecting && tool !== 'point' && refsNeededForTool(tool) > 0;
  const selectedRefs = refs.filter(Boolean);
  return <>
    <div className={`flex flex-wrap items-center gap-2 rounded border px-3 py-2 text-xs ${isSelecting ? 'border-carbon/10 bg-carbon/5 text-carbon/55' : 'border-pavo/25 bg-pavo/5 text-carbon'}`} role="status">
      <span className="min-w-0 flex-1">
        {guidanceText(tool, refs)}
        {selectedRefs.length > 0 && <span className="ml-1 font-mono text-[10px] text-pavo">Elegidos: {selectedRefs.join(', ')}</span>}
      </span>
      {!isSelecting && <button type="button" className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon" onClick={onCancel}>Cancelar</button>}
    </div>
    {needsReferences && <DiagramToolReferencePicker model={model} tool={tool} refs={refs} onRefsChange={onRefsChange} onCreate={() => {
      if (toolReferencesAreReady(tool, refs)) onCreate(tool as ElementKind, refs);
    }} />}
  </>;
};
