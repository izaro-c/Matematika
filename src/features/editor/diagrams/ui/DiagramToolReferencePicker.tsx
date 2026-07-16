import React from 'react';
import type { CanvasTool, VisualDiagramModel } from '../model/types';
import {
  KIND_LABELS,
  normalizedToolReferences,
  toolReferenceLabel,
  toolReferenceCandidates,
  toolReferencesAreReady,
  updateToolReference,
} from '../model/commands';

interface DiagramToolReferencePickerProps {
  model: VisualDiagramModel;
  tool: Exclude<CanvasTool, 'select' | 'point'>;
  refs: readonly string[];
  onRefsChange: (refs: string[]) => void;
  onCreate: () => void;
}

export const DiagramToolReferencePicker: React.FC<DiagramToolReferencePickerProps> = ({
  model,
  tool,
  refs,
  onRefsChange,
  onCreate,
}) => {
  const normalizedRefs = normalizedToolReferences(tool, refs);
  const ready = toolReferencesAreReady(tool, normalizedRefs);
  const candidates = toolReferenceCandidates(model, tool);
  let candidateKind = 'punto';
  if (tool === 'intersection') candidateKind = 'soporte';
  if (tool === 'measureTicks') candidateKind = 'segmento';

  return (
    <section className="rounded border border-pavo/20 bg-pavo/5 p-3" aria-labelledby="manual-reference-title">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id="manual-reference-title" className="text-[10px] font-bold uppercase tracking-widest text-carbon/60">
            Elegir referencias sin usar el lienzo
          </h3>
          <p className="mt-1 text-[10px] leading-relaxed text-carbon/55">
            Alternativa al clic: asigne cada referencia y cree {KIND_LABELS[tool].toLocaleLowerCase()} cuando estén completas.
            {tool === 'polygon' && ' Puede añadir tantos vértices como necesite.'}
          </p>
        </div>
        <span className="rounded bg-lienzo px-2 py-1 font-mono text-[9px] text-carbon/50">
          {normalizedRefs.filter(Boolean).length}/{normalizedRefs.length}
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {normalizedRefs.map((ref, index) => {
          const referenceLabel = toolReferenceLabel(tool, index);
          return (
            <label key={index} className="text-[10px] font-bold text-carbon/60">
              {referenceLabel}
              <select
                aria-label={`${referenceLabel} para ${KIND_LABELS[tool]}`}
                value={ref}
                onChange={event => onRefsChange(updateToolReference(tool, normalizedRefs, index, event.target.value))}
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs font-normal text-carbon"
              >
                <option value="">Seleccionar {candidateKind}</option>
                {candidates.map(candidate => {
                  const usedElsewhere = normalizedRefs.some((selectedRef, selectedIndex) => selectedIndex !== index && selectedRef === candidate.id);
                  return (
                    <option key={candidate.id} value={candidate.id} disabled={usedElsewhere}>
                      {candidate.label} · {candidate.id}
                    </option>
                  );
                })}
              </select>
            </label>
          );
        })}
      </div>

      {tool === 'polygon' && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onRefsChange([...normalizedRefs, ''])}
            className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5"
          >
            + Añadir vértice
          </button>
          <button
            type="button"
            disabled={normalizedRefs.length <= 3}
            onClick={() => onRefsChange(normalizedRefs.slice(0, -1))}
            className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5 disabled:opacity-35"
          >
            Quitar último vértice
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={!ready}
        onClick={onCreate}
        className="mt-3 rounded bg-pavo px-3 py-1.5 text-[10px] font-bold text-lienzo hover:bg-pavo/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Crear {KIND_LABELS[tool]}
      </button>
    </section>
  );
};

export default DiagramToolReferencePicker;
