import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagramSyncStatus } from '../../state/types';
import type { DiagramSaveCapability } from '../../model/selectors';
import { DiagramStatusBar } from '../DiagramStatusBar';

interface WorkbenchHeaderProps {
  model: VisualDiagramModel;
  filePath: string | null;
  status: DiagramSyncStatus;
  isDirty: boolean;
  isFileMode: boolean;
  saveCapability?: DiagramSaveCapability;
  selectedCount: number;
  undoPastCount: number;
  undoFutureCount: number;
  undoLabel?: string;
  redoLabel?: string;
  canPaste: boolean;
  clipboardStatus?: string;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  onSave: () => void;
  onOpenDiagnostics: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onClose: () => void;
}

export const WorkbenchHeader: React.FC<WorkbenchHeaderProps> = ({
  model,
  filePath,
  status,
  isDirty,
  isFileMode,
  saveCapability,
  selectedCount,
  undoPastCount,
  undoFutureCount,
  undoLabel,
  redoLabel,
  canPaste,
  closeButtonRef,
  onSave,
  onOpenDiagnostics,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onClose,
}) => {
  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b border-carbon/15 bg-carbon/[0.03] px-3 py-2 sm:gap-4 sm:px-4">
      {/* Title & Metadata */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-pavo shrink-0" title="Editor Diagrama" />
          <h2 id="diagram-workbench-title" className="truncate text-sm font-bold text-carbon">
            {model.title || 'Diagrama Sin Título'}
          </h2>
        </div>
        <p className="hidden truncate text-[10px] font-mono text-carbon/50 sm:block">
          Editor visual exacto · {filePath || 'Memoria'}
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <DiagramStatusBar
          variant="inline"
          status={status}
          isDirty={isDirty}
          saveCapability={isFileMode ? saveCapability : undefined}
          onSave={onSave}
          onOpenDiagnostics={onOpenDiagnostics}
        />

        {/* History Group */}
        <div className="flex items-center rounded-lg border border-carbon/15 bg-lienzo p-0.5 shadow-xs" aria-label="Historial de comandos">
          <button
            type="button"
            onClick={onUndo}
            disabled={undoPastCount === 0}
            className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-carbon/75 hover:bg-carbon/5 disabled:opacity-30 transition-colors"
            aria-label="Deshacer"
            title={undoLabel ?? 'Nada que deshacer'}
          >
            ↶
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={undoFutureCount === 0}
            className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-carbon/75 hover:bg-carbon/5 disabled:opacity-30 transition-colors"
            aria-label="Rehacer"
            title={redoLabel ?? 'Nada que rehacer'}
          >
            ↷
          </button>
        </div>

        {/* Clipboard Group */}
        <div className="flex items-center rounded-lg border border-carbon/15 bg-lienzo p-0.5 shadow-xs" aria-label="Copiar y pegar objetos">
          <button
            type="button"
            onClick={onCopy}
            disabled={selectedCount === 0}
            aria-label="Copiar selección"
            className="h-8 rounded px-2.5 text-[11px] font-bold text-carbon/75 hover:bg-carbon/5 disabled:opacity-30 transition-colors"
            title="Copiar selección (Ctrl/Cmd+C)"
          >
            Copiar {selectedCount > 1 ? `(${selectedCount})` : ''}
          </button>
          <button
            type="button"
            onClick={onPaste}
            disabled={!canPaste}
            aria-label="Pegar selección"
            className="h-8 rounded px-2.5 text-[11px] font-bold text-carbon/75 hover:bg-carbon/5 disabled:opacity-30 transition-colors"
            title="Pegar (Ctrl/Cmd+V)"
          >
            Pegar
          </button>
        </div>

        {/* Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="h-8 rounded-lg border border-carbon/20 bg-lienzo px-3.5 text-xs font-bold text-carbon/80 shadow-xs hover:bg-carbon/10 hover:text-carbon transition-all"
        >
          Cerrar
        </button>
      </div>
    </header>
  );
};
