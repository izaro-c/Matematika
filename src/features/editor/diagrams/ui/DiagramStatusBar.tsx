import React from 'react';
import type { DiagramSyncStatus } from '../state/types';
import { buildDiagramAuthorityPresentation } from '../../ux/safetyPresentation';
import type { DiagramSaveCapability } from '../model/selectors';

interface DiagramStatusBarProps {
  status: DiagramSyncStatus;
  isDirty: boolean;
  saveCapability?: DiagramSaveCapability;
  onSave: () => void;
  variant?: 'footer' | 'inline';
}

export const DiagramStatusBar: React.FC<DiagramStatusBarProps> = ({
  status,
  isDirty,
  saveCapability,
  onSave,
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
      title={isSaveBlocked ? saveCapability?.reason ?? presentation.description : 'Guardar el TSX del diagrama'}
      aria-label="Guardar diagrama"
    >
      {variant === 'inline' ? 'Guardar' : 'Guardar diagrama'}
    </button>
  );

  if (variant === 'inline') {
    return (
      <div
        className="flex shrink-0 items-center gap-2 rounded border border-carbon/15 bg-lienzo px-2 py-1"
        role={presentation.level === 'error' ? 'alert' : 'status'}
        aria-live={presentation.level === 'error' ? 'assertive' : 'polite'}
        title={presentation.description}
      >
        <span className="sr-only">sync:{status}</span>
        <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${config.color.split(' ')[0]}`} />
        <span className={`hidden max-w-40 truncate text-[10px] font-bold uppercase tracking-wider xl:inline ${config.textClass}`}>
          {config.label}
        </span>
        {isDirty && (
          <span className="hidden text-[9px] font-mono italic text-carbon/40 2xl:inline" aria-hidden>
            ·
          </span>
        )}
        {saveButton}
      </div>
    );
  }

  return (
    <div
      className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 border-t border-carbon/15 bg-carbon/5 px-3 py-2 text-xs sm:px-4"
      role={presentation.level === 'error' ? 'alert' : 'status'}
      aria-live={presentation.level === 'error' ? 'assertive' : 'polite'}
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${config.color.split(' ')[0]}`} />
          <span className={`truncate font-bold uppercase tracking-wider text-[10px] ${config.textClass}`}>{config.label}</span>
          <span className="hidden text-[10px] font-bold uppercase tracking-wider text-carbon/45 lg:inline">{presentation.title}</span>
          <span className="hidden rounded bg-carbon/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-carbon lowercase sm:inline" title="Estado técnico de sincronización">
            sync:{status}
          </span>
        </div>
        <p className="mt-1 hidden truncate text-[10px] text-carbon/55 sm:block">{presentation.description}</p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {isDirty && (
          <span className="hidden font-mono text-[10px] italic text-carbon/40 xl:inline">Cambios locales sin guardar</span>
        )}
        {saveButton}
      </div>
    </div>
  );
};
export default DiagramStatusBar;
