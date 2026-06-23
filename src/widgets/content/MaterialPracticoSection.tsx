import React from 'react';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { ContentCard } from '@/shared/ui/ContentCard';
import type { Example, Exercise } from '@/entities/content/types';

interface MaterialPracticoSectionProps {
  examples: Example[];
  exercises: Exercise[];
}

export const MaterialPracticoSection: React.FC<MaterialPracticoSectionProps> = ({ examples, exercises }) => {
  const hasContent = examples.length > 0 || exercises.length > 0;
  if (!hasContent) return null;

  return (
    <div className="mb-24 mt-24">
      <SectionTitle>Material Práctico</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map(ex => (
          <ContentCard
            key={ex.slug}
            href={`/ejemplo/${ex.id}`}
            title={ex.title}
            description={ex.description}
            type="ejemplo"
            actionLabel="Ver Ejemplo"
          />
        ))}
        {exercises.map(ex => (
          <ContentCard
            key={ex.slug}
            href={`/ejercicio/${ex.id}`}
            title={ex.title}
            description={ex.description}
            type="ejercicio"
            accent="musgo"
            actionLabel="Practicar"
          />
        ))}
      </div>
    </div>
  );
};
