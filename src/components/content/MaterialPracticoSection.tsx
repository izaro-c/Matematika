import React from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SubtleSeparator } from '@/components/ui/SubtleSeparator';
import { ContentCard } from '@/components/ui/ContentCard';
import type { Example, Exercise } from '@/data/content/types';
import { useI18n } from '@/i18n';

interface MaterialPracticoSectionProps {
  examples: Example[];
  exercises: Exercise[];
}

export const MaterialPracticoSection: React.FC<MaterialPracticoSectionProps> = ({ examples, exercises }) => {
  const hasContent = examples.length > 0 || exercises.length > 0;
  const { t } = useI18n();
  if (!hasContent) return null;

  return (
    <section className="my-24">
      <SubtleSeparator />
      <SectionTitle>Material Práctico</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map(ex => (
          <ContentCard
            key={ex.slug}
            href={`/ejemplo/${ex.id}`}
            title={ex.title}
            description={ex.description}
            type="ejemplo"
            actionLabel={t('content', 'seeExample')}
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
            actionLabel={t('content', 'practice')}
          />
        ))}
      </div>
    </section>
  );
};
