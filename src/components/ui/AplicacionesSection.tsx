import React from 'react';
import { Link } from 'wouter';
import { SectionTitle } from './SectionTitle';
import type { UseCase } from '../../store/content/types';

interface AplicacionesSectionProps {
  useCases: UseCase[];
}

export const AplicacionesSection: React.FC<AplicacionesSectionProps> = ({ useCases }) => {
  if (useCases.length === 0) return null;

  return (
    <div className="mb-24 mt-24">
      <SectionTitle>Aplicaciones en el Mundo Real</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {useCases.map(uc => (
          <Link key={uc.slug} href={`/caso/${uc.slug}`}>
            <a className="flex flex-col p-6 border border-carbon/20 bg-carbon/5 hover:border-terracota hover:shadow-md transition-all group">
              <span className="text-[10px] uppercase font-sans tracking-widest text-carbon/40 mb-2">
                {uc.domain || 'Aplicación Práctica'}
              </span>
              <h3 className="font-bold text-lg group-hover:text-terracota transition-colors">{uc.title}</h3>
              {uc.description && <p className="text-sm opacity-70 mt-2 font-sans">{uc.description}</p>}
              <span className="text-xs font-sans tracking-widest uppercase text-terracota opacity-60 group-hover:opacity-100 mt-4 transition-opacity">
                Explorar Caso &rarr;
              </span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};
