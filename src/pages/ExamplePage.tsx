/**
 * ExamplePage.tsx
 *
 * Página de ejemplo resuelto. Muestra la solución paso a paso
 * usando el componente <Paso> para revelar cada etapa individualmente.
 *
 * Muestra:
 * - Cabecera con título, dificultad y enlace al teorema relacionado
 * - Contenido MDX con Paso, Solucion, fórmulas, etc.
 * - Enlace a ejercicios relacionados al final
 */
import { useParams, Link } from 'wouter';
import { Suspense } from 'react';
import { db } from '../store/content';
import { DIFF_COLORS } from '../config/constants';
import { SimulationLayout } from "../components/layout/SimulationLayout";
import { KatexText } from '../components/ui/KatexText';
import { ReadingButton } from '../components/ui/ReadingButton';
import { ContentCard } from '../components/ui/ContentCard';
import { EmptyState } from '../components/ui/EmptyState';
import { FadeIn } from '../components/ui/FadeIn';

export const ExamplePage: React.FC = () => {
  const { id } = useParams();
  const slug = id || '';
  const example = db.getExample(slug);

  if (!example) {
    return (
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <h1 className="text-2xl italic text-carbon/50">Ejemplo no encontrado.</h1>
      </div>
    );
  }

  const relatedTheorem = example.relatedTheorem ? db.getTheorem(example.relatedTheorem) : null;
  const relatedExercises = relatedTheorem ? db.getExercisesByTheorem(relatedTheorem.id) : [];

  const diffColor = DIFF_COLORS[example.difficulty ?? 'básico'] ?? 'var(--theme-carbon)';

  return (
    <SimulationLayout simulationComponent={example.Simulation}>
      <div className="min-h-screen bg-transparent text-carbon font-serif">
        <div className="max-w-4xl mx-auto px-6 md:px-10 pt-16 pb-32">

        {/* Migas de pan */}
        <FadeIn>
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
          <span className="text-carbon/60">Ejemplo</span>
        </div>

        {/* Cabecera */}
        <div className="mb-12 pb-8 border-b border-carbon/10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-1 rounded"
              style={{ color: diffColor, backgroundColor: `color-mix(in srgb, ${diffColor}, transparent 92%)` }}
            >
              {example.difficulty ?? 'básico'}
            </span>
            <span className="text-[10px] font-sans uppercase tracking-widest text-carbon/35 border border-carbon/15 px-2 py-1 rounded">
              Ejemplo Resuelto
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold text-carbon leading-tight mb-4"
            style={{ fontVariant: 'small-caps' }}
          >
            {example.title}
          </h1>

          {example.description && (
            <p className="text-base italic text-carbon/60 border-l-4 border-carbon/15 pl-5 leading-relaxed">
              <KatexText text={example.description} />
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

        {/* Separador ornamental */}
        <div className="flex items-center gap-4 mb-10 opacity-25">
          <div className="flex-1 h-px bg-carbon" />
          <span className="text-xs">✦</span>
          <div className="flex-1 h-px bg-carbon" />
        </div>

        {/* Contenido MDX */}
        <div className="[&_h2]:text-xl [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-carbon [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-carbon/10 [&_h2]:pb-2 [&_p]:text-carbon/80 [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-carbon">
          <Suspense fallback={<div className="animate-pulse h-40 bg-carbon/5 rounded" />}>
            <example.Component />
          </Suspense>
        </div>

        {/* Separador */}
        <div className="flex items-center gap-4 mt-16 mb-10 opacity-15">
          <div className="flex-1 h-px bg-carbon" />
          <span className="text-xs">❦</span>
          <div className="flex-1 h-px bg-carbon" />
        </div>

        {/* Ejercicios relacionados */}
        <div className="mt-8">
          <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-carbon/40 mb-4">
            Practica con ejercicios relacionados
          </h3>
          {relatedExercises.length > 0 ? (
            <div className="flex flex-col gap-3">
              {relatedExercises.map(ex => (
                <ContentCard
                  key={ex.id}
                  href={`/ejercicio/${ex.id}`}
                  title={ex.title}
                  description={ex.description}
                  type="ejercicio"
                  layout="row"
                  actionLabel="Practicar"
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No hay ejercicios relacionados con este ejemplo." icon="✎" />
          )}
        </div>

        {/* Botón de Lectura */}
        <ReadingButton id={slug} />

        </FadeIn>
      </div>
    </div>
    </SimulationLayout>
  );
};
