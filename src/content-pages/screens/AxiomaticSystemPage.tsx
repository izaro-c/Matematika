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
 * Página para visualizar un Sistema Axiomático.
 *
 * Muestra el marco lógico (los axiomas de los que se compone),
 * y permite listar los Modelos concretos que lo satisfacen.
 */
export function AxiomaticSystemPage() {
  const { id } = useParams();
  const { lang, getLocalizedPath, t } = useI18n();
  const { isRead } = useProgressStore();
  const slug = id || '';
  const system = slug ? db.getAxiomaticSystem(slug, lang) : undefined;
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];

  if (!system) {
    return <NotFoundState />;
  }

  const axioms = (system.axiomas || []).map(axId => db.getAxiom(axId, lang)).filter(Boolean);
  const models = db.getModelsForSystem(system.id, lang);
  const baseSystems = (system.extends || []).map(sysId => db.getAxiomaticSystem(sysId, lang)).filter(Boolean);
  const extensions = db.getAllAxiomaticSystems(lang).filter(s => s.extends?.includes(system.id));

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
        {baseSystems.length > 0 && (
          <VocabSection heading={t('content', 'extendedSystems')} accentType="sistema-axiomatico" count={baseSystems.length} className="mt-16">
            {baseSystems.map(sys => sys && (
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

        {axioms.length > 0 && (
          <VocabSection heading={t('content', 'systemAxioms')} accentType="axioma" count={axioms.length} className="mt-16">
            {axioms.map(ax => ax && (
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

        {models.length > 0 && (
          <VocabSection heading={t('content', 'modelsSatisfyingSystem')} accentType="modelo" count={models.length} className="mt-16">
            {models.map(m => m && (
              <VocabEntry
                key={m.id}
                href={getLocalizedPath(`/modelo/${m.id}`)}
                title={m.title}
                description={m.description}
                read={isRead(m.id)}
              />
            ))}
          </VocabSection>
        )}

        {extensions.length > 0 && (
          <VocabSection heading={t('content', 'systemExtensions')} accentType="sistema-axiomatico" count={extensions.length} className="mt-16">
            {extensions.map(sys => (
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
