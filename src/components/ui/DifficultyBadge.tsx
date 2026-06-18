import React from 'react';
import { DIFF_COLORS } from '../../config/constants';

interface DifficultyBadgeProps {
  difficulty: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const color = DIFF_COLORS[difficulty] ?? '#333';
  return (
    <span
      className="text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-1 rounded"
      style={{ color, backgroundColor: `${color}15` }}
    >
      {difficulty}
    </span>
  );
};
