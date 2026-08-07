import React from 'react';
import type { EditorValidationIssue } from '@/fixed-pages/editor/session/editorTypes';

interface SaveErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: EditorValidationIssue[];
  saveMessage?: string | null;
  onJumpToIssue?: (issue: EditorValidationIssue) => void;
  onOpenAvisos?: () => void;
}

export const SaveErrorModal: React.FC<SaveErrorModalProps> = ({
  isOpen,
  onClose,
  issues,
  saveMessage,
  onJumpToIssue,
  onOpenAvisos,
}) => {
  if (!isOpen) return null;

  // Callers should pass blocking issues only; keep a filter as belt-and-suspenders.
  const errors = issues.filter(i => i.severity === 'error');
  const firstIssue = errors[0];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-carbon/40 p-4 backdrop-blur-xs motion-safe:animate-in motion-safe:fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-error-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-granada/30 bg-lienzo p-6 shadow-2xl space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-granada/15 text-granada">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="save-error-title" className="font-serif text-lg font-bold text-granada">
              No se puede guardar el documento
            </h2>
            <p className="mt-0.5 text-xs text-carbon/70">
              {saveMessage
                || (errors.length > 0
                  ? `Se han detectado ${errors.length} error(es) de validación que impiden guardar los cambios.`
                  : 'El guardado falló. Los avisos no bloquean; revisa permisos, token o el panel de avisos.')}
            </p>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="max-h-60 overflow-y-auto space-y-2 rounded-xl border border-carbon/15 bg-carbon/5 p-3">
            <span className="text-[10px] font-bold text-carbon/60 uppercase tracking-wider">
              Errores ({errors.length})
            </span>
            <div className="space-y-1.5 mt-1">
              {errors.map(issueItem => (
                <div
                  key={issueItem.id}
                  className="flex items-start justify-between gap-2 p-2.5 rounded-lg border text-xs bg-granada/10 border-granada/30 text-granada"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-granada text-lienzo">
                        Error
                      </span>
                      <span className="text-[10px] font-mono text-carbon/50 uppercase">
                        {issueItem.area}
                      </span>
                    </div>
                    <p className="font-medium leading-relaxed">{issueItem.message}</p>
                  </div>

                  {onJumpToIssue && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onJumpToIssue(issueItem);
                      }}
                      className="shrink-0 text-[10px] font-bold px-2 py-1 rounded bg-lienzo border border-carbon/20 hover:bg-carbon/10 transition-colors cursor-pointer text-carbon"
                      title="Ir al elemento en el editor"
                    >
                      Ir al error →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-carbon/10">
          {onOpenAvisos && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAvisos();
              }}
              className="px-3 py-1.5 text-xs font-bold text-carbon/70 hover:bg-carbon/10 rounded-lg transition-colors cursor-pointer"
            >
              Ver avisos
            </button>
          )}
          {firstIssue && onJumpToIssue && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onJumpToIssue(firstIssue);
              }}
              className="px-3.5 py-1.5 text-xs font-bold bg-granada text-lienzo hover:bg-granada/85 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Ir al primer error
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-bold bg-carbon/10 text-carbon hover:bg-carbon/20 rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
