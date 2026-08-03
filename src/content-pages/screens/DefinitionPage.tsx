import { useEffect } from "react";
import { useParams } from "wouter";
import { db } from "@/data/content";
import { ContentLayout } from "@/components/layouts/ContentLayout";
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { useMetadataStore } from '@/data/metadata/MetadataStore';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentBody } from '@/components/ui/ContentBody';
import { DiagramSlot } from '@/components/ui/skeletons';
import { MaterialPracticoSection } from '@/components/content/MaterialPracticoSection';
import { AplicacionesSection } from '@/components/content/AplicacionesSection';

/**
 * Página para visualizar una Definición Matemática estricta.
 *
 * Busca los metadatos de la definición en el `ContentStore` y renderiza el contenido (texto MDX y simulaciones).
 * Además expone de manera contextual ejemplos, ejercicios y casos de uso prácticos vinculados.
 */
export const DefinitionPage = () => {
  const { id } = useParams();
  const slug = id || '';
  const setMetadata = useMetadataStore((state) => state.setMetadata);

  const definition = db.getDefinition(slug);

  useEffect(() => {
    if (definition) {
      setMetadata({
        id: definition.id,
        title: definition.title,
        type: 'Definición',
        tags: definition.tags || [],
        description: definition.description,
      });
    }
    return () => setMetadata(null);
  }, [definition, setMetadata]);

  if (!definition) {
    return (
      <div className="ac-page flex items-center justify-center">
        <h1 className="text-2xl">La definición especificada no existe o no ha sido catalogada.</h1>
      </div>
    );
  }

  const examples = db.getExamplesByTheorem(definition.id);
  const exercises = db.getExercisesByTheorem(definition.id);
  const useCases = db.getUseCasesByConcept(definition.id);
  const Simulation = definition.Simulation;

  const breadcrumbs = db.getBreadcrumbs(definition.tags);

  const renderMainContent = () => (
    <div className="bg-transparent text-carbon font-serif pb-16">
      <FadeIn className="w-full pt-4">
        <ContentHeader
          type="definicion"
          title={definition.title}
          description={definition.description}
          breadcrumbs={breadcrumbs}
          authors={definition.authors || []}
          tags={definition.tags || []}
          nodeId={definition.id}
        />

        <section className="mt-8 mb-8">
          <ContentBody>
            <definition.Component />
          </ContentBody>
        </section>

        <ReadingButton id={slug} />
      </FadeIn>
    </div>
  );

  const hasSecondaryContent = examples.length > 0 || exercises.length > 0 || useCases.length > 0;

  const renderSecondaryContent = () => (
    <FadeIn>
      <MaterialPracticoSection examples={examples} exercises={exercises} />
      <AplicacionesSection useCases={useCases} />
    </FadeIn>
  );

  return (
    <ContentLayout
      pageType="definicion"
      variant="balanced"
      diagram={Simulation ? (
        <DiagramSlot>
          <Simulation />
        </DiagramSlot>
      ) : undefined}
      diagramLabel={`Visualización de ${definition.title}`}
      secondary={hasSecondaryContent ? renderSecondaryContent() : undefined}
    >
      {renderMainContent()}
    </ContentLayout>
  );
};
