import { useEffect } from 'react';
import { useParams } from 'wouter';
import { db } from '@/data/content';
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { useMetadataStore } from '@/data/metadata/MetadataStore';
import { ContentBody } from '@/components/ui/ContentBody';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentHeader } from '@/components/content/ContentHeader';
import { ContentLayout } from '@/components/layouts/ContentLayout';
import { DiagramSlot } from '@/components/ui/skeletons';

/** Página canónica para procedimientos matemáticos reutilizables. */
export const MethodPage = () => {
  const { id = '' } = useParams();
  const method = db.getMethod(id);
  const setMetadata = useMetadataStore((state) => state.setMetadata);

  useEffect(() => {
    if (method) {
      setMetadata({
        id: method.id,
        title: method.title,
        type: 'Método',
        tags: method.tags ?? [],
        description: method.description,
      });
    }
    return () => setMetadata(null);
  }, [method, setMetadata]);

  if (!method) {
    return (
      <main className="ac-page flex items-center justify-center">
        <h1 className="text-2xl">El método especificado no existe o no ha sido catalogado.</h1>
      </main>
    );
  }

  const Diagram = method.Simulation;

  return (
    <ContentLayout
      pageType="metodo"
      variant="balanced"
      diagram={Diagram ? (
        <DiagramSlot>
          <Diagram />
        </DiagramSlot>
      ) : undefined}
      diagramLabel={`Visualización de ${method.title}`}
    >
      <FadeIn className="w-full pb-16 pt-4 text-carbon">
        <ContentHeader
          type="metodo"
          typeLabel="Método"
          title={method.title}
          description={method.description}
          authors={method.authors ?? []}
          tags={method.tags ?? []}
          nodeId={method.id}
        />

        <ContentBody>
          <method.Component />
        </ContentBody>

        <div className="mt-20 flex justify-center">
          <ReadingButton id={method.id} />
        </div>
      </FadeIn>
    </ContentLayout>
  );
};
