import type { Demo, Theorem } from '@/data/content/types';
import { useParams } from "wouter";
import { db } from "@/data/content";
import { ContentLayout } from "@/components/layouts/ContentLayout";
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { FadeIn } from '@/components/ui/FadeIn';
import { VocabSection, VocabEntry } from '@/components/ui/Vocabulary';
import { ContentHeader } from '@/components/content/ContentHeader';
import { DiagramSlot } from '@/components/ui/skeletons';
import { ContentBody } from '@/components/ui/ContentBody';
import { MaterialPracticoSection } from '@/components/content/MaterialPracticoSection';
import { AplicacionesSection } from '@/components/content/AplicacionesSection';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { NotFoundState } from '@/components/ui/NotFoundState';
import { getContentTypeLabel } from '@/lib/theme/constants';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';

/**
 * Componente principal para visualizar un Teorema, Lema o Corolario.
 */
export const TheoremPage = () => {
  const { id } = useParams();
  const slug = id || '';
  const { lang, t, currentLanguage, getLocalizedPath } = useI18n();
  const { isRead } = useProgressStore();

  const theorem = id ? db.getTheorem(id, lang) : undefined;
  const isFallback = id ? db.isFallback(id, lang) : false;
  const availableLangs = id ? db.getAvailableLanguages(id) : ['es'];

  const corollaries = theorem?.corollaries?.map(cId => db.getTheorem(cId, lang)).filter(Boolean) as Theorem[] || [];
  const lemmas = theorem?.lemmas?.map(lId => db.getTheorem(lId, lang)).filter(Boolean) as Theorem[] || [];
  const demos = theorem?.demos?.map(dId => db.getDemo(dId, lang) || db.demos.get(dId) || Array.from(db.demos.values()).find(d => d.slug === dId)).filter(Boolean) as Demo[] || [];
  const parentTheorem = theorem?.parentTheorem ? db.getTheorem(theorem.parentTheorem, lang) : null;
  const examples = theorem ? db.getExamplesByTheorem(theorem.id, lang) : [];
  const exercises = theorem ? db.getExercisesByTheorem(theorem.id, lang) : [];
  const useCases = theorem ? db.getUseCasesByConcept(theorem.id, lang) : [];

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
        <VocabSection id="demostraciones" heading={getContentTypeLabel('demostracion', 'plural', lang)} accentType="demostracion" count={demos.length}>
          {demos.map(demo => (
            <VocabEntry
              key={demo.slug}
              href={getLocalizedPath(`/demo/${demo.id}`)}
              title={demo.title}
              description={demo.description}
              read={isRead(demo.id)}
            />
          ))}
        </VocabSection>
      )}

      <MaterialPracticoSection examples={examples} exercises={exercises} />
      <AplicacionesSection useCases={useCases} />

      {lemmas.length > 0 && (
        <VocabSection id="lemas" heading={t('content', 'previousLemmas')} accentType="lema" count={lemmas.length}>
          {lemmas.map(lem => (
            <VocabEntry
              key={lem.slug}
              href={getLocalizedPath(`/teorema/${lem.id}`)}
              title={lem.title}
              description={lem.description}
              read={isRead(lem.id)}
            />
          ))}
        </VocabSection>
      )}

      {corollaries.length > 0 && (
        <VocabSection id="corolarios" heading={t('content', 'derivedCorollaries')} accentType="corolario" count={corollaries.length}>
          {corollaries.map(cor => (
            <VocabEntry
              key={cor.slug}
              href={getLocalizedPath(`/teorema/${cor.id}`)}
              title={cor.title}
              description={cor.description}
              read={isRead(cor.id)}
            />
          ))}
        </VocabSection>
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

