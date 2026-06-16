import React from 'react';
import { MedievalStep } from '../MedievalStep';
import { Concept } from '../Concept';
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
import { ConceptLink } from './ConceptLink';
import { GlossaryLink } from './GlossaryLink';
import { VisualBind } from './VisualBind';
import { Link } from 'wouter';

// === SISTEMA DE DISEÑO ARTS & CRAFTS (IMPRESIÓN CLÁSICA) ===

export const BlockTitle: React.FC<{ children: React.ReactNode, subtitle?: string }> = ({ children, subtitle }) => (
  <div className="my-16 text-center">
    {subtitle && <div className="text-[10px] uppercase tracking-[0.3em] font-sans text-terracota mb-3 font-bold">{subtitle}</div>}
    <h2 className="text-4xl md:text-5xl font-serif text-carbon border-b border-carbon/10 pb-6 inline-block px-12" style={{ fontVariant: 'small-caps' }}>
      {children}
    </h2>
  </div>
);

export const OrnamentalDivider: React.FC = () => (
  <div className="w-full flex items-center justify-center py-16 opacity-30">
    <div className="w-32 h-px bg-carbon"></div>
  </div>
);

export const Formula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-10 py-8 px-6 w-full flex flex-col items-center justify-center gap-4 text-xl font-serif border border-carbon/20 bg-carbon/[0.02]">
    {children}
  </div>
);

export const Definicion: React.FC<{ title?: string, children: React.ReactNode }> = ({ title = "Definición", children }) => (
  <div className="my-12 py-6 border-t-4 border-b border-carbon/90 font-serif">
    <div className="font-bold text-carbon tracking-widest uppercase text-sm mb-4">
      {title}
    </div>
    <div className="italic leading-relaxed text-carbon/90 text-justify">
      {children}
    </div>
  </div>
);

export const Demostracion: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-8 pl-8 font-serif text-justify text-carbon/90">
    <span className="italic font-bold mr-2">Demostración.</span>
    {children}
    <div className="text-right mt-4 text-carbon font-bold">
      $\blacksquare$
    </div>
  </div>
);

export const Nota: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-8 pl-6 border-l-[1px] border-carbon/30 font-serif text-sm text-carbon/70 text-justify">
    <span className="font-bold uppercase tracking-wider mr-2 text-xs">Nota.</span>
    {children}
  </div>
);

export const Cita: React.FC<{ author?: string, children: React.ReactNode }> = ({ author, children }) => (
  <blockquote className="my-12 mx-12 font-serif italic text-lg text-carbon/80 text-center leading-loose">
    {children}
    {author && <div className="text-sm font-bold mt-4 not-italic font-sans text-carbon/60 uppercase tracking-widest">— {author}</div>}
  </blockquote>
);

export const Corolario: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
  <div className="flex justify-center items-center my-16 opacity-40">
    <div className="w-16 border-t border-carbon"></div>
    <div className="mx-4 text-carbon text-xs">✦</div>
    <div className="w-16 border-t border-carbon"></div>
  </div>
);

export const Capitular: React.FC<{ letra: string }> = ({ letra }) => (
  <span className="float-left text-7xl font-serif text-terracota font-bold pr-3 pl-1 leading-[0.7] mt-2 mb-[-8px] select-none pointer-events-none drop-shadow-sm">
    {letra}
  </span>
);

// Diccionario de componentes para MDXProvider
export const MDXBlocks = {
  Formula,
  Definicion,
  Demostracion,
  Nota,
  Cita,
  Corolario,
  Separador,
  Capitular,
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
  GlossaryLink,
  VisualBind,
  a: (props: any) => {
    if (props.href?.startsWith('/')) {
      return (
        <Link href={props.href}>
          <a className="font-bold text-terracota border-b-2 border-terracota/40 hover:border-terracota hover:bg-terracota/10 transition-all cursor-pointer px-[2px] rounded-sm">
            {props.children}
          </a>
        </Link>
      );
    }
    return <a className="font-bold text-terracota border-b-2 border-terracota/40 hover:border-terracota hover:bg-terracota/10 transition-all cursor-pointer px-[2px] rounded-sm" target="_blank" rel="noopener noreferrer" {...props} />;
  },
  h3: (props: any) => <h3 className="text-3xl font-serif text-terracota mt-12 mb-6 pb-2 border-b border-carbon/10 italic" {...props} />,
  h4: (props: any) => <h4 className="text-xl font-serif text-carbon mt-8 mb-4 font-bold" {...props} />,
};
