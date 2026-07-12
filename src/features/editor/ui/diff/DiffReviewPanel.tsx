import React, { useEffect, useRef } from 'react';
import type { DiffReview } from '../../ux/diffReview';

interface DiffReviewPanelProps {
  review: DiffReview | null;
  isStale: boolean;
  isApplying: boolean;
  onClose: () => void;
  onApply: () => void;
}

const CLASS_LABEL: Record<string, string> = {
  expected: 'Esperado',
  'format-only-verified': 'Formato verificado',
  'outside-edited-range': 'Fuera de rango',
  unknown: 'Desconocido',
  blocking: 'Bloqueante',
};

const CLASS_STYLE: Record<string, string> = {
  expected: 'border-salvia/25 bg-salvia/5 text-salvia',
  'format-only-verified': 'border-pavo/25 bg-pavo/5 text-pavo',
  'outside-edited-range': 'border-granada/25 bg-granada/5 text-granada',
  unknown: 'border-ocre/25 bg-ocre/5 text-ocre',
  blocking: 'border-granada/25 bg-granada/5 text-granada',
};

export const DiffReviewPanel: React.FC<DiffReviewPanelProps> = ({
  review,
  isStale,
  isApplying,
  onClose,
  onApply,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!review) return undefined;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isApplying) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
  }, [isApplying, onClose, review]);

  if (!review) return null;

  const canApply = review.status === 'reviewable' && !isStale && !isApplying;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/30 p-4" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-diff-title"
        aria-describedby="editor-diff-description"
        className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded border border-carbon/20 bg-lienzo shadow-xl"
      >
        <header className="border-b border-carbon/15 bg-carbon/5 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="editor-diff-title" className="font-serif text-lg font-bold text-carbon">{review.title}</h2>
              <p id="editor-diff-description" className="mt-1 text-xs leading-snug text-carbon/60">
                {isStale ? 'Este diff quedó obsoleto porque cambió la revisión activa.' : review.summary}
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              disabled={isApplying}
              className="rounded border border-carbon/20 px-3 py-1 text-xs font-bold text-carbon hover:bg-carbon/5 disabled:opacity-45"
            >
              Cerrar
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4">
          {review.changes.length === 0 ? (
            <p className="rounded border border-salvia/20 bg-salvia/5 p-3 text-sm text-carbon/70">No hay cambios para aplicar.</p>
          ) : (
            <ol className="space-y-3">
              {review.changes.map(change => (
                <li key={change.id} className="rounded border border-carbon/15 bg-lienzo">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-carbon/10 px-3 py-2">
                    <span className="font-mono text-[10px] text-carbon/50">
                      {change.beforeLine ? `L${change.beforeLine}` : 'Nueva línea'} {'->'} {change.afterLine ? `L${change.afterLine}` : 'Eliminada'}
                    </span>
                    <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${CLASS_STYLE[change.classification]}`}>
                      {CLASS_LABEL[change.classification]}
                    </span>
                  </div>
                  <div className="grid gap-0 border-b border-carbon/10 text-xs md:grid-cols-2">
                    <pre className="overflow-x-auto border-carbon/10 bg-granada/5 p-3 text-carbon/70 md:border-r">
                      <code>{change.beforeText || ' '}</code>
                    </pre>
                    <pre className="overflow-x-auto bg-salvia/5 p-3 text-carbon/70">
                      <code>{change.afterText || ' '}</code>
                    </pre>
                  </div>
                  <p className="px-3 py-2 text-xs text-carbon/60">{change.reason}</p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-carbon/15 bg-carbon/5 p-4">
          <p className="text-xs text-carbon/60">
            Cerrar este panel no aplica cambios. Los cambios bloqueantes impiden escribir el archivo real.
          </p>
          <button
            type="button"
            onClick={onApply}
            disabled={!canApply}
            className="rounded bg-salvia px-4 py-2 text-xs font-bold text-lienzo hover:bg-salvia/85 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isApplying ? 'Aplicando...' : 'Aplicar archivo'}
          </button>
        </footer>
      </section>
    </div>
  );
};

export default DiffReviewPanel;
