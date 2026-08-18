import { useParams } from 'wouter';
import { db } from '@/data/content';
import { ContentDiagram, ContentLayout } from '@/components/layouts/ContentLayout';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { ContentCard } from '@/components/ui/ContentCard';
import { SubtleSeparator } from '@/components/ui/SubtleSeparator';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { useI18n } from '@/i18n';

/**
 * Página de visualización de un Modelo Matemático concreto.
 * 
 * Un Modelo ilustra cómo se cumplen o violan ciertos axiomas formales en un entorno o "universo" específico.
 * Extrae la información de `ContentStore` y renderiza el contenido visual (simulación interactiva opcional).
 */
export function ModelPage() {
  const { id } = useParams();
  const { lang, getLocalizedPath, t } = useI18n();
  const slug = id || '';
  const model = slug ? db.getModel(slug, lang) : undefined;
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];

  if (!model) {
    return (
      <div className="min-h-viewport flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">{t('notFound', 'title')}</h1>
        <p className="text-pizarra mb-6">{t('notFound', 'description')}</p>
      </div>
    );
  }

  const satisfiesId = Array.isArray(model.satisfies) ? model.satisfies[0] : model.satisfies;
  const system = satisfiesId ? db.getAxiomaticSystem(satisfiesId, lang) : undefined;
  const verifiedAxioms = (model.axioms_verified || []).map(axId => db.getAxiom(axId, lang)).filter(Boolean);

  const breadcrumbs = db.getBreadcrumbs(
    model.branch || model.tags || (verifiedAxioms[0] && (verifiedAxioms[0].branch || verifiedAxioms[0].tags)),
    { name: t('navigation', 'axioms'), href: getLocalizedPath('/axiomas') },
    lang,
  );

  const renderContent = () => (
    <div className="min-h-viewport bg-transparent text-carbon font-serif pb-32">
      <FadeIn className="w-full px-6 md:px-12 pt-4 pb-16">
        <ContentHeader
          type="modelo"
          title={model.title}
          description={model.description}
          breadcrumbs={breadcrumbs}
          tags={model.tags || []}
          nodeId={model.id}
          backLink={system ? {
            href: getLocalizedPath(`/sistema/${system.id}`),
            label: `← ${t('content', 'axiomaticSystem')}: ${system.title}`,
          } : undefined}
        />

        {isFallback && (
          <UntranslatedFallbackBanner
            availableLangs={availableLangs}
            className="mb-8"
          />
        )}

        <ContentBody>
          <model.Component />
        </ContentBody>

        {system && (
          <section className="mt-16">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-6 border-b border-carbon/10 pb-4">
              {t('content', 'axiomaticSystem')}
            </h2>
            <ContentCard
              href={getLocalizedPath(`/sistema/${system.id}`)}
              title={system.title}
              description={system.description}
              type="sistema-axiomatico"
              layout="row"
            />
          </section>
        )}

        {verifiedAxioms.length > 0 && (
          <section className="mt-16">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-6 border-b border-carbon/10 pb-4">
              {`${t('content', 'verifiedAxioms')} (${verifiedAxioms.length})`}
            </h2>
            <div className="flex flex-col gap-3 max-w-2xl">
              {verifiedAxioms.map(ax => ax && (
                <ContentCard
                  key={ax.id}
                  href={getLocalizedPath(`/axioma/${ax.id}`)}
                  title={ax.title}
                  description={ax.description}
                  type="axioma"
                  layout="row"
                />
              ))}
            </div>
          </section>
        )}
      </FadeIn>
    </div>
  );

  return (
    <ContentLayout pageType="modelo" diagram={(model.Simulation || model.Diagram) ? <ContentDiagram component={model.Simulation || model.Diagram} /> : undefined}>
      {renderContent()}
    </ContentLayout>
  );
}
