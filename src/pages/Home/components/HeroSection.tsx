import { Link } from 'wouter';
import { Logo } from "../../../components/ui/Logo";
import { FadeIn } from "../../../components/ui/FadeIn";
import { SITE_TAGLINE } from '../../../config/constants';

/**
 * Componente de la sección principal (Hero) de la página de inicio.
 * 
 * Muestra el título principal ("Matematika"), el lema del proyecto,
 * y los accesos rápidos a las tres áreas principales: 
 * Plan de Estudio, Métodos de Prueba y Mapa Interactivo.
 * 
 * @returns {JSX.Element} El encabezado Hero renderizado.
 */
export const HeroSection = () => {
  return (
    <FadeIn as="header" className="relative w-full overflow-hidden border-b border-carbon/15">
      <div className="relative z-10 max-w-5xl mx-auto px-8 pt-24 pb-20 flex flex-col items-center text-center">
        {/* Logo + título en inline */}
        <div className="flex items-end gap-3 mb-6">
          <Logo className="w-24 h-24 md:w-[7.5rem] md:h-[7.5rem] opacity-90 mb-1" />
          <h1
            className="text-[4.5rem] md:text-[7rem] text-carbon tracking-tight leading-none"
            style={{ fontVariant: 'small-caps' }}
          >
            atematika
          </h1>
        </div>

        {/* Lema */}
        <p className="text-lg md:text-xl text-carbon/60 italic max-w-xl leading-relaxed mb-10">
          {SITE_TAGLINE}
        </p>

        {/* Separador ornamental */}
        <div className="flex items-center gap-4 w-full max-w-xs opacity-30">
          <div className="flex-1 h-px bg-carbon" />
          <span className="text-carbon text-xs">✦</span>
          <div className="flex-1 h-px bg-carbon" />
        </div>

        {/* Accesos rápidos */}
        <div className="mt-12 flex flex-col sm:flex-row flex-wrap items-stretch gap-6 justify-center w-full max-w-6xl mx-auto px-4">
          <Link href="/plan/selectividad">
            <a className="group relative flex-1 bg-terracota text-lienzo px-6 py-8 flex flex-col items-center justify-center overflow-hidden border border-carbon/30 outline outline-1 outline-carbon/15 outline-offset-[-6px] shadow-[0_10px_30px_-10px_rgba(74,59,50,0.3)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(74,59,50,0.5)] rounded-[2px]">
              <div className="absolute inset-[6px] border border-lienzo/20 pointer-events-none transition-all duration-500 group-hover:inset-[8px] group-hover:border-lienzo/40" />
              <div className="absolute inset-[10px] border border-lienzo/10 pointer-events-none transition-all duration-500 group-hover:inset-[12px] group-hover:border-lienzo/20" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-80 mb-2">Plan de Estudio</span>
              <span className="text-2xl font-bold" style={{ fontVariant: 'small-caps' }}>Selectividad</span>
              <span className="mt-3 text-xs font-sans tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">Acceder al Temario →</span>
            </a>
          </Link>

          <Link href="/metodos">
            <a className="group relative flex-1 bg-salvia text-lienzo px-6 py-8 flex flex-col items-center justify-center overflow-hidden border border-carbon/30 outline outline-1 outline-carbon/15 outline-offset-[-6px] shadow-[0_10px_30px_-10px_rgba(60,80,60,0.3)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(60,80,60,0.5)] rounded-[2px]">
              <div className="absolute inset-[6px] border border-lienzo/20 pointer-events-none transition-all duration-500 group-hover:inset-[8px] group-hover:border-lienzo/40" />
              <div className="absolute inset-[10px] border border-lienzo/10 pointer-events-none transition-all duration-500 group-hover:inset-[12px] group-hover:border-lienzo/20" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-80 mb-2">Demostraciones lógicas</span>
              <span className="text-2xl font-bold" style={{ fontVariant: 'small-caps' }}>Métodos de Prueba</span>
              <span className="mt-3 text-xs font-sans tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">Explorar →</span>
            </a>
          </Link>

          <Link href="/grafo">
            <a className="group relative flex-1 bg-carbon text-lienzo px-6 py-8 flex flex-col items-center justify-center overflow-hidden border border-lienzo/30 outline outline-1 outline-lienzo/15 outline-offset-[-6px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] rounded-[2px]">
              <div className="absolute inset-[6px] border border-lienzo/20 pointer-events-none transition-all duration-500 group-hover:inset-[8px] group-hover:border-lienzo/40" />
              <div className="absolute inset-[10px] border border-lienzo/10 pointer-events-none transition-all duration-500 group-hover:inset-[12px] group-hover:border-lienzo/20" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-80 mb-2">Mapa Interactivo</span>
              <span className="text-2xl font-bold" style={{ fontVariant: 'small-caps' }}>Grafo Visual</span>
              <span className="mt-3 text-xs font-sans tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">Ver Dependencias →</span>
            </a>
          </Link>

          <Link href="/axiomas">
            <a className="group relative flex-1 bg-pizarra text-lienzo px-6 py-8 flex flex-col items-center justify-center overflow-hidden border border-lienzo/30 outline outline-1 outline-lienzo/15 outline-offset-[-6px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] rounded-[2px]">
              <div className="absolute inset-[6px] border border-lienzo/20 pointer-events-none transition-all duration-500 group-hover:inset-[8px] group-hover:border-lienzo/40" />
              <div className="absolute inset-[10px] border border-lienzo/10 pointer-events-none transition-all duration-500 group-hover:inset-[12px] group-hover:border-lienzo/20" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-80 mb-2">Axiomas</span>
              <span className="text-2xl font-bold" style={{ fontVariant: 'small-caps' }}>Axiomas</span>
              <span className="mt-3 text-xs font-sans tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">Ver Relaciones →</span>
            </a>
          </Link>
        </div>
      </div>
    </FadeIn>
  );
};
