import { Suspense } from 'react';
import { useRoute } from 'wouter';
import { db } from '@/entities/content';
import { ContentDiagram, ContentLayout } from '@/widgets/layouts/ContentLayout';
import { FadeIn } from '@/shared/ui/FadeIn';
import { ContentHeader } from '@/widgets/content/ContentHeader';
import { ContentBody } from '@/shared/ui/ContentBody';
import { ContentCard } from '@/shared/ui/ContentCard';
import { SubtleSeparator } from '@/shared/ui/SubtleSeparator';

/**
 * Página de visualización de un Modelo Matemático concreto.
 * 
 * Un Modelo ilustra cómo se cumplen o violan ciertos axiomas formales en un entorno o "universo" específico.
 * Extrae la información de `ContentStore` y renderiza el contenido visual (simulación interactiva opcional).
 */
export function ModelPage() {
  const [, params] = useRoute('/modelo/:id');
  const id = params?.id;
  const model = id ? db.getModel(id) : undefined;

  if (!model) {
    return (
      <div className="min-h-viewport flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">Modelo no encontrado</h1>
        <p className="text-pizarra mb-6">El modelo <code className="bg-carbon/5 px-2 py-0.5 rounded">{id}</code> no existe en la base de datos.</p>
      </div>
    );
  }

  // const Diagram = model.Diagram;
  const system = model.satisfies ? db.getAxiomaticSystem(model.satisfies) : undefined;
  const verifiedAxioms = (model.axioms_verified || []).map(axId => db.getAxiom(axId)).filter(Boolean);

  const renderContent = () => (
    <div className="min-h-viewport bg-transparent text-carbon font-serif pb-32">
      <FadeIn className="w-full px-6 md:px-12 pt-4 pb-16">
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
            <h2 className="text-2xl font-bold mb-6 border-b border-carbon/10 pb-4">
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
            <h2 className="text-2xl font-bold mb-6 border-b border-carbon/10 pb-4">
              Axiomas verificados ({verifiedAxioms.length})
            </h2>
            <div className="flex flex-col gap-3 max-w-2xl">
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
    <ContentLayout pageType="modelo" diagram={(model.Simulation || model.Diagram) ? <ContentDiagram component={model.Simulation || model.Diagram} /> : undefined}>
      {renderContent()}
    </ContentLayout>
  );
}
