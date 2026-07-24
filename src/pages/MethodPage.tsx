import { Suspense, useEffect } from 'react';
import { useParams } from 'wouter';
import { db } from '@/entities/content';
import { ReadingButton } from '@/features/progress/ui/ReadingButton';
import { useMetadataStore } from '@/features/metadata/MetadataStore';
import { ContentBody } from '@/shared/ui/ContentBody';
import { FadeIn } from '@/shared/ui/FadeIn';
import { ContentHeader } from '@/widgets/content/ContentHeader';
import { ContentLayout } from '@/widgets/layouts/ContentLayout';

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
        <Suspense fallback={<div className="diagram-loading">Preparando visualización…</div>}>
          <Diagram />
        </Suspense>
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
