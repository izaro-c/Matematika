import type { CSSProperties } from 'react';
import { Link } from 'wouter';
import { Logo } from "@/shared/ui/Logo";
import { FadeIn } from "@/shared/ui/FadeIn";
import { SITE_TAGLINE } from '@/shared/lib/constants';
import { UI } from '@/shared/design';

interface HeroCardProps {
  href: string;
  eyebrow: string;
  title: string;
  cta: string;
  bgClass: string;
  borderClass?: string;
  style?: CSSProperties;
}

function HeroCard({
  href,
  eyebrow,
  title,
  cta,
  bgClass,
  borderClass = 'border-carbon/30',
  style,
}: HeroCardProps) {
  return (
    <Link
      href={href}
      className={`${UI.ctaCardHero} ${bgClass} ${borderClass}`}
      style={style}
    >
      <span className={UI.ctaEyebrow}>{eyebrow}</span>
      <span className={`${UI.ctaTitle} ${UI.textBalance}`}>{title}</span>
      <span className={UI.ctaAction}>{cta}</span>
    </Link>
  );
}

const CTA_SHADOWS: Record<string, { rest: string; hover: string }> = {
  terracota: {
    rest: '0 10px 30px -10px color-mix(in srgb, var(--theme-terracota) 35%, transparent)',
    hover: '0 20px 40px -10px color-mix(in srgb, var(--theme-terracota) 50%, transparent)',
  },
  musgo: {
    rest: '0 10px 30px -10px color-mix(in srgb, var(--theme-musgo) 35%, transparent)',
    hover: '0 20px 40px -10px color-mix(in srgb, var(--theme-musgo) 50%, transparent)',
  },
  pavo: {
    rest: '0 10px 30px -10px color-mix(in srgb, var(--theme-pavo) 35%, transparent)',
    hover: '0 20px 40px -10px color-mix(in srgb, var(--theme-pavo) 50%, transparent)',
  },
  carbon: {
    rest: '0 10px 30px -10px color-mix(in srgb, var(--theme-carbon) 40%, transparent)',
    hover: '0 20px 40px -10px color-mix(in srgb, var(--theme-carbon) 55%, transparent)',
  },
};

/**
 * Componente de la sección principal (Hero) de la página de inicio.
 *
 * Muestra el título principal ("Matematika"), el lema del proyecto,
 * y los accesos rápidos a las cuatro áreas principales.
 */
export const HeroSection = () => {
  return (
    <FadeIn as="header" className="relative w-full overflow-hidden border-b border-carbon/15">
      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-16 sm:pt-24 pb-16 sm:pb-20 flex flex-col items-center text-center">
        <div className="flex items-end justify-center gap-2 sm:gap-3 mb-6 max-w-full">
          <Logo className="w-16 h-16 sm:w-24 sm:h-24 md:w-[7.5rem] md:h-[7.5rem] opacity-90 mb-1 shrink-0" />
          <h1 className={`text-[3.75rem] sm:text-[4.5rem] md:text-[7rem] text-carbon tracking-tight leading-none ${UI.textBalance}`}>
            atematika
          </h1>
        </div>

        <p className={`text-lg md:text-xl text-carbon/60 italic max-w-xl leading-relaxed mb-10 ${UI.textPretty}`}>
          {SITE_TAGLINE}
        </p>

        <div className="flex items-center gap-4 w-full max-w-xs opacity-30" aria-hidden="true">
          <div className="flex-1 h-px bg-carbon" />
          <span className="text-carbon text-xs">✦</span>
          <div className="flex-1 h-px bg-carbon" />
        </div>

        <div className="mt-12 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full items-stretch">
          <HeroCard
            href="/plan/camino-teorema-pitagoras"
            eyebrow="Plan de estudio"
            title="Camino a Pitágoras"
            cta="Acceder a la ruta →"
            bgClass="bg-terracota text-lienzo"
            style={{
              '--ac-cta-shadow': CTA_SHADOWS.terracota.rest,
              '--ac-cta-shadow-hover': CTA_SHADOWS.terracota.hover,
            } as CSSProperties}
          />
          <HeroCard
            href="/metodos"
            eyebrow="Demostraciones lógicas"
            title="Métodos de prueba"
            cta="Explorar →"
            bgClass="bg-musgo text-lienzo"
            style={{
              '--ac-cta-shadow': CTA_SHADOWS.musgo.rest,
              '--ac-cta-shadow-hover': CTA_SHADOWS.musgo.hover,
            } as CSSProperties}
          />
          <HeroCard
            href="/axiomas"
            eyebrow="Fundamentos"
            title="Axiomas"
            cta="Ver relaciones →"
            bgClass="bg-pavo text-lienzo"
            borderClass="border-lienzo/30"
            style={{
              '--ac-cta-shadow': CTA_SHADOWS.pavo.rest,
              '--ac-cta-shadow-hover': CTA_SHADOWS.pavo.hover,
            } as CSSProperties}
          />
          <HeroCard
            href="/grafo"
            eyebrow="Mapa interactivo"
            title="Grafo visual"
            cta="Ver dependencias →"
            bgClass="bg-carbon text-lienzo"
            borderClass="border-lienzo/30"
            style={{
              '--ac-cta-shadow': CTA_SHADOWS.carbon.rest,
              '--ac-cta-shadow-hover': CTA_SHADOWS.carbon.hover,
            } as CSSProperties}
          />
        </div>
      </div>
    </FadeIn>
  );
};
