import React from 'react';
import { DIFF_COLORS } from '@/shared/lib/constants';

interface DifficultyBadgeProps {
  difficulty: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const color = DIFF_COLORS[difficulty] ?? 'var(--theme-carbon)';

  return (
    <span
      className="ac-pill ac-pill-accent"
      style={{ ['--pill-accent' as string]: color }}
    >
      <span className="ac-pill-ornament" aria-hidden>◆</span>
      {difficulty}
    </span>
  );
};
