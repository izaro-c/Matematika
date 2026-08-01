import React, { useRef } from 'react';
import type { SafetyPresentation } from '../../ux/safetyPresentation';
import { useModalFocus } from '../hooks/useModalFocus';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  targetLabel: string;
  presentation: SafetyPresentation;
  onCancel: () => void;
  onReviewDiff: () => void;
  onSaveDraft: () => void;
  onDiscardAndContinue: () => void;
  canReviewDiff: boolean;
  canSaveDraft: boolean;
}

export const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({
  isOpen,
  targetLabel,
  presentation,
  onCancel,
  onReviewDiff,
  onSaveDraft,
  onDiscardAndContinue,
  canReviewDiff,
  canSaveDraft,
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useModalFocus<HTMLElement>(isOpen, onCancel, cancelRef);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/30 p-4" role="presentation">
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="unsaved-dialog-title"
        aria-describedby="unsaved-dialog-description"
        className="w-full max-w-xl rounded border border-carbon/20 bg-lienzo shadow-xl"
      >
        <header className="border-b border-carbon/15 bg-ocre/5 p-4">
          <h2 id="unsaved-dialog-title" className="font-serif text-lg font-bold text-carbon">Hay cambios locales</h2>
          <p id="unsaved-dialog-description" className="mt-1 text-sm leading-snug text-carbon/70">
            La acción hacia {targetLabel} descartaría cambios que todavía no están aplicados al archivo real.
          </p>
        </header>
        <div className="space-y-3 p-4 text-sm text-carbon/70">
          <p>{presentation.description}</p>
          <div className="rounded border border-carbon/10 bg-carbon/5 p-3">
            <p className="font-bold text-carbon">{presentation.title}</p>
            {presentation.recommendedAction && (
              <p className="mt-1 text-xs">Acción recomendada: {presentation.recommendedAction.label}.</p>
            )}
          </div>
        </div>
        <footer className="flex flex-wrap justify-end gap-2 border-t border-carbon/15 bg-carbon/5 p-4">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded border border-carbon/20 px-3 py-2 text-xs font-bold text-carbon hover:bg-carbon/5"
          >
            Permanecer
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={!canSaveDraft}
            className="rounded border border-carbon/20 px-3 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={onReviewDiff}
            disabled={!canReviewDiff}
            className="rounded bg-carbon px-3 py-2 text-xs font-bold text-lienzo hover:bg-carbon/85 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Revisar diff
          </button>
          <button
            type="button"
            onClick={onDiscardAndContinue}
            className="rounded border border-granada/30 bg-granada/5 px-3 py-2 text-xs font-bold text-granada hover:bg-granada/10"
          >
            Descartar y continuar
          </button>
        </footer>
      </section>
    </div>
  );
};

export default UnsavedChangesDialog;
