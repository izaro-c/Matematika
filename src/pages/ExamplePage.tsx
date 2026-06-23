import { useParams } from 'wouter';
import { db } from '@/entities/content';
import { SimulationLayout } from "@/widgets/layouts/SimulationLayout";
import { ReadingButton } from '@/features/progress/ui/ReadingButton';
import { ContentCard } from '@/shared/ui/ContentCard';
import { FadeIn } from '@/shared/ui/FadeIn';
import { ContentHeader } from '@/shared/ui/ContentHeader';
import { ContentBody } from '@/shared/ui/ContentBody';
import { DifficultyBadge } from '@/shared/ui/DifficultyBadge';
import { SubtleSeparator } from '@/shared/ui/SubtleSeparator';

/**
 * Página para visualizar un Ejemplo Resuelto.
 *
 * Expone la resolución paso a paso de un problema, vinculándolo a su concepto teórico padre.
 */
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

  const breadcrumbs = relatedTheorem
    ? [{ name: relatedTheorem.title, href: `/teorema/${relatedTheorem.id}` }]
    : [];

  return (
    <SimulationLayout simulationComponent={example.Simulation}>
      <div className="min-h-screen bg-transparent text-carbon font-serif pb-32">
        <FadeIn className="max-w-4xl mx-auto px-6 md:px-10 pt-16 md:pt-24">
          <ContentHeader
            type="ejemplo"
            typeLabel="Ejemplo Resuelto"
            title={example.title}
            description={example.description}
            breadcrumbs={breadcrumbs}
            badgesSlot={example.difficulty ? <DifficultyBadge difficulty={example.difficulty} /> : undefined}
            backLink={relatedTheorem ? {
              href: `/teorema/${relatedTheorem.id}`,
              label: `← ${relatedTheorem.title}`,
            } : undefined}
          />

          <ContentBody>
            <example.Component />
          </ContentBody>

          {relatedExercises.length > 0 && (
            <section className="mt-16">
              <SubtleSeparator />
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-carbon/40 mb-4">
                Practica con ejercicios relacionados
              </h3>
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
            </section>
          )}

          <ReadingButton id={slug} />
        </FadeIn>
      </div>
    </SimulationLayout>
  );
};
