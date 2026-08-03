import { useParams } from 'wouter';
import { db } from '@/data/content';
import { ContentDiagram, ContentLayout } from '@/components/layouts/ContentLayout';
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { ContentCard } from '@/components/ui/ContentCard';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { SubtleSeparator } from '@/components/ui/SubtleSeparator';

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
      <div className="ac-page flex items-center justify-center">
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
    <ContentLayout pageType="ejemplo" diagram={example.Simulation ? <ContentDiagram component={example.Simulation} /> : undefined}>
      <div className="bg-transparent text-carbon font-serif pb-16">
        <FadeIn className="w-full pt-4">
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

          <ReadingButton id={slug} />

          {relatedExercises.length > 0 && (
            <section className="mt-16">
              <SubtleSeparator />
              <h3 className="ac-label ac-label--md ac-label--faint mb-4">
                Practica con ejercicios relacionados
              </h3>
              <div className="flex flex-col gap-3 max-w-2xl">
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
        </FadeIn>
      </div>
    </ContentLayout>
  );
};
