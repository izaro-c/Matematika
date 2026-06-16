
import { Link } from 'wouter';

import { db } from '../../store/content';

// (saltando interfaces porque usamos las del store ahora si queremos, o las mantenemos)
interface BiographyMetadata {
  id: string;
  name: string;
  fullName?: string;
  era: string;
  description: string;
  image?: string;
  year: number;
  birth?: string;
  death?: string;
}

interface BiographyLayoutProps {
  Component: React.ComponentType<Record<string, unknown>>;
  Sidebar?: React.ComponentType<Record<string, unknown>> | null;
  metadata?: BiographyMetadata | null;
}

/**
 * Layout específico para páginas biográficas de matemáticos.
 * Muestra un panel izquierdo fijo (oscuro) con el retrato, fechas y aportes,
 * y un panel derecho con scroll para el contenido de la vida y obra en formato MDX.
 */
export const BiographyLayout: React.FC<BiographyLayoutProps> = ({ Component, Sidebar, metadata }) => {
  
  const renderSidebarContent = () => {
    if (!metadata) return Sidebar ? <Sidebar /> : null;

    const { id, name, fullName, birth, death, image } = metadata;
    const theorems = db.getTheoremsByAuthor(id);
    const displayName = fullName || name;
    
    // Extraer partes del nombre (ej: "Pitágoras" y "de Samos")
    const nameParts = displayName.split(' de ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? `de ${nameParts[1]}` : '';

    return (
      <div className="flex flex-col items-center text-center">
        
        {/* RETRATO */}
        <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl relative mb-8 bg-carbon flex items-center justify-center">
          {image ? (
            <img 
              src={image} 
              alt={`Retrato de ${name}`} 
              className="w-full h-full object-cover grayscale-[0.2] contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <span className="font-serif text-8xl text-white/20">{firstName.charAt(0)}</span>
          )}
        </div>
        
        {/* NOMBRES */}
        <h1 className="text-5xl font-serif text-white tracking-tight mb-2">{firstName}</h1>
        {lastName && <h2 className="text-2xl font-serif text-white/50 mb-8">{lastName}</h2>}
        {!lastName && <div className="mb-8" />}
        
        <div className="w-16 h-px bg-terracota/80 mb-8"></div>
        
        {/* FECHAS */}
        <ul className="space-y-4 text-white/70 text-sm font-sans tracking-widest uppercase mb-12 w-full">
          {birth && (
            <li>
              <span className="block text-terracota font-serif capitalize text-xs mb-1 opacity-80">Nacimiento</span>
              <span dangerouslySetInnerHTML={{ __html: birth.replace('\n', '<br />') }} />
            </li>
          )}
          {death && (
            <li>
              <span className="block text-terracota font-serif capitalize text-xs mb-1 opacity-80">Fallecimiento</span>
              <span dangerouslySetInnerHTML={{ __html: death.replace('\n', '<br />') }} />
            </li>
          )}
        </ul>

        {/* APORTES Y TEOREMAS (Automático) */}
        {theorems && theorems.length > 0 && (
          <div className="w-full text-left mt-4 border-t border-white/10 pt-8">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">Aportes Universales</h3>
            
            <div className="flex flex-col gap-4">
              {theorems.map((th, idx) => {
                const colorClass = th.color === 'salvia' ? 'text-salvia' : 
                                   th.color === 'terracota' ? 'text-terracota' : 
                                   'text-white/80';
                
                const hoverColorClass = th.color === 'salvia' ? 'group-hover:text-salvia' : 
                                        th.color === 'terracota' ? 'group-hover:text-terracota-light' : 
                                        'group-hover:text-white';

                return (
                  <Link key={idx} href={`/teorema/${th.id}`}>
                    <a className="block bg-white/5 border border-white/10 p-4 rounded-md hover:bg-white/10 transition-colors group cursor-pointer">
                      <h4 className={`${colorClass} font-serif text-lg mb-1 ${hoverColorClass}`}>{th.title}</h4>
                      <p className="text-xs text-white/60 line-clamp-2 mb-2">{th.description}</p>
                      
                      <span className="text-xs font-bold text-white/40 uppercase tracking-wider group-hover:text-white transition-colors">
                        Explorar Teorema &rarr;
                      </span>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full overflow-hidden flex bg-lienzo">
      
      {/* PANEL IZQUIERDO: FIJO Y OSCURO (MUSEO) */}
      <div className="w-[40%] bg-zinc-900 border-r border-carbon/20 text-white overflow-y-auto custom-scrollbar relative">
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
        
        <div className="p-12 relative z-10 flex flex-col min-h-full">
          {renderSidebarContent()}

          {/* Navegación de retorno */}
          <div className="mt-auto pt-16 w-full text-center">
            <Link href="/historia">
              <a className="inline-flex items-center gap-2 text-white/50 font-serif font-bold hover:text-white transition-colors tracking-widest uppercase text-xs">
                <span>&larr;</span> Volver al Códice
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: LECTURA CON SCROLL */}
      <div className="w-[60%] p-12 lg:p-20 overflow-y-auto scroll-smooth relative bg-transparent text-carbon">
        <div className="prose prose-pizarra prose-lg max-w-none mx-auto biography-mdx text-carbon font-serif">
          <Component />
        </div>

        {/* Ornamentación final */}
        <div className="mt-24 pb-12 flex justify-center text-carbon/20">
          <span className="text-3xl">❦</span>
        </div>
      </div>

    </div>
  );
};
