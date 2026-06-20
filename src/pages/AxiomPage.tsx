import { useRoute } from 'wouter';
import { db } from '../store/content';
import { SimulationLayout } from "../components/layout/SimulationLayout";
import { FadeIn } from '../components/ui/FadeIn';
import { ContentHeader } from '../components/ui/ContentHeader';
import { ContentBody } from '../components/ui/ContentBody';

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

        <ContentBody>
          <axiom.Component />
        </ContentBody>
      </FadeIn>
    </div>
  );

  return (
    <SimulationLayout simulationComponent={axiom.Simulation}>
      {content}
    </SimulationLayout>
  );
}
