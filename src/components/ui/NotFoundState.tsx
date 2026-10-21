import React, { useMemo } from 'react';
import Fuse from 'fuse.js';
import { Link, useLocation } from 'wouter';
import { getSearchIndex, SEARCH_FUSE_OPTIONS } from '@/data/content/searchApi';
import { getContentTypeLabel } from '@/lib/theme/constants';
import { useNavigationStore } from '@/lib/stores/NavigationStore';
import { useI18n } from '@/i18n';

interface NotFoundStateProps {
  /** Identificador pedido; por defecto, el último tramo de la ruta. */
  missingId?: string;
}

const MAX_SUGGESTIONS = 4;

/** Convierte un identificador o una ruta en una consulta legible: «teorema-de-pitagora» → «teorema de pitagora». */
export const queryFromPath = (path: string): string => {
  const last = path.split('/').filter(Boolean).pop() ?? '';
  let decoded = last;
  try { decoded = decodeURIComponent(last); } catch { /* se queda sin decodificar */ }
  return decoded.replace(/[-_]+/g, ' ').trim();
};

/**
 * Página no encontrada con la voz del índice: «No hay ninguna entrada para «…»»,
 * las coincidencias más cercanas del buscador bajo «véase» y el 404 como folio al pie.
 */
export const NotFoundState: React.FC<NotFoundStateProps> = ({ missingId }) => {
  const { lang, t, getLocalizedPath } = useI18n();
  const [location] = useLocation();
  const { openSearch } = useNavigationStore();
  const query = queryFromPath(missingId ?? location);

  const suggestions = useMemo(() => {
    if (query.length < 2) return [];
    const index = getSearchIndex(lang).filter(item => item.href && item.type !== 'glosario' && item.type !== 'msc2020');
    return new Fuse(index, SEARCH_FUSE_OPTIONS).search(query).slice(0, MAX_SUGGESTIONS).map(result => result.item);
  }, [lang, query]);

  return (
    <main className="ac-page bg-arts-and-crafts ac-notfound">
      <div className="ac-notfound__sheet">
        <h1 className="ac-notfound__title">
          {query ? t('notFound', 'noEntry', { query }) : t('notFound', 'title')}
        </h1>
        <p className="ac-notfound__lead">{t('notFound', 'hint')}</p>

        {suggestions.length > 0 && (
          <>
            <h2 className="ac-notfound__see ac-rubric">{t('notFound', 'seeAlso')}</h2>
            <ul className="ac-notfound__list">
              {suggestions.map(item => (
                <li key={item.href}>
                  <Link href={getLocalizedPath(item.href)} className="ac-notfound__row ac-ink-trigger">
                    <span className="ac-notfound__row-title"><span className="ac-ink-underline">{item.title}</span></span>
                    <span className="ac-chapter__dots" aria-hidden="true" />
                    <span className="ac-rubric">{getContentTypeLabel(item.type, 'singular', lang)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="ac-notfound__actions ac-rubric">
          <Link href={getLocalizedPath('/')} className="ac-ink-underline">{t('notFound', 'backHome')}</Link>
          <span aria-hidden="true"> · </span>
          <button type="button" onClick={openSearch} className="ac-ink-underline">{t('notFound', 'search')}</button>
        </p>
      </div>
      <p className="ac-notfound__folio" aria-label={t('notFound', 'folioLabel')}>404</p>
    </main>
  );
};
