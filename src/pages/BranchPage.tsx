import { useParams, Link } from 'wouter';
import { db } from '../store/ContentStore';
import { TaxonomyGraph } from '../components/ui/TaxonomyGraph';

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
          <span className="text-carbon/80 font-bold">{taxonomy.id || branchSlug}</span>
        </div>

        <div className="mb-16 border-b border-carbon/10 pb-8">
          <h1 className="text-5xl mb-4 font-bold tracking-tight" style={{ fontVariant: 'small-caps' }}>
            {taxonomy.id || branchSlug}
          </h1>
        </div>

        {taxonomy.subBranches.length === 0 && taxonomy.directItems.length === 0 ? (
          <div className="text-center py-20 text-carbon/50 italic border border-carbon/10 bg-carbon/5">
            No hay registros catalogados en esta rama actualmente.
          </div>
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
                        <span className="text-xl font-bold" style={{ fontVariant: 'small-caps' }}>{sub.name}</span>
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
                    if (entry.type === 'lesson') link = `/${entry.item.id}`;
                    else if (entry.type === 'theorem') link = `/teorema/${entry.item.id}`;
                    else if (entry.type === 'definition') link = `/definicion/${entry.item.id}`;

                    return (
                      <Link key={idx} href={link}>
                        <a className="group flex flex-col md:flex-row md:items-center justify-between p-6 border border-carbon/20 bg-lienzo hover:shadow-md transition-all duration-300">
                          <div>
                            <h3 className="text-2xl font-bold group-hover:text-terracota transition-colors">§ {entry.item.title || entry.item.id}</h3>
                            <p className="text-carbon/60 mt-2 font-sans text-sm">{entry.item.description || 'Documento formal.'}</p>
                          </div>
                          <span className="mt-4 md:mt-0 px-3 py-1 border border-carbon/10 text-[10px] uppercase tracking-widest font-sans text-carbon/50 self-start md:self-auto group-hover:border-terracota/30 group-hover:text-terracota/80 transition-colors">
                            {entry.type}
                          </span>
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
