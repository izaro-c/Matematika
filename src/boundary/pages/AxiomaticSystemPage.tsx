import { Suspense } from 'react';
import { useRoute } from 'wouter';
import { db } from '@/database/dao/content';
import { SimulationLayout } from '@/boundary/components/layout/SimulationLayout';
import { FadeIn } from '@/boundary/components/ui/FadeIn';
import { ContentHeader } from '@/boundary/components/ui/ContentHeader';
import { ContentBody } from '@/boundary/components/ui/ContentBody';
import { ContentCard } from '@/boundary/components/ui/ContentCard';
import { SubtleSeparator } from '@/boundary/components/ui/SubtleSeparator';

/**
 * Página para visualizar un Sistema Axiomático.
 *
 * Muestra el marco lógico (los axiomas de los que se compone),
 * y permite listar los Modelos concretos que lo satisfacen.
 */
export function AxiomaticSystemPage() {
  const [, params] = useRoute('/sistema/:id');
  const id = params?.id;
  const system = id ? db.getAxiomaticSystem(id) : undefined;

  if (!system) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">Sistema axiomático no encontrado</h1>
        <p className="text-pizarra mb-6">El sistema <code className="bg-carbon/5 px-2 py-0.5 rounded">{id}</code> no existe en la base de datos.</p>
      </div>
    );
  }

  const axioms = (system.axiomas || []).map(axId => db.getAxiom(axId)).filter(Boolean);
  const models = db.getModelsForSystem(system.id);

  const renderContent = () => (
    <div className="min-h-screen bg-transparent text-carbon font-serif pb-32">
      <FadeIn className="max-w-4xl mx-auto px-6 md:px-12 pt-16 md:pt-24">
        <ContentHeader
          type="sistema-axiomatico"
          typeLabel="Sistema Axiomático"
          title={system.title}
          description={system.description}
          breadcrumbs={[{ name: 'Axiomas', href: '/axiomas' }]}
          authors={system.authors || []}
          nodeId={system.id}
        />

        <ContentBody>
          <Suspense fallback={<div className="animate-pulse h-64 bg-carbon/5 rounded" />}>
            <system.Component />
          </Suspense>
        </ContentBody>

        {axioms.length > 0 && (
          <section className="mt-24">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-8 border-b border-carbon/10 pb-4" style={{ fontVariant: 'small-caps' }}>
              Axiomas del sistema ({axioms.length})
            </h2>
            <div className="flex flex-col gap-3">
              {axioms.map(ax => ax && (
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

        {models.length > 0 && (
          <section className="mt-24">
            <SubtleSeparator />
            <h2 className="text-2xl font-bold mb-8 border-b border-carbon/10 pb-4" style={{ fontVariant: 'small-caps' }}>
              Modelos que satisfacen este sistema ({models.length})
            </h2>
            <div className="flex flex-col gap-3">
              {models.map(m => (
                <ContentCard
                  key={m.id}
                  href={`/modelo/${m.id}`}
                  title={m.title}
                  description={m.description}
                  type="modelo"
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
    <SimulationLayout simulationComponent={system.Simulation}>
      {renderContent()}
    </SimulationLayout>
  );
}
