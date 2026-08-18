import { useParams, Link } from 'wouter';
import { useEffect } from 'react';
import { db } from '@/data/content';
import { ExerciseProvider, useExercise } from '@/content-pages/exercise/ui/ExerciseContext';
import { ContentDiagram, ContentLayout } from '@/components/layouts/ContentLayout';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { VintageSeal } from '@/components/ui/VintageSeal';
import { useI18n } from '@/i18n';

/**
 * Barra de progreso interactiva que se fija en el top del ExercisePage.
 * Refleja la puntuación (score) proveniente del `ExerciseContext`.
 */
const ProgressBar: React.FC<{ onReset?: () => void; isCompleted?: boolean }> = ({ onReset, isCompleted }) => {
  const { score, reset } = useExercise();
  const { t } = useI18n();
  const { correct, total } = score;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (total === 0) return null;

  const handleResetClick = () => {
    onReset?.();
    reset();
  };

  return (
    <div className="sticky top-0 z-30 bg-lienzo/95 backdrop-blur-sm border-b border-carbon/10 px-6 py-3 lg:-mt-24">
      <div className="w-full flex items-center gap-4">
        <div className="flex-1 h-1.5 bg-carbon/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: pct === 100 ? 'var(--theme-musgo)' : 'var(--page-accent, var(--theme-terracota))',
            }}
          />
        </div>
        <span className="text-xs font-sans text-carbon/50 shrink-0">
          <strong className={pct === 100 ? 'text-musgo' : 'text-carbon'}>{correct}</strong>
          <span className="text-carbon/30">
            {` / ${t('exercise', 'correctCount', { count: total })}`}
          </span>
        </span>
        {(score.answered > 0 || isCompleted) && (
          <button
            onClick={handleResetClick}
            className="page-accent-text ac-eyebrow ac-eyebrow--sm opacity-60 hover:opacity-100 transition-opacity underline underline-offset-2 shrink-0 cursor-pointer"
          >
            {t('exercise', 'reset')}
          </button>
        )}
      </div>
    </div>
  );
};

const ExerciseContent: React.FC<{ id: string }> = ({ id }) => {
  const { lang, getLocalizedPath, t } = useI18n();
  const exercise = db.getExercise(id, lang);
  const isFallback = id ? db.isFallback(id, lang) : false;
  const availableLangs = id ? db.getAvailableLanguages(id) : ['es'];

  const { score } = useExercise();
  const { markExerciseComplete, isExerciseComplete, unmarkExerciseComplete } = useProgressStore();
  const alreadyCompleted = isExerciseComplete(id);
  const isCompletedNow = score.total > 0 && score.correct === score.total;
  const isCompleted = isCompletedNow || alreadyCompleted;

  const handleReset = () => {
    unmarkExerciseComplete(id);
  };

  useEffect(() => {
    if (score.total > 0 && score.correct === score.total) {
      markExerciseComplete(id);
    }
  }, [score.total, score.correct, id, markExerciseComplete]);

  if (!exercise) {
    return (
      <div className="ac-page flex items-center justify-center">
        <h1 className="text-2xl italic text-carbon/50">{t('notFound', 'description')}</h1>
      </div>
    );
  }

  const relatedTheorem = exercise.relatedTheorem ? db.getTheorem(exercise.relatedTheorem, lang) : null;

  const breadcrumbs = relatedTheorem
    ? [{ name: relatedTheorem.title, href: getLocalizedPath(`/teorema/${relatedTheorem.id}`) }]
    : [];

  return (
    <ContentLayout pageType="ejercicio" diagram={exercise.Simulation ? <ContentDiagram component={exercise.Simulation} /> : undefined}>
      <div className="min-h-viewport bg-transparent text-carbon font-serif pb-32">
        <ProgressBar onReset={handleReset} isCompleted={isCompleted} />
        <div className="w-full px-6 md:px-10 pt-4 pb-16">
          {isFallback && <UntranslatedFallbackBanner availableLangs={availableLangs} />}
          <ContentHeader
            type="ejercicio"
            title={exercise.title}
            description={exercise.description}
            breadcrumbs={breadcrumbs}
            badgesSlot={exercise.difficulty ? <DifficultyBadge difficulty={exercise.difficulty} /> : undefined}
            backLink={relatedTheorem ? {
              href: getLocalizedPath(`/teorema/${relatedTheorem.id}`),
              label: `← ${relatedTheorem.title}`,
            } : undefined}
          />

          <ContentBody variant="interactive">
            <exercise.Component />
          </ContentBody>

          {isCompleted && (
            <div className="relative">
              <VintageSeal type="exercise" size="md" animated={true} className="-right-5 -top-25" />
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};

/**
 * Contenedor principal de los ejercicios interactivos.
 *
 * Envuelve el componente MDX en un `ExerciseProvider` para habilitar el motor de testeo integrado,
 * y se encarga de mostrar la UI envolvente (barra de progreso, cabecera de contexto, botón de volver).
 */
export const ExercisePage: React.FC = () => {
  const { id } = useParams();
  return (
    <ExerciseProvider key={id} exerciseId={id || ''}>
      <ExerciseContent id={id || ''} />
    </ExerciseProvider>
  );
};
