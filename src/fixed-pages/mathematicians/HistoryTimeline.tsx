import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'wouter';
import { resolvePublicOrExternalAsset } from '@/lib/routes';
import { db } from '@/data/content';
import { InteractiveTimePlot } from '@/components/ui/InteractiveTimePlot';
import { ArtsAndCraftsLiana } from '@/components/ui/ArtsAndCraftsLiana';
import { useI18n } from '@/i18n';

// ── Utilidad: clasificación de año histórico a época ───────────────────────────
const ERA_STEPS: readonly { cutoff: number; key: 'antiquity' | 'classical' | 'medieval' | 'renaissance' | 'enlightenment'; color: string }[] = [
  { cutoff: -200, key: 'antiquity',   color: 'var(--theme-ocre)' },
  { cutoff: 500,  key: 'classical',   color: 'var(--theme-salvia)' },
  { cutoff: 1400, key: 'medieval',    color: 'var(--theme-pizarra)' },
  { cutoff: 1700, key: 'renaissance', color: 'var(--theme-terracota)' },
  { cutoff: 1900, key: 'enlightenment', color: 'var(--theme-granada)' },
];
const DEFAULT_ERA = { key: 'modern' as const, color: 'var(--theme-carbon)' };

function getEra(year: number) {
  const era = ERA_STEPS.find(e => year < e.cutoff);
  return era ?? DEFAULT_ERA;
}

// ── Insignia de época ─────────────────────────────────────────────────────────
const EraInsignia: React.FC<{ eraLabel: string; year: number }> = ({ eraLabel, year }) => {
  const period = getEra(year);

  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: period.color }}
      />
      <span className="ac-eyebrow ac-eyebrow--sm" style={{ color: period.color }}>
        {eraLabel}
      </span>
    </div>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
export const HistoryTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [totalHeight, setTotalHeight] = useState(2000);
  const [filter, setFilter] = useState<string>('all');

  const { lang, t, getLocalizedPath } = useI18n();
  const nodes = db.getAllMathematicians(lang); // ya ordenados por año

  // Épocas disponibles para filtro
  const eras = useMemo(() => {
    const set = new Set(nodes.map(n => getEra(n.birthYear || 0).key));
    return ['all', ...Array.from(set)];
  }, [nodes]);

  const filtered = filter === 'all' ? nodes : nodes.filter(n => {
    return getEra(n.birthYear || 0).key === filter;
  });

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - windowHeight)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTotalHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <div className="bg-arts-and-crafts text-carbon font-serif pt-20 pb-32 relative min-h-viewport overflow-hidden selection:bg-terracota/20">
      {/* ── Cabecera ──────────────────────────────────────────────── */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 md:px-0 mb-16">
        <Link href={getLocalizedPath('/')} className="inline-flex items-center gap-2 ac-eyebrow text-carbon/40 hover:text-carbon transition-colors mb-10">
          ← {t('topbar', 'backToLibrary')}
        </Link>

        <div className="border-b border-carbon/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="ac-eyebrow ac-eyebrow--accent text-terracota/60 mb-2">
              {t('timeline', 'eyebrow')}
            </div>
            <h1 className="text-5xl text-carbon font-bold leading-none">
              {t('timeline', 'title')}
            </h1>
            <p className="mt-3 text-sm italic text-carbon/50">
              {t('timeline', 'subtitle', { count: nodes.length, from: Math.abs(nodes[0]?.birthYear ?? 0) })}
            </p>
          </div>

          {/* Filtros de época */}
          <div className="flex flex-wrap gap-2">
            {eras.map(eraKey => {
              const label = eraKey === 'all' ? t('timeline', 'all') : t('timeline', eraKey as any);
              return (
                <button
                  key={eraKey}
                  onClick={() => setFilter(eraKey)}
                  className={`px-3 py-1.5 ac-eyebrow ac-eyebrow--sm border transition-all ${filter === eraKey
                    ? 'bg-carbon text-lienzo border-carbon'
                    : 'border-carbon/20 text-carbon/50 hover:border-carbon/50 hover:text-carbon'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Línea de tiempo ──────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-32 text-carbon/40 italic font-sans text-sm">
          {t('timeline', 'noEntries')}
        </div>
      ) : (
        <div className="relative w-full max-w-4xl mx-auto px-4 md:px-0">
          {/* Liana enredadera viva de Arts & Crafts */}
          <ArtsAndCraftsLiana totalHeight={totalHeight} scrollProgress={scrollProgress} />

          {/* Nodos de la historia */}
          <div ref={containerRef} className="relative z-10 flex flex-col gap-24 py-12">
            {filtered.map((node, i) => {
              const isEven = i % 2 === 0;
              const period = getEra(node.birthYear || 0);
              const eraLabel = t('timeline', period.key);

              return (
                <div
                  key={node.id}
                  className={`relative flex items-center justify-between w-full ${isEven ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                  {/* Tarjeta del personaje */}
                  <div className="w-full md:w-5/12" style={{ '--hover-era-color': getEra(node.birthYear || 0).color } as React.CSSProperties}>
                    <Link
                      href={getLocalizedPath(`/bio/${node.slug || node.id}`)}
                      className="group block elegant-panel p-6 bg-lienzo border border-carbon/10 hover:border-[var(--hover-era-color)]/70 hover:outline-[var(--hover-era-color)]/30 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        {node.image && (
                          <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border border-carbon/20 bg-carbon/5">
                            <img
                              src={resolvePublicOrExternalAsset(node.image)}
                              alt={node.name}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <EraInsignia eraLabel={eraLabel} year={node.birthYear || 0} />
                            <span className="font-mono text-xs text-carbon/40">
                              {node.birthYear !== undefined
                                ? (node.birthYear < 0
                                  ? `${Math.abs(node.birthYear)} a.C.`
                                  : node.birthYear)
                                : 's.d.'}
                              {node.deathYear !== undefined
                                ? ` — ${node.deathYear < 0
                                  ? `${Math.abs(node.deathYear)} a.C.`
                                  : node.deathYear}`
                                : ''}
                            </span>
                          </div>
                          

                          <div style={{ '--hover-era-color': getEra(node.birthYear || 0).color } as React.CSSProperties}>
                            <h2 className="text-xl font-bold text-carbon group-hover:text-[var(--hover-era-color)] transition-colors truncate">
                              {node.name}
                            </h2>
                          </div>

                          {node.country && (
                            <p className="text-xs text-carbon/60 italic mt-0.5 truncate">
                              {node.country}
                            </p>
                          )}
                        </div>
                        {/* Año — fondo decorativo */}
                        <div
                          className="absolute top-3 right-3 text-5xl font-serif text-carbon/[0.08] select-none pointer-events-none leading-none"
                          aria-hidden
                        >
                          {Math.abs((node.birthYear || 0))}
                        </div>
                        
                      </div>

                      {node.description && (
                        <p className="mt-4 text-xs font-sans text-carbon/70 leading-relaxed line-clamp-2">
                          {node.description}
                        </p>
                      )}

                    </Link>
                  </div>

                  {/* Espacio central donde pasa la liana */}
                  <div className="hidden md:flex w-2/12 justify-center items-center">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-lienzo shadow-sm z-10 transition-transform duration-300 hover:scale-150"
                      style={{ backgroundColor: period.color }}
                    />
                  </div>

                  {/* Lado vacío para equilibrar el zig-zag */}
                  <div className="hidden md:block w-5/12" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
