import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'wouter';

type TimelineNode = {
  id: string;
  name: string;
  era: string;
  description: string;
  slug: string;
  image?: string;
  year: number;
};

// Cargar todas las biografías dinámicamente
const bioModules = import.meta.glob('../biographies/*.mdx', { eager: true });

export const HistoryTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Parsear la metadata de los MDX
  const nodes = useMemo(() => {
    const extracted: TimelineNode[] = [];
    
    for (const path in bioModules) {
      const mod = bioModules[path] as any;
      const slug = path.split('/').pop()?.replace('.mdx', '').toLowerCase() || '';
      const meta = mod.metadata;
      
      if (meta) {
        extracted.push({
          id: slug,
          slug,
          name: meta.name || slug,
          era: meta.era || '',
          description: meta.description || '',
          image: meta.image,
          year: meta.year || 0
        });
      }
    }
    
    // Ordenar cronológicamente
    return extracted.sort((a, b) => a.year - b.year);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const scrolled = windowHeight / 2 - rect.top;
      let progress = scrolled / rect.height;
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-lienzo text-carbon font-serif pt-24 pb-32 relative" ref={containerRef}>
      
      {/* Cabecera Académica Clásica */}
      <div className="text-center mb-24 relative z-20">
        <h1 className="text-5xl text-pizarra font-bold mb-4" style={{ fontVariant: 'small-caps' }}>
          El Códice de Eruditos
        </h1>
        <p className="text-base text-carbon/60 max-w-xl mx-auto px-6 uppercase tracking-widest font-mono">
          Las mentes ilustres que forjaron el rigor matemático
        </p>
        <div className="flex items-center justify-center gap-4 mt-8 opacity-40">
          <div className="w-12 h-px bg-carbon"></div>
          <span className="text-xl">❦</span>
          <div className="w-12 h-px bg-carbon"></div>
        </div>
      </div>

      {nodes.length === 0 ? (
        <div className="text-center py-32 text-carbon/50 italic">
          El códice está vacío. Los manuscritos aguardan ser descubritos.
        </div>
      ) : (
        <div className="relative w-full max-w-4xl mx-auto px-4 md:px-0">
          
          {/* Eje Central Clásico */}
          <div className="absolute top-0 bottom-0 left-8 md:left-1/2 md:-translate-x-1/2 w-[2px] bg-carbon/10 shadow-[1px_0_0_rgba(255,255,255,0.5)] flex flex-col items-center">
            {/* Ornamento Superior e Inferior */}
            <div className="absolute top-0 w-4 h-4 border border-carbon/20 rotate-45 bg-lienzo" />
            <div className="absolute bottom-0 w-4 h-4 border border-carbon/20 rotate-45 bg-lienzo" />
          </div>

          <div className="flex flex-col gap-16 md:gap-32 relative z-10 py-12">
            {nodes.map((node, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={node.id}
                  className={`flex flex-col md:flex-row items-center w-full group
                    ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}
                  `}
                >
                  
                  {/* Nodo Central (Medallón en la línea) */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 items-center justify-center z-20">
                    <div className="w-6 h-6 rotate-45 border-2 border-carbon/20 bg-lienzo group-hover:border-terracota/50 group-hover:bg-terracota/10 transition-colors duration-500 shadow-sm" />
                  </div>

                  {/* Tarjeta del Autor */}
                  <div className={`w-full md:w-1/2 pl-16 md:pl-0 flex
                    ${isEven ? 'md:justify-end md:pr-16' : 'md:justify-start md:pl-16'}
                  `}>
                    
                    <Link href={`/bio/${node.slug}`}>
                      <a className="w-full bg-lienzo border border-carbon/10 p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-carbon/30 hover:-translate-y-1">
                        
                        {/* Marco interior sutil */}
                        <div className="absolute inset-2 border border-carbon/5 pointer-events-none" />
                        
                        {/* Ornamento Esquinas */}
                        <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-carbon/20" />
                        <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-carbon/20" />

                        {/* Retrato */}
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] border-carbon/10 bg-carbon/5 flex items-center justify-center overflow-hidden mb-6 group-hover:border-terracota/40 transition-colors duration-500 shadow-inner">
                          {node.image ? (
                            <img src={node.image} alt={node.name} className="w-full h-full object-cover grayscale-[0.3] contrast-110 group-hover:grayscale-0 transition-all duration-700" />
                          ) : (
                            <span className="font-serif text-4xl text-carbon/20 font-bold">{node.name.charAt(0)}</span>
                          )}
                        </div>

                        {/* Metadatos */}
                        <p className="text-[10px] font-mono tracking-widest uppercase text-terracota mb-2">{node.era}</p>
                        <h2 className="text-3xl font-serif text-pizarra mb-3 group-hover:text-terracota transition-colors" style={{ fontVariant: 'small-caps' }}>{node.name}</h2>
                        <div className="w-8 h-px bg-carbon/20 mb-4" />
                        <p className="text-sm text-carbon/70 italic leading-relaxed px-4">{node.description}</p>
                        
                        <div className="mt-8 font-sans text-[10px] uppercase tracking-widest text-carbon/40 font-bold group-hover:text-carbon transition-colors">
                          [ Leer Manuscrito ]
                        </div>
                      </a>
                    </Link>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
