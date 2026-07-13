import React from 'react';
import type { SafetyPresentation } from '../../ux/safetyPresentation';

const LEVEL_STYLES: Record<SafetyPresentation['level'], string> = {
  safe: 'border-salvia/25 bg-salvia/5 text-salvia',
  attention: 'border-ocre/30 bg-ocre/5 text-ocre',
  blocked: 'border-pizarra/30 bg-pizarra/5 text-pizarra',
  error: 'border-granada/30 bg-granada/5 text-granada',
};

const LEVEL_LABELS: Record<SafetyPresentation['level'], string> = {
  safe: 'Seguro',
  attention: 'Atención',
  blocked: 'Bloqueado',
  error: 'Error',
};

interface SafetySummaryProps {
  currentFile: string | null;
  presentation: SafetyPresentation;
  onReviewDiff: () => void;
  onSaveDraft: () => void;
  canReviewDiff: boolean;
  canSaveDraft: boolean;
  compatibility?: string;
  persistenceStatus?: string;
  isDiagramFile?: boolean;
}

export const SafetySummary: React.FC<SafetySummaryProps> = ({
  currentFile,
  presentation,
  onReviewDiff,
  onSaveDraft,
  canReviewDiff,
  canSaveDraft,
  compatibility,
  persistenceStatus,
  isDiagramFile,
}) => {
  const blockedLabels = presentation.blockedActions.map(action => action.label).join(', ');
  const documentCapability = compatibility === 'fully-editable' || compatibility === 'partially-editable'
    ? 'visual-exact'
    : compatibility === 'read-only'
      ? 'code-preview'
      : compatibility === 'unsupported'
        ? 'invalid'
        : undefined;
  return (
    <section
      className={`border-b px-4 py-3 text-xs ${LEVEL_STYLES[presentation.level]}`}
      aria-live={presentation.level === 'error' ? 'assertive' : 'polite'}
      role={presentation.level === 'error' ? 'alert' : 'status'}
      aria-label="Estado de seguridad del editor"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-current/25 px-2 py-0.5 font-bold uppercase tracking-wider">
              {LEVEL_LABELS[presentation.level]}
            </span>
            <h2 className="font-serif text-sm font-bold text-carbon">{presentation.title}</h2>
            {currentFile && (
              <span className="truncate font-mono text-[10px] text-carbon/45">{currentFile}</span>
            )}
          </div>
          <p className="mt-1 max-w-5xl leading-snug text-carbon/70">{presentation.description}</p>
          <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[9px] select-none">
            {documentCapability && (
              <span className="rounded bg-carbon/10 px-1.5 py-0.5 font-semibold text-carbon" title="Capacidad real del documento">
                capacidad:{documentCapability}
              </span>
            )}
            {persistenceStatus && (
              <span className="rounded bg-carbon/10 px-1.5 py-0.5 font-semibold text-carbon" title="Estado de persistencia">
                persistence:{persistenceStatus === 'ready-clean' ? 'saved' : (persistenceStatus === 'saving-file' || persistenceStatus === 'saving-draft') ? 'saving' : persistenceStatus}
              </span>
            )}
            {isDiagramFile && (
              <span className="rounded bg-pavo/10 px-1.5 py-0.5 font-semibold text-pavo" title="Archivo de Diagrama TSX">
                diagram-file
              </span>
            )}
          </div>
          {presentation.reasons.length > 0 && (
            <ul className="mt-2 grid gap-1 text-carbon/70 sm:grid-cols-2">
              {presentation.reasons.slice(0, 4).map(reason => (
                <li key={reason.id} className="rounded border border-carbon/10 bg-lienzo/70 px-2 py-1">
                  <span className="font-bold text-carbon">{reason.title}: </span>
                  <span>{reason.description}</span>
                </li>
              ))}
            </ul>
          )}
          {blockedLabels && (
            <p className="mt-2 font-serif italic text-carbon/55">Bloqueado: {blockedLabels}.</p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={!canSaveDraft}
            className="rounded border border-carbon/20 bg-lienzo px-3 py-1 font-bold text-carbon hover:bg-carbon/5 disabled:cursor-not-allowed disabled:opacity-45"
            title={canSaveDraft ? 'Guardar borrador sin modificar el archivo real' : 'No hay cambios locales para guardar como borrador'}
          >
            Guardar borrador
          </button>
          <button
            type="button"
            onClick={onReviewDiff}
            disabled={!canReviewDiff}
            className="rounded bg-carbon px-3 py-1 font-bold text-lienzo hover:bg-carbon/85 disabled:cursor-not-allowed disabled:opacity-45"
            title={canReviewDiff ? 'Revisar cambios antes de aplicar' : 'No hay diff pendiente o la validación bloquea la revisión'}
          >
            Revisar diff
          </button>
        </div>
      </div>
    </section>
  );
};

export default SafetySummary;
