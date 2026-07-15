import { Suspense, useEffect } from "react";
import { useParams } from "wouter";
import { db } from "@/entities/content";
import { ContentLayout } from "@/widgets/layouts/ContentLayout";
import { ReadingButton } from '@/features/progress/ui/ReadingButton';
import { useMetadataStore } from '@/features/metadata/MetadataStore';
import { FadeIn } from '@/shared/ui/FadeIn';
import { ContentHeader } from '@/widgets/content/ContentHeader';
import { ContentBody } from '@/shared/ui/ContentBody';
import { MaterialPracticoSection } from '@/widgets/content/MaterialPracticoSection';
import { AplicacionesSection } from '@/shared/ui/AplicacionesSection';

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
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <h1 className="text-2xl">La definición especificada no existe o no ha sido catalogada.</h1>
      </div>
    );
  }

  const examples = db.getExamplesByTheorem(definition.id);
  const exercises = db.getExercisesByTheorem(definition.id);
  const useCases = db.getUseCasesByConcept(definition.id);
  const Simulation = definition.Simulation;

  const breadcrumbs: { name: string; href?: string }[] = [];
  if (definition.tags && definition.tags.length > 0) {
    const mainBranch = definition.tags[0];
    const taxonomy = db.getBranchTaxonomy(mainBranch);
    breadcrumbs.push(
      ...taxonomy.breadcrumbs.map(b => ({ name: b.name, href: `/rama/${b.slug}` })),
      { name: taxonomy.name || taxonomy.id, href: `/rama/${taxonomy.slug}` }
    );
  }

  const renderMainContent = () => (
    <div className="bg-transparent text-carbon font-serif pb-16">
      <FadeIn className="w-full px-6 md:px-12 pt-4">
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
      </FadeIn>
    </div>
  );

  const renderSecondaryContent = () => (
    <FadeIn>
      <MaterialPracticoSection examples={examples} exercises={exercises} />
      <AplicacionesSection useCases={useCases} />

      <div className="flex justify-center mt-24">
        <ReadingButton id={slug} />
      </div>
    </FadeIn>
  );

  return (
    <ContentLayout
      pageType="definicion"
      variant="balanced"
      diagram={Simulation ? (
        <Suspense fallback={<div className="diagram-loading">Preparando visualización…</div>}>
          <Simulation />
        </Suspense>
      ) : undefined}
      diagramLabel={`Visualización de ${definition.title}`}
      secondary={renderSecondaryContent()}
    >
      {renderMainContent()}
    </ContentLayout>
  );
};
