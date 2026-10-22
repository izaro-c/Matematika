import { useParams } from 'wouter';
import { db } from '@/data/content';
import { ContentDiagram, ContentLayout } from '@/components/layouts/ContentLayout';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { VocabSection, VocabEntry } from '@/components/ui/Vocabulary';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';
import { NotFoundState } from '@/components/ui/NotFoundState';

/**
 * Página de visualización de un Modelo Matemático concreto.
 * 
 * Un Modelo ilustra cómo se cumplen o violan ciertos axiomas formales en un entorno o "universo" específico.
 * Extrae la información de `ContentStore` y renderiza el contenido visual (simulación interactiva opcional).
 */
export function ModelPage() {
  const { id } = useParams();
  const { lang, getLocalizedPath, t } = useI18n();
  const { isRead } = useProgressStore();
  const slug = id || '';
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];
  const model = slug ? db.getModel(slug, lang) : undefined;
  const satisfiesIds = model ? (Array.isArray(model.satisfies) ? model.satisfies : [model.satisfies]).filter(Boolean) : [];
  const systems = satisfiesIds.map(sysId => db.getAxiomaticSystem(sysId, lang)).filter(Boolean);
  const primarySystem = systems[0];
  const baseTheory = model?.builtIn ? db.getAxiomaticSystem(model.builtIn, lang) : undefined;
  const verifiedAxioms = (model?.axioms_verified || []).map(axId => db.getAxiom(axId, lang)).filter(Boolean);

  const renderSecondaryContent = () => (
    <FadeIn>
      {systems.length > 0 && (
          <VocabSection heading={systems.length > 1 ? t('content', 'axiomaticSystems') : t('content', 'axiomaticSystem')} accentType="sistema-axiomatico" count={systems.length} className="mt-16">
            {systems.map(sys => sys && (
              <VocabEntry
                key={sys.id}
                href={getLocalizedPath(`/sistema/${sys.id}`)}
                title={sys.title}
                description={sys.description}
                read={isRead(sys.id)}
              />
            ))}
          </VocabSection>
        )}

        {baseTheory && (
          <VocabSection heading={t('content', 'modelBaseTheory')} accentType="sistema-axiomatico" count={1} className="mt-16">
            <VocabEntry
              href={getLocalizedPath(`/sistema/${baseTheory.id}`)}
              title={baseTheory.title}
              description={baseTheory.description}
              read={isRead(baseTheory.id)}
            />
          </VocabSection>
        )}

        {verifiedAxioms.length > 0 && (
          <VocabSection heading={t('content', 'verifiedAxioms')} accentType="axioma" count={verifiedAxioms.length} className="mt-16">
            {verifiedAxioms.map(ax => ax && (
              <VocabEntry
                key={ax.id}
                href={getLocalizedPath(`/axioma/${ax.id}`)}
                title={ax.title}
                description={ax.description}
                read={isRead(ax.id)}
              />
            ))}
          </VocabSection>
        )}
    </FadeIn>
  );

  if (!model) {
    return <NotFoundState />;
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
