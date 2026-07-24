import React, { useState } from 'react';
import type { DiagramTarget } from '@/features/editor/core/editorTypes';
import type { EnrichedDiagramDiagnostic } from '../diagnostics/types';
import { interactiveElementSnippet, conceptHighlightSnippet } from '../model/selectors';
import { DiagramButton, DiagramPanel } from './primitives';

interface DiagramValidationPanelProps {
  diagnostics: EnrichedDiagramDiagnostic[];
  targets: DiagramTarget[];
  selectedTargetId: string;
  focusedDiagnosticId?: string;
  onSelectTarget: (target: DiagramTarget) => void;
  onNavigate?: (diagnostic: EnrichedDiagramDiagnostic) => void;
}

function severityLabel(severity: EnrichedDiagramDiagnostic['severity']): string {
  if (severity === 'error') return 'Error';
  if (severity === 'warning') return 'Aviso';
  return 'Info';
}

function canNavigate(diagnostic: EnrichedDiagramDiagnostic): boolean {
  return Boolean(
    diagnostic.location.objectId
    || diagnostic.location.workspace !== 'check',
  );
}

export const DiagramValidationPanel: React.FC<DiagramValidationPanelProps> = ({
  diagnostics,
  targets,
  selectedTargetId,
  focusedDiagnosticId,
  onSelectTarget,
  onNavigate,
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
    <DiagramPanel
      title="Comprobación antes de guardar"
      className="overflow-hidden border-carbon/10 bg-lienzo"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] text-carbon/50">Revise la coherencia del modelo y pruebe cada enlace disponible para MDX.</p>
        <div className="flex gap-2">
          <span className={`rounded px-2 py-1 text-[10px] font-bold ${errors.length > 0 ? 'bg-granada/10 text-granada' : 'bg-salvia/10 text-salvia'}`}>
            {errors.length} error{errors.length === 1 ? '' : 'es'}
          </span>
          <span className={`rounded px-2 py-1 text-[10px] font-bold ${warnings.length > 0 ? 'bg-ocre/10 text-ocre' : 'bg-carbon/5 text-carbon/40'}`}>
            {warnings.length} aviso{warnings.length === 1 ? '' : 's'}
          </span>
          <span className="rounded bg-pavo/10 px-2 py-1 text-[10px] font-bold text-pavo">{targets.length} enlaces</span>
        </div>
      </div>

      <div className="grid min-h-72 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:divide-x lg:divide-carbon/10">
        <div className="space-y-2 overflow-y-auto p-1">
          <p className="ac-label ac-label--sm ac-label--muted">Diagnósticos</p>
          {errors.length === 0 && warnings.length === 0 && (
            <p className="text-xs font-semibold italic text-salvia">No se encontraron errores de coherencia.</p>
          )}
          {[...errors, ...warnings].map(diagnostic => {
            const navigable = onNavigate && canNavigate(diagnostic);
            const Card = navigable ? 'button' : 'div';
            const isFocused = focusedDiagnosticId === diagnostic.id;
            const severityClass = diagnostic.severity === 'error'
              ? 'border-granada/25 bg-granada/5 text-granada hover:border-granada/40'
              : 'border-ocre/20 bg-ocre/5 text-carbon hover:border-ocre/35';

            return (
              <Card
                key={diagnostic.id}
                type={navigable ? 'button' : undefined}
                onClick={navigable ? () => onNavigate(diagnostic) : undefined}
                className={`block w-full rounded border p-2 text-left text-xs transition-all ${severityClass} ${
                  navigable ? 'cursor-pointer focus:outline-none focus:ring-1 focus:ring-salvia' : ''
                } ${isFocused ? 'ring-2 ring-granada/35' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">{diagnostic.title}</span>
                  <span className={`ac-label ac-label--xs ${diagnostic.severity === 'error' ? 'text-granada' : 'text-ocre'}`}>
                    {severityLabel(diagnostic.severity)}
                  </span>
                </div>
                <p className="mt-1 leading-snug text-carbon/80">{diagnostic.message}</p>
                <p className="mt-1.5 font-serif text-[10px] italic text-carbon/60">{diagnostic.hint}</p>
                {navigable && (
                  <span className="mt-1 block text-[9px] font-bold text-carbon/45">Ir al origen →</span>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-2 border-t border-carbon/10 p-1 lg:border-t-0">
          <p className="ac-label ac-label--sm ac-label--muted">Elementos enlazables desde MDX</p>
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
                    className={`cursor-pointer rounded border p-2 transition-all ${
                      isSelected ? 'border-ocre/35 bg-ocre/5' : 'border-carbon/10 bg-transparent hover:bg-carbon/5'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-bold text-carbon">{target.id}</span>
                      <span className="text-[9px] font-bold text-carbon/40">{target.label}</span>
                    </div>

                    <div className="mt-1.5 flex gap-2">
                      <DiagramButton
                        variant="ghost"
                        className="!min-h-0 rounded bg-carbon/10 px-2 py-0.5 text-[9px] text-carbon hover:bg-carbon/20 hover:no-underline"
                        onClick={(e) => { e.stopPropagation(); copySnippet(`${target.id}-ie`, snippetIE); }}
                      >
                        {copiedSnippet === `${target.id}-ie` ? 'Copiado' : 'Copiar vínculo interactivo'}
                      </DiagramButton>
                      <DiagramButton
                        variant="ghost"
                        className="!min-h-0 rounded bg-carbon/10 px-2 py-0.5 text-[9px] text-carbon hover:bg-carbon/20 hover:no-underline"
                        onClick={(e) => { e.stopPropagation(); copySnippet(`${target.id}-ch`, snippetCH); }}
                      >
                        {copiedSnippet === `${target.id}-ch` ? 'Copiado' : 'Copiar ConceptLink'}
                      </DiagramButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DiagramPanel>
  );
};
export default DiagramValidationPanel;
