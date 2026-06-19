/**
 * ExercisePage.tsx
 *
 * Página de ejercicio interactivo. Monta el ExerciseProvider para que todos
 * los componentes Hueco y Pregunta del MDX puedan compartir estado.
 *
 * Muestra:
 * - Cabecera con título, dificultad y enlace al teorema relacionado
 * - Barra de progreso animada (correctas / total)
 * - Contenido MDX (con Hueco, Pregunta, Solucion, Paso…)
 * - Botón de reinicio al terminar
 */
import { useParams, Link } from 'wouter';
import { Suspense, useEffect } from 'react';
import { db } from '../store/content';
import { ExerciseProvider, useExercise } from '../components/exercises/ExerciseContext';
import { DIFF_COLORS } from '../config/constants';
import { SimulationLayout } from "../components/layout/SimulationLayout";
import { KatexText } from '../components/ui/KatexText';
import { useProgressStore } from '../store/UserProgressStore';

// ── Barra de progreso interna ─────────────────────────────────────────────────
const ProgressBar: React.FC = () => {
  const { score, reset } = useExercise();
  const { correct, total, answered } = score;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="sticky top-0 z-30 bg-lienzo/95 backdrop-blur-sm border-b border-carbon/10 px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        {/* Barra */}
        <div className="flex-1 h-1.5 bg-carbon/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: pct === 100 ? 'var(--theme-musgo)' : 'var(--theme-terracota)',
            }}
          />
        </div>
        {/* Texto */}
        <span className="text-xs font-sans text-carbon/50 shrink-0">
          <strong className={pct === 100 ? 'text-musgo' : 'text-carbon'}>{correct}</strong>
          <span className="text-carbon/30"> / {total} correctas</span>
        </span>
        {/* Reiniciar */}
        {answered > 0 && (
          <button
            onClick={reset}
            className="text-[10px] font-sans uppercase tracking-widest text-terracota/60 hover:text-terracota transition-colors underline underline-offset-2 shrink-0"
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  );
};

// ── Contenido de la página ────────────────────────────────────────────────────
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

  const diffColor = DIFF_COLORS[exercise.difficulty ?? 'básico'] ?? 'var(--theme-carbon)';

  return (
    <SimulationLayout simulationComponent={exercise.Simulation}>
      <div className="min-h-screen bg-transparent text-carbon font-serif">
        <ProgressBar />

      <div className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-32">
        {/* Migas de pan */}
        <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest text-carbon/35 mb-10">
          <Link href="/"><a className="hover:text-carbon transition-colors">Biblioteca</a></Link>
          {relatedTheorem && (
            <>
              <span>/</span>
              <Link href={`/teorema/${relatedTheorem.id}`}>
                <a className="hover:text-carbon transition-colors">{relatedTheorem.title}</a>
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-carbon/60">Ejercicio</span>
        </div>

        {/* Cabecera */}
        <div className="mb-12 pb-8 border-b border-carbon/10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-1 rounded"
              style={{ color: diffColor, backgroundColor: `color-mix(in srgb, ${diffColor}, transparent 92%)` }}
            >
              {exercise.difficulty ?? 'básico'}
            </span>
            <span className="text-[10px] font-sans uppercase tracking-widest text-carbon/35 border border-carbon/15 px-2 py-1 rounded">
              Ejercicio
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold text-carbon leading-tight mb-4"
            style={{ fontVariant: 'small-caps' }}
          >
            {exercise.title}
          </h1>

          {exercise.description && (
            <p className="text-base italic text-carbon/60 border-l-4 border-carbon/15 pl-5 leading-relaxed">
              <KatexText text={exercise.description} />
            </p>
          )}

          {relatedTheorem && (
            <Link href={`/teorema/${relatedTheorem.id}`}>
              <a className="inline-flex items-center gap-2 mt-5 text-xs font-sans uppercase tracking-widest text-terracota/70 hover:text-terracota transition-colors border border-terracota/20 hover:border-terracota/40 px-3 py-1.5">
                ← {relatedTheorem.title}
              </a>
            </Link>
          )}
        </div>

        {/* Contenido MDX */}
        <div className="prose prose-base max-w-none [&_h2]:text-xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-carbon [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-carbon/10 [&_h2]:pb-2 [&_p]:text-carbon/80 [&_p]:leading-relaxed [&_strong]:text-carbon">
          <Suspense fallback={<div className="animate-pulse h-40 bg-carbon/5 rounded" />}>
            <exercise.Component />
          </Suspense>
        </div>

        {/* Banner de completado */}
        {score.total > 0 && score.correct === score.total && (
          <div className="mt-16 p-6 border border-musgo/30 bg-musgo/5 text-center rounded">
            <div className="text-3xl mb-2">✦</div>
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

// ── Página principal (wrapper con Provider) ───────────────────────────────────
export const ExercisePage: React.FC = () => {
  const { id } = useParams();
  return (
    <ExerciseProvider>
      <ExerciseContent id={id || ''} />
    </ExerciseProvider>
  );
};
