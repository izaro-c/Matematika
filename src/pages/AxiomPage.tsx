import { Suspense } from 'react';
import { useRoute, Link } from 'wouter';
import { db } from '../store/content';
import { Logo } from '../components/ui/Logo';

/**
 * Página individual para un axioma.
 * Renderiza el contenido MDX del axioma correspondiente al ID de la URL.
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
        <Link href="/" className="text-terracota hover:underline font-serif">← Volver al inicio</Link>
      </div>
    );
  }

  const Component = axiom.Component;

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
              style={{ background: '#1c1917', color: '#fff' }}
            >
              Axioma
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-carbon mb-3 leading-tight">
          {axiom.title}
        </h1>
        {axiom.description && (
          <p className="font-sans text-lg text-pizarra mb-8 leading-relaxed">
            {axiom.description}
          </p>
        )}
        {axiom.tags && axiom.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {axiom.tags.map(tag => (
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
        <div className="prose prose-slate max-w-none font-serif">
          <Suspense fallback={
            <div className="animate-pulse text-pizarra italic py-8">Cargando contenido...</div>
          }>
            <Component />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
