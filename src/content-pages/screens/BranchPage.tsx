import { useParams, Link } from 'wouter';
import { db } from '@/data/content';
import { mscNames, getMscName } from '@/data/content/msc2020';
import { getLibrarySection } from '@/data/content/librarySections';
import { NotFoundState } from '@/components/ui/NotFoundState';
import { VocabSection, VocabEntry } from '@/components/ui/Vocabulary';
import { getContentTypeLabel } from '@/lib/theme/constants';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';

type Entry = {
  type: string;
  item: { id: string; slug?: string; title?: string; description?: string };
  subBranchSlug?: string;
  subBranchSlugs: string[];
};

const ITEM_ROUTES: Record<string, string> = {
  theorem: 'teorema',
  definition: 'definicion',
  method: 'metodo',
  axiom: 'axioma',
  model: 'modelo',
  'axiomatic-system': 'sistema',
  exercise: 'ejercicio',
  example: 'ejemplo',
  usecase: 'caso',
  useCase: 'caso',
};

/** Tipo de contenido → clave de acento de página (el color de cada tipo). */
const ACCENT_TYPES: Record<string, string> = {
  theorem: 'teorema',
  definition: 'definicion',
  method: 'metodo',
  axiom: 'axioma',
  model: 'modelo',
  'axiomatic-system': 'sistema-axiomatico',
  exercise: 'ejercicio',
  example: 'ejemplo',
  usecase: 'caso-de-uso',
  useCase: 'caso-de-uso',
};

/** Orden deductivo: primero los sistemas y axiomas, luego lo que se construye sobre ellos. */
const TYPE_ORDER = ['axiomatic-system', 'axiom', 'definition', 'theorem', 'method', 'model', 'example', 'exercise', 'usecase', 'useCase'];

const itemHref = (entry: Entry) => {
  const route = ITEM_ROUTES[entry.type];
  if (!route) return '/';
  return `/${route}/${entry.type === 'method' ? entry.item.slug || entry.item.id : entry.item.id}`;
};

const typeLabelKey = (type: string) => (type === 'usecase' || type === 'useCase' ? 'use-case' : type);
const entryTitle = (entry: Entry) => entry.item.title || entry.item.id;
const isMscCode = (code: string) => /^\d{2}[A-Z]?$/i.test(code);

function groupByType(entries: Entry[]) {
  const groups = new Map<string, Entry[]>(TYPE_ORDER.map(type => [type, []]));
  for (const entry of entries) {
    if (!groups.has(entry.type)) groups.set(entry.type, []);
    groups.get(entry.type)!.push(entry);
  }
  return Array.from(groups.entries())
    .filter(([, list]) => list.length > 0)
    .map(([type, list]) => ({ type, list: [...list].sort((a, b) => entryTitle(a).localeCompare(entryTitle(b))) }));
}

/**
 * Página de una rama: capítulo del índice con el uñero de su rama de la biblioteca,
 * sus secciones como tomos encuadernados en esa tela y sus entradas como vocabulario
 * agrupado por tipo (la voz de /diccionario). Un código que no existe es un 404.
 */
export const BranchPage = () => {
  const { id } = useParams();
  const { getLocalizedPath, lang, t } = useI18n();
  const { isRead } = useProgressStore();
  const branchSlug = id || '';
  const taxonomy = db.getBranchTaxonomy(branchSlug, lang);

  if (!mscNames[taxonomy.id]) return <NotFoundState missingId={branchSlug} />;

  const section = getLibrarySection(taxonomy.id);
  const accent = section?.accent ?? 'carbon';
  const entries = taxonomy.directItems as unknown as Entry[];
  const readCount = entries.filter(entry => isRead(entry.item.id)).length;
  const parent = taxonomy.breadcrumbs[taxonomy.breadcrumbs.length - 1];
  const showCode = isMscCode(taxonomy.id);

  const tomeCounts = new Map<string, number>();
  for (const entry of entries) {
    for (const slug of entry.subBranchSlugs) tomeCounts.set(slug, (tomeCounts.get(slug) ?? 0) + 1);
  }
  const tomes = [...taxonomy.subBranches].sort((a, b) => a.slug.localeCompare(b.slug, undefined, { numeric: true }));

  const countLabel = (count: number) =>
    count === 1 ? t('branch', 'entryCount', { count }) : t('library', 'entriesCount', { count });

  return (
    <main className="ac-page bg-arts-and-crafts">
      <div
        className="ac-branch"
        data-accent={accent}
        style={{ ['--acc' as string]: `var(--theme-${accent})`, ['--acc-cloth' as string]: `var(--cloth-${accent})` }}
      >
        <header className="ac-chapter ac-branch__head" data-accent={accent}>
          {section && (
            <Link href={getLocalizedPath(`/rama/${section.slug}`)} className="ac-chapter__tab" aria-label={getMscName(section.slug, lang)}>
              <span className="ac-chapter__cloth">
                <span className="ac-chapter__symbol" aria-hidden="true">{section.symbol}</span>
                <span className="ac-chapter__numeral" aria-hidden="true">{section.key}</span>
              </span>
            </Link>
          )}
          <div className="ac-branch__head-body">
            <nav className="ac-branch__crumbs ac-rubric" aria-label={t('accessibility', 'breadcrumb')}>
              <Link href={getLocalizedPath('/')} className="ac-ink-underline">{t('topbar', 'backToLibrary')}</Link>
              {taxonomy.breadcrumbs.map(crumb => (
                <span key={crumb.slug}>
                  {' · '}
                  <Link href={getLocalizedPath(`/rama/${crumb.slug}`)} className="ac-ink-underline">{crumb.name}</Link>
                </span>
              ))}
            </nav>
            <h1 className="ac-branch__title">{taxonomy.name || taxonomy.id}</h1>
            {(showCode || entries.length > 0) && (
              <p className="ac-branch__meta ac-rubric">
                {showCode && <span className="ac-branch__num">{taxonomy.id}</span>}
                {showCode && entries.length > 0 && ' · '}
                {entries.length > 0 && countLabel(entries.length)}
                {readCount > 0 && <> · {t('library', 'read')} <strong>{readCount}</strong></>}
              </p>
            )}
          </div>
        </header>

        {entries.length === 0 && (
          <p className="ac-branch__empty">
            {t('branch', 'noEntries')}
            {parent && (
              <>
                {' '}{t('branch', 'see')}{' '}
                <Link href={getLocalizedPath(`/rama/${parent.slug}`)} className="ac-ink-underline">{parent.name}</Link>.
              </>
            )}
          </p>
        )}

        {tomes.length > 0 && (
          <nav className="ac-tomes" aria-label={t('branch', 'volumes')}>
            {tomes.map(tome => {
              const count = tomeCounts.get(tome.slug) ?? 0;
              return (
                <Link key={tome.slug} href={getLocalizedPath(`/rama/${tome.slug}`)} className="ac-tome" data-empty={count === 0 || undefined}>
                  <span className="ac-tome__body">
                    <span className="ac-tome__title">{tome.name}</span>
                    {isMscCode(tome.slug) && <span className="ac-tome__code">{tome.slug}</span>}
                    <span className="ac-tome__count">{count > 0 ? countLabel(count) : t('library', 'inProgress')}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        )}

        {groupByType(entries).map(({ type, list }) => (
          <VocabSection key={type} heading={getContentTypeLabel(typeLabelKey(type), 'plural', lang)} accentType={ACCENT_TYPES[type]} count={list.length}>
            {list.map(entry => (
              <VocabEntry
                key={entry.item.id}
                href={getLocalizedPath(itemHref(entry))}
                title={entryTitle(entry)}
                description={entry.item.description}
                read={isRead(entry.item.id)}
                aside={entry.subBranchSlug && isMscCode(entry.subBranchSlug) ? entry.subBranchSlug : undefined}
                asideTitle={entry.subBranchSlug ? getMscName(entry.subBranchSlug, lang) : undefined}
              />
            ))}
          </VocabSection>
        ))}
      </div>
    </main>
  );
};
