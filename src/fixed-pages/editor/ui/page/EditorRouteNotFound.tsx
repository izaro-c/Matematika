import React from 'react';
import { useI18n } from '@/i18n';

export interface EditorRouteNotFoundProps {
  /** Parte de la ruta tras `/editor/` que no corresponde a ningún recurso. */
  requested: string;
  onBack: () => void;
  /** Si el catálogo no se pudo cargar, la ruta no se puede resolver: se ofrece reintentar. */
  onRetry?: () => void;
}

/** Estado vacío para una URL del editor que no apunta a ningún documento ni diagrama. */
export const EditorRouteNotFound: React.FC<EditorRouteNotFoundProps> = ({ requested, onBack, onRetry }) => {
  const { t } = useI18n();
  return (
    <main
      role="alert"
      className="flex flex-1 items-center justify-center bg-lienzo px-4 font-serif text-carbon"
    >
      <div className="max-w-md rounded-2xl border border-carbon/15 bg-lienzo/80 p-6 text-center shadow-sm">
        <h1 className="text-xl font-bold">
          {onRetry ? t('editor.nav.catalogLoadError') : t('editor.nav.routeNotFoundTitle')}
        </h1>
        <p className="mt-2 text-sm text-carbon/70">
          <code className="rounded bg-carbon/5 px-1 font-mono text-xs">{requested}</code>
        </p>
        {!onRetry && <p className="mt-2 text-sm text-carbon/70">{t('editor.nav.routeNotFoundBody')}</p>}
        <div className="mt-5 flex justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl bg-canela px-5 py-2.5 text-sm font-bold text-lienzo hover:bg-canela/90 focus-visible:outline-2 focus-visible:outline-canela cursor-pointer"
            >
              {t('editor.common.retry')}
            </button>
          )}
          <button
            type="button"
            onClick={onBack}
            className={onRetry
              ? 'rounded-xl border border-carbon/20 px-5 py-2.5 text-sm font-bold text-carbon hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-canela cursor-pointer'
              : 'rounded-xl bg-canela px-5 py-2.5 text-sm font-bold text-lienzo hover:bg-canela/90 focus-visible:outline-2 focus-visible:outline-canela cursor-pointer'}
          >
            {t('editor.nav.backToCatalog')}
          </button>
        </div>
      </div>
    </main>
  );
};
