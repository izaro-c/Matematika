import { Suspense } from 'react';
import { useRoute } from 'wouter';
import { db } from '../store/content';
import { SimulationLayout } from '../components/layout/SimulationLayout';
import { FadeIn } from '../components/ui/FadeIn';
import { ContentHeader } from '../components/ui/ContentHeader';
import { ContentBody } from '../components/ui/ContentBody';
import { ContentCard } from '../components/ui/ContentCard';
import { SubtleSeparator } from '../components/ui/SubtleSeparator';

export function ModelPage() {
  const [, params] = useRoute('/modelo/:id');
  const id = params?.id;
  const model = id ? db.getModel(id) : undefined;

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">Modelo no encontrado</h1>
        <p className="text-pizarra mb-6">El modelo <code className="bg-carbon/5 px-2 py-0.5 rounded">{id}</code> no existe en la base de datos.</p>
      </div>
    );
  }

  // const Diagram = model.Diagram;
  const system = model.satisfies ? db.getAxiomaticSystem(model.satisfies) : undefined;
  const verifiedAxioms = (model.axioms_verified || []).map(axId => db.getAxiom(axId)).filter(Boolean);

  const renderContent = () => (
    <div className="min-h-screen bg-transparent text-carbon font-serif pb-32">
      <FadeIn className="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
        <ContentHeader
          type="modelo"
          title={model.title}
          description={model.description}
          breadcrumbs={[{ name: 'Axiomas', href: '/axiomas' }]}
          tags={model.tags || []}
          nodeId={model.id}
          backLink={system ? {
            href: `/sistema/${system.id}`,
            label: `← Sistema: ${system.title}`,
          } : undefined}
        />

        <ContentBody>
          <Suspense fallback={<div className="animate-pulse text-pizarra italic py-8">Cargando contenido...</div>}>
            <model.Component />
          </Suspense>
        </ContentBody>



        {system && (
          <section className="mt-16">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-6 border-b border-carbon/10 pb-4" style={{ fontVariant: 'small-caps' }}>
              Sistema axiomático
            </h2>
            <ContentCard
              href={`/sistema/${system.id}`}
              title={system.title}
              description={system.description}
              type="sistema-axiomatico"
              typeLabel="Sistema"
              layout="row"
            />
          </section>
        )}

        {verifiedAxioms.length > 0 && (
          <section className="mt-16">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-6 border-b border-carbon/10 pb-4" style={{ fontVariant: 'small-caps' }}>
              Axiomas verificados ({verifiedAxioms.length})
            </h2>
            <div className="flex flex-col gap-3">
              {verifiedAxioms.map(ax => ax && (
                <ContentCard
                  key={ax.id}
                  href={`/axioma/${ax.id}`}
                  title={ax.title}
                  description={ax.description}
                  type="axioma"
                  layout="row"
                />
              ))}
            </div>
          </section>
        )}
      </FadeIn>
    </div>
  );

  return (
    <SimulationLayout simulationComponent={model.Simulation || model.Diagram}>
      {renderContent()}
    </SimulationLayout>
  );
}
