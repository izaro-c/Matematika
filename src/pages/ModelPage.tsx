import { Suspense } from 'react';
import { useRoute, Link } from 'wouter';
import { db } from '../store/content';
import { Logo } from '../components/ui/Logo';

/**
 * Página individual para un modelo matemático.
 * Renderiza el contenido MDX del modelo correspondiente al ID de la URL.
 */
export function ModelPage() {
  const [, params] = useRoute('/modelo/:id');
  const id = params?.id;
  const model = id ? db.getModel(id) : undefined;

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lienzo text-carbon">
        <h1 className="font-serif text-3xl mb-4">Modelo no encontrado</h1>
        <p className="text-pizarra mb-6">El modelo <code className="bg-carbon/5 px-2 py-0.5 rounded">{id}</code> no existe en la base de datos.</p>
        <Link href="/" className="text-terracota hover:underline font-serif">← Volver al inicio</Link>
      </div>
    );
  }

  const Component = model.Component;

  // Get the axioms this model includes
  const modelAxioms = (model.axiomas || []).map(axId => db.getAxiom(axId)).filter(Boolean);

  return (
    <div className="min-h-screen bg-lienzo text-carbon">
      {/* Header */}
      <header className="border-b border-carbon/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="shrink-0">
            <Logo className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/axiomas" className="text-xs font-sans text-pizarra hover:text-carbon transition-colors">
              Grafo Axiomático
            </Link>
            <span className="text-carbon/20">/</span>
            <span
              className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-sans font-bold"
              style={{ background: '#4a6070', color: '#fff' }}
            >
              Modelo
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-carbon mb-3 leading-tight">
          {model.title}
        </h1>
        {model.description && (
          <p className="font-sans text-lg text-pizarra mb-8 leading-relaxed">
            {model.description}
          </p>
        )}
        {model.tags && model.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {model.tags.map(tag => (
              <Link
                key={tag}
                href={`/rama/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-sans px-2.5 py-1 bg-carbon/5 text-pizarra rounded-full hover:bg-carbon/10 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <div className="prose prose-slate max-w-none font-serif mb-12">
          <Suspense fallback={
            <div className="animate-pulse text-pizarra italic py-8">Cargando contenido...</div>
          }>
            <Component />
          </Suspense>
        </div>

        {/* Axioms list */}
        {modelAxioms.length > 0 && (
          <section className="border-t border-carbon/10 pt-8">
            <h2 className="font-serif text-xl font-bold text-carbon mb-4">
              Axiomas del modelo ({modelAxioms.length})
            </h2>
            <div className="grid gap-2">
              {modelAxioms.map(ax => ax && (
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
          </section>
        )}
      </main>
    </div>
  );
}
