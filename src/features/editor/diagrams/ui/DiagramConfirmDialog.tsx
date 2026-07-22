import React, { useRef } from 'react';
import { useModalFocus } from '../../ui/hooks/useModalFocus';
import { DiagramButton } from './primitives';

export interface DiagramConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DiagramConfirmDialog: React.FC<DiagramConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalFocus<HTMLElement>(isOpen, onCancel, cancelRef);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-carbon/30 p-4" role="presentation">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="diagram-confirm-title"
        aria-describedby="diagram-confirm-description"
        className="w-full max-w-md rounded border border-carbon/20 bg-lienzo shadow-xl"
      >
        <header className="border-b border-carbon/15 bg-granada/5 p-4">
          <h2 id="diagram-confirm-title" className="font-serif text-lg font-bold text-carbon">{title}</h2>
        </header>
        <p id="diagram-confirm-description" className="p-4 text-sm leading-relaxed text-carbon/70">{message}</p>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-carbon/15 bg-carbon/5 p-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded border border-carbon/20 px-3 text-xs font-bold text-carbon hover:bg-carbon/5"
          >
            {cancelLabel}
          </button>
          <DiagramButton type="button" variant="danger" onClick={onConfirm}>{confirmLabel}</DiagramButton>
        </footer>
      </section>
    </div>
  );
};

export default DiagramConfirmDialog;
