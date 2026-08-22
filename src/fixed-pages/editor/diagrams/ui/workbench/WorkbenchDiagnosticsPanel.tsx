import React from 'react';
import type { EnrichedDiagramDiagnostic } from '../../checks';
import type { VisualDiagramModel } from '../../model/types';
import { InspectorExpandableBlock } from '../inspector/InspectorExpandableBlock';

interface WorkbenchDiagnosticsPanelProps {
  model: VisualDiagramModel | null;
  diagnostics: readonly EnrichedDiagramDiagnostic[];
  onSelectDiagnostic: (diagnostic: EnrichedDiagramDiagnostic) => void;
  onAutoFixBrokenReferences?: () => void;
}

export const WorkbenchDiagnosticsPanel: React.FC<WorkbenchDiagnosticsPanelProps> = ({
  diagnostics,
  onSelectDiagnostic,
  onAutoFixBrokenReferences,
}) => {
  const errors = diagnostics.filter(d => d.severity === 'error');

  return (
    <div className="p-4 space-y-4 text-xs font-serif text-carbon bg-lienzo h-full overflow-y-auto">
      <div className="rounded-2xl border border-carbon/15 bg-lienzo p-4 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-sm font-bold text-carbon">Diagnósticos y Salud</h3>
            <p className="text-[11px] text-carbon/60 italic">Verificación continua del modelo semántico v3.</p>
          </div>
          {errors.some(d => d.message.toLowerCase().includes('refer') || d.code?.includes('ref')) && onAutoFixBrokenReferences && (
            <button
              type="button"
              onClick={onAutoFixBrokenReferences}
              className="px-3 py-1.5 bg-granada text-lienzo rounded-xl font-semibold shadow-2xs hover:bg-granada/90 transition-all cursor-pointer text-[10px] tracking-wide"
            >
              Auto-Reparar Referencias
            </button>
          )}
        </div>
      </div>

      <InspectorExpandableBlock title="Resultados del Análisis" defaultOpen={true}>
        {diagnostics.length === 0 ? (
          <div className="p-4 text-center text-canela border border-canela/30 bg-canela/5 rounded-2xl shadow-2xs">
            <svg className="w-6 h-6 mx-auto mb-1.5 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-serif font-bold text-xs">Diagrama 100% sano</p>
            <p className="text-[11px] text-carbon/65 mt-0.5">No hay errores sintácticos ni referencias huérfanas.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {diagnostics.map((d, idx) => {
              const targetObjectId = d.location?.objectId;
              return (
                <div
                  key={d.id || `diag-${idx}`}
                  onClick={() => targetObjectId && onSelectDiagnostic(d)}
                  className={`p-3.5 rounded-2xl border transition-all shadow-2xs ${
                    d.severity === 'error'
                      ? 'border-granada/30 bg-granada/5 hover:border-granada/50 hover:bg-granada/10'
                      : 'border-ocre/30 bg-ocre/5 hover:border-ocre/50 hover:bg-ocre/10'
                  } ${targetObjectId ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          d.severity === 'error' ? 'bg-granada animate-pulse' : 'bg-ocre'
                        }`}
                      />
                      <span className="font-bold text-[11px] uppercase tracking-wider text-carbon">
                        {d.title || (d.severity === 'error' ? 'Error de validación' : 'Aviso de coherencia')}
                      </span>
                    </div>
                    {targetObjectId && (
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onSelectDiagnostic(d);
                        }}
                        className="rounded-lg border border-carbon/15 bg-lienzo px-2 py-0.5 text-[10px] font-semibold text-carbon hover:bg-carbon/5 transition-all cursor-pointer flex items-center space-x-1 shadow-2xs"
                      >
                        <span>Ir al elemento</span>
                        <svg className="w-3 h-3 text-carbon/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="mt-2 font-sans text-xs text-carbon/90 leading-relaxed">{d.message}</p>
                  {d.hint && (
                    <p className="mt-1.5 text-[11px] text-carbon/75 italic bg-carbon/5 p-2 rounded-xl border border-carbon/10">
                      {d.hint}
                    </p>
                  )}
                  {targetObjectId && (
                    <span className="inline-block mt-2 font-mono text-[9px] text-carbon/70 bg-carbon/5 px-2 py-0.5 rounded-md border border-carbon/10">
                      Objeto: {targetObjectId}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </InspectorExpandableBlock>
    </div>
  );
};

export default WorkbenchDiagnosticsPanel;
