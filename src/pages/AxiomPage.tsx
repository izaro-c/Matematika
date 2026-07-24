import { useEffect } from 'react';
import { useRoute } from 'wouter';
import { db } from '@/entities/content';
import { ContentDiagram, ContentLayout } from '@/widgets/layouts/ContentLayout';
import { FadeIn } from '@/shared/ui/FadeIn';
import { ContentHeader } from '@/widgets/content/ContentHeader';
import { ReadingButton } from '@/features/progress/ui/ReadingButton';
import { ContentBody } from '@/shared/ui/ContentBody';
import { useMetadataStore } from '@/features/metadata/MetadataStore';

/**
 * Página principal para visualizar un Axioma en detalle.
 * 
 * Se encarga de extraer el slug de la URL, cargar los datos de `ContentStore`
 * y renderizar el contenido estático junto a su simulación gráfica si estuviera disponible.
 */
export function AxiomPage() {
  const [, params] = useRoute('/axioma/:id');
  const id = params?.id;
  const axiom = id ? db.getAxiom(id) : undefined;
  const setMetadata = useMetadataStore((state) => state.setMetadata);

  useEffect(() => {
    if (axiom) {
      setMetadata({
        title: axiom.title,
        type: 'Axioma',
        tags: axiom.tags || [],
      });
    }
    return () => setMetadata(null);
  }, [axiom, setMetadata]);

  if (!axiom) {
    return (
      <div className="min-h-viewport flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">Axioma no encontrado</h1>
        <p className="text-pizarra mb-6">El axioma <code className="bg-carbon/5 px-2 py-0.5 rounded">{id}</code> no existe en la base de datos.</p>
      </div>
    );
  }

  const breadcrumbs = axiom.tags?.length
    ? [{ name: 'Axiomas', href: '/axiomas' }]
    : [];

  const content = (
    <div className="min-h-viewport bg-transparent text-carbon font-serif pb-32">
      <FadeIn className="w-full px-6 md:px-12 pt-4 pb-16">
        <ContentHeader
          type="axioma"
          title={axiom.title}
          description={axiom.description}
          breadcrumbs={breadcrumbs}
          authors={axiom.authors || []}
          tags={axiom.tags || []}
          nodeId={axiom.id}
        />

        <section className="mt-8 mb-24">
          <ContentBody>
            <axiom.Component />
          </ContentBody>
        </section>

        <div className="mt-24">
          <ReadingButton id={id || ''} />
        </div>
      </FadeIn>
    </div>
  );

  return (
    <ContentLayout pageType="axioma" diagram={axiom.Simulation ? <ContentDiagram component={axiom.Simulation} /> : undefined}>
      {content}
    </ContentLayout>
  );
}
