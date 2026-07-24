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

function readablePersistenceStatus(status: string | undefined): string | undefined {
  if (status === 'ready-clean') return 'guardado';
  if (status === 'saving-file' || status === 'saving-draft') return 'guardando';
  return status;
}

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
  showTechnicalDetails?: boolean;
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
  showTechnicalDetails = false,
}) => {
  const blockedLabels = presentation.blockedActions.map(action => action.label).join(', ');
  let documentCapability: string | undefined;
  if (compatibility === 'fully-editable' || compatibility === 'partially-editable') documentCapability = 'visual-exact';
  if (compatibility === 'read-only') documentCapability = 'code-preview';
  if (compatibility === 'unsupported') documentCapability = 'invalid';
  const persistenceLabel = readablePersistenceStatus(persistenceStatus);
  return (
    <section
      className={`relative z-20 border-b px-3 py-2 text-xs ${LEVEL_STYLES[presentation.level]}`}
      aria-live={presentation.level === 'error' ? 'assertive' : 'polite'}
      role={presentation.level === 'error' ? 'alert' : 'status'}
      aria-label="Estado de seguridad del editor"
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 ac-editor-badge rounded border border-current/25 px-2 py-0.5">
          {LEVEL_LABELS[presentation.level]}
        </span>
        <h2 className="shrink-0 font-serif text-xs font-bold text-carbon">{presentation.title}</h2>
        <p className="hidden min-w-0 flex-1 truncate text-[10px] text-carbon/65 sm:block">{presentation.description}</p>
        {(canSaveDraft || canReviewDiff) && <span className="hidden h-2 w-2 shrink-0 rounded-full bg-ocre sm:block" aria-label="Hay acciones de seguridad disponibles" />}
        <details className="group ml-auto shrink-0">
          <summary className="cursor-pointer list-none rounded border border-current/20 bg-lienzo/70 px-2 py-1 text-[10px] font-bold text-carbon/65 hover:bg-lienzo focus-visible:outline focus-visible:outline-2 focus-visible:outline-current [&::-webkit-details-marker]:hidden">
            Detalles <span aria-hidden="true">▾</span>
          </summary>
          <div className="absolute left-0 right-0 top-full grid gap-3 border-b border-t border-current/15 bg-lienzo p-3 text-carbon/70 shadow-lg lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <p className="leading-snug">{presentation.description}</p>
              {currentFile && <p className="mt-1 truncate font-mono text-[9px] text-carbon/45">{currentFile}</p>}
              {showTechnicalDetails && <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[9px] select-none">
                {documentCapability && <span className="rounded bg-carbon/10 px-1.5 py-0.5 font-semibold text-carbon">capacidad: {documentCapability}</span>}
                {persistenceLabel && <span className="rounded bg-carbon/10 px-1.5 py-0.5 font-semibold text-carbon">persistencia: {persistenceLabel}</span>}
                {isDiagramFile && <span className="rounded bg-pavo/10 px-1.5 py-0.5 font-semibold text-pavo">archivo de diagrama</span>}
              </div>}
              {presentation.reasons.length > 0 && <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {presentation.reasons.slice(0, 4).map(reason => <li key={reason.id} className="rounded border border-carbon/10 bg-lienzo/70 px-2 py-1"><span className="font-bold text-carbon">{reason.title}: </span>{reason.description}</li>)}
              </ul>}
              {blockedLabels && <p className="mt-2 font-serif italic text-carbon/55">Bloqueado: {blockedLabels}.</p>}
            </div>
            <div className="flex shrink-0 flex-wrap items-start gap-2">
              <button type="button" onClick={onSaveDraft} disabled={!canSaveDraft} className="rounded border border-carbon/20 bg-lienzo px-3 py-1.5 font-bold text-carbon hover:bg-carbon/5 disabled:cursor-not-allowed disabled:opacity-45" title={canSaveDraft ? 'Guardar borrador sin modificar el archivo real' : 'No hay cambios locales para guardar como borrador'}>Guardar borrador</button>
              <button type="button" onClick={onReviewDiff} disabled={!canReviewDiff} className="rounded bg-carbon px-3 py-1.5 font-bold text-lienzo hover:bg-carbon/85 disabled:cursor-not-allowed disabled:opacity-45" title={canReviewDiff ? 'Revisar cambios antes de aplicar' : 'No hay diff pendiente o la validación bloquea la revisión'}>Revisar diff</button>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
};

export default SafetySummary;
