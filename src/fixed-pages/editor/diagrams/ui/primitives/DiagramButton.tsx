import React from 'react';

export type DiagramButtonVariant = 'primary' | 'danger' | 'warning' | 'success' | 'ghost';

export interface DiagramButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DiagramButtonVariant;
  fullWidth?: boolean;
}

const variantClassNames: Record<DiagramButtonVariant, string> = {
  primary: 'px-3.5 py-1.5 rounded-xl bg-pavo text-xs font-bold uppercase tracking-wider text-lienzo hover:bg-pavo/90 transition-colors duration-200 shadow-2xs cursor-pointer focus-visible:outline-2 focus-visible:outline-salvia disabled:cursor-not-allowed disabled:opacity-35',
  danger: 'px-3.5 py-1.5 rounded-xl border border-granada/30 bg-lienzo text-xs font-bold uppercase tracking-wider text-granada hover:bg-granada/10 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-salvia disabled:cursor-not-allowed disabled:opacity-35',
  warning: 'px-3.5 py-1.5 rounded-xl border border-ocre/40 bg-lienzo text-xs font-bold uppercase tracking-wider text-ocre hover:bg-ocre/10 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-salvia disabled:cursor-not-allowed disabled:opacity-35',
  success: 'px-3.5 py-1.5 rounded-xl bg-salvia text-xs font-bold uppercase tracking-wider text-lienzo hover:bg-salvia/90 transition-colors duration-200 shadow-2xs cursor-pointer focus-visible:outline-2 focus-visible:outline-salvia disabled:cursor-not-allowed disabled:opacity-35',
  ghost: 'px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-granada/80 hover:text-granada hover:bg-granada/10 transition-colors duration-200 cursor-pointer',
};

export const DiagramButton: React.FC<DiagramButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  children,
  ...props
}) => (
  <button
    type={type}
    className={[variantClassNames[variant], fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ')}
    {...props}
  >
    {children}
  </button>
);

export default DiagramButton;
