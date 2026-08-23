import React from 'react';
import { publicAsset } from '@/lib/routes';

interface ProofStepNumberBadgeProps {
  number?: number;
  icon?: React.ReactNode;
  size?: 'header' | 'inline' | 'compact';
  status?: 'default' | 'completed' | 'locked';
  className?: string;
}

const sizeClasses = {
  header: {
    box: 'w-12 h-12 min-w-[3rem] lg:w-16 lg:h-16 lg:min-w-[4rem]',
    text: 'text-2xl lg:text-4xl',
    inset: 'inset-1',
  },
  inline: {
    box: 'w-7 h-7 min-w-[1.75rem] lg:w-8 lg:h-8 lg:min-w-[2rem]',
    text: 'text-base lg:text-lg',
    inset: 'inset-0.5',
  },
  compact: {
    box: 'w-8 h-8 min-w-[2rem]',
    text: 'text-base font-bold',
    inset: 'inset-0.5',
  },
} as const;

const statusClasses = {
  default: {
    box: 'border-carbon bg-lienzo',
    innerBorder: 'border-carbon/20',
    text: 'page-accent-text',
  },
  completed: {
    box: 'border-musgo bg-lienzo shadow-[0_0_0_1px_rgba(var(--theme-musgo-rgb,100,140,110),0.3)]',
    innerBorder: 'border-musgo/30',
    text: 'text-musgo font-bold',
  },
  locked: {
    box: 'border-carbon/20 bg-lienzo opacity-40 grayscale',
    innerBorder: 'border-carbon/10',
    text: 'text-carbon/40',
  },
} as const;

/**
 * Cuadrado numerado o con estado compartido por ProofStep, ProofStepLink y ExerciseStep.
 */
export const ProofStepNumberBadge: React.FC<ProofStepNumberBadgeProps> = ({
  number,
  icon,
  size = 'header',
  status = 'default',
  className = '',
}) => {
  const styles = sizeClasses[size];
  const statusStyles = statusClasses[status];
  const isCompleted = status === 'completed';

  return (
    <span
      className={`relative inline-flex items-center justify-center border overflow-hidden rounded-sm shrink-0 transition-all duration-300 ${statusStyles.box} ${styles.box} ${className}`}
      aria-hidden
    >
      <span
        className="absolute inset-0 opacity-70 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url(${publicAsset('/images/bg-arts-crafts-2.png')})`,
          backgroundSize: '400%',
          backgroundPosition: 'center',
        }}
      />
      <span className={`absolute ${styles.inset} border pointer-events-none ${statusStyles.innerBorder}`} />
      
      {/* Sello o marca sutil de completado */}
      {isCompleted && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15 text-musgo select-none text-2xl font-serif">
          ✓
        </span>
      )}

      <span
        className={`font-serif italic font-bold z-10 leading-none ${statusStyles.text} ${styles.text}`}
        style={{
          fontFamily: 'var(--font-body-family)',
          textShadow: '1px 1px 0px var(--theme-lienzo), -1px -1px 0px var(--theme-lienzo), 1px -1px 0px var(--theme-lienzo), -1px 1px 0px var(--theme-lienzo)',
        }}
      >
        {icon !== undefined ? icon : isCompleted ? '✓' : number}
      </span>
    </span>
  );
};

ProofStepNumberBadge.displayName = 'ProofStepNumberBadge';
