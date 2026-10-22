import React from 'react';
import { VocabSection, VocabEntry } from '@/components/ui/Vocabulary';
import type { UseCase } from '@/data/content/types';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';

interface AplicacionesSectionProps {
  useCases: UseCase[];
  heading?: React.ReactNode;
}

/** Casos de uso al pie de la página; el dominio va en versalitas junto a la voz. */
export const AplicacionesSection: React.FC<AplicacionesSectionProps> = ({ useCases, heading }) => {
  const { t, getLocalizedPath } = useI18n();
  const { isRead } = useProgressStore();
  if (useCases.length === 0) return null;

  return (
    <VocabSection id="aplicaciones" heading={heading ?? t('common', 'realWorldApplications')} accentType="caso-de-uso" count={useCases.length}>
      {useCases.map(uc => (
        <VocabEntry
          key={uc.slug}
          href={getLocalizedPath(`/caso/${uc.slug}`)}
          title={uc.title}
          description={uc.description}
          read={isRead(uc.id)}
          aside={uc.domain?.toLowerCase()}
        />
      ))}
    </VocabSection>
  );
};
