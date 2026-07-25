import React from 'react';
import type { EnrichedDiagramDiagnostic } from '../../editor/diagrams/diagnostics';
import type { VisualDiagramModel } from '../../editor/diagrams/model/types';

interface V2DiagnosticsPanelProps {
  model: VisualDiagramModel | null;
  diagnostics: readonly EnrichedDiagramDiagnostic[];
  onSelectDiagnostic: (diagnostic: EnrichedDiagramDiagnostic) => void;
  onAutoFixBrokenReferences?: () => void;
}

export const V2DiagnosticsPanel: React.FC<V2DiagnosticsPanelProps> = ({
  diagnostics,
  onSelectDiagnostic,
  onAutoFixBrokenReferences,
}) => {
  const errors = diagnostics.filter(d => d.severity === 'error');

  return (
    <div className="p-4 space-y-4 text-xs font-serif text-carbon">
      <div className="flex items-center justify-between border-b border-carbon/10 pb-2">
        <div>
          <h3 className="font-bold text-sm text-carbon">Diagnósticos & Salud</h3>
          <p className="text-[11px] text-pizarra/70 italic">Verificación continua del modelo semántico v3.</p>
        </div>
        {errors.some(d => d.message.toLowerCase().includes('refer') || d.code?.includes('ref')) && onAutoFixBrokenReferences && (
          <button
            type="button"
            onClick={onAutoFixBrokenReferences}
            className="px-2.5 py-1 bg-granada text-lienzo rounded font-bold shadow-2xs hover:bg-granada/90 transition-all cursor-pointer text-[10px]"
          >
            Auto-Reparar Referencias Rotas
          </button>
        )}
      </div>

      {diagnostics.length === 0 ? (
        <div className="p-6 text-center text-salvia border border-salvia/20 bg-salvia/5 rounded-xl">
          <svg className="w-8 h-8 mx-auto mb-2 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <p className="font-bold">¡El diagrama está 100% sano!</p>
          <p className="text-[11px] text-carbon/60 mt-1">No se han detectado errores sintácticos ni referencias huérfanas.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {diagnostics.map((d, idx) => {
            const targetObjectId = d.location?.objectId;
            return (
              <div
                key={d.id || `diag-${idx}`}
                className={`p-3 rounded-xl border transition-all ${
                  d.severity === 'error'
                    ? 'border-granada/30 bg-granada/5 hover:border-granada/50'
                    : 'border-ocre/30 bg-ocre/5 hover:border-ocre/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        d.severity === 'error' ? 'bg-granada animate-pulse' : 'bg-ocre'
                      }`}
                    />
                    <span className="font-bold text-xs uppercase tracking-wider text-carbon">
                      {d.title || (d.severity === 'error' ? 'Error de validación' : 'Aviso de coherencia')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectDiagnostic(d)}
                    disabled={!targetObjectId}
                    className="text-[10px] font-bold text-salvia hover:underline cursor-pointer flex items-center space-x-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:no-underline"
                  >
                    <span>Ir al elemento</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1.5 font-sans text-xs text-carbon leading-relaxed">{d.message}</p>
                {d.hint && (
                  <p className="mt-1 text-[11px] text-carbon/70 italic bg-carbon/5 p-1.5 rounded border border-carbon/10">
                    {d.hint}
                  </p>
                )}
                {targetObjectId && (
                  <span className="inline-block mt-1 font-mono text-[10px] text-salvia bg-carbon/5 px-1.5 py-0.5 rounded">
                    Objeto: {targetObjectId}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
