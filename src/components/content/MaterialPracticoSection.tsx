import React from 'react';
import { VocabSection, VocabEntry } from '@/components/ui/Vocabulary';
import type { Example, Exercise } from '@/data/content/types';
import { getContentTypeLabel } from '@/lib/theme/constants';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { useI18n } from '@/i18n';

interface MaterialPracticoSectionProps {
  examples: Example[];
  exercises: Exercise[];
}

/** Ejemplos y ejercicios al pie de la página, cada uno en su vocabulario y su color. */
export const MaterialPracticoSection: React.FC<MaterialPracticoSectionProps> = ({ examples, exercises }) => {
  const { lang, getLocalizedPath } = useI18n();
  const { isRead, isExerciseComplete } = useProgressStore();

  return (
    <>
      {examples.length > 0 && (
        <VocabSection id="ejemplos" heading={getContentTypeLabel('ejemplo', 'plural', lang)} accentType="ejemplo" count={examples.length}>
          {examples.map(ex => (
            <VocabEntry
              key={ex.slug}
              href={getLocalizedPath(`/ejemplo/${ex.id}`)}
              title={ex.title}
              description={ex.description}
              read={isRead(ex.id)}
            />
          ))}
        </VocabSection>
      )}
      {exercises.length > 0 && (
        <VocabSection id="ejercicios" heading={getContentTypeLabel('ejercicio', 'plural', lang)} accentType="ejercicio" count={exercises.length}>
          {exercises.map(ex => (
            <VocabEntry
              key={ex.slug}
              href={getLocalizedPath(`/ejercicio/${ex.id}`)}
              title={ex.title}
              description={ex.description}
              read={isExerciseComplete(ex.id) || isRead(ex.id)}
            />
          ))}
        </VocabSection>
      )}
    </>
  );
};
