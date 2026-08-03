import React from 'react';
import type { EditorValidationIssue, EditorValidationResult } from '@/fixed-pages/editor/session/editorTypes';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { EditorPersistenceStatus } from '@/fixed-pages/editor/save/editorPersistenceState';
import type { EditorWorkspaceLevel } from '@/fixed-pages/editor/session/editorNavigationModel';

interface EditorDiagnosticsPanelProps {
  currentFile: string | null;
  resource?: FileNode;
  validation: EditorValidationResult;
  persistenceStatus: EditorPersistenceStatus;
  persistenceLabel: string;
  level: EditorWorkspaceLevel;
  onSelectIssue: (issue: EditorValidationIssue) => void;
  close: () => void;
}

function statusDescription(status: EditorPersistenceStatus): string {
  switch (status.kind) {
    case 'idle': return 'Abra un recurso para iniciar una sesión de edición.';
    case 'loading': return 'Se está leyendo la última versión disponible.';
    case 'ready-clean': return 'El contenido local coincide con la versión abierta.';
    case 'ready-dirty': return 'Hay cambios locales que todavía no se han aplicado.';
    case 'validating': return 'Se comprueba la integridad antes de guardar.';
    case 'blocked': return status.reason;
    case 'saving-draft': return 'Se conserva una copia sin modificar el archivo real.';
    case 'draft-saved': return 'El borrador local quedó guardado.';
    case 'saving-file': return 'Se aplica el contenido revisado al archivo real.';
    case 'saved': return 'El archivo real quedó actualizado y dispone de copia de seguridad.';
    case 'save-error': return 'El contenido local se conserva; la escritura no fue confirmada.';
    case 'conflict': return 'La versión externa cambió después de abrir el recurso.';
    case 'cancelled': return 'La operación se canceló sin descartar cambios locales.';
    case 'unsupported': return status.reason;
  }
}

function validationPresentation(validation: EditorValidationResult): { className: string; label: string } {
  if (validation.errorCount > 0) return { className: 'bg-granada/10 text-granada', label: `${validation.errorCount} errores` };
  if (validation.warningCount > 0) return { className: 'bg-ocre/10 text-ocre', label: `${validation.warningCount} avisos` };
  return { className: 'bg-salvia/10 text-salvia', label: 'Sin errores' };
}

function persistenceIndicator(status: EditorPersistenceStatus): string {
  if (status.kind === 'conflict' || status.kind === 'save-error' || status.kind === 'blocked') return 'bg-granada';
  if (status.kind === 'ready-dirty' || status.kind === 'saving-file' || status.kind === 'saving-draft') return 'bg-ocre';
  return 'bg-salvia';
}

export const EditorDiagnosticsPanel: React.FC<EditorDiagnosticsPanelProps> = ({
  currentFile,
  resource,
  validation,
  persistenceStatus,
  persistenceLabel,
  level,
  onSelectIssue,
  close,
}) => {
  const validationStatus = validationPresentation(validation);
  const persistenceClass = persistenceIndicator(persistenceStatus);
  return (
  <section className="flex h-full flex-col bg-lienzo" aria-label="Diagnósticos y actividad">
    <header className="flex items-center justify-between border-b border-carbon/15 px-4 py-2">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-xs font-bold text-carbon">Diagnósticos y actividad</h2>
        <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${validationStatus.className}`}>
          {validationStatus.label}
        </span>
      </div>
      <button type="button" onClick={close} className="rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold text-carbon/55">Cerrar</button>
    </header>
    <div className="grid flex-1 min-h-0 gap-0 overflow-y-auto md:grid-cols-2">
      <div className="border-b border-carbon/10 p-3 md:border-b-0 md:border-r">
        <h3 className="mb-2 ac-label ac-label--xs ac-label--soft">Validación</h3>
        {!currentFile && <p className="text-xs italic text-carbon/50">No hay un recurso abierto.</p>}
        {currentFile && validation.issues.length === 0 && (
          <div className="p-4 text-center text-salvia border border-salvia/20 bg-salvia/5 rounded-xl">
            <svg className="w-6 h-6 mx-auto mb-1 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-bold text-xs">¡El documento está 100% sano!</p>
            <p className="text-[10px] text-carbon/60 mt-0.5">No se han detectado errores sintácticos ni problemas de estructura.</p>
          </div>
        )}
        <div className="space-y-2">
          {[...validation.issues]
            .sort((a, b) => {
              const priority = { error: 0, warning: 1, info: 2 };
              return (priority[a.severity] ?? 3) - (priority[b.severity] ?? 3);
            })
            .map(issue => {
              const isError = issue.severity === 'error';
              const isWarning = issue.severity === 'warning';
              return (
                <div
                  key={issue.id}
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
                        {issue.area} • {isError ? 'Error' : isWarning ? 'Aviso' : 'Info'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectIssue(issue)}
                      className="text-[10px] font-bold text-salvia hover:underline cursor-pointer flex items-center space-x-0.5"
                    >
                      <span>Ir al elemento</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-1.5 font-sans text-xs text-carbon leading-relaxed">{issue.message}</p>
                  {(issue.blockId || issue.sourceRange) && (
                    <span className="inline-block mt-1.5 font-mono text-[9px] text-salvia bg-carbon/5 px-1.5 py-0.5 rounded border border-carbon/10">
                      {issue.blockId ? `Bloque: ${issue.blockId}` : `Línea: ${issue.sourceRange?.start ?? 'origen'}`}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <div className="p-3">
        <h3 className="mb-2 ac-label ac-label--xs ac-label--soft">Sesión actual</h3>
        <div className="flex gap-3">
          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${persistenceClass}`} />
          <div className="min-w-0">
            <p className="text-xs font-bold text-carbon">{persistenceLabel}</p>
            <p className="mt-1 text-xs text-carbon/60">{statusDescription(persistenceStatus)}</p>
            {resource && <p className="mt-2 text-[10px] text-carbon/50"><span className="font-bold">Capacidad:</span> {resource.capabilityLabel}. {resource.reason}</p>}
            {level === 'advanced' && currentFile && <p className="mt-2 truncate font-mono text-[9px] text-carbon/40">{currentFile}</p>}
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default EditorDiagnosticsPanel;
