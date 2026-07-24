import React from 'react';
import type { DiagramSyncStatus } from '../state/types';
import { buildDiagramAuthorityPresentation } from '../../ux/safetyPresentation';
import type { DiagramSaveCapability } from '../model/selectors';

interface DiagramStatusBarProps {
  status: DiagramSyncStatus;
  isDirty: boolean;
  saveCapability?: DiagramSaveCapability;
  onSave: () => void;
  onOpenDiagnostics?: () => void;
  variant?: 'footer' | 'inline';
}

export const DiagramStatusBar: React.FC<DiagramStatusBarProps> = ({
  status,
  isDirty,
  saveCapability,
  onSave,
  onOpenDiagnostics,
  variant = 'footer',
}) => {
  const presentation = buildDiagramAuthorityPresentation(status, isDirty);
  const getStatusConfig = (s: DiagramSyncStatus) => {
    switch (s) {
      case 'synced':
        return { label: 'Edición visual exacta', color: 'bg-salvia text-salvia', textClass: 'text-salvia/90' };
      case 'visual-authoritative':
        return { label: 'Modificado visualmente (sin guardar)', color: 'bg-ocre text-ocre', textClass: 'text-ocre/90' };
      case 'source-authoritative':
        return { label: isDirty ? 'Código modificado (sin guardar)' : 'Código con vista previa', color: 'bg-pavo text-pavo', textClass: 'text-pavo/90' };
      case 'diverged':
        return { label: 'Divergencia detectada', color: 'bg-granada text-granada', textClass: 'text-granada/90' };
      case 'invalid-source':
        return { label: 'Error de sintaxis TSX', color: 'bg-granada text-granada', textClass: 'text-granada/90' };
      case 'saving':
        return { label: 'Guardando cambios...', color: 'bg-pizarra text-pizarra', textClass: 'text-pizarra/90' };
      case 'conflict':
        return { label: 'Conflicto de persistencia', color: 'bg-granada text-granada', textClass: 'text-granada/90' };
      default:
        return { label: 'Desconocido', color: 'bg-carbon text-carbon', textClass: 'text-carbon/90' };
    }
  };

  const config = getStatusConfig(status);
  const isSaveBlocked = saveCapability ? !saveCapability.allowed : status === 'saving' || status === 'invalid-source' || status === 'diverged';
  const blockSummary = isSaveBlocked ? saveCapability?.summary ?? presentation.description : undefined;
  const showDiagnosticsLink = isSaveBlocked && onOpenDiagnostics && saveCapability?.reason === 'validation-error';

  const saveButton = (
    <button
      type="button"
      onClick={onSave}
      disabled={isSaveBlocked}
      className={`min-h-9 rounded px-3 text-[11px] font-bold transition-all ${
        isSaveBlocked
          ? 'bg-carbon/10 text-carbon/35 cursor-not-allowed'
          : 'bg-carbon text-lienzo hover:bg-carbon/80 cursor-pointer'
      }`}
      title={isSaveBlocked ? blockSummary ?? 'Guardado bloqueado' : 'Guardar el TSX del diagrama'}
      aria-label="Guardar diagrama"
    >
      {variant === 'inline' ? 'Guardar' : 'Guardar diagrama'}
    </button>
  );

  const blockBadge = isSaveBlocked && blockSummary ? (
    <span className="shrink-0 rounded bg-granada/10 px-2 py-1 text-[10px] font-bold text-granada" title={blockSummary}>
      {blockSummary}
    </span>
  ) : null;

  const diagnosticsLink = showDiagnosticsLink ? (
    <button
      type="button"
      onClick={onOpenDiagnostics}
      className="min-h-9 shrink-0 rounded px-2 text-[10px] font-bold text-granada underline decoration-granada/40 underline-offset-2 hover:text-granada/80"
    >
      Ver
    </button>
  ) : null;

  if (variant === 'inline') {
    return (
      <div
        className="flex max-w-full shrink-0 items-center gap-2 rounded border border-carbon/15 bg-lienzo px-2 py-1"
        role={isSaveBlocked && saveCapability?.reason === 'validation-error' ? 'alert' : presentation.level === 'error' ? 'alert' : 'status'}
        aria-live={isSaveBlocked ? 'assertive' : 'polite'}
        title={presentation.description}
      >
        <span className="sr-only">sync:{status}</span>
        <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${config.color.split(' ')[0]}`} />
        <span className={`hidden max-w-32 truncate ac-label ac-label--sm xl:inline ${config.textClass}`}>
          {config.label}
        </span>
        {blockBadge}
        {diagnosticsLink}
        {saveButton}
      </div>
    );
  }

  return (
    <div
      className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 border-t border-carbon/15 bg-carbon/5 px-3 py-2 text-xs sm:px-4"
      role={isSaveBlocked && saveCapability?.reason === 'validation-error' ? 'alert' : presentation.level === 'error' ? 'alert' : 'status'}
      aria-live={isSaveBlocked ? 'assertive' : 'polite'}
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${config.color.split(' ')[0]}`} />
          <span className={`truncate ac-label ac-label--sm ${config.textClass}`}>{config.label}</span>
          {blockBadge}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {diagnosticsLink}
        {saveButton}
      </div>
    </div>
  );
};
export default DiagramStatusBar;
