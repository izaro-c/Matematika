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
 * Página de visualización de un Modelo Matemático concreto.
 * 
 * Un Modelo ilustra cómo se cumplen o violan ciertos axiomas formales en un entorno o "universo" específico.
 * Extrae la información de `ContentStore` y renderiza el contenido visual (simulación interactiva opcional).
 */
export function ModelPage() {
  const { id } = useParams();
  const { lang, getLocalizedPath, t } = useI18n();
  const slug = id || '';
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];
  const model = slug ? db.getModel(slug, lang) : undefined;
  const satisfiesIds = model ? (Array.isArray(model.satisfies) ? model.satisfies : [model.satisfies]).filter(Boolean) : [];
  const systems = satisfiesIds.map(sysId => db.getAxiomaticSystem(sysId, lang)).filter(Boolean);
  const primarySystem = systems[0];
  const verifiedAxioms = (model?.axioms_verified || []).map(axId => db.getAxiom(axId, lang)).filter(Boolean);

  const renderSecondaryContent = () => (
    <FadeIn>
      {systems.length > 0 && (
          <section className="mt-16">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-6 border-b border-carbon/10 pb-4">
              {systems.length > 1 ? `${t('content', 'axiomaticSystems')} (${systems.length})` : t('content', 'axiomaticSystem')}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {systems.map(sys => sys && (
                <ContentCard
                  key={sys.id}
                  href={getLocalizedPath(`/sistema/${sys.id}`)}
                  title={sys.title}
                  description={sys.description}
                  type="sistema-axiomatico"
                  layout="default"
                />
              ))}
            </div>
          </section>
        )}

        {verifiedAxioms.length > 0 && (
          <section className="mt-16">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-6 border-b border-carbon/10 pb-4">
              {`${t('content', 'verifiedAxioms')} (${verifiedAxioms.length})`}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {verifiedAxioms.map(ax => ax && (
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
    </FadeIn>
  );

  if (!model) {
    return (
      <div className="min-h-viewport flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">{t('notFound', 'title')}</h1>
        <p className="text-pizarra mb-6">{t('notFound', 'description')}</p>
      </div>
    );
  }

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
          backLink={primarySystem ? {
            href: getLocalizedPath(`/sistema/${primarySystem.id}`),
            label: `← ${t('content', 'axiomaticSystem')}: ${primarySystem.title}`,
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
        <ReadingButton id={model.id} />

      </FadeIn>
    </div>
  );

  return (
    <ContentLayout pageType="modelo" 
      diagram={(model.Simulation || model.Diagram) ? <ContentDiagram component={model.Simulation || model.Diagram} /> : undefined}
      secondary={renderSecondaryContent()}
      >
      {renderContent()}
    </ContentLayout>
  );
}
