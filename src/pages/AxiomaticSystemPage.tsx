import { Suspense } from 'react';
import { useRoute, Link } from 'wouter';
import { db } from '../store/content';
import { EmptyState } from '../components/ui/EmptyState';
import { SimulationLayout } from '../components/layout/SimulationLayout';

export function AxiomaticSystemPage() {
  const [, params] = useRoute('/sistema/:id');
  const id = params?.id;
  const system = id ? db.getAxiomaticSystem(id) : undefined;

  if (!system) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">Sistema axiomático no encontrado</h1>
        <p className="text-pizarra mb-6">El sistema <code className="bg-carbon/5 px-2 py-0.5 rounded">{id}</code> no existe en la base de datos.</p>
        <Link href="/" className="text-terracota hover:underline font-serif">← Volver al inicio</Link>
      </div>
    );
  }

  const Component = system.Component;
  const axioms = (system.axiomas || []).map(axId => db.getAxiom(axId)).filter(Boolean);
  const models = db.getModelsForSystem(system.id);

  const renderContent = () => (
    <div className="min-h-screen bg-transparent text-carbon font-serif pb-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-24">

        {/* Breadcrumbs */}
        <div className="mb-12 flex items-center gap-3 text-sm font-sans tracking-widest uppercase text-carbon/40">
          <Link href="/">
            <a className="hover:text-carbon transition-colors">Biblioteca</a>
          </Link>
          <span>/</span>
          <span className="text-carbon/60">Sistema Axiomático</span>
        </div>

        {/* Header */}
        <div className="mb-16 border-b border-carbon/10 pb-12">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold"
              style={{ background: '#3b5e6b', color: '#fff' }}
            >
              Sistema Axiomático
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6" style={{ fontVariant: 'small-caps' }}>
            {system.title}
          </h1>
          {system.description && (
            <p className="text-xl text-carbon/70 italic border-l-4 border-carbon/20 pl-6 leading-relaxed">
              {system.description}
            </p>
          )}

          {system.mathematicians && system.mathematicians.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-4">
              {system.mathematicians.map(mId => {
                const m = db.getMathematicianById(mId);
                return m ? (
                  <Link key={mId} href={`/bio/${m.slug}`}>
                    <a className="inline-flex items-center gap-3 px-4 py-2 border border-carbon/10 bg-carbon/5 hover:bg-carbon hover:text-lienzo transition-colors rounded-full">
                      <span className="font-sans text-xs uppercase tracking-widest font-bold">Autor:</span>
                      <span className="font-bold" style={{ fontVariant: 'small-caps' }}>{m.name}</span>
                    </a>
                  </Link>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Main MDX content */}
        <div className="prose prose-pizarra prose-lg max-w-none mb-16">
          <Suspense fallback={
            <div className="animate-pulse h-64 bg-carbon/5 rounded"></div>
          }>
            <Component />
          </Suspense>
        </div>

        {/* Axioms list */}
        <section className="border-t border-carbon/10 pt-8 mb-8">
          <h2 className="font-serif text-xl font-bold text-carbon mb-4">
            Axiomas del sistema ({axioms.length})
          </h2>
          {axioms.length > 0 ? (
            <div className="grid gap-2">
              {axioms.map(ax => ax && (
                <Link
                  key={ax.id}
                  href={`/axioma/${ax.id}`}
                  className="flex items-center gap-3 p-3 rounded border border-carbon/10 bg-white/60 hover:bg-white hover:border-carbon/20 transition-all group"
                >
                  <span
                    className="text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold shrink-0"
                    style={{ background: '#1c1917', color: '#fff' }}
                  >
                    Axioma
                  </span>
                  <span className="font-serif text-sm text-carbon group-hover:text-carbon/80 capitalize">
                    {ax.title}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState message="Este sistema no tiene axiomas definidos." icon="△" />
          )}
        </section>

        {/* Models list */}
        {models.length > 0 && (
          <section className="border-t border-carbon/10 pt-8">
            <h2 className="font-serif text-xl font-bold text-carbon mb-4">
              Modelos que satisfacen este sistema ({models.length})
            </h2>
            <div className="grid gap-2">
              {models.map(m => (
                <Link
                  key={m.id}
                  href={`/modelo/${m.id}`}
                  className="flex items-center gap-3 p-3 rounded border border-carbon/10 bg-white/60 hover:bg-white hover:border-carbon/20 transition-all group"
                >
                  <span
                    className="text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold shrink-0"
                    style={{ background: '#5D7080', color: '#fff' }}
                  >
                    Modelo
                  </span>
                  <span className="font-serif text-sm text-carbon group-hover:text-carbon/80 capitalize">
                    {m.title}
                  </span>
                  {m.description && (
                    <span className="font-sans text-xs text-pizarra/60 ml-2 truncate">
                      {m.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  return (
    <SimulationLayout simulationComponent={system.Simulation}>
      {renderContent()}
    </SimulationLayout>
  );
}
