import React from 'react';
import type { CanvasTool, VisualDiagramModel } from '../model/types';
import {
  KIND_LABELS,
  normalizedToolReferences,
  toolReferenceLabel,
  toolReferencePurpose,
  toolReferenceCandidates,
  toolReferencesAreReady,
  updateToolReference,
} from '../model';

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
  if (tool === 'areaIntersection') candidateKind = 'área';

  return (
    <section className="rounded border border-pavo/20 bg-pavo/5 p-3" aria-labelledby="manual-reference-title">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 id="manual-reference-title" className="ac-label ac-label--sm ac-label--emphasis">
            Elegir referencias sin usar el lienzo
          </h3>
          <p className="mt-1 text-[10px] leading-relaxed text-carbon/55">
            Alternativa al clic: asigne cada referencia y cree {KIND_LABELS[tool].toLocaleLowerCase()} cuando estén completas.
            {tool === 'polygon' && ' Puede añadir tantos vértices como necesite.'}
            {tool === 'areaIntersection' && ' Puede añadir más de dos áreas si lo necesita.'}
          </p>
        </div>
        <span className="rounded bg-lienzo px-2 py-1 font-mono text-[9px] text-carbon/50">
          {normalizedRefs.filter(Boolean).length}/{normalizedRefs.length}
        </span>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {normalizedRefs.map((ref, index) => {
          const referenceLabel = toolReferenceLabel(tool, index);
          const referencePurpose = toolReferencePurpose(tool, index);
          return (
            <label key={index} className="rounded border border-carbon/10 bg-lienzo/70 p-2 text-[10px] font-bold text-carbon/60">
              <span className="block">{index + 1}. {referenceLabel}</span>
              <span className="mt-0.5 block min-h-7 text-[9px] font-normal leading-relaxed text-carbon/45">{referencePurpose}</span>
              <select
                aria-label={`${referenceLabel} para ${KIND_LABELS[tool]}`}
                value={ref}
                onChange={event => onRefsChange(updateToolReference(tool, normalizedRefs, index, event.target.value))}
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs font-normal text-carbon"
              >
                <option value="">Seleccionar {candidateKind} para este propósito…</option>
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

      {tool === 'areaIntersection' && (
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onRefsChange([...normalizedRefs, ''])}
            className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5"
          >
            + Añadir área
          </button>
          <button
            type="button"
            disabled={normalizedRefs.length <= 2}
            onClick={() => onRefsChange(normalizedRefs.slice(0, -1))}
            className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5 disabled:opacity-35"
          >
            Quitar última área
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
