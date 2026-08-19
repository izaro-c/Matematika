import { Logo } from '@/components/ui/Logo';
import { useI18n } from '@/i18n';

/** Pantalla de espera de ruta / chunk MDX (no del diagrama). */
export function PageLoadingScreen({
  message,
  embedded = false,
}: {
  message?: string;
  /** Dentro de un layout ya montado (p. ej. columna de biografía). */
  embedded?: boolean;
}) {
  const { t } = useI18n();
  const displayMessage = message || t('common', 'queryingArchive');

  return (
    <div
      className={`page-loading${embedded ? ' page-loading--embedded' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={displayMessage}
    >
      <div className="page-loading__stage">
        <div className="page-loading__mark" aria-hidden="true">
          <Logo decorative className="page-loading__logo" />
        </div>
        <p className="page-loading__eyebrow">Matematika</p>
        <p className="page-loading__message">{displayMessage}</p>
        <div className="page-loading__rules" aria-hidden="true">
          <span className="page-loading__rule page-loading__rule--long" />
          <span className="page-loading__rule page-loading__rule--short" />
        </div>
      </div>
    </div>
  );
}
