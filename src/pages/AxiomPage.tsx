import { useRoute } from 'wouter';
import { db } from '@/entities/content';
import { SimulationLayout } from "@/widgets/layouts/SimulationLayout";
import { FadeIn } from '@/shared/ui/FadeIn';
import { ContentHeader } from '@/shared/ui/ContentHeader';
import { ContentBody } from '@/shared/ui/ContentBody';

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

  if (!axiom) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">Axioma no encontrado</h1>
        <p className="text-pizarra mb-6">El axioma <code className="bg-carbon/5 px-2 py-0.5 rounded">{id}</code> no existe en la base de datos.</p>
      </div>
    );
  }

  const breadcrumbs = axiom.tags?.length
    ? [{ name: 'Axiomas', href: '/axiomas' }]
    : [];

  const content = (
    <div className="min-h-screen bg-transparent text-carbon font-serif pb-32">
      <FadeIn className="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
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
      </FadeIn>
    </div>
  );

  return (
    <SimulationLayout simulationComponent={axiom.Simulation}>
      {content}
    </SimulationLayout>
  );
}
