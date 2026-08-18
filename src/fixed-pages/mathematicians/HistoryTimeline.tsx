import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'wouter';
import { resolvePublicOrExternalAsset } from '@/lib/routes';
import { db } from '@/data/content';
import type { Mathematician } from '@/data/content/types';
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

interface ContributionItem {
  id: string;
  title: string;
  type: string;
  routePrefix: string;
}

function getMathematicianContributions(matId: string, lang?: string): ContributionItem[] {
  const items: ContributionItem[] = [];

  // Teoremas
  const thms = db.getTheoremsByAuthor(matId, lang);
  thms.forEach(t => {
    items.push({ id: t.id, title: t.title, type: t.type || 'teorema', routePrefix: '/teorema' });
  });

  // Sistemas axiomáticos
  const sysList = db.getAllAxiomaticSystems(lang);
  sysList.forEach(s => {
    const mathList = (s as unknown as { mathematicians?: string[] }).mathematicians;
    if (mathList?.includes(matId)) {
      items.push({ id: s.id, title: s.title, type: 'sistema', routePrefix: '/sistema' });
    }
  });

  // Métodos
  const methods = db.getAllMethods(lang);
  methods.forEach(m => {
    if (m.authors?.includes(matId)) {
      items.push({ id: m.id, title: m.title, type: 'metodo', routePrefix: '/metodo' });
    }
  });

  // Axiomas
  const axioms = db.getAllAxioms(lang);
  axioms.forEach(a => {
    const authors = (a as unknown as { authors?: string[] }).authors;
    if (authors?.includes(matId)) {
      items.push({ id: a.id, title: a.title, type: 'axioma', routePrefix: '/axioma' });
    }
  });

  return items.slice(0, 4);
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

// ── Tarjeta individual que brota estrictamente cuando la liana llega a su posición ─────
interface CardProps {
  node: Mathematician;
  index: number;
  lianaHeadY: number;
  totalHeight: number;
  lang: string;
  t: any;
  getLocalizedPath: (path: string) => string;
}

const MathematicianTimelineCard: React.FC<CardProps> = ({
  node,
  index,
  lianaHeadY,
  totalHeight,
  lang,
  t,
  getLocalizedPath,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardY, setCardY] = useState<number>(0);

  // Recalcular posición Y exacta cuando cambie el alto total o al montar
  useEffect(() => {
    if (cardRef.current) {
      // El nodo central donde la liana cruza la tarjeta
      const top = cardRef.current.offsetTop;
      const height = cardRef.current.offsetHeight || 140;
      setCardY(top + height * 0.5);
    }
  }, [totalHeight, node.id]);

  const isEven = index % 2 === 0;
  const period = getEra(node.birthYear || 0);
  const eraLabel = t('timeline', period.key as any);
  const contributions = useMemo(() => getMathematicianContributions(node.id, lang), [node.id, lang]);

  // Crecimiento directo: comienza estrictamente cuando la liana alcanza cardY
  const GROWTH_WINDOW = 95;
  const rawProgress = (lianaHeadY - cardY) / GROWTH_WINDOW;
  const clampedProgress = Math.max(0, Math.min(1, rawProgress));
  // Curva de apertura botánica elástica natural
  const easeOutBack = (x: number) => {
    const c1 = 1.15;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  };
  const scaleVal = rawProgress <= 0 ? 0 : (rawProgress >= 1 ? 1 : easeOutBack(clampedProgress));

  return (
    <div
      ref={cardRef}
      className={`relative flex items-center justify-between w-full ${
        isEven ? 'flex-row-reverse' : 'flex-row'
      }`}
      style={{ '--hover-era-color': period.color } as React.CSSProperties}
    >
      {/* Tarjeta del personaje (Nace de la liana hacia fuera: escala 0 a 1) */}
      <div
        className="w-full md:w-5/12"
        style={{
          transformOrigin: isEven ? 'left center' : 'right center',
          transform: `scale(${scaleVal})`,
          visibility: scaleVal === 0 ? 'hidden' : 'visible',
        }}
      >
        <div className="group relative elegant-panel p-6 bg-lienzo border border-carbon/20 hover:border-[var(--hover-era-color)] transition-all duration-300 hover:shadow-xl ">
          <Link
            href={getLocalizedPath(`/bio/${node.slug || node.id}`)}
            className="flex items-start gap-4 cursor-pointer"
          >
            {node.image && (
              <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden border border-carbon/20 bg-carbon/5 shadow-inner">
                <img
                  src={resolvePublicOrExternalAsset(node.image)}
                  alt={node.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
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

              <div>
                <h2 className="text-xl font-bold text-carbon group-hover:text-[var(--hover-era-color)] transition-colors truncate font-serif">
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
              {Math.abs(node.birthYear || 0)}
            </div>
          </Link>

          {node.description && (
            <p className="mt-3 text-xs font-sans text-carbon/75 leading-relaxed line-clamp-2">
              {node.description}
            </p>
          )}

          {/* Contribuciones en formato catálogo tipográfico Arts & Crafts */}
          {contributions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-carbon/15">
              <div className="text-[10px] ac-eyebrow text-carbon/45 mb-2 font-serif uppercase tracking-widest">
                {t('timeline', 'contributions')}
              </div>
              <div className="flex flex-wrap gap-2">
                {contributions.map((item) => (
                  <Link
                    key={item.id}
                    href={getLocalizedPath(`${item.routePrefix}/${item.id}`)}
                    style={{
                      '--era-color': getEra(node.birthYear || 0).color,
                    } as React.CSSProperties}
                    className="group/tag inline-flex items-center gap-1.5 text-xs px-2.5 py-1 text-carbon border border-carbon/25 transition-all cursor-pointer bg-[color-mix(in_srgb,var(--theme-lienzo)_90%,var(--era-color)_10%)] hover:bg-[var(--era-color)] hover:text-lienzo"
                  >
                    <span className="font-serif text-xs italic tracking-wide">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Espacio central donde pasa la liana con el brote indicador */}
      <div className="hidden md:flex w-2/12 justify-center items-center">
        <div
          className="w-4 h-4 rounded-full border-2 border-lienzo shadow-md z-10 transition-transform duration-200"
          style={{
            backgroundColor: period.color,
            transform: `scale(${0.35 + scaleVal * 0.85})`,
            boxShadow: scaleVal === 1 ? `0 0 0 4px ${period.color}33` : 'none',
          }}
        />
      </div>

      {/* Lado vacío para equilibrar el zig-zag */}
      <div className="hidden md:block w-5/12" />
    </div>
  );
};

// ── Página principal ──────────────────────────────────────────────────────────
export const HistoryTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetHeadYRef = useRef(0);
  const currentHeadYRef = useRef(0);
  const [lianaHeadY, setLianaHeadY] = useState(0);
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

  // Paradas de color exactas según los personajes de cada época en la línea temporal
  const eraColorStops = useMemo(() => {
    if (filter !== 'all') {
      const eraObj = ERA_STEPS.find(e => e.key === filter) || DEFAULT_ERA;
      return [
        { offset: '0%', color: eraObj.color },
        { offset: '100%', color: eraObj.color },
      ];
    }

    const stops: { offset: string; color: string }[] = [];
    const n = filtered.length;
    if (n === 0) return [];

    let lastEraKey = '';
    filtered.forEach((m, idx) => {
      const era = getEra(m.birthYear || 0);
      if (era.key !== lastEraKey) {
        const pct = Math.round((idx / Math.max(1, n - 1)) * 100);
        stops.push({ offset: `${pct}%`, color: era.color });
        lastEraKey = era.key;
      }
    });

    if (stops.length > 0 && stops[0].offset !== '0%') {
      stops.unshift({ offset: '0%', color: stops[0].color });
    }
    if (stops.length > 0 && stops[stops.length - 1].offset !== '100%') {
      stops.push({ offset: '100%', color: stops[stops.length - 1].color });
    }

    return stops;
  }, [filtered, filter]);

  useEffect(() => {
    let animId: number;

    const updateSmoothHead = () => {
      const diff = targetHeadYRef.current - currentHeadYRef.current;
      if (Math.abs(diff) > 0.2) {
        currentHeadYRef.current += diff * 0.1; // Amortiguación de velocidad orgánica (lerp)
        setLianaHeadY(currentHeadYRef.current);
      }
      animId = requestAnimationFrame(updateSmoothHead);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const targetY = -rect.top + window.innerHeight * 0.7;
      targetHeadYRef.current = Math.max(0, Math.min(totalHeight, targetY));
    };

    handleScroll();
    animId = requestAnimationFrame(updateSmoothHead);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [totalHeight]);

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
          <ArtsAndCraftsLiana
            totalHeight={totalHeight}
            lianaHeadY={lianaHeadY}
            eraStops={eraColorStops}
          />

          {/* Nodos de la historia */}
          <div ref={containerRef} className="relative z-10 flex flex-col gap-24 py-12">
            {filtered.map((node, i) => (
              <MathematicianTimelineCard
                key={node.id}
                node={node}
                index={i}
                lianaHeadY={lianaHeadY}
                totalHeight={totalHeight}
                lang={lang}
                t={t}
                getLocalizedPath={getLocalizedPath}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
