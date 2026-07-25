import React from 'react';
import type { CanvasTool, ElementKind, VisualDiagramModel } from '../model/types';
import {
  completedToolReferenceCount,
  KIND_LABELS,
  normalizedToolReferences,
  refsNeededForTool,
  toolReferenceLabel,
  toolReferencePurpose,
  toolReferencesAreReady,
} from '../model';
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
  if (tool === 'select') return 'Selecciona un objeto en el lienzo o inventario para inspeccionarlo o editarlo.';
  if (tool === 'point') return 'Haz clic en el lienzo para colocar un punto libre.';
  const selectedCount = completedToolReferenceCount(tool, refs);
  if (tool === 'polygon') return `Creando polígono: elige al menos 3 vértices (${selectedCount} elegidos).`;
  if (tool === 'areaIntersection') {
    return `Creando intersección de áreas (${selectedCount}/${refsNeededForTool(tool)} elegidas).`;
  }
  const normalized = normalizedToolReferences(tool, refs);
  const nextIndex = normalized.findIndex(reference => !reference);
  const nextInstruction =
    nextIndex >= 0
      ? ` Siguiente: ${toolReferenceLabel(tool, nextIndex).toLocaleLowerCase('es')} (${toolReferencePurpose(tool, nextIndex)})`
      : '';
  return `Creando ${KIND_LABELS[tool]}: ${selectedCount}/${refsNeededForTool(tool)} referencias.${nextInstruction}`;
}

export const DiagramToolGuidance: React.FC<DiagramToolGuidanceProps> = ({
  model,
  tool,
  refs,
  onRefsChange,
  onCreate,
  onCancel,
}) => {
  const isSelecting = tool === 'select';
  const needsReferences = !isSelecting && tool !== 'point' && refsNeededForTool(tool) > 0;
  const selectedRefs = refs.filter(Boolean);

  return (
    <>
      <div
        className={`flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 text-xs shadow-md transition-all ${
          isSelecting
            ? 'border-carbon/15 bg-lienzo text-carbon/60'
            : 'border-pavo/30 bg-pavo/10 text-pavo font-medium'
        }`}
        role="status"
      >
        <span className="min-w-0 flex-1">
          {guidanceText(tool, refs)}
          {selectedRefs.length > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 rounded bg-pavo/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-pavo">
              Refs: {selectedRefs.join(', ')}
            </span>
          )}
        </span>
        {!isSelecting && (
          <button
            type="button"
            className="rounded-md border border-carbon/20 bg-lienzo px-2.5 py-1 text-[10px] font-bold text-carbon/80 shadow-xs hover:bg-carbon/5 transition-all"
            onClick={onCancel}
          >
            Cancelar (Esc)
          </button>
        )}
      </div>

      {needsReferences && (
        <DiagramToolReferencePicker
          model={model}
          tool={tool}
          refs={refs}
          onRefsChange={onRefsChange}
          onCreate={() => {
            if (toolReferencesAreReady(tool, refs)) onCreate(tool as ElementKind, refs);
          }}
        />
      )}
    </>
  );
};
