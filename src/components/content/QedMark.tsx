import React from 'react';
import { useI18n } from '@/i18n';

/**
 * Marca de fin de demostración (Q.E.D. / ∎).
 * Cuadrado tipográfico alineado a la derecha, coherente con la paleta Arts & Crafts.
 */
export const QedMark: React.FC = () => {
  const { t } = useI18n();

  return (
    <div
      className="demonstration-qed mt-8 mb-2 flex justify-end"
      aria-label={t('accessibility', 'endOfProof')}
    >
      <span
        className="page-accent-border page-accent-bg inline-block h-[1.05em] w-[1.05em] border-2"
        aria-hidden="true"
      />
    </div>
  );
};

QedMark.displayName = 'QedMark';
