import React, { useState } from 'react';
import type { DiagramTarget } from '@/features/editor/core/editorTypes';
import type { DiagramDiagnostic } from '../source/generator';
import { interactiveElementSnippet, conceptHighlightSnippet } from '../model/selectors';

interface DiagramValidationPanelProps {
  diagnostics: DiagramDiagnostic[];
  targets: DiagramTarget[];
  selectedTargetId: string;
  onSelectTarget: (target: DiagramTarget) => void;
}

export const DiagramValidationPanel: React.FC<DiagramValidationPanelProps> = ({
  diagnostics,
  targets,
  selectedTargetId,
  onSelectTarget,
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState('');

  const copySnippet = async (key: string, value: string) => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedSnippet(key);
      window.setTimeout(() => setCopiedSnippet(''), 1300);
    } catch {
      setCopiedSnippet('');
    }
  };

  const errors = diagnostics.filter(d => d.severity === 'error');
  const warnings = diagnostics.filter(d => d.severity === 'warning' || d.severity === 'info');

  return (
    <div className="rounded border border-carbon/10 bg-lienzo overflow-hidden">
      <div className="flex items-center justify-between border-b border-carbon/10 bg-carbon/5 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Diagnósticos y Targets</p>
      </div>

      <div className="grid grid-cols-[1fr_1px_1.2fr] min-h-36 max-h-48 divide-x divide-carbon/10">
        {/* Diagnostics list */}
        <div className="p-3 overflow-y-auto space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/35">Diagnósticos</p>
          {diagnostics.length === 0 && (
            <p className="text-xs italic text-salvia font-semibold">✓ No se encontraron errores de coherencia.</p>
          )}
          {errors.map((diag, index) => (
            <div key={`err-${index}`} className="rounded border border-granada/20 bg-granada/5 p-2 text-xs text-granada">
              <span className="font-bold">Error:</span> {diag.message}
            </div>
          ))}
          {warnings.map((diag, index) => (
            <div key={`warn-${index}`} className="rounded border border-ocre/20 bg-ocre/5 p-2 text-xs text-carbon">
              <span className="font-bold">Advertencia:</span> {diag.message}
            </div>
          ))}
        </div>

        <div className="w-px bg-carbon/10" />

        {/* Target snippets list */}
        <div className="p-3 overflow-y-auto space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/35">Elementos enlazables desde MDX</p>
          {targets.length === 0 ? (
            <p className="text-xs italic text-carbon/50">Marque puntos o elementos como enlazables desde MDX para verlos aquí.</p>
          ) : (
            <div className="space-y-1.5">
              {targets.map(target => {
                const isSelected = selectedTargetId === target.id;
                const snippetIE = interactiveElementSnippet(target);
                const snippetCH = conceptHighlightSnippet(target);
                return (
                  <div
                    key={target.qualifiedId ?? `${target.id}-${target.objectId ?? ''}`}
                    onClick={() => onSelectTarget(target)}
                    className={`rounded border p-2 transition-all cursor-pointer ${
                      isSelected ? 'border-ocre/35 bg-ocre/5' : 'border-carbon/10 bg-transparent hover:bg-carbon/5'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-carbon">{target.id}</span>
                      <span className="text-[9px] font-bold text-carbon/40">{target.label}</span>
                    </div>

                    <div className="flex gap-2 mt-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); copySnippet(`${target.id}-ie`, snippetIE); }}
                        className="rounded bg-carbon/10 px-2 py-0.5 text-[9px] font-bold text-carbon hover:bg-carbon/20 transition-all"
                      >
                        {copiedSnippet === `${target.id}-ie` ? 'Copied!' : 'Copy <InteractiveElement>'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); copySnippet(`${target.id}-ch`, snippetCH); }}
                        className="rounded bg-carbon/10 px-2 py-0.5 text-[9px] font-bold text-carbon hover:bg-carbon/20 transition-all"
                      >
                        {copiedSnippet === `${target.id}-ch` ? 'Copied!' : 'Copy <ConceptLink>'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DiagramValidationPanel;
