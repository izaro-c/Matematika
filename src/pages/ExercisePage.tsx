import { useParams, Link } from 'wouter';
import { useEffect } from 'react';
import { db } from '@/entities/content';
import { ExerciseProvider, useExercise } from '@/features/exercises/ui/ExerciseContext';
import { SimulationLayout } from "@/widgets/layouts/SimulationLayout";
import { useProgressStore } from '@/features/progress/UserProgressStore';
import { ContentHeader } from '@/widgets/content/ContentHeader';
import { ContentBody } from '@/shared/ui/ContentBody';
import { DifficultyBadge } from '@/shared/ui/DifficultyBadge';

/**
 * Barra de progreso interactiva que se fija en el top del ExercisePage.
 * Refleja la puntuación (score) proveniente del `ExerciseContext`.
 */
const ProgressBar: React.FC = () => {
  const { score, reset } = useExercise();
  const { correct, total } = score;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="sticky top-0 z-30 bg-lienzo/95 backdrop-blur-sm border-b border-carbon/10 px-6 py-3">
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
          <span className="text-carbon/30"> / {total} correctas</span>
        </span>
        {score.answered > 0 && (
          <button
            onClick={reset}
            className="page-accent-text text-[10px] font-sans uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity underline underline-offset-2 shrink-0"
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
};

const ExerciseContent: React.FC<{ id: string }> = ({ id }) => {
  const exercise = db.getExercise(id);
  const { score } = useExercise();
  const { markExerciseComplete } = useProgressStore();

  useEffect(() => {
    if (score.total > 0 && score.correct === score.total) {
      markExerciseComplete(id);
    }
  }, [score.total, score.correct, id, markExerciseComplete]);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <h1 className="text-2xl italic text-carbon/50">Ejercicio no encontrado.</h1>
      </div>
    );
  }

  const relatedTheorem = exercise.relatedTheorem ? db.getTheorem(exercise.relatedTheorem) : null;

  const breadcrumbs = relatedTheorem
    ? [{ name: relatedTheorem.title, href: `/teorema/${relatedTheorem.id}` }]
    : [];

  return (
    <SimulationLayout pageType="ejercicio" simulationComponent={exercise.Simulation}>
      <div className="min-h-screen bg-transparent text-carbon font-serif pb-32">
        <ProgressBar />
        <div className="w-full px-6 md:px-10 pt-4 pb-16">
          <ContentHeader
            type="ejercicio"
            title={exercise.title}
            description={exercise.description}
            breadcrumbs={breadcrumbs}
            badgesSlot={exercise.difficulty ? <DifficultyBadge difficulty={exercise.difficulty} /> : undefined}
            backLink={relatedTheorem ? {
              href: `/teorema/${relatedTheorem.id}`,
              label: `← ${relatedTheorem.title}`,
            } : undefined}
          />

          <ContentBody variant="interactive">
            <exercise.Component />
          </ContentBody>

          {score.total > 0 && score.correct === score.total && (
            <div className="mt-16 p-6 border border-musgo/30 bg-musgo/5 text-center">
              <div className="text-3xl mb-2 text-musgo">✦</div>
              <p className="font-serif font-bold text-musgo text-lg">
                Ejercicio completado — {score.correct}/{score.total} correctas
              </p>
              {relatedTheorem && (
                <Link href={`/teorema/${relatedTheorem.id}`}>
                  <a className="inline-block mt-4 text-xs font-sans uppercase tracking-widest text-carbon/50 hover:text-carbon underline underline-offset-2 transition-colors">
                    Volver al Teorema →
                  </a>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </SimulationLayout>
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
    <ExerciseProvider>
      <ExerciseContent id={id || ''} />
    </ExerciseProvider>
  );
};
