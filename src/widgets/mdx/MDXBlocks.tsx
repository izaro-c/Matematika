import React, { useState, useRef, useEffect } from 'react';
import { ProofStep } from "@/widgets/content/ProofStep";
import { DemonstrationSection } from "@/widgets/content/DemonstrationSection";
import { ProofStepExpander } from "@/widgets/content/ProofStepExpander";
import { Concept } from "@/features/glossary/ui/Concept";
import { Paso } from '@/features/exercises/ui/Paso';
import { PasoEjercicio } from '@/features/exercises/ui/PasoEjercicio';
import { Solucion } from '@/features/exercises/ui/Solucion';
import { Resolucion } from '@/features/exercises/ui/Resolucion';
import { Pregunta } from '@/features/exercises/ui/Pregunta';
import { Hueco } from '@/features/exercises/ui/Hueco';
import { ErrorComun } from '@/features/exercises/ui/ErrorComun';
import { Apoyo } from '@/features/exercises/ui/Apoyo';
import { Emparejar } from '@/features/exercises/ui/Emparejar';
import { CanvasInteractivo } from '@/features/exercises/ui/CanvasInteractivo';
import { Clasificador } from '@/features/exercises/ui/Clasificador';
import { Ordenacion } from '@/features/exercises/ui/Ordenacion';
import { MatrizInteractiva } from '@/features/exercises/ui/MatrizInteractiva';
import { DeslizadorEnLine, DynamicValue } from '@/features/exercises/ui/DeslizadorEnLine';
import { HighlightLink } from '@/features/lessons/ui/HighlightLink';
import { ConceptLink } from "@/features/glossary/ui/ConceptLink";
import { RefLink } from "@/features/glossary/ui/RefLink";
import { GlossaryLink } from '@/shared/ui/GlossaryLink';
import { VisualBind, InteractiveElement } from '@/shared/ui/VisualBind';
import { Link } from 'wouter';

// === SISTEMA DE DISEÑO ARTS & CRAFTS (IMPRESIÓN CLÁSICA) ===

/**
 * Título de bloque para secciones principales dentro de MDX.
 */
interface BlockTitleProps {
  subtitle?: string;
  children: React.ReactNode;
}

export const BlockTitle: React.FC<BlockTitleProps> = ({ subtitle, children }) => {
  return (
    <div className="my-16 text-center">
      {subtitle && <div className="page-accent-text text-[10px] uppercase tracking-[0.3em] font-sans mb-3 font-bold">{subtitle}</div>}
      <h2 className="text-4xl md:text-5xl font-serif text-carbon border-b border-carbon/10 pb-6 inline-block px-12" style={{ fontVariant: 'small-caps' }}>
        {children}
      </h2>
    </div>
  );
};

/**
 * Separador visual con estilo de adorno de imprenta clásica.
 */
export const OrnamentalDivider: React.FC = () => (
  <div className="w-full flex items-center justify-center py-16 opacity-30">
    <div className="w-32 h-px bg-carbon"></div>
  </div>
);

/**
 * Contenedor estilizado para fórmulas matemáticas destacadas.
 * Renderiza un recuadro con tipografía serif.
 */
interface FormulaProps {
  title?: string, children: React.ReactNode;
}
export const Formula: React.FC<FormulaProps> = ({ title, children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // use Math.ceil to avoid sub-pixel rounding errors keeping it stuck
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    // Re-check after a small delay to ensure rendering fonts is done
    const timeoutId = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkScroll);
    };
  }, [children]);

  return (
    <div className="relative my-10 w-full group">
      {/* Indicador Arts & Crafts izquierdo */}
      <div className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-lienzo via-lienzo/80 to-transparent z-10 pointer-events-none transition-opacity duration-500 flex items-center justify-start pl-3 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}>
        <div className="page-accent-text opacity-80 text-2xl font-serif animate-pulse select-none drop-shadow-sm">
          ❧
        </div>
      </div>
      
      {/* Indicador Arts & Crafts derecho */}
      <div className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-lienzo via-lienzo/80 to-transparent z-10 pointer-events-none transition-opacity duration-500 flex items-center justify-end pr-3 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}>
        <div className="page-accent-text opacity-80 text-2xl font-serif animate-pulse select-none drop-shadow-sm">
          ☙
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="py-8 px-6 w-full border border-carbon/20 bg-carbon/[0.02] overflow-x-auto overflow-y-hidden formula-scrollbar"
      >
        <div className="flex flex-col items-center justify-center min-w-max mx-auto gap-4 text-xl font-serif">
          {title && <span className="italic block mb-2 text-sm text-carbon/50">{title}</span>}
          {children}
        </div>
      </div>
      
      <style>{`
        .formula-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .formula-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .formula-scrollbar::-webkit-scrollbar-thumb {
          background-color: color-mix(in srgb, var(--page-accent, var(--theme-terracota)) 20%, transparent);
          border-radius: 10px;
        }
        .formula-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: color-mix(in srgb, var(--page-accent, var(--theme-terracota)) 60%, transparent);
        }
      `}</style>
    </div>
  );
};

/**
 * Agrupa múltiples ecuaciones en línea y las centra horizontalmente.
 */
interface EquationRowProps {
  children: React.ReactNode;
}
export const EquationRow: React.FC<EquationRowProps> = ({ children }) => (
  <div className="flex items-center justify-center gap-2 flex-wrap w-full">
    {children}
  </div>
);

interface DefinicionProps {
  title?: string, children: React.ReactNode;
}
export const Definicion: React.FC<DefinicionProps> = ({ title = "Definición", children }) => (
  <div className="page-accent-border my-12 py-6 border-t-4 border-b font-serif">
    <div className="page-accent-text font-bold tracking-widest uppercase text-sm mb-4">
      {title}
    </div>
    <div className="italic leading-relaxed text-carbon/90 text-justify">
      {children}
    </div>
  </div>
);

interface DemostracionProps {
  children: React.ReactNode;
}
export const Demostracion: React.FC<DemostracionProps> = ({ children }) => (
  <div className="page-accent-border my-10 pl-8 font-serif text-justify text-carbon/90 border-l-2 relative">
    <span className="page-accent-text italic font-bold mr-2">Demostración.</span>
    <div className="inline">
      {children}
    </div>
    <div className="text-right mt-4 text-carbon font-bold text-lg opacity-80">
      $\blacksquare$
    </div>
  </div>
);

interface NotaProps {
  children: React.ReactNode;
}
export const Nota: React.FC<NotaProps> = ({ children }) => (
  <div className="page-accent-border my-8 pl-6 border-l-[1px] font-serif text-sm text-carbon/70 text-justify">
    <span className="page-accent-text font-bold uppercase tracking-wider mr-2 text-xs">Nota.</span>
    {children}
  </div>
);

interface CitaProps {
  author?: string, children: React.ReactNode;
}
export const Cita: React.FC<CitaProps> = ({ author, children }) => (
  <blockquote className="my-12 mx-12 font-serif italic text-lg text-carbon/80 text-center leading-loose">
    {children}
    {author && <div className="text-sm font-bold mt-4 not-italic font-sans text-carbon/60 uppercase tracking-widest">— {author}</div>}
  </blockquote>
);

interface CorolarioProps {
  children: React.ReactNode;
}
export const Corolario: React.FC<CorolarioProps> = ({ children }) => (
  <div className="page-accent-border my-12 py-6 border-t-2 border-b font-serif">
    <div className="page-accent-text font-bold tracking-widest uppercase text-sm mb-4">
      Corolario
    </div>
    <div className="leading-relaxed text-carbon/90 text-justify">
      {children}
    </div>
  </div>
);

export const Separador: React.FC = () => (
  <div className="flex justify-center items-center my-16 opacity-30 hover:opacity-60 transition-opacity duration-500 select-none">
    <div className="w-24 border-t border-carbon"></div>
    <div className="page-accent-text mx-6 text-xs scale-animation">✦</div>
    <div className="w-24 border-t border-carbon"></div>
  </div>
);

interface CapitularProps {
  letra: string;
}
export const Capitular: React.FC<CapitularProps> = ({ letra }) => (
  <span className="page-accent-text float-left text-7xl font-serif font-bold pr-3 pl-1 leading-[0.7] mt-2 mb-[-8px] select-none pointer-events-none drop-shadow-sm">
    {letra}
  </span>
);

/**
 * Diccionario central de componentes React disponibles globalmente
 * dentro de cualquier archivo `.mdx` sin necesidad de ser importados.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const MDXComponents = {
  Formula,
  Definicion,
  Demostracion,
  Nota,
  Cita,
  Corolario,
  Separador,
  Capitular,
  DemonstrationSection,
  ProofStep,
  ProofStepExpander,
  Concept,
  Paso,
  PasoEjercicio,
  Solucion,
  Resolucion,
  Pregunta,
  Hueco,
  ErrorComun,
  Apoyo,
  Emparejar,
  CanvasInteractivo,
  Clasificador,
  Ordenacion,
  MatrizInteractiva,
  DeslizadorEnLine,
  DynamicValue,
  HighlightLink,
  ConceptLink,
  RefLink,
  GlossaryLink,
  VisualBind,
  EquationRow,
  InteractiveElement,
  a: (props: React.ComponentProps<'a'>) => {
    if (props.href?.startsWith('/')) {
      return (
        <Link href={props.href}>
          <a className="page-accent-link font-bold border-b-2 transition-all cursor-pointer px-[2px] rounded-none">
            {props.children}
          </a>
        </Link>
      );
    }
    return <a className="page-accent-link font-bold border-b-2 transition-all cursor-pointer px-[2px] rounded-none" target="_blank" rel="noopener noreferrer" {...props} />;
  },
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="page-accent-text text-3xl font-serif mt-12 mb-6 pb-2 border-b border-carbon/10 italic" {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <h4 className="text-xl font-serif text-carbon mt-8 mb-4 font-bold" {...props} />,
};
