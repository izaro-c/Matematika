import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'wouter';
import { db } from '@/database/dao/content';
import { InteractiveTimePlot } from '@/boundary/components/ui/InteractiveTimePlot';

import { ArtsAndCraftsLiana } from '@/boundary/components/ui/ArtsAndCraftsLiana';

// ── Utilidad: clasificación de año histórico a época ───────────────────────────
const ERA_STEPS: readonly { cutoff: number; label: string; color: string }[] = [
  { cutoff: -200, label: 'Antigüedad', color: '#c49b4f' },
  { cutoff: 500, label: 'Mundo Clásico', color: '#A2C2A2' },
  { cutoff: 1400, label: 'Medievo', color: '#5D7080' },
  { cutoff: 1700, label: 'Renacimiento', color: '#C86446' },
  { cutoff: 1900, label: 'Ilustración', color: '#333' },
];
const DEFAULT_ERA = { label: 'Época Moderna', color: '#333' };

function getEra(year: number) {
  const era = ERA_STEPS.find(e => year < e.cutoff);
  return era ?? DEFAULT_ERA;
}

// ── Insignia de época ─────────────────────────────────────────────────────────
const EraInsignia: React.FC<{ era: string; year: number }> = ({ era, year }) => {
  const period = getEra(year);

  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: period.color }}
      />
      <span className="text-[10px] font-sans uppercase tracking-[0.2em]" style={{ color: period.color }}>
        {era}
      </span>
    </div>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
/**
 * Página principal de la Línea de Tiempo Histórica.
 * Muestra a todos los matemáticos ordenados cronológicamente a lo largo de 
 * un gráfico dinámico, permitiendo filtrar y explorar sus vidas.
 */
export const HistoryTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [totalHeight, setTotalHeight] = useState(2000);
  const [filter, setFilter] = useState<string>('Todos');

  const nodes = db.getAllMathematicians(); // ya ordenados por año

  // Épocas disponibles para filtro
  const eras = useMemo(() => {
    const set = new Set(nodes.map(n => getEra(n.birthYear || 0).label));
    return ['Todos', ...Array.from(set)];
  }, [nodes]);

  const filtered = filter === 'Todos' ? nodes : nodes.filter(n => {
    return getEra(n.birthYear || 0).label === filter;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setTotalHeight(containerRef.current.scrollHeight);
      const scrolled = window.innerHeight / 2 - rect.top;
      setScrollProgress(Math.max(0, Math.min(1, scrolled / rect.height)));
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    setTimeout(handleScroll, 100);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      className="bg-lienzo bg-arts-and-crafts text-carbon font-serif pt-20 pb-32 relative min-h-screen"
      style={{ backgroundImage: 'url(/images/bg-botanical.png)', backgroundSize: '500px' }}
      ref={containerRef}
    >
      {/* Fondo sutil */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.025] mix-blend-multiply"
      />

      {/* ── Cabecera ──────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 md:px-0 mb-16">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-carbon/40 hover:text-carbon transition-colors mb-10">
            ← Biblioteca
          </a>
        </Link>

        <div className="border-b border-carbon/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-sans uppercase tracking-[0.3em] text-terracota/60 mb-2">
              Crónica Universal
            </div>
            <h1 className="text-5xl text-carbon font-bold leading-none" style={{ fontVariant: 'small-caps' }}>
              Índice Biográfico
            </h1>
            <p className="mt-3 text-sm italic text-carbon/50">
              {nodes.length} matemáticos · {Math.abs(nodes[0]?.birthYear ?? 0)} a.C. — presente
            </p>
            <InteractiveTimePlot nodes={nodes} />
          </div>

          {/* Filtros de época */}
          <div className="flex flex-wrap gap-2">
            {eras.map(era => (
              <button
                key={era}
                onClick={() => setFilter(era)}
                className={`px-3 py-1.5 text-[10px] font-sans uppercase tracking-widest border transition-all ${filter === era
                  ? 'bg-carbon text-lienzo border-carbon'
                  : 'border-carbon/20 text-carbon/50 hover:border-carbon/50 hover:text-carbon'
                  }`}
              >
                {era}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Línea de tiempo ──────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-32 text-carbon/40 italic font-sans text-sm">
          Sin entradas en esta época.
        </div>
      ) : (
        <div className="relative w-full max-w-4xl mx-auto px-4 md:px-0">
          <ArtsAndCraftsLiana scrollProgress={scrollProgress} totalHeight={totalHeight} />

          <div className="flex flex-col gap-20 md:gap-28 relative z-20 py-4">
            {filtered.map((node, index) => {
              const isEven = index % 2 === 0;
              const theorems = db.getTheoremsByAuthor(node.id);

              return (
                <div
                  key={node.id}
                  className={`flex items-center w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Nodo central */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-30 items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-lienzo border-2 border-carbon/30 shadow-sm" />
                  </div>

                  {/* Tarjeta */}
                  <div
                    className={`w-full md:w-[46%] flex ${isEven ? 'md:ml-auto md:pr-[7%]' : 'md:mr-auto md:pl-[7%]'
                      }`}
                  >
                    <Link href={`/bio/${node.slug}`}>
                      <a className="w-full group relative bg-lienzo border border-carbon/15 hover:border-carbon/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-col">
                        {/* Esquinas ornamentales */}
                        <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-carbon/25" />
                        <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-carbon/25" />
                        <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-carbon/25" />
                        <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-carbon/25" />

                        <div className="p-5 flex gap-5">
                          {/* Retrato */}
                          <div className="w-20 h-24 border border-carbon/10 bg-carbon/5 shrink-0 overflow-hidden relative">
                            {node.image ? (
                              <img
                                src={node.image}
                                alt={node.name}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-serif text-3xl text-carbon/20">
                                {node.name.charAt(0)}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-terracota/5 mix-blend-overlay pointer-events-none" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <EraInsignia era={""} year={(node.birthYear || 0)} />
                            <h2
                              className="text-2xl font-bold text-carbon group-hover:text-terracota transition-colors leading-tight mt-1 mb-2"
                              style={{ fontVariant: 'small-caps' }}
                            >
                              {node.name}
                            </h2>
                            <p className="text-xs text-carbon/55 italic leading-relaxed line-clamp-2">
                              {node.description}
                            </p>
                          </div>
                        </div>

                        {/* Teoremas */}
                        {theorems.length > 0 && (
                          <div className="px-5 pb-4 flex flex-wrap gap-1.5 border-t border-carbon/8 pt-3">
                            {theorems.map(t => (
                              <span
                                key={t.id}
                                className="text-[9px] font-sans uppercase tracking-widest border border-carbon/15 px-2 py-0.5 text-carbon/50"
                              >
                                {t.title}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Año — fondo decorativo */}
                        <div
                          className="absolute top-3 right-3 text-5xl font-serif text-carbon/[0.04] select-none pointer-events-none leading-none"
                          aria-hidden
                        >
                          {Math.abs((node.birthYear || 0))}
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
