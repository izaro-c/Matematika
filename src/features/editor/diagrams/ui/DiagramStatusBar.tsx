import React from 'react';
import type { DiagramSyncStatus } from '../state/types';
import { buildDiagramAuthorityPresentation } from '../../ux/safetyPresentation';
import type { DiagramSaveCapability } from '../model/selectors';

interface DiagramStatusBarProps {
  status: DiagramSyncStatus;
  isDirty: boolean;
  saveCapability?: DiagramSaveCapability;
  onSave: () => void;
}

export const DiagramStatusBar: React.FC<DiagramStatusBarProps> = ({
  status,
  isDirty,
  saveCapability,
  onSave,
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

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 border-t border-carbon/15 bg-carbon/5 px-4 py-2 text-xs"
      role={presentation.level === 'error' ? 'alert' : 'status'}
      aria-live={presentation.level === 'error' ? 'assertive' : 'polite'}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${config.color.split(' ')[0]}`} />
        <span className={`font-bold uppercase tracking-wider text-[10px] ${config.textClass}`}>{config.label}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-carbon/45">{presentation.title}</span>
          <span className="rounded bg-carbon/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-carbon lowercase" title="Estado técnico de sincronización">
            sync:{status}
          </span>
        </div>
        <p className="mt-1 truncate text-[10px] text-carbon/55">{presentation.description}</p>
      </div>

      <div className="flex items-center gap-3">
        {isDirty && (
          <span className="font-mono text-[10px] text-carbon/40 italic">Cambios locales sin guardar</span>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaveBlocked}
          className={`rounded px-4 py-1 text-xs font-bold transition-all ${
            isSaveBlocked
              ? 'bg-carbon/10 text-carbon/35 cursor-not-allowed'
              : 'bg-carbon text-lienzo hover:bg-carbon/80 cursor-pointer'
          }`}
          title={isSaveBlocked ? saveCapability?.reason ?? presentation.description : 'Guardar el TSX del diagrama'}
        >
          Guardar diagrama
        </button>
      </div>
    </div>
  );
};
export default DiagramStatusBar;
