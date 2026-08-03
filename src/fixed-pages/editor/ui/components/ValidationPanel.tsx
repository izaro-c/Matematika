import React from 'react';
import type { EditorValidationIssue, EditorValidationResult } from '@/fixed-pages/editor/session/editorTypes';

interface ValidationPanelProps {
  validation: EditorValidationResult;
  onSelectIssue?: (issue: EditorValidationIssue) => void;
}

const AREA_LABELS: Record<string, string> = {
  metadata: 'Metadatos',
  body: 'Contenido',
  block: 'Bloque',
  diagram: 'Diagrama',
  proof: 'Demostración',
  source: 'Fuente',
};

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ validation, onSelectIssue }) => {
  const hasIssues = validation.issues.length > 0;

  return (
    <section className="border-t border-carbon/15 p-4 animate-in fade-in duration-100">
      <div className="flex items-center justify-between">
        <h3 className="ac-label ac-label--sm ac-label--strong select-none">Avisos</h3>
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
            validation.canSave
              ? 'bg-salvia/10 text-salvia'
              : 'bg-granada/10 text-granada'
          }`}
        >
          {validation.canSave ? 'Se puede guardar' : `${validation.errorCount} errores`}
        </span>
      </div>

      {!hasIssues ? (
        <p className="mt-3 rounded border border-salvia/20 bg-salvia/5 p-3 text-xs italic text-carbon/65">
          El documento cumple las reglas críticas del editor.
        </p>
      ) : (
        <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
          {[...validation.issues]
            .sort((a, b) => {
              const priority = { error: 0, warning: 1, info: 2 };
              return (priority[a.severity] ?? 3) - (priority[b.severity] ?? 3);
            })
            .map(item => {
              const isError = item.severity === 'error';
              const isWarning = item.severity === 'warning';
              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isError
                      ? 'border-granada/30 bg-granada/5 hover:border-granada/50'
                      : isWarning
                        ? 'border-ocre/30 bg-ocre/5 hover:border-ocre/50'
                        : 'border-salvia/30 bg-salvia/5 hover:border-salvia/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          isError ? 'bg-granada animate-pulse' : isWarning ? 'bg-ocre' : 'bg-salvia'
                        }`}
                      />
                      <span className="font-bold text-xs uppercase tracking-wider text-carbon">
                        {AREA_LABELS[item.area] || item.area} • {isError ? 'Error' : isWarning ? 'Aviso' : 'Info'}
                      </span>
                    </div>
                    {onSelectIssue && (
                      <button
                        type="button"
                        onClick={() => onSelectIssue(item)}
                        className="text-[10px] font-bold text-salvia hover:underline cursor-pointer flex items-center space-x-0.5"
                      >
                        <span>Ir al elemento</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 font-sans text-xs text-carbon leading-relaxed">{item.message}</p>
                  {(item.blockId || item.sourceRange) && (
                    <span className="inline-block mt-1.5 font-mono text-[9px] text-salvia bg-carbon/5 px-1.5 py-0.5 rounded border border-carbon/10">
                      {item.blockId ? `Bloque: ${item.blockId}` : `Línea: ${item.sourceRange?.start ?? 'origen'}`}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
};
