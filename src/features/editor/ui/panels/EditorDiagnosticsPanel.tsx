import React from 'react';
import type { EditorValidationIssue, EditorValidationResult } from '../../core/editorTypes';
import type { FileNode } from '../../lib/editorContracts';
import type { EditorPersistenceStatus } from '../../state/editorPersistenceState';
import type { EditorWorkspaceLevel } from '../../navigation/editorNavigationModel';

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
        <h3 className="mb-2 text-[9px] font-bold uppercase tracking-widest text-carbon/45">Validación</h3>
        {!currentFile && <p className="text-xs italic text-carbon/50">No hay un recurso abierto.</p>}
        {currentFile && validation.issues.length === 0 && <p className="rounded border border-salvia/20 bg-salvia/5 px-3 py-2 text-xs text-carbon/65">No se han detectado errores bloqueantes en esta vista.</p>}
        <div className="space-y-1">
          {validation.issues.map(issue => (
            <button key={issue.id} type="button" onClick={() => onSelectIssue(issue)} className="block w-full rounded border border-granada/20 bg-granada/5 px-3 py-2 text-left text-xs text-carbon/70 hover:border-granada/40">
              <span className="font-bold text-granada">{issue.area}: </span>{issue.message}
            </button>
          ))}
        </div>
      </div>
      <div className="p-3">
        <h3 className="mb-2 text-[9px] font-bold uppercase tracking-widest text-carbon/45">Sesión actual</h3>
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
