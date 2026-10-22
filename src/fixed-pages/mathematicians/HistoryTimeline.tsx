import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'wouter';
import { resolvePublicOrExternalAsset } from '@/lib/routes';
import { formatLifeDates } from '@/lib/lifeDates';
import { db } from '@/data/content';
import type { Mathematician } from '@/data/content/types';
import { ArtsAndCraftsLiana } from '@/components/ui/ArtsAndCraftsLiana';
import { useI18n } from '@/i18n';

type Translate = ReturnType<typeof useI18n>['t'];

// ── Siglos ─────────────────────────────────────────────────────────────────────
// Cada matemático va en el siglo en que trabajó: 35 años después de nacer, o su muerte si fue antes.

const ROMAN: readonly [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const toRoman = (n: number) => {
  let out = '';
  for (const [value, glyph] of ROMAN) while (n >= value) { out += glyph; n -= value; }
  return out;
};
const toOrdinal = (n: number) => {
  const tens = n % 100;
  const suffix = tens >= 11 && tens <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[n % 10] ?? 'th';
  return `${n}${suffix}`;
};

/** Siglo con signo: −6 = siglo VI a. C., 19 = siglo XIX */
const centuryOf = (year: number) => (year < 0 ? -(Math.floor((-year - 1) / 100) + 1) : Math.floor((year - 1) / 100) + 1);
const floruit = (m: Mathematician) => Math.min((m.birthYear ?? 0) + 35, m.deathYear ?? Infinity);

const centuryLabel = (century: number, t: Translate) => {
  const n = Math.abs(century);
  return t('timeline', century < 0 ? 'centuryBC' : 'century', { roman: toRoman(n), ordinal: toOrdinal(n) });
};

/** Siglos vacíos entre dos siglos con entradas (no hay año 0: del I a. C. se pasa al I) */
const centuriesBetween = (from: number, to: number) => to - from - 1 - (from < 0 && to > 0 ? 1 : 0);

/** Solo un hueco largo se marca con una nota; los cortos ya se ven en los rótulos de siglo */
const MIN_GAP_CENTURIES = 3;

const CENTURY_PIGMENTS = ['ocre', 'canela', 'terracota', 'mora', 'pavo', 'musgo', 'granada'] as const;

interface CenturyGroup {
  century: number;
  color: string;
  gap: number;
  people: Mathematician[];
}

function groupByCentury(people: Mathematician[]): CenturyGroup[] {
  const groups: CenturyGroup[] = [];
  for (const m of people) {
    const century = centuryOf(floruit(m));
    const last = groups[groups.length - 1];
    if (last?.century === century) { last.people.push(m); continue; }
    const pigment = CENTURY_PIGMENTS[Math.min(groups.length, CENTURY_PIGMENTS.length - 1)];
    groups.push({
      century,
      color: `var(--theme-${pigment})`,
      gap: last ? centuriesBetween(last.century, century) : 0,
      people: [m],
    });
  }
  return groups;
}

const centuryAnchor = (century: number) => {
  const label = century < 0 ? `${-century}ac` : String(century);
  return `siglo-${label}`;
};

interface ContributionItem {
  id: string;
  title: string;
  routePrefix: string;
}

function getMathematicianContributions(matId: string, lang?: string): ContributionItem[] {
  const items: ContributionItem[] = [];

  db.getTheoremsByAuthor(matId, lang).forEach(t => {
    items.push({ id: t.id, title: t.title, routePrefix: '/teorema' });
  });

  db.getAllAxiomaticSystems(lang).forEach(s => {
    const mathList = (s as unknown as { mathematicians?: string[] }).mathematicians;
    if (mathList?.includes(matId)) items.push({ id: s.id, title: s.title, routePrefix: '/sistema' });
  });

  db.getAllMethods(lang).forEach(m => {
    if (m.authors?.includes(matId)) items.push({ id: m.id, title: m.title, routePrefix: '/metodo' });
  });

  db.getAllAxioms(lang).forEach(a => {
    const authors = (a as unknown as { authors?: string[] }).authors;
    if (authors?.includes(matId)) items.push({ id: a.id, title: a.title, routePrefix: '/axioma' });
  });

  return items.slice(0, 4);
}

const usePrefersReducedMotion = () => {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
};

const useIsNarrow = () => {
  const query = '(max-width: 767px)';
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return narrow;
};

// ── Tarjeta que brota cuando la liana llega a su altura: primero el tallo, después la tarjeta ──
interface CardProps {
  node: Mathematician;
  index: number;
  color: string;
  lianaHeadY: number;
  totalHeight: number;
}

/** Tramo de liana (px) en que el tallo va del nudo a la tarjeta; al acabar, la tarjeta se despliega sola */
const STEM_WINDOW = 60;

const MathematicianTimelineCard: React.FC<CardProps> = ({ node, index, color, lianaHeadY, totalHeight }) => {
  const { lang, t, getLocalizedPath } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardY, setCardY] = useState<number>(0);

  // Altura dentro de la lista donde la liana cruza la tarjeta
  useEffect(() => {
    if (cardRef.current) {
      const top = cardRef.current.offsetTop;
      const height = cardRef.current.offsetHeight || 140;
      setCardY(top + height * 0.5);
    }
  }, [totalHeight, node.id]);

  const isEven = index % 2 === 0;
  const contributions = useMemo(() => getMathematicianContributions(node.id, lang), [node.id, lang]);
  const dates = formatLifeDates(t, node.birthYear, node.deathYear);

  // El tallo sigue a la liana; la tarjeta no se queda nunca a medias (la liana no encoge)
  const stemProgress = Math.max(0, Math.min(1, (lianaHeadY - cardY) / STEM_WINDOW));
  const grown = stemProgress >= 1;

  return (
    <div
      ref={cardRef}
      className="ac-history__row"
      data-side={isEven ? 'right' : 'left'}
      style={{ '--acc': color, '--stem': stemProgress } as React.CSSProperties}
    >
      <span className="ac-history__node" aria-hidden="true" data-grown={stemProgress > 0 || undefined}>
        <span className="ac-history__stem" />
      </span>

      <div className="ac-history__bud" data-grown={grown || undefined}>
        <article className="ac-history-card">
          {node.birthYear !== undefined && (
            <span className="ac-history-card__year" aria-hidden="true">{Math.abs(node.birthYear)}</span>
          )}
          <header className="ac-history-card__head">
            {node.image && (
              <span className="ac-history-card__portrait">
                <img
                  src={resolvePublicOrExternalAsset(node.image)}
                  alt=""
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </span>
            )}
            <div className="ac-history-card__heading">
              <h3>
                <Link href={getLocalizedPath(`/bio/${node.slug || node.id}`)} className="ac-history-card__name">
                  {node.name}
                </Link>
              </h3>
              {node.country && <p className="ac-history-card__place">{node.country}</p>}
            </div>
            {dates && <span className="ac-history-card__dates ac-rubric">{dates}</span>}
          </header>
          <span className="ac-history-card__rule" aria-hidden="true" />

          {node.description && <p className="ac-history-card__desc">{node.description}</p>}

          {contributions.length > 0 && (
            <p className="ac-history-card__see">
              <span className="ac-rubric">{t('branch', 'see')}</span>{' '}
              {contributions.map((item, i) => (
                <span key={item.id}>
                  {i > 0 && ' · '}
                  <Link href={getLocalizedPath(`${item.routePrefix}/${item.id}`)}>{item.title}</Link>
                </span>
              ))}
            </p>
          )}
        </article>
      </div>
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
  const [eraStops, setEraStops] = useState<{ offset: string; color: string }[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const narrow = useIsNarrow();

  const { lang, t, getLocalizedPath } = useI18n();
  const nodes = db.getAllMathematicians(lang); // ya ordenados por año
  const groups = useMemo(() => groupByCentury(nodes), [nodes]);

  // Una entrada brota cuando su centro sube 20 px sobre el pie de la ventana; al final de la página, entera.
  // Nunca encoge, y cuanto más lejos queda la meta (scroll rápido o salto del índice), más deprisa crece.
  useEffect(() => {
    let animId = 0;

    const updateSmoothHead = () => {
      const diff = targetHeadYRef.current - currentHeadYRef.current;
      if (diff > 0.2) {
        const rate = Math.min(0.45, 0.1 + diff / 2500);
        currentHeadYRef.current += Math.max(diff * rate, Math.min(diff, 2));
        setLianaHeadY(currentHeadYRef.current);
      }
      animId = requestAnimationFrame(updateSmoothHead);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      const targetY = atEnd ? totalHeight + STEM_WINDOW : -rect.top + window.innerHeight + 2 * STEM_WINDOW / 3;
      targetHeadYRef.current = Math.max(0, Math.min(totalHeight + STEM_WINDOW, targetY));
    };

    if (reducedMotion) {
      currentHeadYRef.current = targetHeadYRef.current = totalHeight + STEM_WINDOW;
      setLianaHeadY(currentHeadYRef.current);
      return;
    }

    handleScroll();
    animId = requestAnimationFrame(updateSmoothHead);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [totalHeight, reducedMotion]);

  // Alto de la lista y paradas de color de la liana a la altura real de cada siglo
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const height = el.offsetHeight;
      setTotalHeight(height);
      const sections = Array.from(el.querySelectorAll<HTMLElement>('[data-century-color]'));
      const pct = (y: number) => (y / Math.max(1, height)) * 100;
      setEraStops(sections.map((h) => ({ offset: `${pct(h.offsetTop).toFixed(2)}%`, color: h.dataset.centuryColor! })));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [groups]);

  let rowIndex = 0;

  return (
    <div className="ac-history bg-arts-and-crafts">
      <header className="ac-history__head">
        <Link href={getLocalizedPath('/')} className="ac-history__back ac-rubric">
          ← {t('topbar', 'backToLibrary')}
        </Link>
        <h1 className="ac-history__title">{t('timeline', 'title')}</h1>
        <div className="ac-history__index">
          <nav aria-label={t('timeline', 'centuries')}>
            {groups.map((g, i) => (
              <span key={g.century}>
                {i > 0 && <span aria-hidden="true"> · </span>}
                <a href={`#${centuryAnchor(g.century)}`} className="ac-rubric" style={{ '--acc': g.color } as React.CSSProperties}>
                  {centuryLabel(g.century, t)}
                </a>
              </span>
            ))}
          </nav>
          <span className="ac-history__count ac-rubric">{t('library', 'entriesCount', { count: nodes.length })}</span>
        </div>
      </header>

      <div className="ac-history__line">
        <ArtsAndCraftsLiana totalHeight={totalHeight} lianaHeadY={lianaHeadY} eraStops={eraStops} narrow={narrow} />

        <div ref={containerRef} className="ac-history__list">
          {groups.map((g) => (
            <section
              key={g.century}
              id={centuryAnchor(g.century)}
              aria-labelledby={`${centuryAnchor(g.century)}-h`}
              className="ac-history__century"
              style={{ '--acc': g.color } as React.CSSProperties}
            >
              <div className="ac-history__label">
                {g.gap >= MIN_GAP_CENTURIES && (
                  <div className="ac-history__void" style={{ '--gap-centuries': g.gap } as React.CSSProperties}>
                    <p className="ac-history__gap">{t('timeline', 'gap', { count: g.gap })}</p>
                  </div>
                )}
                <h2 id={`${centuryAnchor(g.century)}-h`} className="ac-rubric" data-century-color={g.color}>
                  {centuryLabel(g.century, t)}
                </h2>
              </div>
              {g.people.map((node) => (
                <MathematicianTimelineCard
                  key={node.id}
                  node={node}
                  index={rowIndex++}
                  color={g.color}
                  lianaHeadY={lianaHeadY}
                  totalHeight={totalHeight}
                />
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
