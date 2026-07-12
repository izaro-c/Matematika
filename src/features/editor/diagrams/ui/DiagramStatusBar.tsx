import React from 'react';
import type { DiagramSyncStatus } from '../state/types';

interface DiagramStatusBarProps {
  status: DiagramSyncStatus;
  isDirty: boolean;
  onSave: () => void;
}

export const DiagramStatusBar: React.FC<DiagramStatusBarProps> = ({
  status,
  isDirty,
  onSave,
}) => {
  const getStatusConfig = (s: DiagramSyncStatus) => {
    switch (s) {
      case 'synced':
        return { label: 'Sincronizado', color: 'bg-salvia text-salvia', textClass: 'text-salvia/90' };
      case 'visual-authoritative':
        return { label: 'Modificado visualmente (sin guardar)', color: 'bg-ocre text-ocre', textClass: 'text-ocre/90' };
      case 'source-authoritative':
        return { label: 'Modificado en código (sin guardar)', color: 'bg-pavo text-pavo', textClass: 'text-pavo/90' };
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

  return (
    <div className="flex items-center justify-between border-t border-carbon/15 bg-carbon/5 px-4 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${config.color.split(' ')[0]}`} />
        <span className={`font-bold uppercase tracking-wider text-[10px] ${config.textClass}`}>{config.label}</span>
      </div>

      <div className="flex items-center gap-3">
        {isDirty && (
          <span className="font-mono text-[10px] text-carbon/40 italic">Cambios locales sin guardar</span>
        )}
        <button
          onClick={onSave}
          disabled={status === 'saving' || status === 'invalid-source' || status === 'diverged'}
          className={`rounded px-4 py-1 text-xs font-bold transition-all ${
            status === 'saving' || status === 'invalid-source' || status === 'diverged'
              ? 'bg-carbon/10 text-carbon/35 cursor-not-allowed'
              : 'bg-carbon text-lienzo hover:bg-carbon/80 cursor-pointer'
          }`}
        >
          Guardar Diagrama
        </button>
      </div>
    </div>
  );
};
export default DiagramStatusBar;
