import { Link } from 'wouter';
import { db } from '@/data/content';
import { getMscName } from '@/data/content/msc2020';
import { getContentTypeLabel } from '@/lib/theme/constants';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';

type SectionKey = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';

interface SectionDef {
  key: SectionKey;
  slug: string;
  codes: string[];
  groups: { id: string; codes: string[] }[];
  accent: 'musgo' | 'carbon' | 'mora' | 'terracota' | 'canela' | 'pavo' | 'granada';
  symbol: string;
}

const SECTIONS: SectionDef[] = [
  { key: 'I', slug: 'fundamentos-y-logica', codes: ['03', '08'], groups: [], accent: 'musgo', symbol: '⊢' },
  {
    key: 'II',
    slug: 'algebra-y-teoria-de-numeros',
    codes: ['11', '15', '14', '12', '13', '18', '20'],
    groups: [
      { id: 'geometria-algebraica', codes: ['14'] },
      { id: 'algebra-abstracta', codes: ['12', '13'] },
      { id: 'teoria-de-grupos-y-categorias', codes: ['18', '20'] },
    ],
    accent: 'carbon',
    symbol: '⊕',
  },
  {
    key: 'III',
    slug: 'analisis-matematico',
    codes: ['26', '30', '34', '46'],
    groups: [
      { id: 'analisis-real-y-funciones', codes: ['26'] },
      { id: 'analisis-complejo', codes: ['30'] },
      { id: 'ecuaciones-diferenciales', codes: ['34'] },
      { id: 'analisis-funcional-y-armonico', codes: ['46'] },
    ],
    accent: 'mora',
    symbol: '∫',
  },
  {
    key: 'IV',
    slug: 'geometria-y-topologia',
    codes: ['51', '53', '54', '55'],
    groups: [
      { id: 'geometria-clasica-y-diferencial', codes: ['51', '53'] },
      { id: 'topologia-general-y-algebraica', codes: ['54', '55'] },
    ],
    accent: 'terracota',
    symbol: '△',
  },
  { key: 'V', slug: 'matematica-discreta-y-computacional', codes: ['05', '68'], groups: [], accent: 'canela', symbol: '∑' },
  {
    key: 'VI',
    slug: 'probabilidad-estadistica-y-aplicaciones',
    codes: ['49', '60', '62', '65', '70', '74', '76', '78', '80', '81', '82', '83', '85', '86', '90', '91', '92'],
    groups: [
      { id: 'optimizacion-y-teoria-de-juegos', codes: ['49', '90', '91'] },
      { id: 'fisica-matematica-y-biologia', codes: ['70', '74', '76', '78', '80', '81', '82', '83', '85', '86', '92'] },
    ],
    accent: 'pavo',
    symbol: '⨀',
  },
  { key: 'VII', slug: 'metadatos-y-divulgacion', codes: ['00', '01', '97'], groups: [], accent: 'granada', symbol: '∞' },
];

const ITEM_ROUTES: Record<string, string> = {
  theorem: 'teorema',
  definition: 'definicion',
  method: 'metodo',
  axiom: 'axioma',
  model: 'modelo',
  exercise: 'ejercicio',
  example: 'ejemplo',
  useCase: 'caso',
};

const itemHref = (entry: { type: string; item: { id: string; slug?: string } }) => {
  const route = ITEM_ROUTES[entry.type];
  return route ? `/${route}/${entry.item.slug || entry.item.id}` : '/';
};

const PREVIEW_COUNT = 5;

function sortCodes(codes: string[]) {
  return [...codes].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export const BranchLibrary = () => {
  const { readConcepts, completedExercises } = useProgressStore();
  const { t, getLocalizedPath, lang } = useI18n();

  const totalEntries = db.getAllDefinitions(lang).length + db.theorems.size;

  const chapters = SECTIONS.map((section, index) => {
    const seen = new Map<string, { type: string; item: { id: string; slug?: string; title?: string } }>();
    for (const entry of section.codes.flatMap(code => db.getItemsByBranch(code, lang))) {
      if (!seen.has(entry.item.id)) seen.set(entry.item.id, entry);
    }
    const items = Array.from(seen.values());
    const href = getLocalizedPath(`/rama/${section.slug}`);

    return (
      <section
        key={section.slug}
        className="ac-chapter"
        data-accent={section.accent}
        style={{
          ['--acc' as string]: `var(--theme-${section.accent})`,
          ['--acc-cloth' as string]: `var(--cloth-${section.accent})`,
          order: index,
        }}
      >
        {/* El uñero repite el enlace del título para el ratón; el teclado usa el título */}
        <Link href={href} className="ac-chapter__tab" tabIndex={-1} aria-hidden="true">
          <span className="ac-chapter__cloth">
            <span className="ac-chapter__symbol">{section.symbol}</span>
            <span className="ac-chapter__numeral">{section.key}</span>
          </span>
        </Link>

        <h3 className="ac-chapter__title-row">
          <Link href={href} className="ac-chapter__title ac-ink-underline">
            {t('library', `section${section.key}`)}
          </Link>
        </h3>

        <div className="ac-chapter__body">
          <p className="ac-chapter__desc">{t('library', `section${section.key}Desc`)}</p>

          <p className="ac-chapter__subs">
            {section.groups.map(group => (
              <span key={group.id} className="ac-ink-trigger">
                <Link href={getLocalizedPath(`/rama/${group.id}`)} className="ac-ink-underline">
                  {getMscName(group.id, lang)}
                </Link>
                {' · '}
              </span>
            ))}
            <span className="ac-chapter__codes ac-rubric">
              {sortCodes(section.codes).map((code, i) => (
                <span key={code} className="ac-ink-trigger">
                  {i > 0 && ' · '}
                  <Link href={getLocalizedPath(`/rama/${code}`)} title={getMscName(code, lang)} className="ac-ink-underline">
                    {code}
                  </Link>
                </span>
              ))}
            </span>
          </p>

          {items.length > 0 ? (
            <div className="ac-chapter__list">
              {items.slice(0, PREVIEW_COUNT).map(entry => (
                <Link key={entry.item.id} href={getLocalizedPath(itemHref(entry))} className="ac-chapter__row ac-ink-trigger">
                  <span className="ac-chapter__row-title">
                    <span className="ac-ink-underline">{entry.item.title || entry.item.id}</span>
                  </span>
                  <span className="ac-chapter__dots" aria-hidden="true" />
                  <span className="ac-chapter__type ac-rubric">
                    {getContentTypeLabel(entry.type === 'useCase' ? 'use-case' : entry.type, 'singular', lang)}
                  </span>
                </Link>
              ))}
              {items.length > PREVIEW_COUNT && (
                <Link href={href} className="ac-chapter__more ac-ink-trigger">
                  <span className="ac-ink-underline">{t('library', 'seeMore', { count: items.length - PREVIEW_COUNT })}</span>
                </Link>
              )}
            </div>
          ) : (
            <p className="ac-chapter__empty">{t('library', 'inProgress')}</p>
          )}
        </div>
      </section>
    );
  });

  return (
    <main className="ac-library max-w-5xl mx-auto px-4 sm:px-8 py-16">
      <div className="ac-library__head">
        <h2 className="ac-library__heading">{t('library', 'title')}</h2>
        <div className="ac-library__meta ac-rubric">
          <span>
            {t('library', 'sectionsCount', { count: SECTIONS.length })} · {t('library', 'entriesCount', { count: totalEntries })}
          </span>
          <span aria-hidden="true">·</span>
          <span>{t('library', 'read')} <strong>{readConcepts.length}</strong></span>
          <span>{t('library', 'exercises')} <strong>{completedExercises.length}</strong></span>
        </div>
      </div>

      {/* Dos pilas alternas: I III V VII | II IV VI */}
      <div className="ac-library__grid">
        <div className="ac-library__stack">{chapters.filter((_, i) => i % 2 === 0)}</div>
        <div className="ac-library__stack">{chapters.filter((_, i) => i % 2 === 1)}</div>
      </div>
    </main>
  );
};
