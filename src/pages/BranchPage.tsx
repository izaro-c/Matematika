import { useParams, Link } from 'wouter';
import { db } from '../store/content';
import { TaxonomyGraph } from '../components/ui/TaxonomyGraph';
import { EmptyState } from '../components/ui/EmptyState';

/**
 * Página principal de una Rama (ej. "Álgebra Lineal").
 * Renderiza la red/taxonomía completa de temas, lecciones y teoremas
 * asociados a esta rama en un grafo interactivo.
 */
export const BranchPage = () => {
  const { id } = useParams();
  const branchSlug = id || '';

  const taxonomy = db.getBranchTaxonomy(branchSlug);

  return (
    <div className="min-h-screen bg-lienzo text-carbon font-serif pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">

        {/* Navegación por Migas de Pan (Breadcrumbs) */}
        <div className="mb-12 flex flex-wrap items-center gap-2 text-sm font-sans tracking-widest uppercase text-carbon/40">
          <Link href="/">
            <a className="hover:text-carbon transition-colors">Biblioteca</a>
          </Link>
          {taxonomy.breadcrumbs.map((crumb) => (
            <span key={crumb.slug} className="flex items-center gap-2">
              <span>/</span>
              <Link href={`/rama/${crumb.slug}`}>
                <a className="hover:text-carbon transition-colors">{crumb.name}</a>
              </Link>
            </span>
          ))}
          <span>/</span>
          <span className="text-carbon/80 font-bold">{taxonomy.name || taxonomy.id || branchSlug}</span>
        </div>

        <div className="mb-16 border-b border-carbon/10 pb-8">
          <div className="flex items-baseline gap-4">
            {taxonomy.id && /^\d{2}[A-Z]?$/.test(taxonomy.id) && taxonomy.id !== taxonomy.name && (
              <span className="text-2xl font-sans font-bold text-carbon/40 tracking-wider">{taxonomy.id}</span>
            )}
            <h1 className="text-5xl font-bold tracking-tight" style={{ fontVariant: 'small-caps' }}>
              {taxonomy.name || taxonomy.id || branchSlug}
            </h1>
          </div>
        </div>

        {taxonomy.subBranches.length === 0 && taxonomy.directItems.length === 0 ? (
          <EmptyState
            message="No hay registros catalogados en esta rama actualmente."
            actionLabel="Volver a la biblioteca"
            actionHref="/"
          />
        ) : (
          <div className="flex flex-col gap-16">

            {/* Gráfico Interactivo de Dependencias */}
            <div className="w-full">
              <TaxonomyGraph taxonomy={taxonomy} />
            </div>

            {/* Sub-ramas (Carpetas) */}
            {taxonomy.subBranches.length > 0 && (
              <div>
                <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-carbon/50 mb-6">Sub-ramas</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {taxonomy.subBranches.map(sub => (
                    <Link key={sub.slug} href={`/rama/${sub.slug}`}>
                      <a className="group flex items-center justify-between p-6 bg-carbon/5 border border-carbon/10 hover:bg-carbon hover:text-lienzo transition-all duration-300">
                        <span className="flex items-baseline gap-3">
                          {/^\d{2}[A-Z]?$/.test(sub.slug) && (
                            <span className="text-base font-sans font-bold text-carbon/40">{sub.slug}</span>
                          )}
                          <span className="text-xl font-bold" style={{ fontVariant: 'small-caps' }}>{sub.name}</span>
                        </span>
                        <span className="text-xs font-sans tracking-widest opacity-50 group-hover:opacity-100">Explorar →</span>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Conceptos Directos (Archivos) */}
            {taxonomy.directItems.length > 0 && (
              <div>
                <h2 className="text-sm font-sans font-bold uppercase tracking-widest text-carbon/50 mb-6">Conceptos Fundamentales</h2>
                <div className="flex flex-col gap-4">
                  {taxonomy.directItems.map((entry, idx) => {
                    let link = '/';
                    if (entry.type === 'lesson') link = `/${entry.item.slug}`;
                    else if (entry.type === 'theorem') link = `/teorema/${entry.item.id}`;
                    else if (entry.type === 'definition') link = `/definicion/${entry.item.id}`;
                    else if (entry.type === 'axiom') link = `/axioma/${entry.item.id}`;

                    const typeStyles: Record<string, { borderClass: string, textClass: string, label: string }> = {
                      'theorem': { borderClass: 'border-terracota/30 hover:border-terracota/60', textClass: 'text-terracota', label: 'Teorema' },
                      'definition': { borderClass: 'border-pavo/30 hover:border-pavo/60', textClass: 'text-pavo', label: 'Definición' },
                      'lesson': { borderClass: 'border-salvia/30 hover:border-salvia/60', textClass: 'text-salvia', label: 'Lección' },
                      'exercise': { borderClass: 'border-ocre/40 border-dashed hover:border-solid hover:border-ocre/60', textClass: 'text-ocre', label: 'Ejercicio' },
                      'example': { borderClass: 'border-granada/30 hover:border-granada/60', textClass: 'text-granada', label: 'Ejemplo' },
                      'useCase': { borderClass: 'border-musgo/30 hover:border-musgo/60', textClass: 'text-musgo', label: 'Caso de Uso' },
                      'axiom': { borderClass: 'border-carbon/30 hover:border-carbon/60', textClass: 'text-carbon', label: 'Axioma' },
                    };
                    const style = typeStyles[entry.type] || { borderClass: 'border-carbon/20 hover:border-carbon/40', textClass: 'text-carbon', label: entry.type };

                    return (
                      <Link key={idx} href={link}>
                        <a className={`group flex flex-col md:flex-row md:items-center justify-between p-6 border bg-lienzo hover:shadow-md transition-all duration-300 ${style.borderClass}`}>
                          <div>
                            <h3 className={`text-2xl font-bold transition-colors opacity-90 group-hover:opacity-100 ${style.textClass}`} style={{ fontVariant: 'small-caps' }}>
                              {(entry.item as any).title || entry.item.id}
                            </h3>
                            <p className="text-carbon/60 mt-2 font-sans text-sm">{(entry.item as any).description || 'Documento formal.'}</p>
                          </div>

                          <div className="mt-4 md:mt-0">
                            <span className={`font-serif italic text-lg transition-colors opacity-60 group-hover:opacity-100 ${style.textClass}`}>
                              {style.label}
                            </span>
                          </div>
                        </a>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
};
