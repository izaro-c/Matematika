import React from 'react';
import { publicAsset } from '@/shared/lib/routeHelper';

interface ProofStepNumberBadgeProps {
  number: number;
  size?: 'header' | 'inline';
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
} as const;

/**
 * Cuadrado numerado compartido por ProofStep y ProofStepLink.
 */
export const ProofStepNumberBadge: React.FC<ProofStepNumberBadgeProps> = ({
  number,
  size = 'header',
  className = '',
}) => {
  const styles = sizeClasses[size];

  return (
    <span
      className={`relative inline-flex items-center justify-center border border-carbon overflow-hidden rounded-sm bg-lienzo shrink-0 ${styles.box} ${className}`}
      aria-hidden
    >
      <span
        className="absolute inset-0 opacity-70 mix-blend-multiply"
        style={{
          backgroundImage: `url(${publicAsset('/images/bg-arts-crafts-2.png')})`,
          backgroundSize: '200%',
          backgroundPosition: 'center',
        }}
      />
      <span className={`absolute ${styles.inset} border border-carbon/20 pointer-events-none`} />
      <span
        className={`page-accent-text font-serif italic font-bold z-10 leading-none ${styles.text}`}
        style={{
          fontFamily: 'Georgia, "Playfair Display", serif',
          textShadow: '1px 1px 0px var(--theme-lienzo), -1px -1px 0px var(--theme-lienzo), 1px -1px 0px var(--theme-lienzo), -1px 1px 0px var(--theme-lienzo)',
        }}
      >
        {number}
      </span>
    </span>
  );
};

ProofStepNumberBadge.displayName = 'ProofStepNumberBadge';
