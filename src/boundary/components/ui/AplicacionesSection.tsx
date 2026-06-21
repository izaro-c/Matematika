import React from 'react';
import { SectionTitle } from '@/boundary/components/ui/SectionTitle';
import { ContentCard } from '@/boundary/components/ui/ContentCard';
import { DOMAIN_ICONS } from '@/database/config/constants';
import type { UseCase } from '@/database/dao/content/types';

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
          <ContentCard
            key={uc.slug}
            href={`/caso/${uc.slug}`}
            title={uc.title}
            description={uc.description}
            type="caso-de-uso"
            domain={uc.domain}
            domainIcon={uc.domain ? DOMAIN_ICONS[uc.domain.toLowerCase()] : undefined}
            actionLabel="Explorar Caso"
          />
        ))}
      </div>
    </div>
  );
};
