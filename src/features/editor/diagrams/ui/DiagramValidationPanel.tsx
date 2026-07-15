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
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-carbon/10 bg-carbon/5 px-3 py-3">
        <div><p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Comprobación antes de guardar</p><p className="mt-0.5 text-[10px] text-carbon/50">Revise la coherencia del modelo y pruebe cada enlace disponible para MDX.</p></div>
        <div className="flex gap-2"><span className={`rounded px-2 py-1 text-[10px] font-bold ${errors.length > 0 ? 'bg-granada/10 text-granada' : 'bg-salvia/10 text-salvia'}`}>{errors.length} errores</span><span className="rounded bg-ocre/10 px-2 py-1 text-[10px] font-bold text-ocre">{warnings.length} avisos</span><span className="rounded bg-pavo/10 px-2 py-1 text-[10px] font-bold text-pavo">{targets.length} enlaces</span></div>
      </div>

      <div className="grid min-h-72 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:divide-x lg:divide-carbon/10">
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

        {/* Target snippets list */}
        <div className="space-y-2 border-t border-carbon/10 p-3 lg:border-t-0">
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
                        {copiedSnippet === `${target.id}-ie` ? 'Copiado' : 'Copiar vínculo interactivo'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); copySnippet(`${target.id}-ch`, snippetCH); }}
                        className="rounded bg-carbon/10 px-2 py-0.5 text-[9px] font-bold text-carbon hover:bg-carbon/20 transition-all"
                      >
                        {copiedSnippet === `${target.id}-ch` ? 'Copiado' : 'Copiar ConceptLink'}
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
