import React from 'react';
import { Link } from 'wouter';
import { SectionTitle } from './SectionTitle';
import { EmptyState } from './EmptyState';
import type { Example, Exercise } from '../../store/content/types';

interface MaterialPracticoSectionProps {
  examples: Example[];
  exercises: Exercise[];
}

export const MaterialPracticoSection: React.FC<MaterialPracticoSectionProps> = ({ examples, exercises }) => {
  const hasContent = examples.length > 0 || exercises.length > 0;

  return (
    <div className="mb-24 mt-24">
      <SectionTitle>Material Práctico</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map(ex => (
          <Link key={ex.slug} href={`/ejemplo/${ex.id}`}>
            <a className="flex flex-col p-6 border border-carbon/20 bg-carbon/5 hover:border-terracota hover:shadow-md transition-all group">
              <span className="text-[10px] uppercase font-sans tracking-widest text-carbon/40 mb-2">Ejemplo Resuelto</span>
              <h3 className="font-bold text-lg group-hover:text-terracota transition-colors">{ex.title}</h3>
              {ex.description && <p className="text-sm opacity-70 mt-2 font-sans">{ex.description}</p>}
              <span className="text-xs font-sans tracking-widest uppercase text-terracota opacity-60 group-hover:opacity-100 mt-4 transition-opacity">
                Ver Ejemplo &rarr;
              </span>
            </a>
          </Link>
        ))}
        {exercises.map(ex => (
          <Link key={ex.slug} href={`/ejercicio/${ex.id}`}>
            <a className="flex flex-col p-6 border border-carbon/20 bg-carbon/5 hover:border-salvia hover:shadow-md transition-all group">
              <span className="text-[10px] uppercase font-sans tracking-widest text-carbon/40 mb-2">Ejercicio Propuesto</span>
              <h3 className="font-bold text-lg group-hover:text-salvia transition-colors">{ex.title}</h3>
              {ex.description && <p className="text-sm opacity-70 mt-2 font-sans">{ex.description}</p>}
              <span className="text-xs font-sans tracking-widest uppercase text-salvia opacity-60 group-hover:opacity-100 mt-4 transition-opacity">
                Practicar &rarr;
              </span>
            </a>
          </Link>
        ))}
      </div>
      {!hasContent && (
        <EmptyState message="No hay ejemplos ni ejercicios asociados a este concepto." icon="▤" />
      )}
    </div>
  );
};
