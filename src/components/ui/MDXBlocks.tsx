import React from 'react';
import { MedievalStep } from "../content/MedievalStep";
import { DemonstrationSection } from "../content/DemonstrationSection";
import { Concept } from "../content/Concept";
import { Paso } from '../exercises/Paso';
import { Solucion } from '../exercises/Solucion';
import { Pregunta } from '../exercises/Pregunta';
import { Hueco } from '../exercises/Hueco';
import { ErrorComun } from '../exercises/ErrorComun';
import { Emparejar } from '../exercises/Emparejar';
import { CanvasInteractivo } from '../exercises/CanvasInteractivo';
import { Clasificador } from '../exercises/Clasificador';
import { Ordenacion } from '../exercises/Ordenacion';
import { MatrizInteractiva } from '../exercises/MatrizInteractiva';
import { DeslizadorEnLine, DynamicValue } from '../exercises/DeslizadorEnLine';
import { HighlightLink } from './HighlightLink';
import { ConceptLink } from "./ConceptLink";
import { RefLink } from "./RefLink";
import { GlossaryLink } from './GlossaryLink';
import { VisualBind, InteractiveElement } from './VisualBind';
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
      {subtitle && <div className="text-[10px] uppercase tracking-[0.3em] font-sans text-terracota mb-3 font-bold">{subtitle}</div>}
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
export const Formula: React.FC<FormulaProps> = ({ title, children }) => (
  <div className="my-10 py-8 px-6 w-full border border-carbon/20 bg-carbon/[0.02] overflow-x-auto overflow-y-hidden">
    <div className="flex flex-col items-center justify-center min-w-max mx-auto gap-4 text-xl font-serif">
      {title && <span className="italic block mb-2 text-sm text-carbon/50">{title}</span>}
      {children}
    </div>
  </div>
);

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
  <div className="my-12 py-6 border-t-4 border-b border-carbon/90 font-serif">
    <div className="font-bold text-carbon tracking-widest uppercase text-sm mb-4">
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
  <div className="my-10 pl-8 font-serif text-justify text-carbon/90 border-l-2 border-carbon/15 relative">
    <span className="italic font-bold mr-2 text-carbon">Demostración.</span>
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
  <div className="my-8 pl-6 border-l-[1px] border-carbon/30 font-serif text-sm text-carbon/70 text-justify">
    <span className="font-bold uppercase tracking-wider mr-2 text-xs">Nota.</span>
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
  <div className="my-12 py-6 border-t-2 border-b border-carbon/70 font-serif">
    <div className="font-bold text-carbon/80 tracking-widest uppercase text-sm mb-4">
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
    <div className="mx-6 text-carbon text-xs scale-animation">✦</div>
    <div className="w-24 border-t border-carbon"></div>
  </div>
);

interface CapitularProps {
  letra: string;
}
export const Capitular: React.FC<CapitularProps> = ({ letra }) => (
  <span className="float-left text-7xl font-serif text-terracota font-bold pr-3 pl-1 leading-[0.7] mt-2 mb-[-8px] select-none pointer-events-none drop-shadow-sm">
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
  MedievalStep,
  Concept,
  Paso,
  Solucion,
  Pregunta,
  Hueco,
  ErrorComun,
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
          <a className="font-bold text-terracota border-b-2 border-terracota/40 hover:border-terracota hover:bg-terracota/10 transition-all cursor-pointer px-[2px] rounded-none">
            {props.children}
          </a>
        </Link>
      );
    }
    return <a className="font-bold text-terracota border-b-2 border-terracota/40 hover:border-terracota hover:bg-terracota/10 transition-all cursor-pointer px-[2px] rounded-none" target="_blank" rel="noopener noreferrer" {...props} />;
  },
  h3: (props: React.ComponentProps<'h3'>) => <h3 className="text-3xl font-serif text-terracota mt-12 mb-6 pb-2 border-b border-carbon/10 italic" {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <h4 className="text-xl font-serif text-carbon mt-8 mb-4 font-bold" {...props} />,
};
