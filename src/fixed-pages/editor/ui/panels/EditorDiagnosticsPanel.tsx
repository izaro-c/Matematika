import React from 'react';
import type { EditorValidationIssue, EditorValidationResult } from '@/fixed-pages/editor/session/editorTypes';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { EditorPersistenceStatus } from '@/fixed-pages/editor/save/editorPersistenceState';
import type { EditorWorkspaceLevel } from '@/fixed-pages/editor/session/editorNavigationModel';
import { InspectorExpandableBlock } from '../../diagrams/ui/inspector/InspectorExpandableBlock';

interface EditorDiagnosticsPanelProps {
  currentFile: string | null;
  resource?: FileNode;
  validation: EditorValidationResult;
  persistenceStatus: EditorPersistenceStatus;
  persistenceLabel: string;
  level: EditorWorkspaceLevel;
  onSelectIssue: (issue: EditorValidationIssue) => void;
  close: () => void;
  /** When true, omit the standalone header/close (parent tab chrome owns it). */
  embedded?: boolean;
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
  embedded = false,
}) => {
  const validationStatus = validationPresentation(validation);
  const persistenceClass = persistenceIndicator(persistenceStatus);

  return (
    <section className="flex h-full flex-col bg-lienzo" aria-label="Avisos y actividad">
      {!embedded && (
        <header className="flex items-center justify-between border-b border-carbon/15 bg-lienzo px-4 py-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-sm font-bold text-carbon">Avisos y Actividad</h2>
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${validationStatus.className}`}>
              {validationStatus.label}
            </span>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-carbon/15 bg-carbon/5 px-3 py-1 text-xs font-medium text-carbon hover:bg-carbon/10 hover:border-carbon/30 transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </header>
      )}

      {embedded && (
        <div className="flex items-center justify-between border-b border-carbon/15 pb-3">
          <div>
            <h3 className="font-serif text-base font-bold text-carbon">Avisos y Validación</h3>
            <p className="text-xs italic text-carbon/50">
              {validation.issues.length === 0
                ? 'Sin problemas detectados'
                : `${validation.issues.length} ${validation.issues.length === 1 ? 'problema detectado' : 'problemas detectados'}`}
            </p>
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${validationStatus.className}`}>
            {validationStatus.label}
          </span>
        </div>
      )}

      <div className={`flex-1 space-y-4 ${embedded ? 'pt-3' : 'p-4'} overflow-y-auto`}>
        <InspectorExpandableBlock title="Avisos del Documento" defaultOpen={true}>
          {!currentFile && (
            <div className="rounded-xl border border-carbon/10 bg-lienzo/50 p-4 text-center text-xs italic text-carbon/50">
              No hay un recurso abierto en esta sesión.
            </div>
          )}

          {currentFile && validation.issues.length === 0 && (
            <div className="rounded-2xl border border-salvia/30 bg-salvia/5 p-4 text-center text-salvia shadow-2xs">
              <svg className="w-6 h-6 mx-auto mb-1.5 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-serif text-xs font-bold">Todo en orden</p>
              <p className="text-[11px] text-carbon/65 mt-0.5">El documento cumple los requisitos de integridad.</p>
            </div>
          )}

          <div className="space-y-2.5">
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
                    onClick={() => onSelectIssue(issue)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
                      isError
                        ? 'border-granada/30 bg-granada/5 hover:border-granada/50 hover:bg-granada/10'
                        : isWarning
                          ? 'border-ocre/30 bg-ocre/5 hover:border-ocre/50 hover:bg-ocre/10'
                          : 'border-salvia/30 bg-salvia/5 hover:border-salvia/50 hover:bg-salvia/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                            isError ? 'bg-granada animate-pulse' : isWarning ? 'bg-ocre' : 'bg-salvia'
                          }`}
                        />
                        <span className="font-bold text-[11px] uppercase tracking-wider text-carbon">
                          {({
                            metadata: 'Metadatos',
                            body: 'Contenido',
                            block: 'Bloque',
                            diagram: 'Diagrama',
                            proof: 'Demostración',
                            source: 'Fuente',
                          } as Record<string, string>)[issue.area] ?? issue.area}
                          {' • '}
                          {isError ? 'Error' : isWarning ? 'Aviso' : 'Info'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIssue(issue);
                        }}
                        aria-label={issue.message}
                        className="rounded-lg border border-carbon/15 bg-lienzo px-2 py-0.5 text-[10px] font-semibold text-carbon hover:bg-carbon/5 transition-all cursor-pointer flex items-center space-x-1 shadow-2xs"
                      >
                        <span>Ir al elemento</span>
                        <svg className="w-3 h-3 text-carbon/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 font-sans text-xs text-carbon/90 leading-relaxed">{issue.message}</p>
                    {(issue.blockId || issue.sourceRange) && (
                      <span className="inline-block mt-2 font-mono text-[9px] text-carbon/70 bg-carbon/5 px-2 py-0.5 rounded-md border border-carbon/10">
                        {issue.blockId ? `Bloque: ${issue.blockId}` : `Línea: ${issue.sourceRange?.start ?? 'origen'}`}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </InspectorExpandableBlock>

        <InspectorExpandableBlock title="Estado de la Sesión" defaultOpen={true}>
          <div className="flex items-start gap-3 p-1">
            <span className={`mt-1 h-3 w-3 shrink-0 rounded-full border border-white shadow-2xs ${persistenceClass}`} />
            <div className="min-w-0 space-y-1">
              <p className="font-serif text-xs font-bold text-carbon">{persistenceLabel}</p>
              <p className="text-xs text-carbon/70 leading-snug">{statusDescription(persistenceStatus)}</p>
              {resource && (
                <p className="text-[11px] text-carbon/60 pt-1 border-t border-carbon/10 mt-2">
                  <span className="font-bold text-carbon/80">Capacidad:</span> {resource.capabilityLabel}. {resource.reason}
                </p>
              )}
              {level === 'advanced' && currentFile && (
                <p className="truncate font-mono text-[9px] text-carbon/40 pt-1">{currentFile}</p>
              )}
            </div>
          </div>
        </InspectorExpandableBlock>
      </div>
    </section>
  );
};

export default EditorDiagnosticsPanel;
