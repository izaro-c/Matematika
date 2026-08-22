import { useParams, Link } from 'wouter';
import { db } from '@/data/content';
import { TaxonomyGraph } from '@/content-pages/study-plan/ui/TaxonomyGraph';
import { EmptyState } from '@/components/ui/EmptyState';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContentCard } from '@/components/ui/ContentCard';
import { useI18n } from '@/i18n';

/**
 * Página principal de una Rama (ej. "Álgebra Lineal").
 * Renderiza la red/taxonomía completa de temas, métodos y teoremas.
 * asociados a esta rama en un grafo interactivo.
 */
export const BranchPage = () => {
  const { id } = useParams();
  const { getLocalizedPath, lang, t } = useI18n();
  const branchSlug = id || '';

  const taxonomy = db.getBranchTaxonomy(branchSlug, lang);

  return (
    <div className="ac-page pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">

        {/* Navegación por Migas de Pan (Breadcrumbs) */}
        <div className="mb-12">
          <Breadcrumbs 
            crumbs={[
              ...taxonomy.breadcrumbs.map(crumb => ({ name: crumb.name, href: getLocalizedPath(`/rama/${crumb.slug}`) })),
              { name: taxonomy.name || taxonomy.id || branchSlug }
            ]} 
          />
        </div>

        <div className="mb-16 border-b border-carbon/10 pb-8">
          <div className="flex items-baseline gap-4">
            {taxonomy.id && /^\d{2}[A-Z]?$/.test(taxonomy.id) && taxonomy.id !== taxonomy.name && (
              <span className="text-2xl font-[ui-sans-serif,system-ui,-apple-system,sans-serif] font-bold text-carbon/40 tracking-wider">{taxonomy.id}</span>
            )}
            <h1 className="text-5xl font-bold tracking-tight">
              {taxonomy.name || taxonomy.id || branchSlug}
            </h1>
          </div>
        </div>

        {taxonomy.subBranches.length === 0 && taxonomy.directItems.length === 0 ? (
          <EmptyState
            message={t('notFound', 'description')}
            actionLabel={t('topbar', 'backToLibrary')}
            actionHref={getLocalizedPath('/')}
          />
        ) : (
          <div className="flex flex-col gap-16">

            {/* Gráfico Interactivo de Dependencias */}
            <div className="w-full">
              <TaxonomyGraph taxonomy={taxonomy} />
            </div>

            {/* Sub-ramas (Carpetas) */}
            {taxonomy.subBranches.length > 0 && (
              <div>
                <h2 className="ac-eyebrow ac-eyebrow--md text-carbon/50 mb-6">{t('content', 'subBranches')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {taxonomy.subBranches.map(sub => (
                    <Link
                      key={sub.slug}
                      href={getLocalizedPath(`/rama/${sub.slug}`)}
                      className="group flex items-center justify-between p-6 elegant-panel"
                      style={{ ['--hover-accent' as string]: 'var(--theme-mora)' }}
                    >
                      <span className="flex items-baseline gap-3">
                        {/^\d{2}[A-Z]?$/.test(sub.slug) && (
                          <span className="text-base font-[ui-sans-serif,system-ui,-apple-system,sans-serif] font-bold text-carbon/40">{sub.slug}</span>
                        )}
                        <span className="text-xl font-bold">{sub.name}</span>
                      </span>
                      <span className="text-xs font-sans tracking-widest opacity-50 group-hover:opacity-100 text-mora">
                        {t('content', 'explore')} →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Conceptos Directos (Archivos) */}
            {taxonomy.directItems.length > 0 && (
              <div>
                <h2 className="ac-eyebrow ac-eyebrow--md text-carbon/50 mb-6">{t('content', 'fundamentalConcepts')}</h2>
                <div className="flex flex-col gap-4">
                  {taxonomy.directItems.map((entry, idx) => {
                    let link = '/';
                    if (entry.type === 'method') link = `/metodo/${entry.item.slug}`;
                    else if (entry.type === 'theorem') link = `/teorema/${entry.item.id}`;
                    else if (entry.type === 'definition') link = `/definicion/${entry.item.id}`;
                    else if (entry.type === 'axiom') link = `/axioma/${entry.item.id}`;
                    else if (entry.type === 'model') link = `/modelo/${entry.item.id}`;
                    else if (entry.type === 'axiomatic-system') link = `/sistema/${entry.item.id}`;
                    else if (entry.type === 'usecase' || entry.type === 'useCase') link = `/caso/${entry.item.id}`;

                    const typeMap: Record<string, string> = {
                      'theorem': 'teorema',
                      'definition': 'definicion',
                      'method': 'metodo',
                      'exercise': 'ejercicio',
                      'example': 'ejemplo',
                      'useCase': 'caso-de-uso',
                      'usecase': 'caso-de-uso',
                      'axiom': 'axioma',
                      'model': 'modelo',
                      'axiomatic-system': 'sistema-axiomatico',
                    };
                    const mappedType = typeMap[entry.type] || entry.type;

                    return (
                      <ContentCard
                        key={idx}
                        href={getLocalizedPath(link)}
                        title={(entry.item as unknown as Record<string, unknown>).title as string || entry.item.id}
                        description={(entry.item as unknown as Record<string, unknown>).description as string || ''}
                        type={mappedType}
                        layout="row"
                      />
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
