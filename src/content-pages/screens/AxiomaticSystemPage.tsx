import { useParams } from 'wouter';
import { db } from '@/data/content';
import { ContentDiagram, ContentLayout } from '@/components/layouts/ContentLayout';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { ContentCard } from '@/components/ui/ContentCard';
import { SubtleSeparator } from '@/components/ui/SubtleSeparator';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { useI18n } from '@/i18n';

/**
 * Página para visualizar un Sistema Axiomático.
 *
 * Muestra el marco lógico (los axiomas de los que se compone),
 * y permite listar los Modelos concretos que lo satisfacen.
 */
export function AxiomaticSystemPage() {
  const { id } = useParams();
  const { lang, getLocalizedPath, t } = useI18n();
  const slug = id || '';
  const system = slug ? db.getAxiomaticSystem(slug, lang) : undefined;
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];

  if (!system) {
    return (
      <div className="min-h-viewport flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">{t('notFound', 'title')}</h1>
        <p className="text-pizarra mb-6">{t('notFound', 'description')}</p>
      </div>
    );
  }

  const axioms = (system.axiomas || []).map(axId => db.getAxiom(axId, lang)).filter(Boolean);
  const models = db.getModelsForSystem(system.id, lang);

  const breadcrumbs = db.getBreadcrumbs(
    system.branch || system.tags || (axioms[0] && (axioms[0].branch || axioms[0].tags)),
    { name: t('navigation', 'axioms'), href: getLocalizedPath('/axiomas') },
    lang,
  );

  const renderMainContent = () => (
    <div className="bg-transparent text-carbon font-serif pb-16">
      <FadeIn className="w-full px-6 md:px-12 pt-4">
        <ContentHeader
          type="sistema-axiomatico"
          title={system.title}
          description={system.description}
          breadcrumbs={breadcrumbs}
          authors={system.authors || []}
          nodeId={system.id}
        />

        {isFallback && (
          <UntranslatedFallbackBanner
            availableLangs={availableLangs}
            className="mb-8"
          />
        )}

        <ContentBody>
          <system.Component />
        </ContentBody>
        <ReadingButton id={system.id} />
      </FadeIn>
    </div>
  );

  const renderSecondaryContent = () => (
    <div className="w-full px-6 md:px-12 pb-32">
      <FadeIn>
        {axioms.length > 0 && (
          <section className="mt-16">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-8 border-b border-carbon/10 pb-4">
              {`${t('content', 'systemAxioms')} (${axioms.length})`}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {axioms.map(ax => ax && (
                <ContentCard
                  key={ax.id}
                  href={getLocalizedPath(`/axioma/${ax.id}`)}
                  title={ax.title}
                  description={ax.description}
                  type="axioma"
                  layout="default"
                />
              ))}
            </div>
          </section>
        )}

        {models.length > 0 && (
          <section className="mt-16">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-8 border-b border-carbon/10 pb-4">
              {`${t('content', 'modelsSatisfyingSystem')} (${models.length})`}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {models.map(m => (
                <ContentCard
                  key={m.id}
                  href={getLocalizedPath(`/modelo/${m.id}`)}
                  title={m.title}
                  description={m.description}
                  type="modelo"
                  layout="default"
                />
              ))}
            </div>
          </section>
        )}


      </FadeIn>
    </div>
  );

  return (
    <div className="min-h-viewport flex flex-col w-full">
      <ContentLayout 
        pageType="sistema-axiomatico" diagram={system.Simulation ? <ContentDiagram component={system.Simulation} /> : undefined}>
        {renderMainContent()}
      </ContentLayout>
      {renderSecondaryContent()}
    </div>
  );
}
