import React from 'react';
import { DIFF_COLORS } from '@/lib/theme/constants';
import { useI18n } from '@/i18n';

interface DifficultyBadgeProps {
  difficulty: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const { currentLanguage } = useI18n();
  const normalizedKey = difficulty
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const color =
    DIFF_COLORS[difficulty] ??
    DIFF_COLORS[normalizedKey] ??
    'var(--theme-carbon)';

  const dict = currentLanguage.dictionary.metadata.difficulties as Record<string, string>;
  const label = dict[normalizedKey] || dict[difficulty.toLowerCase()] || difficulty;

  return (
    <span
      className="ac-pill ac-pill-accent"
      style={{ ['--pill-accent' as string]: color }}
    >
      <span className="ac-pill-ornament" aria-hidden>◆</span>
      {label}
    </span>
  );
};
