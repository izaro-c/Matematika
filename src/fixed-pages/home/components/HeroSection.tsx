import { Link } from 'wouter';
import { Logo } from "@/components/ui/Logo";
import { FadeIn } from "@/components/ui/FadeIn";
import { UI } from '@/design';
import { useI18n } from '@/i18n';

type SpineEmblem = 'pythagoras' | 'proof' | 'postulate' | 'graph';

/** Hierros de tapa: trazos a línea, como un estampado en seco. */
const EMBLEMS: Record<SpineEmblem, React.ReactNode> = {
  // Triángulo 3-4-5 con los cuadrados sobre catetos e hipotenusa
  pythagoras: (
    <>
      <path d="M20 28 L32 28 L20 19 Z" />
      <path d="M20 28 V40 H32 V28" />
      <path d="M20 19 H11 V28 H20" />
      <path d="M20 19 L29 7 L41 16 L32 28" />
    </>
  ),
  // ∴ sobre un filete que cierra con el ∎ de fin de demostración
  proof: (
    <>
      <circle cx="24" cy="12" r="2.4" className="ac-spine__emblem-dot" />
      <circle cx="16" cy="25" r="2.4" className="ac-spine__emblem-dot" />
      <circle cx="32" cy="25" r="2.4" className="ac-spine__emblem-dot" />
      <path d="M8 35 H34" />
      <rect x="36" y="31" width="5" height="7" className="ac-spine__emblem-dot" />
    </>
  ),
  // Primer postulado: por dos puntos pasa una recta
  postulate: (
    <>
      <path d="M5 33 L43 15" />
      <circle cx="15" cy="28.3" r="3" />
      <circle cx="33" cy="19.7" r="3" />
    </>
  ),
  // Grafo de dependencias en rombo
  graph: (
    <>
      <path d="M22.3 12.3 L14.7 21.7 M25.7 12.3 L33.3 21.7 M14.7 26.3 L22.3 35.7 M33.3 26.3 L25.7 35.7 M16.5 24 H31.5" />
      <circle cx="24" cy="10" r="2.8" />
      <circle cx="13" cy="24" r="2.8" />
      <circle cx="35" cy="24" r="2.8" />
      <circle cx="24" cy="38" r="2.8" />
    </>
  ),
};

interface HeroSpineProps {
  href: string;
  volume: string;
  title: string;
  cta: string;
  tone: 'terracota' | 'musgo' | 'pavo' | 'carbon';
  emblem: SpineEmblem;
}

function HeroSpine({ href, volume, title, cta, tone, emblem }: HeroSpineProps) {
  const { getLocalizedPath, t } = useI18n();
  return (
    <Link href={getLocalizedPath(href)} className={`ac-spine ac-spine--${tone}`}>
      <span className="ac-spine__body">
        <span className="ac-spine__title">{title}</span>
        <svg className="ac-spine__emblem" viewBox="4 4 40 40" aria-hidden="true">
          {EMBLEMS[emblem]}
        </svg>
        <span className="ac-spine__volume">
          <span className="ac-spine__volume-label">{t('hero', 'volume', { n: volume })}</span>
          <span className="ac-spine__volume-numeral" aria-hidden="true">{volume}</span>
        </span>
        <span className="sr-only">{cta}</span>
      </span>
    </Link>
  );
}

/**
 * Componente de la sección principal (Hero) de la página de inicio.
 *
 * Muestra el título principal ("Matematika"), el lema del proyecto,
 * y los accesos rápidos a las cuatro áreas principales.
 */
export const HeroSection = () => {
  const { t } = useI18n();

  return (
    <FadeIn as="header" className="relative w-full overflow-hidden border-b border-carbon/15">
      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-16 sm:pt-24 pb-16 sm:pb-20 flex flex-col items-center text-center">
        <div className="flex items-end justify-center gap-2 sm:gap-3 mb-6 max-w-full">
          <h1 className={`${UI.inkDisplay} text-[3.75rem] sm:text-[4.5rem] md:text-[7rem] text-ink tracking-tight leading-[1.05] pb-1 ${UI.textBalance}`}>
            <span className="sr-only">Matematika</span>
            <span className="flex items-end justify-center gap-2 sm:gap-3" aria-hidden="true">
              <Logo
                decorative
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-[7.5rem] md:h-[7.5rem] mb-1 shrink-0"
              />
              <span>atematika</span>
            </span>
          </h1>
        </div>

        <p className={`text-lg md:text-xl text-ink-muted italic max-w-xl leading-relaxed mb-10 ${UI.textPretty}`}>
          {t('hero', 'tagline')}
        </p>

        <div className="flex items-center gap-4 w-full max-w-xs" aria-hidden="true">
          <div className="flex-1 h-px bg-carbon/20" />
          <span className="text-ink-subtle text-xs">✦</span>
          <div className="flex-1 h-px bg-carbon/20" />
        </div>

        <div className="ac-shelf mt-12">
          <HeroSpine
            href="/plan/plan-de-estudio-camino-teorema-pitagoras"
            volume="I"
            title={t('hero', 'studyPlanTitle')}
            cta={t('hero', 'studyPlanCta')}
            tone="terracota"
            emblem="pythagoras"
          />
          <HeroSpine
            href="/metodos"
            volume="II"
            title={t('hero', 'proofMethodsTitle')}
            cta={t('hero', 'proofMethodsCta')}
            tone="musgo"
            emblem="proof"
          />
          <HeroSpine
            href="/axiomas"
            volume="III"
            title={t('hero', 'axiomsTitle')}
            cta={t('hero', 'axiomsCta')}
            tone="pavo"
            emblem="postulate"
          />
          <HeroSpine
            href="/grafo"
            volume="IV"
            title={t('hero', 'graphTitle')}
            cta={t('hero', 'graphCta')}
            tone="carbon"
            emblem="graph"
          />
        </div>
      </div>
    </FadeIn>
  );
};
