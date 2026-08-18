import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SubtleSeparator } from '@/components/ui/SubtleSeparator';
import { ContentCard } from '@/components/ui/ContentCard';
import { DOMAIN_ICONS } from '@/lib/theme/constants';
import type { UseCase } from '@/data/content/types';
import { useI18n } from '@/i18n';

interface AplicacionesSectionProps {
  useCases: UseCase[];
}

export const AplicacionesSection: React.FC<AplicacionesSectionProps> = ({ useCases }) => {
  const { t } = useI18n();
  if (useCases.length === 0) return null;

  return (
    <section className="my-24">
      <SubtleSeparator />
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
            actionLabel={t('content', 'exploreCase')}
          />
        ))}
      </div>
    </section>
  );
};
