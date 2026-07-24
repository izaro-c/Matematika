
import { Suspense } from 'react';
import { Link } from 'wouter';
import { resolvePublicOrExternalAsset } from '@/shared/lib/routeHelper';
import { getContentPageAccent } from '@/shared/design';

import { db } from '@/entities/content';

const THEOREM_COLOR_CLASSES: Record<string, { text: string; hover: string }> = {
  salvia: { text: 'text-salvia', hover: 'group-hover:text-salvia' },
  terracota: { text: 'text-terracota', hover: 'group-hover:text-terracota-light' },
};

/**
 * Metadatos requeridos para renderizar el perfil de un matemático histórico.
 */
interface BiographyMetadata {
  id: string;
  name: string;
  fullName?: string;
  country?: string;
  description: string;
  image?: string;
  birthYear?: number;
  deathYear?: number;
}

/**
 * Propiedades de entrada para el BiographyLayout.
 */
interface BiographyLayoutProps {
  Component: React.ComponentType<Record<string, unknown>>;
  Sidebar?: React.ComponentType<Record<string, unknown>> | null;
  metadata?: BiographyMetadata | null;
}

/**
 * Layout principal para la vista de Matemáticos (Biografía).
 * 
 * Muestra un panel izquierdo fijo (oscuro) con el retrato, fechas y aportes,
 * y un panel derecho con scroll para el contenido de la vida y obra en formato MDX.
 * 
 * @param props - Propiedades que incluyen el componente a renderizar y sus metadatos.
 */
export const BiographyLayout: React.FC<BiographyLayoutProps> = ({ Component, Sidebar, metadata }) => {
  
  const renderSidebarContent = () => {
    if (!metadata) return Sidebar ? <Sidebar /> : null;

    const { id, name, fullName, birthYear, deathYear, country, image } = metadata;
    const theorems = db.getTheoremsByAuthor(id);
    const displayName = fullName || name;
    
    // Extraer partes del nombre (ej: "Pitágoras" y "de Samos")
    const nameParts = displayName.split(' de ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? `de ${nameParts[1]}` : (country ? `de ${country}` : '');

    const formatYear = (year?: number) => {
      if (year === undefined) return null;
      return year < 0 ? `${Math.abs(year)} a.C.` : `${year} d.C.`;
    };

    return (
      <div className="flex flex-col items-center text-center">
        
        {/* RETRATO */}
        <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-lienzo/10 shadow-2xl relative mb-8 bg-carbon flex items-center justify-center">
          {image ? (
            <img 
              src={resolvePublicOrExternalAsset(image)} 
              alt={`Retrato de ${name}`} 
              className="w-full h-full object-cover grayscale-[0.2] contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          ) : (
            <span className="font-serif text-8xl text-lienzo/20">{firstName.charAt(0)}</span>
          )}
        </div>
        
        {/* NOMBRES */}
        <h1 className="text-5xl font-serif text-lienzo tracking-tight mb-2">{firstName}</h1>
        {lastName && <h2 className="text-2xl font-serif text-lienzo/50 mb-8">{lastName}</h2>}
        {!lastName && <div className="mb-8" />}
        
        <div className="page-accent-bg w-16 h-px opacity-80 mb-8"></div>
        
        {/* FECHAS */}
        <ul className="space-y-4 text-lienzo/70 text-sm ac-eyebrow mb-12 w-full">
          {birthYear !== undefined && (
            <li>
              <span className="page-accent-text block font-serif capitalize text-xs mb-1 opacity-80">Nacimiento</span>
              <span>{formatYear(birthYear)}</span>
            </li>
          )}
          {deathYear !== undefined && (
            <li>
              <span className="page-accent-text block font-serif capitalize text-xs mb-1 opacity-80">Fallecimiento</span>
              <span>{formatYear(deathYear)}</span>
            </li>
          )}
        </ul>

        {/* APORTES Y TEOREMAS (Automático) */}
        {theorems && theorems.length > 0 && (
          <div className="w-full text-left mt-4 border-t border-lienzo/10 pt-8">
            <h3 className="ac-label ac-label--xs text-lienzo/40 mb-6">Aportes universales</h3>
            
            <div className="flex flex-col gap-4">
              {theorems.map((th, idx) => {
                const color = THEOREM_COLOR_CLASSES[th.color ?? ''] ?? { text: 'text-lienzo/80', hover: 'group-hover:text-lienzo' };

                return (
                  <Link key={idx} href={`/teorema/${th.id}`}>
                    <a className="block bg-lienzo/5 border border-lienzo/10 p-4 rounded-md hover:bg-lienzo/10 transition-colors group cursor-pointer">
                       <h4 className={`${color.text} font-serif text-lg mb-1 ${color.hover}`}>{th.title}</h4>
                      <p className="text-xs text-lienzo/60 line-clamp-2 mb-2">{th.description}</p>
                      
                      <span className="ac-label ac-label--md text-lienzo/40 group-hover:text-lienzo transition-colors">
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
    <div
      className="min-h-viewport w-full lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-lienzo page-accent-scope"
      data-page-type="matematico"
      style={{ '--page-accent': getContentPageAccent('matematico') } as React.CSSProperties}
    >

      {/* PANEL IZQUIERDO: FIJO Y OSCURO (MUSEO) — colapsa en móvil */}
      <div className="lg:w-[40%] bg-carbon lg:border-r border-carbon/20 text-lienzo lg:overflow-y-auto custom-scrollbar relative">
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

        <div className="p-6 sm:p-8 lg:p-12 relative z-10 flex flex-col min-h-full">
          {renderSidebarContent()}

          {/* Navegación de retorno */}
          <div className="mt-auto pt-8 lg:pt-16 w-full text-center">
            <Link href="/historia">
              <a className="ac-link-back ac-interactive text-xs text-lienzo/50 font-serif font-semibold hover:text-lienzo">
                <span>&larr;</span> Volver al Códice
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: LECTURA CON SCROLL */}
      <div className="lg:w-[60%] p-6 sm:p-8 lg:p-12 xl:p-20 lg:overflow-y-auto scroll-smooth relative bg-transparent text-carbon">
        <div className="prose prose-pizarra prose-lg max-w-none mx-auto biography-mdx editorial-reading text-carbon font-serif">
          <Suspense fallback={<div className="animate-pulse py-20 text-center text-carbon/40 italic">Desenrollando pergamino...</div>}>
            <Component />
          </Suspense>
        </div>

        {/* Ornamentación final */}
        <div className="mt-16 lg:mt-24 pb-12 flex justify-center text-carbon/20">
          <span className="text-3xl">❦</span>
        </div>
      </div>

    </div>
  );
};
