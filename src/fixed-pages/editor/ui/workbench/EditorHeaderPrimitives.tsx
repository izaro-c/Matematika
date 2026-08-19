import React from 'react';
export { EditorLanguageBadges, type EditorLanguageBadgesProps, type EditorLanguageBadgeMode } from './EditorLanguageBadges';

export const HeaderContainer: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <header
    className={`grid h-14 w-full shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-carbon/15 bg-lienzo/95 px-3 sm:px-4 backdrop-blur-md z-30 transition-colors ${className}`}
    {...props}
  >
    {children}
  </header>
);

export const HeaderTitleInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = '',
  ...props
}) => (
  <input
    type="text"
    className={`h-8 w-28 sm:w-44 md:w-52 max-w-[220px] min-w-[70px] font-serif font-bold text-sm text-carbon bg-transparent hover:bg-carbon/5 focus:bg-lienzo focus:outline-hidden focus:ring-1 focus:ring-salvia rounded-lg px-2 py-0 transition-colors truncate leading-none ${className}`}
    {...props}
  />
);

export const HeaderBadge: React.FC<{
  variant?: 'subtle' | 'salvia' | 'ocre' | 'musgo' | 'granada';
  className?: string;
  children: React.ReactNode;
  title?: string;
}> = ({ variant = 'subtle', className = '', children, title }) => {
  const variantStyles = {
    subtle: 'text-carbon/50 bg-carbon/5 border-carbon/10 font-mono',
    salvia: 'text-salvia bg-salvia/15 border-salvia/30 font-bold uppercase tracking-wider',
    ocre: 'text-ocre bg-ocre/15 border-ocre/30 font-bold uppercase tracking-wider',
    musgo: 'text-musgo bg-musgo/15 border-musgo/30 font-bold uppercase tracking-wider',
    granada: 'text-granada bg-granada/10 border-granada/20 font-bold',
  };

  return (
    <span
      title={title}
      className={`inline-flex h-6 items-center justify-center rounded-md px-2 text-[10px] font-bold border truncate tracking-wider leading-none shrink-0 select-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const HeaderPillContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`inline-flex h-8 items-center gap-0.5 rounded-lg border border-carbon/15 bg-carbon/5 p-0.5 text-xs font-medium ${className}`}>
    {children}
  </div>
);

export const HeaderPillButton: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  disabled?: boolean;
}> = ({ active, onClick, children, title, className = '', disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`inline-flex h-7 items-center justify-center rounded-md px-2.5 text-xs font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed leading-none ${
      active
        ? 'bg-lienzo font-semibold text-carbon shadow-2xs'
        : 'text-carbon/70 hover:text-carbon hover:bg-carbon/5'
    } ${className}`}
  >
    {children}
  </button>
);

export const HeaderIconButton: React.FC<{
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  title?: string;
  active?: boolean;
  variant?: 'default' | 'danger';
  className?: string;
  'aria-label'?: string;
}> = ({ onClick, children, title, active, variant = 'default', className = '', 'aria-label': ariaLabel }) => {
  const baseStyles = 'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-carbon transition-all cursor-pointer shrink-0';
  const variantStyles = variant === 'danger'
    ? 'border-carbon/15 bg-lienzo hover:bg-crimson/10 hover:text-crimson hover:border-crimson/30 text-carbon/70 hover:text-crimson'
    : active
      ? 'border-salvia/40 bg-salvia/10 text-salvia font-semibold'
      : 'border-carbon/15 bg-lienzo hover:bg-carbon/5 text-carbon/70 hover:text-carbon';

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export type HeaderSaveState = {
  label: string;
  variant: 'pavo' | 'saved' | 'saving' | 'secondary';
  title: string;
  disabled: boolean;
  onSave?: () => void;
};

export const HeaderActionButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'saved' | 'saving' | 'pavo' | 'salvia';
  disabled?: boolean;
  title?: string;
  className?: string;
  'aria-label'?: string;
  'aria-busy'?: boolean;
}> = ({ onClick, children, variant = 'secondary', disabled, title, className = '', 'aria-label': ariaLabel, 'aria-busy': ariaBusy }) => {
  const variantStyles = {
    primary: 'bg-musgo text-lienzo hover:bg-musgo/90 shadow-2xs font-bold',
    pavo: 'bg-pavo text-lienzo hover:bg-pavo/90 shadow-2xs font-bold',
    salvia: 'bg-salvia text-lienzo hover:bg-salvia/90 shadow-2xs font-bold',
    saved: 'bg-musgo text-lienzo opacity-90 cursor-default font-bold',
    saving: 'bg-pizarra text-lienzo cursor-wait font-bold',
    secondary: 'border border-carbon/15 bg-lienzo text-carbon/80 hover:bg-carbon/5 hover:text-carbon font-semibold',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      aria-busy={ariaBusy}
      className={`inline-flex h-8 items-center justify-center rounded-lg px-3 text-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed leading-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
