import { useParams } from 'wouter';
import { db } from '@/data/content';
import { ContentDiagram, ContentLayout } from '@/components/layouts/ContentLayout';
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { VocabSection, VocabEntry } from '@/components/ui/Vocabulary';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';
import { NotFoundState } from '@/components/ui/NotFoundState';

/**
 * Página para visualizar un Ejemplo Resuelto.
 *
 * Expone la resolución paso a paso de un problema, vinculándolo a su concepto teórico padre.
 */
export const ExamplePage: React.FC = () => {
  const { id } = useParams();
  const { lang, getLocalizedPath, t } = useI18n();
  const { isRead, isExerciseComplete } = useProgressStore();
  const slug = id || '';
  const example = db.getExample(slug, lang);
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];

  if (!example) {
    return <NotFoundState />;
  }

  const relatedTheorem = example.relatedTheorem ? db.getTheorem(example.relatedTheorem, lang) : null;
  const relatedExercises = relatedTheorem ? db.getExercisesByTheorem(relatedTheorem.id, lang) : [];

  const breadcrumbs = relatedTheorem
    ? [{ name: relatedTheorem.title, href: getLocalizedPath(`/teorema/${relatedTheorem.id}`) }]
    : [];

  return (
    <ContentLayout pageType="ejemplo" diagram={example.Simulation ? <ContentDiagram component={example.Simulation} /> : undefined}>
      <div className="bg-transparent text-carbon font-serif pb-16">
        <FadeIn className="w-full pt-4">
          <ContentHeader
            type="ejemplo"
            typeLabel={t('content', 'resolvedExample')}
            title={example.title}
            description={example.description}
            breadcrumbs={breadcrumbs}
            badgesSlot={example.difficulty ? <DifficultyBadge difficulty={example.difficulty} /> : undefined}
            backLink={relatedTheorem ? {
              href: getLocalizedPath(`/teorema/${relatedTheorem.id}`),
              label: `← ${relatedTheorem.title}`,
            } : undefined}
          />

          {isFallback && (
            <UntranslatedFallbackBanner
              availableLangs={availableLangs}
              className="mb-8"
            />
          )}

          <ContentBody>
            <example.Component />
          </ContentBody>

          <ReadingButton id={slug} />

          {relatedExercises.length > 0 && (
            <VocabSection heading={t('content', 'practiceWithExercises')} accentType="ejercicio" count={relatedExercises.length} className="mt-16">
              {relatedExercises.map(ex => (
                <VocabEntry
                  key={ex.id}
                  href={getLocalizedPath(`/ejercicio/${ex.id}`)}
                  title={ex.title}
                  description={ex.description}
                  read={isExerciseComplete(ex.id) || isRead(ex.id)}
                />
              ))}
            </VocabSection>
          )}
        </FadeIn>
      </div>
    </ContentLayout>
  );
};
