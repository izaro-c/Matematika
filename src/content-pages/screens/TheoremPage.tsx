import type { Demo, Theorem } from '@/data/content/types';
import { useParams } from "wouter";
import { db } from "@/data/content";
import { ContentLayout } from "@/components/layouts/ContentLayout";
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentCard } from '@/components/ui/ContentCard';
import { ContentHeader } from '@/components/content/ContentHeader';
import { DiagramSlot } from '@/components/ui/skeletons';
import { ContentBody } from '@/components/ui/ContentBody';
import { MaterialPracticoSection } from '@/components/content/MaterialPracticoSection';
import { AplicacionesSection } from '@/components/content/AplicacionesSection';
import { SubtleSeparator } from '@/components/ui/SubtleSeparator';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { NotFoundState } from '@/components/ui/NotFoundState';
import { useI18n } from '@/i18n';

/**
 * Componente principal para visualizar un Teorema, Lema o Corolario.
 */
export const TheoremPage = () => {
  const { id } = useParams();
  const slug = id || '';
  const { lang, t, currentLanguage, getLocalizedPath } = useI18n();

  const theorem = id ? db.getTheorem(id, lang) : undefined;
  const isFallback = id ? db.isFallback(id, lang) : false;
  const availableLangs = id ? db.getAvailableLanguages(id) : ['es'];

  const corollaries = theorem?.corollaries?.map(cId => db.getTheorem(cId, lang)).filter(Boolean) as Theorem[] || [];
  const lemmas = theorem?.lemmas?.map(lId => db.getTheorem(lId, lang)).filter(Boolean) as Theorem[] || [];
  const demos = theorem?.demos?.map(dId => db.getDemo(dId, lang) || db.demos.get(dId) || Array.from(db.demos.values()).find(d => d.slug === dId)).filter(Boolean) as Demo[] || [];
  const parentTheorem = theorem?.parentTheorem ? db.getTheorem(theorem.parentTheorem, lang) : null;
  const examples = theorem ? db.getExamplesByTheorem(theorem.id, lang) : [];
  const exercises = theorem ? db.getExercisesByTheorem(theorem.id, lang) : [];
  const useCases = theorem ? db.getUseCasesByConcept(theorem.id) : [];

  const typesDict = currentLanguage.dictionary.metadata.types;
  const displayType = theorem ? (typesDict[theorem.type as keyof typeof typesDict] || typesDict['teorema'] || 'Teorema') : 'Teorema';
  const Simulation = theorem?.Simulation;

  if (!theorem) {
    return <NotFoundState missingId={id} />;
  }

  const breadcrumbs = db.getBreadcrumbs(theorem.branch || theorem.tags, undefined, lang);

  const renderMainContent = () => (
    <div className="bg-transparent text-carbon font-serif pb-16">
      <FadeIn className="w-full pt-4">
        {isFallback && <UntranslatedFallbackBanner availableLangs={availableLangs} />}
        <div id="enunciado">
          <ContentHeader
            type={theorem.type || 'teorema'}
            typeLabel={displayType}
            title={theorem.title}
            description={theorem.description}
            breadcrumbs={breadcrumbs}
            authors={theorem.authors || []}
            tags={theorem.tags || []}
            nodeId={theorem.id}
            backLink={parentTheorem ? {
              href: `/teorema/${parentTheorem.id}`,
              label: `← ${typesDict[parentTheorem.type as keyof typeof typesDict] || 'Teorema'}: ${parentTheorem.title}`,
            } : undefined}
          />
        </div>

        <ContentBody>
          <theorem.Component />
        </ContentBody>

        <ReadingButton id={slug} />
      </FadeIn>
    </div>
  );

  const hasSecondaryContent =
    demos.length > 0 ||
    examples.length > 0 ||
    exercises.length > 0 ||
    useCases.length > 0 ||
    lemmas.length > 0 ||
    corollaries.length > 0;

  const renderSecondaryContent = () => (
    <FadeIn>
      {demos.length > 0 && (
        <section id="demostraciones" className="mb-20">
          <SectionTitle>{t('content', 'availableDemos')}</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            {demos.map(demo => {
              const isDemoLeanVerified =
                demo.leanVerified === true ||
                demo.verificationStatus === 'lean-checked' ||
                demo.verificationStatus === 'lean-audited';

              return (
                <ContentCard
                  key={demo.slug}
                  href={getLocalizedPath(`/demo/${demo.id}`)}
                  title={demo.title}
                  description={demo.description}
                  type="demostracion"
                  layout="default"
                  leanVerified={isDemoLeanVerified}
                  actionLabel={t('content', 'explore')}
                />
              );
            })}
          </div>
        </section>
      )}

      {(examples.length > 0 || exercises.length > 0) && (
        <section id="material-practico" className="mb-20">
          <MaterialPracticoSection examples={examples} exercises={exercises} />
        </section>
      )}

      {useCases.length > 0 && (
        <section id="aplicaciones" className="mb-20">
          <AplicacionesSection useCases={useCases} />
        </section>
      )}

      {lemmas.length > 0 && (
        <section id="lemas" className="my-16">
          <SubtleSeparator />
          <SectionTitle>{t('content', 'previousLemmas')}</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            {lemmas.map(lem => (
              <ContentCard
                key={lem.slug}
                href={getLocalizedPath(`/teorema/${lem.id}`)}
                title={lem.title}
                description={lem.description}
                type="lema"
                layout="row"
              />
            ))}
          </div>
        </section>
      )}

      {corollaries.length > 0 && (
        <section id="corolarios" className="my-16">
          <SubtleSeparator />
          <SectionTitle>{t('content', 'derivedCorollaries')}</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            {corollaries.map(cor => (
              <ContentCard
                key={cor.slug}
                href={getLocalizedPath(`/teorema/${cor.id}`)}
                title={cor.title}
                description={cor.description}
                type="corolario"
                layout="row"
              />
            ))}
          </div>
        </section>
      )}
    </FadeIn>
  );

  return (
    <ContentLayout
      className="theorem-content-layout"
      pageType={theorem.type || 'teorema'}
      variant="balanced"
      diagram={Simulation ? (
        <DiagramSlot>
          <Simulation />
        </DiagramSlot>
      ) : undefined}
      diagramLabel={t('common', 'visualizationOf', { title: theorem.title })}
      secondary={hasSecondaryContent ? renderSecondaryContent() : undefined}
    >
      {renderMainContent()}
    </ContentLayout>
  );
};

